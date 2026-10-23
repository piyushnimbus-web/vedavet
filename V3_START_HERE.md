# VedaVet V3 — Central Cashier & Invoice Safety Increment

## Source changes over V2
- Cashier Desk in staff portal for CASHIER, ACCOUNTANT, branch ADMIN and SUPER_ADMIN.
- API GET `/api/v1/operations/billing/cashier-overview`: branch-filtered newest 150 invoices, collected/billed/due totals. This is **not** a complete accounting report.
- Restricted cashier payment POST preserves CASHIER/ACCOUNTANT permission, checks branch access and remaining balance.
- Server-side serializable transaction re-reads current invoice, prevents concurrent overpayments. Unique reference check within payment transaction; external bank verification still manual.
- UPI/Card counter payment requires a verified UTR/POS reference; cashier must check external bank/POS success first. Cash reference optional.
- Invoice screen hides payment controls for Reception role.
- Existing Super Admin / Reception V2 components preserved.

## Limitations / Not Production Ready
- No payment gateway verification; cashier recording UPI/card is **staff attestation**, not bank API verification.
- This stage does NOT deliver completed Doctor, Lab, Grooming, Pharmacy, Customer App, unified checkout or complete GST/accounting.
- Existing historical API endpoints need wider branch-isolation/security audit.
- No live VPS, Docker or Postgres tests completed in this environment.

## Deploy target
`https://homestore99.com/beta/node/` using existing V2 instructions. Keep old `/beta/` PHP system untouched. Use a dedicated TEST database, secure staging and synthetic data.

## Manual testing
1. Login as CASHIER, open Cashier Desk.
2. Create sample invoice from authorised Reception.
3. Check invoice in Cashier Desk.
4. Pay partly in cash, verify PARTIAL, then pay remaining, verify PAID.
5. Attempt overpayment, should return 409.
6. Attempt same UPI/POS reference twice, should return 409.
7. Login as RECEPTION, check payment action unavailable and payment API responds 403.
8. Confirm boarding still blocks check-in until PAID.
9. Check branch separation and audit events.
