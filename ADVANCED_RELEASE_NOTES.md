# VedaVet advanced web demo — development candidate

## What changed in this revision
- Preserved supplied React/Webpack homepage, graphics, branding and footer.
- Kept homepage Staff Login link, booking action, and pet-shop demo hooks.
- Expanded Prisma schema for consultations, prescriptions, lab orders, inpatient admissions, surgeries, paperless clinical-document records and invoice line items.
- Added authenticated clinical API with branch restrictions, consultation draft/final, prescription issue, laboratory results & doctor release, admissions/discharge, OT scheduling/update and clinical document creation.
- Added mobile-responsive web UI for new department modules and browser-printable clinical document preview.
- Existing boarding, care logs, check-in/checkout, invoice creation, inventory/shop and manual-counter billing remain part of the package.
- Provider notifications, email/SMS/WhatsApp OTP, online payment gateway, native iOS and Android builds are NOT included.

## IMPORTANT HONEST STATUS
This ZIP is **not yet a complete, production-ready veterinary hospital system**. It is a development candidate assembled from the prior demo starter. This environment did not have node_modules, a running PostgreSQL database, or a working dependency download, so there has been **no integrated build or database runtime test**. Do not import real client or patient data, publish demo passwords or deploy publicly without security review.

Still needed before client-facing testing: mature branch-scoped authorisation for all endpoints, account credential hardening, controlled patient portal access, doctor slot schedules, medicine-specific stock/batch dispensing, robust invoice tax/item calculation, document PDF storage/signature, boarding vaccination and kennel concurrency checks, clinical record correction workflow, stock/order reconciliation, complete test suite, migrations and deployment smoke tests. A responsive web app is not automatically an APK or iOS app; later packaging/review is required.

## Running locally
1. Install Node.js 22, Docker Desktop.
2. `docker compose up -d`
3. `cd backend && cp .env.example .env && npm install && npm run db:generate && npm run db:push && npm run db:seed && npm run dev`
4. In a separate terminal: `cd frontend && npm install && npm start`
5. Website http://localhost:3000 ; staff portal http://localhost:4000/staff/ (on local frontend, use explicit http://localhost:4000/staff/)
6. Verify all API endpoints with user roles and manual walkthroughs. No payments/emails will be sent.

## Hostinger
A Hostinger VPS or suitable separately hosted Node.js + PostgreSQL backend is required. **Do not upload this project as a public_html ZIP on basic shared hosting.** See HOSTINGER_VPS_SETUP.md. Do not deploy until an authorised staging installation passes end-to-end security and workflow tests.
