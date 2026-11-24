require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Iyzipay = require('iyzipay');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Configure iyzico client
const apiKey = process.env.IYZICO_API_KEY || 'sandbox-YOUR_API_KEY';
const secretKey = process.env.IYZICO_SECRET_KEY || 'sandbox-YOUR_SECRET_KEY';
const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';

const iyzipay = new Iyzipay({
  apiKey: apiKey,
  secretKey: secretKey,
  uri: baseUrl
});

// URLs
const BASE_HOST = process.env.APP_BASE_URL || `http://localhost:${PORT}`;
const CALLBACK_URL = process.env.IYZICO_CALLBACK_URL || `${BASE_HOST}/api/iyzico/callback`;
const SUCCESS_REDIRECT = process.env.APP_SUCCESS_URL || `${BASE_HOST}/?payment_success=true`;
const FAIL_REDIRECT = process.env.APP_FAIL_URL || `${BASE_HOST}/?payment_failed=true`;

// Default Pricing
const DEFAULT_PRICE_USD = process.env.PRICE_USD || '79.00';
const DEFAULT_PRICE_TRY = process.env.PRICE_TRY || '2750.00';

console.log('----------------------------------------------------');
console.log('🏎️ LamboSpec AI — iyzico Payment Server Starting');
console.log(`📡 Base URL: ${baseUrl}`);
console.log(`🔑 API Key Configured: ${apiKey !== 'sandbox-YOUR_API_KEY' ? 'YES (Live/Sandbox)' : 'NO (Placeholder)'}`);
console.log(`🔗 Callback URL: ${CALLBACK_URL}`);
console.log('----------------------------------------------------');

/**
 * Healthcheck & Configuration Status
 */
app.get('/api/iyzico/status', (req, res) => {
  res.json({
    active: true,
    configured: apiKey !== 'sandbox-YOUR_API_KEY',
    isSandbox: baseUrl.includes('sandbox'),
    priceUsd: DEFAULT_PRICE_USD,
    priceTry: DEFAULT_PRICE_TRY,
    callbackUrl: CALLBACK_URL
  });
});

/**
 * Initialize iyzico Checkout Form
 */
app.post('/api/iyzico/initialize', (req, res) => {
  try {
    const { email, modelName, currency = 'USD', buyerName = 'VIP', buyerSurname = 'Collector', phone = '+905350000000' } = req.body;

    if (!email) {
      return res.status(400).json({ status: 'failure', errorMessage: 'Email address is required.' });
    }

    const isTry = currency.toUpperCase() === 'TRY';
    const amount = isTry ? DEFAULT_PRICE_TRY : DEFAULT_PRICE_USD;
    const iyziCurrency = isTry ? Iyzipay.CURRENCY.TRY : Iyzipay.CURRENCY.USD;

    const conversationId = 'LAMBO_' + Date.now();
    const basketId = 'B_' + Date.now();

    const requestData = {
      locale: isTry ? Iyzipay.LOCALE.TR : Iyzipay.LOCALE.EN,
      conversationId: conversationId,
      price: amount,
      paidPrice: amount,
      currency: iyziCurrency,
      basketId: basketId,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: CALLBACK_URL,
      enabledInstallments: [1, 2, 3, 6, 9, 12],
      buyer: {
        id: 'BUYER_' + Date.now(),
        name: buyerName,
        surname: buyerSurname,
        gsmNumber: phone,
        email: email,
        identityNumber: '74300864791', // Standard compliant dummy ID for non-citizen/digital buyer
        lastLoginDate: '2026-11-23 23:00:00',
        registrationDate: '2026-11-23 23:00:00',
        registrationAddress: 'Nisantasi, Abdi Ipekci Caddesi No:42',
        ip: req.ip || req.headers['x-forwarded-for'] || '85.105.0.1',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34367'
      },
      shippingAddress: {
        contactName: `${buyerName} ${buyerSurname}`,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Digital Delivery / Cloud PDF Dossier',
        zipCode: '34367'
      },
      billingAddress: {
        contactName: `${buyerName} ${buyerSurname}`,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Digital Delivery / Cloud PDF Dossier',
        zipCode: '34367'
      },
      basketItems: [
        {
          id: 'LAMBOSPEC_VIP_DOSSIER',
          name: `LamboSpec AI VIP Inspection Dossier (${modelName || 'Lamborghini'})`,
          category1: 'Digital Automotive Forensics',
          category2: 'Pre-Purchase Supercar Audit',
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: amount
        }
      ]
    };

    iyzipay.checkoutFormInitialize.create(requestData, (err, result) => {
      if (err) {
        console.error('iyzico initialization error:', err);
        return res.status(500).json({ status: 'failure', errorMessage: err.message || 'Payment provider error' });
      }

      if (result.status !== 'success') {
        console.warn('iyzico rejected initialization:', result.errorMessage);
        return res.status(400).json({
          status: 'failure',
          errorMessage: result.errorMessage || 'Failed to initialize iyzico checkout form.'
        });
      }

      // Return payment token and redirect URL
      res.json({
        status: 'success',
        token: result.token,
        paymentPageUrl: result.paymentPageUrl,
        checkoutFormContent: result.checkoutFormContent,
        tokenExpireTime: result.tokenExpireTime
      });
    });
  } catch (err) {
    console.error('Server error on initialize:', err);
    res.status(500).json({ status: 'failure', errorMessage: err.message });
  }
});

/**
 * iyzico 3D Secure / Checkout Form Callback
 * iyzico sends a POST request with 'token' in the body upon user checkout
 */
app.post('/api/iyzico/callback', (req, res) => {
  const token = req.body.token;

  if (!token) {
    console.warn('Callback received without token');
    return res.redirect(`${FAIL_REDIRECT}&reason=missing_token`);
  }

  const retrieveRequest = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: 'LAMBO_CALLBACK_' + Date.now(),
    token: token
  };

  iyzipay.checkoutForm.retrieve(retrieveRequest, (err, result) => {
    if (err) {
      console.error('Token retrieval error:', err);
      return res.redirect(`${FAIL_REDIRECT}&reason=retrieval_error`);
    }

    console.log('iyzico Callback Verification Result:', {
      status: result.status,
      paymentStatus: result.paymentStatus,
      paidPrice: result.paidPrice,
      currency: result.currency,
      token: result.token
    });

    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      // Payment Successful!
      const redirectUrl = SUCCESS_REDIRECT.includes('?')
        ? `${SUCCESS_REDIRECT}&token=${token}&iyzi_paid=true`
        : `${SUCCESS_REDIRECT}?token=${token}&iyzi_paid=true`;
      
      return res.redirect(redirectUrl);
    } else {
      // Payment Failed or Cancelled
      const errorMsg = encodeURIComponent(result.errorMessage || 'Payment unsuccessful');
      return res.redirect(`${FAIL_REDIRECT}&reason=${errorMsg}`);
    }
  });
});

/**
 * Verify payment token status via JSON
 */
app.get('/api/iyzico/verify/:token', (req, res) => {
  const token = req.params.token;

  iyzipay.checkoutForm.retrieve({
    locale: Iyzipay.LOCALE.TR,
    conversationId: 'LAMBO_VERIFY_' + Date.now(),
    token: token
  }, (err, result) => {
    if (err) {
      return res.status(500).json({ status: 'failure', errorMessage: err.message });
    }
    res.json(result);
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
