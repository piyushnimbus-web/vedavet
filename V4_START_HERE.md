# VedaVet V4 — Doctor OPD → Lab Billing → Report Review

## New V4 workflow
1. Doctor creates a consultation and orders test with optional `urgency` and `clinicalReason`.
2. Lab staff marks pet as arrived: POST `/api/v1/clinical/labs/:id/arrive`.
3. Reception creates the lab invoice: POST `/api/v1/clinical/labs/:id/invoice` with `{ "amount": <approved-price> }`. **Current price is manually entered; test catalogue and centrally controlled price lookup are NOT implemented.**
4. Cashier collects verified counter payment via the V3 Cashier Desk.
5. Lab starts test: POST `/api/v1/clinical/labs/:id/start`. Server enforces fully-paid linked invoice.
6. Lab records findings: POST `/api/v1/clinical/labs/:id/result` with `{ "findings": {"notes":"..."} }`.
7. Doctor/authorised existing admin account releases result: POST `/api/v1/clinical/labs/:id/release`.
8. Doctor acknowledges released report: POST `/api/v1/clinical/labs/:id/review` with `{ "notes":"Clinical review..." }`.

UI: Staff Portal > Laboratory Orders has manual-ID forms for these actions. It's an early operational test UI, not final UI or clinically validated result reporting.

## VPS deployment and migration
- Use only `/beta/node/` in a protected staging installation, with **test database**. Do not overwrite the PHP `/beta/` application.
- V4 changes Prisma `LabOrder` schema; **backup PostgreSQL** before deployment. Current Dockerfile startup runs `prisma db push` (development mechanism, not a reviewed production migration). Verify schema changes and reconcile existing data before any deployment with historical records.
- Replace prior V3 extracted source with V4 after securing backup; use the included `docker-compose.vps.yml` and `.env.vps.example` per existing `START_HERE_HOSTINGER_BETA_NODE.md`.
- Example expected routes: `/beta/node/`, `/beta/node/staff/`, `/beta/node/api/v1/health`.
- V3 role configurations and demo data are carried over; ensure real staff accounts, branch assignments and secrets are set securely.

## Essential test cases
1. Doctor logs in, adds a consultation and orders CBC.
2. Lab opens Laboratory Orders, marks arrival.
3. Reception generates one invoice against the order. Try repeated invoice action: should reject.
4. Lab attempts Start before payment: should return HTTP 409.
5. Cashier pays invoice in full via V3 counter screen; confirm PAID.
6. Lab starts test, then enters result. Try result before processing: should reject.
7. Authorised Doctor releases report and later acknowledges with notes.
8. Check logged-in user branch isolation and audit entries.
9. Verify unrelated Lab order cannot be accessed cross-branch.

## Known limits / outstanding
- This is an **incremental V4 testing candidate**; do not label the entire HMS complete or production-ready.
- Existing app has no complete catalogue-backed lab pricing, sample barcode, lab inventory consumption, customer mobile portal, or reliable lab result PDF delivery.
- Existing prescription issuing API does not enforce the agreed OPD-payment gate. Do not use for real clinical workflows.
- `REPORT RELEASED` visibility is via staff API; **Customer App publication remains pending**.
- Existing branch authorisation and sensitive clinical record access require deeper security audit.
- Live server, PostgreSQL, end-to-end browser and Docker builds have **not** been verified here.
- Payment Gateway and notifications intentionally deferred as requested.
