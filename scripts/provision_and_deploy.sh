#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   bash scripts/provision_and_deploy.sh \
#     bold-azimuth-468606-c4 \
#     "/home/lenovo/Downloads/bold-azimuth-468606-c4-firebase-adminsdk-fbsvc-beff5c64e5.json" \
#     "change-this-secret" \
#     ""    # optional OPENAI key

PROJECT_ID=${1:-}
SERVICE_ACCOUNT_JSON=${2:-}
JWT_SECRET_VALUE=${3:-}
OPENAI_KEY_VALUE=${4:-}

if [[ -z "${PROJECT_ID}" || -z "${SERVICE_ACCOUNT_JSON}" || -z "${JWT_SECRET_VALUE}" ]]; then
  echo "Usage: $0 <PROJECT_ID> <SERVICE_ACCOUNT_JSON_PATH> <JWT_SECRET> [OPENAI_API_KEY]" >&2
  exit 1
fi

command -v gcloud >/dev/null 2>&1 || { echo "gcloud is required. Install Google Cloud SDK." >&2; exit 1; }
command -v npx >/dev/null 2>&1 || { echo "npx is required. Install Node.js 18+." >&2; exit 1; }

echo "==> Verifying gcloud authentication"
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q "@"; then
  echo "No active gcloud account. Running 'gcloud auth login'..."
  gcloud auth login
fi

echo "==> Setting project: ${PROJECT_ID}"
gcloud config set project "${PROJECT_ID}"

echo "==> Enabling required APIs"
gcloud services enable \
  iam.googleapis.com \
  cloudfunctions.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  firebaserules.googleapis.com \
  firebasestorage.googleapis.com \
  firebaseextensions.googleapis.com \
  firestore.googleapis.com >/dev/null

SA_NAME="functions-exec"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "==> Ensuring service account exists: ${SA_EMAIL}"
if ! gcloud iam service-accounts list --format="value(email)" | grep -q "^${SA_EMAIL}$"; then
  gcloud iam service-accounts create "${SA_NAME}" --display-name="Cloud Functions Runtime"
fi

echo "==> Granting roles to ${SA_EMAIL}"
gcloud projects add-iam-policy-binding "${PROJECT_ID}" --member="serviceAccount:${SA_EMAIL}" --role="roles/datastore.user" >/dev/null
gcloud projects add-iam-policy-binding "${PROJECT_ID}" --member="serviceAccount:${SA_EMAIL}" --role="roles/storage.objectAdmin" >/dev/null
gcloud projects add-iam-policy-binding "${PROJECT_ID}" --member="serviceAccount:${SA_EMAIL}" --role="roles/logging.logWriter" >/dev/null
gcloud projects add-iam-policy-binding "${PROJECT_ID}" --member="serviceAccount:${SA_EMAIL}" --role="roles/secretmanager.secretAccessor" >/dev/null

echo "==> Setting Firebase project for CLI"
npx firebase-tools use "${PROJECT_ID}"

echo "==> Running deploy_firebase.sh with service account"
bash "$(dirname "$0")/deploy_firebase.sh" \
  "${PROJECT_ID}" \
  "${SERVICE_ACCOUNT_JSON}" \
  "${JWT_SECRET_VALUE}" \
  "${OPENAI_KEY_VALUE}" \
  "${SA_EMAIL}"

echo "==> Completed provisioning and deployment"


