import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { createValuationModel, deleteValuationModel, fetchAdminCompanies, fetchAdminValuationModels, updateValuationModel } from "../../services/adminApi.js";
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
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [mode, setMode] = useState("create");
    const [editingId, setEditingId] = useState(null);
    useEffect(() => {
        if (!token)
            return;
        let active = true;
        void Promise.all([fetchAdminCompanies(token), fetchAdminValuationModels(token)]).then(([companyItems, valuationItems]) => {
            if (!active)
                return;
            setCompanies(companyItems);
            setItems(valuationItems);
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
            companyId: form.companyId,
            publishedAt: form.publishedAt?.trim() ? form.publishedAt : null
        };
        if (mode === "create") {
            await createValuationModel(token, payload);
        }
        else if (editingId) {
            await updateValuationModel(token, editingId, payload);
        }
        setItems(await fetchAdminValuationModels(token));
        setForm((current) => ({ ...emptyForm, companyId: current.companyId || companies[0]?.id || "" }));
        setMode("create");
        setEditingId(null);
    };
    return (_jsxs("article", { className: "card admin-panel", children: [_jsxs("div", { className: "panel-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Valuation Models" }), _jsx("h2", { children: mode === "create" ? "Create Valuation Model" : "Edit Valuation Model" })] }), _jsx("button", { type: "button", className: "ghost-button", onClick: () => { setMode("create"); setForm({ ...emptyForm, companyId: companies[0]?.id ?? "" }); setEditingId(null); }, children: "Reset" })] }), _jsxs("form", { className: "admin-form", onSubmit: submit, children: [_jsxs("select", { value: form.companyId, onChange: (event) => setForm({ ...form, companyId: event.target.value }), required: true, children: [_jsx("option", { value: "", children: "Select company" }), companies.map((company) => (_jsxs("option", { value: company.id, children: [company.name, " (", company.ticker, ")"] }, company.id)))] }), _jsx("input", { placeholder: "Title", value: form.title, onChange: (event) => setForm({ ...form, title: event.target.value }), required: true }), _jsx("input", { placeholder: "Slug", value: form.slug, onChange: (event) => setForm({ ...form, slug: event.target.value }), required: true }), _jsxs("div", { className: "inline-grid", children: [_jsx("input", { type: "number", step: "0.01", placeholder: "Current Share Price", value: form.currentSharePrice, onChange: (event) => setForm({ ...form, currentSharePrice: Number(event.target.value) }), required: true }), _jsx("input", { type: "number", step: "0.01", placeholder: "Revenue", value: form.revenue, onChange: (event) => setForm({ ...form, revenue: Number(event.target.value) }), required: true })] }), _jsxs("div", { className: "inline-grid", children: [_jsx("input", { type: "number", step: "0.0001", placeholder: "Revenue Growth", value: form.revenueGrowth, onChange: (event) => setForm({ ...form, revenueGrowth: Number(event.target.value) }), required: true }), _jsx("input", { type: "number", step: "0.01", placeholder: "EBITDA / EBIT", value: form.ebitdaOrEbit, onChange: (event) => setForm({ ...form, ebitdaOrEbit: Number(event.target.value) }), required: true })] }), _jsxs("div", { className: "inline-grid", children: [_jsx("input", { type: "number", step: "0.01", placeholder: "Free Cash Flow", value: form.freeCashFlow, onChange: (event) => setForm({ ...form, freeCashFlow: Number(event.target.value) }), required: true }), _jsx("input", { type: "number", step: "0.0001", placeholder: "WACC", value: form.wacc, onChange: (event) => setForm({ ...form, wacc: Number(event.target.value) }), required: true })] }), _jsxs("div", { className: "inline-grid", children: [_jsx("input", { type: "number", step: "0.0001", placeholder: "Terminal Growth Rate", value: form.terminalGrowthRate, onChange: (event) => setForm({ ...form, terminalGrowthRate: Number(event.target.value) }), required: true }), _jsx("input", { type: "number", step: "0.01", placeholder: "Enterprise Value", value: form.enterpriseValue, onChange: (event) => setForm({ ...form, enterpriseValue: Number(event.target.value) }), required: true })] }), _jsxs("div", { className: "inline-grid", children: [_jsx("input", { type: "number", step: "0.01", placeholder: "Equity Value", value: form.equityValue, onChange: (event) => setForm({ ...form, equityValue: Number(event.target.value) }), required: true }), _jsx("input", { type: "number", step: "0.01", placeholder: "Shares Outstanding", value: form.sharesOutstanding, onChange: (event) => setForm({ ...form, sharesOutstanding: Number(event.target.value) }), required: true })] }), _jsxs("div", { className: "inline-grid", children: [_jsx("input", { type: "number", step: "0.01", placeholder: "Fair Value / Target Price", value: form.fairValue, onChange: (event) => setForm({ ...form, fairValue: Number(event.target.value) }), required: true }), _jsx("input", { type: "number", step: "0.0001", placeholder: "Upside / Downside", value: form.upsideDownside, onChange: (event) => setForm({ ...form, upsideDownside: Number(event.target.value) }), required: true })] }), _jsx("textarea", { placeholder: "Valuation Conclusion", rows: 5, value: form.valuationConclusion, onChange: (event) => setForm({ ...form, valuationConclusion: event.target.value }), required: true }), _jsxs("select", { value: form.status, onChange: (event) => setForm({ ...form, status: event.target.value }), children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] }), _jsx("input", { placeholder: "Published At (ISO optional)", value: form.publishedAt ?? "", onChange: (event) => setForm({ ...form, publishedAt: event.target.value }) }), _jsx("button", { type: "submit", children: "Save Model" })] }), _jsx("div", { className: "admin-list", children: items.map((item) => (_jsxs("article", { className: "admin-list-item", children: [_jsxs("div", { children: [_jsx("strong", { children: item.title }), _jsxs("span", { children: [item.company.name, " \u00B7 fair value ", item.fairValue, " \u00B7 ", item.status] })] }), _jsxs("div", { className: "inline-actions", children: [_jsx("button", { type: "button", className: "ghost-button", onClick: () => {
                                        setMode("edit");
                                        setEditingId(item.id);
                                        setForm({
                                            companyId: item.company.id,
                                            title: item.title,
                                            slug: item.slug,
                                            currentSharePrice: Number(item.currentSharePrice),
                                            revenue: Number(item.revenue),
                                            revenueGrowth: Number(item.revenueGrowth),
                                            ebitdaOrEbit: Number(item.ebitdaOrEbit),
                                            freeCashFlow: Number(item.freeCashFlow),
                                            wacc: Number(item.wacc),
                                            terminalGrowthRate: Number(item.terminalGrowthRate),
                                            enterpriseValue: Number(item.enterpriseValue),
                                            equityValue: Number(item.equityValue),
                                            sharesOutstanding: Number(item.sharesOutstanding),
                                            fairValue: Number(item.fairValue),
                                            upsideDownside: Number(item.upsideDownside),
                                            valuationConclusion: item.valuationConclusion,
                                            status: item.status,
                                            publishedAt: item.publishedAt
                                        });
                                    }, children: "Edit" }), _jsx("button", { type: "button", className: "danger-button", onClick: async () => { await deleteValuationModel(token, item.id); setItems(await fetchAdminValuationModels(token)); }, children: "Delete" })] })] }, item.id))) }), _jsx(AttachmentManager, { scope: "valuationModel", parentId: editingId ?? items[0]?.id ?? null, title: "Valuation Model Files" })] }));
}
