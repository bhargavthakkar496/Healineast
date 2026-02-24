
# HealinginEast – Medical Tourism Aggregator (MVP)

MVP for **HealinginEast**: compare **NABH/JCI** hospitals across **India, Nepal, UAE, Russia**, request quotes, generate medical visa checklists, and manage a simple itinerary with a demo deposit flow (Razorpay stub) and WhatsApp click-to-chat.

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
- Razorpay keys for production; this MVP uses a **mock order** API.

## Integrations (stubs & guidance)
### Razorpay (to implement)
- Create order server-side using `RAZORPAY_KEY_ID/SECRET` (auth: Basic, body: amount*100 in INR or chosen currency, receipt, etc.).
- Initialize Checkout on client using `NEXT_PUBLIC_RAZORPAY_KEY_ID` and the order id.
- Handle webhooks for payment success/failure and update booking/escrow state.

### WhatsApp Business (click-to-chat)
- We surface a floating button using `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- For programmatic messaging, set up the **WhatsApp Business Platform (Cloud API)** and send alerts server-side upon quote creation.

## Roadmap (≤ 2 months)
**Week 1–2 – Discovery & Design**: content, branding polish, provider onboarding, data model, consent & privacy copy.
**Week 3–4 – Core Build (MVP Alpha)**: Auth, DB schema, real quotes persistence, provider portal (catalog + KYC), Razorpay sandbox checkout.
**Week 5–6 – E2E Flows**: Visa workflow (server-driven), itinerary builder, uploads with signed URLs (Azure Blob), WhatsApp message on events.
**Week 7–8 – Hardening & Launch**: SEO (schema.org for Hospital/Physician/MedicalProcedure), accessibility pass (WCAG 2.2 AA), observability, UAT, go-live.

## Notes
- All provider entries in mock data are tagged JCI/NABH to respect compliance posture.
- Replace mock payment route with real Razorpay API and secure secrets in env/Key Vault.
- Add RBAC, audit logs, consent logs before handling PHI at scale.
