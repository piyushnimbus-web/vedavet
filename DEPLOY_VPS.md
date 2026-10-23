# VedaVet — Hostinger Ubuntu VPS setup

This is the existing development candidate repackaged for a VPS, **NOT a certified production release**.
The incomplete modules are listed in FEATURE_STATUS.md. Do not put real patient data into it.

1. Install Docker Engine and Docker Compose plugin on Ubuntu via Docker's official instructions. Point your demo domain to the VPS using DNS A record.
2. Upload/extract the package outside your web root, e.g. `/opt/vedavet`. Keep `.env` private.
3. `cp .env.vps.example .env`; set long random `DB_PASSWORD`, `JWT_SECRET`, and `FRONTEND_URL=https://your-demo-domain` (password should use alphanumeric characters to avoid URL encoding problems).
4. `docker compose --env-file .env -f docker-compose.vps.yml up -d --build`
5. Run seed data **only on an isolated test database**: `docker compose --env-file .env -f docker-compose.vps.yml exec backend npm run db:seed`. Seeds create known demo credentials; do not do this on a publicly accessible service.
6. Check `docker compose --env-file .env -f docker-compose.vps.yml ps`; `curl http://127.0.0.1:8080/api/v1/health` and `curl -I http://127.0.0.1:8080/`.
7. Use a HOST-managed reverse proxy with TLS (e.g. Caddy or Nginx + certbot), proxying only `127.0.0.1:8080`; do not expose ports 5432 or 4000. Set firewall SSH/80/443 appropriately.
8. Test every clinical, staff and billing function before sharing a link with your client. Change all seeded passwords, replace weak public endpoints, and undertake a permission/security review.
9. `bash scripts/backup-postgres.sh` makes a local DB dump. Configure offsite encrypted backups and test restores.

## Current limits
- Payment gateway and notifications are excluded deliberately.
- Full OPD, lab, pharmacy stock and GST reconciliation, private owner documents, branch isolation, and full security review are NOT complete in this candidate.
- `prisma db push` is for this demo workflow, not a safe production migration policy. Production needs versioned migrations and a documented rollback strategy.
- Android/iOS apps are future work; a mobile-responsive website does not itself create an APK/IPA.
