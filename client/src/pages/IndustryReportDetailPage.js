import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchIndustryReport } from "../services/contentApi.js";
const sections = [
    ["Overview", "overview"],
    ["Market Size", "marketSize"],
    ["TAM", "tam"],
    ["SAM", "sam"],
    ["SOM", "som"],
    ["Growth", "growth"],
    ["Porter Five Forces", "porterFiveForces"],
    ["Value Chain", "valueChain"],
    ["Competitors", "competitors"],
    ["Supply Chain", "supplyChain"],
    ["Demand Drivers", "demandDrivers"],
    ["Technology Trends", "technologyTrends"],
    ["Regulation", "regulation"],
    ["Risks", "risks"],
    ["Investment Implications", "investmentImplications"]
];
export function IndustryReportDetailPage() {
    const { reportId } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!reportId)
            return;
        let active = true;
        void fetchIndustryReport(reportId).then((data) => { if (active)
            setItem(data); }).finally(() => { if (active)
            setLoading(false); });
        return () => { active = false; };
    }, [reportId]);
    if (loading)
        return _jsx("div", { className: "page-shell", children: "Loading report\u2026" });
    if (!item)
        return _jsx("div", { className: "page-shell", children: "Report not found." });
    return (_jsxs("div", { className: "page-shell detail-page", children: [_jsxs("section", { className: "detail-hero card", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Industry Research" }), _jsx("h1", { children: item.title }), _jsx("p", { className: "muted", children: item.company ? _jsxs(Link, { to: `/companies/${item.company.id}`, children: [item.company.name, " (", item.company.ticker, ")"] }) : "Unlinked research" })] }), _jsxs("div", { className: "detail-summary", children: [_jsx("span", { children: "Status" }), _jsx("strong", { children: item.status })] })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Executive Summary" }), _jsx("p", { children: item.executiveSummary })] }), _jsx("section", { className: "grid-2", children: sections.slice(0, 8).map(([label, key]) => _jsxs("article", { className: "card content-card", children: [_jsx("h2", { children: label }), _jsx("p", { children: item[key] })] }, label)) }), _jsx("section", { className: "grid-2", children: sections.slice(8).map(([label, key]) => _jsxs("article", { className: "card content-card", children: [_jsx("h2", { children: label }), _jsx("p", { children: item[key] })] }, label)) }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Attachments" }), item.attachments.length ? (_jsx("div", { className: "stack-list", children: item.attachments.map((attachment) => (_jsxs("a", { className: "stack-row", href: attachment.url, target: "_blank", rel: "noreferrer", children: [_jsx("strong", { children: attachment.fileName }), _jsx("span", { children: attachment.fileType })] }, attachment.id))) })) : (_jsx("p", { className: "muted", children: "No attachments yet." }))] })] }));
}
