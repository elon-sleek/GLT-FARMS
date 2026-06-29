# GLT Farms and Export Ltd – Ordering App

A simple web-based ordering app that replicates the **GLT Farms Weekly Price List** flyer.  
Customers can browse items, build a cart, check out, pay via bank transfer, and notify the team
with a single "I Have Paid" click. The back-office team then confirms the payment and the
customer receives an automated email confirmation.

---

## Features

| Feature | Details |
|---|---|
| Price-list page | Vegetables table + Fruits grid, mirroring the flyer layout |
| Cart | Add items, adjust quantities, see line totals |
| Checkout | Collects customer name, phone, and email |
| Payment details | UBA & Sterling Bank account numbers displayed clearly |
| "I Have Paid" | Submits order and emails admin for confirmation |
| Admin page | `/admin.html?orderId=…` – one-click payment confirmation |
| Customer email | Sent automatically when admin confirms |
| Clickable contacts | Address → Maps, phones → tel:, emails → mailto:, socials → links |

---

## Quick Start

### Prerequisites

- **Node.js 18+**
- An SMTP account for sending emails *(optional – emails are printed to the console if not configured)*

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | HTTP port (default `3000`) |
| `BASE_URL` | No | Public URL, e.g. `https://yourapp.com` (used in admin email links) |
| `SMTP_HOST` | No* | SMTP hostname, e.g. `smtp.gmail.com` |
| `SMTP_PORT` | No | SMTP port (`587` or `465`, default `587`) |
| `SMTP_SECURE` | No | `true` for port 465, `false` for 587 |
| `SMTP_USER` | No* | SMTP login email |
| `SMTP_PASS` | No* | SMTP password / app password |
| `SMTP_FROM` | No | Sender name shown in emails |
| `ADMIN_EMAIL` | No | Admin email for payment alerts (default `akinyanwola@yahoo.com`) |

*\* Required together for email sending. If any is missing, emails are logged to the console.*

**Gmail tip:** Use an [App Password](https://support.google.com/accounts/answer/185833) rather than your account password.

### 3. Start the server

```bash
# Production
npm start

# Development (auto-restart on changes)
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Email Workflow

```
Customer selects items → Cart → Checkout (name/phone/email)
  → Sees bank details → Transfers money → Clicks "I Have Paid"
    → Server creates order → Emails ADMIN_EMAIL with confirm link

Admin opens link (admin.html?orderId=…)
  → Verifies bank transfer → Clicks "Confirm Payment Received"
    → Server marks order confirmed → Emails customer confirmation
```

### No SMTP configured?

If `SMTP_HOST` is not set, the server logs the full email content to the console:

```
=== EMAIL (SMTP not configured – logging instead) ===
To     : akinyanwola@yahoo.com
Subject: GLT Farms Order #ABCD1234 – Payment Submitted
Body   : ...
=====================================================
```

This lets you test the full flow without an email account.

---

## Project Structure

```
.
├── server.js          # Express backend (order submission, confirm, emails)
├── package.json
├── .env.example       # Environment variable template
├── .gitignore
├── README.md
└── public/
    ├── index.html     # Main ordering page (flyer replica + cart)
    ├── style.css      # Visual styling
    ├── app.js         # Frontend cart/checkout logic
    └── admin.html     # Back-office payment confirmation page
```

---

## Updating the Price List

All product names, units, and prices live in `public/app.js` at the top of the file in two arrays:

- `VEGETABLES` – table section
- `FRUITS` – card grid section

Set `price: null` for any item whose price changes weekly and should display **"Price on Request"**.

---

## Limitations / Notes

- Orders are stored **in-memory**. They are lost if the server restarts. For production use, consider
  persisting orders to a file or simple database.
- No authentication is required to access the admin confirmation page (by design – the link acts
  as a shared secret). For stricter security, add a secret token to the URL.
- Price list reflects typical market values; update `public/app.js` each week as needed.
