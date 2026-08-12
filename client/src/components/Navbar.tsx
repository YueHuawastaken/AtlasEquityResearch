import { NavLink } from "react-router-dom";

const links = [
  { to: "/research", label: "Research" },
  { to: "/industry-research", label: "Industry Research" },
  { to: "/market-outlooks", label: "Outlooks" },
  { to: "/valuation-models", label: "Valuation Models" },
  { to: "/companies", label: "Companies" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/admin", label: "Admin" }
];

export function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">A</span>
          <span>
            <strong>Atlas Equity Research</strong>
            <small>Independent Equity Research Platform</small>
          </span>
        </NavLink>

        <nav className="nav-links" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
