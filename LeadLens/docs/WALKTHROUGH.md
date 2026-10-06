# Two-minute walkthrough outline

Adapt this to your actual contribution and keep the AI-assistance disclosure accurate.

**0:00–0:20 — Problem and scope**
“LeadLens helps a sales team turn an existing company list into a focused shortlist. After reviewing SaaSquatch's public product information, I selected data cleanup and explainable prioritization. I could not test its signed-in workflows, so this is a complementary prototype.”

**0:20–0:45 — Import and cleanup**
Show sample import. “This fictional dataset has 14 rows. The app stores 12 unique companies and skips two duplicate domains. Re-importing it does not create duplicates. Missing fields and incorrectly formatted emails are flagged.”

**0:45–1:15 — Fit and explanation**
Open Northstar. “I can choose industry, country and company size. The score shows exactly how each criterion contributes. Changing the target immediately reorders the list. This is rule-based scoring; it is not an AI prediction.”

**1:15–1:35 — Practical output**
Show Needs review, selection and export. “The team can inspect incomplete records and export a shortlist with scores and quality notes. Email syntax checks do not prove an inbox exists.”

**1:35–2:00 — Architecture and tradeoffs**
“The UI uses React and TypeScript. API handlers run on a Cloudflare Worker and save records in D1, a SQLite database. Prepared statements and a unique index enforce deduplication. I scoped out live scraping and enrichment to focus on two complete workflows. I used AI assistance and reviewed [describe the parts you actually reviewed or changed].”

Before recording: run the app, understand the scoring weights and dedup rules, and confirm what you personally tested. Do not describe synthetic data as real leads or claim measured time savings without measurement.
