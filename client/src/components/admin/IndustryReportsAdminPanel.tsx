import { useEffect, useState } from "react";
import {
  createIndustryReport,
  deleteIndustryReport,
  fetchAdminCompanies,
  fetchAdminIndustryReports,
  updateIndustryReport,
  type AdminCompany,
  type AdminIndustryReport,
  type IndustryReportPayload
} from "../../services/adminApi.js";
import { AttachmentManager } from "./AttachmentManager.js";

type Mode = "create" | "edit";

const emptyForm: IndustryReportPayload = {
  companyId: null,
  title: "",
  slug: "",
  executiveSummary: "",
  overview: "",
  marketSize: "",
  tam: "",
  sam: "",
  som: "",
  growth: "",
  porterFiveForces: "",
  valueChain: "",
  competitors: "",
  supplyChain: "",
  demandDrivers: "",
  technologyTrends: "",
  regulation: "",
  risks: "",
  investmentImplications: "",
  status: "draft",
  publishedAt: null
};

export function IndustryReportsAdminPanel() {
  const token = localStorage.getItem("atlas-admin-token");
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [items, setItems] = useState<AdminIndustryReport[]>([]);
  const [form, setForm] = useState<IndustryReportPayload>(emptyForm);
  const [mode, setMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;

    void Promise.all([fetchAdminCompanies(token), fetchAdminIndustryReports(token)]).then(([companyItems, reportItems]) => {
      if (!active) return;
      setCompanies(companyItems);
      setItems(reportItems);
      if (!form.companyId && companyItems[0]) {
        setForm((current) => ({ ...current, companyId: companyItems[0].id }));
      }
    });

    return () => {
      active = false;
    };
  }, [token]);

  if (!token) {
    return null;
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: IndustryReportPayload = {
      ...form,
      companyId: form.companyId || null,
      publishedAt: form.publishedAt?.trim() ? form.publishedAt : null
    };

    if (mode === "create") {
      await createIndustryReport(token, payload);
    } else if (editingId) {
      await updateIndustryReport(token, editingId, payload);
    }

    setItems(await fetchAdminIndustryReports(token));
    setForm((current) => ({ ...emptyForm, companyId: current.companyId || companies[0]?.id || null }));
    setMode("create");
    setEditingId(null);
  };

  return (
    <article className="card admin-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Industry Research</p>
          <h2>{mode === "create" ? "Create Industry Report" : "Edit Industry Report"}</h2>
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
        <textarea placeholder="Executive Summary" rows={4} value={form.executiveSummary} onChange={(event) => setForm({ ...form, executiveSummary: event.target.value })} required />
        <textarea placeholder="Overview" rows={4} value={form.overview} onChange={(event) => setForm({ ...form, overview: event.target.value })} required />
        <div className="content-grid-two">
          <input placeholder="Market Size" value={form.marketSize} onChange={(event) => setForm({ ...form, marketSize: event.target.value })} required />
          <input placeholder="TAM" value={form.tam} onChange={(event) => setForm({ ...form, tam: event.target.value })} required />
        </div>
        <div className="content-grid-two">
          <input placeholder="SAM" value={form.sam} onChange={(event) => setForm({ ...form, sam: event.target.value })} required />
          <input placeholder="SOM" value={form.som} onChange={(event) => setForm({ ...form, som: event.target.value })} required />
        </div>
        <textarea placeholder="Growth" rows={3} value={form.growth} onChange={(event) => setForm({ ...form, growth: event.target.value })} required />
        <textarea placeholder="Porter Five Forces" rows={4} value={form.porterFiveForces} onChange={(event) => setForm({ ...form, porterFiveForces: event.target.value })} required />
        <textarea placeholder="Value Chain" rows={3} value={form.valueChain} onChange={(event) => setForm({ ...form, valueChain: event.target.value })} required />
        <textarea placeholder="Competitors" rows={3} value={form.competitors} onChange={(event) => setForm({ ...form, competitors: event.target.value })} required />
        <textarea placeholder="Supply Chain" rows={3} value={form.supplyChain} onChange={(event) => setForm({ ...form, supplyChain: event.target.value })} required />
        <textarea placeholder="Demand Drivers" rows={3} value={form.demandDrivers} onChange={(event) => setForm({ ...form, demandDrivers: event.target.value })} required />
        <textarea placeholder="Technology Trends" rows={3} value={form.technologyTrends} onChange={(event) => setForm({ ...form, technologyTrends: event.target.value })} required />
        <textarea placeholder="Regulation" rows={3} value={form.regulation} onChange={(event) => setForm({ ...form, regulation: event.target.value })} required />
        <textarea placeholder="Risks" rows={3} value={form.risks} onChange={(event) => setForm({ ...form, risks: event.target.value })} required />
        <textarea placeholder="Investment Implications" rows={4} value={form.investmentImplications} onChange={(event) => setForm({ ...form, investmentImplications: event.target.value })} required />
        <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <input placeholder="Published At (ISO optional)" value={form.publishedAt ?? ""} onChange={(event) => setForm({ ...form, publishedAt: event.target.value })} />
        <button type="submit">Save Report</button>
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
                executiveSummary: item.executiveSummary,
                overview: item.overview,
                marketSize: item.marketSize,
                tam: item.tam,
                sam: item.sam,
                som: item.som,
                growth: item.growth,
                porterFiveForces: item.porterFiveForces,
                valueChain: item.valueChain,
                competitors: item.competitors,
                supplyChain: item.supplyChain,
                demandDrivers: item.demandDrivers,
                technologyTrends: item.technologyTrends,
                regulation: item.regulation,
                risks: item.risks,
                investmentImplications: item.investmentImplications,
                status: item.status,
                publishedAt: item.publishedAt
              }); }}>Edit</button>
              <button type="button" className="danger-button" onClick={async () => { await deleteIndustryReport(token, item.id); setItems(await fetchAdminIndustryReports(token)); }}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      <AttachmentManager scope="industryReport" parentId={editingId ?? items[0]?.id ?? null} title="Industry Report Files" />
    </article>
  );
}
