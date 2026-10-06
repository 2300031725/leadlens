# LeadLens — Lead Quality Workspace

A focused full-stack prototype for the Caprae Full Stack Developer pre-work. It turns an existing company CSV into a deduplicated, explainable shortlist. Built with AI assistance; review and understand the code before presenting it as your work.

## Two implemented improvements

1. **Company data cleanup:** CSV parsing, normalized-domain deduplication, required-field checks, email-format checks, import outcomes, and durable records.
2. **Explainable prioritization:** editable industry/country/employee criteria, a 100-point score with a visible breakdown, quality review, search, selection, and CSV export.

This is an independent companion prototype, not a SaaSquatch integration or clone. It does not scrape websites, enrich contacts, verify inbox delivery, send outreach, or use an LLM. Demo data is explicitly fictional and uses reserved `.example` domains.

## Reference review and business rationale
J
Reviewed 6 October 2026:
- https://www.saasquatchleads.com/ — publicly describes company search/filtering, industry/location discovery, company-size and revenue estimates, enrichment, AI company scoring, saving/export, and outreach.
- https://app.saasquatchleads.com/ — public navigation was visible, but the company workflow redirected to `/auth`; authenticated workflows were not tested.

The opportunity selected is an **import-stage quality and prioritization workflow**: a searcher or small sales team can combine permitted exports, reduce duplicate company effort, and understand which businesses fit their current target. This is a design proposal, not a verified claim that SaaSquatch lacks these features. No paid account, SaaSquatch API, or proprietary dataset was used.

## Stack and architecture

React 19 + TypeScript → same-origin HTTP API routes → Cloudflare D1 (SQLite).

- UI: React, custom responsive CSS, Lucide icons. Vinext runs the Next.js App Router API on Vite.
- Backend: TypeScript route handlers on a Cloudflare Worker, **not FastAPI**.
- Database: D1, prepared SQL queries; Drizzle manages checked-in schema migrations.
- Hosting: serverless Cloudflare Worker plus static client assets through Sites. No AWS or Azure components.
- Data isolation: current deployment is a private, owner-only workspace protected by Sites access control. The app itself does not implement user tenancy. **Do not publish this shared database to an unrestricted audience with private leads.** Local development has no authentication.
- Storage: no authoritative lead data in browser storage. Records survive reloads in D1; target criteria, selected rows, and import reports are temporary UI state.
- Caching: static assets use hosting delivery; lead API replies use `Cache-Control: no-store`. Filtering/scoring is memoized on the client. There is no Redis or stale cross-user lead cache.
- Performance: one list read, in-memory filtering, prepared insert batches of 50, and a unique database index for race-safe deduplication. Prototype limits: 1 MB/request, 1,000 CSV rows/import, 5,000 saved leads. No benchmark or production-scale claim is made.

## Run locally

Requirements: Node.js >=22.13, pnpm, and a current Chromium/Firefox browser. The package lock pins installed versions.

```bash
pnpm install --frozen-lockfile
pnpm build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_known_weapon_omega.sql
pnpm start
```

Open the local URL printed by Wrangler. Apply the migration once to a fresh database; do not replay it over an initialized one. For UI development, `pnpm dev` uses the same local database state. Production publishing applies migrations independently.

```bash
node --experimental-strip-types --test tests/leads.test.mjs
pnpm exec tsc --noEmit
```

To add schema changes: edit `db/schema.ts`, run `pnpm db:generate`, inspect the new SQL, apply only the new migration locally, and rebuild. Never rewrite an already applied production migration.

## Demo flow

1. Click **Explore sample data** or **Load sample data**.
2. The 14 fictional rows produce **12 companies and 2 duplicates skipped** on a fresh database.
3. Import the same sample again: **0 added, 14 duplicates skipped**.
4. Open Northstar IT to see the 100-point default score breakdown.
5. Change country to Canada; scores reorder immediately.
6. Open **Needs review** to see invalid/missing fields.
7. Select companies and export their scores and quality notes.
8. Reload to verify saved companies remain.

`public/template.csv` contains column headers; `public/sample-leads.csv` is a reproducible synthetic dataset.

## Scoring

| Criterion | Points |
|---|---:|
| Exact case-insensitive industry match | 35 |
| Exact case-insensitive country match | 25 |
| Employees within inclusive min/max | 20 |
| Email passes a basic syntax check | 10 |
| Parseable HTTP(S) website domain | 10 |

A blank industry/country means unrestricted and awards that criterion's points. Unknown employee count scores zero for size. A score >=80 is marked high priority. A high score can still have quality issues; review before outreach. These are editable target-fit rules, not machine learning or probability estimates. Country aliases such as USA and United States are not automatically mapped.

## Cleanup rules and limitations

- Domain normalization removes `www`, casing, protocol, port and path. Subdomains remain distinct. The first saved record wins; later duplicates do not overwrite it. This can merge separate branches that share one domain; fuzzy matching and a conflict-review queue are future work.
- With no valid website, compare normalized company + city + country. A missing-website lead later supplied with a domain may need manual reconciliation in a future version.
- CSV supports BOM, CRLF/LF, quoted commas/newlines and doubled quotes. Rows with inconsistent columns, blank company, or values >500 characters are rejected. Negative/non-integer sizes become unknown.
- Quality checks are syntactic: no DNS/MX, SMTP, website availability, source authenticity, or personal-data verification is performed.
- Export quotes cells and prefixes formula-leading values to reduce spreadsheet formula injection.
- Imports run in chunks. A database error after an earlier chunk may leave partial progress; retrying is safe through the unique key. The 5,000-record cap is approximate under concurrent imports.
- Only import company data you are entitled to use. Nothing is emailed or sold by this prototype.
- No application-level rate limiter or public multiuser access; future public deployment needs authentication, tenant IDs, ownership enforcement, rate limiting, and a separate disposable demo dataset.

## API

- `GET /api/leads`: saved lead records, no-store response.
- `POST /api/leads`: raw CSV body (`Content-Type: text/csv`); returns `inserted`, `duplicates`, `rejected`, `total`. Rejects cross-origin browser writes. Validation errors use 400, oversized requests 413, storage failures 503.

## UX decisions

A single working page exposes the list, target criteria, import and export without setup navigation. Color accompanies textual quality labels; every score has a detailed explanation. Empty, loading, error and import-result states are explicit. A details drawer preserves context. Mobile layouts collapse navigation and allow horizontal scrolling of the data table. Dialogs support Escape and keyboard focus containment.

## Delivery and five-hour scope

The build prioritizes these two features within the handbook's development limit. Record your actual total development/review time; do not claim a fabricated five-hour duration. The source includes setup instructions, tests, migrations, synthetic data, and a walkthrough outline. Review the implementation and modify anything you cannot explain before submission.

For Sites deployment: generate migrations, typecheck/test, build the Worker, push the matching source commit, package build output, save a version and deploy privately. The production database is provisioned by Sites using the `DB` declaration in `.openai/hosting.json`. Sharing with recruiters requires a separate access decision; the initial demo is private.

For an independent Cloudflare deployment, create your own D1 database and configure its actual ID in a deployment Wrangler config; never reuse the preview placeholder database ID. GitHub upload and recruiter submission are separate steps and have not been performed automatically.

## Validation performed

- Eight Node tests passed for CSV parsing, duplicate keys, invalid rows, score changes, quality flags and export escaping.
- TypeScript typecheck passed.
- SQLite migration, duplicate conflict behavior and indexed lookup were checked against an in-memory SQLite database.
- The production build completed. Browser interaction and end-to-end API tests were not completed because the preview connection was unavailable. Before recruiter submission, manually run the demo flow above, including reload persistence and CSV download.
