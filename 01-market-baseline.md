# Market Baseline - KaamChor (Delhi & NCR Pilot)

## 1) Pilot Region Choice

- **Selected geography:** **Delhi & NCR** (single-region pilot: Delhi plus Noida, Greater Noida, Ghaziabad, Gurugram, Faridabad, and contiguous urban pockets as operationally defined).
- **Why Delhi & NCR first:**
  - Very large, dense wallet and high home-services demand across income segments.
  - Strong digital adoption; many households already trained on app-based services.
  - Intense competition—success here validates brand, ops, and unit economics under real pressure.
  - Multi-hub logistics (traffic, distance, tolls) stress-tests dispatch and SLA design early.

## 2) Market Sizing Framework (TAM -> SAM -> SOM)

## 2.1 India TAM context (top-down)

- India home services TAM is reported around **INR 5,100-5,210 billion (FY25)**, mostly unorganized/offline.
- Online home services estimated around **INR 41-43 billion (FY25)** with projected high growth (18-22% CAGR through FY30).
- Top 8 cities contribute **85-90%** of online demand; **Delhi NCR is consistently among the largest online home-services demand clusters** in India.

## 2.2 Delhi NCR SAM (serviceable available market) - planning estimate

Assumptions for Year-1 planning baseline (to be refined with primary research):

- NCR urban/agglomeration population planning band: **~22M-32M** (definition varies by boundary; use internal map for pilot zones).
- Average household size band: **3.8-4.5**.
- Implied households: **~5.0M-7.5M** (broad NCR).
- Targetable middle/high-income + app-using households for initial categories: **25-35%** of relevant urban households in the pilot footprint.
- Serviceable households in Year-1 (for launch categories): **~1.2M-1.8M**.
- Annual relevant spend per serviceable household across launch categories (plumbing/electrical/cleaning): **INR 8,000-18,000**.

**Indicative Delhi NCR SAM (launch categories):**

- **Low case:** 1.2M x INR 8,000 = **INR 9.6B/year**
- **Base case:** 1.5M x INR 12,000 = **INR 18.0B/year**
- **High case:** 1.8M x INR 18,000 = **INR 32.4B/year**

## 2.3 SOM (serviceable obtainable market) - first 12 months

Execution-based share assumptions for a new entrant:

- Year-1 achievable share of category SAM in one metro: **0.5%-2.0%**
- Resulting SOM:
  - **Low:** INR 9.6B x 0.5% = **INR 48M annual GMV**
  - **Base:** INR 18.0B x 1.0% = **INR 180M annual GMV**
  - **Stretch:** INR 32.4B x 2.0% = **INR 648M annual GMV**

Planning note: use base SOM for budget model and low SOM for runway stress testing.

## 3) Competitor Heatmap (Delhi NCR)

| Player                                 | Core Strength                                                                      | Weakness/Gap                                                              | Delhi NCR presence signal                                    | Strategic Threat Level                          |
| -------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------- |
| Urban Company                          | Strong brand trust, deep category ops, trained pros, scale, repeat engine          | Higher process overhead, potential premium pricing in some segments       | Very high (multi-category, high booking volume, metro depth) | Very High                                       |
| NoBroker Home Services                 | Existing real-estate user funnel, aggressive pricing/packaging, broad city ops     | Home services may be secondary to core business, quality consistency risk | High (active service pages and pricing across categories)    | High                                            |
| Local unorganized providers (offline)  | Hyperlocal relationships, low explicit prices, immediate neighborhood availability | Trust, quality variability, no standardized SLA, poor grievance handling  | Very high (dominant market share overall)                    | High (price pressure), Medium (quality segment) |
| Emerging instant home-service startups | Fast response UX, frequency play (micro-jobs), investor attention                  | Category depth and quality controls still maturing                        | High in NCR metros                                           | Medium-High                                     |
| Niche specialists (single-category)    | Deep craftsmanship in category                                                     | Limited cross-category retention and wallet share                         | Medium                                                       | Medium                                          |

## 4) Positioning Hypothesis for Winning in Delhi NCR

- Compete on **reliability + trust + transparent pricing**, not discount-only.
- Build initial moat via:
  - Dense micro-zone supply quality (especially across NCR distance and traffic),
  - Strong redo/refund confidence policy,
  - Realistic ETAs and slot promises (avoid over-promising express outside dense zones),
  - Worker quality scorecards + SOP adherence.

## 5) Pricing and Economics Baseline (for finance model seed)

- Target average order values by launch category:
  - Plumbing/Electrical quick jobs: INR 249-999 ticket band.
  - Cleaning jobs: INR 599-2,499 ticket band.
- Platform economics directional target:
  - Contribution margin positivity by cohort month 3-4.
  - Refund + redo leakage <5% of GMV by month 6.
  - Repeat user share >45% by month 9.

## 6) Data Gaps to Resolve in Phase 0

- Micro-zone demand density and time-slot demand curves (per hub: Delhi vs Gurugram vs Noida corridor).
- Category-level willingness to pay by apartment segment and colony type.
- Paid acquisition channel elasticity in Delhi NCR (Meta/Google/affiliate/WhatsApp).
- Worker acquisition funnel conversion and retention by category.
- Real cancellation and no-show benchmarks by daypart (monsoon/winter peaks).

## 7) Recommendation

- Proceed with **Delhi NCR** micro-zone launch (8-12 clusters across 2-3 hubs), 3 categories, and strict reliability KPIs.
- Use this baseline to run a 90-day validation and then revise TAM/SAM/SOM with first-party data.

## 8) Appendix: NCR Launch Map (Pilot Micro-Zones)

Purpose: name **10 starter micro-zones** for Phase 0/1 so ops, supply, and marketing can align on the same geography. Exact polygons should be drawn in your mapping tool (Google Maps / internal geo layer) and tagged with `zone_id` in the product.

**Map assets (drawn from public geocoding centroids):**

- Interactive map (open in a browser): [assets/ncr-pilot-zones-map.html](assets/ncr-pilot-zones-map.html)
- Machine-readable points + radii: [assets/ncr-pilot-zones.geojson](assets/ncr-pilot-zones.geojson)

The HTML map uses Leaflet + OpenStreetMap tiles. Circles are **visual guides** only (`radius_m` in GeoJSON); they are not legal boundaries—replace with real polygons before production dispatch logic.

Selection criteria used here: residential + commercial density, typical home-services demand, and spread across **three hubs** (Gurugram, South Delhi, Noida) to stress-test **cross-traffic and distance** early.

| Zone ID | Hub        | Micro-zone (working label)        | Notes (planning) |
| ------- | ---------- | ----------------------------------- | ---------------- |
| NCR-G01 | Gurugram   | DLF Phase 1–3 / Cyber City fringe  | High-rise + office adjacency; strong weekday demand |
| NCR-G02 | Gurugram   | Golf Course Road / Sector 43–56   | Premium residential; higher AOV potential |
| NCR-G03 | Gurugram   | Sector 29 / MG Road / NH48 corridor | Dense retail + mixed residential; evening peaks |
| NCR-D01 | S. Delhi   | Greater Kailash I–II / Chittaranjan Park | Established spenders; repeat cleaning potential |
| NCR-D02 | S. Delhi   | Hauz Khas / Green Park / Saket     | Young professionals + families; app-native |
| NCR-D03 | S. Delhi   | Defence Colony / Lajpat Nagar II–IV | High footfall services; parking friction |
| NCR-D04 | S. Delhi   | Malviya Nagar / Panchsheel          | Balanced mid-premium mix |
| NCR-N01 | Noida      | Sector 62 / 63 (electronic city)  | IT workforce density; weekday slots |
| NCR-N02 | Noida      | Sector 18 / Sector 38 (Atta)       | Central Noida; retail-led discovery |
| NCR-N03 | Noida      | Noida–Greater Noida Expressway / 137 | High-rise clusters; growth corridor |

### Approximate centroids (WGS84) and map radii

Coordinates are **representative centroids** from public geocoding (Wikipedia, GeoHack, locality lookup tools). `radius_m` is only for visualization in the bundled map; tune per zone after you measure demand.

| Zone ID | Latitude (°N) | Longitude (°E) | radius_m (viz) | Anchor used for lookup |
| ------- | ------------- | -------------- | -------------- | ------------------------ |
| NCR-G01 | 28.493568 | 77.093661 | 2200 | DLF Phase 3, Sector 24, Gurugram |
| NCR-G02 | 28.455255 | 77.097599 | 2500 | DLF Golf Course Rd, Sector 42, Gurgaon |
| NCR-G03 | 28.468365 | 77.064047 | 2200 | Iffco Chowk / Sector 29, Gurugram |
| NCR-D01 | 28.544342 | 77.239710 | 2200 | Greater Kailash (Wikipedia/GeoHack) |
| NCR-D02 | 28.549507 | 77.203613 | 2800 | Hauz Khas, New Delhi |
| NCR-D03 | 28.569271 | 77.244110 | 2200 | Lajpat Nagar, New Delhi |
| NCR-D04 | 28.534000 | 77.211000 | 2000 | Malviya Nagar (Delhi) |
| NCR-N01 | 28.622934 | 77.364026 | 2200 | Noida Sector 62 |
| NCR-N02 | 28.569588 | 77.323109 | 2000 | Sector 18, NOIDA |
| NCR-N03 | 28.509000 | 77.406000 | 2200 | Sector 137 / Expressway belt, Noida |

**Optional expansion (same pilot, if supply allows):** add **1–2** zones to validate a fourth sub-hub without diluting focus—for example **Vaishali / Kaushambi (Ghaziabad)** or **Dwarka (Southwest Delhi)**—only after NCR-G01–NCR-N03 and NCR-D01–D04 show stable SLA.

**Operational rules**

- **Minimum viable supply:** do not promise “express” windows until a zone hits agreed worker density and acceptance-rate thresholds (see service playbook).
- **Hub pairing:** early dispatch rules should prefer **within-hub** assignment; cross-hub assignments (e.g. Gurugram worker to Noida) are **out of scope** for pilot unless explicitly enabled for overflow with extended ETA.
- **Revisit monthly:** promote or retire zones based on GMV, rework rate, and CAC—not vanity coverage.
