import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchCompanies, type CompanyListItem } from "../services/researchApi.js";

export function CompaniesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<CompanyListItem[]>([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    let active = true;
    setLoading(true);

    void fetchCompanies({
      search: searchParams.get("search") ?? undefined,
      sector: searchParams.get("sector") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined
    })
      .then((data) => {
        if (!active) return;
        setItems(data.items);
        setPageInfo({ page: data.page, pageSize: data.pageSize, total: data.total, totalPages: data.totalPages });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [searchParams]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (query.trim()) next.set("search", query.trim());
    else next.delete("search");
    next.set("page", "1");
    setSearchParams(next);
  };

  return (
    <div className="page-shell">
      <section className="section-header">
        <div>
          <p className="eyebrow">Coverage</p>
          <h1>Companies</h1>
          <p className="muted">Search the company universe that anchors all research, memos, and valuation work.</p>
        </div>

        <form className="search-bar" onSubmit={submitSearch}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search companies, tickers, sectors" />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="card table-card">
        {loading ? (
          <div className="table-empty">Loading companies…</div>
        ) : items.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Ticker</th>
                  <th>Sector</th>
                  <th>Industry</th>
                  <th>Memos</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((company) => (
                  <tr key={company.id}>
                    <td>
                      <Link to={`/companies/${company.id}`} className="table-primary">
                        {company.name}
                      </Link>
                      <span>{company.exchange}</span>
                    </td>
                    <td>{company.ticker}</td>
                    <td>{company.sector}</td>
                    <td>{company.industry}</td>
                    <td>{company._count.memos}</td>
                    <td>{company.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-empty">No companies found. Add companies in the admin workflow once Phase 2 continues.</div>
        )}
      </section>

      <footer className="page-footer-meta">
        <span>Page {pageInfo.page} of {pageInfo.totalPages}</span>
        <span>{pageInfo.total} companies</span>
      </footer>
    </div>
  );
}
