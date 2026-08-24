import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
const links = [
    { to: "/research", label: "Research" },
    { to: "/industry-research", label: "Industry Research" },
    { to: "/market-outlooks", label: "Outlooks" },
    { to: "/valuation-models", label: "Valuation Models" },
    { to: "/companies", label: "Companies" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" }
];
export function Navbar() {
    return (_jsx("header", { className: "navbar", children: _jsxs("div", { className: "container navbar-inner", children: [_jsxs(NavLink, { to: "/", className: "brand", children: [_jsx("span", { className: "brand-mark", children: "A" }), _jsxs("span", { children: [_jsx("strong", { children: "Atlas Equity Research" }), _jsx("small", { children: "Independent Equity Research Platform" })] })] }), _jsx("nav", { className: "nav-links", "aria-label": "Primary", children: links.map((link) => (_jsx(NavLink, { to: link.to, className: ({ isActive }) => (isActive ? "nav-link active" : "nav-link"), children: link.label }, link.to))) })] }) }));
}
