# Bulk Guide Generation Prompt

Use this prompt with any strong LLM to turn `topics-backlog.csv` rows into
`mini-guides.json` entries. Generate in batches of 5–10, paste into
`src/lib/guides-data/mini-guides.json`, then run `npm run build` — bad entries
fail type-check instead of shipping broken pages.

---

## The prompt (copy everything below the line)

You write Fix-It Guides for Nessco Tech Services, a local IT company in Tampa Bay, Florida.
Voice: plain English, no jargon, no upsells, honest about when to call a pro.
Mention Tampa Bay specifics where natural (block walls, storms, snowbirds).
Prices to reference: remote support $75/hr, on-site $125/hr. Business plans exist
(Essentials $149/mo, Managed $349/mo) but only mention them when relevant.

For EACH topic row I give you, output ONE JSON object with EXACTLY this shape
(no markdown fences, no commentary, valid JSON — it will be type-checked):

{
  "slug": "<from the CSV>",
  "title": "<clear outcome + time, e.g. 'X in Y Minutes'>",
  "excerpt": "<1–2 sentences: symptom + promise>",
  "readMinutes": <3-7 integer matching the depth>,
  "helpCategory": "<ONE of: computer, wifi, email, m365, security, printer, hardware, business, other>",
  "helpCategoryLabel": "<matching label: Computer, Wi-Fi / Networking, Email, Microsoft 365, Security, Printer, Hardware / On-Site, Business IT, Backup & Recovery>",
  "serviceSlug": "<ONE of: computer-repair, wifi-networking, microsoft-365, email, cybersecurity, data-backup, business-it, remote-support, network-installation>",
  "serviceLabel": "<matching label>",
  "symptoms": ["<3 observable symptoms>"],
  "steps": [
    {"heading": "1. <imperative heading>", "body": "<2-4 sentences, exact clicks/settings included>"},
    {"heading": "2. ...", "body": "..."},
    {"heading": "3. ...", "body": "..."}
  ],
  "whenToCall": ["<3 honest escalation lines, specific not generic>"],
  "faqs": [
    {"q": "<real question>", "a": "<2-3 sentence answer>"},
    {"q": "<real question>", "a": "<2-3 sentence answer>"}
  ]
}

Category mapping for backlog labels:
- computer, gmail-email→email, wifi, security, m365, printer, hardware→computer or hardware by fit, business/hardware/business-hardware→business, other-backup/other-local→other
- helpCategoryLabel for "other" is ALWAYS "Backup & Recovery"; serviceSlug for "other" is "data-backup", serviceLabel "Data Backup"

Rules:
1. Steps must contain exact UI paths (Settings → X → Y), never "go to settings".
2. Every guide needs ONE Tampa-specific detail (housing, storms, snowbirds, local ISPs).
3. whenToCall must name concrete triggers (sounds, error states, dollar thresholds), never "contact support".
4. One faq MUST answer a pricing question with the $75/$125 rates.
5. No invented product names, no fake statistics, no medical/legal/financial advice.
6. If a topic overlaps an existing guide, go deeper or narrower — never duplicate.

After generating, self-check each object:
[ ] Valid JSON (all quotes escaped, no trailing commas)
[ ] slug matches CSV exactly
[ ] helpCategory is a real workflow id from the list above
[ ] 3+ steps, 3 whenToCall, 2+ faqs
[ ] Tampa detail present, pricing faq present

---

## Workflow

1. Pick 5–10 rows from `topics-backlog.csv`.
2. Paste this prompt + the rows into the LLM.
3. Paste output objects into `mini-guides.json` (before the closing `]`).
4. `node -e "JSON.parse(require('fs').readFileSync('src/lib/guides-data/mini-guides.json'))" && npm run build`
5. Delete completed rows from the backlog, commit.
