import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCompanies, type CompanyListItem } from "../services/researchApi.js";
import {
  fetchPersistentWatchlistCompanyIds,
  getWatchlistCompanyIds,
  removeCompanyFromPersistentWatchlist,
  removeCompanyFromWatchlist
} from "../services/watchlist.js";

export function WatchlistPage() {
  const token = localStorage.getItem("atlas-admin-token");
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void (async () => {
      if (token) {
        try {
          const ids = await fetchPersistentWatchlistCompanyIds(token);
          if (active) setWatchlistIds(ids);
          return;
        } catch {
          if (active) setWatchlistIds(getWatchlistCompanyIds());
        }
      } else if (active) {
        setWatchlistIds(getWatchlistCompanyIds());
      }
    })();

    void fetchCompanies({ pageSize: 100 }).then((response) => {
      if (!active) return;
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

  return (
    <div className="page-shell">
      <section className="section-header">
        <div>
          <p className="eyebrow">Personal Research</p>
          <h1>Watchlist</h1>
          <p className="muted">Track the companies you care about and jump back into the underlying research quickly.</p>
        </div>
      </section>

      <section className="card content-card">
        {loading ? (
          <div className="table-empty">Loading watchlist…</div>
        ) : items.length ? (
          <div className="stack-list">
            {items.map((company) => (
              <article key={company.id} className="stack-row watchlist-row">
                <div>
                  <Link to={`/companies/${company.id}`} className="table-primary">
                    <strong>{company.name}</strong>
                  </Link>
                  <span>{company.ticker} · {company.sector} · {company.industry}</span>
                </div>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={async () => {
                    if (token) {
                      await removeCompanyFromPersistentWatchlist(token, company.id);
                      setWatchlistIds(await fetchPersistentWatchlistCompanyIds(token));
                    } else {
                      removeCompanyFromWatchlist(company.id);
                      setWatchlistIds(getWatchlistCompanyIds());
                    }
                  }}
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="table-empty">Your watchlist is empty. Add companies from the company detail page.</div>
        )}
      </section>
    </div>
  );
}
