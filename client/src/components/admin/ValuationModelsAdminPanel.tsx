import { useEffect, useState } from "react";
import {
  createValuationModel,
  deleteValuationModel,
  fetchAdminCompanies,
  fetchAdminValuationModels,
  getAdminApiErrorMessage,
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
  const [form, setForm] = useState<ValuationModelPayload>(emptyForm);
  const [mode, setMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;

    void fetchAdminCompanies(token).then((companyItems) => {
      if (!active) return;
      setCompanies(companyItems);
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

    const positiveFields: Array<[string, number]> = [
      ["Current share price", form.currentSharePrice],
      ["Shares outstanding", form.sharesOutstanding]
    ];
    const numericFields: Array<[string, number]> = [
      ["Current share price", form.currentSharePrice],
      ["Revenue", form.revenue],
      ["Revenue growth", form.revenueGrowth],
      ["EBITDA / EBIT", form.ebitdaOrEbit],
      ["Free cash flow", form.freeCashFlow],
      ["WACC", form.wacc],
      ["Terminal growth rate", form.terminalGrowthRate],
      ["Enterprise value", form.enterpriseValue],
      ["Equity value", form.equityValue],
      ["Shares outstanding", form.sharesOutstanding],
      ["Fair value per share", form.fairValue],
      ["Upside / downside", form.upsideDownside]
    ];
    const invalidPositive = positiveFields.find(([, value]) => !Number.isFinite(value) || value <= 0);
    const invalidShares = !Number.isSafeInteger(form.sharesOutstanding);
    const invalidNumeric = numericFields.find(([, value]) => !Number.isFinite(value));
    if (!form.companyId || !form.title.trim() || form.title.trim().length < 2 || !form.slug.trim() || form.slug.trim().length < 2 || invalidPositive || invalidShares || invalidNumeric || form.valuationConclusion.trim().length < 10) {
      setValidationError(invalidShares ? "Shares outstanding must be a positive whole number." : invalidPositive ? `${invalidPositive[0]} must be greater than 0.` : invalidNumeric ? `${invalidNumeric[0]} must be a valid number.` : !form.companyId ? "Select a company." : form.valuationConclusion.trim().length < 10 ? "Valuation conclusion must be at least 10 characters." : "Title and slug must each be at least 2 characters.");
      return;
    }

    setValidationError(null);

    const payload: ValuationModelPayload = {
      ...form,
      companyId: form.companyId,
      publishedAt: form.publishedAt?.trim() ? form.publishedAt : null
    };

    try {
      if (mode === "create") {
        await createValuationModel(token, payload);
      } else if (editingId) {
        await updateValuationModel(token, editingId, payload);
      }
    } catch (error) {
      setValidationError(getAdminApiErrorMessage(error, "Unable to save the valuation model."));
      return;
    }

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
        {validationError ? <p className="auth-error">{validationError}</p> : null}
        <label>Company<select value={form.companyId} onChange={(event) => setForm({ ...form, companyId: event.target.value })} required>
          <option value="">Select company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>{company.name} ({company.ticker})</option>
          ))}
        </select></label>
        <label>Model title<input placeholder="e.g. DCF Valuation Model" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required minLength={2} /></label>
        <label>URL slug<input placeholder="e.g. acme-dcf-2026" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} required minLength={2} /></label>
        <div className="inline-grid">
          <label>Current share price<input type="number" min="0.01" step="0.01" placeholder="Latest share price, e.g. 125.50" value={form.currentSharePrice} onChange={(event) => setForm({ ...form, currentSharePrice: Number(event.target.value) })} required /></label>
          <label>Revenue<input type="number" step="0.01" placeholder="Annual revenue in reporting currency" value={form.revenue} onChange={(event) => setForm({ ...form, revenue: Number(event.target.value) })} required /></label>
        </div>
        <div className="inline-grid">
          <label>Revenue growth<input type="number" step="0.0001" placeholder="Growth rate as decimal, e.g. 0.12" value={form.revenueGrowth} onChange={(event) => setForm({ ...form, revenueGrowth: Number(event.target.value) })} required /></label>
          <label>EBITDA / EBIT<input type="number" step="0.01" placeholder="Operating profit in reporting currency" value={form.ebitdaOrEbit} onChange={(event) => setForm({ ...form, ebitdaOrEbit: Number(event.target.value) })} required /></label>
        </div>
        <div className="inline-grid">
          <label>Free cash flow<input type="number" step="0.01" placeholder="Annual free cash flow in reporting currency" value={form.freeCashFlow} onChange={(event) => setForm({ ...form, freeCashFlow: Number(event.target.value) })} required /></label>
          <label>WACC<input type="number" step="0.0001" placeholder="Weighted average cost of capital as decimal" value={form.wacc} onChange={(event) => setForm({ ...form, wacc: Number(event.target.value) })} required /></label>
        </div>
        <div className="inline-grid">
          <label>Terminal growth rate<input type="number" step="0.0001" placeholder="Long-term growth as decimal, e.g. 0.03" value={form.terminalGrowthRate} onChange={(event) => setForm({ ...form, terminalGrowthRate: Number(event.target.value) })} required /></label>
          <label>Enterprise value<input type="number" step="0.01" placeholder="Enterprise value in reporting currency" value={form.enterpriseValue} onChange={(event) => setForm({ ...form, enterpriseValue: Number(event.target.value) })} required /></label>
        </div>
        <div className="inline-grid">
          <label>Equity value<input type="number" step="0.01" placeholder="Equity value after debt and cash adjustments" value={form.equityValue} onChange={(event) => setForm({ ...form, equityValue: Number(event.target.value) })} required /></label>
          <label>Shares outstanding<input type="number" min="1" step="1" inputMode="numeric" placeholder="e.g. 7430000000" value={form.sharesOutstanding || ""} onChange={(event) => setForm({ ...form, sharesOutstanding: Number(event.target.value) })} required /></label>
        </div>
        <div className="inline-grid">
          <label>Fair value per share<input type="number" step="0.01" placeholder="Calculated fair value per share" value={form.fairValue} onChange={(event) => setForm({ ...form, fairValue: Number(event.target.value) })} required /></label>
          <label>Upside / downside<input type="number" step="0.0001" placeholder="Percentage as decimal, e.g. 0.20" value={form.upsideDownside} onChange={(event) => setForm({ ...form, upsideDownside: Number(event.target.value) })} required /></label>
        </div>
        <label>Valuation conclusion<textarea placeholder="Summarize the valuation outcome and key assumptions (at least 10 characters)." rows={5} value={form.valuationConclusion} onChange={(event) => setForm({ ...form, valuationConclusion: event.target.value })} required minLength={10} /></label>
        <label>Publication status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select></label>
        <label>Published at (ISO optional)<input placeholder="2026-08-13T12:00:00.000Z" value={form.publishedAt ?? ""} onChange={(event) => setForm({ ...form, publishedAt: event.target.value })} /></label>
        <button type="submit">Save Model</button>
      </form>

      <AttachmentManager scope="valuationModel" parentId={editingId} title="Valuation Model Files" />
    </article>
  );
}
