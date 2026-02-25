
# HealinginEast – Medical Tourism Aggregator (MVP)

MVP for **HealinginEast**: compare **NABH/JCI** hospitals across **India, Nepal, UAE, Russia**, request quotes, generate medical visa checklists, and manage a simple itinerary with integrated Razorpay checkout and WhatsApp Business notifications.

## Focus Scope
- Markets (sources): Africa, SAARC (incl. Nepal), Russia, Middle East
- Destinations: India, Nepal, UAE, Russia
- Specialties: **Cardiac**, **Cosmetics**, **Fertility**, **Oncology**
- Compliance posture: Partner **only** with **NABH/JCI** hospitals and doctors
- Monetization: **Mix** (commission + service fees + subscriptions)

## Tech
- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS

## Run locally
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Environment
Copy and edit `.env.example` → `.env.local`.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` → e.g., `919999999999`
- Razorpay keys for server-side order creation + checkout.


## Authentication (implemented)
- `POST /api/auth/signup`: validates input, hashes password with `scrypt`, stores user record in `data/users.json`, and creates an HTTP-only session cookie.
- `POST /api/auth/signin`: verifies existing account password and creates an HTTP-only session cookie.
- `POST /api/auth/signout`: clears the session cookie.
- `GET /api/auth/session`: returns current authenticated user based on the session cookie.
- `/dashboard` now requires a valid session; unauthenticated users are redirected to `/auth`.

> Important: current user storage is file-based for MVP/local usage. In production/serverless, set `AUTH_USERS_FILE` to a writable path (for example `/tmp/healineast-users.json`) and use a strong `AUTH_SESSION_SECRET`. For scale and reliability, move users to a real database (Postgres/MySQL).
> Important: current user storage is file-based for MVP/local usage. For production, move users to a database (Postgres/MySQL) and rotate `AUTH_SESSION_SECRET`.

## Integrations (stubs & guidance)
### Razorpay (integrated)
- `/api/payments/razorpay/order` now creates real Razorpay orders using `RAZORPAY_KEY_ID/SECRET`.
- `PayDepositButton` dynamically loads Razorpay Checkout and opens payment UI with the returned order id (visible on `/dashboard`).
- Next step: add webhook verification (`payment.captured`, `payment.failed`) and persist transaction state.

### WhatsApp Business
- We still provide click-to-chat via floating button and `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- Quote submissions from treatment cards now trigger backend quote API and can send **WhatsApp Cloud API template messages** when Cloud API env vars are configured (`WHATSAPP_CLOUD_*`).
- Next step: persist quote ids and include them in template variables for support workflows.

## Roadmap (≤ 2 months)
**Week 1–2 – Discovery & Design**: content, branding polish, provider onboarding, data model, consent & privacy copy.
**Week 3–4 – Core Build (MVP Alpha)**: Auth, DB schema, real quotes persistence, provider portal (catalog + KYC), Razorpay sandbox checkout.
**Week 5–6 – E2E Flows**: Visa workflow (server-driven), itinerary builder, uploads with signed URLs (Azure Blob), WhatsApp message on events.
**Week 7–8 – Hardening & Launch**: SEO (schema.org for Hospital/Physician/MedicalProcedure), accessibility pass (WCAG 2.2 AA), observability, UAT, go-live.

## Notes
- All provider entries in mock data are tagged JCI/NABH to respect compliance posture.
- Replace mock payment route with real Razorpay API and secure secrets in env/Key Vault.
- Add RBAC, audit logs, consent logs before handling PHI at scale.
