# VedaVet local development package (NOT production ready)

This package uses your uploaded **React/Webpack project** and its approved VedaVet homepage HTML, images and styles. It adds two scripts to the homepage: the appointment modal and the demo Shop. No live website has been modified.

This is a **functional local integration starter**, NOT the finished 18-module hospital management system. The full clinical workflows, formal document generation, reconciliation, comprehensive permissions, tax compliance and security hardening require additional implementation and validation. The backend includes a starting set of tables for hospital modules and demo data, not every clinical table required for production.

## Requirements on Windows
- Node.js 20 or 22 and npm
- Docker Desktop, running (for PostgreSQL). Alternative: local PostgreSQL 16 and set DATABASE_URL accordingly.
- PowerShell

## Start database
Open PowerShell in the extracted `vedavet_local_test` folder:

```powershell
docker compose up -d
```

## Start backend
Open a second PowerShell terminal:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Local API health: http://localhost:4000/api/v1/health
Local staff portal: http://localhost:4000/staff/

## Start existing frontend
Open another PowerShell terminal from the root folder:

```powershell
cd frontend
npm install
npm start
```

Local VedaVet website: http://localhost:3000

The original homepage will be visible, including its existing images and approved design. Click its **Book Appointment** buttons for the new API-based booking test. Use the floating **Shop** link at bottom-right or the original Shop text link to open the new products/cart/order demo.

## Demo staff login
- Super admin: `super_admin@vedavet.local` / `VedaVet@123!`
- Other accounts: `admin@vedavet.local`, `doctor@vedavet.local`, `reception@vedavet.local`, `lab@vedavet.local`, `pharmacy@vedavet.local`, `ipd_ot@vedavet.local`, `boarding@vedavet.local`, `accountant@vedavet.local`, `shop_manager@vedavet.local` (same demo password).
- These passwords are insecure demo credentials. DO NOT deploy publicly.

## Test workflows
1. Sign in as Super Admin. Dashboard and branch/doctor/staff/master-data screens are database-backed.
2. From the existing React homepage, book an appointment using a future date. Refresh staff portal Appointments to see it.
3. Open Shop, add items, and create a **test unpaid** order. Refresh staff portal Orders to see it.
4. Add a branch from the Super Admin screen; it appears in the booking branch dropdown. Add a doctor assigned to that branch.
5. Invoices have a database model and accept counter payments using the API (see below); gateway is disabled.
6. Edit demo doctors, owners, services, cases and shop products from the portal.

## Test manual cash payment (API)
Sign in through `POST /api/v1/auth/login`, copy returned bearer token, and find invoice ID in staff portal. Call:

```http
POST http://localhost:4000/api/v1/admin/invoices/INVOICE_ID/payments
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{"amount":100,"method":"CASH"}
```

Permitted payment methods are `CASH`, `UPI_COUNTER`, `CARD_COUNTER`. No online charges or external messages are sent.

## Current limitations: important
- The public booking form uses unverified contact information; no email/SMS/WhatsApp verification, as requested. Add anti-spam, scheduling controls and privacy notices before launch.
- Doctors' availability shows basic seeded doctors and future times, with unique-slot protection. Full leave/schedule rules are not implemented.
- Shop orders are test **UNPAID** records that reduce stock. This is not a production checkout, fulfillment, or reservation-expiration system.
- Clinical cases are generic records with a type field; full signed prescriptions, surgery notes, laboratory approval, controlled amendments, pharmacy dispensing, PDF generation and IPD/OT care plans are not yet implemented.
- Role and branch checks exist on key staff endpoints; cross-branch owner/pet/order read scopes, full permissions and more granular per-department security need hardening.
- Taxes/GST are not computed; invoice amount is manually entered. Multi-GST-entity invoicing and serial-number concurrency require design and review by accounting professionals.
- Staff portal is a plain JS demo, visually themed to the navy VedaVet palette; it is **not yet a production React admin UI**. The public site remains the original design.
- File storage, daily backups, financial ledgers, return/refund approvals, extensive E2E tests, and other promised production modules are incomplete.
- Frontend CDN assets require internet access; Webpack dev server provides image assets from `public/images`.
- Passwords, CORS, authentication, rate limits, validations, and all endpoints must be hardened before any production use.
- Do not deploy. Nothing in this project will modify your live website automatically.

## Source folders
`frontend/` original React/Webpack source, homepage HTML and assets with local integration script
`backend/` NestJS REST server, PostgreSQL Prisma models and seed script, staff demo portal
`docker-compose.yml` local PostgreSQL

## What comes next
Approve each complete department workflow and design before treating this package as production ready. After core workflows are complete, add notification gateway, payment gateway, then mobile apps using the same APIs.
