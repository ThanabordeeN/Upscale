#!/usr/bin/env bash
# Script to configure Cloudflare R2 bucket and CORS for WebGPU Image Upscaler
set -euo pipefail

BUCKET_NAME="upscaler-models"
CUSTOM_DOMAIN="models.example.com"

echo "=== Cloudflare R2 Setup for WebGPU Image Upscaler ==="

# 1. Create R2 Bucket
echo "1. Checking/Creating R2 bucket: ${BUCKET_NAME}..."
npx wrangler r2 bucket create "${BUCKET_NAME}" || echo "Bucket might already exist, continuing..."

# 2. Set CORS Policy
echo "2. Applying CORS policy to ${BUCKET_NAME}..."
npx wrangler r2 bucket cors set "${BUCKET_NAME}" --file scripts/r2-cors.json
echo "✓ CORS policy applied."

# 3. Model Upload Instructions
echo ""
echo "3. To upload models to R2:"
echo "   npx wrangler r2 object put ${BUCKET_NAME}/models/realesrgan/manifest.json --file public/models/realesrgan/manifest.json"
echo "   npx wrangler r2 object put ${BUCKET_NAME}/models/realesrgan/model.onnx --file models/realesrgan/model.onnx --content-type application/octet-stream"
echo "   npx wrangler r2 object put ${BUCKET_NAME}/models/real-hat/manifest.json --file public/models/real-hat/manifest.json"
echo "   npx wrangler r2 object put ${BUCKET_NAME}/models/real-hat/model.onnx --file models/real-hat/model.onnx --content-type application/octet-stream"
echo ""
echo "4. Connect Custom Domain in Cloudflare Dashboard:"
echo "   R2 > Settings > Custom Domains > Add ${CUSTOM_DOMAIN}"
echo "   Ensure Cloudflare Cache Rules are enabled with Cache-Control: public, max-age=31536000, immutable"
echo "=== Setup instructions completed ==="
