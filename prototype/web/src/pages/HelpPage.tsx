import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatedPage } from "../components/AnimatedPage";

const FAQ = [
  {
    q: "What is KaamChor?",
    a: "A mobile-first marketplace for Delhi NCR: job listers post gigs, workers swipe to accept, and ops track KPIs. Customers can also book home services from our catalog.",
  },
  {
    q: "How do I book plumbing or cleaning?",
    a: "Open Services, pick a SKU, then complete the Book flow — choose your micro-zone, slot, and address. Bookings are mock (no UPI) for the prototype.",
  },
  {
    q: "What are micro-zones?",
    a: "Ten pilot zones (NCR-G01 … NCR-N03) with hub labels and approximate centroids. Real polygons and geofencing come after the pilot.",
  },
  {
    q: "Demo accounts?",
    a: "finder@demo.com, lister@demo.com, admin@demo.com — password demo1234. Admins cannot self-register.",
  },
];

export function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <AnimatedPage className="public-page">
      <header className="public-page-header">
        <h1>Help &amp; FAQ</h1>
        <p className="muted">How the Delhi NCR prototype works.</p>
      </header>

      <div className="faq-list">
        {FAQ.map((item, i) => {
          const expanded = open === i;
          return (
            <div key={item.q} className={`faq-item ${expanded ? "open" : ""}`}>
              <button
                type="button"
                className="faq-q"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
              >
                {item.q}
                <span className="faq-chevron" aria-hidden>
                  {expanded ? "−" : "+"}
                </span>
              </button>
              {expanded && <p className="faq-a fade-in">{item.a}</p>}
            </div>
          );
        })}
      </div>

      <section className="help-links section">
        <h2 className="section-title">Quick links</h2>
        <div className="help-link-grid">
          <Link to="/services" className="help-link-card hover-lift">
            <span>🧰</span>
            <strong>Services catalog</strong>
          </Link>
          <Link to="/book" className="help-link-card hover-lift">
            <span>📅</span>
            <strong>Book a visit</strong>
          </Link>
          <Link to="/login" className="help-link-card hover-lift">
            <span>🔐</span>
            <strong>Worker / lister login</strong>
          </Link>
        </div>
      </section>
    </AnimatedPage>
  );
}
