# VedaVet — Code Review and Local Test Candidate (20 Oct 2026)

## IMPORTANT — NOT A FINAL PRODUCTION HMS
This is a repackaged, reviewed **existing React + NestJS + Prisma/PostgreSQL development candidate** with the original source and assets. Its archive integrity and bundled JS syntax were checked. No full end-to-end execution against a PostgreSQL database, browser, gateway, or actual hospital workflows has been verified here. It does **not** implement all features approved in the latest discussion. Use fabricated testing data ONLY and avoid public deployment.

## Audited source
Source: `VedaVet_React_Node_PostgreSQL_Branded_VPS_Review.zip` from existing VedaVet attachments. Existing code left unchanged to preserve original project for local comparison. Existing `README_FIRST.md`, `STATUS_AND_TEST_PLAN.md`, and `ENHANCEMENTS_AND_LIMITATIONS.md` also disclose shortcomings.

## Main risk findings — DO NOT BYPASS
1. **Incorrect payment permissions:** `backend/src/routes.ts`, `admin/invoices/:id/payments` currently allows roles `ACCOUNTANT`, `RECEPTION`, `ADMIN`, rather than Cashier with proper reconciliation. There is no dedicated CASHIER role in seeded roles. Do not use the manual-payment endpoint in real operations.
2. **Boarding check-in not payment-gated:** `backend/src/routes.ts`, `admin/boarding/:id/checkin` changes reserved stay to CHECKED_IN without verifying a full paid plan invoice. Current boarding invoice may instead be generated at checkout. This conflicts with the final mandatory plan → invoice → full verified payment → check-in rule.
3. **Grooming full workflow absent:** No demonstrated, verified full grooming plan/payment/check-in/service-completion workflow.
4. **Clinical workflow incomplete:** Signed clinical prescriptions, versioned amendments, lab order → reception invoice → verified payment → signed report → customer release are not demonstrated end to end.
5. **Shared pharmacy/shop catalogue with safe inventory reservation and separate laboratory reagent inventory** not production-verified.
6. **Customer secure portal/app, CMS editing, email/SMS/WhatsApp configurable providers, online payment gateways** not implemented or not demonstrated in this source.
7. **Authorization security:** Remaining endpoints and branch scoping require full review, including own-pet privacy, permissions, password reset and 2FA.
8. **Billing correctness:** Concurrency, payment idempotency, ledger reconciliations, GST/entity configuration and refund process need implementation and accounting validation.
9. **Kennel booking safety:** concurrent kennel overlapping reservations, vaccination/health screening enforcement and actual care/medication logs need testing and hardening.
10. **Demo credentials:** hardcoded local demo passwords and example database secrets. Must be removed/rotated before any internet exposure.
11. **Schema workflow:** Prisma `db push` is for local development; production requires versioned migrations, backups and restore tests.
12. **Test verification:** Archive CRC and JS syntax passed, but npm backend/frontend build, PostgreSQL integration, browser responsiveness and security tests **not run/passed**.

## Local test URLs (once started)
- Public React site: `http://localhost:3000`
- Staff portal demo: `http://localhost:4000/staff/`
- API health: `http://localhost:4000/api/v1/health`
- PostgreSQL: localhost:5432 via local Docker setup
These are local development URLs, NOT production or confirmed VPS routes.

## Intended production URL structure (NOT deployed)
After acquiring/choosing official domain:
- Website `https://<official-domain>/`
- Staff login `https://hms.<official-domain>/login`
- Role dashboards `/super-admin`, `/reception`, `/doctor`, `/billing`, `/accounts`, `/pharmacy`, `/laboratory`, `/ipd`, `/ot`, `/grooming`, `/boarding`, `/shop`, `/inventory`
- Customer portal `https://app.<official-domain>/login`
- API `https://api.<official-domain>/`

## How to test this candidate
Follow `LOCAL_TEST.md` and `README_FIRST.md`. Requires Node.js, npm, Docker/PostgreSQL. Extract the ZIP to a new directory; do not overwrite the existing PHP `/beta/` demo or production website. Run using TEST data. Check the basic site, login, staff portal, owner/pet/branch records, appointment booking, demo shop and early boarding workflows, but never treat a successful demo click as a passed approved-business-rule test.

## Highest priority development backlog
P0: Cashier separation, invoice-first and payment-lock for grooming/boarding, secure pet/owner/branch isolation, Doctor clinical sign-off/versioned prescription, lab workflow and reports, Pharmacy dispensary and shared shop stock, exception/audit trail, database migrations and tests. Then complete CMS, gateways, notifications, customer apps and finance/reporting.

Status: Development candidate for SAFE LOCAL TESTING. Not ready for live hospital or real patient/payment data.
