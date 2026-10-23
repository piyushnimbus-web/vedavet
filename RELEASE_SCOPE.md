# Release scope and verification status

Package architecture: original VedaVet React/Webpack frontend, NestJS Node.js backend, Prisma/PostgreSQL 16, static staff portal, Docker Compose for local and Hostinger VPS.

**Existing feature code:** basic staff login and roles, branch/doctor/pet and owner records, booking form, shop starter, basic invoices/counter payments, boarding stays/check-in/care logs/checkout, early-stage consultations, prescriptions, lab orders, admissions and surgeries.

**Still NOT verified or complete:** production-grade department interfaces and permissions, robust pharmacy batches/dispensing/expiry and stock locking, correct itemised GST computation and reconciliation, vaccination gate and overlapping-kennel transactional checks, secure owner portal, branded downloadable protected PDF files, full database integration tests, mobile-browser coverage, full backup restore and security validation.

Notifications and payment gateway were intentionally excluded at the user's request. No mobile APK or iOS app is included.

Delivering the code archive **does not** mean the eight advanced acceptance criteria have passed. Do not collect real pet/owner/patient records on a public demo without security review.
