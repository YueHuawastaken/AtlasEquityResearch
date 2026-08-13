import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  deleteIndustryReport,
  deleteMarketOutlook,
  deleteMemo,
  deleteValuationModel,
  fetchAdminCompanies,
  fetchAdminIndustryReports,
  fetchAdminMarketOutlooks,
  fetchAdminMemos,
  fetchAdminMe,
  fetchAdminValuationModels,
  updateIndustryReport,
  updateMarketOutlook,
  updateMemo,
  updateValuationModel,
  type AdminCompany,
  type AdminIndustryReport,
  type AdminMarketOutlook,
  type AdminMemo,
  type AdminValuationModel
} from "../services/adminApi.js";

type ResearchRecord = AdminMemo | AdminIndustryReport | AdminMarketOutlook | AdminValuationModel;

function recordType(record: ResearchRecord) {
  if ("recommendation" in record) return "Investment Memo";
  if ("month" in record) return "Market Outlook";
  if ("valuationConclusion" in record) return "Valuation Model";
  return "Industry Research";
}

const numericFields = new Set([
  "targetPrice", "currentPrice", "expectedReturn", "convictionLevel", "currentSharePrice",
  "revenue", "revenueGrowth", "ebitdaOrEbit", "freeCashFlow", "wacc", "terminalGrowthRate",
  "enterpriseValue", "equityValue", "sharesOutstanding", "fairValue", "upsideDownside"
]);

function editableFields(record: ResearchRecord) {
  if ("recommendation" in record) return ["companyId", "title", "slug", "recommendation", "targetPrice", "currentPrice", "expectedReturn", "investmentHorizon", "convictionLevel", "executiveSummary", "thesis", "keyCatalysts", "keyRisks", "status", "publishedAt"];
  if ("month" in record) return ["companyId", "title", "slug", "month", "executiveSummary", "federalReserve", "interestRates", "inflation", "gdp", "employment", "geopolitics", "currencies", "commodities", "technology", "ai", "semiconductors", "healthcare", "consumer", "financials", "marketValuation", "sectorOutlook", "portfolioPositioning", "conclusion", "status", "publishedAt"];
  if ("valuationConclusion" in record) return ["companyId", "title", "slug", "currentSharePrice", "revenue", "revenueGrowth", "ebitdaOrEbit", "freeCashFlow", "wacc", "terminalGrowthRate", "enterpriseValue", "equityValue", "sharesOutstanding", "fairValue", "upsideDownside", "valuationConclusion", "status", "publishedAt"];
  return ["companyId", "title", "slug", "executiveSummary", "overview", "marketSize", "tam", "sam", "som", "growth", "porterFiveForces", "valueChain", "competitors", "supplyChain", "demandDrivers", "technologyTrends", "regulation", "risks", "investmentImplications", "status", "publishedAt"];
}

function fieldLabel(field: string) {
  return field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

export function AdminStoragePage() {
  const token = localStorage.getItem("atlas-admin-token");
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [records, setRecords] = useState<ResearchRecord[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, unknown>>({});

  const load = async () => {
    if (!token) return;
    const [companyItems, memoItems, reportItems, outlookItems, valuationItems] = await Promise.all([
      fetchAdminCompanies(token), fetchAdminMemos(token), fetchAdminIndustryReports(token),
      fetchAdminMarketOutlooks(token), fetchAdminValuationModels(token)
    ]);
    setCompanies(companyItems);
    setRecords([...memoItems, ...reportItems, ...outlookItems, ...valuationItems]);
  };

  useEffect(() => {
    if (!token) return;
    void fetchAdminMe(token).then((user) => setAllowed(user.role === "admin" || user.role === "editor")).catch(() => setAllowed(false));
    void load();
  }, [token]);

  const matchingCompanies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return companies.filter((company) => !normalized || company.name.toLowerCase().includes(normalized) || company.ticker.toLowerCase().includes(normalized));
  }, [companies, query]);
  const selectedCompany = companies.find((company) => company.id === selectedCompanyId);
  const selectedRecords = records.filter((record) => record.companyId === selectedCompanyId);

  if (!token) return <Navigate to="/admin/login" replace />;
  if (allowed === null) return <div className="page-shell">Loading admin session…</div>;
  if (!allowed) return <div className="page-shell">Access denied.</div>;

  const saveEdit = async (record: ResearchRecord) => {
    if (!token) return;
    const payload = Object.fromEntries(Object.entries(editForm).map(([field, value]) => [field, numericFields.has(field) ? Number(value) : value]));
    if ("recommendation" in record) await updateMemo(token, record.id, payload);
    else if ("month" in record) await updateMarketOutlook(token, record.id, payload);
    else if ("valuationConclusion" in record) await updateValuationModel(token, record.id, payload);
    else await updateIndustryReport(token, record.id, payload);
    setEditingId(null);
    await load();
  };

  const remove = async (record: ResearchRecord) => {
    if (!token) return;
    if ("recommendation" in record) await deleteMemo(token, record.id);
    else if ("month" in record) await deleteMarketOutlook(token, record.id);
    else if ("valuationConclusion" in record) await deleteValuationModel(token, record.id);
    else await deleteIndustryReport(token, record.id);
    await load();
  };

  const beginEdit = (record: ResearchRecord) => {
    const values: Record<string, unknown> = {};
    for (const field of editableFields(record)) values[field] = record[field as keyof ResearchRecord] ?? "";
    setEditForm(values);
    setEditingId(record.id);
    setReadingId(null);
  };

  return <div className="page-shell">
    <section className="section-header"><div><p className="eyebrow">Admin Storage</p><h1>Manage Research</h1><p className="muted">Search a company to manage its associated research records.</p></div></section>
    <section className="card content-card">
      <label>Search by company name or ticker<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. ACME or Acme Corporation" /></label>
      <div className="stack-list">{matchingCompanies.map((company) => <button key={company.id} type="button" className="stack-row" onClick={() => setSelectedCompanyId(company.id)}><strong>{company.name}</strong><span>{company.ticker} · {company.sector}</span></button>)}</div>
    </section>
    {selectedCompany ? <section className="content-card"><p className="eyebrow">Selected Company</p><h2><Link to={`/companies/${selectedCompany.id}`}>{selectedCompany.name} ({selectedCompany.ticker})</Link></h2>
      {selectedRecords.length ? <div className="stack-list">{selectedRecords.map((record) => editingId === record.id ? <div key={record.id} className="admin-form">
        {editableFields(record).map((field) => <label key={field}>{fieldLabel(field)}{field === "status" ? <select value={String(editForm[field] ?? "draft")} onChange={(event) => setEditForm({ ...editForm, [field]: event.target.value })}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select> : field === "recommendation" ? <select value={String(editForm[field] ?? "hold")} onChange={(event) => setEditForm({ ...editForm, [field]: event.target.value })}><option value="buy">Buy</option><option value="overweight">Overweight</option><option value="hold">Hold</option><option value="underweight">Underweight</option><option value="sell">Sell</option></select> : ["executiveSummary", "thesis", "keyCatalysts", "keyRisks", "valuationConclusion", "overview", "growth", "porterFiveForces", "valueChain", "competitors", "supplyChain", "demandDrivers", "technologyTrends", "regulation", "risks", "investmentImplications", "federalReserve", "interestRates", "inflation", "gdp", "employment", "geopolitics", "currencies", "commodities", "technology", "ai", "semiconductors", "healthcare", "consumer", "financials", "marketValuation", "sectorOutlook", "portfolioPositioning", "conclusion"].includes(field) ? <textarea rows={4} value={String(editForm[field] ?? "")} onChange={(event) => setEditForm({ ...editForm, [field]: event.target.value })} /> : <input type={numericFields.has(field) ? "number" : "text"} step={numericFields.has(field) ? "any" : undefined} value={String(editForm[field] ?? "")} onChange={(event) => setEditForm({ ...editForm, [field]: numericFields.has(field) ? Number(event.target.value) : event.target.value })} />}</label>)}
        <div className="inline-actions"><button type="button" onClick={() => void saveEdit(record)}>Save</button><button type="button" className="ghost-button" onClick={() => setEditingId(null)}>Cancel</button></div>
      </div> : readingId === record.id ? <article key={record.id} className="content-card"><h3>{record.title}</h3>{editableFields(record).filter((field) => field !== "companyId").map((field) => <p key={field}><strong>{fieldLabel(field)}:</strong> {String(record[field as keyof ResearchRecord] ?? "")}</p>)}<button type="button" className="ghost-button" onClick={() => setReadingId(null)}>Close</button></article> : <article key={record.id} className="stack-row"><div><strong>{record.title}</strong><span>{recordType(record)} · {record.status}</span></div><div className="inline-actions"><button type="button" className="ghost-button" onClick={() => setReadingId(record.id)}>Read</button><button type="button" className="ghost-button" onClick={() => beginEdit(record)}>Edit</button><button type="button" className="danger-button" onClick={() => void remove(record)}>Delete</button></div></article>)}</div> : <p className="muted">No research is associated with this company.</p>}
    </section> : null}
  </div>;
}