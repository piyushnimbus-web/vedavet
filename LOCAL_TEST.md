# VedaVet local Docker testing

Requirements: Docker Desktop (Windows/macOS) or Docker Engine with Compose (Linux).

1. Copy `.env.vps.example` to `.env` and set long random `DB_PASSWORD`, `JWT_SECRET`, `FRONTEND_URL=http://localhost:8080`.
2. From the extracted root run `docker compose --env-file .env -f docker-compose.vps.yml up -d --build`.
3. If using fake demo data on a private machine only, run `docker compose --env-file .env -f docker-compose.vps.yml exec backend npm run db:seed`.
4. Open `http://localhost:8080/` for the website, `http://localhost:8080/staff/` for staff, and `http://localhost:8080/api/v1/health` for API health.
5. Follow logs with `docker compose --env-file .env -f docker-compose.vps.yml logs -f backend`.
6. Stop with `docker compose --env-file .env -f docker-compose.vps.yml down`; do not use `down -v` unless you deliberately want to DELETE the database volume.

No end-to-end execution against PostgreSQL has been proven in this delivery environment. This is a deploy/test candidate, not a fully accepted release.
