#!/bin/bash

echo "🚀 Railway Deployment Script"
echo "============================"

# Check environment
echo "📍 Environment: ${NODE_ENV:-development}"
echo "📍 Port: ${PORT:-3001}"

# Check database configuration
if [ -n "$DATABASE_URL" ]; then
    echo "✅ DATABASE_URL is set (Railway PostgreSQL)"
    echo "   Connection: ${DATABASE_URL:0:20}..."
else
    echo "❌ DATABASE_URL not set"
    echo "   Using individual DB environment variables"
    echo "   DB_HOST: ${DB_HOST:-not set}"
    echo "   DB_PORT: ${DB_PORT:-not set}"
    echo "   DB_NAME: ${DB_NAME:-not set}"
fi

# Check JWT secret
if [ -n "$JWT_SECRET" ]; then
    echo "✅ JWT_SECRET is set"
else
    echo "❌ JWT_SECRET not set"
fi

echo ""
echo "🔧 Running database migration..."
npm run migrate

echo ""
echo "🔧 Testing database connection..."
npm run test:connection

echo ""
echo "🚀 Starting server..."
npm start
