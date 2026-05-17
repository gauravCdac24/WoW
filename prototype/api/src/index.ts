import cors from "cors";
import express from "express";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { v4 as uuidv4 } from "uuid";
import { makeAdminHandlers } from "./admin.js";
import {
  type AuthedRequest,
  authOptional,
  authRequired,
  handleLogin,
  handleMe,
  handleSignup,
  requireRole,
} from "./auth.js";
import { type ZoneRef, makeJobsHandlers } from "./jobs.js";
import { seedDemoData } from "./stores.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT) || 3001;

const zonesPath = join(__dirname, "../../shared/ncr-pilot-zones.geojson");
const catalogPath = join(__dirname, "../../shared/service-catalog.json");

type ZoneFC = {
  features: Array<{
    properties: { zone_id: string; hub: string; label: string; radius_m: number };
    geometry: { type: string; coordinates: [number, number] };
  }>;
};

const zonesGeo = JSON.parse(readFileSync(zonesPath, "utf-8")) as ZoneFC;
const serviceCatalog = JSON.parse(readFileSync(catalogPath, "utf-8")) as {
  categories: Array<{
    id: string;
    name: string;
    skus: Array<{ id: string; name: string; basePriceInr: number; inspectionFeeInr: number }>;
  }>;
};

const zoneMap = new Map<string, ZoneRef>();
zonesGeo.features.forEach((f) => {
  zoneMap.set(f.properties.zone_id, {
    zone_id: f.properties.zone_id,
    hub: f.properties.hub,
    label: f.properties.label,
  });
});

seedDemoData();

type BookingStatus = "requested" | "confirmed" | "cancelled";
interface Booking {
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
const bookings: Booking[] = [];

function findSku(serviceId: string) {
  for (const cat of serviceCatalog.categories) {
    const sku = cat.skus.find((s) => s.id === serviceId);
    if (sku) return { category: cat, sku };
  }
  return null;
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(authOptional);

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "kaamchor-api-prototype", version: "0.2.0" });
});

app.post("/api/v1/auth/signup", handleSignup);
app.post("/api/v1/auth/login", handleLogin);
app.get("/api/v1/auth/me", authRequired, handleMe);

const jobsHandlers = makeJobsHandlers(zoneMap);
app.get("/api/v1/jobs/deck", requireRole("finder"), jobsHandlers.listForFinder);
app.get("/api/v1/jobs/accepted", requireRole("finder"), jobsHandlers.listAcceptedByFinder);
app.get("/api/v1/jobs/mine", requireRole("lister"), jobsHandlers.listMine);
app.post("/api/v1/jobs", requireRole("lister"), jobsHandlers.createJob);
app.post("/api/v1/jobs/:id/swipe", requireRole("finder"), jobsHandlers.swipe);

const adminHandlers = makeAdminHandlers(zoneMap);
app.get("/api/v1/admin/stats", requireRole("admin"), adminHandlers.stats);

app.get("/api/v1/zones", (_req, res) => {
  res.json(zonesGeo);
});

app.get("/api/v1/services", (_req, res) => {
  res.json(serviceCatalog);
});

app.post("/api/v1/bookings", (req: AuthedRequest, res) => {
  const body = req.body as Partial<{
    zoneId: string;
    serviceId: string;
    slot: string;
    customerName: string;
    phone: string;
    addressLine: string;
  }>;

  const zoneId = String(body.zoneId || "").trim();
  const serviceId = String(body.serviceId || "").trim();
  const slot = String(body.slot || "").trim();
  const customerName =
    String(body.customerName || "").trim() || req.user?.name || "Guest";
  const phone = String(body.phone || "").trim();
  const addressLine = String(body.addressLine || "").trim();

  if (!zoneId || !serviceId || !slot || !phone || !addressLine) {
    res.status(400).json({
      error: "validation_error",
      message: "zoneId, serviceId, slot, phone, and addressLine are required",
    });
    return;
  }
  if (!zoneMap.has(zoneId)) {
    res.status(400).json({ error: "invalid_zone", message: `Unknown zoneId: ${zoneId}` });
    return;
  }
  const found = findSku(serviceId);
  if (!found) {
    res.status(400).json({ error: "invalid_service", message: `Unknown serviceId: ${serviceId}` });
    return;
  }
  const quotedTotalInr = found.sku.basePriceInr + found.sku.inspectionFeeInr;
  const booking: Booking = {
    id: uuidv4(),
    zoneId,
    serviceId,
    slot,
    customerName,
    phone,
    addressLine,
    status: "confirmed",
    quotedTotalInr,
    createdAt: new Date().toISOString(),
  };
  bookings.unshift(booking);
  res.status(201).json(booking);
});

app.get("/api/v1/bookings", (_req, res) => {
  res.json({ items: bookings });
});

app.listen(PORT, () => {
  console.log(`KaamChor API prototype listening on http://localhost:${PORT}`);
  console.log(
    "Demo logins: admin@demo.com / lister@demo.com / finder@demo.com — password 'demo1234'"
  );
});
