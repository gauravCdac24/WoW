# Compliance by Design - KaamChor (India)

## 1) Scope

This document defines non-functional compliance requirements for:

- DPDP-aligned privacy controls,
- KYC and trust verification,
- audit logging and evidence management,
- data retention and deletion lifecycle,
- grievance redressal and incident response.

It is written as implementation requirements for product, platform, security, and operations teams.

## 2) Regulatory Baseline (India-focused)

- Digital Personal Data Protection Act, 2023 (DPDP) obligations for consented, purpose-limited processing.
- IT Act and applicable CERT-In security incident reporting expectations.
- Payment and tax obligations through payment-gateway and GST-compliant invoicing stack.
- Category-dependent worker verification requirements (ID, address, background checks as policy).

Note: legal counsel must validate final compliance posture before production launch.

## 3) Privacy and DPDP Requirements

## 3.1 Data inventory and purpose mapping

- Maintain a living data inventory of all personal data fields:
  - what is collected,
  - legal basis/purpose,
  - retention period,
  - system of record,
  - processor/subprocessor list.
- No personal data field can be introduced without an approved purpose tag.

## 3.2 Notice and consent

- Show plain-language privacy notice at onboarding and at each new purpose introduction.
- Capture explicit consent records with timestamp, version, and channel.
- Support easy consent withdrawal with effect tracking.
- Maintain immutable consent logs for audit.

## 3.3 Data principal rights

- Implement workflows for:
  - access request,
  - correction request,
  - erasure request,
  - consent withdrawal.
- SLA target for rights requests:
  - acknowledge <= 24 hours,
  - closure <= 7 days (pilot), <= 3 days target at scale.
- Provide request status tracking in app/support portal.

## 3.4 Data minimization and privacy-by-default

- Collect only mandatory fields for booking, payment, safety, and legal obligations.
- Sensitive data access must be role-gated and time-bound.
- Disable broad exports by default; enforce purpose-justified access requests.

## 3.5 Security safeguards

- Encryption:
  - in-transit TLS1.2+,
  - at-rest using KMS-managed keys.
- Access control:
  - least privilege RBAC,
  - MFA for admin/support tools,
  - privileged access logging.
- Vulnerability management:
  - quarterly penetration tests,
  - monthly dependency scans,
  - critical patch SLA <= 7 days.

## 4) KYC and Worker Trust Requirements

## 4.1 KYC workflow

- Mandatory worker onboarding artifacts:
  - government ID,
  - address proof,
  - bank account verification,
  - profile photo and selfie match.
- KYC status gates:
  - `pending`: cannot accept jobs,
  - `verified`: active,
  - `expired/review`: restricted until re-verification.

## 4.2 Background verification

- Conduct background checks before activation (where legally permissible and policy-mandated).
- Re-screen at defined intervals (e.g., 12 months).
- High-risk flags trigger manual compliance review.

## 4.3 Fraud prevention controls

- Device fingerprinting and anomaly detection for worker/customer abuse.
- Velocity limits for suspicious booking/payment behavior.
- Blacklist and watchlist with explainable reason codes.

## 5) Audit Logging Standards

## 5.1 What must be logged

- Authentication and authorization events.
- Profile and KYC data changes.
- Booking lifecycle state transitions.
- Price overrides and manual dispatch interventions.
- Refund approvals and payment reversals.
- Admin/support access to PII.
- Grievance actions and closure decisions.

## 5.2 Log design requirements

- Structured logs with:
  - `actorId`, `actorRole`,
  - `entityType`, `entityId`,
  - `action`,
  - `timestamp`,
  - `sourceIp/device`,
  - `reasonCode` for sensitive actions.
- Tamper-evident storage for compliance logs.
- Access to audit logs limited to authorized compliance/security roles.

## 6) Data Retention and Deletion Policy

## 6.1 Retention classes

- **Operational data (bookings, dispatch):** 24 months (minimum).
- **Financial transaction records:** as per statutory requirement (tax/accounting).
- **KYC evidence:** policy and legal basis aligned retention, encrypted storage.
- **Support and grievance records:** minimum period for dispute/legal defensibility.
- **Telemetry logs:** short-term hot storage + long-term archive tiering.

## 6.2 Deletion and archival

- Enforce automated retention jobs with deletion proof logs.
- Soft-delete for user-facing recovery window, then hard-delete/anonymize.
- Ensure deleted data is removed from backups on schedule-based expiry.

## 6.3 Data localization and transfer governance

- Maintain inventory of data processors and regions.
- Cross-border transfer review process with legal signoff.
- Preference for India-first storage for compliance risk minimization.

## 7) Grievance Redressal Workflow

## 7.1 Intake channels

- In-app complaint form,
- hotline/support call,
- email and chatbot escalation.

## 7.2 Classification

- Severity levels:
  - `S1`: safety/assault/major loss,
  - `S2`: financial dispute, service failure,
  - `S3`: minor dissatisfaction.

## 7.3 SLA and escalation

- S1: immediate acknowledgement, human response <= 15 mins.
- S2: response <= 2 hours.
- S3: response <= 24 hours.
- Escalation chain: Support -> Ops Manager -> Compliance Lead -> Legal.

## 7.4 Resolution controls

- Root-cause tagging mandatory.
- Closure requires customer communication and evidence attachment.
- Repeat issue trigger for preventive action in category playbook.

## 8) Breach and Security Incident Response

- Define incident classes and response runbooks.
- Detection to containment target <= 60 mins for critical incidents.
- Breach notification workflow:
  - regulator/authority reporting as required,
  - affected-user communication templates,
  - forensic evidence preservation.
- Post-incident actions:
  - RCA within 5 business days,
  - control remediation tracking to closure.

## 9) Compliance Governance and Operating Model

- Appoint accountable owners:
  - Privacy owner,
  - Security owner,
  - Compliance operations owner,
  - Grievance officer role.
- Monthly compliance review forum:
  - unresolved high-severity tickets,
  - rights request SLA adherence,
  - audit exceptions,
  - vendor risk updates.
- Quarterly control testing and audit-readiness review.

## 10) Non-Functional Requirements Checklist (Go/No-Go)

- No production launch without:
  - consent capture and withdrawal implemented,
  - rights request workflow live,
  - KYC gating active,
  - immutable audit logs enabled,
  - retention jobs configured,
  - grievance SLA monitoring dashboard live,
  - incident response drill completed.