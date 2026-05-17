import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ApiError, api, type BookingDTO, type ServiceCatalog } from "../api";
import { AnimatedPage } from "../components/AnimatedPage";
import { SkeletonCard } from "../components/Skeleton";

function skuName(catalog: ServiceCatalog | null, serviceId: string) {
  if (!catalog) return serviceId;
  for (const cat of catalog.categories) {
    const sku = cat.skus.find((s) => s.id === serviceId);
    if (sku) return sku.name;
  }
  return serviceId;
}

type Flash = { flash?: string } | null;

export function BookingsPage() {
  const location = useLocation();
  const flash = (location.state as Flash)?.flash;

  const [items, setItems] = useState<BookingDTO[]>([]);
  const [catalog, setCatalog] = useState<ServiceCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (flash) window.history.replaceState({}, "");
  }, [flash]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api<{ items: BookingDTO[] }>("/api/v1/bookings"),
      api<ServiceCatalog>("/api/v1/services"),
    ])
      .then(([bookings, svc]) => {
        if (!cancelled) {
          setItems(bookings.items);
          setCatalog(svc);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof ApiError ? e.message : "Failed to load bookings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AnimatedPage className="public-page">
      <header className="public-page-header">
        <h1>Your bookings</h1>
        <p className="muted">Mock home-service visits ? stored in memory until API restart.</p>
      </header>

      {flash && <div className="ok">{flash}</div>}
      {error && <div className="err">{error}</div>}

      <div className="public-page-actions">
        <Link to="/book" className="btn btn-primary">
          New booking
        </Link>
      </div>

      {loading && (
        <div className="rows">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="empty-state">
          <div className="empty-emoji">??</div>
          <div className="empty-title">No bookings yet</div>
          <div className="empty-sub">Book plumbing, electrical, or cleaning from our catalog.</div>
          <Link to="/services" className="btn btn-primary">
            Browse services
          </Link>
        </div>
      )}

      <div className="rows">
        {items.map((b, i) => (
          <article
            key={b.id}
            className="row stagger-item hover-lift"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="row-top">
              <div>
                <div className="row-price">?{b.quotedTotalInr}</div>
                <div className="row-title">{skuName(catalog, b.serviceId)}</div>
              </div>
              <span className={`pill status-${b.status === "confirmed" ? "accepted" : "open"}`}>
                {b.status}
              </span>
            </div>
            <div className="row-meta">
              <span className="dot-sep">{b.zoneId}</span>
              <span className="dot-sep">{new Date(b.slot).toLocaleString("en-IN")}</span>
            </div>
            <p className="row-desc">{b.addressLine}</p>
            <p className="muted small">
              {b.customerName} ? {b.phone}
            </p>
          </article>
        ))}
      </div>
    </AnimatedPage>
  );
}
