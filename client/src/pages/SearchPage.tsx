import { useState } from "react";
import { Link } from "react-router-dom";
import { searchAtlas, type SearchResultItem } from "../services/contentApi.js";

const resultRoutes: Record<SearchResultItem["type"], (item: SearchResultItem) => string> = {
  company: (item) => `/companies/${item.id}`,
  memo: (item) => `/research/${item.id}`,
  "industry-report": (item) => `/industry-research/${item.id}`,
  "market-outlook": (item) => `/market-outlooks/${item.id}`,
  "research-journal": (item) => `/journal/${item.id}`
};

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      setItems(await searchAtlas(query));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="section-header">
        <div>
          <p className="eyebrow">Search</p>
          <h1>Search Everything</h1>
          <p className="muted">Companies, memos, reports, outlooks, and journal entries.</p>
        </div>
        <form className="search-bar" onSubmit={onSubmit}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search across the platform" />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="card table-card">
        {loading ? <div className="table-empty">Searching…</div> : items.length ? (
          <div className="stack-list">
            {items.map((item) => (
              <Link key={`${item.type}-${item.id}`} to={resultRoutes[item.type](item)} className="stack-row">
                <strong>{item.title}</strong>
                <span>{item.type} · {item.status}</span>
                <p className="muted">{item.subtitle}</p>
              </Link>
            ))}
          </div>
        ) : <div className="table-empty">No results yet.</div>}
      </section>
    </div>
  );
}
