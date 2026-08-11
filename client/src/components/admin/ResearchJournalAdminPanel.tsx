import { useEffect, useState } from "react";
import {
  createResearchJournal,
  deleteResearchJournal,
  fetchAdminCompanies,
  fetchAdminResearchJournal,
  updateResearchJournal,
  type AdminCompany,
  type AdminResearchJournal,
  type ResearchJournalPayload
} from "../../services/adminApi.js";
import { AttachmentManager } from "./AttachmentManager.js";

type Mode = "create" | "edit";

const emptyForm: ResearchJournalPayload = {
  companyId: null,
  title: "",
  slug: "",
  prompt: "",
  body: "",
  reflections: "",
  status: "draft",
  publishedAt: null
};

interface ResearchJournalAdminPanelProps {
  companyRefreshKey?: number;
}

export function ResearchJournalAdminPanel({ companyRefreshKey = 0 }: ResearchJournalAdminPanelProps) {
  const token = localStorage.getItem("atlas-admin-token");
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [items, setItems] = useState<AdminResearchJournal[]>([]);
  const [form, setForm] = useState<ResearchJournalPayload>(emptyForm);
  const [mode, setMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;

    void Promise.all([fetchAdminCompanies(token), fetchAdminResearchJournal(token)]).then(([companyItems, journalItems]) => {
      if (!active) return;
      setCompanies(companyItems);
      setItems(journalItems);
      if (!form.companyId && companyItems[0]) {
        setForm((current) => ({ ...current, companyId: companyItems[0].id }));
      }
    });

    return () => {
      active = false;
    };
  }, [token, companyRefreshKey]);

  if (!token) {
    return null;
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: ResearchJournalPayload = {
      ...form,
      companyId: form.companyId || null,
      publishedAt: form.publishedAt?.trim() ? form.publishedAt : null
    };

    if (mode === "create") {
      await createResearchJournal(token, payload);
    } else if (editingId) {
      await updateResearchJournal(token, editingId, payload);
    }

    setItems(await fetchAdminResearchJournal(token));
    setForm((current) => ({ ...emptyForm, companyId: current.companyId || companies[0]?.id || null }));
    setMode("create");
    setEditingId(null);
  };

  return (
    <article className="card admin-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Research Journal</p>
          <h2>{mode === "create" ? "Create Journal Entry" : "Edit Journal Entry"}</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => { setMode("create"); setForm({ ...emptyForm, companyId: companies[0]?.id ?? null }); setEditingId(null); }}>Reset</button>
      </div>

      <form className="admin-form" onSubmit={submit}>
        <select value={form.companyId ?? ""} onChange={(event) => setForm({ ...form, companyId: event.target.value || null })}>
          <option value="">No company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>{company.name} ({company.ticker})</option>
          ))}
        </select>
        <input placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
        <input placeholder="Slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} required />
        <textarea placeholder="Prompt" rows={3} value={form.prompt} onChange={(event) => setForm({ ...form, prompt: event.target.value })} required />
        <textarea placeholder="Body" rows={6} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} required />
        <textarea placeholder="Reflections" rows={5} value={form.reflections} onChange={(event) => setForm({ ...form, reflections: event.target.value })} required />
        <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <input placeholder="Published At (ISO optional)" value={form.publishedAt ?? ""} onChange={(event) => setForm({ ...form, publishedAt: event.target.value })} />
        <button type="submit">Save Entry</button>
      </form>

      <div className="admin-list">
        {items.map((item) => (
          <article key={item.id} className="admin-list-item">
            <div>
              <strong>{item.title}</strong>
              <span>{item.company ? `${item.company.name} · ` : ""}{item.status}</span>
            </div>
            <div className="inline-actions">
              <button type="button" className="ghost-button" onClick={() => { setMode("edit"); setEditingId(item.id); setForm({
                companyId: item.company?.id ?? null,
                title: item.title,
                slug: item.slug,
                prompt: item.prompt,
                body: item.body,
                reflections: item.reflections,
                status: item.status,
                publishedAt: item.publishedAt
              }); }}>Edit</button>
              <button type="button" className="danger-button" onClick={async () => { await deleteResearchJournal(token, item.id); setItems(await fetchAdminResearchJournal(token)); }}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      <AttachmentManager scope="researchJournal" parentId={editingId ?? items[0]?.id ?? null} title="Research Journal Files" />
    </article>
  );
}
