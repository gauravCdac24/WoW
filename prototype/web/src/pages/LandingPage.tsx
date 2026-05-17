import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="landing page-enter">
      <div className="landing-card">
        <div className="landing-brand">
          <div className="auth-logo">K</div>
          <div>
            <div className="brand landing-brand-name">KaamChor</div>
            <div className="landing-tagline">Workers on wheels.</div>
          </div>
        </div>

        <h1 className="landing-heading">
          Find the right hand,
          <br />
          the right job, <span className="landing-accent">right now.</span>
        </h1>
        <p className="landing-sub">
          A mobile-first marketplace for Delhi NCR. List a job in a minute, or swipe your way to the
          next gig.
        </p>

        <div className="landing-cta">
          <Link to="/login" className="btn btn-primary">
            Sign in
          </Link>
          <Link to="/register" className="btn btn-ghost">
            Register now
          </Link>
        </div>

        <Link to="/services" className="btn btn-services landing-services-cta">
          Book home services →
        </Link>

        <div className="landing-values stagger-children">
          <div className="value">
            <div className="value-emoji">📣</div>
            <div className="value-title">Post jobs</div>
            <div className="value-sub">Reach workers in your micro-zone instantly.</div>
          </div>
          <div className="value">
            <div className="value-emoji">🧰</div>
            <div className="value-title">Find gigs</div>
            <div className="value-sub">Swipe to accept jobs near you.</div>
          </div>
          <div className="value">
            <div className="value-emoji">📊</div>
            <div className="value-title">For ops</div>
            <div className="value-sub">Admin dashboard with live KPIs.</div>
          </div>
        </div>

        <div className="landing-footnote">
          Prototype · Delhi &amp; NCR pilot · 10 micro-zones active
        </div>
      </div>
    </div>
  );
}
