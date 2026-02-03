#!/usr/bin/env node
/**
 * Minimal mock for Salla form-builder POST so the demo can preview components
 * without CORS errors. Run: node scripts/form-builder-mock.js
 * Then start dev with: TWILIGHT_FORM_BUILDER_MOCK_BASE_URL=http://localhost:3131 pnpm run dev
 */
const http = require('http');
const PORT = Number(process.env.FORM_BUILDER_MOCK_PORT) || 3131;

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }
  if (req.method === 'POST' && req.url && req.url.startsWith('/api/v1/form-builder-mock')) {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ ok: true, data: body ? JSON.parse(body || '{}') : {} }));
    });
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Form builder mock: http://localhost:${PORT}`);
  console.log(`Start dev with: TWILIGHT_FORM_BUILDER_MOCK_BASE_URL=http://localhost:${PORT} pnpm run dev`);
});
