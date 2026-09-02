import { api } from "./api.js";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

export interface AdminOverview {
  stats: {
    companyCount: number;
    memoCount: number;
    reportCount: number;
    outlookCount: number;
    valuationModelCount: number;
    draftCount: number;
    contactCount: number;
  };
}

export interface AdminCompany {
  id: string;
  name: string;
  ticker: string;
  exchange: string;
  sector: string;
  industry: string;
  description: string | null;
  status: string;
  updatedAt: string;
  _count: { memos: number };
}

export interface AdminMemo {
  id: string;
  companyId: string;
  authorId: string | null;
  title: string;
  slug: string;
  recommendation: string;
  targetPrice: string;
  currentPrice: string;
  expectedReturn: string;
  investmentHorizon: string;
  convictionLevel: number;
  executiveSummary: string;
  thesis: string;
  keyCatalysts: string;
  keyRisks: string;
  status: string;
  publishedAt: string | null;
  company: {
    id: string;
    name: string;
    ticker: string;
  };
}

export interface CompanyPayload {
  name: string;
  ticker: string;
  exchange: string;
  sector: string;
  industry: string;
  description?: string | null;
  status: string;
}

export interface MemoPayload {
  companyId: string;
  authorId?: string | null;
  title: string;
  slug: string;
  recommendation: string;
  targetPrice: number;
  currentPrice: number;
  expectedReturn: number;
  investmentHorizon: string;
  convictionLevel: number;
  executiveSummary: string;
  thesis: string;
  keyCatalysts: string;
  keyRisks: string;
  status: string;
  publishedAt?: string | null;
}

export interface AdminIndustryReport {
  id: string;
  companyId: string | null;
  authorId: string | null;
  title: string;
  slug: string;
  executiveSummary: string;
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
  status: string;
  publishedAt: string | null;
  company: {
    id: string;
    name: string;
    ticker: string;
  } | null;
}

export interface IndustryReportPayload {
  companyId?: string | null;
  authorId?: string | null;
  title: string;
  slug: string;
  executiveSummary: string;
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
  status: string;
  publishedAt?: string | null;
}

export interface AdminMarketOutlook {
  id: string;
  companyId: string | null;
  authorId: string | null;
  title: string;
  slug: string;
  month: string;
  executiveSummary: string;
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
  status: string;
  publishedAt: string | null;
  company: {
    id: string;
    name: string;
    ticker: string;
  } | null;
}

export interface MarketOutlookPayload {
  companyId?: string | null;
  authorId?: string | null;
  title: string;
  slug: string;
  month: string;
  executiveSummary: string;
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
  status: string;
  publishedAt?: string | null;
}

export interface AdminValuationModel {
  id: string;
  companyId: string;
  authorId: string | null;
  title: string;
  slug: string;
  currentSharePrice: string;
  revenue: string;
  revenueGrowth: string;
  ebitdaOrEbit: string;
  freeCashFlow: string;
  wacc: string;
  terminalGrowthRate: string;
  enterpriseValue: string;
  equityValue: string;
  sharesOutstanding: string;
  fairValue: string;
  upsideDownside: string;
  valuationConclusion: string;
  status: string;
  publishedAt: string | null;
  company: {
    id: string;
    name: string;
    ticker: string;
  };
}

export interface ValuationModelPayload {
  companyId: string;
  authorId?: string | null;
  title: string;
  slug: string;
  currentSharePrice: number;
  revenue: number;
  revenueGrowth: number;
  ebitdaOrEbit: number;
  freeCashFlow: number;
  wacc: number;
  terminalGrowthRate: number;
  enterpriseValue: number;
  equityValue: number;
  sharesOutstanding: number;
  fairValue: number;
  upsideDownside: number;
  valuationConclusion: string;
  status: string;
  publishedAt?: string | null;
}

export type AttachmentScope = "company" | "memo" | "industryReport" | "marketOutlook" | "valuationModel";

export interface AdminAttachment {
  id: string;
  companyId: string | null;
  memoId: string | null;
  industryReportId: string | null;
  marketOutlookId: string | null;
  valuationModelId: string | null;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  publicId: string;
  createdAt: string;
}

export type ContactMessageStatus = "new" | "in_review" | "resolved" | "spam";

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

export function getAdminApiErrorMessage(error: unknown, fallback: string) {
  const response = (error as { response?: { data?: { message?: string; issues?: { fieldErrors?: Record<string, string[]> } } } }).response;
  const data = response?.data;
  const fieldErrors = data?.issues?.fieldErrors;
  const details = fieldErrors
    ? Object.entries(fieldErrors).flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`)).join(" ")
    : "";

  return [data?.message, details].filter(Boolean).join(" ") || (error instanceof Error ? error.message : fallback);
}

export async function login(email: string, password: string) {
  const response = await api.post<LoginResponse>("/api/auth/login", { email, password });
  return response.data;
}

export async function fetchAdminMe(token: string) {
  const response = await api.get<{ user: AdminUser }>("/api/auth/me", authHeaders(token));
  return response.data.user;
}

export async function fetchOverview(token: string) {
  const response = await api.get<AdminOverview>("/api/admin/overview", authHeaders(token));
  return response.data;
}

export async function fetchAdminCompanies(token: string) {
  const response = await api.get<{ items: AdminCompany[] }>("/api/admin/companies", authHeaders(token));
  return response.data.items;
}

export async function createCompany(token: string, payload: CompanyPayload) {
  const response = await api.post<{ item: AdminCompany }>("/api/admin/companies", payload, authHeaders(token));
  return response.data.item;
}

export async function updateCompany(token: string, companyId: string, payload: Partial<CompanyPayload>) {
  const response = await api.patch<{ item: AdminCompany }>(`/api/admin/companies/${companyId}`, payload, authHeaders(token));
  return response.data.item;
}

export async function deleteCompany(token: string, companyId: string) {
  await api.delete(`/api/admin/companies/${companyId}`, authHeaders(token));
}

export async function fetchAdminMemos(token: string) {
  const response = await api.get<{ items: AdminMemo[] }>("/api/admin/memos", authHeaders(token));
  return response.data.items;
}

export async function createMemo(token: string, payload: MemoPayload) {
  const response = await api.post<{ item: AdminMemo }>("/api/admin/memos", payload, authHeaders(token));
  return response.data.item;
}

export async function updateMemo(token: string, memoId: string, payload: Partial<MemoPayload>) {
  const response = await api.patch<{ item: AdminMemo }>(`/api/admin/memos/${memoId}`, payload, authHeaders(token));
  return response.data.item;
}

export async function deleteMemo(token: string, memoId: string) {
  await api.delete(`/api/admin/memos/${memoId}`, authHeaders(token));
}

export async function fetchAdminIndustryReports(token: string) {
  const response = await api.get<{ items: AdminIndustryReport[] }>("/api/admin/industry-reports", authHeaders(token));
  return response.data.items;
}

export async function createIndustryReport(token: string, payload: IndustryReportPayload) {
  const response = await api.post<{ item: AdminIndustryReport }>("/api/admin/industry-reports", payload, authHeaders(token));
  return response.data.item;
}

export async function updateIndustryReport(token: string, reportId: string, payload: Partial<IndustryReportPayload>) {
  const response = await api.patch<{ item: AdminIndustryReport }>(`/api/admin/industry-reports/${reportId}`, payload, authHeaders(token));
  return response.data.item;
}

export async function deleteIndustryReport(token: string, reportId: string) {
  await api.delete(`/api/admin/industry-reports/${reportId}`, authHeaders(token));
}

export async function fetchAdminMarketOutlooks(token: string) {
  const response = await api.get<{ items: AdminMarketOutlook[] }>("/api/admin/market-outlooks", authHeaders(token));
  return response.data.items;
}

export async function createMarketOutlook(token: string, payload: MarketOutlookPayload) {
  const response = await api.post<{ item: AdminMarketOutlook }>("/api/admin/market-outlooks", payload, authHeaders(token));
  return response.data.item;
}

export async function updateMarketOutlook(token: string, outlookId: string, payload: Partial<MarketOutlookPayload>) {
  const response = await api.patch<{ item: AdminMarketOutlook }>(`/api/admin/market-outlooks/${outlookId}`, payload, authHeaders(token));
  return response.data.item;
}

export async function deleteMarketOutlook(token: string, outlookId: string) {
  await api.delete(`/api/admin/market-outlooks/${outlookId}`, authHeaders(token));
}

export async function fetchAdminValuationModels(token: string) {
  const response = await api.get<{ items: AdminValuationModel[] }>("/api/admin/valuation-models", authHeaders(token));
  return response.data.items;
}

export async function createValuationModel(token: string, payload: ValuationModelPayload) {
  const response = await api.post<{ item: AdminValuationModel }>("/api/admin/valuation-models", payload, authHeaders(token));
  return response.data.item;
}

export async function updateValuationModel(token: string, valuationModelId: string, payload: Partial<ValuationModelPayload>) {
  const response = await api.patch<{ item: AdminValuationModel }>(`/api/admin/valuation-models/${valuationModelId}`, payload, authHeaders(token));
  return response.data.item;
}

export async function deleteValuationModel(token: string, valuationModelId: string) {
  await api.delete(`/api/admin/valuation-models/${valuationModelId}`, authHeaders(token));
}

export async function fetchAdminAttachments(token: string, scope: AttachmentScope, parentId: string) {
  const response = await api.get<{ items: AdminAttachment[] }>("/api/admin/attachments", {
    ...authHeaders(token),
    params: { scope, parentId }
  });

  return response.data.items;
}

export async function createAdminAttachment(token: string, scope: AttachmentScope, parentId: string, file: File) {
  const formData = new FormData();
  formData.append("scope", scope);
  formData.append("parentId", parentId);
  formData.append("file", file);

  const response = await api.post<{ item: AdminAttachment }>("/api/admin/attachments", formData, {
    ...authHeaders(token),
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-Type": "multipart/form-data"
    }
  });

  return response.data.item;
}

export async function deleteAdminAttachment(token: string, attachmentId: string) {
  await api.delete(`/api/admin/attachments/${attachmentId}`, authHeaders(token));
}

export async function fetchAdminContactMessages(token: string, params?: { status?: ContactMessageStatus; search?: string }) {
  const response = await api.get<{ items: AdminContactMessage[] }>("/api/admin/contact-messages", {
    ...authHeaders(token),
    params
  });

  return response.data.items;
}

export async function updateAdminContactMessageStatus(token: string, messageId: string, status: ContactMessageStatus) {
  const response = await api.patch<{ item: AdminContactMessage }>(`/api/admin/contact-messages/${messageId}`, { status }, authHeaders(token));
  return response.data.item;
}

export async function deleteAdminContactMessage(token: string, messageId: string) {
  await api.delete(`/api/admin/contact-messages/${messageId}`, authHeaders(token));
}