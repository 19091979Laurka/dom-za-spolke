import { test, expect, Page } from '@playwright/test';
async function next(p: Page){await p.getByRole('button',{name:'Dalej',exact:false}).click();}
async function yn(p:Page,index:number,value:string){await p.locator('fieldset').nth(index).getByRole('button',{name:value,exact:true}).click();}
async function complete(p:Page,kind='VAT',options:{outside?:boolean;unknown?:boolean;defense?:boolean;decision?:boolean;special?:boolean}={}){
 await p.goto('/diagnostyk');await p.getByRole('button',{name:/^Spółka z o.o./}).click();await next(p);
 await p.locator('#tenure-start').fill(options.outside?'2022-01-01':'2020-01-01');await next(p);
 await p.getByRole('button',{name:kind,exact:false}).first().click();await yn(p,0,options.special?'Tak':'Nie');await p.locator('#payment-due').fill('2021-02-25');await next(p);
 await yn(p,0,options.unknown?'Nie wiem':'Tak');await yn(p,1,'Nie');await yn(p,2,options.decision?'Tak':'Nie');await next(p);
 await yn(p,0,options.defense?'Tak':options.unknown?'Nie wiem':'Nie');await yn(p,1,options.unknown?'Nie wiem':'Nie');await yn(p,2,options.unknown?'Nie wiem':'Nie');await next(p);
 await yn(p,0,'Tak');await yn(p,1,'Nie');if(kind!=='Składki ZUS')await yn(p,2,'Tak');
 await p.getByRole('button',{name:'Pokaż semafor'}).click();await expect(p.locator('.report-signal')).toBeVisible();
}
for(const [kind,signal] of [['VAT','red'],['CIT','red'],['Zaliczki PIT','red'],['Składki ZUS','yellow']])test(`full ${kind} flow`,async({page})=>{await complete(page,kind);await expect(page.locator('.report-signal')).toHaveAttribute('data-signal',signal);await expect(page.getByRole('button',{name:'Pobierz TXT'})).toBeVisible();});
test('uncertainty and declared defense are yellow',async({page})=>{await complete(page,'VAT',{unknown:true});await expect(page.locator('.report-signal')).toHaveAttribute('data-signal','yellow');await complete(page,'VAT',{defense:true});await expect(page.locator('.report-signal')).toHaveAttribute('data-signal','yellow');});
test('outside dates green, existing decision red, special yellow',async({page})=>{for(const [opt,signal] of [[{outside:true},'green'],[{outside:true,decision:true},'red'],[{outside:true,special:true},'yellow']] as const){await complete(page,'VAT',opt);await expect(page.locator('.report-signal')).toHaveAttribute('data-signal',signal);}});
test('validation, back state, out-of-scope and reset',async({page})=>{
 await page.goto('/diagnostyk');await next(page);await expect(page.getByRole('alert').filter({hasText:'Wybierz'})).toBeVisible();
 await page.getByRole('button',{name:/^Spółka akcyjna/}).click();await next(page);await page.locator('#tenure-start').fill('2028-01-01');await next(page);await expect(page.getByRole('alert').filter({hasText:'początek'})).toBeVisible();
 await page.getByRole('button',{name:'Wstecz',exact:true}).click();await expect(page.getByRole('button',{name:/^Spółka akcyjna/})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:/^JDG/}).click();await page.getByRole('button',{name:'Pokaż semafor'}).click();await expect(page.locator('.report-signal')).toHaveAttribute('data-signal','out');
 await page.getByRole('button',{name:'Zacznij od nowa'}).click();await expect(page.getByRole('button',{name:/^Spółka akcyjna/})).toHaveAttribute('aria-pressed','false');
});
test('edit result recomputes and report download retains actions',async({page})=>{
 await complete(page);await page.getByRole('button',{name:'Popraw odpowiedzi'}).click();await page.getByRole('button',{name:'Wstecz',exact:true}).click();await yn(page,0,'Tak');await next(page);await page.getByRole('button',{name:'Pokaż semafor'}).click();await expect(page.locator('.report-signal')).toHaveAttribute('data-signal','yellow');
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Pobierz TXT'}).click()]);expect(download.suggestedFilename()).toBe('szuwara-raport.txt');
 const stream=await download.createReadStream();let txt='';for await(const c of stream!)txt+=c.toString();expect(txt).toContain('CO ZROBIĆ TERAZ');expect(txt).toContain('2021-02-25');
});
test('VAT monthly, quarterly, PIT and CIT timer',async({page})=>{
 await page.goto('/licznik');await page.getByRole('button',{name:/^VAT miesięczny/}).click();await page.locator('#year').selectOption('2021');await page.locator('#month').selectOption('11');await expect(page.locator('#due')).toHaveValue('2021-12-27');
 await page.getByRole('button',{name:/Policz dni/}).click();await expect(page.locator('#wynik-do-druku')).toContainText('31 grudnia 2026');
 await page.locator('#month').selectOption('12');await expect(page.locator('#wynik-do-druku')).toHaveCount(0);await page.getByRole('button',{name:/Policz dni/}).click();await expect(page.locator('#wynik-do-druku')).toContainText('31 grudnia 2027');
 await page.getByRole('button',{name:/^VAT kwartalny/}).click();await page.locator('#quarter').selectOption('4');await expect(page.locator('#due')).toHaveValue('2022-01-25');
 await page.getByRole('button',{name:/^PIT roczny/}).click();await expect(page.locator('#due')).toHaveValue('2022-05-02');
 await page.getByRole('button',{name:'CIT roczny',exact:true}).click();await expect(page.locator('#due')).toHaveValue('');await page.getByRole('button',{name:/Policz dni/}).click();await expect(page.getByRole('alert').filter({hasText:'termin'})).toBeVisible();
 await page.locator('#due').fill('2022-06-30');await page.getByRole('button',{name:/Policz dni/}).click();await expect(page.locator('#wynik-do-druku')).toContainText('31 grudnia 2027');
});
test('mobile menu, full flow, overflow, reduced motion',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.getByRole('button',{name:'Menu',exact:true}).click();await expect(page.locator('#mobile-nav')).toBeVisible();await page.locator('#mobile-nav').getByRole('link',{name:'Art. 116',exact:true}).click();
 await complete(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);await expect(page.locator('.report-signal')).toHaveCSS('animation-name','none');
 await page.screenshot({path:'../../outputs/raport-mobile.png',fullPage:true});
});
test('report print excludes contact form and retains result',async({page})=>{
 await complete(page);await page.emulateMedia({media:'print'});await expect(page.locator('#wynik-kontakt')).not.toBeVisible();await expect(page.locator('.pdf-document')).toBeVisible();await expect(page.locator('.report-signal')).not.toBeVisible();await expect(page.locator('.pdf-letterhead img').first()).toBeVisible();
 await page.pdf({path:'../../outputs/przykladowy-raport.pdf',format:'A4',printBackground:true});
});
test('contact never posts to a server; lead inbox routes are gone',async({page,request})=>{
 expect((await request.get('/api/leads?k=szuwara')).status()).toBe(404);
 expect((await request.get('/leady')).status()).toBe(404);
 const posts:string[]=[];page.on('request',r=>{if(r.method()==='POST')posts.push(r.url());});await page.goto('/');await page.locator('#lead-name-landing').fill('TEST AUDYTU');await page.locator('#lead-phone-landing').fill('000000000');await page.getByRole('button',{name:/Przygotuj e-mail/}).click();await expect(page.getByRole('status').filter({hasText:'Zaznacz'})).toBeVisible();expect(posts).toHaveLength(0);
});

test('timer branded PDF contains dates and sources',async({page})=>{await page.goto('/licznik');await page.getByRole('button',{name:/VAT miesięczny/}).click();await page.getByRole('button',{name:/Policz dni/}).click();await page.emulateMedia({media:'print'});await expect(page.locator('.pdf-document')).toBeVisible();await expect(page.locator('.pdf-stats')).toContainText('2026');await page.pdf({path:'../../outputs/raport-licznik.pdf',format:'A4',printBackground:true});});
