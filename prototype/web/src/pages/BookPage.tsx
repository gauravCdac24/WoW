import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ApiError,
  api,
  type BookingDTO,
  type ServiceCatalog,
  type ZonesFC,
} from "../api";
import { AnimatedPage } from "../components/AnimatedPage";
import { useAuth } from "../auth-context";

const STEPS = ["Service", "Zone", "Details", "Confirm"] as const;

function findSku(catalog: ServiceCatalog | null, serviceId: string) {
  if (!catalog || !serviceId) return null;
  for (const cat of catalog.categories) {
    const sku = cat.skus.find((s) => s.id === serviceId);
    if (sku) return { category: cat, sku };
  }
  return null;
}

export function BookPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(0);
  const [catalog, setCatalog] = useState<ServiceCatalog | null>(null);
  const [zones, setZones] = useState<ZonesFC["features"]>([]);
  const [serviceId, setServiceId] = useState(params.get("service") || "");
  const [zoneId, setZoneId] = useState("");
  const [slot, setSlot] = useState("");
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [addressLine, setAddressLine] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [svc, z] = await Promise.all([
        api<ServiceCatalog>("/api/v1/services"),
        api<ZonesFC>("/api/v1/zones"),
      ]);
      setCatalog(svc);
      setZones(z.features);
      setZoneId((prev) => prev || z.features[0]?.properties.zone_id || "");
      const pre = params.get("service");
      if (pre) setServiceId(pre);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load booking data");
    }
  }, [params]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (user?.name) setCustomerName(user.name);
    if (user?.phone) setPhone(user.phone);
  }, [user]);

  const selected = useMemo(() => findSku(catalog, serviceId), [catalog, serviceId]);
  const zone = zones.find((f) => f.properties.zone_id === zoneId);
  const quote =
    selected ? selected.sku.basePriceInr + selected.sku.inspectionFeeInr : 0;

  function next() {
    setError(null);
    if (step === 0 && !serviceId) {
      setError("Pick a service to continue");
      return;
    }
    if (step === 1 && !zoneId) {
      setError("Pick a micro-zone");
      return;
    }
    if (step === 2 && (!slot || !phone.trim() || !addressLine.trim() || !customerName.trim())) {
      setError("Fill in all booking details");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      next();
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const booking = await api<BookingDTO>("/api/v1/bookings", {
        method: "POST",
        body: JSON.stringify({
          zoneId,
          serviceId,
          slot: new Date(slot).toISOString(),
          customerName: customerName.trim(),
          phone: phone.trim(),
          addressLine: addressLine.trim(),
        }),
      });
      navigate("/bookings", {
        state: { flash: `Booking confirmed — ₹${booking.quotedTotalInr} (${booking.status})` },
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatedPage className="public-page">
      <header className="public-page-header">
        <h1>Book a visit</h1>
        <p className="muted">Catalog → zone → slot. Mock payment — no UPI yet.</p>
      </header>

      <div className="wizard-steps" role="tablist" aria-label="Booking steps">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`wizard-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
          >
            <span className="wizard-dot">{i < step ? "✓" : i + 1}</span>
            <span className="wizard-label">{label}</span>
          </div>
        ))}
      </div>

      {error && <div className="err">{error}</div>}

      <form className="wizard-form" onSubmit={onSubmit}>
        {step === 0 && (
          <section className="wizard-panel fade-in">
            <h2 className="section-title">Choose a service</h2>
            {!catalog ? (
              <p className="muted">Loading catalog…</p>
            ) : (
              <div className="service-pick-list">
                {catalog.categories.map((cat) =>
                  cat.skus.map((sku) => {
                    const total = sku.basePriceInr + sku.inspectionFeeInr;
                    const active = serviceId === sku.id;
                    return (
                      <button
                        key={sku.id}
                        type="button"
                        className={`service-pick ${active ? "active" : ""}`}
                        onClick={() => setServiceId(sku.id)}
                      >
                        <span>
                          <strong>{sku.name}</strong>
                          <span className="muted small"> · {cat.name}</span>
                        </span>
                        <span className="service-price">₹{total}</span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </section>
        )}

        {step === 1 && (
          <section className="wizard-panel fade-in">
            <h2 className="section-title">Your micro-zone</h2>
            <div className="zone-pick-grid">
              {zones.map((f) => {
                const active = zoneId === f.properties.zone_id;
                return (
                  <button
                    key={f.properties.zone_id}
                    type="button"
                    className={`zone-pick ${active ? "active" : ""}`}
                    onClick={() => setZoneId(f.properties.zone_id)}
                  >
                    <span className="zone-pick-id">{f.properties.zone_id}</span>
                    <span className="zone-pick-hub">{f.properties.hub}</span>
                    <span className="muted small">{f.properties.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="wizard-panel fade-in">
            <h2 className="section-title">When &amp; where</h2>
            <label className="field">
              <span>Preferred slot</span>
              <input
                type="datetime-local"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Your name</span>
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            </label>
            <label className="field">
              <span>Phone</span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </label>
            <label className="field">
              <span>Address / landmark</span>
              <textarea
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                rows={3}
                placeholder="Flat, tower, society, landmark"
                required
              />
            </label>
          </section>
        )}

        {step === 3 && selected && (
          <section className="wizard-panel fade-in">
            <h2 className="section-title">Review &amp; confirm</h2>
            <div className="confirm-card">
              <div className="confirm-row">
                <span className="muted">Service</span>
                <strong>{selected.sku.name}</strong>
              </div>
              <div className="confirm-row">
                <span className="muted">Zone</span>
                <strong>
                  {zone?.properties.zone_id} — {zone?.properties.label}
                </strong>
              </div>
              <div className="confirm-row">
                <span className="muted">Slot</span>
                <strong>{slot ? new Date(slot).toLocaleString("en-IN") : "—"}</strong>
              </div>
              <div className="confirm-row">
                <span className="muted">Address</span>
                <strong>{addressLine}</strong>
              </div>
              <div className="confirm-total">
                <span>Quoted total</span>
                <span className="service-price">₹{quote}</span>
              </div>
            </div>
          </section>
        )}

        <div className="wizard-actions">
          {step > 0 && (
            <button type="button" className="ghost" onClick={back}>
              Back
            </button>
          )}
          <button type="submit" className="primary" disabled={submitting}>
            {step < STEPS.length - 1
              ? "Continue"
              : submitting
                ? "Booking…"
                : "Confirm booking"}
          </button>
        </div>
      </form>

      <p className="center muted small" style={{ marginTop: 16 }}>
        <Link to="/services" className="link">
          Browse all services
        </Link>
      </p>
    </AnimatedPage>
  );
}
