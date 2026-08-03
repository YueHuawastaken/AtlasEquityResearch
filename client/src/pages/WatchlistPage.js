import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCompanies } from "../services/researchApi.js";
import { fetchPersistentWatchlistCompanyIds, getWatchlistCompanyIds, removeCompanyFromPersistentWatchlist, removeCompanyFromWatchlist } from "../services/watchlist.js";
export function WatchlistPage() {
    const token = localStorage.getItem("atlas-admin-token");
    const [companies, setCompanies] = useState([]);
    const [watchlistIds, setWatchlistIds] = useState([]);
    const [loading, setLoading] = useState(true);
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
        void fetchCompanies({ pageSize: 100 }).then((response) => {
            if (!active)
                return;
            setCompanies(response.items);
            setLoading(false);
        });
        const onStorage = () => setWatchlistIds(getWatchlistCompanyIds());
        window.addEventListener("storage", onStorage);
        return () => {
            active = false;
            window.removeEventListener("storage", onStorage);
        };
    }, []);
    const items = companies.filter((company) => watchlistIds.includes(company.id));
    return (_jsxs("div", { className: "page-shell", children: [_jsx("section", { className: "section-header", children: _jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Personal Research" }), _jsx("h1", { children: "Watchlist" }), _jsx("p", { className: "muted", children: "Track the companies you care about and jump back into the underlying research quickly." })] }) }), _jsx("section", { className: "card content-card", children: loading ? (_jsx("div", { className: "table-empty", children: "Loading watchlist\u2026" })) : items.length ? (_jsx("div", { className: "stack-list", children: items.map((company) => (_jsxs("article", { className: "stack-row watchlist-row", children: [_jsxs("div", { children: [_jsx(Link, { to: `/companies/${company.id}`, className: "table-primary", children: _jsx("strong", { children: company.name }) }), _jsxs("span", { children: [company.ticker, " \u00B7 ", company.sector, " \u00B7 ", company.industry] })] }), _jsx("button", { type: "button", className: "ghost-button", onClick: async () => {
                                    if (token) {
                                        await removeCompanyFromPersistentWatchlist(token, company.id);
                                        setWatchlistIds(await fetchPersistentWatchlistCompanyIds(token));
                                    }
                                    else {
                                        removeCompanyFromWatchlist(company.id);
                                        setWatchlistIds(getWatchlistCompanyIds());
                                    }
                                }, children: "Remove" })] }, company.id))) })) : (_jsx("div", { className: "table-empty", children: "Your watchlist is empty. Add companies from the company detail page." })) })] }));
}
