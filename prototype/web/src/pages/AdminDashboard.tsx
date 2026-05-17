import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ApiError, api } from "../api";
import type { AdminStats } from "../api";
import { AppShell } from "../components/AppShell";

const ROLE_COLORS: Record<string, string> = {
  finder: "#10b981",
  lister: "#6366f1",
  admin: "#f97316",
};

const ACCEPT_COLOR = "#10b981";
const REJECT_COLOR = "#ef4444";

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<AdminStats>("/api/v1/admin/stats")
      .then((r) => {
        if (!cancelled) setStats(r);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof ApiError ? e.message : "Failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell
      title="Operations dashboard"
      subtitle="Live KPIs across the Delhi NCR pilot"
    >
      {error && <div className="err">{error}</div>}
      {!stats ? (
        <div className="muted">Loading…</div>
      ) : (
        <>
          <div className="kpis">
            <KPI label="Total accounts" value={stats.appDownloads} hint="app downloads" />
            <KPI label="Jobs posted" value={stats.totalJobs} hint="all time" />
            <KPI label="Accepts" value={stats.totals.accepts} hint="by workers" color={ACCEPT_COLOR} />
            <KPI label="Rejects" value={stats.totals.rejects} hint="by workers" color={REJECT_COLOR} />
          </div>

          <section className="chart-section">
            <div className="section-head">
              <h2 className="section-title">Activity — last 7 days</h2>
              <p className="section-sub">Signups, new jobs, and worker actions per day.</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={stats.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#8c87a6", fontSize: 11 }}
                  tickFormatter={(d) => d.slice(5)}
                />
                <YAxis tick={{ fill: "#8c87a6", fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="signups" stroke="#f97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="jobs" stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="accepts" stroke={ACCEPT_COLOR} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rejects" stroke={REJECT_COLOR} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="chart-section">
            <div className="section-head">
              <h2 className="section-title">Who's on the platform</h2>
              <p className="section-sub">Distribution of active accounts by role.</p>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={[
                    { name: "finder", value: stats.usersByRole.finder },
                    { name: "lister", value: stats.usersByRole.lister },
                    { name: "admin", value: stats.usersByRole.admin },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {["finder", "lister", "admin"].map((r) => (
                    <Cell key={r} fill={ROLE_COLORS[r]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </section>

          <section className="chart-section">
            <div className="section-head">
              <h2 className="section-title">Accept vs reject</h2>
              <p className="section-sub">Every swipe, aggregated.</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={[
                  { name: "Accepts", value: stats.totals.accepts, fill: ACCEPT_COLOR },
                  { name: "Rejects", value: stats.totals.rejects, fill: REJECT_COLOR },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: "#c7c3d8" }} />
                <YAxis tick={{ fill: "#8c87a6" }} allowDecimals={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {[ACCEPT_COLOR, REJECT_COLOR].map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section className="chart-section">
            <div className="section-head">
              <h2 className="section-title">Jobs per zone</h2>
              <p className="section-sub">Which micro-zones are hottest.</p>
            </div>
            <ResponsiveContainer
              width="100%"
              height={Math.max(220, stats.jobsPerZone.length * 36)}
            >
              <BarChart data={stats.jobsPerZone} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis type="number" tick={{ fill: "#8c87a6" }} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="zoneId"
                  tick={{ fill: "#c7c3d8", fontSize: 11 }}
                  width={80}
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill="#f97316" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section className="chart-section">
            <div className="section-head">
              <h2 className="section-title">Status breakdown</h2>
              <p className="section-sub">Where every job currently sits.</p>
            </div>
            <div className="status-row">
              <StatusTile label="Open" value={stats.jobsByStatus.open} color="#6366f1" />
              <StatusTile label="Accepted" value={stats.jobsByStatus.accepted} color={ACCEPT_COLOR} />
              <StatusTile label="Completed" value={stats.jobsByStatus.completed} color="#a855f7" />
              <StatusTile label="Cancelled" value={stats.jobsByStatus.cancelled} color={REJECT_COLOR} />
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}

const chartTooltipStyle = {
  background: "rgba(15,12,26,0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  color: "#f5f3ff",
};

function KPI({
  label,
  value,
  hint,
  color,
}: {
  label: string;
  value: number;
  hint?: string;
  color?: string;
}) {
  return (
    <div className="kpi">
      <div className="kpi-value" style={color ? { color } : undefined}>
        {value}
      </div>
      <div className="kpi-label">{label}</div>
      {hint && <div className="kpi-hint">{hint}</div>}
    </div>
  );
}

function StatusTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="status-tile" style={{ borderColor: color }}>
      <div className="status-value" style={{ color }}>
        {value}
      </div>
      <div className="status-label">{label}</div>
    </div>
  );
}
