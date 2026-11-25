require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// URLs
const BASE_HOST = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
const SUCCESS_REDIRECT = process.env.APP_SUCCESS_URL || `${BASE_HOST}/?payment_success=true`;
const FAIL_REDIRECT = process.env.APP_FAIL_URL || `${BASE_HOST}/?payment_failed=true`;

// Default Pricing
const DEFAULT_PRICE_USD = process.env.PRICE_USD || '79.00';
const DEFAULT_PRICE_TRY = process.env.PRICE_TRY || '2750.00';

console.log('----------------------------------------------------');
console.log('🏎️ LamboSpec AI — Payment Server Starting');
console.log(`📡 Port: ${PORT}`);
console.log(`💵 Price: $${DEFAULT_PRICE_USD} USD / ${DEFAULT_PRICE_TRY} TL`);
console.log('----------------------------------------------------');

/**
 * Healthcheck & Configuration Status
 */
app.get('/api/status', (req, res) => {
  res.json({
    active: true,
    priceUsd: DEFAULT_PRICE_USD,
    priceTry: DEFAULT_PRICE_TRY,
    gateways: {
      paytr: true,
      dodo: true,
      paddle: true,
      crypto: true
    }
  });
});

/**
 * PayTR Gateway Endpoints
 */
const paytrInitialize = require('./api/paytr/initialize');
const paytrCallback = require('./api/paytr/callback');

app.all('/api/paytr/initialize', paytrInitialize);
app.all('/api/paytr/callback', paytrCallback);

/**
 * Dodo Payments Gateway Endpoint
 */
const dodoInitialize = require('./api/dodo/initialize');
app.all('/api/dodo/initialize', dodoInitialize);

app.listen(PORT, () => {
  console.log(`🚀 LamboSpec AI Server running on port ${PORT}`);
  console.log(`🌐 Local preview: http://localhost:${PORT}`);
});
