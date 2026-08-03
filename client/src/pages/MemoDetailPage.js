import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchMemo } from "../services/researchApi.js";
export function MemoDetailPage() {
    const { memoId } = useParams();
    const [memo, setMemo] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let active = true;
        if (!memoId) {
            setLoading(false);
            return;
        }
        void fetchMemo(memoId)
            .then((data) => {
            if (active)
                setMemo(data);
        })
            .finally(() => {
            if (active)
                setLoading(false);
        });
        return () => {
            active = false;
        };
    }, [memoId]);
    if (loading) {
        return _jsx("div", { className: "page-shell", children: "Loading memo\u2026" });
    }
    if (!memo) {
        return _jsx("div", { className: "page-shell", children: "Memo not found." });
    }
    return (_jsxs("div", { className: "page-shell detail-page", children: [_jsxs("section", { className: "detail-hero card", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Investment Memo" }), _jsx("h1", { children: memo.title }), _jsxs("p", { className: "muted", children: [_jsx(Link, { to: `/companies/${memo.company.id}`, children: memo.company.name }), " \u00B7 ", memo.company.ticker, " \u00B7 ", memo.recommendation] })] }), _jsxs("div", { className: "detail-summary", children: [_jsx("span", { children: "Status" }), _jsx("strong", { children: memo.status }), _jsxs("span", { children: [memo.convictionLevel, "/10 conviction"] })] })] }), _jsxs("section", { className: "grid-2", children: [_jsxs("article", { className: "card content-card", children: [_jsx("h2", { children: "Summary" }), _jsx("p", { children: memo.executiveSummary })] }), _jsxs("article", { className: "card content-card", children: [_jsx("h2", { children: "Company Snapshot" }), _jsxs("p", { children: [memo.company.sector, " \u00B7 ", memo.company.industry] }), _jsx("p", { children: memo.company.description ?? "Company details will expand as the research stack grows." })] })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Thesis" }), _jsx("p", { children: memo.thesis })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Metadata" }), _jsxs("div", { className: "meta-grid", children: [_jsxs("div", { children: [_jsx("span", { children: "Target Price" }), _jsx("strong", { children: memo.targetPrice })] }), _jsxs("div", { children: [_jsx("span", { children: "Current Price" }), _jsx("strong", { children: memo.currentPrice })] }), _jsxs("div", { children: [_jsx("span", { children: "Expected Return" }), _jsx("strong", { children: memo.expectedReturn })] }), _jsxs("div", { children: [_jsx("span", { children: "Horizon" }), _jsx("strong", { children: memo.investmentHorizon })] })] })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Attachments" }), memo.attachments.length ? (_jsx("div", { className: "stack-list", children: memo.attachments.map((attachment) => (_jsxs("a", { className: "stack-row", href: attachment.url, target: "_blank", rel: "noreferrer", children: [_jsx("strong", { children: attachment.fileName }), _jsx("span", { children: attachment.fileType })] }, attachment.id))) })) : (_jsx("p", { className: "muted", children: "No attachments yet." }))] })] }));
}
