import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { api } from "../services/api.js";
export function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const submit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/api/contact", form);
            setSent(true);
            setForm({ name: "", email: "", subject: "", message: "" });
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "page-shell", children: [_jsx("section", { className: "section-header", children: _jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Contact" }), _jsx("h1", { children: "Reach the research desk" }), _jsx("p", { className: "muted", children: "Use this form to send a research request, collaboration note, or follow-up." })] }) }), _jsxs("section", { className: "card content-card", children: [_jsxs("form", { className: "admin-form", onSubmit: submit, children: [_jsx("input", { placeholder: "Name", value: form.name, onChange: (event) => setForm({ ...form, name: event.target.value }), required: true }), _jsx("input", { placeholder: "Email", type: "email", value: form.email, onChange: (event) => setForm({ ...form, email: event.target.value }), required: true }), _jsx("input", { placeholder: "Subject", value: form.subject, onChange: (event) => setForm({ ...form, subject: event.target.value }), required: true }), _jsx("textarea", { placeholder: "Message", rows: 6, value: form.message, onChange: (event) => setForm({ ...form, message: event.target.value }), required: true }), _jsx("button", { type: "submit", disabled: submitting, children: submitting ? "Sending…" : "Send Message" })] }), sent ? _jsx("p", { className: "success-banner", children: "Thanks. Your message has been sent to the research desk." }) : null] })] }));
}
