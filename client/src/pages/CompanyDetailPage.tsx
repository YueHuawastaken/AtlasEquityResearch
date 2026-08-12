import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCompany, type CompanyDetail } from "../services/researchApi.js";

export function CompanyDetailPage() {
  const { companyId } = useParams();
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

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
          <span>{company._count?.memos ?? company.memos.length} research memos</span>
        </div>
      </section>

      <section className="card content-card">
        <h2>Overview</h2>
        <p>{company.description ?? "Company profile content will be populated from the database."}</p>
      </section>

      <section className="card content-card">
        <h2>Investment Memos</h2>
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

      <section className="card content-card">
        <h2>Industry Research</h2>
        {company.reports.length ? (
          <div className="stack-list">
            {company.reports.map((report) => (
              <Link key={report.id} to={`/industry-research/${report.id}`} className="stack-row">
                <strong>{report.title}</strong>
                <span>{report.status}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted">No published industry reports are linked yet.</p>
        )}
      </section>

      <section className="card content-card">
        <h2>Market Outlooks</h2>
        {company.outlooks.length ? (
          <div className="stack-list">
            {company.outlooks.map((outlook) => (
              <Link key={outlook.id} to={`/market-outlooks/${outlook.id}`} className="stack-row">
                <strong>{outlook.title}</strong>
                <span>{outlook.month} · {outlook.status}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted">No published market outlooks are linked yet.</p>
        )}
      </section>

      <section className="card content-card">
        <h2>Valuation Models</h2>
        {company.valuationModels.length ? (
          <div className="stack-list">
            {company.valuationModels.map((model) => (
              <Link key={model.id} to={`/valuation-models/${model.id}`} className="stack-row">
                <strong>{model.title}</strong>
                <span>Price {model.currentSharePrice} · Fair Value {model.fairValue} · Upside/Downside {model.upsideDownside}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="muted">No published valuation models are linked yet.</p>
        )}
      </section>
    </div>
  );
}
