import { api } from "./api.js";

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CompanyListItem {
  id: string;
  name: string;
  ticker: string;
  exchange: string;
  sector: string;
  industry: string;
  status: string;
  description: string | null;
  _count: { memos: number };
}

export interface CompanyDetail extends CompanyListItem {
  memos: Array<{
    id: string;
    title: string;
    slug: string;
    recommendation: string;
    status: string;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  reports: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  outlooks: Array<{
    id: string;
    title: string;
    slug: string;
    month: string;
    status: string;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  valuationModels: Array<{
    id: string;
    title: string;
    slug: string;
    fairValue: string;
    currentSharePrice: string;
    upsideDownside: string;
    status: string;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface MemoListItem {
  id: string;
  title: string;
  slug: string;
  recommendation: string;
  targetPrice: string;
  currentPrice: string;
  expectedReturn: string;
  convictionLevel: number;
  status: string;
  publishedAt: string | null;
  company: {
    id: string;
    name: string;
    ticker: string;
  };
}

export interface MemoDetail extends MemoListItem {
  investmentHorizon: string;
  executiveSummary: string;
  thesis: string;
  keyCatalysts: string;
  keyRisks: string;
  company: {
    id: string;
    name: string;
    ticker: string;
    exchange: string;
    sector: string;
    industry: string;
    description: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  tags: Array<{
    id: string;
    tag: {
      id: string;
      name: string;
      color: string | null;
    };
  }>;
  attachments: Array<{
    id: string;
    fileName: string;
    fileType: string;
    url: string;
  }>;
  author: { id: string; name: string; email: string } | null;
}

export async function fetchCompanies(params: Record<string, string | number | undefined>) {
  const response = await api.get<PaginatedResponse<CompanyListItem>>("/api/companies", { params });
  return response.data;
}

export async function fetchCompany(companyId: string) {
  const response = await api.get<{ item: CompanyDetail }>(`/api/companies/${companyId}`);
  return response.data.item;
}

export async function fetchMemos(params: Record<string, string | number | undefined>) {
  const response = await api.get<PaginatedResponse<MemoListItem>>("/api/memos", { params });
  return response.data;
}

export async function fetchMemo(memoId: string) {
  const response = await api.get<{ item: MemoDetail }>(`/api/memos/${memoId}`);
  return response.data.item;
}
