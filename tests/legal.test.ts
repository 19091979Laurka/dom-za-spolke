import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diagnoseArt116, emptyArt116Answers, art118Deadline, validateArt116Step, resultPlainText } from '../src/lib/art116';
import { diagnoseLimitation, emptyLicznikInput, suggestPaymentDue, licznikPlainText } from '../src/lib/przedawnienie';
import { formatIsoLocal, parseIsoDate } from '../src/lib/dates';
import { firmMailto } from '../src/lib/firm';
const now = new Date(2026,8,12);
test('mailto percent-encodes spaces (no "+"), per RFC 6068',()=>{
 const m=firmMailto('Dom za spółkę — test','Imię i nazwisko: Jan Kowalski\nTelefon: 500');
 assert.ok(!m.includes('+'));
 assert.ok(m.includes('%20'));
 assert.match(m,/^mailto:[^?]+\?subject=/);
});
const base = {...emptyArt116Answers(), companyForm:'spzoo', tenureStart:'2020-01-01', arrearKind:'vat', paymentDue:'2021-02-25', specialCase:'no', enforcementFruitless:'yes', proceeding116:'no', decisionIssued:'no', insolvencyFiled:'no', noFault:'no', companyAssetsPointed:'no', hadCompanyDecision:'yes', hadFileAccess:'yes', kksNearLimitation:'no'} as const;
test('art. 118: year begins with arrear, not due date; Dec 31 boundary',()=>assert.equal(formatIsoLocal(art118Deadline(new Date(2020,11,31))),'2026-12-31'));
test('ordinary high risk remains red with procedural objections',()=>{
 for(const hadFileAccess of ['yes','no','unknown'] as const) for(const kksNearLimitation of ['yes','no','unknown'] as const) assert.equal(diagnoseArt116({...base,hadFileAccess,kksNearLimitation},now).signal,'red');
});
test('exculpation requires proof; not automatic green',()=>{
 for(const field of ['insolvencyFiled','noFault','companyAssetsPointed'] as const) assert.equal(diagnoseArt116({...base,[field]:'yes'},now).signal,'yellow');
});
test('unknowns cannot add up to green',()=>assert.equal(diagnoseArt116({...base,enforcementFruitless:'unknown',insolvencyFiled:'unknown',noFault:'unknown',companyAssetsPointed:'unknown'},now).signal,'yellow'));
test('outside tenure with ordinary scope and no proceeding is conditional green',()=>assert.equal(diagnoseArt116({...base,tenureStart:'2022-01-01'},now).signal,'green'));
test('existing decision keeps urgency even after base deadline or outside tenure',()=>assert.equal(diagnoseArt116({...base,tenureStart:'2022-01-01',paymentDue:'2016-01-25',decisionIssued:'yes'},now).signal,'red'));
test('decision case surfaces the 14-day appeal deadline (art. 223)',()=>{
 const r=diagnoseArt116({...base,decisionIssued:'yes'},now);
 assert.equal(r.signal,'red');
 assert.ok(r.defenses.some(d=>/14 dni/.test(d.body)));
 assert.ok(r.legalBasis.some(l=>/art\. 223/.test(l.cite)));
});
test('expiry without decision documents is not assurance',()=>assert.notEqual(diagnoseArt116({...base,paymentDue:'2020-01-25'},now).signal,'green'));
test('special cases and ZUS never ordinary green',()=>{
 for (const patch of [{specialCase:'yes'},{specialCase:'unknown'},{arrearKind:'zus'}] as const) assert.equal(diagnoseArt116({...base,tenureStart:'2022-01-01',...patch},now).signal,'yellow');
});
test('other legal forms route out',()=>assert.equal(diagnoseArt116({...base,companyForm:'other'},now).signal,'out'));
test('invalid future and reversed dates rejected',()=>{
 assert.ok(validateArt116Step({...base,tenureStart:'2027-01-01'},1,now));
 assert.ok(validateArt116Step({...base,stillServing:false,tenureEnd:'2019-01-01'},1,now));
 assert.ok(validateArt116Step({...base,paymentDue:'2026-09-12'},2,now));
 assert.ok(validateArt116Step({...base,insolvencyFiled:'yes',insolvencyDate:'2029-01-01'},4,now));
 assert.equal(parseIsoDate('2025-02-29'),null);
});
test('all 8748 combinations: no procedural score cancellation and decision always urgent',()=>{
 const values=['yes','no','unknown'] as const; let count=0;
 for(const companyForm of ['spzoo','sa','psa'] as const) for(const arrearKind of ['vat','cit','pit4','zus'] as const)
 for(const decisionIssued of values) for(const enforcementFruitless of values) for(const insolvencyFiled of values)
 for(const noFault of values) for(const companyAssetsPointed of values) for(const hadFileAccess of values){
  const r=diagnoseArt116({...base,companyForm,arrearKind,decisionIssued,enforcementFruitless,insolvencyFiled,noFault,companyAssetsPointed,hadFileAccess},now);
  assert.notEqual(r.signal,'green'); if(decisionIssued==='yes')assert.equal(r.signal,'red');
  assert.ok(r.nextSteps.length); assert.ok(r.legalBasis.every(l=>l.url?.startsWith('https://'))); count++;
 }
 assert.equal(count,8748);
});
const tax = {...emptyLicznikInput(),taxKind:'vat-m',paymentDue:'2021-02-25'} as const;
test('VAT December and Q4 move base year',()=>{
 assert.equal(suggestPaymentDue({...tax,month:'12'}),'2022-01-25');
 assert.equal(suggestPaymentDue({...tax,taxKind:'vat-q',quarter:'4'}),'2022-01-25');
});
test('weekend and holiday shift, CIT cannot masquerade as PIT',()=>{
 assert.equal(suggestPaymentDue({...tax,year:'2021',month:'11'}),'2021-12-27');
 assert.equal(suggestPaymentDue({...tax,taxKind:'pit',year:'2021'}),'2022-05-02');
 assert.equal(suggestPaymentDue({...tax,taxKind:'cit'}),'');
 assert.equal(suggestPaymentDue({...tax,month:'13'}),'');
});
test('base timer changes at Jan 1, not Dec 31 midnight',()=>{
 const a=diagnoseLimitation(tax,new Date(2026,11,31)); const b=diagnoseLimitation(tax,new Date(2027,0,1));
 assert.ok(!('error' in a)&&!('error' in b)); assert.equal(a.expired,false);assert.equal(b.expired,true);
});
test('all 128 event combinations retain uncertainty if any event is checked',()=>{
 const keys=['enforcement','mortgage','installments','courtComplaint','kks70c','bankruptcy','otherEvents'] as const;
 for(let mask=0;mask<128;mask++){
  const p={...tax};keys.forEach((k,i)=>p[k]=!!(mask&(1<<i)));
  const r=diagnoseLimitation(p,new Date(2027,0,1));assert.ok(!('error' in r));assert.equal(r.signal,'yellow');
 }
});
test('unknown KKS date is not evidence; future date rejected',()=>{
 const a=diagnoseLimitation({...tax,kks70c:true},now);assert.ok(!('error'in a));assert.equal(a.instrumentalRisk,false);
 assert.ok('error' in diagnoseLimitation({...tax,kks70c:true,kksDate:'2027-01-01'},now));
});
test('report exports local calendar date, inputs, actions and sources',()=>{
 const r=diagnoseLimitation(tax,now);assert.ok(!('error'in r));assert.match(licznikPlainText(r),/2021-02-25/);assert.match(licznikPlainText(r),/2026-12-31/);
 const txt=resultPlainText(diagnoseArt116(base,now));for(const part of ['TWOJE ODPOWIEDZI','CO ZROBIĆ TERAZ','https://','2026-09-12'])assert.ok(txt.includes(part));
});
