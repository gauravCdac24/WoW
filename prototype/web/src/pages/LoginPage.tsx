import { type FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Role } from "../api";
import { ApiError } from "../api";
import { homeForRole, useAuth } from "../auth-context";

const DEMO_ACCOUNTS: Array<{ email: string; role: Role; label: string }> = [
  { email: "finder@demo.com", role: "finder", label: "Job finder (swipes jobs)" },
  { email: "lister@demo.com", role: "lister", label: "Job lister (posts jobs)" },
  { email: "admin@demo.com", role: "admin", label: "Admin (dashboard)" },
];

type FlashState = { flash?: string; email?: string } | null;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const flashState = (location.state as FlashState) || null;

  const [email, setEmail] = useState(flashState?.email || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(flashState?.flash || null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (flashState?.flash) {
      window.history.replaceState({}, "");
    }
  }, [flashState]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(homeForRole(user.role), { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign-in failed");
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail);
    setPassword("demo1234");
    setError(null);
    setFlash(null);
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">K</div>
          <div>
            <div className="brand">KaamChor</div>
            <div className="auth-tagline">Gig work, on wheels.</div>
          </div>
        </div>

        <h2 className="auth-heading">Welcome back</h2>
        <p className="auth-sub">Sign in to continue to KaamChor.</p>

        {flash && <div className="ok">{flash}</div>}

        <form onSubmit={onSubmit} className="auth-form">
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <div className="err">{error}</div>}

          <button className="primary" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="auth-switch">
          New to KaamChor?{" "}
          <Link to="/register" className="link">
            Register now
          </Link>
        </div>

        <div className="auth-demos">
          <div className="auth-demos-title">Try a demo account (password: demo1234)</div>
          <div className="auth-demo-grid">
            {DEMO_ACCOUNTS.map((d) => (
              <button
                type="button"
                key={d.email}
                className="demo-chip"
                onClick={() => fillDemo(d.email)}
              >
                <div className="demo-role">{d.role}</div>
                <div className="demo-email">{d.email}</div>
                <div className="demo-label">{d.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
