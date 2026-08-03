import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { IndustryReportsAdminPanel } from "../components/admin/IndustryReportsAdminPanel.js";
import { MarketOutlooksAdminPanel } from "../components/admin/MarketOutlooksAdminPanel.js";
import { ResearchJournalAdminPanel } from "../components/admin/ResearchJournalAdminPanel.js";
import { ContactMessagesAdminPanel } from "../components/admin/ContactMessagesAdminPanel.js";
import {
  createCompany,
  createIndustryReport,
  createMarketOutlook,
  createResearchJournal,
  createMemo,
  deleteCompany,
  deleteIndustryReport,
  deleteMarketOutlook,
  deleteResearchJournal,
  deleteMemo,
  fetchAdminCompanies,
  fetchAdminIndustryReports,
  fetchAdminMarketOutlooks,
  fetchAdminResearchJournal,
  fetchAdminMemos,
  fetchAdminMe,
  fetchOverview,
  updateIndustryReport,
  updateMarketOutlook,
  updateResearchJournal,
  updateCompany,
  updateMemo,
  type AdminCompany,
  type AdminIndustryReport,
  type AdminMarketOutlook,
  type AdminResearchJournal,
  type AdminMemo,
  type CompanyPayload,
  type IndustryReportPayload,
  type MarketOutlookPayload,
  type MemoPayload,
  type ResearchJournalPayload
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

const emptyResearchJournal: ResearchJournalPayload = {
  companyId: null,
  title: "",
  slug: "",
  prompt: "",
  body: "",
  reflections: "",
  status: "draft",
  publishedAt: null
};

export function AdminDashboardPage() {
  const token = localStorage.getItem("atlas-admin-token");
  const [meLoaded, setMeLoaded] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [overview, setOverview] = useState({ companyCount: 0, memoCount: 0, reportCount: 0, outlookCount: 0, journalCount: 0, draftCount: 0, contactCount: 0 });
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [memos, setMemos] = useState<AdminMemo[]>([]);
  const [industryReports, setIndustryReports] = useState<AdminIndustryReport[]>([]);
  const [marketOutlooks, setMarketOutlooks] = useState<AdminMarketOutlook[]>([]);
  const [journalEntries, setJournalEntries] = useState<AdminResearchJournal[]>([]);
  const [companyForm, setCompanyForm] = useState<CompanyPayload>(emptyCompany);
  const [memoForm, setMemoForm] = useState<MemoPayload>(emptyMemo);
  const [industryReportForm, setIndustryReportForm] = useState<IndustryReportPayload>(emptyIndustryReport);
  const [marketOutlookForm, setMarketOutlookForm] = useState<MarketOutlookPayload>(emptyMarketOutlook);
  const [researchJournalForm, setResearchJournalForm] = useState<ResearchJournalPayload>(emptyResearchJournal);
  const [companyMode, setCompanyMode] = useState<Mode>("create");
  const [memoMode, setMemoMode] = useState<Mode>("create");
  const [industryReportMode, setIndustryReportMode] = useState<Mode>("create");
  const [marketOutlookMode, setMarketOutlookMode] = useState<Mode>("create");
  const [researchJournalMode, setResearchJournalMode] = useState<Mode>("create");
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [editingIndustryReportId, setEditingIndustryReportId] = useState<string | null>(null);
  const [editingMarketOutlookId, setEditingMarketOutlookId] = useState<string | null>(null);
  const [editingResearchJournalId, setEditingResearchJournalId] = useState<string | null>(null);

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
        if (active) setAllowed(false);
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

    void Promise.all([
      fetchOverview(token),
      fetchAdminCompanies(token),
      fetchAdminMemos(token),
      fetchAdminIndustryReports(token),
      fetchAdminMarketOutlooks(token),
      fetchAdminResearchJournal(token)
    ])
      .then(([overviewData, companyItems, memoItems, reportItems, outlookItems, journalItems]) => {
        if (!active) return;
        setOverview(overviewData.stats);
        setCompanies(companyItems);
        setMemos(memoItems);
        setIndustryReports(reportItems);
        setMarketOutlooks(outlookItems);
        setJournalEntries(journalItems);
        if (!memoForm.companyId && companyItems[0]) {
          setMemoForm((current) => ({ ...current, companyId: companyItems[0].id }));
        }
        if (!industryReportForm.companyId && companyItems[0]) {
          setIndustryReportForm((current) => ({ ...current, companyId: companyItems[0].id }));
        }
        if (!marketOutlookForm.companyId && companyItems[0]) {
          setMarketOutlookForm((current) => ({ ...current, companyId: companyItems[0].id }));
        }
        if (!researchJournalForm.companyId && companyItems[0]) {
          setResearchJournalForm((current) => ({ ...current, companyId: companyItems[0].id }));
        }
      });

    return () => {
      active = false;
    };
  }, [token, allowed]);

  if (!meLoaded) {
    return <div className="page-shell">Loading admin session…</div>;
  }

  if (!token) {
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

    const refreshed = await fetchAdminCompanies(token);
    setCompanies(refreshed);
    setCompanyForm(emptyCompany);
    setCompanyMode("create");
    setEditingCompanyId(null);
  };

  const submitMemo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

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

    const refreshed = await fetchAdminMemos(token);
    setMemos(refreshed);
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

    setIndustryReports(await fetchAdminIndustryReports(token));
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

    setMarketOutlooks(await fetchAdminMarketOutlooks(token));
    setMarketOutlookForm((current) => ({ ...emptyMarketOutlook, companyId: current.companyId || companies[0]?.id || null }));
    setMarketOutlookMode("create");
    setEditingMarketOutlookId(null);
  };

  const submitResearchJournal = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    const payload: ResearchJournalPayload = {
      ...researchJournalForm,
      companyId: researchJournalForm.companyId || null,
      publishedAt: researchJournalForm.publishedAt?.trim() ? researchJournalForm.publishedAt : null
    };

    if (researchJournalMode === "create") {
      await createResearchJournal(token, payload);
    } else if (editingResearchJournalId) {
      await updateResearchJournal(token, editingResearchJournalId, payload);
    }

    setJournalEntries(await fetchAdminResearchJournal(token));
    setResearchJournalForm((current) => ({ ...emptyResearchJournal, companyId: current.companyId || companies[0]?.id || null }));
    setResearchJournalMode("create");
    setEditingResearchJournalId(null);
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
          <div><span>Journal</span><strong>{overview.journalCount}</strong></div>
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

          <div className="admin-list">
            {companies.map((company) => (
              <article key={company.id} className="admin-list-item">
                <div>
                  <strong>{company.name}</strong>
                  <span>{company.ticker} · {company.status} · {company._count.memos} memos</span>
                </div>
                <div className="inline-actions">
                  <button type="button" className="ghost-button" onClick={() => { setCompanyMode("edit"); setCompanyForm({
                    name: company.name,
                    ticker: company.ticker,
                    exchange: company.exchange,
                    sector: company.sector,
                    industry: company.industry,
                    description: company.description ?? "",
                    status: company.status
                  }); setEditingCompanyId(company.id); }}>Edit</button>
                  <button type="button" className="danger-button" onClick={async () => { if (!token) return; await deleteCompany(token, company.id); setCompanies(await fetchAdminCompanies(token)); }}>Delete</button>
                </div>
              </article>
            ))}
          </div>
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
            <select value={memoForm.companyId} onChange={(event) => setMemoForm({ ...memoForm, companyId: event.target.value })} required>
              <option value="">Select company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>{company.name} ({company.ticker})</option>
              ))}
            </select>
            <input placeholder="Title" value={memoForm.title} onChange={(event) => setMemoForm({ ...memoForm, title: event.target.value })} required />
            <input placeholder="Slug" value={memoForm.slug} onChange={(event) => setMemoForm({ ...memoForm, slug: event.target.value })} required />
            <select value={memoForm.recommendation} onChange={(event) => setMemoForm({ ...memoForm, recommendation: event.target.value })}>
              <option value="buy">Buy</option>
              <option value="overweight">Overweight</option>
              <option value="hold">Hold</option>
              <option value="underweight">Underweight</option>
              <option value="sell">Sell</option>
            </select>
            <div className="inline-grid">
              <input type="number" step="0.01" placeholder="Target Price" value={memoForm.targetPrice} onChange={(event) => setMemoForm({ ...memoForm, targetPrice: Number(event.target.value) })} />
              <input type="number" step="0.01" placeholder="Current Price" value={memoForm.currentPrice} onChange={(event) => setMemoForm({ ...memoForm, currentPrice: Number(event.target.value) })} />
            </div>
            <div className="inline-grid">
              <input type="number" step="0.01" placeholder="Expected Return" value={memoForm.expectedReturn} onChange={(event) => setMemoForm({ ...memoForm, expectedReturn: Number(event.target.value) })} />
              <input type="number" min={1} max={10} placeholder="Conviction" value={memoForm.convictionLevel} onChange={(event) => setMemoForm({ ...memoForm, convictionLevel: Number(event.target.value) })} />
            </div>
            <input placeholder="Investment Horizon" value={memoForm.investmentHorizon} onChange={(event) => setMemoForm({ ...memoForm, investmentHorizon: event.target.value })} />
            <textarea placeholder="Executive Summary" value={memoForm.executiveSummary} onChange={(event) => setMemoForm({ ...memoForm, executiveSummary: event.target.value })} rows={5} />
            <textarea placeholder="Thesis" value={memoForm.thesis} onChange={(event) => setMemoForm({ ...memoForm, thesis: event.target.value })} rows={6} />
            <select value={memoForm.status} onChange={(event) => setMemoForm({ ...memoForm, status: event.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <input placeholder="Published At (ISO optional)" value={memoForm.publishedAt ?? ""} onChange={(event) => setMemoForm({ ...memoForm, publishedAt: event.target.value })} />
            <button type="submit">Save Memo</button>
          </form>

          <div className="admin-list">
            {memos.map((memo) => (
              <article key={memo.id} className="admin-list-item">
                <div>
                  <strong>{memo.title}</strong>
                  <span>{memo.company.name} · {memo.recommendation} · {memo.status}</span>
                </div>
                <div className="inline-actions">
                  <button type="button" className="ghost-button" onClick={() => { setMemoMode("edit"); setMemoForm({
                    companyId: memo.companyId,
                    authorId: memo.authorId,
                    title: memo.title,
                    slug: memo.slug,
                    recommendation: memo.recommendation,
                    targetPrice: Number(memo.targetPrice),
                    currentPrice: Number(memo.currentPrice),
                    expectedReturn: Number(memo.expectedReturn),
                    investmentHorizon: memo.investmentHorizon,
                    convictionLevel: memo.convictionLevel,
                    executiveSummary: memo.executiveSummary,
                    thesis: memo.thesis,
                    status: memo.status,
                    publishedAt: memo.publishedAt
                  }); setEditingMemoId(memo.id); }}>Edit</button>
                  <button type="button" className="danger-button" onClick={async () => { if (!token) return; await deleteMemo(token, memo.id); setMemos(await fetchAdminMemos(token)); }}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="admin-content-grid">
        <IndustryReportsAdminPanel />
        <MarketOutlooksAdminPanel />
        <ResearchJournalAdminPanel />
      </section>

      <section>
        <ContactMessagesAdminPanel />
      </section>

    </div>
  );
}
