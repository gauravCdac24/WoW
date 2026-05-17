import { useEffect, useState } from "react";
import { ApiError, JOB_CATEGORY_LABELS, api } from "../api";
import type { JobDTO } from "../api";
import { AppShell } from "../components/AppShell";
import { formatPayment, formatScheduled, formatUrgency } from "../lib/format";

export function FinderAccepted() {
  const [items, setItems] = useState<JobDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<{ items: JobDTO[] }>("/api/v1/jobs/accepted")
      .then((r) => {
        if (!cancelled) setItems(r.items);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof ApiError ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell
      title="My accepted jobs"
      subtitle={`${items.length} gig${items.length === 1 ? "" : "s"} queued up`}
    >
      {loading && <div className="muted">Loading…</div>}
      {error && <div className="err">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <div className="empty-state">
          <div className="empty-emoji">💼</div>
          <div className="empty-title">No accepted jobs yet</div>
          <div className="empty-sub">Go swipe some from the Discover tab.</div>
        </div>
      )}
      <div className="rows">
        {items.map((j) => (
          <article key={j.id} className="row">
            <div className="row-top">
              <div>
                <div className="row-price">₹{j.priceInr}</div>
                <div className="row-title">{j.title}</div>
              </div>
              <span className={`pill status-${j.status}`}>{j.status}</span>
            </div>
            <div className="row-meta">
              <span className="dot-sep">{JOB_CATEGORY_LABELS[j.category]}</span>
              <span className="dot-sep">{j.zone?.hub || j.zoneId}</span>
              <span className={`dot-sep urgency-${j.urgency}`}>{formatUrgency(j.urgency)}</span>
              <span className="dot-sep">{j.durationMins} min</span>
              <span className="dot-sep">{formatPayment(j.paymentMode)}</span>
            </div>
            {j.scheduledAt && <div className="row-note">📅 {formatScheduled(j.scheduledAt)}</div>}
            {j.address && <div className="row-note">📍 {j.address}</div>}
            <div className="row-meta muted small">
              Posted by {j.posterName}
              {j.contactPhone ? ` · ${j.contactPhone}` : ""}
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
