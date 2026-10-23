# Build status and client demo test checklist

## Present in this ZIP (implementation provided; not end-to-end verified)
- Existing VedaVet frontend and assets preserved; Staff Login link added to navbar.
- Staff password login, role labels, dashboard, branch add/edit, doctors, owners and pets.
- API-connected appointment modal, separate appointment records, basic slot conflict prevention.
- Product listing/cart with unpaid demo orders, basic stock/invoice/manual counter payment records.
- Boarding schema and API: kennels, reservations, branch and pet references, check-in, care logs, checkout generating an invoice.
- Staff portal includes kennel and boarding panels, including check-in/checkout/care log action form.

## Missing before user request can honestly be considered complete
- Secure and complete role/branch authorization on every endpoint, real appointment availability/scheduling, anti-abuse.
- Owner/pet registration with stable barcode and printable/digital cards; proper paperless PDFs and downloads.
- Doctor prescriptions/medical record locking, labs with doctor release, pharmacy prescription dispense with batch/expiry.
- IPD, OT/anaesthesia and proper clinical sign-off; vaccination validation for boarding, longitudinal boarding status tracking portal.
- Full invoice line-item GST calculation, entity/branch sequencing, safe concurrent payment posting and refund workflows.
- E-commerce standalone listing and checkout, shipping and fulfilment, inventory correctness, admin edits on all record types.
- Data validation, audit scope, secure session/storage, migration strategy, backups, security, tests and preview deployment acceptance.
- Notifications and gateway intentionally deferred.

## Safe local testing
1. `docker compose up -d` in root.
2. In backend: copy `.env.example` to `.env`; set local test DB credentials; `npm install && npm run db:generate && npm run db:push && npm run db:seed && npm run dev`.
3. In frontend: `npm install && npm start`.
4. Visit `http://localhost:3000` and use Staff Login -> portal at `http://localhost:4000/staff/` (links on local frontend may need reverse-proxy or hostname setup; use the direct portal URL).
5. Use test data only. Boarding: create kennel -> reserve pet -> check in -> log care -> check out; invoice should be created if schema and API compile successfully.

No automated end-to-end PostgreSQL or web-browser run has passed in this environment. Treat this package as a work-in-progress candidate.
