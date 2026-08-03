import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchMarketOutlook } from "../services/contentApi.js";
const sections = [
    ["Federal Reserve", "federalReserve"],
    ["Interest Rates", "interestRates"],
    ["Inflation", "inflation"],
    ["GDP", "gdp"],
    ["Employment", "employment"],
    ["Geopolitics", "geopolitics"],
    ["Currencies", "currencies"],
    ["Commodities", "commodities"],
    ["Technology", "technology"],
    ["AI", "ai"],
    ["Semiconductors", "semiconductors"],
    ["Healthcare", "healthcare"],
    ["Consumer", "consumer"],
    ["Financials", "financials"],
    ["Market Valuation", "marketValuation"],
    ["Sector Outlook", "sectorOutlook"],
    ["Portfolio Positioning", "portfolioPositioning"],
    ["Conclusion", "conclusion"]
];
export function MarketOutlookDetailPage() {
    const { outlookId } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!outlookId)
            return;
        let active = true;
        void fetchMarketOutlook(outlookId).then((data) => { if (active)
            setItem(data); }).finally(() => { if (active)
            setLoading(false); });
        return () => { active = false; };
    }, [outlookId]);
    if (loading)
        return _jsx("div", { className: "page-shell", children: "Loading outlook\u2026" });
    if (!item)
        return _jsx("div", { className: "page-shell", children: "Market outlook not found." });
    return (_jsxs("div", { className: "page-shell detail-page", children: [_jsxs("section", { className: "detail-hero card", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Market Outlook" }), _jsx("h1", { children: item.title }), _jsx("p", { className: "muted", children: item.company ? _jsxs(Link, { to: `/companies/${item.company.id}`, children: [item.company.name, " (", item.company.ticker, ")"] }) : item.month })] }), _jsxs("div", { className: "detail-summary", children: [_jsx("span", { children: "Status" }), _jsx("strong", { children: item.status })] })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Executive Summary" }), _jsx("p", { children: item.executiveSummary })] }), _jsx("section", { className: "grid-2", children: sections.slice(0, 9).map(([label, key]) => _jsxs("article", { className: "card content-card", children: [_jsx("h2", { children: label }), _jsx("p", { children: item[key] })] }, label)) }), _jsx("section", { className: "grid-2", children: sections.slice(9).map(([label, key]) => _jsxs("article", { className: "card content-card", children: [_jsx("h2", { children: label }), _jsx("p", { children: item[key] })] }, label)) }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Attachments" }), item.attachments.length ? (_jsx("div", { className: "stack-list", children: item.attachments.map((attachment) => (_jsxs("a", { className: "stack-row", href: attachment.url, target: "_blank", rel: "noreferrer", children: [_jsx("strong", { children: attachment.fileName }), _jsx("span", { children: attachment.fileType })] }, attachment.id))) })) : (_jsx("p", { className: "muted", children: "No attachments yet." }))] })] }));
}
