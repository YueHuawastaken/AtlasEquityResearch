import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchResearchJournalEntry, type ResearchJournalDetail } from "../services/contentApi.js";

export function ResearchJournalDetailPage() {
  const { journalId } = useParams();
  const [item, setItem] = useState<ResearchJournalDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!journalId) return;
    let active = true;
    void fetchResearchJournalEntry(journalId).then((data) => { if (active) setItem(data); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [journalId]);

  if (loading) return <div className="page-shell">Loading journal entry…</div>;
  if (!item) return <div className="page-shell">Journal entry not found.</div>;

  return (
    <div className="page-shell detail-page">
      <section className="detail-hero card">
        <div>
          <p className="eyebrow">Research Journal</p>
          <h1>{item.title}</h1>
          <p className="muted">{item.company ? <Link to={`/companies/${item.company.id}`}>{item.company.name} ({item.company.ticker})</Link> : "Independent note"}</p>
        </div>
        <div className="detail-summary"><span>Status</span><strong>{item.status}</strong></div>
      </section>

      <section className="card content-card"><h2>Prompt</h2><p>{item.prompt}</p></section>
      <section className="card content-card"><h2>Body</h2><p>{item.body}</p></section>
      <section className="card content-card"><h2>Reflections</h2><p>{item.reflections}</p></section>

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
