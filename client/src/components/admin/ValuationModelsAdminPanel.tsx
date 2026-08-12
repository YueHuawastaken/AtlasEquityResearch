import { useEffect, useState } from "react";
import {
  createValuationModel,
  deleteValuationModel,
  fetchAdminCompanies,
  fetchAdminValuationModels,
  updateValuationModel,
  type AdminCompany,
  type AdminValuationModel,
  type ValuationModelPayload
} from "../../services/adminApi.js";
import { AttachmentManager } from "./AttachmentManager.js";

type Mode = "create" | "edit";

const emptyForm: ValuationModelPayload = {
  companyId: "",
  title: "",
  slug: "",
  currentSharePrice: 0,
  revenue: 0,
  revenueGrowth: 0,
  ebitdaOrEbit: 0,
  freeCashFlow: 0,
  wacc: 0,
  terminalGrowthRate: 0,
  enterpriseValue: 0,
  equityValue: 0,
  sharesOutstanding: 0,
  fairValue: 0,
  upsideDownside: 0,
  valuationConclusion: "",
  status: "draft",
  publishedAt: null
};

interface ValuationModelsAdminPanelProps {
  companyRefreshKey?: number;
}

export function ValuationModelsAdminPanel({ companyRefreshKey = 0 }: ValuationModelsAdminPanelProps) {
  const token = localStorage.getItem("atlas-admin-token");
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [items, setItems] = useState<AdminValuationModel[]>([]);
  const [form, setForm] = useState<ValuationModelPayload>(emptyForm);
  const [mode, setMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;

    void Promise.all([fetchAdminCompanies(token), fetchAdminValuationModels(token)]).then(([companyItems, valuationItems]) => {
      if (!active) return;
      setCompanies(companyItems);
      setItems(valuationItems);
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

    const payload: ValuationModelPayload = {
      ...form,
      companyId: form.companyId,
      publishedAt: form.publishedAt?.trim() ? form.publishedAt : null
    };

    if (mode === "create") {
      await createValuationModel(token, payload);
    } else if (editingId) {
      await updateValuationModel(token, editingId, payload);
    }

    setItems(await fetchAdminValuationModels(token));
    setForm((current) => ({ ...emptyForm, companyId: current.companyId || companies[0]?.id || "" }));
    setMode("create");
    setEditingId(null);
  };

  return (
    <article className="card admin-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Valuation Models</p>
          <h2>{mode === "create" ? "Create Valuation Model" : "Edit Valuation Model"}</h2>
        </div>
        <button type="button" className="ghost-button" onClick={() => { setMode("create"); setForm({ ...emptyForm, companyId: companies[0]?.id ?? "" }); setEditingId(null); }}>Reset</button>
      </div>

      <form className="admin-form" onSubmit={submit}>
        <select value={form.companyId} onChange={(event) => setForm({ ...form, companyId: event.target.value })} required>
          <option value="">Select company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>{company.name} ({company.ticker})</option>
          ))}
        </select>
        <input placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
        <input placeholder="Slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} required />
        <div className="inline-grid">
          <input type="number" step="0.01" placeholder="Current Share Price" value={form.currentSharePrice} onChange={(event) => setForm({ ...form, currentSharePrice: Number(event.target.value) })} required />
          <input type="number" step="0.01" placeholder="Revenue" value={form.revenue} onChange={(event) => setForm({ ...form, revenue: Number(event.target.value) })} required />
        </div>
        <div className="inline-grid">
          <input type="number" step="0.0001" placeholder="Revenue Growth" value={form.revenueGrowth} onChange={(event) => setForm({ ...form, revenueGrowth: Number(event.target.value) })} required />
          <input type="number" step="0.01" placeholder="EBITDA / EBIT" value={form.ebitdaOrEbit} onChange={(event) => setForm({ ...form, ebitdaOrEbit: Number(event.target.value) })} required />
        </div>
        <div className="inline-grid">
          <input type="number" step="0.01" placeholder="Free Cash Flow" value={form.freeCashFlow} onChange={(event) => setForm({ ...form, freeCashFlow: Number(event.target.value) })} required />
          <input type="number" step="0.0001" placeholder="WACC" value={form.wacc} onChange={(event) => setForm({ ...form, wacc: Number(event.target.value) })} required />
        </div>
        <div className="inline-grid">
          <input type="number" step="0.0001" placeholder="Terminal Growth Rate" value={form.terminalGrowthRate} onChange={(event) => setForm({ ...form, terminalGrowthRate: Number(event.target.value) })} required />
          <input type="number" step="0.01" placeholder="Enterprise Value" value={form.enterpriseValue} onChange={(event) => setForm({ ...form, enterpriseValue: Number(event.target.value) })} required />
        </div>
        <div className="inline-grid">
          <input type="number" step="0.01" placeholder="Equity Value" value={form.equityValue} onChange={(event) => setForm({ ...form, equityValue: Number(event.target.value) })} required />
          <input type="number" step="0.01" placeholder="Shares Outstanding" value={form.sharesOutstanding} onChange={(event) => setForm({ ...form, sharesOutstanding: Number(event.target.value) })} required />
        </div>
        <div className="inline-grid">
          <input type="number" step="0.01" placeholder="Fair Value / Target Price" value={form.fairValue} onChange={(event) => setForm({ ...form, fairValue: Number(event.target.value) })} required />
          <input type="number" step="0.0001" placeholder="Upside / Downside" value={form.upsideDownside} onChange={(event) => setForm({ ...form, upsideDownside: Number(event.target.value) })} required />
        </div>
        <textarea placeholder="Valuation Conclusion" rows={5} value={form.valuationConclusion} onChange={(event) => setForm({ ...form, valuationConclusion: event.target.value })} required />
        <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <input placeholder="Published At (ISO optional)" value={form.publishedAt ?? ""} onChange={(event) => setForm({ ...form, publishedAt: event.target.value })} />
        <button type="submit">Save Model</button>
      </form>

      <div className="admin-list">
        {items.map((item) => (
          <article key={item.id} className="admin-list-item">
            <div>
              <strong>{item.title}</strong>
              <span>{item.company.name} · fair value {item.fairValue} · {item.status}</span>
            </div>
            <div className="inline-actions">
              <button type="button" className="ghost-button" onClick={() => { setMode("edit"); setEditingId(item.id); setForm({
                companyId: item.company.id,
                title: item.title,
                slug: item.slug,
                currentSharePrice: Number(item.currentSharePrice),
                revenue: Number(item.revenue),
                revenueGrowth: Number(item.revenueGrowth),
                ebitdaOrEbit: Number(item.ebitdaOrEbit),
                freeCashFlow: Number(item.freeCashFlow),
                wacc: Number(item.wacc),
                terminalGrowthRate: Number(item.terminalGrowthRate),
                enterpriseValue: Number(item.enterpriseValue),
                equityValue: Number(item.equityValue),
                sharesOutstanding: Number(item.sharesOutstanding),
                fairValue: Number(item.fairValue),
                upsideDownside: Number(item.upsideDownside),
                valuationConclusion: item.valuationConclusion,
                status: item.status,
                publishedAt: item.publishedAt
              }); }}>Edit</button>
              <button type="button" className="danger-button" onClick={async () => { await deleteValuationModel(token, item.id); setItems(await fetchAdminValuationModels(token)); }}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      <AttachmentManager scope="valuationModel" parentId={editingId ?? items[0]?.id ?? null} title="Valuation Model Files" />
    </article>
  );
}
