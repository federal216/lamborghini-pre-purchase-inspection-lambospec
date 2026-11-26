const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');
const { savePaytrOrder } = require('../../lib/paytrOrders');

const merchantId = process.env.PAYTR_MERCHANT_ID || 'dummy_id';
const merchantKey = process.env.PAYTR_MERCHANT_KEY || 'dummy_key';
const merchantSalt = process.env.PAYTR_MERCHANT_SALT || 'dummy_salt';

const DEFAULT_PRICE_USD = process.env.PRICE_USD || '79.00';
const DEFAULT_PRICE_TRY = process.env.PRICE_TRY || '2750.00';

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
    const { email, modelName, currency = 'USD', buyerName = 'VIP Collector', phone = '05350000000' } = req.body || {};

    if (!email) {
      return res.status(400).json({ status: 'failed', reason: 'Email address is required.' });
    }

    const isTry = (currency || '').toUpperCase() === 'TRY' || (currency || '').toUpperCase() === 'TL';
    const rawPrice = isTry ? DEFAULT_PRICE_TRY : DEFAULT_PRICE_USD;
    const paytrCurrency = isTry ? 'TL' : 'USD';
    
    // PayTR payment_amount is in cents/kuruş (integer multiplied by 100)
    const payment_amount = Math.round(parseFloat(rawPrice) * 100);

    const host = req.headers['x-forwarded-host'] || req.headers.host || 'lambospec.ai';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${protocol}://${host}`;

    const merchant_oid = 'LAMBO_' + Date.now();
    savePaytrOrder(merchant_oid, {
      email,
      buyerName,
      modelName: modelName || 'Lamborghini',
      amountLabel: `${rawPrice} ${paytrCurrency}`
    });
    const user_ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '85.105.0.1';
    const user_name = buyerName;
    const user_address = 'Digital Delivery / Cloud PDF Dossier, Istanbul, Turkey';
    const user_phone = phone;

    const merchant_ok_url = process.env.PAYTR_OK_URL || `${baseUrl}/?payment_success=true&paytr=1`;
    const merchant_fail_url = process.env.PAYTR_FAIL_URL || `${baseUrl}/?payment_failed=true&paytr=1`;

    const user_basket = Buffer.from(JSON.stringify([
      [`LamboSpec AI VIP Dossier (${modelName || 'Lamborghini'})`, rawPrice, 1]
    ])).toString('base64');

    const timeout_limit = '30';
    const no_installment = '1'; // 1: Tek çekim (Yurt dışı kartlar için ideal)
    const max_installment = '0';
    const test_mode = process.env.PAYTR_TEST_MODE === '0' ? '0' : '1';

    // Hash calculation:
    // merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode
    const hash_str = `${merchantId}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${paytrCurrency}${test_mode}`;
    const paytr_token = crypto
      .createHmac('sha256', merchantKey)
      .update(hash_str + merchantSalt)
      .digest('base64');

    const postData = querystring.stringify({
      merchant_id: merchantId,
      user_ip: user_ip,
      merchant_oid: merchant_oid,
      email: email,
      payment_amount: payment_amount,
      paytr_token: paytr_token,
      user_basket: user_basket,
      user_name: user_name,
      user_address: user_address,
      user_phone: user_phone,
      merchant_ok_url: merchant_ok_url,
      merchant_fail_url: merchant_fail_url,
      timeout_limit: timeout_limit,
      currency: paytrCurrency,
      test_mode: test_mode,
      no_installment: no_installment,
      max_installment: max_installment,
      lang: 'en'
    });

    // Send POST to PayTR API
    const options = {
      hostname: 'www.paytr.com',
      port: 443,
      path: '/odeme/api/get-token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'success') {
            return res.json({
              status: 'success',
              token: json.token,
              iframeUrl: `https://www.paytr.com/odeme/guvenli/${json.token}`
            });
          } else {
            console.error('PayTR token generation failed:', json);
            return res.status(400).json({
              status: 'failed',
              reason: json.reason || 'PayTR token oluşturulamadı.'
            });
          }
        } catch (err) {
          console.error('PayTR response parse error:', data);
          return res.status(500).json({ status: 'failed', reason: 'Invalid response from PayTR.' });
        }
      });
    });

    request.on('error', (e) => {
      console.error('PayTR request error:', e);
      return res.status(500).json({ status: 'failed', reason: e.message });
    });

    request.write(postData);
    request.end();

  } catch (err) {
    console.error('Server error on PayTR initialize:', err);
    res.status(500).json({ status: 'failed', reason: err.message });
  }
};
