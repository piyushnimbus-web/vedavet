(function () {
  const API =
    window.VEDAVET_API_BASE ||
    (location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "http://localhost:4000/api/v1"
      : "/beta/node/api/v1");
  let overlay;
  let basket = [];
  const q = (s, ctx = document) => ctx.querySelector(s),
    escape = (s) =>
      String(s ?? "").replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c],
      );
  async function get(p) {
    let r = await fetch(API + p);
    if (!r.ok) throw Error("Backend unavailable: " + r.status);
    return r.json();
  }
  async function post(p, data) {
    let r = await fetch(API + p, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    let b = await r.json();
    if (!r.ok)
      throw Error(b.message?.join?.(", ") || b.message || "Request failed");
    return b;
  }
  function show(html) {
    overlay = document.createElement("div");
    overlay.className = "vv-overlay";
    overlay.innerHTML =
      '<div class="vv-modal"><button class="vv-close" type="button">✕ Close</button>' +
      html +
      "</div>";
    document.body.append(overlay);
    q(".vv-close", overlay).onclick = close;
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
  }
  function close() {
    overlay?.remove();
    overlay = null;
  }
  async function booking() {
    show(
      '<h2>Book an Appointment</h2><p class="vv-message">Complete the form to register a test appointment in the local database.</p><form id="vv-book"><div class="vv-grid"><label>Owner Name<input required name="ownerName"></label><label>Mobile<input required name="phone" minlength="10"></label><label>Email (optional)<input type="email" name="email"></label><label>Pet Name<input required name="petName"></label><label>Branch<select required name="branchId" id="vv-branch"></select></label><label>Doctor<select required name="doctorId" id="vv-doctor"></select></label><label>Date<input required type="date" name="date"></label><label>Time<select required name="time"><option>10:00</option><option>11:00</option><option>12:00</option><option>14:00</option><option>15:00</option><option>16:00</option></select></label></div><button class="vv-btn">Confirm appointment</button><p class="vv-message" id="vv-status"></p></form>',
    );
    try {
      let [branches, doctors] = await Promise.all([
        get("/public/branches"),
        get("/public/doctors"),
      ]);
      q("#vv-branch").innerHTML = branches
        .map(
          (b) => `<option value="${escape(b.id)}">${escape(b.name)}</option>`,
        )
        .join("");
      function update() {
        q("#vv-doctor").innerHTML = doctors
          .filter((d) => d.branchId === q("#vv-branch").value)
          .map(
            (d) => `<option value="${escape(d.id)}">${escape(d.name)}</option>`,
          )
          .join("");
      }
      q("#vv-branch").onchange = update;
      update();
    } catch (e) {
      q("#vv-status").textContent = e.message;
    }
    q("#vv-book").onsubmit = async (e) => {
      e.preventDefault();
      let data = Object.fromEntries(new FormData(e.target));
      try {
        let r = await post("/public/appointments", data);
        q("#vv-status").textContent =
          "Booked! Appointment ID: " + r.id + " • Status: " + r.status;
        e.target.reset();
      } catch (err) {
        q("#vv-status").textContent = "Could not book: " + err.message;
      }
    };
  }
  async function shop() {
    show(
      '<div class="vv-shop"><h2>VedaVet Pet Shop</h2><p>Demo store • no online payment gateway connected</p><div id="vv-products" class="vv-products">Loading products...</div><hr><div id="vv-cart">Cart: 0 items</div><form id="vv-order"><div class="vv-grid"><label>Customer name<input name="customerName" required></label><label>Mobile<input name="phone" required></label></div><label>Delivery address<textarea name="address" required></textarea></label><button class="vv-btn">Place test order (unpaid)</button><p class="vv-message" id="vv-status"></p></form></div>',
    );
    try {
      let products = await get("/public/products");
      q("#vv-products").innerHTML = products
        .map(
          (p) =>
            `<div class="vv-product"><img src="${escape(p.imageUrl || "/beta/node/images/product-image-1.jpg")}" onerror="this.src='/beta/node/images/product-image-1.jpg'"><strong>${escape(p.name)}</strong><div>₹${Number(p.price).toFixed(2)}</div><small>Stock: ${p.stock}</small><p><button class="vv-btn" data-product="${escape(p.id)}">Add to cart</button></p></div>`,
        )
        .join("");
      q("#vv-products").onclick = (e) => {
        let id = e.target.dataset.product;
        if (!id) return;
        basket.push(id);
        q("#vv-cart").textContent =
          "Cart: " +
          basket.length +
          " item(s) • ₹" +
          basket
            .reduce(
              (t, x) =>
                t + Number(products.find((p) => p.id === x)?.price || 0),
              0,
            )
            .toFixed(2);
      };
    } catch (e) {
      q("#vv-products").textContent = e.message;
    }
    q("#vv-order").onsubmit = async (e) => {
      e.preventDefault();
      if (!basket.length) {
        q("#vv-status").textContent = "Please add a product";
        return;
      }
      try {
        let d = Object.fromEntries(new FormData(e.target));
        let r = await post("/public/orders", {
          ...d,
          items: basket.map((productId) => ({ productId, quantity: 1 })),
        });
        q("#vv-status").textContent =
          "Test order created: " + r.id + " (unpaid)";
        basket = [];
        q("#vv-cart").textContent = "Cart: 0 items";
      } catch (err) {
        q("#vv-status").textContent = err.message;
      }
    };
  }
  window.VedaVetDemo = { booking, shop };
  document.addEventListener("click", (e) => {
    let a = e.target.closest("a,button");
    if (!a) return;
    let label = (a.textContent || "").trim().toLowerCase();
    if (
      label.includes("book appointment") ||
      label.includes("book an appointment")
    ) {
      e.preventDefault();
      booking();
    } else if (
      label.includes("pet shop") ||
      label.includes("explore pet shop") ||
      a.getAttribute("href") === "/shop"
    ) {
      e.preventDefault();
      shop();
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    let d = document.createElement("div");
    d.className = "vv-toplinks";
    d.innerHTML =
      '<a href="#" id="vv-shop-link">🛍 Shop</a><a href="' +
      (location.hostname === "localhost" || location.hostname === "127.0.0.1"
        ? "http://localhost:4000"
        : "") +
      '/beta/node/staff/">🔐 Staff Portal</a>';
    document.body.appendChild(d);
    q("#vv-shop-link").onclick = (e) => {
      e.preventDefault();
      shop();
    };
    if (location.pathname === "/shop") shop();
    if (location.pathname === "/book-appointment") booking();
  });
})();
