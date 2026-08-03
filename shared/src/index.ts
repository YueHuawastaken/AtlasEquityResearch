export type EntityStatus = "draft" | "published" | "archived";

export type Recommendation = "buy" | "overweight" | "hold" | "underweight" | "sell";

export interface PageMeta {
  title: string;
  description: string;
}

export interface CompanySummary {
  id: string;
  name: string;
  ticker: string;
  exchange: string;
  sector: string;
  industry: string;
  status: EntityStatus;
}
