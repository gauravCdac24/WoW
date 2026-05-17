import type { Response } from "express";
import type { AuthedRequest } from "./auth.js";
import { jobs, swipes, users } from "./stores.js";
import type { ZoneRef } from "./jobs.js";

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function last7Days(): string[] {
  const out: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function makeAdminHandlers(zones: Map<string, ZoneRef>) {
  function stats(_req: AuthedRequest, res: Response) {
    const usersByRole = {
      finder: users.filter((u) => u.role === "finder").length,
      lister: users.filter((u) => u.role === "lister").length,
      admin: users.filter((u) => u.role === "admin").length,
    };

    const totalJobs = jobs.length;
    const jobsByStatus = {
      open: jobs.filter((j) => j.status === "open").length,
      accepted: jobs.filter((j) => j.status === "accepted").length,
      completed: jobs.filter((j) => j.status === "completed").length,
      cancelled: jobs.filter((j) => j.status === "cancelled").length,
    };
    const totalAccepts = swipes.filter((s) => s.action === "accept").length;
    const totalRejects = swipes.filter((s) => s.action === "reject").length;

    const days = last7Days();
    const mkBucket = () => Object.fromEntries(days.map((d) => [d, 0])) as Record<string, number>;

    const signupsPerDay = mkBucket();
    users.forEach((u) => {
      const k = dayKey(u.createdAt);
      if (k in signupsPerDay) signupsPerDay[k] += 1;
    });

    const jobsPerDay = mkBucket();
    jobs.forEach((j) => {
      const k = dayKey(j.createdAt);
      if (k in jobsPerDay) jobsPerDay[k] += 1;
    });

    const acceptsPerDay = mkBucket();
    const rejectsPerDay = mkBucket();
    swipes.forEach((s) => {
      const k = dayKey(s.createdAt);
      if (s.action === "accept" && k in acceptsPerDay) acceptsPerDay[k] += 1;
      if (s.action === "reject" && k in rejectsPerDay) rejectsPerDay[k] += 1;
    });

    const timeSeries = days.map((d) => ({
      date: d,
      signups: signupsPerDay[d],
      jobs: jobsPerDay[d],
      accepts: acceptsPerDay[d],
      rejects: rejectsPerDay[d],
    }));

    const jobsPerZoneMap: Record<string, number> = {};
    jobs.forEach((j) => {
      jobsPerZoneMap[j.zoneId] = (jobsPerZoneMap[j.zoneId] || 0) + 1;
    });
    const jobsPerZone = Object.entries(jobsPerZoneMap)
      .map(([zoneId, count]) => ({
        zoneId,
        hub: zones.get(zoneId)?.hub || "Unknown",
        label: zones.get(zoneId)?.label || zoneId,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    res.json({
      appDownloads: users.length,
      usersByRole,
      totalJobs,
      jobsByStatus,
      totals: { accepts: totalAccepts, rejects: totalRejects },
      timeSeries,
      jobsPerZone,
    });
  }

  return { stats };
}
