# Planning handoff — KaamChor (Delhi NCR)

## Status

Strategic and operational planning for the **Delhi NCR B2C home-services pilot** is **complete** at the level of:

- Market sizing and competitor context: [01-market-baseline.md](01-market-baseline.md)
- Categories, SOP/SLA, pricing and cancellation: [02-service-playbook.md](02-service-playbook.md)
- Target enterprise architecture: [03-architecture-blueprint.md](03-architecture-blueprint.md)
- Compliance NFRs: [04-compliance-by-design.md](04-compliance-by-design.md)
- Pilot scorecard and gates: [05-pilot-readiness.md](05-pilot-readiness.md)
- NCR micro-zones (named + coordinates + map assets): §8 in [01-market-baseline.md](01-market-baseline.md) and [assets/](assets/)

## Frozen for prototype (v0)

| Item | Decision |
|------|----------|
| Pilot region | Delhi & NCR |
| Launch categories | Plumbing, electrical, cleaning |
| Zone model | 10 micro-zones (`NCR-G01` … `NCR-N03`) with approximate centroids until real polygons exist |
| Worker app | Out of scope for first prototype |
| Payments | Mock only (no PG) |
| Auth | None (demo) or single demo token later |

## What “prototype” proves

- End-to-end **catalog → zone → booking** flow on a **customer web** surface.
- **REST API** shape aligned with future `BookingService` / `CatalogService`.
- **GeoJSON** zones loaded by the app (same file as planning).

## Next after prototype

1. Real **polygons** per zone + geofencing in dispatch.
2. **Worker** app + assignment loop + notifications.
3. **Auth** (OTP), **payments** (UPI), **DPDP** flows per [04-compliance-by-design.md](04-compliance-by-design.md).
4. **Observability** and event bus per [03-architecture-blueprint.md](03-architecture-blueprint.md).

## Development entry point

See [prototype/README.md](prototype/README.md) for install and run.
