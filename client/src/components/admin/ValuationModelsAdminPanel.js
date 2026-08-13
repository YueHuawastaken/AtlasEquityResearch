import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { createValuationModel, fetchAdminCompanies, getAdminApiErrorMessage, updateValuationModel } from "../../services/adminApi.js";
import { AttachmentManager } from "./AttachmentManager.js";
const emptyForm = {
    companyId: "",
    title: "",
    slug: "",
    currentSharePrice: 0,
    revenue: 0,
    revenueGrowth: 0,
    ebitdaOrEbit: 0,
    freeCashFlow: 0,
    wacc: 0,
    terminalGrowthRate: 0,
    enterpriseValue: 0,
    equityValue: 0,
    sharesOutstanding: 0,
    fairValue: 0,
    upsideDownside: 0,
    valuationConclusion: "",
    status: "draft",
    publishedAt: null
};
export function ValuationModelsAdminPanel({ companyRefreshKey = 0 }) {
    const token = localStorage.getItem("atlas-admin-token");
    const [companies, setCompanies] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [mode, setMode] = useState("create");
    const [editingId, setEditingId] = useState(null);
    const [validationError, setValidationError] = useState(null);
    useEffect(() => {
        if (!token)
            return;
        let active = true;
        void fetchAdminCompanies(token).then((companyItems) => {
            if (!active)
                return;
            setCompanies(companyItems);
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
        const positiveFields = [
            ["Current share price", form.currentSharePrice],
            ["Shares outstanding", form.sharesOutstanding]
        ];
        const numericFields = [
            ["Current share price", form.currentSharePrice],
            ["Revenue", form.revenue],
            ["Revenue growth", form.revenueGrowth],
            ["EBITDA / EBIT", form.ebitdaOrEbit],
            ["Free cash flow", form.freeCashFlow],
            ["WACC", form.wacc],
            ["Terminal growth rate", form.terminalGrowthRate],
            ["Enterprise value", form.enterpriseValue],
            ["Equity value", form.equityValue],
            ["Shares outstanding", form.sharesOutstanding],
            ["Fair value per share", form.fairValue],
            ["Upside / downside", form.upsideDownside]
        ];
        const invalidPositive = positiveFields.find(([, value]) => !Number.isFinite(value) || value <= 0);
        const invalidShares = !Number.isSafeInteger(form.sharesOutstanding);
        const invalidNumeric = numericFields.find(([, value]) => !Number.isFinite(value));
        if (!form.companyId || !form.title.trim() || form.title.trim().length < 2 || !form.slug.trim() || form.slug.trim().length < 2 || invalidPositive || invalidShares || invalidNumeric || form.valuationConclusion.trim().length < 10) {
            setValidationError(invalidShares ? "Shares outstanding must be a positive whole number." : invalidPositive ? `${invalidPositive[0]} must be greater than 0.` : invalidNumeric ? `${invalidNumeric[0]} must be a valid number.` : !form.companyId ? "Select a company." : form.valuationConclusion.trim().length < 10 ? "Valuation conclusion must be at least 10 characters." : "Title and slug must each be at least 2 characters.");
            return;
        }
        setValidationError(null);
        const payload = {
            ...form,
            companyId: form.companyId,
            publishedAt: form.publishedAt?.trim() ? form.publishedAt : null
        };
        try {
            if (mode === "create") {
                await createValuationModel(token, payload);
            }
            else if (editingId) {
                await updateValuationModel(token, editingId, payload);
            }
        }
        catch (error) {
            setValidationError(getAdminApiErrorMessage(error, "Unable to save the valuation model."));
            return;
        }
        setForm((current) => ({ ...emptyForm, companyId: current.companyId || companies[0]?.id || "" }));
        setMode("create");
        setEditingId(null);
    };
    return (_jsxs("article", { className: "card admin-panel", children: [_jsxs("div", { className: "panel-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Valuation Models" }), _jsx("h2", { children: mode === "create" ? "Create Valuation Model" : "Edit Valuation Model" })] }), _jsx("button", { type: "button", className: "ghost-button", onClick: () => { setMode("create"); setForm({ ...emptyForm, companyId: companies[0]?.id ?? "" }); setEditingId(null); }, children: "Reset" })] }), _jsxs("form", { className: "admin-form", onSubmit: submit, children: [validationError ? _jsx("p", { className: "auth-error", children: validationError }) : null, _jsxs("label", { children: ["Company", _jsxs("select", { value: form.companyId, onChange: (event) => setForm({ ...form, companyId: event.target.value }), required: true, children: [_jsx("option", { value: "", children: "Select company" }), companies.map((company) => (_jsxs("option", { value: company.id, children: [company.name, " (", company.ticker, ")"] }, company.id)))] })] }), _jsxs("label", { children: ["Model title", _jsx("input", { placeholder: "e.g. DCF Valuation Model", value: form.title, onChange: (event) => setForm({ ...form, title: event.target.value }), required: true, minLength: 2 })] }), _jsxs("label", { children: ["URL slug", _jsx("input", { placeholder: "e.g. acme-dcf-2026", value: form.slug, onChange: (event) => setForm({ ...form, slug: event.target.value }), required: true, minLength: 2 })] }), _jsxs("div", { className: "inline-grid", children: [_jsxs("label", { children: ["Current share price", _jsx("input", { type: "number", min: "0.01", step: "0.01", placeholder: "Latest share price, e.g. 125.50", value: form.currentSharePrice, onChange: (event) => setForm({ ...form, currentSharePrice: Number(event.target.value) }), required: true })] }), _jsxs("label", { children: ["Revenue", _jsx("input", { type: "number", step: "0.01", placeholder: "Annual revenue in reporting currency", value: form.revenue, onChange: (event) => setForm({ ...form, revenue: Number(event.target.value) }), required: true })] })] }), _jsxs("div", { className: "inline-grid", children: [_jsxs("label", { children: ["Revenue growth", _jsx("input", { type: "number", step: "0.0001", placeholder: "Growth rate as decimal, e.g. 0.12", value: form.revenueGrowth, onChange: (event) => setForm({ ...form, revenueGrowth: Number(event.target.value) }), required: true })] }), _jsxs("label", { children: ["EBITDA / EBIT", _jsx("input", { type: "number", step: "0.01", placeholder: "Operating profit in reporting currency", value: form.ebitdaOrEbit, onChange: (event) => setForm({ ...form, ebitdaOrEbit: Number(event.target.value) }), required: true })] })] }), _jsxs("div", { className: "inline-grid", children: [_jsxs("label", { children: ["Free cash flow", _jsx("input", { type: "number", step: "0.01", placeholder: "Annual free cash flow in reporting currency", value: form.freeCashFlow, onChange: (event) => setForm({ ...form, freeCashFlow: Number(event.target.value) }), required: true })] }), _jsxs("label", { children: ["WACC", _jsx("input", { type: "number", step: "0.0001", placeholder: "Weighted average cost of capital as decimal", value: form.wacc, onChange: (event) => setForm({ ...form, wacc: Number(event.target.value) }), required: true })] })] }), _jsxs("div", { className: "inline-grid", children: [_jsxs("label", { children: ["Terminal growth rate", _jsx("input", { type: "number", step: "0.0001", placeholder: "Long-term growth as decimal, e.g. 0.03", value: form.terminalGrowthRate, onChange: (event) => setForm({ ...form, terminalGrowthRate: Number(event.target.value) }), required: true })] }), _jsxs("label", { children: ["Enterprise value", _jsx("input", { type: "number", step: "0.01", placeholder: "Enterprise value in reporting currency", value: form.enterpriseValue, onChange: (event) => setForm({ ...form, enterpriseValue: Number(event.target.value) }), required: true })] })] }), _jsxs("div", { className: "inline-grid", children: [_jsxs("label", { children: ["Equity value", _jsx("input", { type: "number", step: "0.01", placeholder: "Equity value after debt and cash adjustments", value: form.equityValue, onChange: (event) => setForm({ ...form, equityValue: Number(event.target.value) }), required: true })] }), _jsxs("label", { children: ["Shares outstanding", _jsx("input", { type: "number", min: "1", step: "1", inputMode: "numeric", placeholder: "e.g. 7430000000", value: form.sharesOutstanding || "", onChange: (event) => setForm({ ...form, sharesOutstanding: Number(event.target.value) }), required: true })] })] }), _jsxs("div", { className: "inline-grid", children: [_jsxs("label", { children: ["Fair value per share", _jsx("input", { type: "number", step: "0.01", placeholder: "Calculated fair value per share", value: form.fairValue, onChange: (event) => setForm({ ...form, fairValue: Number(event.target.value) }), required: true })] }), _jsxs("label", { children: ["Upside / downside", _jsx("input", { type: "number", step: "0.0001", placeholder: "Percentage as decimal, e.g. 0.20", value: form.upsideDownside, onChange: (event) => setForm({ ...form, upsideDownside: Number(event.target.value) }), required: true })] })] }), _jsxs("label", { children: ["Valuation conclusion", _jsx("textarea", { placeholder: "Summarize the valuation outcome and key assumptions (at least 10 characters).", rows: 5, value: form.valuationConclusion, onChange: (event) => setForm({ ...form, valuationConclusion: event.target.value }), required: true, minLength: 10 })] }), _jsxs("label", { children: ["Publication status", _jsxs("select", { value: form.status, onChange: (event) => setForm({ ...form, status: event.target.value }), children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] })] }), _jsxs("label", { children: ["Published at (ISO optional)", _jsx("input", { placeholder: "2026-08-13T12:00:00.000Z", value: form.publishedAt ?? "", onChange: (event) => setForm({ ...form, publishedAt: event.target.value }) })] }), _jsx("button", { type: "submit", children: "Save Model" })] }), _jsx(AttachmentManager, { scope: "valuationModel", parentId: editingId, title: "Valuation Model Files" })] }));
}
