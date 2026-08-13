import { useEffect, useState } from "react";
import {
  createIndustryReport,
  deleteIndustryReport,
  fetchAdminCompanies,
  fetchAdminIndustryReports,
  getAdminApiErrorMessage,
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

interface IndustryReportsAdminPanelProps {
  companyRefreshKey?: number;
}

export function IndustryReportsAdminPanel({ companyRefreshKey = 0 }: IndustryReportsAdminPanelProps) {
  const token = localStorage.getItem("atlas-admin-token");
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [items, setItems] = useState<AdminIndustryReport[]>([]);
  const [form, setForm] = useState<IndustryReportPayload>(emptyForm);
  const [mode, setMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

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
  }, [token, companyRefreshKey]);

  if (!token) {
    return null;
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const minimumLengths: Array<[string, string, number]> = [
      ["Title", form.title, 2],
      ["Slug", form.slug, 2],
      ["Executive Summary", form.executiveSummary, 20],
      ["Overview", form.overview, 20]
    ];
    const emptyFields = Object.entries(form).filter(([field, value]) => field !== "companyId" && field !== "authorId" && field !== "publishedAt" && field !== "status" && typeof value === "string" && !value.trim()).map(([field]) => field);
    const tooShort = minimumLengths.find(([, value, minimum]) => value.trim().length < minimum);
    if (emptyFields.length || tooShort) {
      setValidationError(tooShort ? `${tooShort[0]} must be at least ${tooShort[2]} characters.` : `Complete these fields: ${emptyFields.join(", ")}.`);
      return;
    }

    setValidationError(null);

    const payload: IndustryReportPayload = {
      ...form,
      companyId: form.companyId || null,
      publishedAt: form.publishedAt?.trim() ? form.publishedAt : null
    };

    try {
      if (mode === "create") {
        await createIndustryReport(token, payload);
      } else if (editingId) {
        await updateIndustryReport(token, editingId, payload);
      }
    } catch (error) {
      setValidationError(getAdminApiErrorMessage(error, "Unable to save the industry report."));
      return;
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
        {validationError ? <p className="auth-error">{validationError}</p> : null}
        <label>Company (optional)<select value={form.companyId ?? ""} onChange={(event) => setForm({ ...form, companyId: event.target.value || null })}>
          <option value="">No company</option>
          {companies.map((company) => <option key={company.id} value={company.id}>{company.name} ({company.ticker})</option>)}
        </select></label>
        <label>Report title<input placeholder="e.g. Cloud Infrastructure Industry Report" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required minLength={2} /></label>
        <label>URL slug<input placeholder="e.g. cloud-infrastructure-2026" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} required minLength={2} /></label>
        <label>Executive summary<textarea placeholder="Summarize the industry and its investment relevance (at least 20 characters)." rows={4} value={form.executiveSummary} onChange={(event) => setForm({ ...form, executiveSummary: event.target.value })} required minLength={20} /></label>
        <label>Industry overview<textarea placeholder="Describe the industry structure and key participants (at least 20 characters)." rows={4} value={form.overview} onChange={(event) => setForm({ ...form, overview: event.target.value })} required minLength={20} /></label>
        <div className="content-grid-two">
          <label>Market size<input placeholder="Current market size and period" value={form.marketSize} onChange={(event) => setForm({ ...form, marketSize: event.target.value })} required /></label>
          <label>TAM<input placeholder="Total addressable market" value={form.tam} onChange={(event) => setForm({ ...form, tam: event.target.value })} required /></label>
        </div>
        <div className="content-grid-two">
          <label>SAM<input placeholder="Serviceable addressable market" value={form.sam} onChange={(event) => setForm({ ...form, sam: event.target.value })} required /></label>
          <label>SOM<input placeholder="Serviceable obtainable market" value={form.som} onChange={(event) => setForm({ ...form, som: event.target.value })} required /></label>
        </div>
        <label>Growth outlook<textarea placeholder="Growth rate, drivers, and forecast assumptions" rows={3} value={form.growth} onChange={(event) => setForm({ ...form, growth: event.target.value })} required /></label>
        <label>Porter Five Forces<textarea placeholder="Supplier power, buyer power, rivalry, substitutes, and new entrants" rows={4} value={form.porterFiveForces} onChange={(event) => setForm({ ...form, porterFiveForces: event.target.value })} required /></label>
        <label>Value chain<textarea placeholder="Describe the industry's value chain and economics" rows={3} value={form.valueChain} onChange={(event) => setForm({ ...form, valueChain: event.target.value })} required /></label>
        <label>Competitors<textarea placeholder="Key competitors, positioning, and market shares" rows={3} value={form.competitors} onChange={(event) => setForm({ ...form, competitors: event.target.value })} required /></label>
        <label>Supply chain<textarea placeholder="Inputs, suppliers, bottlenecks, and dependencies" rows={3} value={form.supplyChain} onChange={(event) => setForm({ ...form, supplyChain: event.target.value })} required /></label>
        <label>Demand drivers<textarea placeholder="What drives demand and changes the market" rows={3} value={form.demandDrivers} onChange={(event) => setForm({ ...form, demandDrivers: event.target.value })} required /></label>
        <label>Technology trends<textarea placeholder="Relevant technologies and adoption trends" rows={3} value={form.technologyTrends} onChange={(event) => setForm({ ...form, technologyTrends: event.target.value })} required /></label>
        <label>Regulation<textarea placeholder="Regulatory environment and expected changes" rows={3} value={form.regulation} onChange={(event) => setForm({ ...form, regulation: event.target.value })} required /></label>
        <label>Risks<textarea placeholder="Principal industry and investment risks" rows={3} value={form.risks} onChange={(event) => setForm({ ...form, risks: event.target.value })} required /></label>
        <label>Investment implications<textarea placeholder="How investors should interpret the industry opportunity and risks" rows={4} value={form.investmentImplications} onChange={(event) => setForm({ ...form, investmentImplications: event.target.value })} required /></label>
        <label>Publication status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select></label>
        <label>Published at (ISO optional)<input placeholder="2026-08-13T12:00:00.000Z" value={form.publishedAt ?? ""} onChange={(event) => setForm({ ...form, publishedAt: event.target.value })} /></label>
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
