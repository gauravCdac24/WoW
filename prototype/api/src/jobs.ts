import type { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import type { AuthedRequest } from "./auth.js";
import {
  type Job,
  type JobCategory,
  type JobExperience,
  type JobUrgency,
  type PaymentMode,
  type SwipeAction,
  JOB_CATEGORIES,
  JOB_EXPERIENCES,
  JOB_URGENCIES,
  PAYMENT_MODES,
  findUserById,
  jobs,
  swipes,
} from "./stores.js";

export interface ZoneRef {
  zone_id: string;
  label: string;
  hub: string;
}

export function jobView(job: Job, zones: Map<string, ZoneRef>) {
  const poster = findUserById(job.posterId);
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    category: job.category,
    skills: job.skills,
    zoneId: job.zoneId,
    zone: zones.get(job.zoneId) || null,
    address: job.address,
    urgency: job.urgency,
    scheduledAt: job.scheduledAt || null,
    durationMins: job.durationMins,
    priceInr: job.priceInr,
    paymentMode: job.paymentMode,
    experience: job.experience,
    toolsProvided: job.toolsProvided,
    contactPhone: job.contactPhone || poster?.phone || null,
    status: job.status,
    posterName: poster?.name || "Unknown",
    posterId: job.posterId,
    acceptedBy: job.acceptedBy,
    createdAt: job.createdAt,
  };
}

function parseJobBody(body: unknown, zones: Map<string, ZoneRef>) {
  const b = (body || {}) as Record<string, unknown>;
  const title = String(b.title || "").trim();
  const description = String(b.description || "").trim();
  const rawSkills = b.skills;
  const skills = Array.isArray(rawSkills)
    ? rawSkills.map((s) => String(s).trim()).filter(Boolean)
    : String(rawSkills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  const zoneId = String(b.zoneId || "").trim();
  const address = String(b.address || "").trim();
  const category = String(b.category || "other") as JobCategory;
  const urgency = String(b.urgency || "standard") as JobUrgency;
  const rawScheduledAt = String(b.scheduledAt || "").trim();
  const scheduledAt = rawScheduledAt ? new Date(rawScheduledAt).toISOString() : undefined;
  const durationMins = Number(b.durationMins);
  const priceInr = Number(b.priceInr);
  const paymentMode = String(b.paymentMode || "cash") as PaymentMode;
  const experience = String(b.experience || "any") as JobExperience;
  const toolsProvided = Boolean(b.toolsProvided);
  const contactPhone = String(b.contactPhone || "").trim() || undefined;

  const errors: string[] = [];
  if (title.length < 4) errors.push("title must be at least 4 characters");
  if (description.length < 10) errors.push("description must be at least 10 characters");
  if (!JOB_CATEGORIES.includes(category)) errors.push("invalid category");
  if (!zones.has(zoneId)) errors.push("valid zoneId required");
  if (address.length < 5) errors.push("address must be at least 5 characters");
  if (!JOB_URGENCIES.includes(urgency)) errors.push("invalid urgency");
  if (urgency === "scheduled" && !scheduledAt) {
    errors.push("scheduledAt is required when urgency is 'scheduled'");
  }
  if (scheduledAt && Number.isNaN(new Date(scheduledAt).getTime())) {
    errors.push("scheduledAt must be a valid date");
  }
  if (!Number.isFinite(durationMins) || durationMins < 15 || durationMins > 480) {
    errors.push("durationMins must be between 15 and 480");
  }
  if (!Number.isFinite(priceInr) || priceInr < 49 || priceInr > 100000) {
    errors.push("priceInr must be between 49 and 100000");
  }
  if (!PAYMENT_MODES.includes(paymentMode)) errors.push("invalid paymentMode");
  if (!JOB_EXPERIENCES.includes(experience)) errors.push("invalid experience");
  if (contactPhone) {
    const digits = contactPhone.replace(/[^0-9]/g, "");
    if (digits.length < 7 || digits.length > 15) errors.push("contactPhone looks invalid");
  }

  return {
    title,
    description,
    category,
    skills,
    zoneId,
    address,
    urgency,
    scheduledAt,
    durationMins,
    priceInr,
    paymentMode,
    experience,
    toolsProvided,
    contactPhone,
    errors,
  };
}

export function makeJobsHandlers(zones: Map<string, ZoneRef>) {
  function listForFinder(req: AuthedRequest, res: Response) {
    const finderId = req.user!.id;
    const swipedJobIds = new Set(
      swipes.filter((s) => s.finderId === finderId).map((s) => s.jobId)
    );
    const deck = jobs
      .filter((j) => j.status === "open" && !swipedJobIds.has(j.id))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((j) => jobView(j, zones));
    res.json({ items: deck });
  }

  function listAcceptedByFinder(req: AuthedRequest, res: Response) {
    const finderId = req.user!.id;
    const acceptedJobIds = new Set(
      swipes.filter((s) => s.finderId === finderId && s.action === "accept").map((s) => s.jobId)
    );
    const items = jobs
      .filter((j) => acceptedJobIds.has(j.id))
      .map((j) => jobView(j, zones));
    res.json({ items });
  }

  function listMine(req: AuthedRequest, res: Response) {
    const posterId = req.user!.id;
    const items = jobs
      .filter((j) => j.posterId === posterId)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map((j) => jobView(j, zones));
    res.json({ items });
  }

  function createJob(req: AuthedRequest, res: Response) {
    const parsed = parseJobBody(req.body, zones);
    if (parsed.errors.length) {
      res.status(400).json({ error: "validation_error", message: parsed.errors.join(", ") });
      return;
    }
    const job: Job = {
      id: uuidv4(),
      posterId: req.user!.id,
      title: parsed.title,
      description: parsed.description,
      category: parsed.category,
      skills: parsed.skills,
      zoneId: parsed.zoneId,
      address: parsed.address,
      urgency: parsed.urgency,
      scheduledAt: parsed.scheduledAt,
      durationMins: parsed.durationMins,
      priceInr: parsed.priceInr,
      paymentMode: parsed.paymentMode,
      experience: parsed.experience,
      toolsProvided: parsed.toolsProvided,
      contactPhone: parsed.contactPhone,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    jobs.push(job);
    res.status(201).json(jobView(job, zones));
  }

  function swipe(req: AuthedRequest, res: Response) {
    const jobId = String(req.params.id);
    const action = String(((req.body || {}) as { action?: unknown }).action || "") as SwipeAction;
    if (action !== "accept" && action !== "reject") {
      res.status(400).json({ error: "invalid_action", message: "action must be accept or reject" });
      return;
    }
    const job = jobs.find((j) => j.id === jobId);
    if (!job) {
      res.status(404).json({ error: "not_found", message: "Job not found" });
      return;
    }
    const finderId = req.user!.id;
    const already = swipes.find((s) => s.jobId === jobId && s.finderId === finderId);
    if (already) {
      res.status(409).json({ error: "already_swiped", message: "You already responded to this job" });
      return;
    }
    const record = {
      id: uuidv4(),
      jobId,
      finderId,
      action,
      createdAt: new Date().toISOString(),
    };
    swipes.push(record);
    if (action === "accept" && job.status === "open") {
      job.status = "accepted";
      job.acceptedBy = finderId;
    }
    res.status(201).json({ swipe: record, job: jobView(job, zones) });
  }

  return { listForFinder, listAcceptedByFinder, listMine, createJob, swipe };
}
