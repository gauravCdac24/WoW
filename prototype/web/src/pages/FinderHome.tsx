import { useCallback, useEffect, useState } from "react";
import { ApiError, JOB_CATEGORY_LABELS, api } from "../api";
import type { JobDTO } from "../api";
import { AppShell } from "../components/AppShell";
import { Skeleton } from "../components/Skeleton";
import { formatExperience, formatPayment, formatScheduled, formatUrgency } from "../lib/format";

export function FinderHome() {
  const [deck, setDeck] = useState<JobDTO[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animating, setAnimating] = useState<null | "left" | "right">(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await api<{ items: JobDTO[] }>("/api/v1/jobs/deck");
      setDeck(r.items);
      setIndex(0);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const top = deck[index];

  async function swipe(action: "accept" | "reject") {
    if (!top || animating) return;
    setAnimating(action === "accept" ? "right" : "left");
    const current = top;
    try {
      await api(`/api/v1/jobs/${current.id}/swipe`, {
        method: "POST",
        body: JSON.stringify({ action }),
      });
      setToast(action === "accept" ? `Accepted "${current.title}"` : "Passed");
    } catch (e) {
      setToast(e instanceof ApiError ? e.message : "Swipe failed");
    } finally {
      window.setTimeout(() => {
        setAnimating(null);
        setIndex((i) => i + 1);
      }, 260);
      window.setTimeout(() => setToast(null), 1800);
    }
  }

  return (
    <AppShell
      title="Jobs near you"
      subtitle="Swipe right to accept, left to pass"
      action={
        <button className="ghost" onClick={load} disabled={loading}>
          Refresh
        </button>
      }
    >
      {error && <div className="err">{error}</div>}

      <div className="card-stack">
        {loading && (
          <div className="card-stack skeleton-deck">
            <Skeleton style={{ height: 420, borderRadius: 24, width: "100%" }} />
          </div>
        )}

        {!loading && !top && (
          <div className="empty-state">
            <div className="empty-emoji">🎉</div>
            <div className="empty-title">You're all caught up</div>
            <div className="empty-sub">No more open jobs in your deck right now. Come back soon.</div>
            <button className="primary" onClick={load}>
              Check again
            </button>
          </div>
        )}

        {!loading &&
          deck.slice(index, index + 3).map((j, i) => {
            const isTop = i === 0;
            const offset = i * 8;
            const scale = 1 - i * 0.03;
            const anim = isTop && animating ? `swipe-${animating}` : "";
            return (
              <article
                key={j.id}
                className={`job-card ${anim}`}
                style={{
                  transform: `translateY(${offset}px) scale(${scale})`,
                  zIndex: 10 - i,
                }}
              >
                <div className="job-head">
                  <div className="job-price">₹{j.priceInr}</div>
                  <div className={`urgency-badge urgency-${j.urgency}`}>
                    {formatUrgency(j.urgency)}
                  </div>
                </div>

                <div className="job-badges">
                  <span className="chip chip-solid">{JOB_CATEGORY_LABELS[j.category]}</span>
                  <span className="chip">{j.zone?.hub || "—"}</span>
                  <span className="chip">{j.zoneId}</span>
                </div>

                <h2 className="job-title">{j.title}</h2>
                <p className="job-desc">{j.description}</p>

                {j.scheduledAt && (
                  <div className="job-note">📅 {formatScheduled(j.scheduledAt)}</div>
                )}

                {j.skills.length > 0 && (
                  <div className="chips">
                    {j.skills.map((s) => (
                      <span key={s} className="chip chip-ghost">
                        #{s}
                      </span>
                    ))}
                  </div>
                )}

                <dl className="job-meta">
                  <div>
                    <dt>Duration</dt>
                    <dd>{j.durationMins} min</dd>
                  </div>
                  <div>
                    <dt>Experience</dt>
                    <dd>{formatExperience(j.experience)}</dd>
                  </div>
                  <div>
                    <dt>Tools</dt>
                    <dd>{j.toolsProvided ? "Provided" : "Bring own"}</dd>
                  </div>
                  <div>
                    <dt>Payment</dt>
                    <dd>{formatPayment(j.paymentMode)}</dd>
                  </div>
                  <div className="job-meta-wide">
                    <dt>Area</dt>
                    <dd>{j.zone?.label || j.zoneId}</dd>
                  </div>
                  <div className="job-meta-wide">
                    <dt>Posted by</dt>
                    <dd>{j.posterName}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
      </div>

      {top && (
        <div className="swipe-actions">
          <button className="swipe-btn reject" onClick={() => swipe("reject")} aria-label="Reject">
            ✕
          </button>
          <button className="swipe-btn accept" onClick={() => swipe("accept")} aria-label="Accept">
            ✓
          </button>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </AppShell>
  );
}
