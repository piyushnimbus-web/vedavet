#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p backups
docker compose --env-file .env -f docker-compose.vps.yml exec -T postgres sh -c 'exec pg_dump -U vedavet -d vedavet -Fc' > "backups/vedavet-$(date +%Y%m%d-%H%M%S).dump"
echo 'Backup file saved. Test restores on a separate environment.'
