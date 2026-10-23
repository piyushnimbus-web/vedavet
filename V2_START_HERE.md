# VedaVet V2 — Super Admin & Reception functional extension

**Restricted Hostinger VPS staging build. Not production-ready. Do not enter real patient records or payment details.**

## What is genuinely added in V2 source
- Owner-only aggregate dashboard endpoint `GET /api/v1/operations/super-admin/overview` and UI page `Owner Business Overview`: branches, staff, owner/pet counts, visits, billed/collected/outstanding totals and branch aggregates. **Not a full profit/loss report**.
- Super Admin branch staff limit `PATCH /api/v1/operations/super-admin/branches/:id/user-limit`; staff creation attempts are blocked at configured active account limit.
- Super Admin staff password reset endpoint and UI. Password policy: at least 12 characters, uppercase, digit and special symbol. **Existing JWT tokens are not yet revoked automatically**.
- Reception pet ID / owner name / mobile search and ID card print from existing API.
- New Reception visit check-in and per-branch daily token (`Visit` table), active-visit duplicate check and operational summary.
- Reception visit statuses `WAITING`, `IN_PROGRESS`, `READY_CHECKOUT`; **final checkout intentionally blocks** until full clearance workflow exists.
- Original PHP `/beta/` is not part of this package.

## Existing modules retained; not fully completed
Doctor staged Rx + amendment, lab->billing->report release, shared pharmacy/shop inventory, grooming packages + payment-before-check-in, IPD/OT, Customer App, financial reconciliation, multi-branch privacy isolation in all legacy endpoints, complete website CMS, audit-grade session revocation, treatment-related controlled exceptions. Payment gateway and notifications are intentionally deferred. Do **not** infer these are working from menu items.

## Paths
- Public website: https://homestore99.com/beta/node/
- Staff login: https://homestore99.com/beta/node/staff/
- API: https://homestore99.com/beta/node/api/v1/health
- New APIs: /beta/node/api/v1/operations/...

## Deployment and migration caution
1. **Backup** all current files, existing database and Nginx config. Do not overwrite `/beta/`.
2. Deploy only under separate `/opt/vedavet-node-staging/` path, proxy `/beta/node/` as in `START_HERE_HOSTINGER_BETA_NODE.md`.
3. `Branch.userLimit` and `Visit` are **new schema fields/models**; Prisma migration / db push runs in Docker image startup. Test against an isolated staging PostgreSQL database, **not any existing real database**.
4. Do not use demo seed accounts on a public endpoint. Enforce IP allowlisting/VPN for staging.
5. Actual NestJS/Prisma build, schema migration, browser E2E and VPS runtime could not be completed in this authoring environment: npm registry dependencies were unavailable offline. Only JS syntax and ZIP integrity have been checked.
6. If build fails, capture `docker compose -f docker-compose.vps.yml logs --tail=150 backend` and `frontend` logs. Do not call it fully working until acceptance tests pass.

## Important clinical/security caveats
- Legacy pet lookup and master owner data may not be branch-isolated; keep this restricted to synthetic data until fixed.
- This stage does not implement the final cashier-only payment system with real UPI/POS validation, transaction-safe settlement and all clearance locks.
- Staff reset does not force session invalidation; must be added before production.
