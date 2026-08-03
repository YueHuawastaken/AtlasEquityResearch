import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { searchAtlas } from "../services/contentApi.js";
const resultRoutes = {
    company: (item) => `/companies/${item.id}`,
    memo: (item) => `/research/${item.id}`,
    "industry-report": (item) => `/industry-research/${item.id}`,
    "market-outlook": (item) => `/market-outlooks/${item.id}`,
    "research-journal": (item) => `/journal/${item.id}`
};
export function SearchPage() {
    const [query, setQuery] = useState("");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            setItems(await searchAtlas(query));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "page-shell", children: [_jsxs("section", { className: "section-header", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Search" }), _jsx("h1", { children: "Search Everything" }), _jsx("p", { className: "muted", children: "Companies, memos, reports, outlooks, and journal entries." })] }), _jsxs("form", { className: "search-bar", onSubmit: onSubmit, children: [_jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Search across the platform" }), _jsx("button", { type: "submit", children: "Search" })] })] }), _jsx("section", { className: "card table-card", children: loading ? _jsx("div", { className: "table-empty", children: "Searching\u2026" }) : items.length ? (_jsx("div", { className: "stack-list", children: items.map((item) => (_jsxs(Link, { to: resultRoutes[item.type](item), className: "stack-row", children: [_jsx("strong", { children: item.title }), _jsxs("span", { children: [item.type, " \u00B7 ", item.status] }), _jsx("p", { className: "muted", children: item.subtitle })] }, `${item.type}-${item.id}`))) })) : _jsx("div", { className: "table-empty", children: "No results yet." }) })] }));
}
