#!/bin/bash

set -e

if [ ! -f .env ]; then
  echo "📄 Copying .env.example to .env..."
  cp .env.example .env
fi

echo "🔧 Installing dependencies..."
yarn install

echo "🧪 Setting DB provider to SQLite..."
yarn set-db-provider:sqlite

echo "📦 Pushing schema to SQLite DB..."
yarn prisma-push

echo "⚙️ Generating Prisma client..."
yarn prisma-generate

echo "Seeding database..."
npx prisma db seed

echo "🚀 Starting development server..."
yarn dev:memory
