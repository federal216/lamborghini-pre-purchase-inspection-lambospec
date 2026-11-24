const crypto = require('crypto');

const merchantKey = process.env.PAYTR_MERCHANT_KEY || 'dummy_key';
const merchantSalt = process.env.PAYTR_MERCHANT_SALT || 'dummy_salt';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { merchant_oid, status, total_amount, hash, failed_reason_code, failed_reason_msg } = req.body || {};

  if (!merchant_oid || !status || !total_amount || !hash) {
    return res.status(400).send('PAYTR notification missing required parameters.');
  }

  // Calculate expected hash
  const expectedHash = crypto
    .createHmac('sha256', merchantKey)
    .update(`${merchant_oid}${merchantSalt}${status}${total_amount}`)
    .digest('base64');

  if (hash !== expectedHash) {
    console.error('PayTR callback signature mismatch:', { received: hash, expected: expectedHash });
    return res.status(400).send('PAYTR notification failed: bad hash.');
  }

  if (status === 'success') {
    console.log(`✅ PayTR Payment SUCCESS: Order ${merchant_oid}, Amount: ${total_amount}`);
    // Here: Log transaction, trigger automatic PDF generation / delivery
    return res.send('OK');
  } else {
    console.warn(`❌ PayTR Payment FAILED: Order ${merchant_oid}, Code: ${failed_reason_code}, Reason: ${failed_reason_msg}`);
    return res.send('OK');
  }
};
