import { api } from "./api.js";

const STORAGE_KEY = "atlas-watchlist-company-ids";

interface WatchlistApiItem {
  companyId: string;
}

function authHeaders(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

export function getWatchlistCompanyIds() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [] as string[];
  }
}

function setWatchlistCompanyIds(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function isCompanyInWatchlist(companyId: string) {
  return getWatchlistCompanyIds().includes(companyId);
}

export function toggleCompanyInWatchlist(companyId: string) {
  const current = getWatchlistCompanyIds();
  const next = current.includes(companyId) ? current.filter((id) => id !== companyId) : [...current, companyId];
  setWatchlistCompanyIds(next);
  return next;
}

export function removeCompanyFromWatchlist(companyId: string) {
  const next = getWatchlistCompanyIds().filter((id) => id !== companyId);
  setWatchlistCompanyIds(next);
  return next;
}

export async function fetchPersistentWatchlistCompanyIds(token: string) {
  const response = await api.get<{ items: WatchlistApiItem[] }>("/api/watchlist", authHeaders(token));
  return response.data.items.map((item) => item.companyId);
}

export async function addCompanyToPersistentWatchlist(token: string, companyId: string) {
  await api.post("/api/watchlist", { companyId }, authHeaders(token));
}

export async function removeCompanyFromPersistentWatchlist(token: string, companyId: string) {
  await api.delete(`/api/watchlist/${companyId}`, authHeaders(token));
}
