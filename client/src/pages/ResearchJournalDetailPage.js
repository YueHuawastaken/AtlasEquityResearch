import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchResearchJournalEntry } from "../services/contentApi.js";
export function ResearchJournalDetailPage() {
    const { journalId } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!journalId)
            return;
        let active = true;
        void fetchResearchJournalEntry(journalId).then((data) => { if (active)
            setItem(data); }).finally(() => { if (active)
            setLoading(false); });
        return () => { active = false; };
    }, [journalId]);
    if (loading)
        return _jsx("div", { className: "page-shell", children: "Loading journal entry\u2026" });
    if (!item)
        return _jsx("div", { className: "page-shell", children: "Journal entry not found." });
    return (_jsxs("div", { className: "page-shell detail-page", children: [_jsxs("section", { className: "detail-hero card", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Research Journal" }), _jsx("h1", { children: item.title }), _jsx("p", { className: "muted", children: item.company ? _jsxs(Link, { to: `/companies/${item.company.id}`, children: [item.company.name, " (", item.company.ticker, ")"] }) : "Independent note" })] }), _jsxs("div", { className: "detail-summary", children: [_jsx("span", { children: "Status" }), _jsx("strong", { children: item.status })] })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Prompt" }), _jsx("p", { children: item.prompt })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Body" }), _jsx("p", { children: item.body })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Reflections" }), _jsx("p", { children: item.reflections })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Attachments" }), item.attachments.length ? (_jsx("div", { className: "stack-list", children: item.attachments.map((attachment) => (_jsxs("a", { className: "stack-row", href: attachment.url, target: "_blank", rel: "noreferrer", children: [_jsx("strong", { children: attachment.fileName }), _jsx("span", { children: attachment.fileType })] }, attachment.id))) })) : (_jsx("p", { className: "muted", children: "No attachments yet." }))] })] }));
}
