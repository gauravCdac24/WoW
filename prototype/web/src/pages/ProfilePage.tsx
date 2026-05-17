import { Link } from "react-router-dom";
import { useAuth } from "../auth-context";
import { AppShell } from "../components/AppShell";

const ROLE_COPY: Record<string, string> = {
  finder: "Job finder — swipes nearby gigs",
  lister: "Job lister — posts jobs for workers",
  admin: "Admin — sees KPIs across the pilot",
};

export function ProfilePage() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <AppShell title="Your profile" subtitle={ROLE_COPY[user.role] || "Account details"}>
      <div className="profile">
        <div className="profile-avatar">{user.name.slice(0, 1).toUpperCase()}</div>
        <div className="profile-name">{user.name}</div>
        <div className={`pill role-${user.role}`}>{user.role}</div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Shortcuts</h2>
        </div>
        <div className="help-link-grid">
          <Link to="/services" className="help-link-card hover-lift">
            <span>🧰</span>
            <strong>Book a service</strong>
          </Link>
          <Link to="/help" className="help-link-card hover-lift">
            <span>❓</span>
            <strong>Help &amp; FAQ</strong>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Account</h2>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email</span>
          <span className="detail-value">{user.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Phone</span>
          <span className="detail-value">{user.phone || <em className="muted">not set</em>}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Member since</span>
          <span className="detail-value">
            {new Date(user.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </section>

      <button className="danger" onClick={logout}>
        Sign out
      </button>
    </AppShell>
  );
}
