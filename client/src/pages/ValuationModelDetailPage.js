import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchValuationModel } from "../services/contentApi.js";
export function ValuationModelDetailPage() {
    const { valuationModelId } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!valuationModelId)
            return;
        let active = true;
        void fetchValuationModel(valuationModelId).then((data) => { if (active)
            setItem(data); }).finally(() => { if (active)
            setLoading(false); });
        return () => { active = false; };
    }, [valuationModelId]);
    if (loading)
        return _jsx("div", { className: "page-shell", children: "Loading valuation model\u2026" });
    if (!item)
        return _jsx("div", { className: "page-shell", children: "Valuation model not found." });
    return (_jsxs("div", { className: "page-shell detail-page", children: [_jsxs("section", { className: "detail-hero card", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Valuation Model" }), _jsx("h1", { children: item.title }), _jsx("p", { className: "muted", children: _jsxs(Link, { to: `/companies/${item.company.id}`, children: [item.company.name, " (", item.company.ticker, ")"] }) })] }), _jsxs("div", { className: "detail-summary", children: [_jsx("span", { children: "Status" }), _jsx("strong", { children: item.status })] })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Valuation Inputs" }), _jsxs("div", { className: "stack-list", children: [_jsxs("div", { className: "stack-row", children: [_jsx("strong", { children: "Current Share Price" }), _jsx("span", { children: item.currentSharePrice })] }), _jsxs("div", { className: "stack-row", children: [_jsx("strong", { children: "Revenue" }), _jsx("span", { children: item.revenue })] }), _jsxs("div", { className: "stack-row", children: [_jsx("strong", { children: "Revenue Growth" }), _jsx("span", { children: item.revenueGrowth })] }), _jsxs("div", { className: "stack-row", children: [_jsx("strong", { children: "EBITDA / EBIT" }), _jsx("span", { children: item.ebitdaOrEbit })] }), _jsxs("div", { className: "stack-row", children: [_jsx("strong", { children: "Free Cash Flow" }), _jsx("span", { children: item.freeCashFlow })] }), _jsxs("div", { className: "stack-row", children: [_jsx("strong", { children: "WACC" }), _jsx("span", { children: item.wacc })] }), _jsxs("div", { className: "stack-row", children: [_jsx("strong", { children: "Terminal Growth Rate" }), _jsx("span", { children: item.terminalGrowthRate })] }), _jsxs("div", { className: "stack-row", children: [_jsx("strong", { children: "Enterprise Value" }), _jsx("span", { children: item.enterpriseValue })] }), _jsxs("div", { className: "stack-row", children: [_jsx("strong", { children: "Equity Value" }), _jsx("span", { children: item.equityValue })] }), _jsxs("div", { className: "stack-row", children: [_jsx("strong", { children: "Shares Outstanding" }), _jsx("span", { children: item.sharesOutstanding })] }), _jsxs("div", { className: "stack-row", children: [_jsx("strong", { children: "Fair Value / Target Price" }), _jsx("span", { children: item.fairValue })] }), _jsxs("div", { className: "stack-row", children: [_jsx("strong", { children: "Upside / Downside" }), _jsx("span", { children: item.upsideDownside })] })] })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Valuation Conclusion" }), _jsx("p", { children: item.valuationConclusion })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Attachments" }), item.attachments.length ? (_jsx("div", { className: "stack-list", children: item.attachments.map((attachment) => (_jsxs("a", { className: "stack-row", href: attachment.url, target: "_blank", rel: "noreferrer", children: [_jsx("strong", { children: attachment.fileName }), _jsx("span", { children: attachment.fileType })] }, attachment.id))) })) : (_jsx("p", { className: "muted", children: "No attachments yet." }))] })] }));
}
