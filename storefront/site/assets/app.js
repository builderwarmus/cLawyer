(function () {
  "use strict";

  var PRODUCTS = window.WALLY_PRODUCTS || [];
  var ART = window.WALLY_ART || {};

  var money = function (c) { return "$" + (c / 100).toFixed(2); };
  var byId = function (id) {
    return PRODUCTS.filter(function (p) { return p.id === id; })[0];
  };

  // Show a photo if the product has "img", otherwise the drawing in "art".
  function artHtml(p) {
    if (p.img) {
      return '<img src="' + p.img + '" alt="' + escapeHtml(p.name) + '" />';
    }
    return ART[p.art] || "";
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  var filter = "All";
  var cart = {}; // id -> qty

  var el = function (id) { return document.getElementById(id); };

  // ---------- Filters ----------
  function renderFilters() {
    var cats = ["All"];
    PRODUCTS.forEach(function (p) {
      if (cats.indexOf(p.cat) === -1) cats.push(p.cat);
    });
    el("filters").innerHTML = cats.map(function (c) {
      return '<button class="chip ' + (c === filter ? "active" : "") +
        '" data-cat="' + escapeHtml(c) + '">' + escapeHtml(c) + "</button>";
    }).join("");
    Array.prototype.forEach.call(el("filters").children, function (b) {
      b.addEventListener("click", function () {
        filter = b.getAttribute("data-cat");
        renderFilters();
        renderGrid();
      });
    });
  }

  // ---------- Grid ----------
  function renderGrid() {
    var shown = filter === "All"
      ? PRODUCTS
      : PRODUCTS.filter(function (p) { return p.cat === filter; });
    el("grid").innerHTML = shown.map(function (p) {
      return '<button class="card" data-id="' + p.id + '">' +
        '<div class="card-image">' + artHtml(p) + "</div>" +
        '<div class="card-body">' +
        '<span class="card-cat">' + escapeHtml(p.cat) + "</span>" +
        '<h3 class="card-name">' + escapeHtml(p.name) + "</h3>" +
        '<p class="card-price">' + money(p.cents) + "</p>" +
        "</div></button>";
    }).join("");
    Array.prototype.forEach.call(el("grid").children, function (b) {
      b.addEventListener("click", function () { openProduct(b.getAttribute("data-id")); });
    });
  }

  // ---------- Product modal ----------
  function openProduct(id) {
    var p = byId(id);
    if (!p) return;
    el("mImg").innerHTML = artHtml(p);
    el("mCat").textContent = p.cat;
    el("mTitle").textContent = p.name;
    el("mPrice").textContent = money(p.cents);
    el("mDesc").textContent = p.desc;
    var addBtn = el("mAdd");
    addBtn.textContent = "Add to cart";
    addBtn.disabled = false;
    addBtn.onclick = function () {
      addToCart(id, 1);
      addBtn.textContent = "✓ Added — view cart";
      addBtn.onclick = function () { closeAll(); openCart(); };
    };
    el("scrim").classList.add("open");
    var m = el("modal");
    m.classList.add("open");
    m.setAttribute("aria-hidden", "false");
  }

  // ---------- Cart ----------
  function addToCart(id, n) {
    cart[id] = (cart[id] || 0) + (n || 1);
    updateBadge();
  }
  function changeQty(id, delta) {
    var next = (cart[id] || 0) + delta;
    if (next <= 0) delete cart[id];
    else cart[id] = next;
    updateBadge();
    renderCart();
  }
  function removeItem(id) {
    delete cart[id];
    updateBadge();
    renderCart();
  }
  function totalCents() {
    var t = 0;
    Object.keys(cart).forEach(function (id) {
      var p = byId(id);
      if (p) t += p.cents * cart[id];
    });
    return t;
  }
  function count() {
    var n = 0;
    Object.keys(cart).forEach(function (id) { n += cart[id]; });
    return n;
  }
  function updateBadge() {
    var b = el("cartBadge");
    var n = count();
    b.textContent = n;
    if (n > 0) b.classList.add("show");
    else b.classList.remove("show");
  }

  function openCart() {
    renderCart();
    el("scrim").classList.add("open");
    var d = el("drawer");
    d.classList.add("open");
    d.setAttribute("aria-hidden", "false");
  }

  function renderCart(errorMsg) {
    var body = el("drawerBody");
    var foot = el("drawerFoot");
    var ids = Object.keys(cart);
    if (ids.length === 0) {
      body.innerHTML = '<div class="empty">Your cart is empty.<br/>Find something handmade to love.</div>';
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = ids.map(function (id) {
      var p = byId(id);
      return '<div class="line">' +
        '<div class="line-thumb">' + artHtml(p) + "</div>" +
        '<div class="line-main">' +
        '<div class="line-name">' + escapeHtml(p.name) + "</div>" +
        '<div class="line-sub">' + money(p.cents) + " each</div>" +
        '<button class="line-remove" data-remove="' + id + '">Remove</button>' +
        "</div>" +
        '<div class="qty">' +
        '<button data-dec="' + id + '" aria-label="Decrease">−</button>' +
        "<span>" + cart[id] + "</span>" +
        '<button data-inc="' + id + '" aria-label="Increase">+</button>' +
        "</div></div>";
    }).join("");

    foot.innerHTML =
      (errorMsg ? '<div class="error-banner">' + escapeHtml(errorMsg) + "</div>" : "") +
      '<div class="total-row"><span>Total</span><span class="amt">' + money(totalCents()) + "</span></div>" +
      '<p class="muted small" style="margin:0 0 14px">Shipping is collected on the secure payment page.</p>' +
      '<button class="btn btn-primary btn-block" id="checkoutBtn">Checkout</button>';

    wireCartButtons();
  }

  function wireCartButtons() {
    var body = el("drawerBody");
    each(body.querySelectorAll("[data-remove]"), function (b) {
      b.onclick = function () { removeItem(b.getAttribute("data-remove")); };
    });
    each(body.querySelectorAll("[data-dec]"), function (b) {
      b.onclick = function () { changeQty(b.getAttribute("data-dec"), -1); };
    });
    each(body.querySelectorAll("[data-inc]"), function (b) {
      b.onclick = function () { changeQty(b.getAttribute("data-inc"), 1); };
    });
    var co = el("checkoutBtn");
    if (co) co.onclick = checkout;
  }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  // ---------- Checkout (talks to the Cloudflare payment function) ----------
  function checkout() {
    var btn = el("checkoutBtn");
    if (btn) { btn.disabled = true; btn.textContent = "Starting checkout…"; }

    var items = Object.keys(cart).map(function (id) {
      return { id: id, quantity: cart[id] };
    });

    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: items }),
    })
      .then(function (res) {
        return res.json().then(function (data) { return { ok: res.ok, data: data }; });
      })
      .then(function (r) {
        if (!r.ok) {
          renderCart((r.data && r.data.error) || "Sorry, checkout could not start.");
          return;
        }
        if (r.data.url) {
          window.location.href = r.data.url; // secure Stripe card page
          return;
        }
        if (r.data.demo) {
          showDemoThanks();
          return;
        }
        renderCart("Unexpected response from the server.");
      })
      .catch(function () {
        renderCart("Could not reach the server. Please try again.");
      });
  }

  function showDemoThanks() {
    cart = {};
    updateBadge();
    el("drawerFoot").innerHTML = "";
    el("drawerBody").innerHTML =
      '<div class="thanks">' +
      '<div class="mark">✓</div>' +
      '<h2 style="margin:0 0 8px">Thank you!</h2>' +
      '<p class="muted">This was a <strong>demo</strong> checkout, so no real payment was taken.</p>' +
      '<p class="muted small">Once your Stripe key is added on Cloudflare, this button sends ' +
      "customers to a secure page to pay by Visa, debit, or credit card.</p>" +
      '<button class="btn btn-ghost btn-block" id="backBtn" style="margin-top:18px">Back to shop</button>' +
      "</div>";
    var back = el("backBtn");
    if (back) back.onclick = closeAll;
  }

  // ---------- Open/close ----------
  function closeAll() {
    el("scrim").classList.remove("open");
    var m = el("modal");
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
    var d = el("drawer");
    d.classList.remove("open");
    d.setAttribute("aria-hidden", "true");
  }

  // ---------- Wire up static controls ----------
  document.addEventListener("DOMContentLoaded", function () {
    el("brandBtn").addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    el("openCartBtn").addEventListener("click", openCart);
    el("scrim").addEventListener("click", closeAll);
    el("modalClose").addEventListener("click", closeAll);
    el("drawerClose").addEventListener("click", closeAll);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAll();
    });
    renderFilters();
    renderGrid();
    updateBadge();
  });
})();
