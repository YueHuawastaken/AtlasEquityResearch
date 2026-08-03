import { api } from "./api.js";

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SearchResultItem {
  id: string;
  type: "company" | "memo" | "industry-report" | "market-outlook" | "research-journal";
  title: string;
  subtitle: string;
  slug: string;
  status: string;
  publishedAt: string | null;
}

export interface IndustryReportListItem {
  id: string;
  title: string;
  slug: string;
  executiveSummary: string;
  status: string;
  publishedAt: string | null;
  company: { id: string; name: string; ticker: string } | null;
}

export interface IndustryReportDetail extends IndustryReportListItem {
  overview: string;
  marketSize: string;
  tam: string;
  sam: string;
  som: string;
  growth: string;
  porterFiveForces: string;
  valueChain: string;
  competitors: string;
  supplyChain: string;
  demandDrivers: string;
  technologyTrends: string;
  regulation: string;
  risks: string;
  investmentImplications: string;
  company: { id: string; name: string; ticker: string; sector: string; industry: string } | null;
  attachments: Array<{ id: string; fileName: string; fileType: string; url: string }>;
  author: { id: string; name: string; email: string } | null;
}

export interface MarketOutlookListItem {
  id: string;
  title: string;
  slug: string;
  month: string;
  executiveSummary: string;
  status: string;
  publishedAt: string | null;
  company: { id: string; name: string; ticker: string } | null;
}

export interface MarketOutlookDetail extends MarketOutlookListItem {
  federalReserve: string;
  interestRates: string;
  inflation: string;
  gdp: string;
  employment: string;
  geopolitics: string;
  currencies: string;
  commodities: string;
  technology: string;
  ai: string;
  semiconductors: string;
  healthcare: string;
  consumer: string;
  financials: string;
  marketValuation: string;
  sectorOutlook: string;
  portfolioPositioning: string;
  conclusion: string;
  company: { id: string; name: string; ticker: string; sector: string; industry: string } | null;
  attachments: Array<{ id: string; fileName: string; fileType: string; url: string }>;
  author: { id: string; name: string; email: string } | null;
}

export interface ResearchJournalListItem {
  id: string;
  title: string;
  slug: string;
  prompt: string;
  status: string;
  publishedAt: string | null;
  company: { id: string; name: string; ticker: string } | null;
}

export interface ResearchJournalDetail extends ResearchJournalListItem {
  body: string;
  reflections: string;
  company: { id: string; name: string; ticker: string; sector: string; industry: string } | null;
  attachments: Array<{ id: string; fileName: string; fileType: string; url: string }>;
  author: { id: string; name: string; email: string } | null;
}

export async function fetchIndustryReports(params: Record<string, string | number | undefined>) {
  const response = await api.get<PaginatedResponse<IndustryReportListItem>>("/api/industry-reports", { params });
  return response.data;
}

export async function fetchIndustryReport(reportId: string) {
  const response = await api.get<{ item: IndustryReportDetail }>(`/api/industry-reports/${reportId}`);
  return response.data.item;
}

export async function fetchMarketOutlooks(params: Record<string, string | number | undefined>) {
  const response = await api.get<PaginatedResponse<MarketOutlookListItem>>("/api/market-outlooks", { params });
  return response.data;
}

export async function fetchMarketOutlook(outlookId: string) {
  const response = await api.get<{ item: MarketOutlookDetail }>(`/api/market-outlooks/${outlookId}`);
  return response.data.item;
}

export async function fetchResearchJournalEntries(params: Record<string, string | number | undefined>) {
  const response = await api.get<PaginatedResponse<ResearchJournalListItem>>("/api/research-journal", { params });
  return response.data;
}

export async function fetchResearchJournalEntry(journalId: string) {
  const response = await api.get<{ item: ResearchJournalDetail }>(`/api/research-journal/${journalId}`);
  return response.data.item;
}

export async function searchAtlas(query: string) {
  const response = await api.get<{ items: SearchResultItem[] }>("/api/search", { params: { q: query } });
  return response.data.items;
}
