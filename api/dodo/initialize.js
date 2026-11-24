const https = require('https');

const dodoApiKey = process.env.DODO_PAYMENTS_API_KEY || 'dodo_test_0_u-P96zqKPvQVU1.lwM9WJvPchJR4POMqkT0iVuHclz9ul4Jfbf8Jd_-JJZSuM4Q';
const defaultProductId = process.env.DODO_PRODUCT_ID || 'pdt_0NsdXpb0AXJ8AeTfGANYe';
const environment = process.env.DODO_PAYMENTS_ENVIRONMENT || 'test_mode';

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'failed', reason: 'Method Not Allowed' });
  }

  try {
    const { email, modelName, buyerName = 'VIP Collector', productId = defaultProductId } = req.body || {};

    if (!email) {
      return res.status(400).json({ status: 'failed', reason: 'Email address is required.' });
    }

    const host = req.headers['x-forwarded-host'] || req.headers.host || 'lambospec.ai';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const returnUrl = process.env.DODO_RETURN_URL || `${protocol}://${host}/?payment_success=true&dodo_paid=true`;

    const isLive = environment === 'live_mode' || dodoApiKey.startsWith('dodo_live_');
    const apiHost = isLive ? 'live.dodopayments.com' : 'test.dodopayments.com';

    const postPayload = JSON.stringify({
      product_cart: [
        {
          product_id: productId,
          quantity: 1
        }
      ],
      customer: {
        email: email,
        name: buyerName
      },
      return_url: returnUrl,
      metadata: {
        model: modelName || 'Lamborghini',
        timestamp: Date.now().toString()
      }
    });

    const options = {
      hostname: apiHost,
      port: 443,
      path: '/checkouts',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${dodoApiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postPayload)
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (response.statusCode >= 200 && response.statusCode < 300 && json.checkout_url) {
            return res.json({
              status: 'success',
              sessionId: json.session_id,
              checkoutUrl: json.checkout_url
            });
          } else {
            console.warn('Dodo Payments checkout error:', json);
            return res.status(response.statusCode || 400).json({
              status: 'failed',
              reason: json.message || json.reason || 'Dodo Payments oturumu oluşturulamadı. API anahtarınızı kontrol edin.',
              details: json
            });
          }
        } catch (err) {
          console.error('Dodo response parse error:', data);
          return res.status(500).json({ status: 'failed', reason: 'Invalid response from Dodo Payments.' });
        }
      });
    });

    request.on('error', (e) => {
      console.error('Dodo Payments request error:', e);
      return res.status(500).json({ status: 'failed', reason: e.message });
    });

    request.write(postPayload);
    request.end();

  } catch (err) {
    console.error('Server error on Dodo initialize:', err);
    res.status(500).json({ status: 'failed', reason: err.message });
  }
};
