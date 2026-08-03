import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchCompanies } from "../services/researchApi.js";
export function CompaniesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [items, setItems] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState(searchParams.get("search") ?? "");
    useEffect(() => {
        let active = true;
        setLoading(true);
        void fetchCompanies({
            search: searchParams.get("search") ?? undefined,
            sector: searchParams.get("sector") ?? undefined,
            status: searchParams.get("status") ?? undefined,
            page: searchParams.get("page") ?? undefined,
            pageSize: searchParams.get("pageSize") ?? undefined
        })
            .then((data) => {
            if (!active)
                return;
            setItems(data.items);
            setPageInfo({ page: data.page, pageSize: data.pageSize, total: data.total, totalPages: data.totalPages });
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
    return (_jsxs("div", { className: "page-shell", children: [_jsxs("section", { className: "section-header", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Coverage" }), _jsx("h1", { children: "Companies" }), _jsx("p", { className: "muted", children: "Search the company universe that anchors all research, memos, and valuation work." })] }), _jsxs("form", { className: "search-bar", onSubmit: submitSearch, children: [_jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Search companies, tickers, sectors" }), _jsx("button", { type: "submit", children: "Search" })] })] }), _jsx("section", { className: "card table-card", children: loading ? (_jsx("div", { className: "table-empty", children: "Loading companies\u2026" })) : items.length ? (_jsx("div", { className: "table-wrap", children: _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Company" }), _jsx("th", { children: "Ticker" }), _jsx("th", { children: "Sector" }), _jsx("th", { children: "Industry" }), _jsx("th", { children: "Memos" }), _jsx("th", { children: "Status" })] }) }), _jsx("tbody", { children: items.map((company) => (_jsxs("tr", { children: [_jsxs("td", { children: [_jsx(Link, { to: `/companies/${company.id}`, className: "table-primary", children: company.name }), _jsx("span", { children: company.exchange })] }), _jsx("td", { children: company.ticker }), _jsx("td", { children: company.sector }), _jsx("td", { children: company.industry }), _jsx("td", { children: company._count.memos }), _jsx("td", { children: company.status })] }, company.id))) })] }) })) : (_jsx("div", { className: "table-empty", children: "No companies found. Add companies in the admin workflow once Phase 2 continues." })) }), _jsxs("footer", { className: "page-footer-meta", children: [_jsxs("span", { children: ["Page ", pageInfo.page, " of ", pageInfo.totalPages] }), _jsxs("span", { children: [pageInfo.total, " companies"] })] })] }));
}
