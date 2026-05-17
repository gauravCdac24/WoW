import { type FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ApiError,
  EXPERIENCE_LABELS,
  JOB_CATEGORY_LABELS,
  PAYMENT_LABELS,
  URGENCY_LABELS,
  api,
  type JobCategory,
  type JobDTO,
  type JobExperience,
  type JobUrgency,
  type PaymentMode,
  type ZonesFC,
} from "../api";
import { AppShell } from "../components/AppShell";

const CATEGORY_OPTIONS = Object.keys(JOB_CATEGORY_LABELS) as JobCategory[];
const URGENCY_OPTIONS = Object.keys(URGENCY_LABELS) as JobUrgency[];
const EXPERIENCE_OPTIONS = Object.keys(EXPERIENCE_LABELS) as JobExperience[];
const PAYMENT_OPTIONS = Object.keys(PAYMENT_LABELS) as PaymentMode[];

export function ListerHome() {
  const [zones, setZones] = useState<ZonesFC["features"]>([]);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<JobCategory>("plumbing");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [address, setAddress] = useState("");
  const [urgency, setUrgency] = useState<JobUrgency>("standard");
  const [scheduledAt, setScheduledAt] = useState("");
  const [durationMins, setDurationMins] = useState(60);
  const [priceInr, setPriceInr] = useState(499);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("upi");
  const [experience, setExperience] = useState<JobExperience>("any");
  const [toolsProvided, setToolsProvided] = useState(false);
  const [contactPhone, setContactPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const loadZones = useCallback(async () => {
    try {
      const z = await api<ZonesFC>("/api/v1/zones");
      setZones(z.features);
      setZoneId((prev) => prev || z.features[0]?.properties.zone_id || "");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load zones");
    }
  }, []);

  useEffect(() => {
    void loadZones();
  }, [loadZones]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(null);
    setSubmitting(true);
    try {
      const payload = {
        title,
        description,
        category,
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        zoneId,
        address,
        urgency,
        scheduledAt: urgency === "scheduled" ? new Date(scheduledAt).toISOString() : undefined,
        durationMins,
        priceInr,
        paymentMode,
        experience,
        toolsProvided,
        contactPhone: contactPhone.trim() || undefined,
      };
      const job = await api<JobDTO>("/api/v1/jobs", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setOk(`Posted "${job.title}" — it's now visible to workers in ${job.zone?.hub || job.zoneId}.`);
      setTitle("");
      setDescription("");
      setSkills("");
      setAddress("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell
      title="Post a new job"
      subtitle="Fill in the details — nearby workers will see it the moment you publish"
      action={
        <Link to="/lister/jobs" className="ghost">
          My posts
        </Link>
      }
    >
      {error && <div className="err">{error}</div>}
      {ok && <div className="ok">{ok}</div>}

      <form className="page-form" onSubmit={onSubmit}>
        <section className="section">
          <div className="section-head">
            <h2 className="section-title">About the job</h2>
            <p className="section-sub">A clear title and description gets 3× faster responses.</p>
          </div>

          <label className="field">
            <span>Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fix leaking kitchen tap"
              minLength={4}
              required
            />
          </label>

          <label className="field">
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value as JobCategory)}>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {JOB_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Problem, access details, anything special a worker should know"
              minLength={10}
              rows={4}
              required
            />
          </label>

          <label className="field">
            <span>Skills needed (comma separated)</span>
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="plumbing, tap repair"
            />
          </label>
        </section>

        <section className="section">
          <div className="section-head">
            <h2 className="section-title">Location &amp; timing</h2>
            <p className="section-sub">Pick your zone and when you need the work done.</p>
          </div>

          <label className="field">
            <span>Micro-zone</span>
            <select value={zoneId} onChange={(e) => setZoneId(e.target.value)} required>
              {zones.map((f) => (
                <option key={f.properties.zone_id} value={f.properties.zone_id}>
                  {f.properties.zone_id} — {f.properties.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Address / landmark</span>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Flat, tower, society, landmark, pincode"
              rows={2}
              required
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Urgency</span>
              <select value={urgency} onChange={(e) => setUrgency(e.target.value as JobUrgency)}>
                {URGENCY_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {URGENCY_LABELS[u]}
                  </option>
                ))}
              </select>
            </label>

            {urgency === "scheduled" && (
              <label className="field">
                <span>Preferred date &amp; time</span>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  required
                />
              </label>
            )}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2 className="section-title">Requirements</h2>
            <p className="section-sub">Helps us show your job to the right workers.</p>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Experience needed</span>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value as JobExperience)}
              >
                {EXPERIENCE_OPTIONS.map((ex) => (
                  <option key={ex} value={ex}>
                    {EXPERIENCE_LABELS[ex]}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Estimated duration (min)</span>
              <input
                type="number"
                min={15}
                max={480}
                step={15}
                value={durationMins}
                onChange={(e) => setDurationMins(Number(e.target.value))}
                required
              />
            </label>
          </div>

          <label className="toggle">
            <input
              type="checkbox"
              checked={toolsProvided}
              onChange={(e) => setToolsProvided(e.target.checked)}
            />
            <span className="toggle-label">
              Tools &amp; materials provided on site
              <em>Turn on if the worker doesn't need to bring their own kit.</em>
            </span>
          </label>
        </section>

        <section className="section">
          <div className="section-head">
            <h2 className="section-title">Budget &amp; payment</h2>
            <p className="section-sub">Fair budgets get claimed faster. Average for this category: ₹400–900.</p>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Budget (₹)</span>
              <input
                type="number"
                min={49}
                max={100000}
                step={50}
                value={priceInr}
                onChange={(e) => setPriceInr(Number(e.target.value))}
                required
              />
            </label>

            <label className="field">
              <span>Payment mode</span>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
              >
                {PAYMENT_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {PAYMENT_LABELS[p]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2 className="section-title">Contact (optional)</h2>
            <p className="section-sub">Leave blank to use your account number.</p>
          </div>

          <label className="field">
            <span>Contact number for this job</span>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="e.g. +91 98100 12345"
            />
          </label>
        </section>

        <div className="page-form-actions">
          <button type="submit" className="primary" disabled={submitting}>
            {submitting ? "Publishing…" : "Publish job"}
          </button>
          <span className="muted small">You can edit or cancel later from My posts.</span>
        </div>
      </form>
    </AppShell>
  );
}
