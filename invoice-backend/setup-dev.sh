#!/bin/bash
set -e

[ -f .env ] || cp .env.example .env

echo "🔧 Installing dependencies..."
yarn install

echo "🧪 Setting DB provider to SQLite..."
yarn set-db-provider:sqlite

echo "📦 Pushing schema..."
yarn prisma-push

echo "🌱 Seeding database..."
yarn tsx prisma/seed.mjs

echo "🚀 Starting dev server..."
yarn dev:sqlite
