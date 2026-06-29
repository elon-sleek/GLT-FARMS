/* ================================================================
   GLT Farms Ordering App – Frontend Logic
   ================================================================ */

// ── Product catalogue ─────────────────────────────────────────────
const VEGETABLES = [
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    options: [
      { id: 'tomatoes-big',   unit: 'Big Basket',   price: 15000 },
      { id: 'tomatoes-small', unit: 'Small Basket',  price:  8000 },
      { id: 'tomatoes-paint', unit: 'Paint Rubber',  price:  3500 },
    ],
  },
  {
    id: 'tatashe',
    name: 'Tatashe (Red Pepper)',
    options: [
      { id: 'tatashe-big',   unit: 'Big Basket',  price: 18000 },
      { id: 'tatashe-small', unit: 'Small Basket', price: 10000 },
    ],
  },
  {
    id: 'shombo',
    name: 'Shombo (Chilli Pepper)',
    options: [
      { id: 'shombo-big',   unit: 'Big Basket',  price: 20000 },
      { id: 'shombo-small', unit: 'Small Basket', price: 11000 },
    ],
  },
  {
    id: 'atarodo',
    name: 'Ata Rodo (Scotch Bonnet)',
    options: [
      { id: 'atarodo-paint', unit: 'Paint Rubber', price: 5000 },
      { id: 'atarodo-mudu',  unit: 'Mudu',          price: 2500 },
    ],
  },
  {
    id: 'onions',
    name: 'Onions',
    options: [
      { id: 'onions-bag',   unit: '50 kg Bag',     price: 28000 },
      { id: 'onions-paint', unit: 'Paint Rubber',  price:  4000 },
    ],
  },
  {
    id: 'garlic',
    name: 'Garlic',
    options: [
      { id: 'garlic-kg', unit: 'Per kg', price: 4500 },
    ],
  },
  {
    id: 'ginger',
    name: 'Ginger',
    options: [
      { id: 'ginger-kg', unit: 'Per kg', price: 3500 },
    ],
  },
  {
    id: 'garden-egg',
    name: 'Garden Eggs',
    options: [
      { id: 'garden-egg-mudu', unit: 'Mudu', price: 2000 },
    ],
  },
  {
    id: 'okra',
    name: 'Okra',
    options: [
      { id: 'okra-mudu',  unit: 'Mudu',         price: 2500 },
      { id: 'okra-paint', unit: 'Paint Rubber', price: 4000 },
    ],
  },
  {
    id: 'cucumber',
    name: 'Cucumber',
    options: [
      { id: 'cucumber-crate', unit: 'Crate (50 pcs)', price: 12000 },
      { id: 'cucumber-piece', unit: 'Per Piece',       price:   300 },
    ],
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    options: [
      { id: 'cabbage-head', unit: 'Per Head',        price:  2000 },
      { id: 'cabbage-bag',  unit: 'Bag (30 heads)',  price: 40000 },
    ],
  },
  {
    id: 'carrot',
    name: 'Carrot',
    options: [
      { id: 'carrot-10kg', unit: '10 kg Bag', price: 10000 },
    ],
  },
  {
    id: 'green-pepper',
    name: 'Green Pepper (Tatase Obe)',
    options: [
      { id: 'green-pepper-mudu', unit: 'Mudu', price: 3500 },
    ],
  },
  {
    id: 'irish-potato',
    name: 'Irish Potato',
    options: [
      { id: 'irish-potato-bag', unit: '50 kg Bag', price: 35000 },
    ],
  },
  {
    id: 'sweet-potato',
    name: 'Sweet Potato',
    options: [
      { id: 'sweet-potato-bag', unit: '50 kg Bag', price: 22000 },
    ],
  },
  {
    id: 'yam',
    name: 'Yam',
    options: [
      { id: 'yam-tuber', unit: 'Per Tuber', price: null },
    ],
  },
  {
    id: 'plantain',
    name: 'Plantain',
    options: [
      { id: 'plantain-bunch', unit: 'Bunch', price: null },
    ],
  },
  {
    id: 'bitter-leaf',
    name: 'Bitter Leaf',
    options: [
      { id: 'bitter-leaf-bunch', unit: 'Bunch', price: 500 },
    ],
  },
  {
    id: 'ugwu',
    name: 'Ugwu (Fluted Pumpkin)',
    options: [
      { id: 'ugwu-bunch', unit: 'Bunch', price: 500 },
    ],
  },
];

const FRUITS = [
  {
    id: 'watermelon',
    name: 'Watermelon 🍉',
    options: [
      { id: 'watermelon-piece', unit: 'Per Piece', price: 2500 },
    ],
  },
  {
    id: 'pineapple',
    name: 'Pineapple 🍍',
    options: [
      { id: 'pineapple-piece', unit: 'Per Piece',     price:  1500 },
      { id: 'pineapple-crate', unit: 'Crate (12 pcs)', price: 15000 },
    ],
  },
  {
    id: 'banana',
    name: 'Banana 🍌',
    options: [
      { id: 'banana-bunch', unit: 'Bunch', price: 3000 },
    ],
  },
  {
    id: 'orange',
    name: 'Orange 🍊',
    options: [
      { id: 'orange-100', unit: '100 Count', price: 6000 },
      { id: 'orange-50',  unit: '50 Count',  price: 3500 },
    ],
  },
  {
    id: 'pawpaw',
    name: 'Pawpaw (Papaya) 🍈',
    options: [
      { id: 'pawpaw-piece', unit: 'Per Piece', price: 1200 },
    ],
  },
  {
    id: 'mango',
    name: 'Mango 🥭',
    options: [
      { id: 'mango-price', unit: 'Per Piece', price: null },
    ],
  },
];

// ── Cart state ────────────────────────────────────────────────────
// Each entry: { optionId, name, unit, price (or null), qty }
let cart = [];

// ── Helpers ───────────────────────────────────────────────────────
function fmt(n) {
  return n != null ? '₦' + Number(n).toLocaleString() : null;
}

function getSelectedOption(product) {
  const sel = document.getElementById('sel-' + product.id);
  const optId = sel ? sel.value : product.options[0].id;
  return product.options.find((o) => o.id === optId) || product.options[0];
}

function cartTotal() {
  let t = 0;
  let hasNullPrice = false;
  for (const item of cart) {
    if (item.price != null) t += item.price * item.qty;
    else hasNullPrice = true;
  }
  return { total: t, hasNullPrice };
}

function hasPorItem() {
  return cart.some((i) => i.price == null);
}

// ── Render helpers ────────────────────────────────────────────────
function buildUnitSelect(product, idPrefix) {
  if (product.options.length === 1) {
    return `<span class="unit-text">${product.options[0].unit}</span>
            <input type="hidden" id="sel-${product.id}" value="${product.options[0].id}"/>`;
  }
  const opts = product.options
    .map((o) => `<option value="${o.id}">${o.unit}</option>`)
    .join('');
  return `<select class="unit-select" id="sel-${product.id}" aria-label="Select unit for ${product.name}">${opts}</select>`;
}

function priceDisplay(product) {
  if (product.options.length === 1) {
    const o = product.options[0];
    return o.price != null
      ? `<span class="price-cell">${fmt(o.price)}</span>`
      : `<span class="price-on-req">Price on Request</span>`;
  }
  // Multiple options – show price range or "varies"
  const prices = product.options.map((o) => o.price).filter((p) => p != null);
  if (prices.length === 0) return `<span class="price-on-req">Price on Request</span>`;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max
    ? `<span class="price-cell">${fmt(min)}</span>`
    : `<span class="price-cell" id="price-display-${product.id}">${fmt(min)} – ${fmt(max)}</span>`;
}

// ── Build vegetables table ────────────────────────────────────────
function renderVegetables() {
  const tbody = document.getElementById('vegTableBody');
  tbody.innerHTML = VEGETABLES.map((v) => {
    const isPor = v.options.every((o) => o.price == null);
    const addBtnClass = isPor ? 'btn-add por' : 'btn-add';
    const addBtnLabel = isPor ? '+ Request' : '+ Add';
    return `
      <tr>
        <td class="product-name">${v.name}</td>
        <td>${buildUnitSelect(v)}</td>
        <td id="price-cell-${v.id}">${priceDisplay(v)}</td>
        <td class="add-col">
          <button class="${addBtnClass}" data-id="${v.id}" data-cat="veg"
                  aria-label="Add ${v.name} to cart">
            ${addBtnLabel}
          </button>
        </td>
      </tr>`;
  }).join('');

  // Update price display when unit select changes
  VEGETABLES.forEach((v) => {
    if (v.options.length < 2) return;
    const sel = document.getElementById('sel-' + v.id);
    if (sel) {
      sel.addEventListener('change', () => {
        const opt = v.options.find((o) => o.id === sel.value);
        const cell = document.getElementById('price-cell-' + v.id);
        if (cell && opt) {
          cell.innerHTML = opt.price != null
            ? `<span class="price-cell">${fmt(opt.price)}</span>`
            : `<span class="price-on-req">Price on Request</span>`;
        }
      });
    }
  });
}

// ── Build fruits grid ─────────────────────────────────────────────
function renderFruits() {
  const grid = document.getElementById('fruitsGrid');
  grid.innerHTML = FRUITS.map((f) => {
    const opt0 = f.options[0];
    const isPor = f.options.every((o) => o.price == null);
    const priceHtml = f.options.length === 1
      ? (opt0.price != null
          ? `<div class="fruit-price">${fmt(opt0.price)}</div>`
          : `<div class="fruit-price por">Price on Request</div>`)
      : `<div class="fruit-price" id="fruit-price-${f.id}">${fmt(opt0.price) || 'Price on Request'}</div>`;

    const unitSel = f.options.length > 1
      ? `<select class="unit-select" id="sel-${f.id}" aria-label="Select unit for ${f.name}">
           ${f.options.map((o) => `<option value="${o.id}">${o.unit}</option>`).join('')}
         </select>`
      : `<div style="font-size:12px;color:var(--text-mid)">${opt0.unit}</div>
         <input type="hidden" id="sel-${f.id}" value="${opt0.id}"/>`;

    return `
      <div class="fruit-card">
        <div class="fruit-name">${f.name}</div>
        ${unitSel}
        ${priceHtml}
        <button class="${isPor ? 'btn-add por' : 'btn-add'}" data-id="${f.id}" data-cat="fruit"
                aria-label="Add ${f.name} to cart">
          ${isPor ? '+ Request' : '+ Add'}
        </button>
      </div>`;
  }).join('');

  // Price update on select change
  FRUITS.forEach((f) => {
    if (f.options.length < 2) return;
    const sel = document.getElementById('sel-' + f.id);
    if (sel) {
      sel.addEventListener('change', () => {
        const opt = f.options.find((o) => o.id === sel.value);
        const el = document.getElementById('fruit-price-' + f.id);
        if (el && opt) {
          el.textContent = opt.price != null ? fmt(opt.price) : 'Price on Request';
          el.className = 'fruit-price' + (opt.price == null ? ' por' : '');
        }
      });
    }
  });
}

// ── Add to cart ───────────────────────────────────────────────────
function addToCart(productId, category) {
  const allProducts = [...VEGETABLES, ...FRUITS];
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  const opt = getSelectedOption(product);
  const existing = cart.find((i) => i.optionId === opt.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      optionId: opt.id,
      name: product.name,
      unit: opt.unit,
      price: opt.price,
      qty: 1,
    });
  }
  renderCart();
  openCart();
}

// ── Remove / update qty ────────────────────────────────────────────
function updateQty(optionId, delta) {
  const idx = cart.findIndex((i) => i.optionId === optionId);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  renderCart();
}

// ── Render cart ───────────────────────────────────────────────────
function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = count;

  const list = document.getElementById('cartList');
  const empty = document.getElementById('cartEmpty');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    list.innerHTML = '';
    empty.style.display = '';
    footer.style.display = 'none';
    return;
  }

  empty.style.display = 'none';
  footer.style.display = '';

  list.innerHTML = cart.map((item) => {
    const lineTotal = item.price != null ? fmt(item.price * item.qty) : null;
    return `
      <li class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-unit">${item.unit}</div>
          ${lineTotal
            ? `<div class="cart-item-line">${lineTotal}</div>`
            : `<div class="cart-item-por">Price on request</div>`}
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-opt="${item.optionId}" data-delta="-1" aria-label="Decrease">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" data-opt="${item.optionId}" data-delta="1" aria-label="Increase">+</button>
        </div>
      </li>`;
  }).join('');

  const { total, hasNullPrice } = cartTotal();
  const totalEl = document.getElementById('cartTotal');
  const noteEl = document.getElementById('totalNote');
  totalEl.textContent = fmt(total) || '₦0';
  noteEl.textContent = hasNullPrice ? '(+ price-on-request items)' : '';
}

// ── Open / close cart ─────────────────────────────────────────────
function openCart() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Checkout modal ────────────────────────────────────────────────
function openCheckout() {
  closeCart();
  showStep('stepCustomer');
  document.getElementById('checkoutOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCheckout() {
  document.getElementById('checkoutOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function showStep(id) {
  ['stepCustomer', 'stepPayment', 'stepLoading', 'stepSuccess', 'stepError'].forEach((s) => {
    document.getElementById(s).style.display = s === id ? '' : 'none';
  });
}

// ── Order summary mini ────────────────────────────────────────────
function renderOrderSummaryMini() {
  const { total, hasNullPrice } = cartTotal();
  const rows = cart.map((item) => {
    const lineTotal = item.price != null ? fmt(item.price * item.qty) : 'On request';
    return `<div class="osm-row">
      <span>${item.name} × ${item.qty} <small>(${item.unit})</small></span>
      <span>${lineTotal}</span>
    </div>`;
  }).join('');
  const totalLine = `<div class="osm-row osm-total">
    <span>Total</span>
    <span>${fmt(total)}${hasNullPrice ? ' + requests' : ''}</span>
  </div>`;
  document.getElementById('orderSummaryMini').innerHTML = rows + totalLine;
}

// ── Validation ────────────────────────────────────────────────────
function validateCustomer() {
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const email = document.getElementById('custEmail').value.trim();
  let valid = true;

  const setErr = (id, msg) => {
    const el = document.getElementById(id);
    el.textContent = msg;
    const input = el.previousElementSibling;
    if (msg) input.classList.add('invalid');
    else input.classList.remove('invalid');
    if (msg) valid = false;
  };

  setErr('errName', name.length < 2 ? 'Please enter your full name.' : '');
  setErr('errPhone', !/^[0-9+\s\-()]{7,15}$/.test(phone) ? 'Please enter a valid phone number.' : '');
  setErr('errEmail', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Please enter a valid email address.' : '');

  return valid ? { name, phone, email } : null;
}

// ── Submit order ──────────────────────────────────────────────────
async function submitOrder(customer) {
  showStep('stepLoading');
  const { total, hasNullPrice } = cartTotal();
  const payload = {
    customer,
    items: cart.map((i) => ({ name: i.name, unit: i.unit, price: i.price, qty: i.qty })),
    total: hasNullPrice ? null : total,
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Server error.');

    showStep('stepSuccess');
    document.getElementById('successMsg').textContent =
      `Your order #${data.shortId} has been received. ` +
      `We will verify your payment and send a confirmation to ${customer.email}.`;
    cart = [];
    renderCart();
  } catch (err) {
    showStep('stepError');
    document.getElementById('errorMsg').textContent = err.message;
  }
}

// ── Event wiring ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderVegetables();
  renderFruits();
  renderCart();

  // Cart toggle
  document.getElementById('cartToggle').addEventListener('click', () => {
    if (document.getElementById('cartPanel').classList.contains('open')) closeCart();
    else openCart();
  });
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);

  // Qty buttons in cart (event delegation)
  document.getElementById('cartList').addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;
    updateQty(btn.dataset.opt, parseInt(btn.dataset.delta, 10));
  });

  // Add-to-cart buttons (event delegation on whole doc)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    addToCart(btn.dataset.id, btn.dataset.cat);
  });

  // Checkout from cart
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) return;
    openCheckout();
  });

  // Checkout close
  document.getElementById('checkoutClose').addEventListener('click', closeCheckout);
  document.getElementById('checkoutOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeCheckout();
  });

  // Customer form submit
  document.getElementById('customerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const customer = validateCustomer();
    if (!customer) return;
    renderOrderSummaryMini();
    showStep('stepPayment');
  });

  // Back button
  document.getElementById('backToCustomer').addEventListener('click', () => showStep('stepCustomer'));

  // I Have Paid
  document.getElementById('iPaidBtn').addEventListener('click', () => {
    const customer = {
      name: document.getElementById('custName').value.trim(),
      phone: document.getElementById('custPhone').value.trim(),
      email: document.getElementById('custEmail').value.trim(),
    };
    submitOrder(customer);
  });

  // Success close
  document.getElementById('successClose').addEventListener('click', () => {
    closeCheckout();
    // Reset form
    document.getElementById('customerForm').reset();
  });

  // Error retry
  document.getElementById('errorRetry').addEventListener('click', () => {
    const customer = {
      name: document.getElementById('custName').value.trim(),
      phone: document.getElementById('custPhone').value.trim(),
      email: document.getElementById('custEmail').value.trim(),
    };
    submitOrder(customer);
  });
});
