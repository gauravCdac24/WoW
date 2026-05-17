import { NavLink } from "react-router-dom";
import type { Role } from "../api";

type Item = { to: string; label: string; icon: string };

const NAV: Record<Role, Item[]> = {
  finder: [
    { to: "/finder", label: "Discover", icon: "🔥" },
    { to: "/finder/accepted", label: "My jobs", icon: "✅" },
    { to: "/activity", label: "Activity", icon: "🔔" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ],
  lister: [
    { to: "/lister", label: "Post", icon: "➕" },
    { to: "/lister/jobs", label: "My posts", icon: "📋" },
    { to: "/activity", label: "Activity", icon: "🔔" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ],
  admin: [
    { to: "/admin", label: "Overview", icon: "📊" },
    { to: "/admin/zones", label: "Zones", icon: "🗺️" },
    { to: "/activity", label: "Activity", icon: "🔔" },
    { to: "/profile", label: "Profile", icon: "👤" },
  ],
};

export function BottomNav({ role }: { role: Role }) {
  const items = NAV[role];
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map((i) => (
        <NavLink
          key={i.to}
          to={i.to}
          end={i.to === "/finder" || i.to === "/lister" || i.to === "/admin"}
          className={({ isActive }) => `bn-item ${isActive ? "active" : ""}`}
        >
          <span className="bn-icon" aria-hidden>
            {i.icon}
          </span>
          <span className="bn-label">{i.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
