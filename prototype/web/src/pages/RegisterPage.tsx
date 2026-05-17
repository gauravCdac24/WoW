import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Role } from "../api";
import { ApiError } from "../api";
import { useAuth } from "../auth-context";

type Step = "pick" | "form";

interface RoleOption {
  role: Role;
  title: string;
  tagline: string;
  emoji: string;
  bullets: string[];
  accent: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: "lister",
    title: "For job listing",
    tagline: "I want to post jobs and hire workers",
    emoji: "📣",
    bullets: ["Post a job in under a minute", "Get matched with nearby workers", "Track every listing"],
    accent: "#3b82f6",
  },
  {
    role: "finder",
    title: "For job viewing",
    tagline: "I want to find and accept gigs near me",
    emoji: "🧰",
    bullets: ["Swipe through jobs in your area", "Accept the ones you like", "Keep all accepted jobs handy"],
    accent: "#22c55e",
  },
];

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("pick");
  const [role, setRole] = useState<Role>("lister");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function pickRole(r: Role) {
    setRole(r);
    setError(null);
    setStep("form");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      await register({ name, phone, email, password, role });
      navigate("/login", {
        replace: true,
        state: {
          flash:
            role === "lister"
              ? "Account created. Sign in to start posting jobs."
              : "Account created. Sign in to start finding jobs.",
          email,
        },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">K</div>
          <div>
            <div className="brand">KaamChor</div>
            <div className="auth-tagline">Create your account</div>
          </div>
        </div>

        {step === "pick" && (
          <>
            <h2 className="auth-heading">How will you use KaamChor?</h2>
            <p className="auth-sub">Pick one to continue. You can always sign up again later as the other.</p>
            <div className="role-cards">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.role}
                  type="button"
                  className="role-card"
                  style={{ borderColor: opt.accent }}
                  onClick={() => pickRole(opt.role)}
                >
                  <div className="role-card-emoji" style={{ background: opt.accent }}>
                    {opt.emoji}
                  </div>
                  <div className="role-card-title">{opt.title}</div>
                  <div className="role-card-sub">{opt.tagline}</div>
                  <ul className="role-card-bullets">
                    {opt.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <span className="role-card-cta" style={{ color: opt.accent }}>
                    Register now →
                  </span>
                </button>
              ))}
            </div>

            <div className="auth-switch">
              Already have an account?{" "}
              <Link to="/login" className="link">
                Sign in
              </Link>
            </div>
          </>
        )}

        {step === "form" && (
          <>
            <button type="button" className="back-link" onClick={() => setStep("pick")}>
              ← Change role
            </button>
            <h2 className="auth-heading">
              {role === "lister" ? "Register as a job lister" : "Register as a job viewer"}
            </h2>
            <p className="auth-sub">
              {role === "lister"
                ? "Tell us about yourself — you'll post your first job right after signing in."
                : "Tell us about yourself — you'll start swiping jobs right after signing in."}
            </p>

            <form className="auth-form" onSubmit={onSubmit}>
              <label>
                <span>Full name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  minLength={2}
                  required
                />
              </label>

              <label>
                <span>Contact number</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile"
                  autoComplete="tel"
                  required
                />
              </label>

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
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>

              <label>
                <span>Confirm password</span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </label>

              {error && <div className="err">{error}</div>}

              <button className="primary" type="submit" disabled={submitting}>
                {submitting ? "Creating account…" : "Create account"}
              </button>
            </form>

            <div className="auth-switch">
              Already have an account?{" "}
              <Link to="/login" className="link">
                Sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
