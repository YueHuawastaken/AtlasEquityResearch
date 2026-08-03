import { useEffect, useState } from "react";
import { api } from "../services/api.js";

interface DashboardStat {
  label: string;
  value: string;
  detail: string;
}

interface HomePayload {
  stats: DashboardStat[];
  featured?: {
    company: {
      id: string;
      name: string;
      ticker: string;
      sector: string;
      industry: string;
    } | null;
    memo: {
      id: string;
      title: string;
      slug: string;
      recommendation: string;
      company: {
        name: string;
        ticker: string;
      };
    } | null;
  };
}

const fallbackStats: DashboardStat[] = [
  { label: "Coverage", value: "0", detail: "Companies modeled" },
  { label: "Memos", value: "0", detail: "Published research notes" },
  { label: "Reports", value: "0", detail: "Industry and market views" },
  { label: "Downloads", value: "0", detail: "Files shared with users" }
];

export function HomePage() {
  const [payload, setPayload] = useState<HomePayload>({ stats: fallbackStats });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await api.get<HomePayload>("/api/home");
        if (!cancelled && response.data.stats?.length) {
          setPayload(response.data);
        }
      } catch {
        if (!cancelled) {
          setPayload({ stats: fallbackStats });
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page-shell">
      <section className="hero card">
        <div className="hero-copy">
          <p className="eyebrow">Independent Equity Research Platform</p>
          <h1>Institutional research built for long-term capital allocation thinking.</h1>
          <p className="lead">
            Atlas Equity Research centralizes company coverage, valuation work, industry analysis, and market outlooks in a structured, searchable platform.
          </p>
        </div>

        <div className="hero-panel">
          <div className="panel-row">
            <span>Featured Coverage</span>
            <strong>Company, memo, and valuation data will come from the database.</strong>
          </div>
          <div className="panel-row muted">
            <span>Search</span>
            <strong>Companies, tickers, research, industries, and tags.</strong>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {payload.stats.map((stat) => (
          <article key={stat.label} className="card stat-card">
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
            <span>{stat.detail}</span>
          </article>
        ))}
      </section>

      <section className="home-feature-grid">
        <article className="card feature-card">
          <p className="eyebrow">Featured Company</p>
          {payload.featured?.company ? (
            <>
              <h2>{payload.featured.company.name}</h2>
              <p>{payload.featured.company.ticker} · {payload.featured.company.sector} · {payload.featured.company.industry}</p>
            </>
          ) : (
            <p className="muted">No companies have been added yet.</p>
          )}
        </article>

        <article className="card feature-card">
          <p className="eyebrow">Latest Memo</p>
          {payload.featured?.memo ? (
            <>
              <h2>{payload.featured.memo.title}</h2>
              <p>{payload.featured.memo.company.name} ({payload.featured.memo.company.ticker}) · {payload.featured.memo.recommendation}</p>
            </>
          ) : (
            <p className="muted">No investment memos have been published yet.</p>
          )}
        </article>
      </section>
    </div>
  );
}
