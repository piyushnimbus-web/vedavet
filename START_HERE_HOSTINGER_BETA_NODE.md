# VedaVet — Hostinger /beta/node/ Development Staging (NOT all-modules-complete)

**IMPORTANT:** This ZIP DOES NOT satisfy the requirement that every HMS module already works. It is a modified existing development candidate for *restricted staging evaluation*. Do not use with real hospital records, real payments or customer accounts, and do not advertise it as production ready. Payment gateway and notifications remain excluded.

## Changes in this package
- Browser asset and portal paths adjusted for `/beta/node/`.
- Docker frontend binds to host `127.0.0.1:18080` (not public internet); PHP site under `/beta/` remains untouched if reverse proxy is configured correctly.
- Dedicated `CASHIER` role added to basic staff creation and demo seed. Manual payment endpoint no longer grants access to Reception. **This is only a partial payment-security fix: real UPI/POS verification, concurrency-safe ledger and shift reconciliation are incomplete.**
- Boarding now raises a basic plan invoice on reservation, normal check-in checks full-paid status, and checkout reuses the original invoice rather than generating the original charge again. **This does not implement complete packages, extension charging, clinical eligibility, concurrency safety or exception workflows.**
- Removed prefilled demo login credentials from portal HTML (seed still uses known demo accounts: **DO NOT seed on publicly accessible installations**).

## URL plan
Public site `https://homestore99.com/beta/node/`
Staff login `https://homestore99.com/beta/node/staff/`
API health `https://homestore99.com/beta/node/api/v1/health`
Shop `https://homestore99.com/beta/node/shop/`

## VPS deployment (Ubuntu/CloudPanel + Docker required)
1. Backup existing `/beta/` files and database. **Do not extract over the PHP site.**
2. Install/configure Docker Engine + Compose separately (with explicit consent), and copy this ZIP to `/opt/vedavet-node-staging`, outside webroot.
3. Copy `.env.vps.example` to `.env` and configure strong `DB_PASSWORD`, `JWT_SECRET`, `FRONTEND_URL=https://homestore99.com`. Never use real customer data.
4. Run `docker compose -f docker-compose.vps.yml --env-file .env up -d --build`.
5. In CloudPanel-managed Nginx *appropriate vhost*, configure the `/beta/node/` location to proxy to `http://127.0.0.1:18080/` with the prefix stripped. Back up vhost config and validate with `nginx -t` before reload; do not replace entire CloudPanel vhost. See `CLOUDPANEL_LOCATION_SNIPPET.conf`.
6. Test `/beta/node/`, `/beta/node/staff/` and `/beta/node/api/v1/health`; login only through VPN or allowlisted IP until authentication and access controls are hardened.
7. **Do not run demo seed on an internet-visible instance.** Provision test users safely using a private restricted environment.

## What still does not work end-to-end
- Full Super Admin user-limit/password-management/CMS/revenue+expense dashboard; full Reception token/barcode records/checkout; complete Grooming flows; Doctor staged Rx and versioned issuance; doctor→lab→reception billing→approved reports→customer app; pharmacy/shop synchronised batch inventory; complete IPD/OT; customer authenticated portal/app; staff branch scoping for all resources; payment verification and complete financial audit.
- Public booking and public shop data paths need a security audit and end-to-end test; notifications/payment gateways intentionally excluded.
- No successful full Docker build, browser/UAT or VPS runtime test is claimed.

**Bottom line:** /beta/node path support does not equal a finished HMS. Completion requires implementing and validating the above modules.
