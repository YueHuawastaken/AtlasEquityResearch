import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { createIndustryReport, fetchAdminCompanies, fetchAdminIndustryReports, getAdminApiErrorMessage, updateIndustryReport } from "../../services/adminApi.js";
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
    const [validationError, setValidationError] = useState(null);
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
        const minimumLengths = [
            ["Title", form.title, 2],
            ["Slug", form.slug, 2],
            ["Executive Summary", form.executiveSummary, 20],
            ["Overview", form.overview, 20]
        ];
        const emptyFields = Object.entries(form).filter(([field, value]) => field !== "companyId" && field !== "authorId" && field !== "publishedAt" && field !== "status" && typeof value === "string" && !value.trim()).map(([field]) => field);
        const tooShort = minimumLengths.find(([, value, minimum]) => value.trim().length < minimum);
        if (emptyFields.length || tooShort) {
            setValidationError(tooShort ? `${tooShort[0]} must be at least ${tooShort[2]} characters.` : `Complete these fields: ${emptyFields.join(", ")}.`);
            return;
        }
        setValidationError(null);
        const payload = {
            ...form,
            companyId: form.companyId || null,
            publishedAt: form.publishedAt?.trim() ? form.publishedAt : null
        };
        try {
            if (mode === "create") {
                await createIndustryReport(token, payload);
            }
            else if (editingId) {
                await updateIndustryReport(token, editingId, payload);
            }
        }
        catch (error) {
            setValidationError(getAdminApiErrorMessage(error, "Unable to save the industry report."));
            return;
        }
        setForm((current) => ({ ...emptyForm, companyId: current.companyId || companies[0]?.id || null }));
        setMode("create");
        setEditingId(null);
    };
    return (_jsxs("article", { className: "card admin-panel", children: [_jsxs("div", { className: "panel-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Industry Research" }), _jsx("h2", { children: mode === "create" ? "Create Industry Report" : "Edit Industry Report" })] }), _jsx("button", { type: "button", className: "ghost-button", onClick: () => { setMode("create"); setForm({ ...emptyForm, companyId: companies[0]?.id ?? null }); setEditingId(null); }, children: "Reset" })] }), _jsxs("form", { className: "admin-form", onSubmit: submit, children: [validationError ? _jsx("p", { className: "auth-error", children: validationError }) : null, _jsxs("label", { children: ["Company (optional)", _jsxs("select", { value: form.companyId ?? "", onChange: (event) => setForm({ ...form, companyId: event.target.value || null }), children: [_jsx("option", { value: "", children: "No company" }), companies.map((company) => _jsxs("option", { value: company.id, children: [company.name, " (", company.ticker, ")"] }, company.id))] })] }), _jsxs("label", { children: ["Report title", _jsx("input", { placeholder: "e.g. Cloud Infrastructure Industry Report", value: form.title, onChange: (event) => setForm({ ...form, title: event.target.value }), required: true, minLength: 2 })] }), _jsxs("label", { children: ["URL slug", _jsx("input", { placeholder: "e.g. cloud-infrastructure-2026", value: form.slug, onChange: (event) => setForm({ ...form, slug: event.target.value }), required: true, minLength: 2 })] }), _jsxs("label", { children: ["Executive summary", _jsx("textarea", { placeholder: "Summarize the industry and its investment relevance (at least 20 characters).", rows: 4, value: form.executiveSummary, onChange: (event) => setForm({ ...form, executiveSummary: event.target.value }), required: true, minLength: 20 })] }), _jsxs("label", { children: ["Industry overview", _jsx("textarea", { placeholder: "Describe the industry structure and key participants (at least 20 characters).", rows: 4, value: form.overview, onChange: (event) => setForm({ ...form, overview: event.target.value }), required: true, minLength: 20 })] }), _jsxs("div", { className: "content-grid-two", children: [_jsxs("label", { children: ["Market size", _jsx("input", { placeholder: "Current market size and period", value: form.marketSize, onChange: (event) => setForm({ ...form, marketSize: event.target.value }), required: true })] }), _jsxs("label", { children: ["TAM", _jsx("input", { placeholder: "Total addressable market", value: form.tam, onChange: (event) => setForm({ ...form, tam: event.target.value }), required: true })] })] }), _jsxs("div", { className: "content-grid-two", children: [_jsxs("label", { children: ["SAM", _jsx("input", { placeholder: "Serviceable addressable market", value: form.sam, onChange: (event) => setForm({ ...form, sam: event.target.value }), required: true })] }), _jsxs("label", { children: ["SOM", _jsx("input", { placeholder: "Serviceable obtainable market", value: form.som, onChange: (event) => setForm({ ...form, som: event.target.value }), required: true })] })] }), _jsxs("label", { children: ["Growth outlook", _jsx("textarea", { placeholder: "Growth rate, drivers, and forecast assumptions", rows: 3, value: form.growth, onChange: (event) => setForm({ ...form, growth: event.target.value }), required: true })] }), _jsxs("label", { children: ["Porter Five Forces", _jsx("textarea", { placeholder: "Supplier power, buyer power, rivalry, substitutes, and new entrants", rows: 4, value: form.porterFiveForces, onChange: (event) => setForm({ ...form, porterFiveForces: event.target.value }), required: true })] }), _jsxs("label", { children: ["Value chain", _jsx("textarea", { placeholder: "Describe the industry's value chain and economics", rows: 3, value: form.valueChain, onChange: (event) => setForm({ ...form, valueChain: event.target.value }), required: true })] }), _jsxs("label", { children: ["Competitors", _jsx("textarea", { placeholder: "Key competitors, positioning, and market shares", rows: 3, value: form.competitors, onChange: (event) => setForm({ ...form, competitors: event.target.value }), required: true })] }), _jsxs("label", { children: ["Supply chain", _jsx("textarea", { placeholder: "Inputs, suppliers, bottlenecks, and dependencies", rows: 3, value: form.supplyChain, onChange: (event) => setForm({ ...form, supplyChain: event.target.value }), required: true })] }), _jsxs("label", { children: ["Demand drivers", _jsx("textarea", { placeholder: "What drives demand and changes the market", rows: 3, value: form.demandDrivers, onChange: (event) => setForm({ ...form, demandDrivers: event.target.value }), required: true })] }), _jsxs("label", { children: ["Technology trends", _jsx("textarea", { placeholder: "Relevant technologies and adoption trends", rows: 3, value: form.technologyTrends, onChange: (event) => setForm({ ...form, technologyTrends: event.target.value }), required: true })] }), _jsxs("label", { children: ["Regulation", _jsx("textarea", { placeholder: "Regulatory environment and expected changes", rows: 3, value: form.regulation, onChange: (event) => setForm({ ...form, regulation: event.target.value }), required: true })] }), _jsxs("label", { children: ["Risks", _jsx("textarea", { placeholder: "Principal industry and investment risks", rows: 3, value: form.risks, onChange: (event) => setForm({ ...form, risks: event.target.value }), required: true })] }), _jsxs("label", { children: ["Investment implications", _jsx("textarea", { placeholder: "How investors should interpret the industry opportunity and risks", rows: 4, value: form.investmentImplications, onChange: (event) => setForm({ ...form, investmentImplications: event.target.value }), required: true })] }), _jsxs("label", { children: ["Publication status", _jsxs("select", { value: form.status, onChange: (event) => setForm({ ...form, status: event.target.value }), children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] })] }), _jsxs("label", { children: ["Published at (ISO optional)", _jsx("input", { placeholder: "2026-08-13T12:00:00.000Z", value: form.publishedAt ?? "", onChange: (event) => setForm({ ...form, publishedAt: event.target.value }) })] }), _jsx("button", { type: "submit", children: "Save Report" })] }), _jsx(AttachmentManager, { scope: "industryReport", parentId: editingId, title: "Industry Report Files" })] }));
}
