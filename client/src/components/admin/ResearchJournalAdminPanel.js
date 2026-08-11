import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { createResearchJournal, deleteResearchJournal, fetchAdminCompanies, fetchAdminResearchJournal, updateResearchJournal } from "../../services/adminApi.js";
import { AttachmentManager } from "./AttachmentManager.js";
const emptyForm = {
    companyId: null,
    title: "",
    slug: "",
    prompt: "",
    body: "",
    reflections: "",
    status: "draft",
    publishedAt: null
};
export function ResearchJournalAdminPanel({ companyRefreshKey = 0 }) {
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
        void Promise.all([fetchAdminCompanies(token), fetchAdminResearchJournal(token)]).then(([companyItems, journalItems]) => {
            if (!active)
                return;
            setCompanies(companyItems);
            setItems(journalItems);
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
            await createResearchJournal(token, payload);
        }
        else if (editingId) {
            await updateResearchJournal(token, editingId, payload);
        }
        setItems(await fetchAdminResearchJournal(token));
        setForm((current) => ({ ...emptyForm, companyId: current.companyId || companies[0]?.id || null }));
        setMode("create");
        setEditingId(null);
    };
    return (_jsxs("article", { className: "card admin-panel", children: [_jsxs("div", { className: "panel-heading", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Research Journal" }), _jsx("h2", { children: mode === "create" ? "Create Journal Entry" : "Edit Journal Entry" })] }), _jsx("button", { type: "button", className: "ghost-button", onClick: () => { setMode("create"); setForm({ ...emptyForm, companyId: companies[0]?.id ?? null }); setEditingId(null); }, children: "Reset" })] }), _jsxs("form", { className: "admin-form", onSubmit: submit, children: [_jsxs("select", { value: form.companyId ?? "", onChange: (event) => setForm({ ...form, companyId: event.target.value || null }), children: [_jsx("option", { value: "", children: "No company" }), companies.map((company) => (_jsxs("option", { value: company.id, children: [company.name, " (", company.ticker, ")"] }, company.id)))] }), _jsx("input", { placeholder: "Title", value: form.title, onChange: (event) => setForm({ ...form, title: event.target.value }), required: true }), _jsx("input", { placeholder: "Slug", value: form.slug, onChange: (event) => setForm({ ...form, slug: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Prompt", rows: 3, value: form.prompt, onChange: (event) => setForm({ ...form, prompt: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Body", rows: 6, value: form.body, onChange: (event) => setForm({ ...form, body: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Reflections", rows: 5, value: form.reflections, onChange: (event) => setForm({ ...form, reflections: event.target.value }), required: true }), _jsxs("select", { value: form.status, onChange: (event) => setForm({ ...form, status: event.target.value }), children: [_jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] }), _jsx("input", { placeholder: "Published At (ISO optional)", value: form.publishedAt ?? "", onChange: (event) => setForm({ ...form, publishedAt: event.target.value }) }), _jsx("button", { type: "submit", children: "Save Entry" })] }), _jsx("div", { className: "admin-list", children: items.map((item) => (_jsxs("article", { className: "admin-list-item", children: [_jsxs("div", { children: [_jsx("strong", { children: item.title }), _jsxs("span", { children: [item.company ? `${item.company.name} · ` : "", item.status] })] }), _jsxs("div", { className: "inline-actions", children: [_jsx("button", { type: "button", className: "ghost-button", onClick: () => {
                                        setMode("edit");
                                        setEditingId(item.id);
                                        setForm({
                                            companyId: item.company?.id ?? null,
                                            title: item.title,
                                            slug: item.slug,
                                            prompt: item.prompt,
                                            body: item.body,
                                            reflections: item.reflections,
                                            status: item.status,
                                            publishedAt: item.publishedAt
                                        });
                                    }, children: "Edit" }), _jsx("button", { type: "button", className: "danger-button", onClick: async () => { await deleteResearchJournal(token, item.id); setItems(await fetchAdminResearchJournal(token)); }, children: "Delete" })] })] }, item.id))) }), _jsx(AttachmentManager, { scope: "researchJournal", parentId: editingId ?? items[0]?.id ?? null, title: "Research Journal Files" })] }));
}
