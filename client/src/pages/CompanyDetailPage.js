import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCompany } from "../services/researchApi.js";
export function CompanyDetailPage() {
    const { companyId } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let active = true;
        if (!companyId) {
            setLoading(false);
            return;
        }
        void fetchCompany(companyId)
            .then((data) => {
            if (active)
                setCompany(data);
        })
            .finally(() => {
            if (active)
                setLoading(false);
        });
        return () => {
            active = false;
        };
    }, [companyId]);
    if (loading) {
        return _jsx("div", { className: "page-shell", children: "Loading company\u2026" });
    }
    if (!company) {
        return _jsx("div", { className: "page-shell", children: "Company not found." });
    }
    return (_jsxs("div", { className: "page-shell detail-page", children: [_jsxs("section", { className: "detail-hero card", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Company" }), _jsx("h1", { children: company.name }), _jsxs("p", { className: "muted", children: [company.ticker, " \u00B7 ", company.exchange, " \u00B7 ", company.sector, " \u00B7 ", company.industry] })] }), _jsxs("div", { className: "detail-summary", children: [_jsx("span", { children: "Status" }), _jsx("strong", { children: company.status }), _jsxs("span", { children: [company._count.memos, " research memos"] })] })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: company.description ?? "Company profile content will be populated from the database." })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Research" }), company.memos.length ? (_jsx("div", { className: "stack-list", children: company.memos.map((memo) => (_jsxs(Link, { to: `/research/${memo.id}`, className: "stack-row", children: [_jsx("strong", { children: memo.title }), _jsxs("span", { children: [memo.recommendation, " \u00B7 ", memo.status] })] }, memo.id))) })) : (_jsx("p", { className: "muted", children: "No memos are linked to this company yet." }))] })] }));
}
