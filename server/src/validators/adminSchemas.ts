import { z } from "zod";

const entityStatusSchema = z.enum(["draft", "published", "archived"]);
const recommendationSchema = z.enum(["buy", "overweight", "hold", "underweight", "sell"]);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const companyUpsertSchema = z.object({
  name: z.string().min(2).max(120),
  ticker: z.string().min(1).max(16),
  exchange: z.string().min(1).max(32),
  sector: z.string().min(1).max(64),
  industry: z.string().min(1).max(96),
  description: z.string().max(5000).optional().nullable(),
  status: entityStatusSchema.default("draft")
});

export const memoUpsertSchema = z.object({
  companyId: z.string().min(1),
  authorId: z.string().min(1).optional().nullable(),
  title: z.string().min(2).max(180),
  slug: z.string().min(2).max(200),
  recommendation: recommendationSchema,
  targetPrice: z.coerce.number().positive(),
  currentPrice: z.coerce.number().positive(),
  expectedReturn: z.coerce.number(),
  investmentHorizon: z.string().min(1).max(64),
  convictionLevel: z.coerce.number().int().min(1).max(10),
  executiveSummary: z.string().min(20).max(10000),
  thesis: z.string().min(20).max(20000),
  keyCatalysts: z.string().min(1).max(10000),
  keyRisks: z.string().min(1).max(10000),
  status: entityStatusSchema.default("draft"),
  publishedAt: z.string().datetime().optional().nullable()
});

const contentBase = {
  companyId: z.string().min(1).optional().nullable(),
  authorId: z.string().min(1).optional().nullable(),
  status: entityStatusSchema.default("draft"),
  publishedAt: z.string().datetime().optional().nullable()
};

export const industryReportUpsertSchema = z.object({
  ...contentBase,
  title: z.string().min(2).max(180),
  slug: z.string().min(2).max(200),
  executiveSummary: z.string().min(20).max(10000),
  overview: z.string().min(20).max(20000),
  marketSize: z.string().min(1).max(5000),
  tam: z.string().min(1).max(5000),
  sam: z.string().min(1).max(5000),
  som: z.string().min(1).max(5000),
  growth: z.string().min(1).max(5000),
  porterFiveForces: z.string().min(1).max(10000),
  valueChain: z.string().min(1).max(10000),
  competitors: z.string().min(1).max(10000),
  supplyChain: z.string().min(1).max(10000),
  demandDrivers: z.string().min(1).max(10000),
  technologyTrends: z.string().min(1).max(10000),
  regulation: z.string().min(1).max(10000),
  risks: z.string().min(1).max(10000),
  investmentImplications: z.string().min(1).max(10000)
});

export const marketOutlookUpsertSchema = z.object({
  ...contentBase,
  title: z.string().min(2).max(180),
  slug: z.string().min(2).max(200),
  month: z.string().min(1).max(32),
  executiveSummary: z.string().min(20).max(10000),
  federalReserve: z.string().min(1).max(10000),
  interestRates: z.string().min(1).max(10000),
  inflation: z.string().min(1).max(10000),
  gdp: z.string().min(1).max(10000),
  employment: z.string().min(1).max(10000),
  geopolitics: z.string().min(1).max(10000),
  currencies: z.string().min(1).max(10000),
  commodities: z.string().min(1).max(10000),
  technology: z.string().min(1).max(10000),
  ai: z.string().min(1).max(10000),
  semiconductors: z.string().min(1).max(10000),
  healthcare: z.string().min(1).max(10000),
  consumer: z.string().min(1).max(10000),
  financials: z.string().min(1).max(10000),
  marketValuation: z.string().min(1).max(10000),
  sectorOutlook: z.string().min(1).max(10000),
  portfolioPositioning: z.string().min(1).max(10000),
  conclusion: z.string().min(1).max(10000)
});

export const valuationModelUpsertSchema = z.object({
  ...contentBase,
  title: z.string().min(2).max(180),
  slug: z.string().min(2).max(200),
  companyId: z.string().min(1),
  currentSharePrice: z.coerce.number().positive(),
  revenue: z.coerce.number(),
  revenueGrowth: z.coerce.number(),
  ebitdaOrEbit: z.coerce.number(),
  freeCashFlow: z.coerce.number(),
  wacc: z.coerce.number(),
  terminalGrowthRate: z.coerce.number(),
  enterpriseValue: z.coerce.number(),
  equityValue: z.coerce.number(),
  sharesOutstanding: z.coerce.number().int().positive(),
  fairValue: z.coerce.number(),
  upsideDownside: z.coerce.number(),
  valuationConclusion: z.string().min(10).max(20000)
});

export const contactMessageStatusSchema = z.enum(["new", "in_review", "resolved", "spam"]);
