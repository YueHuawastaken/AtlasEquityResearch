import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer.js";
import { Navbar } from "../components/Navbar.js";

export function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
