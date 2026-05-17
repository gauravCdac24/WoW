import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export type Role = "finder" | "lister" | "admin";

export interface User {
  id: string;
  email: string;
  phone: string;
  passwordHash: string;
  name: string;
  role: Role;
  createdAt: string;
}

export type JobStatus = "open" | "accepted" | "completed" | "cancelled";
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

export const JOB_CATEGORIES: JobCategory[] = [
  "plumbing",
  "electrical",
  "cleaning",
  "carpentry",
  "appliance_repair",
  "pest_control",
  "painting",
  "other",
];
export const JOB_URGENCIES: JobUrgency[] = ["standard", "urgent", "scheduled"];
export const JOB_EXPERIENCES: JobExperience[] = ["any", "beginner", "experienced", "expert"];
export const PAYMENT_MODES: PaymentMode[] = ["cash", "upi", "platform"];

export interface Job {
  id: string;
  posterId: string;
  title: string;
  description: string;
  category: JobCategory;
  skills: string[];
  zoneId: string;
  address: string;
  urgency: JobUrgency;
  scheduledAt?: string;
  durationMins: number;
  priceInr: number;
  paymentMode: PaymentMode;
  experience: JobExperience;
  toolsProvided: boolean;
  contactPhone?: string;
  status: JobStatus;
  acceptedBy?: string;
  createdAt: string;
}

export type SwipeAction = "accept" | "reject";

export interface Swipe {
  id: string;
  jobId: string;
  finderId: string;
  action: SwipeAction;
  createdAt: string;
}

export const users: User[] = [];
export const jobs: Job[] = [];
export const swipes: Swipe[] = [];

export function findUserByEmail(email: string): User | undefined {
  const needle = email.trim().toLowerCase();
  return users.find((u) => u.email === needle);
}

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function publicUser(u: User) {
  return {
    id: u.id,
    email: u.email,
    phone: u.phone,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
  };
}

export function createUser(opts: {
  email: string;
  password: string;
  name: string;
  role: Role;
  phone?: string;
}): User {
  const email = opts.email.trim().toLowerCase();
  if (findUserByEmail(email)) {
    throw Object.assign(new Error("Email already registered"), { code: "email_exists" });
  }
  const passwordHash = bcrypt.hashSync(opts.password, 10);
  const user: User = {
    id: uuidv4(),
    email,
    phone: (opts.phone || "").trim(),
    passwordHash,
    name: opts.name.trim() || email.split("@")[0],
    role: opts.role,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export function seedDemoData() {
  if (users.length > 0) return;

  const admin = createUser({
    email: "admin@demo.com",
    password: "demo1234",
    name: "KaamChor Admin",
    role: "admin",
    phone: "+91 99990 00000",
  });
  const lister = createUser({
    email: "lister@demo.com",
    password: "demo1234",
    name: "Rohan (job lister)",
    role: "lister",
    phone: "+91 98100 11111",
  });
  const finder = createUser({
    email: "finder@demo.com",
    password: "demo1234",
    name: "Priya (job finder)",
    role: "finder",
    phone: "+91 98100 22222",
  });

  const extraListers = [
    { email: "anita@demo.com", name: "Anita Sharma", phone: "+91 98100 33333" },
    { email: "vikram@demo.com", name: "Vikram Rao", phone: "+91 98100 44444" },
  ].map((u) =>
    createUser({
      email: u.email,
      password: "demo1234",
      name: u.name,
      role: "lister",
      phone: u.phone,
    })
  );

  const extraFinders = [
    { email: "sunil@demo.com", name: "Sunil Kumar", phone: "+91 98100 55555" },
    { email: "meera@demo.com", name: "Meera Das", phone: "+91 98100 66666" },
    { email: "arjun@demo.com", name: "Arjun Verma", phone: "+91 98100 77777" },
  ].map((u) =>
    createUser({
      email: u.email,
      password: "demo1234",
      name: u.name,
      role: "finder",
      phone: u.phone,
    })
  );

  const futureIso = (daysAhead: number, hour = 10) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(hour, 0, 0, 0);
    return d.toISOString();
  };

  const seedJobs: Array<Omit<Job, "id" | "createdAt" | "status" | "acceptedBy">> = [
    {
      posterId: lister.id,
      title: "Fix leaking kitchen tap",
      description:
        "Kitchen tap has been dripping for 2 days. Need an experienced plumber with own tools to inspect washer and replace if needed.",
      category: "plumbing",
      skills: ["plumbing", "tap repair"],
      zoneId: "NCR-G01",
      address: "Tower B-402, Westend Heights, DLF Phase 5",
      urgency: "urgent",
      durationMins: 60,
      priceInr: 499,
      paymentMode: "upi",
      experience: "experienced",
      toolsProvided: false,
      contactPhone: "+91 98100 11111",
    },
    {
      posterId: lister.id,
      title: "Ceiling fan wobble + regulator",
      description:
        "Living room fan wobbles badly and the regulator buzzes. Replace regulator if needed; tools available on site.",
      category: "electrical",
      skills: ["electrical", "fan"],
      zoneId: "NCR-G02",
      address: "Flat 12, Golf View Apts, Sector 42",
      urgency: "standard",
      durationMins: 45,
      priceInr: 399,
      paymentMode: "cash",
      experience: "any",
      toolsProvided: true,
    },
    {
      posterId: extraListers[0].id,
      title: "Bathroom deep clean (2 BR flat)",
      description:
        "Two bathrooms, full deep clean including tiles and fittings. Visible fungal stains on grout.",
      category: "cleaning",
      skills: ["cleaning", "bathroom"],
      zoneId: "NCR-D01",
      address: "E-42, Greater Kailash I",
      urgency: "scheduled",
      scheduledAt: futureIso(2, 11),
      durationMins: 120,
      priceInr: 1299,
      paymentMode: "upi",
      experience: "experienced",
      toolsProvided: false,
    },
    {
      posterId: extraListers[0].id,
      title: "Install new chimney in kitchen",
      description:
        "New auto-clean chimney arriving tomorrow, need wall mount + power point check + gas pipe clearance.",
      category: "appliance_repair",
      skills: ["electrical", "installation"],
      zoneId: "NCR-D02",
      address: "S-18, Hauz Khas Enclave",
      urgency: "scheduled",
      scheduledAt: futureIso(1, 14),
      durationMins: 90,
      priceInr: 899,
      paymentMode: "platform",
      experience: "expert",
      toolsProvided: false,
    },
    {
      posterId: extraListers[1].id,
      title: "Drain unclog — washbasin",
      description: "Slow drain in master washbasin. Bring snake/plunger; access via balcony.",
      category: "plumbing",
      skills: ["plumbing"],
      zoneId: "NCR-N01",
      address: "A-704, Amrapali Princely Estate, Sector 76",
      urgency: "standard",
      durationMins: 30,
      priceInr: 349,
      paymentMode: "cash",
      experience: "beginner",
      toolsProvided: false,
    },
    {
      posterId: extraListers[1].id,
      title: "Sofa cleaning (L-shape, 5 seater)",
      description: "Fabric sofa, needs shampoo + vacuum; pet hair present.",
      category: "cleaning",
      skills: ["cleaning", "sofa"],
      zoneId: "NCR-N03",
      address: "Tower 7, Logix Blossom County, Sector 137",
      urgency: "standard",
      durationMins: 75,
      priceInr: 799,
      paymentMode: "upi",
      experience: "experienced",
      toolsProvided: false,
    },
    {
      posterId: lister.id,
      title: "MCB tripping in master bedroom",
      description:
        "MCB trips every 10 minutes when AC is on. Inspect wiring load + panel; may need rewiring.",
      category: "electrical",
      skills: ["electrical", "wiring"],
      zoneId: "NCR-D04",
      address: "C-17, Malviya Nagar",
      urgency: "urgent",
      durationMins: 60,
      priceInr: 599,
      paymentMode: "upi",
      experience: "experienced",
      toolsProvided: false,
    },
    {
      posterId: extraListers[0].id,
      title: "Switch board replacement (3 rooms)",
      description: "Old switchboards cracked. Replace 3 boards with modular switches; load 6A/16A mix.",
      category: "electrical",
      skills: ["electrical", "switches"],
      zoneId: "NCR-D03",
      address: "J-Block, Lajpat Nagar II",
      urgency: "scheduled",
      scheduledAt: futureIso(3, 10),
      durationMins: 90,
      priceInr: 899,
      paymentMode: "platform",
      experience: "experienced",
      toolsProvided: false,
    },
  ];

  seedJobs.forEach((j, idx) => {
    jobs.push({
      ...j,
      id: uuidv4(),
      status: "open",
      createdAt: daysAgo(idx % 6),
    });
  });

  const rejectsBy = [finder, ...extraFinders];
  rejectsBy.forEach((f, i) => {
    const j = jobs[i % jobs.length];
    swipes.push({
      id: uuidv4(),
      jobId: j.id,
      finderId: f.id,
      action: "reject",
      createdAt: daysAgo(1),
    });
  });

  const firstJob = jobs[0];
  if (firstJob) {
    firstJob.status = "accepted";
    firstJob.acceptedBy = extraFinders[0].id;
    swipes.push({
      id: uuidv4(),
      jobId: firstJob.id,
      finderId: extraFinders[0].id,
      action: "accept",
      createdAt: daysAgo(0),
    });
  }

  void admin;
}
