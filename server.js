require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'akinyanwola@yahoo.com';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// In-memory order store (simple – no database needed for this use case)
const orders = {};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Email helper ─────────────────────────────────────────────────────────────

function createTransporter() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendEmail(to, subject, html) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('\n=== EMAIL (SMTP not configured – logging instead) ===');
    console.log('To     :', to);
    console.log('Subject:', subject);
    console.log('Body   :\n', html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
    console.log('=====================================================\n');
    return;
  }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  await transporter.sendMail({ from, to, subject, html });
  console.log(`Email sent → ${to} | ${subject}`);
}

// ─── Order helpers ────────────────────────────────────────────────────────────

function itemsTableHtml(items) {
  const rows = items
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 10px;border:1px solid #ddd">${i.name}</td>
          <td style="padding:6px 10px;border:1px solid #ddd">${i.unit}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;text-align:center">${i.qty}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;text-align:right">${
            i.price != null ? '₦' + (i.price * i.qty).toLocaleString() : 'Price on request'
          }</td>
        </tr>`
    )
    .join('');
  return `<table style="width:100%;border-collapse:collapse;margin:12px 0">
    <thead>
      <tr style="background:#2d6a2d;color:#fff">
        <th style="padding:8px 10px;text-align:left">Item</th>
        <th style="padding:8px 10px;text-align:left">Unit</th>
        <th style="padding:8px 10px;text-align:center">Qty</th>
        <th style="padding:8px 10px;text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function formatTotal(total) {
  return total != null ? '₦' + Number(total).toLocaleString() : 'Includes price-on-request items';
}

// ─── API routes ───────────────────────────────────────────────────────────────

// POST /api/orders  – submit order after "I have paid"
app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, total } = req.body || {};

    if (!customer || !customer.name || !customer.phone || !customer.email) {
      return res.status(400).json({ error: 'Customer name, phone, and email are required.' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const orderId = uuidv4();
    orders[orderId] = {
      orderId,
      customer,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const shortId = orderId.slice(0, 8).toUpperCase();
    const confirmUrl = `${BASE_URL}/admin.html?orderId=${orderId}`;

    const adminHtml = `
<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto">
  <div style="background:#2d6a2d;color:#fff;padding:20px;text-align:center">
    <h1 style="margin:0;font-size:22px">GLT FARMS AND EXPORT LTD</h1>
    <p style="margin:4px 0 0;font-size:14px">Payment Received – Awaiting Confirmation</p>
  </div>
  <div style="padding:20px">
    <h2 style="color:#2d6a2d">New Order #${shortId}</h2>
    <h3>Customer Details</h3>
    <p style="margin:4px 0">Name: <strong>${customer.name}</strong></p>
    <p style="margin:4px 0">Phone: <strong>${customer.phone}</strong></p>
    <p style="margin:4px 0">Email: <strong>${customer.email}</strong></p>
    <h3>Order Items</h3>
    ${itemsTableHtml(items)}
    <p><strong>Total: ${formatTotal(total)}</strong></p>
    <p>Please verify the payment in your bank account, then click the button below to confirm:</p>
    <p style="text-align:center;margin:24px 0">
      <a href="${confirmUrl}"
         style="background:#2d6a2d;color:#fff;padding:14px 28px;text-decoration:none;
                border-radius:6px;display:inline-block;font-size:16px;font-weight:bold">
        ✓ Confirm Payment
      </a>
    </p>
    <p style="font-size:12px;color:#666">Or copy this link: ${confirmUrl}</p>
  </div>
</div>`;

    await sendEmail(ADMIN_EMAIL, `GLT Farms Order #${shortId} – Payment Submitted`, adminHtml);

    res.json({ success: true, orderId, shortId });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    res.status(500).json({ error: 'Failed to process order. Please try again.' });
  }
});

// GET /api/orders/:orderId  – fetch order for admin page
app.get('/api/orders/:orderId', (req, res) => {
  const order = orders[req.params.orderId];
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  res.json(order);
});

// POST /api/confirm/:orderId  – admin confirms payment; notifies customer
app.post('/api/confirm/:orderId', async (req, res) => {
  const order = orders[req.params.orderId];
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  if (order.status === 'confirmed') {
    return res.json({ success: true, message: 'Already confirmed.' });
  }

  order.status = 'confirmed';
  order.confirmedAt = new Date().toISOString();

  const shortId = order.orderId.slice(0, 8).toUpperCase();

  const customerHtml = `
<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto">
  <div style="background:#2d6a2d;color:#fff;padding:20px;text-align:center">
    <h1 style="margin:0;font-size:22px">GLT FARMS AND EXPORT LTD</h1>
    <p style="margin:4px 0 0;font-size:14px">Fresh Farm Produce Delivered to Your Doorstep</p>
  </div>
  <div style="padding:20px">
    <h2 style="color:#2d6a2d">✅ Payment Confirmed!</h2>
    <p>Dear <strong>${order.customer.name}</strong>,</p>
    <p>Great news! Your payment has been verified and your order is now being processed.</p>
    <p><strong>Order Reference: #${shortId}</strong></p>
    <h3>Order Summary</h3>
    ${itemsTableHtml(order.items)}
    <p><strong>Total: ${formatTotal(order.total)}</strong></p>
    <p>We will reach out to arrange delivery. Thank you for choosing GLT Farms!</p>
    <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
    <p style="font-size:13px;color:#555">
      📞 <a href="tel:+2348055270694">08055270694</a> &nbsp;|&nbsp;
      <a href="tel:+2348109717302">08109717302</a><br>
      📧 <a href="mailto:info@gltfarmsandexport.com">info@gltfarmsandexport.com</a><br>
      🌐 <a href="https://www.gltfarmsandexport.com/">www.gltfarmsandexport.com</a>
    </p>
  </div>
</div>`;

  await sendEmail(
    order.customer.email,
    `GLT Farms – Your Payment is Confirmed! (Order #${shortId})`,
    customerHtml
  );

  res.json({ success: true, message: 'Payment confirmed. Customer has been notified.' });
});

// ─── Start server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\nGLT Farms Ordering App running → http://localhost:${PORT}\n`);
});
