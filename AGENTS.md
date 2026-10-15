MSP Website — Development Rules
Mission


Build a professional local MSP website that generates qualified
customers and can eventually evolve into a complete MSP customer
portal and PSA platform.


The immediate objective is NOT to build a giant MSP application.


Phase 1 is a high-quality public-facing website and lead-generation
system.


Core Principles
Prefer simple architecture.
Build incrementally.
Do not introduce unnecessary dependencies.
Do not build microservices unless explicitly authorized.
Do not over-engineer Phase 1.
Do not modify unrelated files.
Do not invent business claims.
Do not invent pricing.
Do not invent certifications, partnerships, customer counts,
response times, guarantees, or geographic coverage.
Never expose secrets in frontend code.
Never commit credentials.
Treat customer information as sensitive.
Validate all user input.
Build for mobile first.
Maintain accessibility.
Maintain good SEO.
Test every meaningful feature.
Preserve existing working functionality.
Do not rewrite working code merely for stylistic reasons.
Explain significant architectural decisions before implementing them.
Business Objective


The website should convert visitors into paying IT-support customers.


Primary funnel:


Visitor
→ Understands problem
→ Trusts company
→ Requests help
→ Receives service
→ Becomes repeat customer
→ Becomes business customer
→ Eventually becomes managed IT customer


The website should therefore prioritize:


clarity
trust
simple navigation
obvious calls to action
fast loading
mobile usability
local SEO
service-specific landing pages
easy service requests
Phase 1 Scope


Phase 1 includes:


Homepage
Services overview
Individual service pages
Pricing/information page
About page
Contact page
Get Help workflow
Service request form
Responsive design
Accessibility
SEO metadata
Sitemap
robots.txt
Analytics-ready architecture
Error pages
Loading states
Form validation
Basic automated tests


Phase 1 does NOT include:


customer portal
authentication
customer accounts
RMM
PSA
ticketing system
billing system
subscriptions
contracts
technician accounts
device management
AI support agent
complex CRM


Those may be implemented in later phases.


Future Architecture


The application may eventually expand to:


Customer
→ Account
→ Tickets
→ Appointments
→ Payments
→ Invoices
→ Contracts
→ Devices
→ RMM
→ Automation
→ Technician
→ PSA


Do not implement these systems until explicitly authorized.


Technical Rules


Use:


Next.js
TypeScript
React
Tailwind CSS
App Router


Prefer:


server components where appropriate
simple components
typed data
reusable UI components
semantic HTML
accessible forms
progressive enhancement


Avoid:


unnecessary client components
unnecessary state management libraries
unnecessary UI frameworks
premature abstractions
microservices
excessive dependencies
Security


Never:


commit .env
expose API secrets
expose private keys
put server credentials in client components
trust client-side validation alone
log passwords
log payment credentials
store unnecessary customer information


Use environment variables for secrets.


Before deployment, perform a security review.


Git Rules


Do not:


git push
force push
delete branches
rewrite history


without explicit authorization.


Do not create commits unless explicitly requested.


The human owner controls commits, tags, releases, and pushes.


Environment Variables
Form delivery uses Resend (no extra dependency). All vars are server-only
and read from env at runtime; never hardcode or commit them.


RESEND_API_KEY - API key from https://resend.com (optional; without it,
email notifications are skipped and logged)

EMAIL_FROM - sender for notifications (default: "Nessco Website
<onboarding@resend.dev>" - change to a verified domain sender before
production)

NOTIFY_TO - inbox that receives notifications (default: info@nesscotech.com)


Development Workflow


For significant features:


Inspect existing code.
Explain the intended change.
Identify affected files.
Implement the smallest appropriate change.
Run tests.
Run linting.
Run build validation.
Review the resulting diff.
Report any remaining issues.


Do not silently expand scope.


Design Direction


The website should feel:


professional
trustworthy
modern
local
technically competent
approachable
fast
clean


Avoid:


generic AI-looking websites
excessive animations
meaningless stock photography
excessive gradients
fake testimonials
fake reviews
fake statistics
corporate jargon
"AI-powered" language unless actually applicable


The site should communicate:


"Call us when your technology isn't working."


Content Rules


Never fabricate:


reviews
testimonials
awards
certifications
partnerships
customer counts
years in business
guarantees
response times
service areas
pricing


Use placeholders where real business information is required.


Accessibility


Target WCAG 2.2 AA where practical.


Pay particular attention to:


keyboard navigation
focus states
color contrast
labels
form errors
semantic headings
screen-reader usability
reduced motion
touch targets
SEO


Each important service should eventually have its own page.


Use:


descriptive page titles
meta descriptions
canonical URLs
semantic headings
structured data where appropriate
sitemap
robots.txt
internal linking
location-relevant content where truthful


Do not keyword-stuff.


Quality Standard


Do not consider a feature complete merely because the page renders.


A feature is complete when:


it works
it is responsive
it is accessible
it has appropriate validation
it has appropriate error handling
it does not introduce obvious security problems
it does not break existing functionality
tests pass
production build succeeds
Human Authorization


When requirements are ambiguous, stop and ask rather than inventing
business requirements.


When a change could significantly alter architecture, security,
cost, or scope, explain it before proceeding.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
