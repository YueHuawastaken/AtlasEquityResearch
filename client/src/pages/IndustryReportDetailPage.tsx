import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchIndustryReport, type IndustryReportDetail } from "../services/contentApi.js";

const sections: Array<[string, keyof IndustryReportDetail]> = [
  ["Overview", "overview"],
  ["Market Size", "marketSize"],
  ["TAM", "tam"],
  ["SAM", "sam"],
  ["SOM", "som"],
  ["Growth", "growth"],
  ["Porter Five Forces", "porterFiveForces"],
  ["Value Chain", "valueChain"],
  ["Competitors", "competitors"],
  ["Supply Chain", "supplyChain"],
  ["Demand Drivers", "demandDrivers"],
  ["Technology Trends", "technologyTrends"],
  ["Regulation", "regulation"],
  ["Risks", "risks"],
  ["Investment Implications", "investmentImplications"]
];

export function IndustryReportDetailPage() {
  const { reportId } = useParams();
  const [item, setItem] = useState<IndustryReportDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reportId) return;
    let active = true;
    void fetchIndustryReport(reportId).then((data) => { if (active) setItem(data); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reportId]);

  if (loading) return <div className="page-shell">Loading report…</div>;
  if (!item) return <div className="page-shell">Report not found.</div>;

  return (
    <div className="page-shell detail-page">
      <section className="detail-hero card">
        <div>
          <p className="eyebrow">Industry Research</p>
          <h1>{item.title}</h1>
          <p className="muted">{item.company ? <Link to={`/companies/${item.company.id}`}>{item.company.name} ({item.company.ticker})</Link> : "Unlinked research"}</p>
        </div>
        <div className="detail-summary"><span>Status</span><strong>{item.status}</strong></div>
      </section>

      <section className="card content-card"><h2>Executive Summary</h2><p>{item.executiveSummary}</p></section>

      <section className="grid-2">
        {sections.slice(0, 8).map(([label, key]) => <article key={label} className="card content-card"><h2>{label}</h2><p>{item[key] as string}</p></article>)}
      </section>

      <section className="grid-2">
        {sections.slice(8).map(([label, key]) => <article key={label} className="card content-card"><h2>{label}</h2><p>{item[key] as string}</p></article>)}
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
