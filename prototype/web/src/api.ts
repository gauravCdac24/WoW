const TOKEN_KEY = "kaamchor.token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export type Role = "finder" | "lister" | "admin";

export interface PublicUser {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: Role;
  createdAt: string;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init?.headers as Record<string, string> | undefined) || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, { ...init, headers });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
    throw new ApiError(body.message || res.statusText, res.status, body.error);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}

export interface ZoneRef {
  zone_id: string;
  hub: string;
  label: string;
}

export type JobCategory =
  | "plumbing"
  | "electrical"
  | "cleaning"
  | "carpentry"
  | "appliance_repair"
  | "pest_control"
  | "painting"
  | "other";
export type JobUrgency = "standard" | "urgent" | "scheduled";
export type JobExperience = "any" | "beginner" | "experienced" | "expert";
export type PaymentMode = "cash" | "upi" | "platform";

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  plumbing: "Plumbing",
  electrical: "Electrical",
  cleaning: "Cleaning",
  carpentry: "Carpentry",
  appliance_repair: "Appliance repair",
  pest_control: "Pest control",
  painting: "Painting",
  other: "Other",
};

export const URGENCY_LABELS: Record<JobUrgency, string> = {
  standard: "Standard (within 2 days)",
  urgent: "Urgent (ASAP)",
  scheduled: "Scheduled (pick date)",
};

export const EXPERIENCE_LABELS: Record<JobExperience, string> = {
  any: "Any level",
  beginner: "Beginner-friendly",
  experienced: "Experienced",
  expert: "Expert only",
};

export const PAYMENT_LABELS: Record<PaymentMode, string> = {
  cash: "Cash on completion",
  upi: "UPI on completion",
  platform: "Held by platform (released on completion)",
};

export interface JobDTO {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  skills: string[];
  zoneId: string;
  zone: ZoneRef | null;
  address: string;
  urgency: JobUrgency;
  scheduledAt: string | null;
  durationMins: number;
  priceInr: number;
  paymentMode: PaymentMode;
  experience: JobExperience;
  toolsProvided: boolean;
  contactPhone: string | null;
  status: "open" | "accepted" | "completed" | "cancelled";
  posterId: string;
  posterName: string;
  acceptedBy?: string;
  createdAt: string;
}

export interface AdminStats {
  appDownloads: number;
  usersByRole: { finder: number; lister: number; admin: number };
  totalJobs: number;
  jobsByStatus: { open: number; accepted: number; completed: number; cancelled: number };
  totals: { accepts: number; rejects: number };
  timeSeries: Array<{
    date: string;
    signups: number;
    jobs: number;
    accepts: number;
    rejects: number;
  }>;
  jobsPerZone: Array<{ zoneId: string; hub: string; label: string; count: number }>;
}

export interface ZonesFC {
  features: Array<{
    properties: { zone_id: string; hub: string; label: string; radius_m: number };
    geometry: { coordinates: [number, number] };
  }>;
}

export interface ServiceSku {
  id: string;
  name: string;
  basePriceInr: number;
  inspectionFeeInr: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  skus: ServiceSku[];
}

export interface ServiceCatalog {
  categories: ServiceCategory[];
}

export type BookingStatus = "requested" | "confirmed" | "cancelled";

export interface BookingDTO {
  id: string;
  zoneId: string;
  serviceId: string;
  slot: string;
  customerName: string;
  phone: string;
  addressLine: string;
  status: BookingStatus;
  quotedTotalInr: number;
  createdAt: string;
}
