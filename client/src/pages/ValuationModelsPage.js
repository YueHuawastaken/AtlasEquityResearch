import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchValuationModels, } from "../services/contentApi.js";
import { fetchCompanies, } from "../services/researchApi.js";
export function ValuationModelsPage() {
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
        void fetchValuationModels({ search: searchParams.get("search") ?? undefined, companyId: searchParams.get("companyId") ?? undefined })
            .then((response) => { if (active)
            setItems(response.items); })
            .finally(() => { if (active)
            setLoading(false); });
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
    return (_jsxs("div", { className: "page-shell", children: [_jsxs("section", { className: "section-header", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Valuation" }), _jsx("h1", { children: "Valuation Models" }), _jsx("p", { className: "muted", children: "DCF and valuation snapshots connected to covered companies." })] }), _jsxs("form", { className: "search-bar", onSubmit: submitSearch, children: [_jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "Search valuation models" }), _jsx("button", { type: "submit", children: "Search" })] })] }), _jsx("section", { className: "card content-card", children: _jsxs("div", { className: "filter-bar", children: [_jsxs("select", { value: searchParams.get("companyId") ?? "", onChange: (event) => updateFilter("companyId", event.target.value), children: [_jsx("option", { value: "", children: "All companies" }), companies.map((company) => (_jsxs("option", { value: company.id, children: [company.name, " (", company.ticker, ")"] }, company.id)))] }), _jsx("button", { type: "button", className: "ghost-button", onClick: () => { setQuery(""); setSearchParams(new URLSearchParams()); }, children: "Clear Filters" })] }) }), _jsx("section", { className: "card table-card", children: loading ? _jsx("div", { className: "table-empty", children: "Loading valuation models\u2026" }) : items.length ? (_jsx("div", { className: "stack-list", children: items.map((item) => (_jsxs(Link, { to: `/valuation-models/${item.id}`, className: "stack-row", children: [_jsx("strong", { children: item.title }), _jsxs("span", { children: [item.company.name, " (", item.company.ticker, ")"] }), _jsxs("p", { className: "muted", children: ["Price ", item.currentSharePrice, " \u00B7 Fair Value ", item.fairValue, " \u00B7 Upside/Downside ", item.upsideDownside] })] }, item.id))) })) : _jsx("div", { className: "table-empty", children: "No valuation models found." }) })] }));
}
