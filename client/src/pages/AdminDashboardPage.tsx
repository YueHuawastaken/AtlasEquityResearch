import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { IndustryReportsAdminPanel } from "../components/admin/IndustryReportsAdminPanel.js";
import { MarketOutlooksAdminPanel } from "../components/admin/MarketOutlooksAdminPanel.js";
import { ValuationModelsAdminPanel } from "../components/admin/ValuationModelsAdminPanel.js";
import { ContactMessagesAdminPanel } from "../components/admin/ContactMessagesAdminPanel.js";
import {
  createCompany,
  createIndustryReport,
  createMarketOutlook,
  createMemo,
  deleteCompany,
  deleteIndustryReport,
  deleteMarketOutlook,
  deleteMemo,
  fetchAdminCompanies,
  fetchAdminMe,
  fetchOverview,
  updateIndustryReport,
  updateMarketOutlook,
  updateCompany,
  updateMemo,
  type AdminCompany,
  type CompanyPayload,
  type IndustryReportPayload,
  type MarketOutlookPayload,
  type MemoPayload
} from "../services/adminApi.js";

type Mode = "create" | "edit";

const emptyCompany: CompanyPayload = {
  name: "",
  ticker: "",
  exchange: "",
  sector: "",
  industry: "",
  description: "",
  status: "draft"
};

const emptyMemo: MemoPayload = {
  companyId: "",
  authorId: null,
  title: "",
  slug: "",
  recommendation: "hold",
  targetPrice: 0,
  currentPrice: 0,
  expectedReturn: 0,
  investmentHorizon: "12 months",
  convictionLevel: 5,
  executiveSummary: "",
  thesis: "",
  keyCatalysts: "",
  keyRisks: "",
  status: "draft",
  publishedAt: null
};

const emptyIndustryReport: IndustryReportPayload = {
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

const emptyMarketOutlook: MarketOutlookPayload = {
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

export function AdminDashboardPage() {
  const token = localStorage.getItem("atlas-admin-token");
  const [meLoaded, setMeLoaded] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [overview, setOverview] = useState({ companyCount: 0, memoCount: 0, reportCount: 0, outlookCount: 0, valuationModelCount: 0, draftCount: 0, contactCount: 0 });
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [companyForm, setCompanyForm] = useState<CompanyPayload>(emptyCompany);
  const [memoForm, setMemoForm] = useState<MemoPayload>(emptyMemo);
  const [industryReportForm, setIndustryReportForm] = useState<IndustryReportPayload>(emptyIndustryReport);
  const [marketOutlookForm, setMarketOutlookForm] = useState<MarketOutlookPayload>(emptyMarketOutlook);
  const [companyMode, setCompanyMode] = useState<Mode>("create");
  const [memoMode, setMemoMode] = useState<Mode>("create");
  const [industryReportMode, setIndustryReportMode] = useState<Mode>("create");
  const [marketOutlookMode, setMarketOutlookMode] = useState<Mode>("create");
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [editingIndustryReportId, setEditingIndustryReportId] = useState<string | null>(null);
  const [editingMarketOutlookId, setEditingMarketOutlookId] = useState<string | null>(null);
  const [memoValidationError, setMemoValidationError] = useState<string | null>(null);
  const [companyRefreshKey, setCompanyRefreshKey] = useState(0);

  const refreshCompanies = async (authToken: string) => {
    const refreshed = await fetchAdminCompanies(authToken);
    setCompanies(refreshed);
    setCompanyRefreshKey((current) => current + 1);
    return refreshed;
  };

  useEffect(() => {
    if (!token) {
      setMeLoaded(true);
      return;
    }

    let active = true;
    void fetchAdminMe(token)
      .then((user) => {
        if (!active) return;
        setAllowed(user.role === "admin" || user.role === "editor");
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem("atlas-admin-token");
        setTokenInvalid(true);
        setAllowed(false);
      })
      .finally(() => {
        if (active) setMeLoaded(true);
      });

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (!token || !allowed) return;

    let active = true;

    void fetchAdminCompanies(token).then((companyItems) => {
      if (!active) return;
      setCompanies(companyItems);
      if (!memoForm.companyId && companyItems[0]) {
        setMemoForm((current) => ({ ...current, companyId: companyItems[0].id }));
      }
      if (!industryReportForm.companyId && companyItems[0]) {
        setIndustryReportForm((current) => ({ ...current, companyId: companyItems[0].id }));
      }
      if (!marketOutlookForm.companyId && companyItems[0]) {
        setMarketOutlookForm((current) => ({ ...current, companyId: companyItems[0].id }));
      }
    });

    void fetchOverview(token)
      .then((overviewData) => {
        if (!active) return;
        setOverview(overviewData.stats);
      });

    return () => {
      active = false;
    };
  }, [token, allowed]);

  if (!meLoaded) {
    return <div className="page-shell">Loading admin session…</div>;
  }

  if (!token || tokenInvalid) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!allowed) {
    return <div className="page-shell">Access denied.</div>;
  }

  const submitCompany = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    const payload = {
      ...companyForm,
      description: companyForm.description?.trim() ? companyForm.description.trim() : null
    };

    if (companyMode === "create") {
      await createCompany(token, payload);
    } else if (editingCompanyId) {
      await updateCompany(token, editingCompanyId, payload);
    }

    await refreshCompanies(token);
    setCompanyForm(emptyCompany);
    setCompanyMode("create");
    setEditingCompanyId(null);
  };

  const submitMemo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    const errors: string[] = [];

    if (memoForm.targetPrice <= 0) {
      errors.push("Target price must be greater than 0.");
    }

    if (memoForm.currentPrice <= 0) {
      errors.push("Current price must be greater than 0.");
    }

    if (memoForm.executiveSummary.trim().length < 20) {
      errors.push("Executive summary must be at least 20 characters.");
    }

    if (memoForm.thesis.trim().length < 20) {
      errors.push("Thesis must be at least 20 characters.");
    }

    if (errors.length) {
      setMemoValidationError(errors.join(" "));
      return;
    }

    setMemoValidationError(null);

    const payload: MemoPayload = {
      ...memoForm,
      authorId: memoForm.authorId?.trim() ? memoForm.authorId : null,
      publishedAt: memoForm.publishedAt?.trim() ? memoForm.publishedAt : null
    };

    if (memoMode === "create") {
      await createMemo(token, payload);
    } else if (editingMemoId) {
      await updateMemo(token, editingMemoId, payload);
    }

    setMemoForm((current) => ({ ...emptyMemo, companyId: current.companyId || companies[0]?.id || "" }));
    setMemoMode("create");
    setEditingMemoId(null);
  };

  const submitIndustryReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    const payload: IndustryReportPayload = {
      ...industryReportForm,
      companyId: industryReportForm.companyId || null,
      publishedAt: industryReportForm.publishedAt?.trim() ? industryReportForm.publishedAt : null
    };

    if (industryReportMode === "create") {
      await createIndustryReport(token, payload);
    } else if (editingIndustryReportId) {
      await updateIndustryReport(token, editingIndustryReportId, payload);
    }

    setIndustryReportForm((current) => ({ ...emptyIndustryReport, companyId: current.companyId || companies[0]?.id || null }));
    setIndustryReportMode("create");
    setEditingIndustryReportId(null);
  };

  const submitMarketOutlook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    const payload: MarketOutlookPayload = {
      ...marketOutlookForm,
      companyId: marketOutlookForm.companyId || null,
      publishedAt: marketOutlookForm.publishedAt?.trim() ? marketOutlookForm.publishedAt : null
    };

    if (marketOutlookMode === "create") {
      await createMarketOutlook(token, payload);
    } else if (editingMarketOutlookId) {
      await updateMarketOutlook(token, editingMarketOutlookId, payload);
    }

    setMarketOutlookForm((current) => ({ ...emptyMarketOutlook, companyId: current.companyId || companies[0]?.id || null }));
    setMarketOutlookMode("create");
    setEditingMarketOutlookId(null);
  };

  return (
    <div className="page-shell admin-shell">
      <section className="section-header">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>Content Operations</h1>
          <p className="muted">Create, edit, publish, and remove companies and memos from one control surface.</p>
        </div>
        <div className="admin-stats">
          <div><span>Companies</span><strong>{overview.companyCount}</strong></div>
          <div><span>Memos</span><strong>{overview.memoCount}</strong></div>
          <div><span>Reports</span><strong>{overview.reportCount}</strong></div>
          <div><span>Outlooks</span><strong>{overview.outlookCount}</strong></div>
          <div><span>Valuation Models</span><strong>{overview.valuationModelCount}</strong></div>
          <div><span>Drafts</span><strong>{overview.draftCount}</strong></div>
          <div><span>Messages</span><strong>{overview.contactCount}</strong></div>
        </div>
      </section>

      <section className="admin-grid">
        <article className="card admin-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Company</p>
              <h2>{companyMode === "create" ? "Create Company" : "Edit Company"}</h2>
            </div>
            <button type="button" className="ghost-button" onClick={() => { setCompanyMode("create"); setCompanyForm(emptyCompany); }}>Reset</button>
          </div>

          <form className="admin-form" onSubmit={submitCompany}>
            <input placeholder="Name" value={companyForm.name} onChange={(event) => setCompanyForm({ ...companyForm, name: event.target.value })} required />
            <input placeholder="Ticker" value={companyForm.ticker} onChange={(event) => setCompanyForm({ ...companyForm, ticker: event.target.value.toUpperCase() })} required />
            <input placeholder="Exchange" value={companyForm.exchange} onChange={(event) => setCompanyForm({ ...companyForm, exchange: event.target.value })} required />
            <input placeholder="Sector" value={companyForm.sector} onChange={(event) => setCompanyForm({ ...companyForm, sector: event.target.value })} required />
            <input placeholder="Industry" value={companyForm.industry} onChange={(event) => setCompanyForm({ ...companyForm, industry: event.target.value })} required />
            <textarea placeholder="Description" value={companyForm.description ?? ""} onChange={(event) => setCompanyForm({ ...companyForm, description: event.target.value })} rows={5} />
            <select value={companyForm.status} onChange={(event) => setCompanyForm({ ...companyForm, status: event.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <button type="submit">Save Company</button>
          </form>

        </article>

        <article className="card admin-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Memo</p>
              <h2>{memoMode === "create" ? "Create Memo" : "Edit Memo"}</h2>
            </div>
            <button type="button" className="ghost-button" onClick={() => { setMemoMode("create"); setMemoForm({ ...emptyMemo, companyId: companies[0]?.id ?? "" }); }}>Reset</button>
          </div>

          <form className="admin-form" onSubmit={submitMemo}>
            <label>Company<select value={memoForm.companyId} onChange={(event) => setMemoForm({ ...memoForm, companyId: event.target.value })} required>
              <option value="">Select company</option>
              {companies.map((company) => <option key={company.id} value={company.id}>{company.name} ({company.ticker})</option>)}
            </select></label>
            <label>Memo title<input placeholder="e.g. Acme investment thesis" value={memoForm.title} onChange={(event) => setMemoForm({ ...memoForm, title: event.target.value })} required /></label>
            <label>URL slug<input placeholder="e.g. acme-investment-thesis-2026" value={memoForm.slug} onChange={(event) => setMemoForm({ ...memoForm, slug: event.target.value })} required /></label>
            <label>Recommendation<select value={memoForm.recommendation} onChange={(event) => setMemoForm({ ...memoForm, recommendation: event.target.value })}>
              <option value="buy">Buy</option>
              <option value="overweight">Overweight</option>
              <option value="hold">Hold</option>
              <option value="underweight">Underweight</option>
              <option value="sell">Sell</option>
            </select></label>
            <div className="inline-grid">
              <label>Target price<input type="number" step="0.01" min="0.01" placeholder="12-month target price" value={memoForm.targetPrice} onChange={(event) => setMemoForm({ ...memoForm, targetPrice: Number(event.target.value) })} required /></label>
              <label>Current price<input type="number" step="0.01" min="0.01" placeholder="Latest share price" value={memoForm.currentPrice} onChange={(event) => setMemoForm({ ...memoForm, currentPrice: Number(event.target.value) })} required /></label>
            </div>
            <div className="inline-grid">
              <label>Expected return<input type="number" step="0.01" placeholder="Expected return as decimal or percentage" value={memoForm.expectedReturn} onChange={(event) => setMemoForm({ ...memoForm, expectedReturn: Number(event.target.value) })} /></label>
              <label>Conviction (1-10)<input type="number" min={1} max={10} placeholder="Confidence from 1 to 10" value={memoForm.convictionLevel} onChange={(event) => setMemoForm({ ...memoForm, convictionLevel: Number(event.target.value) })} /></label>
            </div>
            <label>Investment horizon<input placeholder="e.g. 12 months" value={memoForm.investmentHorizon} onChange={(event) => setMemoForm({ ...memoForm, investmentHorizon: event.target.value })} /></label>
            <label>Executive summary<textarea placeholder="At least 20 characters summarizing the idea" value={memoForm.executiveSummary} onChange={(event) => setMemoForm({ ...memoForm, executiveSummary: event.target.value })} rows={5} minLength={20} required /></label>
            <label>Investment thesis<textarea placeholder="At least 20 characters explaining the thesis and catalysts" value={memoForm.thesis} onChange={(event) => setMemoForm({ ...memoForm, thesis: event.target.value })} rows={6} minLength={20} required /></label>
            <label>Key Catalysts<textarea placeholder="What could drive the thesis forward" value={memoForm.keyCatalysts} onChange={(event) => setMemoForm({ ...memoForm, keyCatalysts: event.target.value })} rows={4} required /></label>
            <label>Key Risks<textarea placeholder="What could weaken or invalidate the thesis" value={memoForm.keyRisks} onChange={(event) => setMemoForm({ ...memoForm, keyRisks: event.target.value })} rows={4} required /></label>
            {memoValidationError ? <p className="auth-error">{memoValidationError}</p> : null}
            <label>Publication status<select value={memoForm.status} onChange={(event) => setMemoForm({ ...memoForm, status: event.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select></label>
            <label>Published at (ISO optional)<input placeholder="2026-08-13T12:00:00.000Z" value={memoForm.publishedAt ?? ""} onChange={(event) => setMemoForm({ ...memoForm, publishedAt: event.target.value })} /></label>
            <button type="submit">Save Memo</button>
          </form>

        </article>
      </section>

      <section className="admin-content-grid">
        <IndustryReportsAdminPanel companyRefreshKey={companyRefreshKey} />
        <MarketOutlooksAdminPanel companyRefreshKey={companyRefreshKey} />
        <ValuationModelsAdminPanel companyRefreshKey={companyRefreshKey} />
      </section>

      <section>
        <ContactMessagesAdminPanel />
      </section>

    </div>
  );
}
