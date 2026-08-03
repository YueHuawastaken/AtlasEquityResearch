import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchIndustryReports, } from "../services/contentApi.js";
import { fetchCompanies, } from "../services/researchApi.js";
export function IndustryReportsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [items, setItems] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState(searchParams.get("search") ?? "");
    useEffect(() => {
        let active = true;
        void fetchCompanies({ pageSize: 100 }).then((response) => { if (active)
            setCompanies(response.items); });
        return () => { active = false; };
    }, []);
    useEffect(() => {
        let active = true;
        setLoading(true);
        void fetchIndustryReports({ search: searchParams.get("search") ?? undefined, companyId: searchParams.get("companyId") ?? undefined, status: searchParams.get("status") ?? undefined })
            .then((response) => {
            if (active)
                setItems(response.items);
        })
            .finally(() => {
            if (active)
                setLoading(false);
        });
        return () => { active = false; };
    }, [searchParams]);
    const submitSearch = (event) => {
        event.preventDefault();
        const next = new URLSearchParams(searchParams);
        if (query.trim())
            next.set("search", query.trim());
        else
            next.delete("search");
        next.set("page", "1");
        setSearchParams(next);
    };
    const updateFilter = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value)
            next.set(key, value);
        else
            next.delete(key);
        next.set("page", "1");
        setSearchParams(next);
    };
    return (_jsxs("div", { className: "page-shell", children: [_jsxs("section", { className: "section-header", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Industry Research" }), _jsx("h1", { children: "Industry Reports" }), _jsx("p", { className: "muted", children: "Structured coverage of market structure, TAM/SAM/SOM, value chains, and investment implications." })] }), _jsxs("form", { className: "search-bar", onSubmit: submitSearch, children: [_jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Search reports" }), _jsx("button", { type: "submit", children: "Search" })] })] }), _jsx("section", { className: "card content-card", children: _jsxs("div", { className: "filter-bar", children: [_jsxs("select", { value: searchParams.get("companyId") ?? "", onChange: (event) => updateFilter("companyId", event.target.value), children: [_jsx("option", { value: "", children: "All companies" }), companies.map((company) => (_jsxs("option", { value: company.id, children: [company.name, " (", company.ticker, ")"] }, company.id)))] }), _jsxs("select", { value: searchParams.get("status") ?? "", onChange: (event) => updateFilter("status", event.target.value), children: [_jsx("option", { value: "", children: "All statuses" }), _jsx("option", { value: "draft", children: "Draft" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "archived", children: "Archived" })] }), _jsx("button", { type: "button", className: "ghost-button", onClick: () => { setQuery(""); setSearchParams(new URLSearchParams()); }, children: "Clear Filters" })] }) }), _jsx("section", { className: "card table-card", children: loading ? _jsx("div", { className: "table-empty", children: "Loading reports\u2026" }) : items.length ? (_jsx("div", { className: "stack-list", children: items.map((item) => (_jsxs(Link, { to: `/industry-research/${item.id}`, className: "stack-row", children: [_jsx("strong", { children: item.title }), _jsxs("span", { children: [item.company ? `${item.company.name} (${item.company.ticker}) · ` : "", item.status] }), _jsx("p", { className: "muted", children: item.executiveSummary })] }, item.id))) })) : _jsx("div", { className: "table-empty", children: "No industry reports found." }) })] }));
}
