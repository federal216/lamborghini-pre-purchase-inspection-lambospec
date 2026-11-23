const Iyzipay = require('iyzipay');

const apiKey = process.env.IYZICO_API_KEY || 'sandbox-YOUR_API_KEY';
const secretKey = process.env.IYZICO_SECRET_KEY || 'sandbox-YOUR_SECRET_KEY';
const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';

const iyzipay = new Iyzipay({
  apiKey: apiKey,
  secretKey: secretKey,
  uri: baseUrl
});

const DEFAULT_PRICE_USD = process.env.PRICE_USD || '79.00';
const DEFAULT_PRICE_TRY = process.env.PRICE_TRY || '2750.00';

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'failure', errorMessage: 'Method Not Allowed' });
  }

  try {
    const { email, modelName, currency = 'USD', buyerName = 'VIP', buyerSurname = 'Collector', phone = '+905350000000' } = req.body;

    if (!email) {
      return res.status(400).json({ status: 'failure', errorMessage: 'Email address is required.' });
    }

    const isTry = (currency || '').toUpperCase() === 'TRY';
    const amount = isTry ? DEFAULT_PRICE_TRY : DEFAULT_PRICE_USD;
    const iyziCurrency = isTry ? Iyzipay.CURRENCY.TRY : Iyzipay.CURRENCY.USD;

    const host = req.headers['x-forwarded-host'] || req.headers.host || 'lambospec.ai';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const callbackUrl = process.env.IYZICO_CALLBACK_URL || `${protocol}://${host}/api/iyzico/callback`;

    const requestData = {
      locale: isTry ? Iyzipay.LOCALE.TR : Iyzipay.LOCALE.EN,
      conversationId: 'LAMBO_' + Date.now(),
      price: amount,
      paidPrice: amount,
      currency: iyziCurrency,
      basketId: 'B_' + Date.now(),
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9, 12],
      buyer: {
        id: 'BUYER_' + Date.now(),
        name: buyerName,
        surname: buyerSurname,
        gsmNumber: phone,
        email: email,
        identityNumber: '74300864791',
        lastLoginDate: '2026-11-23 23:00:00',
        registrationDate: '2026-11-23 23:00:00',
        registrationAddress: 'Nisantasi, Abdi Ipekci Caddesi No:42',
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '85.105.0.1',
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
        return res.status(500).json({ status: 'failure', errorMessage: err.message || 'Payment provider error' });
      }

      if (result.status !== 'success') {
        return res.status(400).json({
          status: 'failure',
          errorMessage: result.errorMessage || 'Failed to initialize iyzico checkout form.'
        });
      }

      res.json({
        status: 'success',
        token: result.token,
        paymentPageUrl: result.paymentPageUrl,
        checkoutFormContent: result.checkoutFormContent,
        tokenExpireTime: result.tokenExpireTime
      });
    });
  } catch (err) {
    res.status(500).json({ status: 'failure', errorMessage: err.message });
  }
};
