# VedaVet modular VPS testing — existing React + NestJS + PostgreSQL source

This is the existing Node/PostgreSQL implementation repackaged for module-by-module testing, **not** a certified advanced feature-complete conversion of the latest PHP code. Do not import the PHP MySQL SQL dump into PostgreSQL. Use demo-only data; keep behind access restrictions. Notifications and payment gateway are disabled.

## Deployment
1. On Ubuntu VPS install Docker Engine + Compose plugin and configure firewall. Existing CloudPanel sites (including homestore99.com) must be left untouched.
2. Upload/extract to a new directory outside the active CloudPanel website document root, e.g. `/opt/vedavet-node-test`.
3. `cp .env.vps.example .env`; set strong `DB_PASSWORD`, `JWT_SECRET`, and `FRONTEND_URL=http://localhost:8080` for SSH-tunnel-only testing.
4. `docker compose --env-file .env -f docker-compose.vps.yml config` to validate substitution.
5. `docker compose --env-file .env -f docker-compose.vps.yml up -d --build`
6. `docker compose --env-file .env -f docker-compose.vps.yml ps` and `docker compose --env-file .env -f docker-compose.vps.yml logs --tail=100 backend`
7. Check `http://localhost:8080/api/v1/health` from VPS (e.g. `curl`). Seed only a fresh database: `docker compose --env-file .env -f docker-compose.vps.yml exec backend npm run db:seed`; verify the seed command exists and finishes.
8. Access `localhost:8080` through an SSH tunnel, or configure a dedicated test subdomain and TLS reverse proxy. The web container is intentionally bound to 127.0.0.1:8080; **do not change the existing homestore99.com CloudPanel PHP vhost**.

## Modules to test in order
1. Core: API health, PostgreSQL, seed, staff authentication
2. Staff: role login, branch permissions, add doctor
3. Owner/pet: register owner, pet, barcode/card endpoints
4. Appointments: doctor+branch selection, booking, collision prevention
5. Clinical: OPD records, lab, IPD, OT, prescriptions (confirm actual endpoints; not all workflows complete)
6. Boarding: kennel, reserve, check-in, care logs, checkout, invoice
7. Inventory: pharmacy/lab batches, receipts, deductions and stock history
8. Billing: itemised GST draft, counter payment, invoice PDF, reconciliation report
9. Shop: products, stock, unpaid orders; PHP premium shop UI is *not* included
10. Responsive UI, security and data access checks

A failed test means the function is not yet validated. Full statutory GST accounting and production-grade authorisation require independent review.

## Critical limitations
- Original frontend styling is preserved from the Node source ZIP, NOT the more recent `/beta` PHP fixes. Compare screenshots and port required fixes separately.
- These are shared NestJS routes/models, not independent separately deployable microservices. Do not deploy just one module folder by itself.
- Docker/PostgreSQL full integration tests were **not run in this packaging step**.
- Back up existing database and never use demo login passwords on a public domain.
