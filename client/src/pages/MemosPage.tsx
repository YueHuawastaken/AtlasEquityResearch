import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchCompanies, fetchMemos, type CompanyListItem, type MemoListItem } from "../services/researchApi.js";

export function MemosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<MemoListItem[]>([]);
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    let active = true;

    void fetchCompanies({ pageSize: 100 }).then((response) => {
      if (active) setCompanies(response.items);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    void fetchMemos({
      search: searchParams.get("search") ?? undefined,
      companyId: searchParams.get("companyId") ?? undefined,
      recommendation: searchParams.get("recommendation") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      pageSize: searchParams.get("pageSize") ?? undefined
    })
      .then((data) => {
        if (active) setItems(data.items);
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

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  return (
    <div className="page-shell">
      <section className="section-header">
        <div>
          <p className="eyebrow">Research</p>
          <h1>Investment Memos</h1>
          <p className="muted">Database-driven memo archive for valuation, thesis work, and long-term investment ideas.</p>
        </div>

        <form className="search-bar" onSubmit={submitSearch}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search memo title, slug, summary" />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="card content-card">
        <div className="filter-bar">
          <select value={searchParams.get("companyId") ?? ""} onChange={(event) => updateFilter("companyId", event.target.value)}>
            <option value="">All companies</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{company.name} ({company.ticker})</option>
            ))}
          </select>
          <select value={searchParams.get("recommendation") ?? ""} onChange={(event) => updateFilter("recommendation", event.target.value)}>
            <option value="">All recommendations</option>
            <option value="buy">Buy</option>
            <option value="overweight">Overweight</option>
            <option value="hold">Hold</option>
            <option value="underweight">Underweight</option>
            <option value="sell">Sell</option>
          </select>
          <button type="button" className="ghost-button" onClick={() => { setQuery(""); setSearchParams(new URLSearchParams()); }}>Clear Filters</button>
        </div>
      </section>

      <section className="card table-card">
        {loading ? (
          <div className="table-empty">Loading memos…</div>
        ) : items.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Memo</th>
                  <th>Company</th>
                  <th>Recommendation</th>
                  <th>Target Price</th>
                  <th>Current Price</th>
                  <th>Expected Return</th>
                </tr>
              </thead>
              <tbody>
                {items.map((memo) => (
                  <tr key={memo.id}>
                    <td>
                      <Link to={`/research/${memo.id}`} className="table-primary">
                        {memo.title}
                      </Link>
                      <span>{memo.slug}</span>
                    </td>
                    <td>{memo.company.name} ({memo.company.ticker})</td>
                    <td>{memo.recommendation}</td>
                    <td>{memo.targetPrice}</td>
                    <td>{memo.currentPrice}</td>
                    <td>{memo.expectedReturn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-empty">No investment memos found yet.</div>
        )}
      </section>
    </div>
  );
}
