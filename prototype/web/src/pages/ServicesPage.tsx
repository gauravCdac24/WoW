import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, api, type ServiceCatalog } from "../api";
import { AnimatedPage } from "../components/AnimatedPage";
import { SkeletonCard } from "../components/Skeleton";

export function ServicesPage() {
  const [catalog, setCatalog] = useState<ServiceCatalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api<ServiceCatalog>("/api/v1/services")
      .then((r) => {
        if (!cancelled) setCatalog(r);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof ApiError ? e.message : "Failed to load catalog");
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
        <h1>Home services</h1>
        <p className="muted">Plumbing, electrical &amp; cleaning — priced for Delhi NCR pilot zones.</p>
      </header>

      {error && <div className="err">{error}</div>}

      {loading && (
        <div className="service-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {catalog &&
        catalog.categories.map((cat, ci) => (
          <section
            key={cat.id}
            className="catalog-section stagger-item"
            style={{ animationDelay: `${ci * 60}ms` }}
          >
            <h2 className="catalog-cat">{cat.name}</h2>
            <div className="service-grid">
              {cat.skus.map((sku) => {
                const total = sku.basePriceInr + sku.inspectionFeeInr;
                return (
                  <article key={sku.id} className="service-card hover-lift">
                    <div className="service-card-top">
                      <h3>{sku.name}</h3>
                      <div className="service-price">₹{total}</div>
                    </div>
                    <p className="service-price-breakdown muted small">
                      ₹{sku.basePriceInr} service
                      {sku.inspectionFeeInr > 0 ? ` + ₹${sku.inspectionFeeInr} visit fee` : ""}
                    </p>
                    <Link to={`/book?service=${sku.id}`} className="btn btn-primary btn-sm">
                      Book now
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
    </AnimatedPage>
  );
}
