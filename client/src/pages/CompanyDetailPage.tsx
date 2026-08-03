import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCompany, type CompanyDetail } from "../services/researchApi.js";
import {
  addCompanyToPersistentWatchlist,
  fetchPersistentWatchlistCompanyIds,
  getWatchlistCompanyIds,
  isCompanyInWatchlist,
  removeCompanyFromPersistentWatchlist,
  toggleCompanyInWatchlist
} from "../services/watchlist.js";

export function CompanyDetailPage() {
  const { companyId } = useParams();
  const token = localStorage.getItem("atlas-admin-token");
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);

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

    if (!companyId) {
      setLoading(false);
      return;
    }

    void fetchCompany(companyId)
      .then((data) => {
        if (active) setCompany(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [companyId]);

  const inWatchlist = companyId ? watchlistIds.includes(companyId) : false;

  if (loading) {
    return <div className="page-shell">Loading company…</div>;
  }

  if (!company) {
    return <div className="page-shell">Company not found.</div>;
  }

  return (
    <div className="page-shell detail-page">
      <section className="detail-hero card">
        <div>
          <p className="eyebrow">Company</p>
          <h1>{company.name}</h1>
          <p className="muted">{company.ticker} · {company.exchange} · {company.sector} · {company.industry}</p>
        </div>
        <div className="detail-summary">
          <span>Status</span>
          <strong>{company.status}</strong>
          <span>{company._count.memos} research memos</span>
          <button
            type="button"
            className="ghost-button"
            onClick={async () => {
              if (!companyId) return;

              if (token) {
                if (inWatchlist) {
                  await removeCompanyFromPersistentWatchlist(token, companyId);
                } else {
                  await addCompanyToPersistentWatchlist(token, companyId);
                }

                setWatchlistIds(await fetchPersistentWatchlistCompanyIds(token));
              } else {
                toggleCompanyInWatchlist(companyId);
                setWatchlistIds(getWatchlistCompanyIds());
              }
            }}
          >
            {inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          </button>
        </div>
      </section>

      <section className="card content-card">
        <h2>Overview</h2>
        <p>{company.description ?? "Company profile content will be populated from the database."}</p>
      </section>

      <section className="card content-card">
        <h2>Research</h2>
        {company.memos.length ? (
          <div className="stack-list">
            {company.memos.map((memo) => (
              <Link key={memo.id} to={`/research/${memo.id}`} className="stack-row">
                <strong>{memo.title}</strong>
                <span>{memo.recommendation} · {memo.status}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted">No memos are linked to this company yet.</p>
        )}
      </section>
    </div>
  );
}
