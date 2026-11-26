const fs = require('fs');
const path = require('path');

const STORE_FILE = path.join('/tmp', 'federal216_paytr_orders.json');
const memoryOrders = new Map();

function savePaytrOrder(merchantOid, details) {
  if (!merchantOid) return;
  const record = { ...details, createdAt: Date.now() };
  memoryOrders.set(merchantOid, record);
  try {
    let data = {};
    if (fs.existsSync(STORE_FILE)) {
      data = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8') || '{}');
    }
    data[merchantOid] = record;
    const keys = Object.keys(data);
    if (keys.length > 500) {
      for (const oldKey of keys.slice(0, keys.length - 500)) delete data[oldKey];
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data));
  } catch {
    // Non-fatal
  }
}

function getPaytrOrder(merchantOid) {
  if (!merchantOid) return null;
  if (memoryOrders.has(merchantOid)) return memoryOrders.get(merchantOid);
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STORE_FILE, 'utf8') || '{}');
      if (data[merchantOid]) {
        memoryOrders.set(merchantOid, data[merchantOid]);
        return data[merchantOid];
      }
    }
  } catch {
    // Non-fatal
  }
  return null;
}

module.exports = {
  savePaytrOrder,
  getPaytrOrder
};
