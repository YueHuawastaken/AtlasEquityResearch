import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { createIndustryReport, deleteIndustryReport, fetchAdminCompanies, fetchAdminIndustryReports, updateIndustryReport } from "../../services/adminApi.js";
import { AttachmentManager } from "./AttachmentManager.js";
const emptyForm = {
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
export function IndustryReportsAdminPanel({ companyRefreshKey = 0 }) {
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
        void Promise.all([fetchAdminCompanies(token), fetchAdminIndustryReports(token)]).then(([companyItems, reportItems]) => {
            if (!active)
                return;
            setCompanies(companyItems);
            setItems(reportItems);
            if (!form.companyId && companyItems[0]) {
                setForm((current) => ({ ...current, companyId: companyItems[0].id }));
            }
        });
        return () => {
            active = false;
        };
    }, [token, companyRefreshKey]);
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
            await createIndustryReport(token, payload);
        }
        else if (editingId) {
            await updateIndustryReport(token, editingId, payload);
        }
        setItems(await fetchAdminIndustryReports(token));
        setForm((current) => ({ ...emptyForm, companyId: current.companyId || companies[0]?.id || null }));
        setMode("create");
        setEditingId(null);
    };
    return (_jsxs("article", { className: "card admin-panel", children: [_jsxs("div", { className: "panel-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Industry Research" }), _jsx("h2", { children: mode === "create" ? "Create Industry Report" : "Edit Industry Report" })] }), _jsx("button", { type: "button", className: "ghost-button", onClick: () => { setMode("create"); setForm({ ...emptyForm, companyId: companies[0]?.id ?? null }); setEditingId(null); }, children: "Reset" })] }), _jsxs("form", { className: "admin-form", onSubmit: submit, children: [_jsxs("select", { value: form.companyId ?? "", onChange: (event) => setForm({ ...form, companyId: event.target.value || null }), children: [_jsx("option", { value: "", children: "No company" }), companies.map((company) => (_jsxs("option", { value: company.id, children: [company.name, " (", company.ticker, ")"] }, company.id)))] }), _jsx("input", { placeholder: "Title", value: form.title, onChange: (event) => setForm({ ...form, title: event.target.value }), required: true }), _jsx("input", { placeholder: "Slug", value: form.slug, onChange: (event) => setForm({ ...form, slug: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Executive Summary", rows: 4, value: form.executiveSummary, onChange: (event) => setForm({ ...form, executiveSummary: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Overview", rows: 4, value: form.overview, onChange: (event) => setForm({ ...form, overview: event.target.value }), required: true }), _jsxs("div", { className: "content-grid-two", children: [_jsx("input", { placeholder: "Market Size", value: form.marketSize, onChange: (event) => setForm({ ...form, marketSize: event.target.value }), required: true }), _jsx("input", { placeholder: "TAM", value: form.tam, onChange: (event) => setForm({ ...form, tam: event.target.value }), required: true })] }), _jsxs("div", { className: "content-grid-two", children: [_jsx("input", { placeholder: "SAM", value: form.sam, onChange: (event) => setForm({ ...form, sam: event.target.value }), required: true }), _jsx("input", { placeholder: "SOM", value: form.som, onChange: (event) => setForm({ ...form, som: event.target.value }), required: true })] }), _jsx("textarea", { placeholder: "Growth", rows: 3, value: form.growth, onChange: (event) => setForm({ ...form, growth: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Porter Five Forces", rows: 4, value: form.porterFiveForces, onChange: (event) => setForm({ ...form, porterFiveForces: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Value Chain", rows: 3, value: form.valueChain, onChange: (event) => setForm({ ...form, valueChain: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Competitors", rows: 3, value: form.competitors, onChange: (event) => setForm({ ...form, competitors: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Supply Chain", rows: 3, value: form.supplyChain, onChange: (event) => setForm({ ...form, supplyChain: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Demand Drivers", rows: 3, value: form.demandDrivers, onChange: (event) => setForm({ ...form, demandDrivers: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Technology Trends", rows: 3, value: form.technologyTrends, onChange: (event) => setForm({ ...form, technologyTrends: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Regulation", rows: 3, value: form.regulation, onChange: (event) => setForm({ ...form, regulation: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Risks", rows: 3, value: form.risks, onChange: (event) => setForm({ ...form, risks: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Investment Implications", rows: 4, value: form.investmentImplications, onChange: (event) => setForm({ ...form, investmentImplications: event.target.value }), required: true }), _jsxs("select", { value: form.status, onChange: (event) => setForm({ ...form, status: event.target.value }), children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] }), _jsx("input", { placeholder: "Published At (ISO optional)", value: form.publishedAt ?? "", onChange: (event) => setForm({ ...form, publishedAt: event.target.value }) }), _jsx("button", { type: "submit", children: "Save Report" })] }), _jsx("div", { className: "admin-list", children: items.map((item) => (_jsxs("article", { className: "admin-list-item", children: [_jsxs("div", { children: [_jsx("strong", { children: item.title }), _jsxs("span", { children: [item.company ? `${item.company.name} · ` : "", item.status] })] }), _jsxs("div", { className: "inline-actions", children: [_jsx("button", { type: "button", className: "ghost-button", onClick: () => {
                                        setMode("edit");
                                        setEditingId(item.id);
                                        setForm({
                                            companyId: item.company?.id ?? null,
                                            title: item.title,
                                            slug: item.slug,
                                            executiveSummary: item.executiveSummary,
                                            overview: item.overview,
                                            marketSize: item.marketSize,
                                            tam: item.tam,
                                            sam: item.sam,
                                            som: item.som,
                                            growth: item.growth,
                                            porterFiveForces: item.porterFiveForces,
                                            valueChain: item.valueChain,
                                            competitors: item.competitors,
                                            supplyChain: item.supplyChain,
                                            demandDrivers: item.demandDrivers,
                                            technologyTrends: item.technologyTrends,
                                            regulation: item.regulation,
                                            risks: item.risks,
                                            investmentImplications: item.investmentImplications,
                                            status: item.status,
                                            publishedAt: item.publishedAt
                                        });
                                    }, children: "Edit" }), _jsx("button", { type: "button", className: "danger-button", onClick: async () => { await deleteIndustryReport(token, item.id); setItems(await fetchAdminIndustryReports(token)); }, children: "Delete" })] })] }, item.id))) }), _jsx(AttachmentManager, { scope: "industryReport", parentId: editingId ?? items[0]?.id ?? null, title: "Industry Report Files" })] }));
}
