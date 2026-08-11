import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { api } from "../services/api.js";
const fallbackStats = [
    { label: "Companies", value: "0", detail: "Companies covered" },
    { label: "Memos", value: "0", detail: "Published research notes" },
    { label: "Reports", value: "0", detail: "Industry and market views" },
    { label: "Downloads", value: "0", detail: "Files shared with users" }
];
export function HomePage() {
    const [payload, setPayload] = useState({ stats: fallbackStats });
    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const response = await api.get("/api/home");
                if (!cancelled && response.data.stats?.length) {
                    setPayload(response.data);
                }
            }
            catch {
                if (!cancelled) {
                    setPayload({ stats: fallbackStats });
                }
            }
        }
        void load();
        return () => {
            cancelled = true;
        };
    }, []);
    return (_jsxs("div", { className: "page-shell", children: [_jsxs("section", { className: "hero card", children: [_jsxs("div", { className: "hero-copy", children: [_jsx("p", { className: "eyebrow", children: "Independent Equity Research Platform" }), _jsx("h1", { children: "Institutional research built for long-term capital allocation thinking." }), _jsx("p", { className: "lead", children: "Atlas Equity Research centralizes company coverage, valuation work, industry analysis, and market outlooks in a structured, searchable platform." })] }), _jsxs("div", { className: "hero-panel", children: [_jsxs("div", { className: "panel-row", children: [_jsx("span", { children: "Featured Companies" }), _jsx("strong", { children: "Company, memo, and valuation data will come from the database." })] }), _jsxs("div", { className: "panel-row muted", children: [_jsx("span", { children: "Search" }), _jsx("strong", { children: "Companies, tickers, research, industries, and tags." })] })] })] }), _jsx("section", { className: "stats-grid", children: payload.stats.map((stat) => (_jsxs("article", { className: "card stat-card", children: [_jsx("p", { children: stat.label }), _jsx("strong", { children: stat.value }), _jsx("span", { children: stat.detail })] }, stat.label))) }), _jsxs("section", { className: "home-feature-grid", children: [_jsxs("article", { className: "card feature-card", children: [_jsx("p", { className: "eyebrow", children: "Featured Company" }), payload.featured?.company ? (_jsxs(_Fragment, { children: [_jsx("h2", { children: payload.featured.company.name }), _jsxs("p", { children: [payload.featured.company.ticker, " \u00B7 ", payload.featured.company.sector, " \u00B7 ", payload.featured.company.industry] })] })) : (_jsx("p", { className: "muted", children: "No companies have been added yet." }))] }), _jsxs("article", { className: "card feature-card", children: [_jsx("p", { className: "eyebrow", children: "Latest Memo" }), payload.featured?.memo ? (_jsxs(_Fragment, { children: [_jsx("h2", { children: payload.featured.memo.title }), _jsxs("p", { children: [payload.featured.memo.company.name, " (", payload.featured.memo.company.ticker, ") \u00B7 ", payload.featured.memo.recommendation] })] })) : (_jsx("p", { className: "muted", children: "No investment memos have been published yet." }))] })] })] }));
}
