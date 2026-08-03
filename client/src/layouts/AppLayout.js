import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer.js";
import { Navbar } from "../components/Navbar.js";
export function AppLayout() {
    return (_jsxs("div", { className: "app-shell", children: [_jsx(Navbar, {}), _jsx("main", { className: "app-main", children: _jsx(Outlet, {}) }), _jsx(Footer, {})] }));
}
