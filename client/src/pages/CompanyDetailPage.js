import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCompany } from "../services/researchApi.js";
import { addCompanyToPersistentWatchlist, fetchPersistentWatchlistCompanyIds, getWatchlistCompanyIds, removeCompanyFromPersistentWatchlist, toggleCompanyInWatchlist } from "../services/watchlist.js";
export function CompanyDetailPage() {
    const { companyId } = useParams();
    const token = localStorage.getItem("atlas-admin-token");
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [watchlistIds, setWatchlistIds] = useState([]);
    useEffect(() => {
        let active = true;
        void (async () => {
            if (token) {
                try {
                    const ids = await fetchPersistentWatchlistCompanyIds(token);
                    if (active)
                        setWatchlistIds(ids);
                    return;
                }
                catch {
                    if (active)
                        setWatchlistIds(getWatchlistCompanyIds());
                }
            }
            else if (active) {
                setWatchlistIds(getWatchlistCompanyIds());
            }
        })();
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
    const inWatchlist = companyId ? watchlistIds.includes(companyId) : false;
    if (loading) {
        return _jsx("div", { className: "page-shell", children: "Loading company\u2026" });
    }
    if (!company) {
        return _jsx("div", { className: "page-shell", children: "Company not found." });
    }
    return (_jsxs("div", { className: "page-shell detail-page", children: [_jsxs("section", { className: "detail-hero card", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Company" }), _jsx("h1", { children: company.name }), _jsxs("p", { className: "muted", children: [company.ticker, " \u00B7 ", company.exchange, " \u00B7 ", company.sector, " \u00B7 ", company.industry] })] }), _jsxs("div", { className: "detail-summary", children: [_jsx("span", { children: "Status" }), _jsx("strong", { children: company.status }), _jsxs("span", { children: [company._count.memos, " research memos"] }), _jsx("button", { type: "button", className: "ghost-button", onClick: async () => {
                                    if (!companyId)
                                        return;
                                    if (token) {
                                        if (inWatchlist) {
                                            await removeCompanyFromPersistentWatchlist(token, companyId);
                                        }
                                        else {
                                            await addCompanyToPersistentWatchlist(token, companyId);
                                        }
                                        setWatchlistIds(await fetchPersistentWatchlistCompanyIds(token));
                                    }
                                    else {
                                        toggleCompanyInWatchlist(companyId);
                                        setWatchlistIds(getWatchlistCompanyIds());
                                    }
                                }, children: inWatchlist ? "Remove from Watchlist" : "Add to Watchlist" })] })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: company.description ?? "Company profile content will be populated from the database." })] }), _jsxs("section", { className: "card content-card", children: [_jsx("h2", { children: "Research" }), company.memos.length ? (_jsx("div", { className: "stack-list", children: company.memos.map((memo) => (_jsxs(Link, { to: `/research/${memo.id}`, className: "stack-row", children: [_jsx("strong", { children: memo.title }), _jsxs("span", { children: [memo.recommendation, " \u00B7 ", memo.status] })] }, memo.id))) })) : (_jsx("p", { className: "muted", children: "No memos are linked to this company yet." }))] })] }));
}
