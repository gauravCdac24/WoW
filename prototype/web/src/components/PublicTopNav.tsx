import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/services", label: "Services" },
  { to: "/book", label: "Book" },
  { to: "/bookings", label: "Bookings" },
  { to: "/help", label: "Help" },
];

export function PublicTopNav() {
  return (
    <nav className="public-top-nav" aria-label="Explore">
      <NavLink to="/" className="public-nav-brand" end>
        <span className="auth-logo">K</span>
        <span className="brand">KaamChor</span>
      </NavLink>
      <div className="public-nav-links">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `public-nav-link ${isActive ? "active" : ""}`}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
