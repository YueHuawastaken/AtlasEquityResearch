import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    fetchIndustryReports,
    type IndustryReportListItem,
} from "../services/contentApi.js";

import {
    fetchCompanies,
    type CompanyListItem,
} from "../services/researchApi.js";

export function IndustryReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<IndustryReportListItem[]>([]);
  const [companies, setCompanies] = useState<CompanyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  useEffect(() => {
    let active = true;
    void fetchCompanies({ pageSize: 100 }).then((response) => { if (active) setCompanies(response.items); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    void fetchIndustryReports({ search: searchParams.get("search") ?? undefined, companyId: searchParams.get("companyId") ?? undefined })
      .then((response) => {
        if (active) setItems(response.items);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [searchParams]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (query.trim()) next.set("search", query.trim()); else next.delete("search");
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
          <p className="eyebrow">Industry Research</p>
          <h1>Industry Reports</h1>
          <p className="muted">Structured coverage of market structure, TAM/SAM/SOM, value chains, and investment implications.</p>
        </div>
        <form className="search-bar" onSubmit={submitSearch}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reports" />
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
          <button type="button" className="ghost-button" onClick={() => { setQuery(""); setSearchParams(new URLSearchParams()); }}>Clear Filters</button>
        </div>
      </section>

      <section className="card table-card">
        {loading ? <div className="table-empty">Loading reports…</div> : items.length ? (
          <div className="stack-list">
            {items.map((item) => (
              <Link key={item.id} to={`/industry-research/${item.id}`} className="stack-row">
                <strong>{item.title}</strong>
                <span>{item.company ? `${item.company.name} (${item.company.ticker})` : "Industry report"}</span>
                <p className="muted">{item.executiveSummary}</p>
              </Link>
            ))}
          </div>
        ) : <div className="table-empty">No industry reports found.</div>}
      </section>
    </div>
  );
}
