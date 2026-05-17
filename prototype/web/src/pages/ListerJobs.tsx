import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError, JOB_CATEGORY_LABELS, api } from "../api";
import type { JobDTO } from "../api";
import { AppShell } from "../components/AppShell";
import { formatScheduled, formatUrgency } from "../lib/format";

export function ListerJobs() {
  const [items, setItems] = useState<JobDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api<{ items: JobDTO[] }>("/api/v1/jobs/mine");
      setItems(r.items);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <AppShell
      title="My job posts"
      subtitle={`${items.length} post${items.length === 1 ? "" : "s"} · tap one to see details`}
      action={
        <Link to="/lister" className="ghost">
          + New
        </Link>
      }
    >
      {loading && <div className="muted">Loading…</div>}
      {error && <div className="err">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="empty-state">
          <div className="empty-emoji">📝</div>
          <div className="empty-title">No posts yet</div>
          <div className="empty-sub">Your first job is one tap away.</div>
          <Link to="/lister" className="primary-link">
            Post a job →
          </Link>
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
            </div>

            {j.scheduledAt && (
              <div className="row-note">📅 {formatScheduled(j.scheduledAt)}</div>
            )}

            <p className="row-desc">{j.description}</p>

            {j.skills.length > 0 && (
              <div className="chips">
                {j.skills.map((s) => (
                  <span key={s} className="chip">
                    #{s}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </AppShell>
  );
}
