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
          <span>{company._count.memos} research memos</span>
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
