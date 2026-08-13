import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { deleteIndustryReport, deleteMarketOutlook, deleteMemo, deleteValuationModel, fetchAdminCompanies, fetchAdminIndustryReports, fetchAdminMarketOutlooks, fetchAdminMemos, fetchAdminMe, fetchAdminValuationModels, updateIndustryReport, updateMarketOutlook, updateMemo, updateValuationModel } from "../services/adminApi.js";
function recordType(record) {
    if ("recommendation" in record)
        return "Investment Memo";
    if ("month" in record)
        return "Market Outlook";
    if ("valuationConclusion" in record)
        return "Valuation Model";
    return "Industry Research";
}
const numericFields = new Set([
    "targetPrice", "currentPrice", "expectedReturn", "convictionLevel", "currentSharePrice",
    "revenue", "revenueGrowth", "ebitdaOrEbit", "freeCashFlow", "wacc", "terminalGrowthRate",
    "enterpriseValue", "equityValue", "sharesOutstanding", "fairValue", "upsideDownside"
]);
function editableFields(record) {
    if ("recommendation" in record)
        return ["companyId", "title", "slug", "recommendation", "targetPrice", "currentPrice", "expectedReturn", "investmentHorizon", "convictionLevel", "executiveSummary", "thesis", "keyCatalysts", "keyRisks", "status", "publishedAt"];
    if ("month" in record)
        return ["companyId", "title", "slug", "month", "executiveSummary", "federalReserve", "interestRates", "inflation", "gdp", "employment", "geopolitics", "currencies", "commodities", "technology", "ai", "semiconductors", "healthcare", "consumer", "financials", "marketValuation", "sectorOutlook", "portfolioPositioning", "conclusion", "status", "publishedAt"];
    if ("valuationConclusion" in record)
        return ["companyId", "title", "slug", "currentSharePrice", "revenue", "revenueGrowth", "ebitdaOrEbit", "freeCashFlow", "wacc", "terminalGrowthRate", "enterpriseValue", "equityValue", "sharesOutstanding", "fairValue", "upsideDownside", "valuationConclusion", "status", "publishedAt"];
    return ["companyId", "title", "slug", "executiveSummary", "overview", "marketSize", "tam", "sam", "som", "growth", "porterFiveForces", "valueChain", "competitors", "supplyChain", "demandDrivers", "technologyTrends", "regulation", "risks", "investmentImplications", "status", "publishedAt"];
}
function fieldLabel(field) {
    return field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}
export function AdminStoragePage() {
    const token = localStorage.getItem("atlas-admin-token");
    const [allowed, setAllowed] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [records, setRecords] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [readingId, setReadingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const load = async () => {
        if (!token)
            return;
        const [companyItems, memoItems, reportItems, outlookItems, valuationItems] = await Promise.all([
            fetchAdminCompanies(token), fetchAdminMemos(token), fetchAdminIndustryReports(token),
            fetchAdminMarketOutlooks(token), fetchAdminValuationModels(token)
        ]);
        setCompanies(companyItems);
        setRecords([...memoItems, ...reportItems, ...outlookItems, ...valuationItems]);
    };
    useEffect(() => {
        if (!token)
            return;
        void fetchAdminMe(token).then((user) => setAllowed(user.role === "admin" || user.role === "editor")).catch(() => setAllowed(false));
        void load();
    }, [token]);
    const matchingCompanies = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        return companies.filter((company) => !normalized || company.name.toLowerCase().includes(normalized) || company.ticker.toLowerCase().includes(normalized));
    }, [companies, query]);
    const selectedCompany = companies.find((company) => company.id === selectedCompanyId);
    const selectedRecords = records.filter((record) => record.companyId === selectedCompanyId);
    if (!token)
        return _jsx(Navigate, { to: "/admin/login", replace: true });
    if (allowed === null)
        return _jsx("div", { className: "page-shell", children: "Loading admin session\u2026" });
    if (!allowed)
        return _jsx("div", { className: "page-shell", children: "Access denied." });
    const saveEdit = async (record) => {
        if (!token)
            return;
        const payload = Object.fromEntries(Object.entries(editForm).map(([field, value]) => [field, numericFields.has(field) ? Number(value) : value]));
        if ("recommendation" in record)
            await updateMemo(token, record.id, payload);
        else if ("month" in record)
            await updateMarketOutlook(token, record.id, payload);
        else if ("valuationConclusion" in record)
            await updateValuationModel(token, record.id, payload);
        else
            await updateIndustryReport(token, record.id, payload);
        setEditingId(null);
        await load();
    };
    const remove = async (record) => {
        if (!token)
            return;
        if ("recommendation" in record)
            await deleteMemo(token, record.id);
        else if ("month" in record)
            await deleteMarketOutlook(token, record.id);
        else if ("valuationConclusion" in record)
            await deleteValuationModel(token, record.id);
        else
            await deleteIndustryReport(token, record.id);
        await load();
    };
    const beginEdit = (record) => {
        const values = {};
        for (const field of editableFields(record))
            values[field] = record[field] ?? "";
        setEditForm(values);
        setEditingId(record.id);
        setReadingId(null);
    };
    return _jsxs("div", { className: "page-shell", children: [_jsx("section", { className: "section-header", children: _jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Admin Storage" }), _jsx("h1", { children: "Manage Research" }), _jsx("p", { className: "muted", children: "Search a company to manage its associated research records." })] }) }), _jsxs("section", { className: "card content-card", children: [_jsxs("label", { children: ["Search by company name or ticker", _jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "e.g. ACME or Acme Corporation" })] }), _jsx("div", { className: "stack-list", children: matchingCompanies.map((company) => _jsxs("button", { type: "button", className: "stack-row", onClick: () => setSelectedCompanyId(company.id), children: [_jsx("strong", { children: company.name }), _jsxs("span", { children: [company.ticker, " \u00B7 ", company.sector] })] }, company.id)) })] }), selectedCompany ? _jsxs("section", { className: "content-card", children: [_jsx("p", { className: "eyebrow", children: "Selected Company" }), _jsx("h2", { children: _jsxs(Link, { to: `/companies/${selectedCompany.id}`, children: [selectedCompany.name, " (", selectedCompany.ticker, ")"] }) }), selectedRecords.length ? _jsx("div", { className: "stack-list", children: selectedRecords.map((record) => editingId === record.id ? _jsxs("div", { className: "admin-form", children: [editableFields(record).map((field) => _jsxs("label", { children: [fieldLabel(field), field === "status" ? _jsxs("select", { value: String(editForm[field] ?? "draft"), onChange: (event) => setEditForm({ ...editForm, [field]: event.target.value }), children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] }) : field === "recommendation" ? _jsxs("select", { value: String(editForm[field] ?? "hold"), onChange: (event) => setEditForm({ ...editForm, [field]: event.target.value }), children: [_jsx("option", { value: "buy", children: "Buy" }), _jsx("option", { value: "overweight", children: "Overweight" }), _jsx("option", { value: "hold", children: "Hold" }), _jsx("option", { value: "underweight", children: "Underweight" }), _jsx("option", { value: "sell", children: "Sell" })] }) : ["executiveSummary", "thesis", "keyCatalysts", "keyRisks", "valuationConclusion", "overview", "growth", "porterFiveForces", "valueChain", "competitors", "supplyChain", "demandDrivers", "technologyTrends", "regulation", "risks", "investmentImplications", "federalReserve", "interestRates", "inflation", "gdp", "employment", "geopolitics", "currencies", "commodities", "technology", "ai", "semiconductors", "healthcare", "consumer", "financials", "marketValuation", "sectorOutlook", "portfolioPositioning", "conclusion"].includes(field) ? _jsx("textarea", { rows: 4, value: String(editForm[field] ?? ""), onChange: (event) => setEditForm({ ...editForm, [field]: event.target.value }) }) : _jsx("input", { type: numericFields.has(field) ? "number" : "text", step: numericFields.has(field) ? "any" : undefined, value: String(editForm[field] ?? ""), onChange: (event) => setEditForm({ ...editForm, [field]: numericFields.has(field) ? Number(event.target.value) : event.target.value }) })] }, field)), _jsxs("div", { className: "inline-actions", children: [_jsx("button", { type: "button", onClick: () => void saveEdit(record), children: "Save" }), _jsx("button", { type: "button", className: "ghost-button", onClick: () => setEditingId(null), children: "Cancel" })] })] }, record.id) : readingId === record.id ? _jsxs("article", { className: "content-card", children: [_jsx("h3", { children: record.title }), editableFields(record).filter((field) => field !== "companyId").map((field) => _jsxs("p", { children: [_jsxs("strong", { children: [fieldLabel(field), ":"] }), " ", String(record[field] ?? "")] }, field)), _jsx("button", { type: "button", className: "ghost-button", onClick: () => setReadingId(null), children: "Close" })] }, record.id) : _jsxs("article", { className: "stack-row", children: [_jsxs("div", { children: [_jsx("strong", { children: record.title }), _jsxs("span", { children: [recordType(record), " \u00B7 ", record.status] })] }), _jsxs("div", { className: "inline-actions", children: [_jsx("button", { type: "button", className: "ghost-button", onClick: () => setReadingId(record.id), children: "Read" }), _jsx("button", { type: "button", className: "ghost-button", onClick: () => beginEdit(record), children: "Edit" }), _jsx("button", { type: "button", className: "danger-button", onClick: () => void remove(record), children: "Delete" })] })] }, record.id)) }) : _jsx("p", { className: "muted", children: "No research is associated with this company." })] }) : null] });
}
