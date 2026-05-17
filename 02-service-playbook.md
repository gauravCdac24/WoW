# Service Playbook - KaamChor (Delhi & NCR Pilot)

## 1) Launch Categories (Phase 1)

- **Category A: Plumbing (urgent + routine)**
- **Category B: Electrical (minor household repairs)**
- **Category C: Home Cleaning (bathroom/kitchen/full-home variants)**

Selection criteria:

- High frequency demand.
- Measurable job outcomes.
- Operationally trainable SOPs.
- Strong repeat and cross-sell potential.

## 2) Service Catalog (initial SKUs)

## 2.1 Plumbing

- Tap leak fix
- Flush tank issue fix
- Drain unclogging
- Pipe leakage repair (minor)
- Water inlet/outlet fitting replacement

## 2.2 Electrical

- Switch/socket replacement
- Fan/light installation and repair
- MCB/fuse basic replacement
- Doorbell/low-load fixture installation

## 2.3 Cleaning

- Bathroom deep clean
- Kitchen deep clean
- Sofa cleaning
- Full-home cleaning (BHK based)

## 3) Standard Operating Procedure (SOP) - Common Blueprint

## 3.1 Pre-job SOP

- Technician checks job notes, location, required tools/materials.
- Confirm ETA with customer 30-45 mins before arrival.
- Safety kit check (gloves, mask, shoe cover).
- Geo-checkin upon reaching site.

## 3.2 On-site SOP

- 3-step diagnosis: inspect, explain, quote.
- Capture before-photos for job record.
- Share estimated time and price with consent in app.
- Execute service as per checklist.
- Capture after-photos and customer signoff.

## 3.3 Post-job SOP

- Digital invoice + payment closure.
- Auto-trigger feedback/rating request.
- Mark material usage and issue tags.
- Trigger warranty window per SKU.

## 4) SLA Matrix


| Metric                            | Plumbing          | Electrical        | Cleaning                |
| --------------------------------- | ----------------- | ----------------- | ----------------------- |
| Booking confirmation              | <= 2 min          | <= 2 min          | <= 2 min                |
| Service acceptance                | <= 8 min          | <= 8 min          | <= 10 min               |
| Arrival SLA (standard)            | <= 120 min        | <= 120 min        | Same-day slot           |
| Arrival SLA (express micro-zones) | 30-60 min         | 30-60 min         | <= 120 min              |
| Job completion SLA                | 30-90 min typical | 30-90 min typical | 60-240 min by SKU       |
| First-time-fix target             | >= 85%            | >= 85%            | >= 92%                  |
| Rework window                     | 7 days            | 7 days            | 48 hours quality rework |


## 5) Pricing Framework (Delhi & NCR Pilot)

Principles:

- Transparent base inspection + task pricing.
- Material priced separately with digital bill upload.
- Controlled surge only for express windows.

## 5.1 Indicative price ladder

- **Plumbing/Electrical**
  - Visit/inspection fee: INR 99 (waived if job completed above threshold).
  - Micro-repair jobs: INR 149-399.
  - Medium jobs: INR 400-999.
  - Complex jobs: quote with approval.
- **Cleaning**
  - Bathroom: INR 499-899.
  - Kitchen: INR 699-1,299.
  - Sofa: INR 499-1,499 (size-based).
  - Full-home: INR 1,499-4,999 (BHK and scope-based).

## 5.2 Guardrails

- Dynamic pricing cap: max +20% from base for high-demand windows.
- Hard floor to avoid negative unit economics.
- Price revision requires category manager approval and audit trail.

## 6) Cancellation, Refund, and Compensation Policy

## 6.1 Customer cancellation

- Free cancellation up to 60 mins before slot.
- Within 60 mins of slot: nominal fee (INR 49-99) if professional already dispatched.
- No-show by customer after 15 mins grace: visit fee retained.

## 6.2 Professional cancellation/no-show

- Auto-reassign within 10 mins.
- If SLA breach due to partner no-show: waive visit fee and apply goodwill credit.

## 6.3 Refund matrix

- Full refund:
  - Wrong service delivery,
  - Duplicate charge,
  - Non-delivery.
- Partial refund:
  - SLA breach with delayed completion but usable output.
- Rework-first policy for quality complaints (within policy window), refund if rework fails.

## 6.4 Compensation policy

- Delayed beyond promised SLA by >60 mins (without consent): fixed credit.
- Repeat failure in same booking chain: higher credit + priority support.

## 7) Quality and Safety Controls

- Mandatory partner verification and skill assessment before activation.
- Category-specific certification tiers (L1/L2/L3).
- Random audit calls and photo evidence checks.
- Incident escalation runbook for property damage and safety concerns.
- Unsafe job refusal policy with manager override.

## 8) Workforce Playbook (pilot)

- Onboarding batch cadence: weekly.
- Training model:
  - Day 1: Product + customer communication.
  - Day 2: Technical SOP and quality checkpoints.
  - Day 3: Assisted field shadowing.
- Incentive structure:
  - Base payout + completion incentive + quality bonus.
  - Penalties for no-show, fake completion, repeated complaints.

## 9) Day-1 Tooling Requirements

- Worker app: routing, job checklist, evidence upload, in-app calling.
- Ops console: dispatch override, live map, SLA breach alerts.
- QA module: sampling and scorecards.
- Finance module: refunds, reversals, payout holds, reconciliation.

## 10) Launch Recommendation

- Start with the above 3 categories in 8-12 dense micro-zones.
- Keep express promise only in zones with supply density threshold met.
- Freeze policy for first 6 weeks; then iterate based on failure-mode data.