# Requires Docker Desktop and PowerShell
if (-not (Test-Path '.env')) { Copy-Item '.env.vps.example' '.env'; Write-Host 'IMPORTANT: Edit .env secrets and FRONTEND_URL before continuing'; exit 1 }
docker compose --env-file .env -f docker-compose.vps.yml up -d --build
Write-Host 'Open http://localhost:8080 after editing FRONTEND_URL in .env to http://localhost:8080'
