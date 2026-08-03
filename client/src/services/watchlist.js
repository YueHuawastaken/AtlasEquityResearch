import { api } from "./api.js";
const STORAGE_KEY = "atlas-watchlist-company-ids";
function authHeaders(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}
export function getWatchlistCompanyIds() {
    if (typeof window === "undefined") {
        return [];
    }
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
}
function setWatchlistCompanyIds(ids) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}
export function isCompanyInWatchlist(companyId) {
    return getWatchlistCompanyIds().includes(companyId);
}
export function toggleCompanyInWatchlist(companyId) {
    const current = getWatchlistCompanyIds();
    const next = current.includes(companyId) ? current.filter((id) => id !== companyId) : [...current, companyId];
    setWatchlistCompanyIds(next);
    return next;
}
export function removeCompanyFromWatchlist(companyId) {
    const next = getWatchlistCompanyIds().filter((id) => id !== companyId);
    setWatchlistCompanyIds(next);
    return next;
}
export async function fetchPersistentWatchlistCompanyIds(token) {
    const response = await api.get("/api/watchlist", authHeaders(token));
    return response.data.items.map((item) => item.companyId);
}
export async function addCompanyToPersistentWatchlist(token, companyId) {
    await api.post("/api/watchlist", { companyId }, authHeaders(token));
}
export async function removeCompanyFromPersistentWatchlist(token, companyId) {
    await api.delete(`/api/watchlist/${companyId}`, authHeaders(token));
}
