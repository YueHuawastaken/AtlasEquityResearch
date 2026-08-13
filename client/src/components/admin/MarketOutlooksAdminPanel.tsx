import { useEffect, useState } from "react";
import {
  createMarketOutlook,
  deleteMarketOutlook,
  fetchAdminCompanies,
  fetchAdminMarketOutlooks,
  updateMarketOutlook,
  type AdminCompany,
  type AdminMarketOutlook,
  type MarketOutlookPayload
} from "../../services/adminApi.js";
import { AttachmentManager } from "./AttachmentManager.js";

type Mode = "create" | "edit";

const emptyForm: MarketOutlookPayload = {
  companyId: null,
  title: "",
  slug: "",
  month: "",
  executiveSummary: "",
  federalReserve: "",
  interestRates: "",
  inflation: "",
  gdp: "",
  employment: "",
  geopolitics: "",
  currencies: "",
  commodities: "",
  technology: "",
  ai: "",
  semiconductors: "",
  healthcare: "",
  consumer: "",
  financials: "",
  marketValuation: "",
  sectorOutlook: "",
  portfolioPositioning: "",
  conclusion: "",
  status: "draft",
  publishedAt: null
};

interface MarketOutlooksAdminPanelProps {
  companyRefreshKey?: number;
}

export function MarketOutlooksAdminPanel({ companyRefreshKey = 0 }: MarketOutlooksAdminPanelProps) {
  const token = localStorage.getItem("atlas-admin-token");
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [items, setItems] = useState<AdminMarketOutlook[]>([]);
  const [form, setForm] = useState<MarketOutlookPayload>(emptyForm);
  const [mode, setMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let active = true;

    void Promise.all([fetchAdminCompanies(token), fetchAdminMarketOutlooks(token)]).then(([companyItems, outlookItems]) => {
      if (!active) return;
      setCompanies(companyItems);
      setItems(outlookItems);
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

    const payload: MarketOutlookPayload = {
      ...form,
      companyId: form.companyId || null,
      publishedAt: form.publishedAt?.trim() ? form.publishedAt : null
    };

    if (mode === "create") {
      await createMarketOutlook(token, payload);
    } else if (editingId) {
      await updateMarketOutlook(token, editingId, payload);
    }

    setForm((current) => ({ ...emptyForm, companyId: current.companyId || companies[0]?.id || null }));
    setMode("create");
    setEditingId(null);
  };

  return (
    <article className="card admin-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Market Outlook</p>
          <h2>{mode === "create" ? "Create Outlook" : "Edit Outlook"}</h2>
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
        <input placeholder="Month" value={form.month} onChange={(event) => setForm({ ...form, month: event.target.value })} required />
        <textarea placeholder="Executive Summary" rows={4} value={form.executiveSummary} onChange={(event) => setForm({ ...form, executiveSummary: event.target.value })} required />
        <textarea placeholder="Federal Reserve" rows={3} value={form.federalReserve} onChange={(event) => setForm({ ...form, federalReserve: event.target.value })} required />
        <textarea placeholder="Interest Rates" rows={3} value={form.interestRates} onChange={(event) => setForm({ ...form, interestRates: event.target.value })} required />
        <textarea placeholder="Inflation" rows={3} value={form.inflation} onChange={(event) => setForm({ ...form, inflation: event.target.value })} required />
        <textarea placeholder="GDP" rows={3} value={form.gdp} onChange={(event) => setForm({ ...form, gdp: event.target.value })} required />
        <textarea placeholder="Employment" rows={3} value={form.employment} onChange={(event) => setForm({ ...form, employment: event.target.value })} required />
        <textarea placeholder="Geopolitics" rows={3} value={form.geopolitics} onChange={(event) => setForm({ ...form, geopolitics: event.target.value })} required />
        <textarea placeholder="Currencies" rows={3} value={form.currencies} onChange={(event) => setForm({ ...form, currencies: event.target.value })} required />
        <textarea placeholder="Commodities" rows={3} value={form.commodities} onChange={(event) => setForm({ ...form, commodities: event.target.value })} required />
        <textarea placeholder="Technology" rows={3} value={form.technology} onChange={(event) => setForm({ ...form, technology: event.target.value })} required />
        <textarea placeholder="AI" rows={3} value={form.ai} onChange={(event) => setForm({ ...form, ai: event.target.value })} required />
        <textarea placeholder="Semiconductors" rows={3} value={form.semiconductors} onChange={(event) => setForm({ ...form, semiconductors: event.target.value })} required />
        <textarea placeholder="Healthcare" rows={3} value={form.healthcare} onChange={(event) => setForm({ ...form, healthcare: event.target.value })} required />
        <textarea placeholder="Consumer" rows={3} value={form.consumer} onChange={(event) => setForm({ ...form, consumer: event.target.value })} required />
        <textarea placeholder="Financials" rows={3} value={form.financials} onChange={(event) => setForm({ ...form, financials: event.target.value })} required />
        <textarea placeholder="Market Valuation" rows={3} value={form.marketValuation} onChange={(event) => setForm({ ...form, marketValuation: event.target.value })} required />
        <textarea placeholder="Sector Outlook" rows={3} value={form.sectorOutlook} onChange={(event) => setForm({ ...form, sectorOutlook: event.target.value })} required />
        <textarea placeholder="Portfolio Positioning" rows={3} value={form.portfolioPositioning} onChange={(event) => setForm({ ...form, portfolioPositioning: event.target.value })} required />
        <textarea placeholder="Conclusion" rows={4} value={form.conclusion} onChange={(event) => setForm({ ...form, conclusion: event.target.value })} required />
        <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <input placeholder="Published At (ISO optional)" value={form.publishedAt ?? ""} onChange={(event) => setForm({ ...form, publishedAt: event.target.value })} />
        <button type="submit">Save Outlook</button>
      </form>

      <AttachmentManager scope="marketOutlook" parentId={editingId} title="Market Outlook Files" />
    </article>
  );
}
