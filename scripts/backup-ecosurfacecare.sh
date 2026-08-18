#!/usr/bin/env bash

set -euo pipefail

# ============================================================
# EcoSurfaceCare Backup Script
#
# Backs up:
#   1. Cloudflare D1 database
#   2. Cloudflare R2 bucket
#
# Credentials are loaded from:
#   ~/.config/ecosurfacecare/backup.env
#
# Actual backups are stored outside the Git repository:
#   ~/ecosurfacecare-backups/
# ============================================================


# ------------------------------------------------------------
# Configuration
# ------------------------------------------------------------

ENV_FILE="$HOME/.config/ecosurfacecare/backup.env"

BACKUP_ROOT="$HOME/ecosurfacecare-backups"

D1_DIR="$BACKUP_ROOT/d1"
R2_ROOT="$BACKUP_ROOT/r2"

DATABASE_NAME="ecosurfacecare-db"

R2_REMOTE="ecosurfacecare-r2"
R2_BUCKET="ecosurfacecare-quotes"

DATE="$(date +%F_%H-%M-%S)"

D1_FILE="$D1_DIR/ecosurfacecare-d1-$DATE.sql"
R2_DIR="$R2_ROOT/$DATE"


# ------------------------------------------------------------
# Load private credentials
# ------------------------------------------------------------

if [[ ! -f "$ENV_FILE" ]]; then
  echo
  echo "ERROR: Backup credentials file was not found:"
  echo "$ENV_FILE"
  echo
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"


# ------------------------------------------------------------
# Validate Cloudflare token
# ------------------------------------------------------------

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo
  echo "ERROR: CLOUDFLARE_API_TOKEN is not configured."
  echo
  exit 1
fi


# ------------------------------------------------------------
# Start
# ------------------------------------------------------------

echo
echo "=========================================="
echo " EcoSurfaceCare Backup"
echo "=========================================="
echo
echo "Backup timestamp: $DATE"
echo


# ------------------------------------------------------------
# Create backup directories
# ------------------------------------------------------------

mkdir -p "$D1_DIR"
mkdir -p "$R2_DIR"


# ------------------------------------------------------------
# 1. D1 Backup
# ------------------------------------------------------------

echo "1/2 Backing up D1 database..."
echo

npx wrangler d1 export "$DATABASE_NAME" \
  --remote \
  --output="$D1_FILE"

if [[ ! -s "$D1_FILE" ]]; then
  echo
  echo "ERROR: D1 backup file is missing or empty."
  exit 1
fi

echo
echo "D1 backup completed successfully."
echo


# ------------------------------------------------------------
# 2. R2 Backup
# ------------------------------------------------------------

echo "2/2 Backing up R2 bucket..."
echo

rclone copy \
  "$R2_REMOTE:$R2_BUCKET" \
  "$R2_DIR" \
  --s3-no-check-bucket \
  --progress

echo
echo "R2 backup completed successfully."
echo


# ------------------------------------------------------------
# Backup verification
# ------------------------------------------------------------

D1_SIZE="$(
  du -h "$D1_FILE" |
  cut -f1
)"

R2_SIZE="$(
  du -sh "$R2_DIR" |
  cut -f1
)"

R2_FILES="$(
  find "$R2_DIR" \
    -type f |
  wc -l
)"


# ------------------------------------------------------------
# Summary
# ------------------------------------------------------------

echo
echo "=========================================="
echo " Backup Summary"
echo "=========================================="
echo

echo "D1 database:"
echo "  File: $D1_FILE"
echo "  Size: $D1_SIZE"

echo

echo "R2 storage:"
echo "  Directory: $R2_DIR"
echo "  Files: $R2_FILES"
echo "  Size: $R2_SIZE"

echo
echo "=========================================="
echo " BACKUP COMPLETED SUCCESSFULLY"
echo "=========================================="
echo
