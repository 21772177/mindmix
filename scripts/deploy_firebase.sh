#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID=${1:-bold-azimuth-468606-c4}
SERVICE_ACCOUNT_JSON=${2:-}
JWT_SECRET_VALUE=${3:-change-this-secret}
OPENAI_KEY_VALUE=${4:-}

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required. Install Node.js 18+." >&2
  exit 1
fi

echo "Using project: $PROJECT_ID"
npx firebase-tools use "$PROJECT_ID"

echo "Setting secrets..."
npx firebase-tools functions:secrets:set FIREBASE_PROJECT_ID --project "$PROJECT_ID" --plaintext "$PROJECT_ID"
if [ -n "$SERVICE_ACCOUNT_JSON" ]; then
  npx firebase-tools functions:secrets:set FIREBASE_SERVICE_ACCOUNT --project "$PROJECT_ID" --data-file "$SERVICE_ACCOUNT_JSON"
else
  echo "WARNING: SERVICE_ACCOUNT_JSON not provided; skipping FIREBASE_SERVICE_ACCOUNT"
fi
npx firebase-tools functions:secrets:set JWT_SECRET --project "$PROJECT_ID" --plaintext "$JWT_SECRET_VALUE"
if [ -n "$OPENAI_KEY_VALUE" ]; then
  npx firebase-tools functions:secrets:set OPENAI_API_KEY --project "$PROJECT_ID" --plaintext "$OPENAI_KEY_VALUE"
fi

echo "Installing and building frontend..."
pushd frontend-web >/dev/null
npm ci
npm run build
popd >/dev/null

echo "Installing functions deps..."
pushd functions >/dev/null
npm ci
popd >/dev/null

echo "Deploying functions, hosting, rules..."
npx firebase-tools deploy --project "$PROJECT_ID" --only functions,hosting,firestore,storage

echo "Done."


