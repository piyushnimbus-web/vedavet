# VedaVet Enhancements — Validation Status

Added to existing React/NestJS/PostgreSQL VPS release:
- Automatic Code128 barcode PNG and printable PDF pet ID generated from each unique Pet.petCode. Requires authorised staff JWT.
- Branch-specific pharmacy/lab/shop inventory items, batches, expiry, transactional deductions, movement history.
- Pet vaccination entries for boarding verification; **boarding check-in does not yet enforce vaccination validation automatically**.
- Itemised GST-rate calculations, CGST/SGST/IGST split, invoice PDF and ledger reconciliation PDF. **Legal invoice compliance requires GSTIN, place-of-supply, tax entity configuration, tax accounting reviews and validation**.
- Existing React frontend and booking/shop assets preserved.

IMPORTANT: This is an enhanced development candidate, not a fully functionally tested or production-cleared hospital system. Full pharmacy prescription authorization, lab consumable workflows, secure owner portal, inventory UI coverage, clinical integrations, financial concurrency, GST law checks, comprehensive permissions and end-to-end tests remain. No notifications/payment gateway implemented.

## Local & VPS
Follow LOCAL_TEST.md or DEPLOY_VPS.md. Run database schema migration with Prisma (currently `prisma db push` for development). For a live production database use reviewed migrations and backups. Never deploy demo accounts/passwords to the internet.

## New API endpoints
GET /api/v1/admin/pets/:id/barcode
GET /api/v1/admin/pets/:id/id-card.pdf
POST /api/v1/admin/pets/:id/vaccinations
GET /api/v1/admin/pets/:id/vaccinations
GET/POST /api/v1/admin/inventory/items
POST /api/v1/admin/inventory/batches
POST /api/v1/admin/inventory/dispense
GET /api/v1/admin/inventory/movements
POST /api/v1/admin/billing/itemized
GET /api/v1/admin/invoices/:id/pdf
GET /api/v1/admin/billing/reconciliation
GET /api/v1/admin/billing/reconciliation.pdf

All these endpoints use staff JWT; most also enforce department roles and branch membership.
