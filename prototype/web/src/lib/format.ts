import type { JobUrgency, JobExperience, PaymentMode } from "../api";

export function formatUrgency(u: JobUrgency): string {
  switch (u) {
    case "urgent":
      return "Urgent";
    case "scheduled":
      return "Scheduled";
    default:
      return "Standard";
  }
}

export function formatExperience(e: JobExperience): string {
  switch (e) {
    case "any":
      return "Any level";
    case "beginner":
      return "Beginner OK";
    case "experienced":
      return "Experienced";
    case "expert":
      return "Expert";
  }
}

export function formatPayment(p: PaymentMode): string {
  switch (p) {
    case "cash":
      return "Cash";
    case "upi":
      return "UPI";
    case "platform":
      return "Platform";
  }
}

export function formatScheduled(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
