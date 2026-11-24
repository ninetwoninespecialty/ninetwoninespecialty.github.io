(function () {
  var css = `
    .add-btn {
      margin-left: auto;
      flex: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.6);
      background: transparent;
      color: #fff;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
    }
    .add-btn:hover { background: rgba(255, 255, 255, 0.2); }
    .add-btn:active { transform: scale(0.9); }

    .cart-fab {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 50;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: none;
      background: #fff;
      color: #3d6564;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cart-fab .count {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 22px;
      height: 22px;
      padding: 0 5px;
      box-sizing: border-box;
      border-radius: 11px;
      background: #c99a62;
      color: #fff;
      font-size: 12px;
      line-height: 22px;
      text-align: center;
    }
    .cart-fab.pop { animation: cartPop 0.35s ease; }
    @keyframes cartPop {
      0% { transform: scale(1); }
      50% { transform: scale(1.18); }
      100% { transform: scale(1); }
    }
    .fly {
      position: fixed;
      z-index: 60;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #fff;
      pointer-events: none;
      transition: transform 0.6s cubic-bezier(0.5, 0, 0.75, 0.4), opacity 0.6s;
    }

    .cart-overlay {
      position: fixed;
      inset: 0;
      z-index: 65;
      background: rgba(0, 0, 0, 0.35);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s;
    }
    .cart-overlay.open { opacity: 1; pointer-events: auto; }

    .cart-panel {
      position: fixed;
      left: 50%;
      top: 50%;
      z-index: 70;
      box-sizing: border-box;
      width: min(88vw, 380px);
      max-height: 80vh;
      overflow-y: auto;
      padding: 22px 20px 18px;
      border-radius: 22px;
      background: #fffdf8;
      color: #2f3133;
      text-align: left;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
      opacity: 0;
      pointer-events: none;
      transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, 0px)))
        scale(0.04) rotate(12deg) skew(-14deg, 6deg);
      transition: transform 0.5s cubic-bezier(0.6, 0, 0.9, 0.35), opacity 0.4s;
    }
    .cart-panel.open {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, -50%) scale(1) rotate(0deg) skew(0deg, 0deg);
      transition: transform 0.55s cubic-bezier(0.2, 0.9, 0.25, 1), opacity 0.3s;
    }
    .cart-panel h3 {
      margin: 0 0 14px;
      font-family: 'Raleway', Arial, sans-serif;
      font-weight: 300;
      font-size: 16px;
      letter-spacing: 4px;
      text-align: center;
      text-transform: uppercase;
    }
    .cart-min {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 1px solid #c8c8c2;
      background: #fff;
      color: #2f3133;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
    }
    .cart-list { max-height: 45vh; overflow-y: auto; }
    .cart-empty { margin: 18px 0; text-align: center; color: #6b6f72; font-size: 14px; }
    .cart-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid #ece7de;
    }
    .cr-name { flex: 1; font-size: 14px; letter-spacing: 1px; }
    .cr-qty { display: flex; align-items: center; gap: 8px; font-size: 14px; }
    .qb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid #c8c8c2;
      background: #fff;
      color: #2f3133;
      line-height: 1;
      cursor: pointer;
    }
    .cr-price { min-width: 44px; text-align: right; font-size: 14px; color: #3d6564; }
    .cart-total {
      display: flex;
      justify-content: space-between;
      padding-top: 14px;
      font-size: 18px;
      letter-spacing: 1px;
    }
    .cart-clear {
      display: block;
      margin: 14px auto 0;
      border: none;
      background: none;
      color: #6b6f72;
      font-size: 13px;
      text-decoration: underline;
      cursor: pointer;
    }
    @media (prefers-reduced-motion: reduce) {
      .cart-panel, .cart-panel.open { transition: opacity 0.2s; }
      .cart-panel { transform: translate(-50%, -50%); }
    }
  `;
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var KEY = "nn9-cart";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch (e) {}
  }

  var cart = load();

  var fab = document.createElement("button");
  fab.className = "cart-fab";
  fab.setAttribute("aria-label", "Cart");
  fab.innerHTML =
    '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" ' +
    'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>' +
    '<span class="count">0</span>';
  document.body.appendChild(fab);
  var countEl = fab.querySelector(".count");

  var overlay = document.createElement("div");
  overlay.className = "cart-overlay";
  var panel = document.createElement("div");
  panel.className = "cart-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Your order");
  panel.setAttribute("aria-hidden", "true");
  panel.innerHTML =
    '<button class="cart-min" aria-label="Minimize cart">&minus;</button>' +
    "<h3>Your Order</h3>" +
    '<div class="cart-list"></div>' +
    '<div class="cart-total"><span>Total</span><span class="total-num">0</span></div>' +
    '<button class="cart-clear">Clear all</button>';
  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  var listEl = panel.querySelector(".cart-list");
  var totalEl = panel.querySelector(".total-num");
  var minBtn = panel.querySelector(".cart-min");
  var clearBtn = panel.querySelector(".cart-clear");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isOpen = false;

  function setOrigin() {
    var f = fab.getBoundingClientRect();
    panel.style.setProperty("--dx", f.left + f.width / 2 - window.innerWidth / 2 + "px");
    panel.style.setProperty("--dy", f.top + f.height / 2 - window.innerHeight / 2 + "px");
  }

  function render() {
    var groups = {};
    cart.forEach(function (it) {
      var k = it.name + "|" + it.price;
      if (!groups[k]) groups[k] = { name: it.name, price: it.price, qty: 0 };
      groups[k].qty++;
    });
    var keys = Object.keys(groups);
    listEl.innerHTML = "";
    if (!keys.length) {
      listEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    }
    keys.forEach(function (k) {
      var g = groups[k];
      var row = document.createElement("div");
      row.className = "cart-row";
      row.innerHTML =
        '<span class="cr-name"></span>' +
        '<span class="cr-qty"><button class="qb minus" aria-label="Remove one">&minus;</button>' +
        '<b></b><button class="qb plus" aria-label="Add one">+</button></span>' +
        '<span class="cr-price"></span>';
      row.querySelector(".cr-name").textContent = g.name;
      row.querySelector("b").textContent = g.qty;
      row.querySelector(".cr-price").textContent = g.price * g.qty;
      row.querySelector(".minus").addEventListener("click", function () {
        removeOne(g.name, g.price);
      });
      row.querySelector(".plus").addEventListener("click", function () {
        cart.push({ name: g.name, price: g.price });
        update();
      });
      listEl.appendChild(row);
    });
    var total = cart.reduce(function (sum, it) { return sum + it.price; }, 0);
    totalEl.textContent = total;
  }

  function update() {
    save();
    countEl.textContent = cart.length;
    render();
  }

  function removeOne(name, price) {
    for (var i = cart.length - 1; i >= 0; i--) {
      if (cart[i].name === name && cart[i].price === price) {
        cart.splice(i, 1);
        break;
      }
    }
    update();
  }

  function openCart() {
    setOrigin();
    render();
    isOpen = true;
    overlay.classList.add("open");
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
  }
  function closeCart() {
    setOrigin();
    isOpen = false;
    overlay.classList.remove("open");
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
  }

  fab.addEventListener("click", function () {
    if (isOpen) closeCart();
    else openCart();
  });
  overlay.addEventListener("click", closeCart);
  minBtn.addEventListener("click", closeCart);
  clearBtn.addEventListener("click", function () {
    cart = [];
    update();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) closeCart();
  });
  window.addEventListener("resize", setOrigin);

  function fly(fromBtn) {
    if (reduceMotion) return;
    var b = fromBtn.getBoundingClientRect();
    var f = fab.getBoundingClientRect();
    var dot = document.createElement("div");
    dot.className = "fly";
    dot.style.left = b.left + b.width / 2 - 8 + "px";
    dot.style.top = b.top + b.height / 2 - 8 + "px";
    document.body.appendChild(dot);
    void dot.offsetWidth;
    var dx = f.left + f.width / 2 - (b.left + b.width / 2);
    var dy = f.top + f.height / 2 - (b.top + b.height / 2);
    dot.style.transform = "translate(" + dx + "px," + dy + "px) scale(0.5)";
    dot.style.opacity = "0.5";
    setTimeout(function () { dot.remove(); }, 650);
  }

  function addToCart(name, price, btn) {
    cart.push({ name: name, price: price });
    update();
    fly(btn);
    setTimeout(function () {
      fab.classList.remove("pop");
      void fab.offsetWidth;
      fab.classList.add("pop");
    }, 550);
  }

  document.querySelectorAll(".item").forEach(function (item) {
    var priceEl = item.querySelector(".price");
    var nameEl = item.querySelector("span");
    if (!priceEl || !nameEl) return;
    var priceText = priceEl.textContent.trim();
    if (!/^\d+$/.test(priceText)) return;
    var name = nameEl.childNodes[0].textContent.trim();
    var price = parseInt(priceText, 10);

    var btn = document.createElement("button");
    btn.className = "add-btn";
    btn.setAttribute("aria-label", "Add " + name + " to cart");
    btn.textContent = "+";
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      addToCart(name, price, btn);
    });
    item.appendChild(btn);
  });

  setOrigin();
  update();
})();