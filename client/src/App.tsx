import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout.js";
import { HomePage } from "./pages/HomePage.js";
import { CompaniesPage } from "./pages/CompaniesPage.js";
import { CompanyDetailPage } from "./pages/CompanyDetailPage.js";
import { AdminDashboardPage } from "./pages/AdminDashboardPage.js";
import { AdminLoginPage } from "./pages/AdminLoginPage.js";
import { AdminStoragePage } from "./pages/AdminStoragePage.js";
import { IndustryReportsPage } from "./pages/IndustryReportsPage.js";
import { IndustryReportDetailPage } from "./pages/IndustryReportDetailPage.js";
import { MarketOutlooksPage } from "./pages/MarketOutlooksPage.js";
import { MarketOutlookDetailPage } from "./pages/MarketOutlookDetailPage.js";
import { MemosPage } from "./pages/MemosPage.js";
import { MemoDetailPage } from "./pages/MemoDetailPage.js";
import { ValuationModelsPage } from "./pages/ValuationModelsPage.js";
import { ValuationModelDetailPage } from "./pages/ValuationModelDetailPage.js";
import { AboutPage } from "./pages/AboutPage.js";
import { ContactPage } from "./pages/ContactPage.js";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:companyId" element={<CompanyDetailPage />} />
        <Route path="/industry-research" element={<IndustryReportsPage />} />
        <Route path="/industry-research/:reportId" element={<IndustryReportDetailPage />} />
        <Route path="/market-outlooks" element={<MarketOutlooksPage />} />
        <Route path="/market-outlooks/:outlookId" element={<MarketOutlookDetailPage />} />
        <Route path="/research" element={<MemosPage />} />
        <Route path="/research/:memoId" element={<MemoDetailPage />} />
        <Route path="/valuation-models" element={<ValuationModelsPage />} />
        <Route path="/valuation-models/:valuationModelId" element={<ValuationModelDetailPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/storage" element={<AdminStoragePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
