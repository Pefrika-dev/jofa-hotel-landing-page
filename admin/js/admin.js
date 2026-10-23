/* ============================================================
   HOTEL JOFA — Admin Dashboard Logic
   ============================================================ */

(function () {
  "use strict";

  const K = Jofa.K;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  let currentView = "overview";

  /* ---------- Toast ---------- */
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove("show"), 3000);
  }

  /* ---------- Auth ---------- */
  function isLoggedIn() { return localStorage.getItem(K.adminSession) === "1"; }
  function initAuth() {
    if (isLoggedIn()) showDash(); else showLogin();
    $("#loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const u = $("#loginUser").value.trim();
      const p = $("#loginPass").value;
      if (u === "admin" && p === "JofaDemo2026!") {
        localStorage.setItem(K.adminSession, "1");
        showDash();
      } else {
        $("#loginError").textContent = "Invalid credentials (demo).";
      }
    });
    $("#logoutBtn").addEventListener("click", () => {
      localStorage.removeItem(K.adminSession);
      showLogin();
    });
  }
  function showLogin() {
    $("#loginScreen").style.display = "grid";
    $("#dash").style.display = "none";
  }
  function showDash() {
    $("#loginScreen").style.display = "none";
    $("#dash").style.display = "grid";
    if (!window.__dashInit) { window.__dashInit = true; initDash(); }
    else { renderView(currentView); }
  }

  /* ---------- Theme/Lang ---------- */
  function initThemeToggle() {
    Jofa.initTheme();
    const btn = $("#dashThemeToggle");
    if (btn) btn.addEventListener("click", () => {
      const next = Jofa.getTheme() === "light" ? "dark" : "light";
      Jofa.setTheme(next);
      Jofa.set(K.theme, next);
    });
  }
  function initLangToggle() {
    const cur = Jofa.get(K.lang, "en");
    $$(".dash-top .lang-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === cur);
      b.addEventListener("click", () => {
        const l = b.dataset.lang;
        Jofa.set(K.lang, l);
        $$(".dash-top .lang-btn").forEach((x) => x.classList.toggle("active", x.dataset.lang === l));
        Jofa.applyI18n(document);
        renderView(currentView);
      });
    });
  }

  /* ---------- Sidebar ---------- */
  function initSidebar() {
    $$("#sideNav button").forEach((b) => {
      b.addEventListener("click", () => {
        setView(b.dataset.view);
        $("#sidebar").classList.remove("open");
      });
    });
    $("#sideToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  }
  function setView(v) {
    currentView = v;
    $$("#sideNav button").forEach((b) => b.classList.toggle("active", b.dataset.view === v));
    const titles = {
      overview: "Overview", bookings: "Bookings", rooms: "Room Management",
      facilities: "Facilities", menu: "Restaurant Menu", events: "Event Inquiries",
      contacts: "Contact Inquiries", gallery: "Gallery Management", news: "News & Updates",
      testimonials: "Testimonials", settings: "Website Settings", theme: "Theme Settings",
      language: "Language Settings",
    };
    $("#viewTitle").textContent = titles[v] || v;
    renderView(v);
  }

  /* ---------- Modal ---------- */
  function showModal(html) {
    let m = $("#adminModal");
    if (!m) {
      m = document.createElement("div");
      m.id = "adminModal";
      m.className = "modal";
      m.innerHTML = `<div class="modal-backdrop" data-close></div><div class="modal-dialog" role="dialog" aria-modal="true"><button class="modal-close" data-close aria-label="Close">×</button><div id="adminModalBody"></div></div>`;
      document.body.appendChild(m);
      m.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
      m.addEventListener("click", (e) => { if (e.target === m) closeModal(); });
    }
    $("#adminModalBody").innerHTML = html;
    m.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));
    m.classList.add("open");
  }
  function closeModal() { const m = $("#adminModal"); if (m) m.classList.remove("open"); }

  function confirmAction(msg) { return window.confirm(msg || Jofa.t("common.confirm")); }

  /* ---------- Render dispatch ---------- */
  function renderView(v) {
    const c = $("#dashContent");
    c.innerHTML = "";
    switch (v) {
      case "overview": renderOverview(c); break;
      case "bookings": renderBookings(c); break;
      case "rooms": renderRoomsAdmin(c); break;
      case "facilities": renderFacilitiesAdmin(c); break;
      case "menu": renderMenuAdmin(c); break;
      case "events": renderEventsAdmin(c); break;
      case "contacts": renderContactsAdmin(c); break;
      case "gallery": renderGalleryAdmin(c); break;
      case "news": renderNewsAdmin(c); break;
      case "testimonials": renderTestimonialsAdmin(c); break;
      case "settings": renderSettings(c); break;
      case "theme": renderTheme(c); break;
      case "language": renderLanguage(c); break;
    }
  }

  /* ---------- Overview ---------- */
  function renderOverview(c) {
    const bookings = Jofa.get(K.bookings, []);
    const events = Jofa.get(K.events, []);
    const contacts = Jofa.get(K.contacts, []);
    const pending = bookings.filter((b) => b.status === "Pending").length;
    const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
    const value = bookings.reduce((s, b) => s + (b.total || 0), 0);
    c.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card"><div class="label">Total Demo Bookings</div><div class="value">${bookings.length}</div></div>
        <div class="stat-card"><div class="label">Pending</div><div class="value">${pending}</div></div>
        <div class="stat-card"><div class="label">Confirmed</div><div class="value">${confirmed}</div></div>
        <div class="stat-card"><div class="label">Event Inquiries</div><div class="value">${events.length}</div></div>
        <div class="stat-card"><div class="label">Contact Inquiries</div><div class="value">${contacts.length}</div></div>
        <div class="stat-card"><div class="label">Estimated Demo Value</div><div class="value">KES ${value.toLocaleString()}</div></div>
      </div>
      <div class="card">
        <h3>Booking Status Summary</h3>
        <div id="statusChart"></div>
      </div>
      <div class="card">
        <h3>Recent Bookings</h3>
        <div class="table-wrap"><table><thead><tr><th>Ref</th><th>Guest</th><th>Room</th><th>Check-in</th><th>Status</th></tr></thead><tbody id="recentBookings"></tbody></table></div>
      </div>
      <div class="card">
        <h3>Recent Inquiries</h3>
        <div class="table-wrap"><table><thead><tr><th>Name</th><th>Type</th><th>Date</th></tr></thead><tbody id="recentInq"></tbody></table></div>
      </div>
      <div class="card">
        <h3>Demo Data</h3>
        <button class="btn btn-danger btn-sm" id="resetDemoBtn">Reset Demo Data</button>
        <p style="font-size:12px;color:var(--text-muted);margin-top:8px;">Resets all demonstration data to original state after confirmation.</p>
      </div>
    `;
    // status chart
    const statuses = ["Pending", "Confirmed", "Checked In", "Checked Out", "Cancelled"];
    const chart = $("#statusChart");
    const max = Math.max(1, ...statuses.map((s) => bookings.filter((b) => b.status === s).length));
    statuses.forEach((s) => {
      const n = bookings.filter((b) => b.status === s).length;
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:10px;margin:6px 0;";
      row.innerHTML = `<span style="width:110px;font-size:13px;">${s}</span><div style="flex:1;background:var(--bg-alt);height:14px;border-radius:7px;overflow:hidden;"><div style="width:${(n / max) * 100}%;height:100%;background:var(--gold);"></div></div><span style="width:30px;text-align:right;font-size:13px;">${n}</span>`;
      chart.appendChild(row);
    });
    const rb = $("#recentBookings");
    bookings.slice(0, 6).forEach((b) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${b.ref}</td><td>${b.guestName}${b.isDemo ? ' <span class="badge demo">DEMO</span>' : ""}</td><td>${b.roomName}</td><td>${b.checkIn}</td><td><span class="badge ${badgeClass(b.status)}">${b.status}</span></td>`;
      rb.appendChild(tr);
    });
    if (!bookings.length) rb.innerHTML = `<tr><td colspan="5" class="empty">${Jofa.t("common.empty")}</td></tr>`;
    const ri = $("#recentInq");
    const inqs = [...events.map((e) => ({ name: e.name, type: "Event", date: e.createdAt.slice(0, 10) })), ...contacts.map((c) => ({ name: c.name, type: "Contact", date: c.createdAt.slice(0, 10) }))].slice(0, 6);
    inqs.forEach((i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${i.name}</td><td>${i.type}</td><td>${i.date}</td>`;
      ri.appendChild(tr);
    });
    if (!inqs.length) ri.innerHTML = `<tr><td colspan="3" class="empty">${Jofa.t("common.empty")}</td></tr>`;
    $("#resetDemoBtn").addEventListener("click", () => {
      if (confirmAction("Reset all demo data to original state?")) {
        Jofa.resetDemoData();
        Jofa.broadcast();
        toast("Demo data reset.");
        renderView(currentView);
      }
    });
  }

  function badgeClass(s) {
    return (s || "").toLowerCase().replace(/\s/g, "");
  }

  /* ---------- Bookings ---------- */
  function renderBookings(c) {
    const bookings = Jofa.get(K.bookings, []);
    c.innerHTML = `
      <div class="toolbar">
        <input type="text" id="bkSearch" placeholder="Search name or ref..." />
        <select id="bkFilter"><option value="">All statuses</option>
          <option>Pending</option><option>Confirmed</option><option>Checked In</option><option>Checked Out</option><option>Cancelled</option>
        </select>
        <button class="btn btn-outline btn-sm" id="exportCsv">Export CSV</button>
      </div>
      <div class="table-wrap"><table><thead><tr>
        <th>Ref</th><th>Guest</th><th>Phone</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Nights</th><th>Total</th><th>Status</th><th>Actions</th>
      </tr></thead><tbody id="bkTable"></tbody></table></div>
    `;
    const draw = () => {
      const q = $("#bkSearch").value.toLowerCase();
      const f = $("#bkFilter").value;
      const rows = bookings.filter((b) => {
        if (f && b.status !== f) return false;
        if (q && !((b.guestName || "").toLowerCase().includes(q) || (b.ref || "").toLowerCase().includes(q))) return false;
        return true;
      });
      const tb = $("#bkTable");
      tb.innerHTML = "";
      rows.forEach((b) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${b.ref}</td><td>${b.guestName}${b.isDemo ? ' <span class="badge demo">DEMO</span>' : ""}</td><td>${b.phone}</td><td>${b.roomName}</td>
          <td>${b.checkIn}</td><td>${b.checkOut}</td><td>${b.nights}</td><td>KES ${(b.total || 0).toLocaleString()}</td>
          <td><span class="badge ${badgeClass(b.status)}">${b.status}</span></td>
          <td>
            <button class="btn btn-ghost btn-sm" data-view="${b.id}">View</button>
            <select data-status="${b.id}" class="btn btn-ghost btn-sm">
              <option ${b.status === "Pending" ? "selected" : ""}>Pending</option>
              <option ${b.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
              <option ${b.status === "Checked In" ? "selected" : ""}>Checked In</option>
              <option ${b.status === "Checked Out" ? "selected" : ""}>Checked Out</option>
              <option ${b.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
            <button class="btn btn-danger btn-sm" data-del="${b.id}">Delete</button>
          </td>`;
        tb.appendChild(tr);
      });
      if (!rows.length) tb.innerHTML = `<tr><td colspan="10" class="empty">${Jofa.t("common.empty")}</td></tr>`;
      // events
      tb.querySelectorAll("[data-view]").forEach((btn) => btn.addEventListener("click", () => viewBooking(btn.dataset.view)));
      tb.querySelectorAll("[data-status]").forEach((sel) => sel.addEventListener("change", () => updateBookingStatus(sel.dataset.status, sel.value)));
      tb.querySelectorAll("[data-del]").forEach((btn) => btn.addEventListener("click", () => deleteBooking(btn.dataset.del)));
    };
    draw();
    $("#bkSearch").addEventListener("input", draw);
    $("#bkFilter").addEventListener("change", draw);
    $("#exportCsv").addEventListener("click", () => {
      const rows = Jofa.get(K.bookings, []).map((b) => ({
        ref: b.ref, guestName: b.guestName, phone: b.phone, email: b.email,
        roomName: b.roomName, checkIn: b.checkIn, checkOut: b.checkOut, nights: b.nights,
        total: b.total, status: b.status, createdAt: b.createdAt,
      }));
      const headers = ["ref", "guestName", "phone", "email", "roomName", "checkIn", "checkOut", "nights", "total", "status", "createdAt"];
      Jofa.downloadCSV("hotel-jofa-bookings.csv", Jofa.toCSV(rows, headers));
      toast("CSV exported.");
    });
  }

  function viewBooking(id) {
    const b = Jofa.get(K.bookings, []).find((x) => x.id === id);
    if (!b) return;
    showModal(`
      <h3>Booking Details</h3>
      <p><strong>Ref:</strong> ${b.ref}</p>
      <p><strong>Guest:</strong> ${b.guestName}</p>
      <p><strong>Phone:</strong> ${b.phone}</p>
      <p><strong>Email:</strong> ${b.email}</p>
      <p><strong>Room:</strong> ${b.roomName}</p>
      <p><strong>Guests:</strong> ${b.guests}</p>
      <p><strong>Check-in:</strong> ${b.checkIn}</p>
      <p><strong>Check-out:</strong> ${b.checkOut}</p>
      <p><strong>Nights:</strong> ${b.nights}</p>
      <p><strong>Total:</strong> KES ${(b.total || 0).toLocaleString()}</p>
      <p><strong>Special requests:</strong> ${b.specialRequests || "—"}</p>
      <p><strong>Status:</strong> ${b.status}</p>
      <p><strong>Created:</strong> ${b.createdAt}</p>
      ${b.isDemo ? '<p><span class="badge demo">DEMO DATA</span></p>' : ""}
    `);
  }
  function updateBookingStatus(id, status) {
    const list = Jofa.get(K.bookings, []);
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) { list[i].status = status; Jofa.set(K.bookings, list); Jofa.broadcast(); toast("Status updated."); }
  }
  function deleteBooking(id) {
    if (!confirmAction("Delete this booking?")) return;
    const list = Jofa.get(K.bookings, []).filter((x) => x.id !== id);
    Jofa.set(K.bookings, list);
    Jofa.broadcast();
    toast("Deleted.");
    renderView("bookings");
  }

  /* ---------- Rooms Admin ---------- */
  function renderRoomsAdmin(c) {
    const rooms = Jofa.get(K.rooms, []);
    c.innerHTML = `
      <div class="toolbar">
        <button class="btn btn-primary btn-sm" id="addRoomBtn">Add Room</button>
      </div>
      <div class="table-wrap"><table><thead><tr>
        <th>Name</th><th>Price (KES)</th><th>Bed</th><th>Capacity</th><th>Enabled</th><th>Actions</th>
      </tr></thead><tbody id="roomTable"></tbody></table></div>
    `;
    const draw = () => {
      const tb = $("#roomTable");
      tb.innerHTML = "";
      Jofa.get(K.rooms, []).forEach((r) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${r.name}${r.proposed ? " <em>(proposed)</em>" : ""}</td>
          <td>${r.price.toLocaleString()}</td>
          <td>${r.bed}</td>
          <td>${r.capacity}</td>
          <td>${r.enabled !== false ? "Yes" : "No"}</td>
          <td>
            <button class="btn btn-ghost btn-sm" data-edit="${r.id}">Edit</button>
            <button class="btn btn-danger btn-sm" data-del="${r.id}">Delete</button>
          </td>`;
        tb.appendChild(tr);
      });
      if (!Jofa.get(K.rooms, []).length) tb.innerHTML = `<tr><td colspan="6" class="empty">${Jofa.t("common.empty")}</td></tr>`;
      tb.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => openRoomForm(b.dataset.edit)));
      tb.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => deleteRoom(b.dataset.del)));
    };
    draw();
    $("#addRoomBtn").addEventListener("click", () => openRoomForm(null));
  }
  function openRoomForm(id) {
    const r = id ? Jofa.get(K.rooms, []).find((x) => x.id === id) : null;
    showModal(`
      <h3>${id ? "Edit Room" : "Add Room"}</h3>
      <div class="form-grid">
        <div class="form-field"><label>Name</label><input id="rf_name" value="${r ? r.name : ""}" /></div>
        <div class="form-field"><label>Name (SW)</label><input id="rf_nameSw" value="${r ? (r.nameSw || "") : ""}" /></div>
        <div class="form-field"><label>Price (KES)</label><input type="number" id="rf_price" value="${r ? r.price : ""}" /></div>
        <div class="form-field"><label>Image URL</label><input id="rf_image" value="${r ? r.image : ""}" /></div>
        <div class="form-field"><label>Bed</label><input id="rf_bed" value="${r ? r.bed : ""}" /></div>
        <div class="form-field"><label>Capacity</label><input id="rf_capacity" value="${r ? r.capacity : ""}" /></div>
        <div class="form-field full"><label>Description</label><textarea id="rf_desc" rows="2">${r ? r.description : ""}</textarea></div>
        <div class="form-field full"><label>Description (SW)</label><textarea id="rf_descSw" rows="2">${r ? (r.descriptionSw || "") : ""}</textarea></div>
        <div class="form-field full"><label>Amenities (comma separated)</label><input id="rf_amenities" value="${r ? (r.amenities || []).join(", ") : ""}" /></div>
        <div class="form-field"><label>Enabled</label><select id="rf_enabled"><option value="true" ${r && r.enabled !== false ? "selected" : ""}>Yes</option><option value="false" ${r && r.enabled === false ? "selected" : ""}>No</option></select></div>
        <div class="form-field"><label>Proposed (demo)</label><select id="rf_proposed"><option value="false" ${!r || !r.proposed ? "selected" : ""}>No</option><option value="true" ${r && r.proposed ? "selected" : ""}>Yes</option></select></div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn btn-outline" data-close>Cancel</button>
        <button class="btn btn-primary" id="rf_save">Save</button>
      </div>
    `);
    // wire cancel
    $("#adminModal").querySelector("[data-close]").onclick = closeModal;
    $("#rf_save").addEventListener("click", () => {
      const list = Jofa.get(K.rooms, []);
      const obj = {
        id: r ? r.id : Jofa.uid("room"),
        name: $("#rf_name").value.trim(),
        nameSw: $("#rf_nameSw").value.trim(),
        price: parseInt($("#rf_price").value, 10) || 0,
        image: $("#rf_image").value.trim(),
        bed: $("#rf_bed").value.trim(),
        capacity: $("#rf_capacity").value.trim(),
        description: $("#rf_desc").value.trim(),
        descriptionSw: $("#rf_descSw").value.trim(),
        amenities: $("#rf_amenities").value.split(",").map((s) => s.trim()).filter(Boolean),
        enabled: $("#rf_enabled").value === "true",
        proposed: $("#rf_proposed").value === "true",
      };
      if (!obj.name) { toast("Name required."); return; }
      if (r) {
        const i = list.findIndex((x) => x.id === r.id);
        list[i] = obj;
      } else {
        list.push(obj);
      }
      Jofa.set(K.rooms, list);
      Jofa.broadcast();
      closeModal();
      toast("Saved.");
      renderView("rooms");
    });
  }
  function deleteRoom(id) {
    if (!confirmAction("Delete this room?")) return;
    const list = Jofa.get(K.rooms, []).filter((x) => x.id !== id);
    Jofa.set(K.rooms, list);
    Jofa.broadcast();
    toast("Deleted.");
    renderView("rooms");
  }

  /* ---------- Facilities Admin ---------- */
  function renderFacilitiesAdmin(c) {
    c.innerHTML = `
      <div class="card">
        <h3>Supplied Facilities</h3>
        <p style="font-size:13px;color:var(--text-muted);">These facilities are the verified list supplied for the proposal. Edit them in js/data.js if the hotel confirms changes.</p>
        <ul id="facList"></ul>
      </div>
    `;
    const ul = $("#facList");
    Jofa.FACILITIES.forEach((f) => {
      const li = document.createElement("li");
      li.textContent = (lang() === "sw" ? f.sw : f.en) + " — " + (lang() === "sw" ? f.descSw : f.descEn);
      ul.appendChild(li);
    });
  }
  function lang() { return Jofa.get(K.lang, "en"); }

  /* ---------- Menu Admin ---------- */
  function renderMenuAdmin(c) {
    const items = Jofa.get(K.menu, []);
    c.innerHTML = `
      <div class="toolbar">
        <button class="btn btn-primary btn-sm" id="addMenuBtn">Add Menu Item</button>
      </div>
      <div class="table-wrap"><table><thead><tr>
        <th>Name</th><th>Category</th><th>Price</th><th>Available</th><th>Actions</th>
      </tr></thead><tbody id="menuTable"></tbody></table></div>
    `;
    const draw = () => {
      const tb = $("#menuTable");
      tb.innerHTML = "";
      Jofa.get(K.menu, []).forEach((m) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${m.name}${m.sample ? ' <span class="badge demo">SAMPLE</span>' : ""}</td>
          <td>${m.category}</td>
          <td>${m.price ? "KES " + m.price.toLocaleString() : "On request"}</td>
          <td>${m.available !== false ? "Yes" : "No"}</td>
          <td>
            <button class="btn btn-ghost btn-sm" data-edit="${m.id}">Edit</button>
            <button class="btn btn-danger btn-sm" data-del="${m.id}">Delete</button>
          </td>`;
        tb.appendChild(tr);
      });
      if (!Jofa.get(K.menu, []).length) tb.innerHTML = `<tr><td colspan="5" class="empty">${Jofa.t("common.empty")}</td></tr>`;
      tb.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => openMenuForm(b.dataset.edit)));
      tb.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => deleteMenu(b.dataset.del)));
    };
    draw();
    $("#addMenuBtn").addEventListener("click", () => openMenuForm(null));
  }
  function openMenuForm(id) {
    const m = id ? Jofa.get(K.menu, []).find((x) => x.id === id) : null;
    showModal(`
      <h3>${id ? "Edit Menu Item" : "Add Menu Item"}</h3>
      <div class="form-grid">
        <div class="form-field"><label>Name</label><input id="mf_name" value="${m ? m.name : ""}" /></div>
        <div class="form-field"><label>Category</label><input id="mf_cat" value="${m ? m.category : ""}" /></div>
        <div class="form-field"><label>Price (KES, optional)</label><input type="number" id="mf_price" value="${m && m.price ? m.price : ""}" /></div>
        <div class="form-field"><label>Image URL</label><input id="mf_image" value="${m ? m.image : ""}" /></div>
        <div class="form-field full"><label>Description</label><textarea id="mf_desc" rows="2">${m ? (m.description || "") : ""}</textarea></div>
        <div class="form-field"><label>Available</label><select id="mf_avail"><option value="true" ${!m || m.available !== false ? "selected" : ""}>Yes</option><option value="false" ${m && m.available === false ? "selected" : ""}>No</option></select></div>
        <div class="form-field"><label>Sample</label><select id="mf_sample"><option value="true" ${m && m.sample ? "selected" : ""}>Yes</option><option value="false" ${!m || !m.sample ? "selected" : ""}>No</option></select></div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn btn-outline" data-close>Cancel</button>
        <button class="btn btn-primary" id="mf_save">Save</button>
      </div>
    `);
    $("#adminModal").querySelector("[data-close]").onclick = closeModal;
    $("#mf_save").addEventListener("click", () => {
      const list = Jofa.get(K.menu, []);
      const obj = {
        id: m ? m.id : Jofa.uid("m"),
        name: $("#mf_name").value.trim(),
        category: $("#mf_cat").value.trim() || "General",
        price: $("#mf_price").value ? parseInt($("#mf_price").value, 10) : null,
        image: $("#mf_image").value.trim(),
        description: $("#mf_desc").value.trim(),
        available: $("#mf_avail").value === "true",
        sample: $("#mf_sample").value === "true",
      };
      if (!obj.name) { toast("Name required."); return; }
      if (m) {
        const i = list.findIndex((x) => x.id === m.id);
        list[i] = obj;
      } else list.push(obj);
      Jofa.set(K.menu, list);
      Jofa.broadcast();
      closeModal();
      toast("Saved.");
      renderView("menu");
    });
  }
  function deleteMenu(id) {
    if (!confirmAction("Delete this menu item?")) return;
    const list = Jofa.get(K.menu, []).filter((x) => x.id !== id);
    Jofa.set(K.menu, list);
    Jofa.broadcast();
    toast("Deleted.");
    renderView("menu");
  }

  /* ---------- Events Admin ---------- */
  function renderEventsAdmin(c) {
    const events = Jofa.get(K.events, []);
    c.innerHTML = `
      <div class="toolbar">
        <input type="text" id="evSearch" placeholder="Search name or type..." />
        <select id="evFilter"><option value="">All statuses</option><option>Pending</option><option>Confirmed</option><option>Cancelled</option></select>
      </div>
      <div class="table-wrap"><table><thead><tr>
        <th>Name</th><th>Phone</th><th>Email</th><th>Type</th><th>Date</th><th>Attendees</th><th>Status</th><th>Actions</th>
      </tr></thead><tbody id="evTable"></tbody></table></div>
    `;
    const draw = () => {
      const q = $("#evSearch").value.toLowerCase();
      const f = $("#evFilter").value;
      const rows = events.filter((e) => {
        if (f && e.status !== f) return false;
        if (q && !((e.name || "").toLowerCase().includes(q) || (e.eventType || "").toLowerCase().includes(q))) return false;
        return true;
      });
      const tb = $("#evTable");
      tb.innerHTML = "";
      rows.forEach((e) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${e.name}${e.isDemo ? ' <span class="badge demo">DEMO</span>' : ""}</td>
          <td>${e.phone}</td><td>${e.email}</td><td>${e.eventType}</td><td>${e.date}</td><td>${e.attendees}</td>
          <td><span class="badge ${badgeClass(e.status)}">${e.status}</span></td>
          <td>
            <select data-status="${e.id}" class="btn btn-ghost btn-sm">
              <option ${e.status === "Pending" ? "selected" : ""}>Pending</option>
              <option ${e.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
              <option ${e.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
            <button class="btn btn-danger btn-sm" data-del="${e.id}">Delete</button>
          </td>`;
        tb.appendChild(tr);
      });
      if (!rows.length) tb.innerHTML = `<tr><td colspan="8" class="empty">${Jofa.t("common.empty")}</td></tr>`;
      tb.querySelectorAll("[data-status]").forEach((sel) => sel.addEventListener("change", () => {
        const list = Jofa.get(K.events, []);
        const i = list.findIndex((x) => x.id === sel.dataset.status);
        if (i >= 0) { list[i].status = sel.value; Jofa.set(K.events, list); Jofa.broadcast(); toast("Updated."); }
      }));
      tb.querySelectorAll("[data-del]").forEach((btn) => btn.addEventListener("click", () => deleteEvent(btn.dataset.del)));
    };
    draw();
    $("#evSearch").addEventListener("input", draw);
    $("#evFilter").addEventListener("change", draw);
  }
  function deleteEvent(id) {
    if (!confirmAction("Delete this event inquiry?")) return;
    const list = Jofa.get(K.events, []).filter((x) => x.id !== id);
    Jofa.set(K.events, list);
    Jofa.broadcast();
    toast("Deleted.");
    renderView("events");
  }

  /* ---------- Contacts Admin ---------- */
  function renderContactsAdmin(c) {
    const contacts = Jofa.get(K.contacts, []);
    c.innerHTML = `
      <div class="toolbar">
        <input type="text" id="ctSearch" placeholder="Search name, email, subject..." />
        <select id="ctFilter"><option value="">All</option><option value="unread">Unread</option><option value="read">Read</option></select>
      </div>
      <div class="table-wrap"><table><thead><tr>
        <th>Name</th><th>Email</th><th>Phone</th><th>Subject</th><th>Message</th><th>Read</th><th>Actions</th>
      </tr></thead><tbody id="ctTable"></tbody></table></div>
    `;
    const draw = () => {
      const q = $("#ctSearch").value.toLowerCase();
      const f = $("#ctFilter").value;
      const rows = contacts.filter((x) => {
        if (f === "unread" && x.read) return false;
        if (f === "read" && !x.read) return false;
        if (q && !((x.name || "").toLowerCase().includes(q) || (x.email || "").toLowerCase().includes(q) || (x.subject || "").toLowerCase().includes(q))) return false;
        return true;
      });
      const tb = $("#ctTable");
      tb.innerHTML = "";
      rows.forEach((x) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${x.name}${x.isDemo ? ' <span class="badge demo">DEMO</span>' : ""}</td>
          <td>${x.email}</td><td>${x.phone}</td><td>${x.subject}</td>
          <td style="max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${x.message}</td>
          <td>${x.read ? "Yes" : "No"}</td>
          <td>
            <button class="btn btn-ghost btn-sm" data-read="${x.id}">${x.read ? "Mark Unread" : "Mark Read"}</button>
            <button class="btn btn-danger btn-sm" data-del="${x.id}">Delete</button>
          </td>`;
        tb.appendChild(tr);
      });
      if (!rows.length) tb.innerHTML = `<tr><td colspan="7" class="empty">${Jofa.t("common.empty")}</td></tr>`;
      tb.querySelectorAll("[data-read]").forEach((btn) => btn.addEventListener("click", () => toggleContactRead(btn.dataset.read)));
      tb.querySelectorAll("[data-del]").forEach((btn) => btn.addEventListener("click", () => deleteContact(btn.dataset.del)));
    };
    draw();
    $("#ctSearch").addEventListener("input", draw);
    $("#ctFilter").addEventListener("change", draw);
  }
  function toggleContactRead(id) {
    const list = Jofa.get(K.contacts, []);
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) { list[i].read = !list[i].read; Jofa.set(K.contacts, list); Jofa.broadcast(); renderView("contacts"); }
  }
  function deleteContact(id) {
    if (!confirmAction("Delete this contact inquiry?")) return;
    const list = Jofa.get(K.contacts, []).filter((x) => x.id !== id);
    Jofa.set(K.contacts, list);
    Jofa.broadcast();
    toast("Deleted.");
    renderView("contacts");
  }

  /* ---------- Gallery Admin ---------- */
  function renderGalleryAdmin(c) {
    const items = Jofa.get(K.gallery, []);
    c.innerHTML = `
      <div class="toolbar">
        <button class="btn btn-primary btn-sm" id="addGalBtn">Add Gallery Item</button>
      </div>
      <div class="table-wrap"><table><thead><tr>
        <th>Image</th><th>Caption</th><th>Caption (SW)</th><th>Actions</th>
      </tr></thead><tbody id="galTable"></tbody></table></div>
    `;
    const draw = () => {
      const tb = $("#galTable");
      tb.innerHTML = "";
      Jofa.get(K.gallery, []).forEach((g) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><img src="${g.url}" alt="" style="width:60px;height:40px;object-fit:cover;border-radius:6px;" onerror="this.style.background='var(--bg-alt)'" /></td>
          <td>${g.caption}</td><td>${g.captionSw || ""}</td>
          <td>
            <button class="btn btn-ghost btn-sm" data-edit="${g.id}">Edit</button>
            <button class="btn btn-danger btn-sm" data-del="${g.id}">Delete</button>
          </td>`;
        tb.appendChild(tr);
      });
      if (!Jofa.get(K.gallery, []).length) tb.innerHTML = `<tr><td colspan="4" class="empty">${Jofa.t("common.empty")}</td></tr>`;
      tb.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => openGalForm(b.dataset.edit)));
      tb.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => deleteGal(b.dataset.del)));
    };
    draw();
    $("#addGalBtn").addEventListener("click", () => openGalForm(null));
  }
  function openGalForm(id) {
    const g = id ? Jofa.get(K.gallery, []).find((x) => x.id === id) : null;
    showModal(`
      <h3>${id ? "Edit Gallery Item" : "Add Gallery Item"}</h3>
      <div class="form-grid">
        <div class="form-field full"><label>Image URL</label><input id="gf_url" value="${g ? g.url : ""}" /></div>
        <div class="form-field"><label>Caption</label><input id="gf_cap" value="${g ? g.caption : ""}" /></div>
        <div class="form-field"><label>Caption (SW)</label><input id="gf_capSw" value="${g ? (g.captionSw || "") : ""}" /></div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn btn-outline" data-close>Cancel</button>
        <button class="btn btn-primary" id="gf_save">Save</button>
      </div>
    `);
    $("#adminModal").querySelector("[data-close]").onclick = closeModal;
    $("#gf_save").addEventListener("click", () => {
      const list = Jofa.get(K.gallery, []);
      const obj = {
        id: g ? g.id : Jofa.uid("g"),
        url: $("#gf_url").value.trim(),
        caption: $("#gf_cap").value.trim(),
        captionSw: $("#gf_capSw").value.trim(),
      };
      if (!obj.url) { toast("URL required."); return; }
      if (g) {
        const i = list.findIndex((x) => x.id === g.id);
        list[i] = obj;
      } else list.push(obj);
      Jofa.set(K.gallery, list);
      Jofa.broadcast();
      closeModal();
      toast("Saved.");
      renderView("gallery");
    });
  }
  function deleteGal(id) {
    if (!confirmAction("Delete this gallery item?")) return;
    const list = Jofa.get(K.gallery, []).filter((x) => x.id !== id);
    Jofa.set(K.gallery, list);
    Jofa.broadcast();
    toast("Deleted.");
    renderView("gallery");
  }

  /* ---------- News Admin ---------- */
  function renderNewsAdmin(c) {
    const items = Jofa.get(K.news, []);
    c.innerHTML = `
      <div class="toolbar">
        <button class="btn btn-primary btn-sm" id="addNewsBtn">Add News</button>
      </div>
      <div class="table-wrap"><table><thead><tr>
        <th>Title</th><th>Published</th><th>Date</th><th>Actions</th>
      </tr></thead><tbody id="newsTable"></tbody></table></div>
    `;
    const draw = () => {
      const tb = $("#newsTable");
      tb.innerHTML = "";
      Jofa.get(K.news, []).forEach((n) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${n.title}</td>
          <td>${n.published ? "Yes" : "No"}</td>
          <td>${n.date}</td>
          <td>
            <button class="btn btn-ghost btn-sm" data-edit="${n.id}">Edit</button>
            <button class="btn btn-ghost btn-sm" data-toggle="${n.id}">${n.published ? "Unpublish" : "Publish"}</button>
            <button class="btn btn-danger btn-sm" data-del="${n.id}">Delete</button>
          </td>`;
        tb.appendChild(tr);
      });
      if (!Jofa.get(K.news, []).length) tb.innerHTML = `<tr><td colspan="4" class="empty">${Jofa.t("common.empty")}</td></tr>`;
      tb.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => openNewsForm(b.dataset.edit)));
      tb.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", () => toggleNews(b.dataset.toggle)));
      tb.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => deleteNews(b.dataset.del)));
    };
    draw();
    $("#addNewsBtn").addEventListener("click", () => openNewsForm(null));
  }
  function openNewsForm(id) {
    const n = id ? Jofa.get(K.news, []).find((x) => x.id === id) : null;
    showModal(`
      <h3>${id ? "Edit News" : "Add News"}</h3>
      <div class="form-grid">
        <div class="form-field"><label>Title</label><input id="nf_title" value="${n ? n.title : ""}" /></div>
        <div class="form-field"><label>Title (SW)</label><input id="nf_titleSw" value="${n ? (n.titleSw || "") : ""}" /></div>
        <div class="form-field full"><label>Excerpt</label><textarea id="nf_excerpt" rows="2">${n ? n.excerpt : ""}</textarea></div>
        <div class="form-field full"><label>Excerpt (SW)</label><textarea id="nf_excerptSw" rows="2">${n ? (n.excerptSw || "") : ""}</textarea></div>
        <div class="form-field"><label>Image URL</label><input id="nf_image" value="${n ? n.image : ""}" /></div>
        <div class="form-field"><label>Date</label><input type="date" id="nf_date" value="${n ? n.date : new Date().toISOString().slice(0, 10)}" /></div>
        <div class="form-field"><label>Published</label><select id="nf_pub"><option value="true" ${n && n.published ? "selected" : ""}>Yes</option><option value="false" ${!n || !n.published ? "selected" : ""}>No</option></select></div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn btn-outline" data-close>Cancel</button>
        <button class="btn btn-primary" id="nf_save">Save</button>
      </div>
    `);
    $("#adminModal").querySelector("[data-close]").onclick = closeModal;
    $("#nf_save").addEventListener("click", () => {
      const list = Jofa.get(K.news, []);
      const obj = {
        id: n ? n.id : Jofa.uid("n"),
        title: $("#nf_title").value.trim(),
        titleSw: $("#nf_titleSw").value.trim(),
        excerpt: $("#nf_excerpt").value.trim(),
        excerptSw: $("#nf_excerptSw").value.trim(),
        image: $("#nf_image").value.trim(),
        date: $("#nf_date").value,
        published: $("#nf_pub").value === "true",
      };
      if (!obj.title) { toast("Title required."); return; }
      if (n) {
        const i = list.findIndex((x) => x.id === n.id);
        list[i] = obj;
      } else list.push(obj);
      Jofa.set(K.news, list);
      Jofa.broadcast();
      closeModal();
      toast("Saved.");
      renderView("news");
    });
  }
  function toggleNews(id) {
    const list = Jofa.get(K.news, []);
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) { list[i].published = !list[i].published; Jofa.set(K.news, list); Jofa.broadcast(); renderView("news"); }
  }
  function deleteNews(id) {
    if (!confirmAction("Delete this news item?")) return;
    const list = Jofa.get(K.news, []).filter((x) => x.id !== id);
    Jofa.set(K.news, list);
    Jofa.broadcast();
    toast("Deleted.");
    renderView("news");
  }

  /* ---------- Testimonials Admin ---------- */
  function renderTestimonialsAdmin(c) {
    const items = Jofa.get(K.testimonials, []);
    c.innerHTML = `
      <div class="toolbar">
        <button class="btn btn-primary btn-sm" id="addTestBtn">Add Testimonial</button>
      </div>
      <div class="table-wrap"><table><thead><tr>
        <th>Name</th><th>Role</th><th>Published</th><th>Actions</th>
      </tr></thead><tbody id="testTable"></tbody></table></div>
      <p style="font-size:12px;color:var(--text-muted);margin-top:8px;">Do not publish fictional testimonials as genuine customer feedback.</p>
    `;
    const draw = () => {
      const tb = $("#testTable");
      tb.innerHTML = "";
      Jofa.get(K.testimonials, []).forEach((t) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${t.name}</td><td>${t.role || ""}</td><td>${t.published ? "Yes" : "No"}</td>
          <td>
            <button class="btn btn-ghost btn-sm" data-edit="${t.id}">Edit</button>
            <button class="btn btn-ghost btn-sm" data-toggle="${t.id}">${t.published ? "Unpublish" : "Publish"}</button>
            <button class="btn btn-danger btn-sm" data-del="${t.id}">Delete</button>
          </td>`;
        tb.appendChild(tr);
      });
      if (!Jofa.get(K.testimonials, []).length) tb.innerHTML = `<tr><td colspan="4" class="empty">${Jofa.t("common.empty")}</td></tr>`;
      tb.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => openTestForm(b.dataset.edit)));
      tb.querySelectorAll("[data-toggle]").forEach((b) => b.addEventListener("click", () => toggleTest(b.dataset.toggle)));
      tb.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", () => deleteTest(b.dataset.del)));
    };
    draw();
    $("#addTestBtn").addEventListener("click", () => openTestForm(null));
  }
  function openTestForm(id) {
    const t = id ? Jofa.get(K.testimonials, []).find((x) => x.id === id) : null;
    showModal(`
      <h3>${id ? "Edit Testimonial" : "Add Testimonial"}</h3>
      <div class="form-grid">
        <div class="form-field"><label>Name</label><input id="tf_name" value="${t ? t.name : ""}" /></div>
        <div class="form-field"><label>Role</label><input id="tf_role" value="${t ? (t.role || "") : ""}" /></div>
        <div class="form-field full"><label>Text</label><textarea id="tf_text" rows="3">${t ? t.text : ""}</textarea></div>
        <div class="form-field"><label>Published</label><select id="tf_pub"><option value="true" ${t && t.published ? "selected" : ""}>Yes</option><option value="false" ${!t || !t.published ? "selected" : ""}>No</option></select></div>
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn btn-outline" data-close>Cancel</button>
        <button class="btn btn-primary" id="tf_save">Save</button>
      </div>
    `);
    $("#adminModal").querySelector("[data-close]").onclick = closeModal;
    $("#tf_save").addEventListener("click", () => {
      const list = Jofa.get(K.testimonials, []);
      const obj = {
        id: t ? t.id : Jofa.uid("t"),
        name: $("#tf_name").value.trim(),
        role: $("#tf_role").value.trim(),
        text: $("#tf_text").value.trim(),
        published: $("#tf_pub").value === "true",
      };
      if (!obj.name || !obj.text) { toast("Name and text required."); return; }
      if (t) {
        const i = list.findIndex((x) => x.id === t.id);
        list[i] = obj;
      } else list.push(obj);
      Jofa.set(K.testimonials, list);
      Jofa.broadcast();
      closeModal();
      toast("Saved.");
      renderView("testimonials");
    });
  }
  function toggleTest(id) {
    const list = Jofa.get(K.testimonials, []);
    const i = list.findIndex((x) => x.id === id);
    if (i >= 0) { list[i].published = !list[i].published; Jofa.set(K.testimonials, list); Jofa.broadcast(); renderView("testimonials"); }
  }
  function deleteTest(id) {
    if (!confirmAction("Delete this testimonial?")) return;
    const list = Jofa.get(K.testimonials, []).filter((x) => x.id !== id);
    Jofa.set(K.testimonials, list);
    Jofa.broadcast();
    toast("Deleted.");
    renderView("testimonials");
  }

  /* ---------- Settings ---------- */
  function renderSettings(c) {
    const s = Jofa.get(K.settings, Jofa.DEFAULT_SETTINGS);
    c.innerHTML = `
      <div class="card">
        <h3>Website Settings</h3>
        <div class="form-grid">
          <div class="form-field"><label>Phone</label><input id="sf_phone" value="${s.phone}" /></div>
          <div class="form-field"><label>Email</label><input id="sf_email" value="${s.email}" /></div>
          <div class="form-field full"><label>Address</label><input id="sf_address" value="${s.address}" /></div>
          <div class="form-field"><label>Website</label><input id="sf_website" value="${s.website}" /></div>
          <div class="form-field"><label>WhatsApp (intl, no +)</label><input id="sf_wa" value="${s.whatsapp}" /></div>
          <div class="form-field"><label>Facebook URL</label><input id="sf_fb" value="${s.facebook}" /></div>
          <div class="form-field"><label>Instagram URL</label><input id="sf_ig" value="${s.instagram}" /></div>
          <div class="form-field full"><label>Hero Heading</label><input id="sf_heroH" value="${s.heroHeading}" /></div>
          <div class="form-field full"><label>Hero Description</label><textarea id="sf_heroD" rows="3">${s.heroDescription}</textarea></div>
        </div>
        <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end;">
          <button class="btn btn-primary" id="sf_save">Save Settings</button>
        </div>
      </div>
    `;
    $("#sf_save").addEventListener("click", () => {
      const obj = {
        phone: $("#sf_phone").value.trim(),
        email: $("#sf_email").value.trim(),
        address: $("#sf_address").value.trim(),
        website: $("#sf_website").value.trim(),
        whatsapp: $("#sf_wa").value.trim(),
        facebook: $("#sf_fb").value.trim(),
        instagram: $("#sf_ig").value.trim(),
        heroHeading: $("#sf_heroH").value.trim(),
        heroDescription: $("#sf_heroD").value.trim(),
      };
      Jofa.set(K.settings, obj);
      Jofa.broadcast();
      toast("Settings saved.");
    });
  }

  /* ---------- Theme Settings ---------- */
  function renderTheme(c) {
    const cur = Jofa.getTheme();
    c.innerHTML = `
      <div class="card">
        <h3>Theme Settings</h3>
        <p style="font-size:13px;color:var(--text-muted);">Selected theme is applied to the public website.</p>
        <div class="toolbar">
          <button class="btn ${cur === "light" ? "btn-primary" : "btn-outline"}" id="thLight">Light Mode</button>
          <button class="btn ${cur === "dark" ? "btn-primary" : "btn-outline"}" id="thDark">Dark Mode</button>
        </div>
      </div>
    `;
    $("#thLight").addEventListener("click", () => { Jofa.setTheme("light"); Jofa.set(K.theme, "light"); toast("Theme saved."); renderView("theme"); });
    $("#thDark").addEventListener("click", () => { Jofa.setTheme("dark"); Jofa.set(K.theme, "dark"); toast("Theme saved."); renderView("theme"); });
  }

  /* ---------- Language Settings ---------- */
  function renderLanguage(c) {
    const cur = Jofa.get(K.lang, "en");
    c.innerHTML = `
      <div class="card">
        <h3>Language Settings</h3>
        <p style="font-size:13px;color:var(--text-muted);">Selected language is applied to the public website.</p>
        <div class="toolbar">
          <button class="btn ${cur === "en" ? "btn-primary" : "btn-outline"}" id="lnEn">English</button>
          <button class="btn ${cur === "sw" ? "btn-primary" : "btn-outline"}" id="lnSw">Kiswahili</button>
        </div>
      </div>
    `;
    $("#lnEn").addEventListener("click", () => { Jofa.set(K.lang, "en"); toast("Language saved."); renderView("language"); });
    $("#lnSw").addEventListener("click", () => { Jofa.set(K.lang, "sw"); toast("Language saved."); renderView("language"); });
  }

  /* ---------- Sync ---------- */
  function initSync() {
    window.addEventListener("storage", (e) => {
      if (e.key && e.key.startsWith("jofa_")) {
        renderView(currentView);
      }
    });
  }

  /* ---------- Init ---------- */
  function initDash() {
    initThemeToggle();
    initLangToggle();
    initSidebar();
    initSync();
    setView("overview");
    if (window.lucide) window.lucide.createIcons();
  }

  document.addEventListener("DOMContentLoaded", () => {
    Jofa.initTheme();
    initAuth();
  });
})();
