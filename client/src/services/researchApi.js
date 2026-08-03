import { api } from "./api.js";
export async function fetchCompanies(params) {
    const response = await api.get("/api/companies", { params });
    return response.data;
}
export async function fetchCompany(companyId) {
    const response = await api.get(`/api/companies/${companyId}`);
    return response.data.item;
}
export async function fetchMemos(params) {
    const response = await api.get("/api/memos", { params });
    return response.data;
}
export async function fetchMemo(memoId) {
    const response = await api.get(`/api/memos/${memoId}`);
    return response.data.item;
}
