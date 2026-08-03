import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchCompanies, fetchMemos } from "../services/researchApi.js";
export function MemosPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [items, setItems] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState(searchParams.get("search") ?? "");
    useEffect(() => {
        let active = true;
        void fetchCompanies({ pageSize: 100 }).then((response) => {
            if (active)
                setCompanies(response.items);
        });
        return () => {
            active = false;
        };
    }, []);
    useEffect(() => {
        let active = true;
        setLoading(true);
        void fetchMemos({
            search: searchParams.get("search") ?? undefined,
            companyId: searchParams.get("companyId") ?? undefined,
            recommendation: searchParams.get("recommendation") ?? undefined,
            page: searchParams.get("page") ?? undefined,
            pageSize: searchParams.get("pageSize") ?? undefined
        })
            .then((data) => {
            if (active)
                setItems(data.items);
        })
            .finally(() => {
            if (active)
                setLoading(false);
        });
        return () => {
            active = false;
        };
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
    return (_jsxs("div", { className: "page-shell", children: [_jsxs("section", { className: "section-header", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Research" }), _jsx("h1", { children: "Investment Memos" }), _jsx("p", { className: "muted", children: "Database-driven memo archive for valuation, thesis work, and long-term investment ideas." })] }), _jsxs("form", { className: "search-bar", onSubmit: submitSearch, children: [_jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Search memo title, slug, summary" }), _jsx("button", { type: "submit", children: "Search" })] })] }), _jsx("section", { className: "card content-card", children: _jsxs("div", { className: "filter-bar", children: [_jsxs("select", { value: searchParams.get("companyId") ?? "", onChange: (event) => updateFilter("companyId", event.target.value), children: [_jsx("option", { value: "", children: "All companies" }), companies.map((company) => (_jsxs("option", { value: company.id, children: [company.name, " (", company.ticker, ")"] }, company.id)))] }), _jsxs("select", { value: searchParams.get("recommendation") ?? "", onChange: (event) => updateFilter("recommendation", event.target.value), children: [_jsx("option", { value: "", children: "All recommendations" }), _jsx("option", { value: "buy", children: "Buy" }), _jsx("option", { value: "overweight", children: "Overweight" }), _jsx("option", { value: "hold", children: "Hold" }), _jsx("option", { value: "underweight", children: "Underweight" }), _jsx("option", { value: "sell", children: "Sell" })] }), _jsx("button", { type: "button", className: "ghost-button", onClick: () => { setQuery(""); setSearchParams(new URLSearchParams()); }, children: "Clear Filters" })] }) }), _jsx("section", { className: "card table-card", children: loading ? (_jsx("div", { className: "table-empty", children: "Loading memos\u2026" })) : items.length ? (_jsx("div", { className: "table-wrap", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Memo" }), _jsx("th", { children: "Company" }), _jsx("th", { children: "Recommendation" }), _jsx("th", { children: "Target Price" }), _jsx("th", { children: "Current Price" }), _jsx("th", { children: "Expected Return" })] }) }), _jsx("tbody", { children: items.map((memo) => (_jsxs("tr", { children: [_jsxs("td", { children: [_jsx(Link, { to: `/research/${memo.id}`, className: "table-primary", children: memo.title }), _jsx("span", { children: memo.slug })] }), _jsxs("td", { children: [memo.company.name, " (", memo.company.ticker, ")"] }), _jsx("td", { children: memo.recommendation }), _jsx("td", { children: memo.targetPrice }), _jsx("td", { children: memo.currentPrice }), _jsx("td", { children: memo.expectedReturn })] }, memo.id))) })] }) })) : (_jsx("div", { className: "table-empty", children: "No investment memos found yet." })) })] }));
}
