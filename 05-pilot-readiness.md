# Pilot Readiness - Scorecard, Go-Live Gates, and 90-Day Success Criteria

## 1) Pilot Charter
- **Region:** Delhi & NCR (operational zones across Delhi, Gurugram, Noida, Ghaziabad, Faridabad as defined in launch map)
- **Model:** B2C home services
- **Initial categories:** Plumbing, Electrical, Cleaning
- **Pilot duration:** 90 days from go-live
- **Initial footprint:** 8-12 dense micro-zones (often spread across 2-3 hubs to validate cross-NCR dispatch). Named starter zones and zone IDs: see **Appendix: NCR Launch Map** in `01-market-baseline.md`.

## 2) North-Star for Pilot
- Prove repeatable, reliable, and unit-economics-viable operations in **Delhi NCR** before expanding to other cities.

## 3) Pilot Scorecard (KPIs and Targets)

## 3.1 Demand metrics
| KPI | Day 30 Target | Day 60 Target | Day 90 Target |
|---|---:|---:|---:|
| Booking-to-completion conversion | >= 55% | >= 60% | >= 65% |
| Monthly transacting customers | >= 3,000 | >= 7,000 | >= 12,000 |
| Repeat rate (30-day) | >= 18% | >= 24% | >= 30% |
| CAC payback (months) | <= 8 | <= 7 | <= 6 |

## 3.2 Supply metrics
| KPI | Day 30 Target | Day 60 Target | Day 90 Target |
|---|---:|---:|---:|
| Worker acceptance rate | >= 70% | >= 78% | >= 82% |
| Active worker retention (monthly) | >= 75% | >= 80% | >= 85% |
| Average idle time reduction | baseline | -10% | -20% |

## 3.3 Reliability metrics
| KPI | Day 30 Target | Day 60 Target | Day 90 Target |
|---|---:|---:|---:|
| On-time arrival | >= 75% | >= 82% | >= 88% |
| Job completion rate | >= 85% | >= 90% | >= 93% |
| Rework rate | <= 10% | <= 8% | <= 6% |
| Complaint rate per 100 jobs | <= 6 | <= 4.5 | <= 3.5 |

## 3.4 Economics and risk metrics
| KPI | Day 30 Target | Day 60 Target | Day 90 Target |
|---|---:|---:|---:|
| Contribution margin per completed order | Near break-even | Positive in 1 category | Positive in 2+ categories |
| Refund/credits as % GMV | <= 8% | <= 6% | <= 5% |
| High-severity incident closure SLA | >= 90% on time | >= 93% | >= 95% |
| Data rights SLA adherence | >= 95% | >= 97% | >= 98% |

## 4) Go-Live Gates (must-pass)

## 4.1 Product and platform gates
- Customer app, worker app, and ops console production-ready.
- Booking lifecycle state machine tested (happy + failure paths).
- Payment capture/refund flows tested end-to-end with reconciliation.
- Monitoring and alerting dashboards live.

## 4.2 Operations gates
- Minimum active worker density per micro-zone achieved.
- Category SOP training completion >= 95% for active workers.
- Dispatch playbooks validated during dry-runs.
- Support team staffed with defined shift coverage.

## 4.3 Compliance and trust gates
- KYC verification gating active.
- Consent and privacy notice implementation live.
- Grievance and safety escalation runbook tested.
- Audit logs for critical actions validated in staging and production.

## 4.4 Commercial gates
- Pricing and cancellation/refund policy approved.
- Offer/discount budget guardrails configured.
- Category-level unit economics dashboard reviewed and signed off.

No pilot launch unless all gate owners provide explicit sign-off.

## 5) 90-Day Operating Cadence

## 5.1 Daily rhythm
- Morning command center (demand/supply/SLA exceptions).
- Mid-day incident review.
- End-of-day KPI summary and corrective action tracker.

## 5.2 Weekly rhythm
- Micro-zone performance review.
- Category quality and rework deep-dive.
- Growth funnel review (acquisition, conversion, retention).
- Compliance and grievance report review.

## 5.3 Monthly rhythm
- Month-end business review:
  - KPI progress against Day 30/60/90 goals,
  - cohort retention and repeat analysis,
  - category-level contribution margin trend,
  - risk register updates.

## 6) Experimentation Plan (first 90 days)
- **Experiment A:** Express slots in high-density zones only.
- **Experiment B:** Prepaid discount vs no-discount control for repeat lift.
- **Experiment C:** Worker quality bonus impact on rework rate.
- **Experiment D:** Smart quote nudges impact on conversion.

Experiment rules:
- Clear hypothesis, success metric, and guardrail.
- No overlapping major experiments in the same micro-zone without isolation.

## 7) Risk Register and Trigger Actions
- **Low supply acceptance:** Activate surge incentives and targeted worker onboarding.
- **High rework rate:** Pause problematic SKU, retrain, tighten QC.
- **Refund spike:** Trigger root-cause analysis war room.
- **SLA collapse in zone:** Temporarily close express promise in affected zone.
- **Safety incident spike:** Increase verification checks and supervisory interventions.

## 8) Pilot Exit Criteria (Scale Decision)

Proceed to **NCR-wide rollout or second-city expansion** only if by Day 90:
- 70%+ of core KPIs meet threshold,
- No unresolved critical compliance gaps,
- Contribution margin trend is improving and on path to sustainable positives,
- Customer repeat and NPS trajectory are stable/upward,
- Operational playbooks are repeatable across at least 8 micro-zones (including at least two distinct NCR hubs if multi-hub pilot).

If criteria are not met:
- Extend pilot by 30-45 days with narrowed category or zone scope and targeted fixes.
