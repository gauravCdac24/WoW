import { useEffect, useState } from "react";
import { ApiError, api } from "../api";
import type { ZonesFC } from "../api";
import { AppShell } from "../components/AppShell";

export function AdminZones() {
  const [zones, setZones] = useState<ZonesFC["features"]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<ZonesFC>("/api/v1/zones")
      .then((r) => {
        if (!cancelled) setZones(r.features);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof ApiError ? e.message : "Failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell title="Pilot zones" subtitle="10 NCR micro-zones currently live">
      {error && <div className="err">{error}</div>}
      <div className="rows">
        {zones.map((f) => {
          const [lng, lat] = f.geometry.coordinates;
          return (
            <article key={f.properties.zone_id} className="row">
              <div className="row-top">
                <div className="row-title">{f.properties.zone_id}</div>
                <span className="pill">{f.properties.hub}</span>
              </div>
              <div className="muted small">{f.properties.label}</div>
              <div className="muted small">
                ~{lat.toFixed(4)}, {lng.toFixed(4)} · r≈{f.properties.radius_m}m
              </div>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
