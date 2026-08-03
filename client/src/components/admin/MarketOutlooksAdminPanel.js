import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { createMarketOutlook, deleteMarketOutlook, fetchAdminCompanies, fetchAdminMarketOutlooks, updateMarketOutlook } from "../../services/adminApi.js";
import { AttachmentManager } from "./AttachmentManager.js";
const emptyForm = {
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
export function MarketOutlooksAdminPanel() {
    const token = localStorage.getItem("atlas-admin-token");
    const [companies, setCompanies] = useState([]);
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [mode, setMode] = useState("create");
    const [editingId, setEditingId] = useState(null);
    useEffect(() => {
        if (!token)
            return;
        let active = true;
        void Promise.all([fetchAdminCompanies(token), fetchAdminMarketOutlooks(token)]).then(([companyItems, outlookItems]) => {
            if (!active)
                return;
            setCompanies(companyItems);
            setItems(outlookItems);
            if (!form.companyId && companyItems[0]) {
                setForm((current) => ({ ...current, companyId: companyItems[0].id }));
            }
        });
        return () => {
            active = false;
        };
    }, [token]);
    if (!token) {
        return null;
    }
    const submit = async (event) => {
        event.preventDefault();
        const payload = {
            ...form,
            companyId: form.companyId || null,
            publishedAt: form.publishedAt?.trim() ? form.publishedAt : null
        };
        if (mode === "create") {
            await createMarketOutlook(token, payload);
        }
        else if (editingId) {
            await updateMarketOutlook(token, editingId, payload);
        }
        setItems(await fetchAdminMarketOutlooks(token));
        setForm((current) => ({ ...emptyForm, companyId: current.companyId || companies[0]?.id || null }));
        setMode("create");
        setEditingId(null);
    };
    return (_jsxs("article", { className: "card admin-panel", children: [_jsxs("div", { className: "panel-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Market Outlook" }), _jsx("h2", { children: mode === "create" ? "Create Outlook" : "Edit Outlook" })] }), _jsx("button", { type: "button", className: "ghost-button", onClick: () => { setMode("create"); setForm({ ...emptyForm, companyId: companies[0]?.id ?? null }); setEditingId(null); }, children: "Reset" })] }), _jsxs("form", { className: "admin-form", onSubmit: submit, children: [_jsxs("select", { value: form.companyId ?? "", onChange: (event) => setForm({ ...form, companyId: event.target.value || null }), children: [_jsx("option", { value: "", children: "No company" }), companies.map((company) => (_jsxs("option", { value: company.id, children: [company.name, " (", company.ticker, ")"] }, company.id)))] }), _jsx("input", { placeholder: "Title", value: form.title, onChange: (event) => setForm({ ...form, title: event.target.value }), required: true }), _jsx("input", { placeholder: "Slug", value: form.slug, onChange: (event) => setForm({ ...form, slug: event.target.value }), required: true }), _jsx("input", { placeholder: "Month", value: form.month, onChange: (event) => setForm({ ...form, month: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Executive Summary", rows: 4, value: form.executiveSummary, onChange: (event) => setForm({ ...form, executiveSummary: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Federal Reserve", rows: 3, value: form.federalReserve, onChange: (event) => setForm({ ...form, federalReserve: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Interest Rates", rows: 3, value: form.interestRates, onChange: (event) => setForm({ ...form, interestRates: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Inflation", rows: 3, value: form.inflation, onChange: (event) => setForm({ ...form, inflation: event.target.value }), required: true }), _jsx("textarea", { placeholder: "GDP", rows: 3, value: form.gdp, onChange: (event) => setForm({ ...form, gdp: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Employment", rows: 3, value: form.employment, onChange: (event) => setForm({ ...form, employment: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Geopolitics", rows: 3, value: form.geopolitics, onChange: (event) => setForm({ ...form, geopolitics: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Currencies", rows: 3, value: form.currencies, onChange: (event) => setForm({ ...form, currencies: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Commodities", rows: 3, value: form.commodities, onChange: (event) => setForm({ ...form, commodities: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Technology", rows: 3, value: form.technology, onChange: (event) => setForm({ ...form, technology: event.target.value }), required: true }), _jsx("textarea", { placeholder: "AI", rows: 3, value: form.ai, onChange: (event) => setForm({ ...form, ai: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Semiconductors", rows: 3, value: form.semiconductors, onChange: (event) => setForm({ ...form, semiconductors: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Healthcare", rows: 3, value: form.healthcare, onChange: (event) => setForm({ ...form, healthcare: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Consumer", rows: 3, value: form.consumer, onChange: (event) => setForm({ ...form, consumer: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Financials", rows: 3, value: form.financials, onChange: (event) => setForm({ ...form, financials: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Market Valuation", rows: 3, value: form.marketValuation, onChange: (event) => setForm({ ...form, marketValuation: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Sector Outlook", rows: 3, value: form.sectorOutlook, onChange: (event) => setForm({ ...form, sectorOutlook: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Portfolio Positioning", rows: 3, value: form.portfolioPositioning, onChange: (event) => setForm({ ...form, portfolioPositioning: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Conclusion", rows: 4, value: form.conclusion, onChange: (event) => setForm({ ...form, conclusion: event.target.value }), required: true }), _jsxs("select", { value: form.status, onChange: (event) => setForm({ ...form, status: event.target.value }), children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] }), _jsx("input", { placeholder: "Published At (ISO optional)", value: form.publishedAt ?? "", onChange: (event) => setForm({ ...form, publishedAt: event.target.value }) }), _jsx("button", { type: "submit", children: "Save Outlook" })] }), _jsx("div", { className: "admin-list", children: items.map((item) => (_jsxs("article", { className: "admin-list-item", children: [_jsxs("div", { children: [_jsx("strong", { children: item.title }), _jsxs("span", { children: [item.company ? `${item.company.name} · ` : "", item.status] })] }), _jsxs("div", { className: "inline-actions", children: [_jsx("button", { type: "button", className: "ghost-button", onClick: () => {
                                        setMode("edit");
                                        setEditingId(item.id);
                                        setForm({
                                            companyId: item.company?.id ?? null,
                                            title: item.title,
                                            slug: item.slug,
                                            month: item.month,
                                            executiveSummary: item.executiveSummary,
                                            federalReserve: item.federalReserve,
                                            interestRates: item.interestRates,
                                            inflation: item.inflation,
                                            gdp: item.gdp,
                                            employment: item.employment,
                                            geopolitics: item.geopolitics,
                                            currencies: item.currencies,
                                            commodities: item.commodities,
                                            technology: item.technology,
                                            ai: item.ai,
                                            semiconductors: item.semiconductors,
                                            healthcare: item.healthcare,
                                            consumer: item.consumer,
                                            financials: item.financials,
                                            marketValuation: item.marketValuation,
                                            sectorOutlook: item.sectorOutlook,
                                            portfolioPositioning: item.portfolioPositioning,
                                            conclusion: item.conclusion,
                                            status: item.status,
                                            publishedAt: item.publishedAt
                                        });
                                    }, children: "Edit" }), _jsx("button", { type: "button", className: "danger-button", onClick: async () => { await deleteMarketOutlook(token, item.id); setItems(await fetchAdminMarketOutlooks(token)); }, children: "Delete" })] })] }, item.id))) }), _jsx(AttachmentManager, { scope: "marketOutlook", parentId: editingId ?? items[0]?.id ?? null, title: "Market Outlook Files" })] }));
}
