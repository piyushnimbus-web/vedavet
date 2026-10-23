# VedaVet — Hostinger VPS demo deployment candidate (NOT READY FOR PUBLIC/CLIENT LIVE USE)

## Critical compatibility
This project is **NestJS + Prisma + PostgreSQL**, with a React/Webpack public website. Hostinger **Premium/Shared web hosting** with `public_html` alone cannot deploy this full stack with these scripts. Use a VPS with SSH, Node.js, PostgreSQL, Nginx, TLS and a process manager. Do NOT upload the ZIP to public_html expecting the hospital backend to run. If only shared hosting is available, stop: architecture/hosting must be changed or a separate backend VPS obtained.

## Preview safely
Use Docker Desktop, Node.js 20/22, and the setup commands in `README_FIRST.md` to run locally. Do not use this package with real patient or payment data.

## Components
- `frontend` — preserved VedaVet homepage and images; booking integration, shop modal and added Staff Login/Shop links.
- `backend` — NestJS API, staff portal, PostgreSQL Prisma models, seed data, boarding reservation/check-in/care log/checkout draft APIs.
- `docker-compose.yml` — local-only PostgreSQL container.

## Example VPS layout / high-level steps (after security and feature completion)
1. Provision Ubuntu VPS with Node.js 22, PostgreSQL 16, Nginx, firewall and TLS, plus regular encrypted backups.
2. Store project at `/srv/vedavet/` outside the web root. Never expose `.env` or database files through Nginx.
3. Provision PostgreSQL roles/database; set `DATABASE_URL` and generate a strong unpredictable `JWT_SECRET` in `backend/.env`; use separate test credentials and no public demo passwords.
4. Run `npm ci` (or `npm install` if lockfile absent), `npx prisma generate`, schema migrations, seed **test-only** records, and `npm run build` inside backend. Use a process manager to keep `node dist/main.js` running on `127.0.0.1:4000`.
5. Run `npm install && npx webpack --mode production` inside frontend. Copy `frontend/dist` HTML/JS and `frontend/public/images`, `frontend/public/vedavet-local.js`, `frontend/public/vedavet-local.css`, `frontend/public/shop/` into the public static site root. Verify scripts/assets paths.
6. Reverse proxy `/api/v1/` and `/staff/` to `http://127.0.0.1:4000` in Nginx, and serve the built React website at `/`. Backend CORS must be restricted to the approved demo domain.
7. Configure HTTPS, private PDF storage, per-role permissions, backups, logging and monitoring before connecting a real client.

## Important missing/incomplete before public testing
**NOT** a completed system. No provider notifications or online gateway. The staff portal is demo-grade, some APIs accept loosely validated requests, and several are not hardened for cross-branch access. Care log APIs and checkout create invoice records but do not provide complete animal boarding clinical protocols, financial reconciliation, automatic taxes or client-facing tracking. Paperless branded PDFs, vaccination verification, surgery/anaesthesia, lab approval, robust pharmacy batches, owner authentication, GST-compliant ledgers, production-ready shop checkout, full branch constraints and user acceptance tests remain incomplete. Do not expose the system on an Internet-facing demo domain without security review and finishing the modules.

**No live deployment was performed.**
