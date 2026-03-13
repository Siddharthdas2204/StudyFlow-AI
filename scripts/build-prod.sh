#!/bin/bash
set -e

echo "==> Installing dependencies..."
pnpm install --frozen-lockfile

echo "==> Building frontend..."
BASE_PATH=/ pnpm --filter @workspace/studyflow run build

echo "==> Copying frontend to API server dist..."
mkdir -p artifacts/api-server/dist/public
cp -r artifacts/studyflow/dist/public/. artifacts/api-server/dist/public/

echo "==> Building API server..."
pnpm --filter @workspace/api-server run build

echo "==> Build complete!"
