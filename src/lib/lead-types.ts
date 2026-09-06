export const LEAD_SOURCES = ["diagnostyk", "licznik", "landing"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export type Lead = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  note: string;
  source: LeadSource;
  subject: string;
  resultText: string;
};

export type LeadInput = Omit<Lead, "id" | "createdAt">;
