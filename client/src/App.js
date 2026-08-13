import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(Routes, { children: [_jsxs(Route, { element: _jsx(AppLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/companies", element: _jsx(CompaniesPage, {}) }), _jsx(Route, { path: "/companies/:companyId", element: _jsx(CompanyDetailPage, {}) }), _jsx(Route, { path: "/industry-research", element: _jsx(IndustryReportsPage, {}) }), _jsx(Route, { path: "/industry-research/:reportId", element: _jsx(IndustryReportDetailPage, {}) }), _jsx(Route, { path: "/market-outlooks", element: _jsx(MarketOutlooksPage, {}) }), _jsx(Route, { path: "/market-outlooks/:outlookId", element: _jsx(MarketOutlookDetailPage, {}) }), _jsx(Route, { path: "/research", element: _jsx(MemosPage, {}) }), _jsx(Route, { path: "/research/:memoId", element: _jsx(MemoDetailPage, {}) }), _jsx(Route, { path: "/valuation-models", element: _jsx(ValuationModelsPage, {}) }), _jsx(Route, { path: "/valuation-models/:valuationModelId", element: _jsx(ValuationModelDetailPage, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminDashboardPage, {}) }), _jsx(Route, { path: "/admin/storage", element: _jsx(AdminStoragePage, {}) }), _jsx(Route, { path: "/admin/login", element: _jsx(AdminLoginPage, {}) }), _jsx(Route, { path: "/about", element: _jsx(AboutPage, {}) }), _jsx(Route, { path: "/contact", element: _jsx(ContactPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }));
}
