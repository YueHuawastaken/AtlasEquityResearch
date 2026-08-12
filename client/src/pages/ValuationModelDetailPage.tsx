import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchValuationModel, type ValuationModelDetail } from "../services/contentApi.js";

export function ValuationModelDetailPage() {
  const { valuationModelId } = useParams();
  const [item, setItem] = useState<ValuationModelDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!valuationModelId) return;
    let active = true;
    void fetchValuationModel(valuationModelId).then((data) => { if (active) setItem(data); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [valuationModelId]);

  if (loading) return <div className="page-shell">Loading valuation model…</div>;
  if (!item) return <div className="page-shell">Valuation model not found.</div>;

  return (
    <div className="page-shell detail-page">
      <section className="detail-hero card">
        <div>
          <p className="eyebrow">Valuation Model</p>
          <h1>{item.title}</h1>
          <p className="muted"><Link to={`/companies/${item.company.id}`}>{item.company.name} ({item.company.ticker})</Link></p>
        </div>
        <div className="detail-summary"><span>Status</span><strong>{item.status}</strong></div>
      </section>

      <section className="card content-card">
        <h2>Valuation Inputs</h2>
        <div className="stack-list">
          <div className="stack-row"><strong>Current Share Price</strong><span>{item.currentSharePrice}</span></div>
          <div className="stack-row"><strong>Revenue</strong><span>{item.revenue}</span></div>
          <div className="stack-row"><strong>Revenue Growth</strong><span>{item.revenueGrowth}</span></div>
          <div className="stack-row"><strong>EBITDA / EBIT</strong><span>{item.ebitdaOrEbit}</span></div>
          <div className="stack-row"><strong>Free Cash Flow</strong><span>{item.freeCashFlow}</span></div>
          <div className="stack-row"><strong>WACC</strong><span>{item.wacc}</span></div>
          <div className="stack-row"><strong>Terminal Growth Rate</strong><span>{item.terminalGrowthRate}</span></div>
          <div className="stack-row"><strong>Enterprise Value</strong><span>{item.enterpriseValue}</span></div>
          <div className="stack-row"><strong>Equity Value</strong><span>{item.equityValue}</span></div>
          <div className="stack-row"><strong>Shares Outstanding</strong><span>{item.sharesOutstanding}</span></div>
          <div className="stack-row"><strong>Fair Value / Target Price</strong><span>{item.fairValue}</span></div>
          <div className="stack-row"><strong>Upside / Downside</strong><span>{item.upsideDownside}</span></div>
        </div>
      </section>

      <section className="card content-card"><h2>Valuation Conclusion</h2><p>{item.valuationConclusion}</p></section>

      <section className="card content-card">
        <h2>Attachments</h2>
        {item.attachments.length ? (
          <div className="stack-list">
            {item.attachments.map((attachment) => (
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
