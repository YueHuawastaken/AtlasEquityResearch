import { api } from "./api.js";
function authHeaders(token) {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}
export function getAdminApiErrorMessage(error, fallback) {
    const response = error.response;
    const data = response?.data;
    const fieldErrors = data?.issues?.fieldErrors;
    const details = fieldErrors
        ? Object.entries(fieldErrors).flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`)).join(" ")
        : "";
    return [data?.message, details].filter(Boolean).join(" ") || (error instanceof Error ? error.message : fallback);
}
export async function login(email, password) {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
}
export async function fetchAdminMe(token) {
    const response = await api.get("/api/auth/me", authHeaders(token));
    return response.data.user;
}
export async function fetchOverview(token) {
    const response = await api.get("/api/admin/overview", authHeaders(token));
    return response.data;
}
export async function fetchAdminCompanies(token) {
    const response = await api.get("/api/admin/companies", authHeaders(token));
    return response.data.items;
}
export async function createCompany(token, payload) {
    const response = await api.post("/api/admin/companies", payload, authHeaders(token));
    return response.data.item;
}
export async function updateCompany(token, companyId, payload) {
    const response = await api.patch(`/api/admin/companies/${companyId}`, payload, authHeaders(token));
    return response.data.item;
}
export async function deleteCompany(token, companyId) {
    await api.delete(`/api/admin/companies/${companyId}`, authHeaders(token));
}
export async function fetchAdminMemos(token) {
    const response = await api.get("/api/admin/memos", authHeaders(token));
    return response.data.items;
}
export async function createMemo(token, payload) {
    const response = await api.post("/api/admin/memos", payload, authHeaders(token));
    return response.data.item;
}
export async function updateMemo(token, memoId, payload) {
    const response = await api.patch(`/api/admin/memos/${memoId}`, payload, authHeaders(token));
    return response.data.item;
}
export async function deleteMemo(token, memoId) {
    await api.delete(`/api/admin/memos/${memoId}`, authHeaders(token));
}
export async function fetchAdminIndustryReports(token) {
    const response = await api.get("/api/admin/industry-reports", authHeaders(token));
    return response.data.items;
}
export async function createIndustryReport(token, payload) {
    const response = await api.post("/api/admin/industry-reports", payload, authHeaders(token));
    return response.data.item;
}
export async function updateIndustryReport(token, reportId, payload) {
    const response = await api.patch(`/api/admin/industry-reports/${reportId}`, payload, authHeaders(token));
    return response.data.item;
}
export async function deleteIndustryReport(token, reportId) {
    await api.delete(`/api/admin/industry-reports/${reportId}`, authHeaders(token));
}
export async function fetchAdminMarketOutlooks(token) {
    const response = await api.get("/api/admin/market-outlooks", authHeaders(token));
    return response.data.items;
}
export async function createMarketOutlook(token, payload) {
    const response = await api.post("/api/admin/market-outlooks", payload, authHeaders(token));
    return response.data.item;
}
export async function updateMarketOutlook(token, outlookId, payload) {
    const response = await api.patch(`/api/admin/market-outlooks/${outlookId}`, payload, authHeaders(token));
    return response.data.item;
}
export async function deleteMarketOutlook(token, outlookId) {
    await api.delete(`/api/admin/market-outlooks/${outlookId}`, authHeaders(token));
}
export async function fetchAdminValuationModels(token) {
    const response = await api.get("/api/admin/valuation-models", authHeaders(token));
    return response.data.items;
}
export async function createValuationModel(token, payload) {
    const response = await api.post("/api/admin/valuation-models", payload, authHeaders(token));
    return response.data.item;
}
export async function updateValuationModel(token, valuationModelId, payload) {
    const response = await api.patch(`/api/admin/valuation-models/${valuationModelId}`, payload, authHeaders(token));
    return response.data.item;
}
export async function deleteValuationModel(token, valuationModelId) {
    await api.delete(`/api/admin/valuation-models/${valuationModelId}`, authHeaders(token));
}
export async function fetchAdminAttachments(token, scope, parentId) {
    const response = await api.get("/api/admin/attachments", {
        ...authHeaders(token),
        params: { scope, parentId }
    });
    return response.data.items;
}
export async function createAdminAttachment(token, scope, parentId, file) {
    const formData = new FormData();
    formData.append("scope", scope);
    formData.append("parentId", parentId);
    formData.append("file", file);
    const response = await api.post("/api/admin/attachments", formData, {
        ...authHeaders(token),
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data.item;
}
export async function deleteAdminAttachment(token, attachmentId) {
    await api.delete(`/api/admin/attachments/${attachmentId}`, authHeaders(token));
}
export async function fetchAdminContactMessages(token, params) {
    const response = await api.get("/api/admin/contact-messages", {
        ...authHeaders(token),
        params
    });
    return response.data.items;
}
export async function updateAdminContactMessageStatus(token, messageId, status) {
    const response = await api.patch(`/api/admin/contact-messages/${messageId}`, { status }, authHeaders(token));
    return response.data.item;
}
