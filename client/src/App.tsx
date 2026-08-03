import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout.js";
import { HomePage } from "./pages/HomePage.js";
import { CompaniesPage } from "./pages/CompaniesPage.js";
import { CompanyDetailPage } from "./pages/CompanyDetailPage.js";
import { AdminDashboardPage } from "./pages/AdminDashboardPage.js";
import { AdminLoginPage } from "./pages/AdminLoginPage.js";
import { IndustryReportsPage } from "./pages/IndustryReportsPage.js";
import { IndustryReportDetailPage } from "./pages/IndustryReportDetailPage.js";
import { MarketOutlooksPage } from "./pages/MarketOutlooksPage.js";
import { MarketOutlookDetailPage } from "./pages/MarketOutlookDetailPage.js";
import { MemosPage } from "./pages/MemosPage.js";
import { MemoDetailPage } from "./pages/MemoDetailPage.js";
import { ResearchJournalPage } from "./pages/ResearchJournalPage.js";
import { ResearchJournalDetailPage } from "./pages/ResearchJournalDetailPage.js";
import { SearchPage } from "./pages/SearchPage.js";
import { WatchlistPage } from "./pages/WatchlistPage.js";
import { AboutPage } from "./pages/AboutPage.js";
import { ContactPage } from "./pages/ContactPage.js";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/coverage" element={<CompaniesPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:companyId" element={<CompanyDetailPage />} />
        <Route path="/industry-research" element={<IndustryReportsPage />} />
        <Route path="/industry-research/:reportId" element={<IndustryReportDetailPage />} />
        <Route path="/market-outlooks" element={<MarketOutlooksPage />} />
        <Route path="/market-outlooks/:outlookId" element={<MarketOutlookDetailPage />} />
        <Route path="/research" element={<MemosPage />} />
        <Route path="/research/:memoId" element={<MemoDetailPage />} />
        <Route path="/journal" element={<ResearchJournalPage />} />
        <Route path="/journal/:journalId" element={<ResearchJournalDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
