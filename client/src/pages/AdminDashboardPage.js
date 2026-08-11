import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { IndustryReportsAdminPanel } from "../components/admin/IndustryReportsAdminPanel.js";
import { MarketOutlooksAdminPanel } from "../components/admin/MarketOutlooksAdminPanel.js";
import { ResearchJournalAdminPanel } from "../components/admin/ResearchJournalAdminPanel.js";
import { ContactMessagesAdminPanel } from "../components/admin/ContactMessagesAdminPanel.js";
import { createCompany, createIndustryReport, createMarketOutlook, createResearchJournal, createMemo, deleteCompany, deleteMemo, fetchAdminCompanies, fetchAdminIndustryReports, fetchAdminMarketOutlooks, fetchAdminResearchJournal, fetchAdminMemos, fetchAdminMe, fetchOverview, updateIndustryReport, updateMarketOutlook, updateResearchJournal, updateCompany, updateMemo } from "../services/adminApi.js";
const emptyCompany = {
    name: "",
    ticker: "",
    exchange: "",
    sector: "",
    industry: "",
    description: "",
    status: "draft"
};
const emptyMemo = {
    companyId: "",
    authorId: null,
    title: "",
    slug: "",
    recommendation: "hold",
    targetPrice: 0,
    currentPrice: 0,
    expectedReturn: 0,
    investmentHorizon: "12 months",
    convictionLevel: 5,
    executiveSummary: "",
    thesis: "",
    status: "draft",
    publishedAt: null
};
const emptyIndustryReport = {
    companyId: null,
    title: "",
    slug: "",
    executiveSummary: "",
    overview: "",
    marketSize: "",
    tam: "",
    sam: "",
    som: "",
    growth: "",
    porterFiveForces: "",
    valueChain: "",
    competitors: "",
    supplyChain: "",
    demandDrivers: "",
    technologyTrends: "",
    regulation: "",
    risks: "",
    investmentImplications: "",
    status: "draft",
    publishedAt: null
};
const emptyMarketOutlook = {
    companyId: null,
    title: "",
    slug: "",
    month: "",
    executiveSummary: "",
    federalReserve: "",
    interestRates: "",
    inflation: "",
    gdp: "",
    employment: "",
    geopolitics: "",
    currencies: "",
    commodities: "",
    technology: "",
    ai: "",
    semiconductors: "",
    healthcare: "",
    consumer: "",
    financials: "",
    marketValuation: "",
    sectorOutlook: "",
    portfolioPositioning: "",
    conclusion: "",
    status: "draft",
    publishedAt: null
};
const emptyResearchJournal = {
    companyId: null,
    title: "",
    slug: "",
    prompt: "",
    body: "",
    reflections: "",
    status: "draft",
    publishedAt: null
};
export function AdminDashboardPage() {
    const token = localStorage.getItem("atlas-admin-token");
    const [meLoaded, setMeLoaded] = useState(false);
    const [allowed, setAllowed] = useState(false);
    const [overview, setOverview] = useState({ companyCount: 0, memoCount: 0, reportCount: 0, outlookCount: 0, journalCount: 0, draftCount: 0, contactCount: 0 });
    const [companies, setCompanies] = useState([]);
    const [memos, setMemos] = useState([]);
    const [industryReports, setIndustryReports] = useState([]);
    const [marketOutlooks, setMarketOutlooks] = useState([]);
    const [journalEntries, setJournalEntries] = useState([]);
    const [companyForm, setCompanyForm] = useState(emptyCompany);
    const [memoForm, setMemoForm] = useState(emptyMemo);
    const [industryReportForm, setIndustryReportForm] = useState(emptyIndustryReport);
    const [marketOutlookForm, setMarketOutlookForm] = useState(emptyMarketOutlook);
    const [researchJournalForm, setResearchJournalForm] = useState(emptyResearchJournal);
    const [companyMode, setCompanyMode] = useState("create");
    const [memoMode, setMemoMode] = useState("create");
    const [industryReportMode, setIndustryReportMode] = useState("create");
    const [marketOutlookMode, setMarketOutlookMode] = useState("create");
    const [researchJournalMode, setResearchJournalMode] = useState("create");
    const [editingCompanyId, setEditingCompanyId] = useState(null);
    const [editingMemoId, setEditingMemoId] = useState(null);
    const [editingIndustryReportId, setEditingIndustryReportId] = useState(null);
    const [editingMarketOutlookId, setEditingMarketOutlookId] = useState(null);
    const [editingResearchJournalId, setEditingResearchJournalId] = useState(null);
    const [memoValidationError, setMemoValidationError] = useState(null);
    const [companyRefreshKey, setCompanyRefreshKey] = useState(0);
    const refreshCompanies = async (authToken) => {
        const refreshed = await fetchAdminCompanies(authToken);
        setCompanies(refreshed);
        setCompanyRefreshKey((current) => current + 1);
        return refreshed;
    };
    useEffect(() => {
        if (!token) {
            setMeLoaded(true);
            return;
        }
        let active = true;
        void fetchAdminMe(token)
            .then((user) => {
            if (!active)
                return;
            setAllowed(user.role === "admin" || user.role === "editor");
        })
            .catch(() => {
            if (active)
                setAllowed(false);
        })
            .finally(() => {
            if (active)
                setMeLoaded(true);
        });
        return () => {
            active = false;
        };
    }, [token]);
    useEffect(() => {
        if (!token || !allowed)
            return;
        let active = true;
        void Promise.all([
            fetchOverview(token),
            fetchAdminCompanies(token),
            fetchAdminMemos(token),
            fetchAdminIndustryReports(token),
            fetchAdminMarketOutlooks(token),
            fetchAdminResearchJournal(token)
        ])
            .then(([overviewData, companyItems, memoItems, reportItems, outlookItems, journalItems]) => {
            if (!active)
                return;
            setOverview(overviewData.stats);
            setCompanies(companyItems);
            setMemos(memoItems);
            setIndustryReports(reportItems);
            setMarketOutlooks(outlookItems);
            setJournalEntries(journalItems);
            if (!memoForm.companyId && companyItems[0]) {
                setMemoForm((current) => ({ ...current, companyId: companyItems[0].id }));
            }
            if (!industryReportForm.companyId && companyItems[0]) {
                setIndustryReportForm((current) => ({ ...current, companyId: companyItems[0].id }));
            }
            if (!marketOutlookForm.companyId && companyItems[0]) {
                setMarketOutlookForm((current) => ({ ...current, companyId: companyItems[0].id }));
            }
            if (!researchJournalForm.companyId && companyItems[0]) {
                setResearchJournalForm((current) => ({ ...current, companyId: companyItems[0].id }));
            }
        });
        return () => {
            active = false;
        };
    }, [token, allowed]);
    if (!meLoaded) {
        return _jsx("div", { className: "page-shell", children: "Loading admin session\u2026" });
    }
    if (!token) {
        return _jsx(Navigate, { to: "/admin/login", replace: true });
    }
    if (!allowed) {
        return _jsx("div", { className: "page-shell", children: "Access denied." });
    }
    const submitCompany = async (event) => {
        event.preventDefault();
        if (!token)
            return;
        const payload = {
            ...companyForm,
            description: companyForm.description?.trim() ? companyForm.description.trim() : null
        };
        if (companyMode === "create") {
            await createCompany(token, payload);
        }
        else if (editingCompanyId) {
            await updateCompany(token, editingCompanyId, payload);
        }
        await refreshCompanies(token);
        setCompanyForm(emptyCompany);
        setCompanyMode("create");
        setEditingCompanyId(null);
    };
    const submitMemo = async (event) => {
        event.preventDefault();
        if (!token)
            return;
        const errors = [];
        if (memoForm.targetPrice <= 0) {
            errors.push("Target price must be greater than 0.");
        }
        if (memoForm.currentPrice <= 0) {
            errors.push("Current price must be greater than 0.");
        }
        if (memoForm.executiveSummary.trim().length < 20) {
            errors.push("Executive summary must be at least 20 characters.");
        }
        if (memoForm.thesis.trim().length < 20) {
            errors.push("Thesis must be at least 20 characters.");
        }
        if (errors.length) {
            setMemoValidationError(errors.join(" "));
            return;
        }
        setMemoValidationError(null);
        const payload = {
            ...memoForm,
            authorId: memoForm.authorId?.trim() ? memoForm.authorId : null,
            publishedAt: memoForm.publishedAt?.trim() ? memoForm.publishedAt : null
        };
        if (memoMode === "create") {
            await createMemo(token, payload);
        }
        else if (editingMemoId) {
            await updateMemo(token, editingMemoId, payload);
        }
        const refreshed = await fetchAdminMemos(token);
        setMemos(refreshed);
        setMemoForm((current) => ({ ...emptyMemo, companyId: current.companyId || companies[0]?.id || "" }));
        setMemoMode("create");
        setEditingMemoId(null);
    };
    const submitIndustryReport = async (event) => {
        event.preventDefault();
        if (!token)
            return;
        const payload = {
            ...industryReportForm,
            companyId: industryReportForm.companyId || null,
            publishedAt: industryReportForm.publishedAt?.trim() ? industryReportForm.publishedAt : null
        };
        if (industryReportMode === "create") {
            await createIndustryReport(token, payload);
        }
        else if (editingIndustryReportId) {
            await updateIndustryReport(token, editingIndustryReportId, payload);
        }
        setIndustryReports(await fetchAdminIndustryReports(token));
        setIndustryReportForm((current) => ({ ...emptyIndustryReport, companyId: current.companyId || companies[0]?.id || null }));
        setIndustryReportMode("create");
        setEditingIndustryReportId(null);
    };
    const submitMarketOutlook = async (event) => {
        event.preventDefault();
        if (!token)
            return;
        const payload = {
            ...marketOutlookForm,
            companyId: marketOutlookForm.companyId || null,
            publishedAt: marketOutlookForm.publishedAt?.trim() ? marketOutlookForm.publishedAt : null
        };
        if (marketOutlookMode === "create") {
            await createMarketOutlook(token, payload);
        }
        else if (editingMarketOutlookId) {
            await updateMarketOutlook(token, editingMarketOutlookId, payload);
        }
        setMarketOutlooks(await fetchAdminMarketOutlooks(token));
        setMarketOutlookForm((current) => ({ ...emptyMarketOutlook, companyId: current.companyId || companies[0]?.id || null }));
        setMarketOutlookMode("create");
        setEditingMarketOutlookId(null);
    };
    const submitResearchJournal = async (event) => {
        event.preventDefault();
        if (!token)
            return;
        const payload = {
            ...researchJournalForm,
            companyId: researchJournalForm.companyId || null,
            publishedAt: researchJournalForm.publishedAt?.trim() ? researchJournalForm.publishedAt : null
        };
        if (researchJournalMode === "create") {
            await createResearchJournal(token, payload);
        }
        else if (editingResearchJournalId) {
            await updateResearchJournal(token, editingResearchJournalId, payload);
        }
        setJournalEntries(await fetchAdminResearchJournal(token));
        setResearchJournalForm((current) => ({ ...emptyResearchJournal, companyId: current.companyId || companies[0]?.id || null }));
        setResearchJournalMode("create");
        setEditingResearchJournalId(null);
    };
    return (_jsxs("div", { className: "page-shell admin-shell", children: [_jsxs("section", { className: "section-header", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Admin Dashboard" }), _jsx("h1", { children: "Content Operations" }), _jsx("p", { className: "muted", children: "Create, edit, publish, and remove companies and memos from one control surface." })] }), _jsxs("div", { className: "admin-stats", children: [_jsxs("div", { children: [_jsx("span", { children: "Companies" }), _jsx("strong", { children: overview.companyCount })] }), _jsxs("div", { children: [_jsx("span", { children: "Memos" }), _jsx("strong", { children: overview.memoCount })] }), _jsxs("div", { children: [_jsx("span", { children: "Reports" }), _jsx("strong", { children: overview.reportCount })] }), _jsxs("div", { children: [_jsx("span", { children: "Outlooks" }), _jsx("strong", { children: overview.outlookCount })] }), _jsxs("div", { children: [_jsx("span", { children: "Journal" }), _jsx("strong", { children: overview.journalCount })] }), _jsxs("div", { children: [_jsx("span", { children: "Drafts" }), _jsx("strong", { children: overview.draftCount })] }), _jsxs("div", { children: [_jsx("span", { children: "Messages" }), _jsx("strong", { children: overview.contactCount })] })] })] }), _jsxs("section", { className: "admin-grid", children: [_jsxs("article", { className: "card admin-panel", children: [_jsxs("div", { className: "panel-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Company" }), _jsx("h2", { children: companyMode === "create" ? "Create Company" : "Edit Company" })] }), _jsx("button", { type: "button", className: "ghost-button", onClick: () => { setCompanyMode("create"); setCompanyForm(emptyCompany); }, children: "Reset" })] }), _jsxs("form", { className: "admin-form", onSubmit: submitCompany, children: [_jsx("input", { placeholder: "Name", value: companyForm.name, onChange: (event) => setCompanyForm({ ...companyForm, name: event.target.value }), required: true }), _jsx("input", { placeholder: "Ticker", value: companyForm.ticker, onChange: (event) => setCompanyForm({ ...companyForm, ticker: event.target.value.toUpperCase() }), required: true }), _jsx("input", { placeholder: "Exchange", value: companyForm.exchange, onChange: (event) => setCompanyForm({ ...companyForm, exchange: event.target.value }), required: true }), _jsx("input", { placeholder: "Sector", value: companyForm.sector, onChange: (event) => setCompanyForm({ ...companyForm, sector: event.target.value }), required: true }), _jsx("input", { placeholder: "Industry", value: companyForm.industry, onChange: (event) => setCompanyForm({ ...companyForm, industry: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Description", value: companyForm.description ?? "", onChange: (event) => setCompanyForm({ ...companyForm, description: event.target.value }), rows: 5 }), _jsxs("select", { value: companyForm.status, onChange: (event) => setCompanyForm({ ...companyForm, status: event.target.value }), children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] }), _jsx("button", { type: "submit", children: "Save Company" })] }), _jsx("div", { className: "admin-list", children: companies.map((company) => (_jsxs("article", { className: "admin-list-item", children: [_jsxs("div", { children: [_jsx("strong", { children: company.name }), _jsxs("span", { children: [company.ticker, " \u00B7 ", company.status, " \u00B7 ", company._count.memos, " memos"] })] }), _jsxs("div", { className: "inline-actions", children: [_jsx("button", { type: "button", className: "ghost-button", onClick: () => {
                                                        setCompanyMode("edit");
                                                        setCompanyForm({
                                                            name: company.name,
                                                            ticker: company.ticker,
                                                            exchange: company.exchange,
                                                            sector: company.sector,
                                                            industry: company.industry,
                                                            description: company.description ?? "",
                                                            status: company.status
                                                        });
                                                        setEditingCompanyId(company.id);
                                                    }, children: "Edit" }), _jsx("button", { type: "button", className: "danger-button", onClick: async () => { if (!token)
                                                        return; await deleteCompany(token, company.id); await refreshCompanies(token); }, children: "Delete" })] })] }, company.id))) })] }), _jsxs("article", { className: "card admin-panel", children: [_jsxs("div", { className: "panel-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Memo" }), _jsx("h2", { children: memoMode === "create" ? "Create Memo" : "Edit Memo" })] }), _jsx("button", { type: "button", className: "ghost-button", onClick: () => { setMemoMode("create"); setMemoForm({ ...emptyMemo, companyId: companies[0]?.id ?? "" }); }, children: "Reset" })] }), _jsxs("form", { className: "admin-form", onSubmit: submitMemo, children: [_jsxs("select", { value: memoForm.companyId, onChange: (event) => setMemoForm({ ...memoForm, companyId: event.target.value }), required: true, children: [_jsx("option", { value: "", children: "Select company" }), companies.map((company) => (_jsxs("option", { value: company.id, children: [company.name, " (", company.ticker, ")"] }, company.id)))] }), _jsx("input", { placeholder: "Title", value: memoForm.title, onChange: (event) => setMemoForm({ ...memoForm, title: event.target.value }), required: true }), _jsx("input", { placeholder: "Slug", value: memoForm.slug, onChange: (event) => setMemoForm({ ...memoForm, slug: event.target.value }), required: true }), _jsxs("select", { value: memoForm.recommendation, onChange: (event) => setMemoForm({ ...memoForm, recommendation: event.target.value }), children: [_jsx("option", { value: "buy", children: "Buy" }), _jsx("option", { value: "overweight", children: "Overweight" }), _jsx("option", { value: "hold", children: "Hold" }), _jsx("option", { value: "underweight", children: "Underweight" }), _jsx("option", { value: "sell", children: "Sell" })] }), _jsxs("div", { className: "inline-grid", children: [_jsx("input", { type: "number", step: "0.01", min: "0.01", placeholder: "Target Price", value: memoForm.targetPrice, onChange: (event) => setMemoForm({ ...memoForm, targetPrice: Number(event.target.value) }), required: true }), _jsx("input", { type: "number", step: "0.01", min: "0.01", placeholder: "Current Price", value: memoForm.currentPrice, onChange: (event) => setMemoForm({ ...memoForm, currentPrice: Number(event.target.value) }), required: true })] }), _jsxs("div", { className: "inline-grid", children: [_jsx("input", { type: "number", step: "0.01", placeholder: "Expected Return", value: memoForm.expectedReturn, onChange: (event) => setMemoForm({ ...memoForm, expectedReturn: Number(event.target.value) }) }), _jsx("input", { type: "number", min: 1, max: 10, placeholder: "Conviction", value: memoForm.convictionLevel, onChange: (event) => setMemoForm({ ...memoForm, convictionLevel: Number(event.target.value) }) })] }), _jsx("input", { placeholder: "Investment Horizon", value: memoForm.investmentHorizon, onChange: (event) => setMemoForm({ ...memoForm, investmentHorizon: event.target.value }) }), _jsx("textarea", { placeholder: "Executive Summary", value: memoForm.executiveSummary, onChange: (event) => setMemoForm({ ...memoForm, executiveSummary: event.target.value }), rows: 5, minLength: 20, required: true }), _jsx("textarea", { placeholder: "Thesis", value: memoForm.thesis, onChange: (event) => setMemoForm({ ...memoForm, thesis: event.target.value }), rows: 6, minLength: 20, required: true }), memoValidationError ? _jsx("p", { className: "auth-error", children: memoValidationError }) : null, _jsxs("select", { value: memoForm.status, onChange: (event) => setMemoForm({ ...memoForm, status: event.target.value }), children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] }), _jsx("input", { placeholder: "Published At (ISO optional)", value: memoForm.publishedAt ?? "", onChange: (event) => setMemoForm({ ...memoForm, publishedAt: event.target.value }) }), _jsx("button", { type: "submit", children: "Save Memo" })] }), _jsx("div", { className: "admin-list", children: memos.map((memo) => (_jsxs("article", { className: "admin-list-item", children: [_jsxs("div", { children: [_jsx("strong", { children: memo.title }), _jsxs("span", { children: [memo.company.name, " \u00B7 ", memo.recommendation, " \u00B7 ", memo.status] })] }), _jsxs("div", { className: "inline-actions", children: [_jsx("button", { type: "button", className: "ghost-button", onClick: () => {
                                                        setMemoMode("edit");
                                                        setMemoForm({
                                                            companyId: memo.companyId,
                                                            authorId: memo.authorId,
                                                            title: memo.title,
                                                            slug: memo.slug,
                                                            recommendation: memo.recommendation,
                                                            targetPrice: Number(memo.targetPrice),
                                                            currentPrice: Number(memo.currentPrice),
                                                            expectedReturn: Number(memo.expectedReturn),
                                                            investmentHorizon: memo.investmentHorizon,
                                                            convictionLevel: memo.convictionLevel,
                                                            executiveSummary: memo.executiveSummary,
                                                            thesis: memo.thesis,
                                                            status: memo.status,
                                                            publishedAt: memo.publishedAt
                                                        });
                                                        setEditingMemoId(memo.id);
                                                    }, children: "Edit" }), _jsx("button", { type: "button", className: "danger-button", onClick: async () => { if (!token)
                                                        return; await deleteMemo(token, memo.id); setMemos(await fetchAdminMemos(token)); }, children: "Delete" })] })] }, memo.id))) })] })] }), _jsxs("section", { className: "admin-content-grid", children: [_jsx(IndustryReportsAdminPanel, { companyRefreshKey: companyRefreshKey }), _jsx(MarketOutlooksAdminPanel, { companyRefreshKey: companyRefreshKey }), _jsx(ResearchJournalAdminPanel, { companyRefreshKey: companyRefreshKey })] }), _jsx("section", { children: _jsx(ContactMessagesAdminPanel, {}) })] }));
}
