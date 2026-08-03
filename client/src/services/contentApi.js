import { api } from "./api.js";
export async function fetchIndustryReports(params) {
    const response = await api.get("/api/industry-reports", { params });
    return response.data;
}
export async function fetchIndustryReport(reportId) {
    const response = await api.get(`/api/industry-reports/${reportId}`);
    return response.data.item;
}
export async function fetchMarketOutlooks(params) {
    const response = await api.get("/api/market-outlooks", { params });
    return response.data;
}
export async function fetchMarketOutlook(outlookId) {
    const response = await api.get(`/api/market-outlooks/${outlookId}`);
    return response.data.item;
}
export async function fetchResearchJournalEntries(params) {
    const response = await api.get("/api/research-journal", { params });
    return response.data;
}
export async function fetchResearchJournalEntry(journalId) {
    const response = await api.get(`/api/research-journal/${journalId}`);
    return response.data.item;
}
export async function searchAtlas(query) {
    const response = await api.get("/api/search", { params: { q: query } });
    return response.data.items;
}
