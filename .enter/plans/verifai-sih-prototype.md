# VERIFAI — AI-powered Bid Compliance Verification Platform (SIH Prototype)

## Context

The workspace is a bare Vite + React 19 + TypeScript + Tailwind + shadcn template: one placeholder page
(`src/pages/Index.tsx`), a single route, and no backend. Nothing exists for VERIFAI yet.

We are building a demo-ready Smart India Hackathon prototype: a procurement-officer console that turns a
tender + bidder documents into an **evidence-backed compliance decision** (PASS / FAIL / REVIEW), with a
full **Evidence Trace** behind every result and the **final decision reserved for the Procurement Officer**.

Confirmed decisions from this conversation:
- **Persistence:** the platform's native backend (database) — no local server, Docker, or external DB.
- **AI:** live AI via a **backend function**, with automatic deterministic fallback labeled "Demo reasoning mode".
- **Model:** **Gemini 3.6 Flash** (streaming `google_gemini_generate_content` route).
- Priority order for tradeoffs: working workflow → Compliance Review → Evidence Trace → engine → demo data →
  officer decision → audit trail → dashboard → polish.

---

## 1. Architecture

Three layers, deliberately small:

1. **Database (native backend)** — 10 small tables hold all demo state. Seeded once with synthetic data;
   officer decisions and audit events are written back by the app, so everything survives a refresh.
2. **Compliance engine (one backend function, `run-verification`)** — loads a submission bundle, runs
   **deterministic rules** for every numeric/boolean check, runs **AI semantic reasoning** (Gemini) for
   similar-project matching / entity mismatch / assessment narrative, persists evidence rows + score + risk +
   audit events, and returns the review payload. If the model is unavailable it silently degrades to
   deterministic reasoning and reports `ai_mode: "demo_reasoning"` — the app never breaks.
3. **Frontend (React)** — reads persisted rows via the generated backend client, renders the console, and
   invokes the engine. No rule logic is duplicated on the client; the UI only displays what the engine stored.

**No authentication.** This is a single-officer demo console; decisions are attributed to
"Procurement Officer". Adding login would be scope creep against the brief. Consequence: tables are readable
and (for decisions/uploads/audit) writable by the anonymous role. Acceptable here because the dataset is
100% synthetic and explicitly labeled as such; it is called out in Settings as a prototype limitation.

**Honesty rules baked in:** no live government lookups, no fraud claims, no measured savings, no AI final
decision. Labels `[PROTOTYPE SOURCE]`, `[PROTOTYPE EXTRACTION]`, `[RULE VERIFIED]`, `[AI ASSISTED]`,
`[DOCUMENT EVIDENCE]`, `[SYNTHETIC DEMO DATA]` are used consistently.

---

## 2. Data model (10 tables, created via migrations with RLS enabled)

| Table | Purpose | Key columns |
|---|---|---|
| `tenders` | Tender records | `id` (T001…), `name`, `department`, `status`, `updated_at` |
| `requirements` | Tender requirement lines | `id`, `tender_id`, `label`, `requirement_type` (`turnover`\|`similar_projects`\|`experience`\|`gst`\|`oem`\|`iso`), `threshold_value`, `threshold_unit`, `display_value`, `mandatory`, `verification_method`, `sort_order` |
| `bidders` | Synthetic bidders | `id` (B001…), `name`, `registered_name`, `turnover_cr`, `similar_projects`, `experience_years`, `gst_status`, `gstin`, `oem_authorization`, `iso_13485`, `udyam_number`, `pan` |
| `submissions` | Bid = tender × bidder | `id` (S001…), `tender_id`, `bidder_id`, `submitted_at`, `status`, `compliance_score`, `risk_level`, `overall_status`, `ai_summary`, `ai_mode`, `ai_findings` (jsonb), `verified_at` |
| `documents` | Synthetic document records | `id`, `submission_id`, `name`, `doc_type`, `status`, `source_page`, `extraction_method`, `confidence`, `extracted_fields` (jsonb) |
| `evidence_results` | **Evidence Trace rows** — one per requirement per submission | `id`, `submission_id`, `requirement_id`, `result`, `method`, `extracted_value`, `source_document`, `source_page`, `rule_expression`, `reasoning`, `confidence`, `created_at` |
| `verification_results` | Simulated government checks | `id`, `bidder_id`, `check_type` (GST/Udyam/PAN/MCA/Startup/NSIC/EPFO_ESIC/Blacklisting), `identifier`, `status`, `source_adapter`, `detail`, `checked_at` |
| `audit_events` | Chronological trail | `id`, `occurred_at`, `actor` (SYSTEM/OFFICER), `actor_name`, `action`, `entity_type`, `entity_id`, `entity_label`, `status`, `detail` |
| `officer_decisions` | Final decision (one per submission) | `id`, `submission_id` (unique), `decision` (QUALIFY/DISQUALIFY/REQUEST_CLARIFICATION), `comment`, `decided_by`, `decided_at` |
| `app_state` | Demo mode + bootstrap flags | `key` (pk), `value` (jsonb), `updated_at` |

RLS: enabled on every table in the creating migration, with `anon` select policies everywhere plus
insert/update policies on `documents`, `audit_events`, `officer_decisions`, `app_state`. The engine function
writes with the service role. Verified afterwards with the table-schema tool (RLS + policies confirmed).

---

## 3. Seed data and expected outcomes

**Tenders / requirements** (exactly as specified): T001 Network Infrastructure (turnover ₹5 Cr, 2 projects,
3 yrs, GST, OEM) · T002 Solar Rooftop (₹3 Cr, 3 projects, 5 yrs, GST, OEM) · T003 Hospital Diagnostic
Equipment (₹4 Cr, 2 projects, 4 yrs, GST, OEM, ISO 13485).

**Bidders:** B001 TechNova Systems (₹7.2 Cr, 4 projects — 3 strong + 1 partial, 8 yrs, GST active, OEM
letter issued to "TechNova **Solutions** Pvt. Ltd." → mismatch) · B002 GreenGrid Energy (₹2.4 Cr, 4 strong
projects, 6 yrs, GST active, OEM) · B003 MediCore Technologies (₹5.6 Cr, 2 strong projects, 5 yrs, GST
active, OEM, ISO 13485).

**Documents:** 5–6 per submission — Audited Financial Statement (p.8), Experience Certificate (p.12, with the
project list in `extracted_fields`), GST Certificate (p.2), OEM Authorization Letter (p.3), Company
Registration (p.1), ISO Certificate where applicable. All `[PROTOTYPE EXTRACTION]`.

**Result matrix the engine must produce** (this is the acceptance target for the engine):

| Sub | Case | Turnover | Projects | Exp | GST | OEM | ISO | Score | Risk | Overall |
|---|---|---|---|---|---|---|---|---|---|---|
| **S004** | **T002 × B002 (primary demo)** | **FAIL** 2.4<3.0 | PASS | PASS | PASS | PASS | — | **80%** | **HIGH** | **FAIL** |
| S005 | T003 × B003 (second demo) | PASS | PASS | PASS | PASS | PASS | PASS | **100%** | **LOW** | **PASS** |
| S001 | T001 × B001 (third demo) | PASS | REVIEW (partial project) | PASS | PASS | REVIEW (entity mismatch) | — | 60% | MEDIUM | REVIEW |
| S002 | T001 × B002 | FAIL 2.4<5.0 | PASS | PASS | PASS | PASS | — | 80% | HIGH | FAIL |
| S003 | T002 × B001 | PASS | REVIEW | PASS | PASS | REVIEW | — | 60% | MEDIUM | REVIEW |
| S006 | T003 × B001 | PASS | REVIEW | PASS | PASS | REVIEW | FAIL (no ISO doc) | 50% | HIGH | FAIL |

One officer decision is pre-seeded on **S002** (so Audit/Dashboard show a worked example) while **S004 stays
undecided** for the live demo. `app_state.demo_mode = true` with the three demo cases registered.

---

## 4. Engine rules (`run-verification`)

- **Deterministic (never AI):** `turnover_cr >= threshold` → PASS/FAIL; `experience_years >= threshold`;
  project *count* vs threshold; `gst_status == 'ACTIVE'`; ISO document present and valid. Rule expression is
  stored verbatim for the trace, e.g. `7.20 >= 5.00` or `2.40 < 3.00`.
- **AI-assisted (semantic):** classify each submitted project as strong/partial against the tender's required
  project characteristics; compare the registered bidder name against the OEM authorization's entity name;
  write the assessment paragraph. Output is validated JSON; anything malformed or a failed model call falls
  back to deterministic reasoning and is labeled **Demo reasoning mode**.
- **Score:** `passed / total applicable × 100`, rounded. Displayed with the mandatory-failure warning and the
  line "Decision requires Procurement Officer review." — never as an eligibility verdict.
- **Risk:** deterministic drivers → HIGH if any mandatory FAIL or failed verification; MEDIUM if only
  ambiguous/inconsistent evidence; else LOW. Each level lists its drivers ("Mandatory turnover requirement
  failed", "Financial evidence below threshold", "Potential entity mismatch"). Wording avoids "fraud".
- **Methods stored per row:** `RULE VERIFIED` · `AI ASSISTED` · `DOCUMENT EVIDENCE` · `PROTOTYPE SOURCE`.

Model call: `POST {base}/code/api/ai/v1beta/models/google/gemini-3.6-flash:streamGenerateContent` with
`x-goog-api-key` from the platform-injected AI secret, `X-Session-ID` (stable per submission) and
`X-Enter-Project-ID`. The route is streaming-only, so the function consumes the SSE stream server-side,
accumulates `candidates[0].content.parts[].text`, and returns one JSON payload. The AI token never reaches the
browser. The exact base URL / secret name / project id are read from the `enter_llm_integration` skill
**after** AI capability is enabled (its placeholders are unresolved until then).

---

## 5. Pages, routes and navigation

Sidebar nav (navy): **Overview · Tenders · Bids · Verification · Audit**, with Settings pinned at the bottom
and a persistent **DEMO MODE** indicator in the top bar.

| Route | Page | Contents |
|---|---|---|
| `/` | Command Center | 4 metric tiles (Active Tenders, Bids Under Review, Compliance Reviews, High Risk Cases), Recent Tenders, Recent Bid Reviews, PASS/REVIEW/FAIL distribution, LOW/MEDIUM/HIGH risk distribution, one-click demo-case launcher, demo-mode banner, and an impact line labeled "Expected impact based on problem statement." |
| `/tenders` | Tenders | Table: Tender ID, Name, Department, Requirements, Bids, Status, Last Updated, Action |
| `/tenders/:tenderId` | Tender detail | ID, title, department, status + requirement list with requirement, type, mandatory, verification method, status; bid list for the tender |
| `/bids` | Bids | Table of all submissions: submission, tender, bidder, status, score, risk, last updated, action |
| `/bids/:submissionId` | Bid detail | Bidder profile (synthetic notice), submission documents with extracted fields / confidence / source page / `[PROTOTYPE EXTRACTION]`, upload dialog, link to Compliance Review |
| `/review/:submissionId` | **Compliance Review (primary demo screen)** | Header (bidder, tender, score, risk, overall status) → requirement table (Requirement \| Evidence \| Result \| Method \| Action) where every row opens the Evidence Trace → AI Assessment card → Officer Decision card |
| `/verification` | Verification | 8 simulated adapters, each `[PROTOTYPE SOURCE]`, with per-bidder results, identifiers, timestamps, and "Re-run simulated verification"; adapters not exercised show an honest empty state |
| `/audit` | Audit | Chronological event table: timestamp, user/system, action, entity, status; filterable by entity |
| `/settings` | Settings | Demo mode toggle, demo-case list, AI mode indicator (live / demo reasoning), synthetic-data + no-live-integration statements, prototype security note |

**Evidence Trace** (dialog, opened from any result) — the killer interaction. Renders the full chain:
Requirement → Evidence → Source document → Page → Extracted value → Rule / AI reasoning → Result → Method,
with the raw rule expression (`2.40 < 3.00`) and the reasoning text. Opening it records an
"Officer viewed evidence" audit event.

**Officer Decision:** QUALIFY / DISQUALIFY / REQUEST CLARIFICATION + optional comment, "Decision made by:
Procurement Officer" + timestamp, saved persistently, with the standing note that AI provides assessment
support only and the final decision is the officer's. Re-deciding is allowed and appends a new audit event.

---

## 6. Design system

Extend `src/index.css` and `tailwind.config.ts` (no custom one-off styles in components):

- Navy chrome: `--nav` (216 48% 13%) / `--nav-foreground` / `--nav-muted` / `--nav-border`.
- Institutional blue primary (212 68% 32%), restrained teal accent (187 62% 34%).
- Semantic result tokens: `--pass` green (152 58% 30%), `--review` amber (35 85% 38%), `--fail` red
  (0 68% 42%), each with a `-subtle` background for badges; `--info` for prototype labels.
- Neutral content surface, subtle borders, moderate radius (0.5rem), one restrained panel shadow, generous
  spacing, compact data tables, Inter via `index.html` with a system fallback.
- Badge/button variants added to the design system (`pass`/`review`/`fail`/`prototype`/`ghost-navy`), not
  inline overrides. Distributions use lightweight CSS bars — no chart library, no glassmorphism, no neon,
  no robot imagery, no gratuitous animation.

Reused as-is: `ui/table`, `ui/card`, `ui/badge`, `ui/button`, `ui/dialog`, `ui/sheet`, `ui/select`,
`ui/textarea`, `ui/tabs`, `ui/tooltip`, `ui/skeleton`, `ui/alert`, `lib/utils.cn`, react-query (already
provided in `App.tsx`), lucide-react icons.

---

## 7. Files

**Backend**
- `supabase/functions/run-verification/index.ts` — HTTP entry, CORS, orchestration, persistence
- `supabase/functions/run-verification/rules.ts` — deterministic evaluators
- `supabase/functions/run-verification/semantic.ts` — Gemini call + demo-reasoning fallback
- `supabase/config.toml` — function config (JWT verification for the demo endpoint)

**Frontend data layer**
- `src/lib/verifai/types.ts` · `labels.ts` (label constants + badge/result maps) · `api.ts` (reads, engine
  invoke, decision save, upload, audit writes)
- `src/hooks/use-verifai.ts` — react-query hooks (dashboard, tenders, tender, submissions, review, audit,
  verification) + verification bootstrap

**Layout & shared components** (`src/components/`)
- `layout/app-shell.tsx`, `layout/nav-items.ts`
- `verifai/result-badge.tsx`, `method-tag.tsx`, `synthetic-notice.tsx`, `page-header.tsx`, `stat-tile.tsx`,
  `distribution-bar.tsx`, `empty-state.tsx`, `evidence-trace-dialog.tsx`

**Pages** (`src/pages/`)
- `dashboard/index.tsx` · `tenders/index.tsx` + `detail.tsx` · `bids/index.tsx` + `detail.tsx` +
  `document-list.tsx` + `upload-document-dialog.tsx` · `review/index.tsx` + `review-header.tsx` +
  `requirement-table.tsx` + `ai-assessment-card.tsx` + `officer-decision-card.tsx` · `verification/index.tsx`
  · `audit/index.tsx` · `settings/index.tsx`
- Delete `src/pages/Index.tsx` (replaced by the dashboard).

**Modified**
- `src/router.tsx` (routes under the app shell) · `src/index.css` · `tailwind.config.ts` ·
  `index.html` (title, font) · `CodeGuideline.md` (new page/module structure, per project convention)

---

## 8. Empty / error states

Reusable `EmptyState` for: no bids on a tender, no documents, verification pending, evidence unavailable,
AI unavailable (demo reasoning mode), no audit events, adapter not exercised. Engine failures surface an
inline retry, never a blank or broken page. The existing `*` route keeps 404s sane.

## 9. Responsiveness & performance

Desktop-first console; the sidebar collapses into the existing sheet on mobile and tables scroll with key
columns preserved. No new runtime dependencies, no polling, react-query caching, no animation beyond Tailwind
defaults.

---

## Implementation checklist

- [ ] Enable the native backend; confirm the generated client exists before writing any data code.
- [ ] Migration 1: create `tenders`, `requirements`, `bidders`, `submissions` with RLS enabled + anon select policies.
- [ ] Migration 2: create `documents`, `evidence_results`, `verification_results`, `audit_events`, `officer_decisions`, `app_state` with RLS enabled + scoped anon select/insert/update policies.
- [ ] Confirm RLS + policies on all 10 tables via the table-schema tool.
- [ ] Seed 3 tenders and 16 requirements matching section 3.
- [ ] Seed 3 bidders with the exact turnover / projects / experience / GST / OEM / ISO values in section 3.
- [ ] Seed 6 submissions, ~33 documents (with `extracted_fields`, source pages, confidences), 24 verification results, and the lifecycle audit events (tender created, bid submitted, document uploaded).
- [ ] Seed the S002 officer decision and `app_state` demo flags (demo mode on, three demo cases).
- [ ] Enable AI capability, reload the LLM skill for concrete endpoint/secret/project values.
- [ ] Write `rules.ts` covering turnover, experience, similar-project count, GST, OEM, ISO with stored rule expressions.
- [ ] Write `semantic.ts`: Gemini streaming call, JSON validation, deterministic demo-reasoning fallback.
- [ ] Write `run-verification/index.ts`: CORS + OPTIONS, `{ submission_id }` and `{ scope: "pending" }` actions, evidence/score/risk/findings persistence, audit events.
- [ ] Deploy the function and confirm one real invocation returns a payload (logs inspected on failure).
- [ ] Apply design tokens and component variants to `index.css` / `tailwind.config.ts`.
- [ ] Build the app shell (navy chrome, nav, demo-mode indicator, mobile sheet) and shared components (result badge, method tag, synthetic notice, stat tile, distribution bar, empty state).
- [ ] Build the Evidence Trace dialog rendering the full chain and recording the officer-view audit event.
- [ ] Build Compliance Review: header, requirement table with clickable rows, AI Assessment card, Officer Decision card with persistent save.
- [ ] Build Dashboard with the four metrics, recent tenders, recent bid reviews, both distributions, demo-case launcher, and the labeled expected-impact line.
- [ ] Build Tenders list + detail, Bids list + detail (documents, extraction detail, upload dialog that simulates extraction).
- [ ] Build Verification page (8 `[PROTOTYPE SOURCE]` adapters, re-run action) and Audit page (chronological events).
- [ ] Build Settings (demo mode toggle, AI mode indicator, honesty/prototype statements) and wire the verification bootstrap so pending bids verify once per session.
- [ ] Update `CodeGuideline.md` structure section; delete `src/pages/Index.tsx`; register all routes in `src/router.tsx`.

## Verification checklist

- [ ] `pnpm lint` and `pnpm exec tsc --noEmit` pass; `pnpm run build` completes.
- [ ] Engine output read back from the database matches section 3 row by row: S004 FAIL/HIGH/80%, S005 PASS/LOW/100%, S001 REVIEW/MEDIUM/60%, S002 FAIL/HIGH/80%, S003 REVIEW/MEDIUM/60%, S006 FAIL/HIGH/50%.
- [ ] Boundary/operator check: S004 turnover row stores `2.40 < 3.00` and FAIL, and the GST/ISO boolean rows store their comparison basis.
- [ ] Negative check: invoking the engine with an unknown submission id returns a handled error response, and the page shows a retry state rather than a crash.
- [ ] Primary journey end to end: Dashboard → Tenders → Government Solar Rooftop Installation → GreenGrid bid → Compliance Review → FAIL on turnover → Evidence Trace shows ₹2.40 Cr vs ₹3 Cr with rule `2.40 < 3.00` → AI Assessment visible → REQUEST CLARIFICATION + comment saved → Audit Trail shows the officer decision.
- [ ] Second journey: MediCore × Hospital shows all-PASS, 100%, LOW risk, with working Evidence Trace.
- [ ] Third journey: TechNova × Network shows REVIEW with the partial-project and entity-mismatch explanations and no "fraud" wording.
- [ ] Refresh persistence: reload the review page and confirm score, risk, evidence rows, decision, and audit events are unchanged (re-read from the database).
- [ ] Empty states render for: no documents, adapter not exercised, AI unavailable (demo reasoning mode), no audit events.
- [ ] `website_screenshot` at desktop_1280 and mobile_390 for `/` and `/review/S004`; no layout breakage, no console errors via the console-log tool.
- [ ] Copy audit: no live-integration claim, no accuracy/savings statistic, no AI-final-decision wording, all six required labels present where specified.
- [ ] No secret in client code: the AI token appears only inside the backend function.
