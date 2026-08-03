import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchMarketOutlook, type MarketOutlookDetail } from "../services/contentApi.js";

const sections: Array<[string, keyof MarketOutlookDetail]> = [
  ["Federal Reserve", "federalReserve"],
  ["Interest Rates", "interestRates"],
  ["Inflation", "inflation"],
  ["GDP", "gdp"],
  ["Employment", "employment"],
  ["Geopolitics", "geopolitics"],
  ["Currencies", "currencies"],
  ["Commodities", "commodities"],
  ["Technology", "technology"],
  ["AI", "ai"],
  ["Semiconductors", "semiconductors"],
  ["Healthcare", "healthcare"],
  ["Consumer", "consumer"],
  ["Financials", "financials"],
  ["Market Valuation", "marketValuation"],
  ["Sector Outlook", "sectorOutlook"],
  ["Portfolio Positioning", "portfolioPositioning"],
  ["Conclusion", "conclusion"]
];

export function MarketOutlookDetailPage() {
  const { outlookId } = useParams();
  const [item, setItem] = useState<MarketOutlookDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!outlookId) return;
    let active = true;
    void fetchMarketOutlook(outlookId).then((data) => { if (active) setItem(data); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [outlookId]);

  if (loading) return <div className="page-shell">Loading outlook…</div>;
  if (!item) return <div className="page-shell">Market outlook not found.</div>;

  return (
    <div className="page-shell detail-page">
      <section className="detail-hero card">
        <div>
          <p className="eyebrow">Market Outlook</p>
          <h1>{item.title}</h1>
          <p className="muted">{item.company ? <Link to={`/companies/${item.company.id}`}>{item.company.name} ({item.company.ticker})</Link> : item.month}</p>
        </div>
        <div className="detail-summary"><span>Status</span><strong>{item.status}</strong></div>
      </section>

      <section className="card content-card"><h2>Executive Summary</h2><p>{item.executiveSummary}</p></section>

      <section className="grid-2">
        {sections.slice(0, 9).map(([label, key]) => <article key={label} className="card content-card"><h2>{label}</h2><p>{item[key] as string}</p></article>)}
      </section>

      <section className="grid-2">
        {sections.slice(9).map(([label, key]) => <article key={label} className="card content-card"><h2>{label}</h2><p>{item[key] as string}</p></article>)}
      </section>

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
