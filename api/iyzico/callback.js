const Iyzipay = require('iyzipay');

const apiKey = process.env.IYZICO_API_KEY || 'sandbox-YOUR_API_KEY';
const secretKey = process.env.IYZICO_SECRET_KEY || 'sandbox-YOUR_SECRET_KEY';
const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';

const iyzipay = new Iyzipay({
  apiKey: apiKey,
  secretKey: secretKey,
  uri: baseUrl
});

module.exports = async (req, res) => {
  const token = req.body?.token || req.query?.token;
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'lambospec.ai';
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  
  const successRedirect = process.env.APP_SUCCESS_URL || `${protocol}://${host}/?payment_success=true`;
  const failRedirect = process.env.APP_FAIL_URL || `${protocol}://${host}/?payment_failed=true`;

  if (!token) {
    return res.redirect(302, `${failRedirect}&reason=missing_token`);
  }

  const retrieveRequest = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: 'LAMBO_CALLBACK_' + Date.now(),
    token: token
  };

  iyzipay.checkoutForm.retrieve(retrieveRequest, (err, result) => {
    if (err) {
      return res.redirect(302, `${failRedirect}&reason=retrieval_error`);
    }

    if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      const redirectUrl = successRedirect.includes('?')
        ? `${successRedirect}&token=${token}&iyzi_paid=true`
        : `${successRedirect}?token=${token}&iyzi_paid=true`;
      
      return res.redirect(302, redirectUrl);
    } else {
      const errorMsg = encodeURIComponent(result.errorMessage || 'Payment failed');
      return res.redirect(302, `${failRedirect}&reason=${errorMsg}`);
    }
  });
};
