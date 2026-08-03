import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchMemo, type MemoDetail } from "../services/researchApi.js";

export function MemoDetailPage() {
  const { memoId } = useParams();
  const [memo, setMemo] = useState<MemoDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!memoId) {
      setLoading(false);
      return;
    }

    void fetchMemo(memoId)
      .then((data) => {
        if (active) setMemo(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [memoId]);

  if (loading) {
    return <div className="page-shell">Loading memo…</div>;
  }

  if (!memo) {
    return <div className="page-shell">Memo not found.</div>;
  }

  return (
    <div className="page-shell detail-page">
      <section className="detail-hero card">
        <div>
          <p className="eyebrow">Investment Memo</p>
          <h1>{memo.title}</h1>
          <p className="muted">
            <Link to={`/companies/${memo.company.id}`}>{memo.company.name}</Link> · {memo.company.ticker} · {memo.recommendation}
          </p>
        </div>
        <div className="detail-summary">
          <span>Status</span>
          <strong>{memo.status}</strong>
          <span>{memo.convictionLevel}/10 conviction</span>
        </div>
      </section>

      <section className="grid-2">
        <article className="card content-card">
          <h2>Summary</h2>
          <p>{memo.executiveSummary}</p>
        </article>
        <article className="card content-card">
          <h2>Company Snapshot</h2>
          <p>{memo.company.sector} · {memo.company.industry}</p>
          <p>{memo.company.description ?? "Company details will expand as the research stack grows."}</p>
        </article>
      </section>

      <section className="card content-card">
        <h2>Thesis</h2>
        <p>{memo.thesis}</p>
      </section>

      <section className="card content-card">
        <h2>Metadata</h2>
        <div className="meta-grid">
          <div><span>Target Price</span><strong>{memo.targetPrice}</strong></div>
          <div><span>Current Price</span><strong>{memo.currentPrice}</strong></div>
          <div><span>Expected Return</span><strong>{memo.expectedReturn}</strong></div>
          <div><span>Horizon</span><strong>{memo.investmentHorizon}</strong></div>
        </div>
      </section>

      <section className="card content-card">
        <h2>Attachments</h2>
        {memo.attachments.length ? (
          <div className="stack-list">
            {memo.attachments.map((attachment) => (
              <a key={attachment.id} className="stack-row" href={attachment.url} target="_blank" rel="noreferrer">
                <strong>{attachment.fileName}</strong>
                <span>{attachment.fileType}</span>
              </a>
            ))}
          </div>
        ) : (
          <p className="muted">No attachments yet.</p>
        )}
      </section>
    </div>
  );
}
