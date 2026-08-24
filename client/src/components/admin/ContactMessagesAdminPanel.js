import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchAdminContactMessages, updateAdminContactMessageStatus } from "../../services/adminApi.js";
const statuses = ["new", "in_review", "resolved", "spam"];
export function ContactMessagesAdminPanel() {
    const token = localStorage.getItem("atlas-admin-token");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [search, setSearch] = useState("");
    const load = async (nextStatus, nextSearch) => {
        if (!token)
            return;
        setLoading(true);
        try {
            const response = await fetchAdminContactMessages(token, {
                status: nextStatus || undefined,
                search: nextSearch.trim() || undefined
            });
            setItems(response);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!token)
            return;
        void load(statusFilter, search);
    }, [token]);
    if (!token)
        return null;
    const applyFilters = async (event) => {
        event.preventDefault();
        await load(statusFilter, search);
    };
    const updateStatus = async (messageId, status) => {
        if (!token)
            return;
        await updateAdminContactMessageStatus(token, messageId, status);
        await load(statusFilter, search);
    };
    return (_jsxs("article", { className: "card admin-panel admin-panel-wide", children: [_jsx("div", { className: "panel-heading", children: _jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Contact Inbox" }), _jsx("h2", { children: "Inbound Messages" })] }) }), _jsxs("form", { className: "filter-bar", onSubmit: applyFilters, children: [_jsxs("select", { value: statusFilter, onChange: (event) => setStatusFilter(event.target.value), children: [_jsx("option", { value: "", children: "All statuses" }), statuses.map((status) => (_jsx("option", { value: status, children: status }, status)))] }), _jsx("input", { value: search, onChange: (event) => setSearch(event.target.value), placeholder: "Search by name, email, subject, or content" }), _jsx("button", { type: "submit", className: "ghost-button", children: "Filter" })] }), _jsx("div", { className: "admin-list contact-message-list", children: loading ? (_jsx("div", { className: "table-empty", children: "Loading messages\u2026" })) : items.length ? (items.map((message) => (_jsxs("article", { className: "admin-list-item admin-message-item", children: [_jsxs("div", { children: [_jsx("strong", { children: message.subject }), _jsxs("span", { children: [message.name, " \u00B7 ", message.email] }), _jsx("p", { className: "muted", children: message.message })] }), _jsx("div", { className: "inline-actions", children: _jsx("select", { value: message.status, onChange: (event) => void updateStatus(message.id, event.target.value), children: statuses.map((status) => (_jsx("option", { value: status, children: status }, status))) }) })] }, message.id)))) : (_jsx("div", { className: "table-empty", children: "No contact messages match this filter." })) })] }));
}
