/* ============================================================
   HOTEL JOFA — Public Site Logic
   ============================================================ */

(function () {
  "use strict";

  const K = Jofa.K;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ---------- Toast ---------- */
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove("show"), 3200);
  }

  /* ---------- Theme ---------- */
  function initTheme() {
    Jofa.initTheme();
    $("#themeToggle").addEventListener("click", () => {
      const next = Jofa.getTheme() === "light" ? "dark" : "light";
      Jofa.setTheme(next);
      Jofa.set(K.theme, next);
    });
  }

  /* ---------- Language ---------- */
  function initLang() {
    const cur = Jofa.get(K.lang, "en");
    applyLangButtons(cur);
    $$(".lang-btn").forEach((b) => {
      b.addEventListener("click", () => {
        const l = b.dataset.lang;
        Jofa.set(K.lang, l);
        applyLangButtons(l);
        Jofa.applyI18n(document);
        renderAll();
      });
    });
  }
  function applyLangButtons(l) {
    $$(".lang-btn").forEach((b) => b.classList.toggle("active", b.dataset.lang === l));
  }
  function lang() { return Jofa.get(K.lang, "en"); }
  function L(obj, field) {
    // helper: pick en/sw field
    if (lang() === "sw") {
      const sw = obj[field + "Sw"] || obj[field + "sw"];
      if (sw) return sw;
    }
    return obj[field];
  }

  /* ---------- Nav ---------- */
  function initNav() {
    const header = $("#siteHeader");
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 20);
      $("#backToTop").classList.toggle("show", window.scrollY > 400);
    });
    $("#hamburger").addEventListener("click", () => {
      const m = $("#mobileMenu");
      const open = m.classList.toggle("open");
      $("#hamburger").setAttribute("aria-expanded", open);
      m.setAttribute("aria-hidden", !open);
    });
    $$("#mobileMenu a, .nav a").forEach((a) => {
      a.addEventListener("click", () => {
        $("#mobileMenu").classList.remove("open");
      });
    });
    // smooth scroll for hash links
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1) {
          const el = document.querySelector(id);
          if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      });
    });
    $("#backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- Settings load ---------- */
  function settings() { return Jofa.get(K.settings, Jofa.DEFAULT_SETTINGS); }
  function loadSettingsIntoUI() {
    const s = settings();
    $("#ciAddress").textContent = s.address;
    const ph = $("#ciPhone");
    ph.textContent = s.phone;
    ph.href = "tel:" + s.phone.replace(/\s/g, "");
    const em = $("#ciEmail");
    em.textContent = s.email;
    em.href = "mailto:" + s.email;
    $("#ciWebsite").textContent = s.website;
    $("#ciFb").href = s.facebook;
    $("#ciIg").href = s.instagram;
    $("#ciWa").href = "https://wa.me/" + s.whatsapp;
    $("#waFloat").href = "https://wa.me/" + s.whatsapp;
    $("#mapBtn").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Hotel Jofa, Migori, Kenya");
    $("#ciMap").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("Hotel Jofa, Migori, Kenya");
    // hero text from settings
    const heroH = $(".hero h1");
    const heroP = $(".hero-text");
    const defaultH = Jofa.DEFAULT_SETTINGS.heroHeading;
    const defaultD = Jofa.DEFAULT_SETTINGS.heroDescription;
    if (s.heroHeading && s.heroHeading !== defaultH) { heroH.textContent = s.heroHeading; heroH.dataset.custom = "1"; }
    else { delete heroH.dataset.custom; }
    if (s.heroDescription && s.heroDescription !== defaultD) { heroP.textContent = s.heroDescription; heroP.dataset.custom = "1"; }
    else { delete heroP.dataset.custom; }
    document.title = "HOTEL JOFA — " + (s.heroHeading || "Hotel Jofa");
  }

  /* ---------- Rooms ---------- */
  function rooms() { return Jofa.get(K.rooms, []).filter((r) => r.enabled !== false); }
  function renderRooms() {
    const grid = $("#roomsGrid");
    grid.innerHTML = "";
    rooms().forEach((r) => {
      const card = document.createElement("div");
      card.className = "room-card";
      card.innerHTML = `
        <img src="${r.image || r.url}" alt="${r.name || r.caption || r.caption || 'Gallery image'}" loading="lazy" onerror="this.style.background='var(--bg-alt)'" />
        <div class="room-body">
          <h3 class="room-name">${r.name}</h3>
          <div class="room-price">KES ${r.price.toLocaleString()} <span style="font-weight:400;font-size:13px;color:var(--text-muted)">/ ${Jofa.t("rooms.perNight")}</span></div>
          <p class="room-desc">${L(r, "description")}</p>
          <div class="room-meta">
            <span>${r.bed}</span>
            <span>${r.capacity}</span>
          </div>
          <ul class="amenities">${(r.amenities || []).map((a) => `<li>${a}</li>`).join("")}</ul>
          <div class="room-actions">
            <button class="btn btn-outline btn-sm" data-view="${r.id}">${Jofa.t("rooms.view")}</button>
            <button class="btn btn-primary btn-sm" data-book="${r.id}">${Jofa.t("rooms.book")}</button>
          </div>
        </div>`;
      grid.appendChild(card);
    });
    grid.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => openRoomModal(b.dataset.view)));
    grid.querySelectorAll("[data-book]").forEach((b) => b.addEventListener("click", () => {
      preselectRoom(b.dataset.book);
      $("#booking").scrollIntoView({ behavior: "smooth" });
    }));
  }
  function openRoomModal(id) {
    const r = Jofa.get(K.rooms, []).find((x) => x.id === id);
    if (!r) return;
    $("#roomModalBody").innerHTML = `
      <img src="${r.image}" alt="${r.name}" style="width:100%;height:260px;object-fit:cover;border-radius:10px;margin-bottom:14px;" onerror="this.style.background='var(--bg-alt)'" />
      <h2 style="margin:0 0 6px;">${r.name}</h2>
      <div style="color:var(--gold);font-weight:700;font-size:20px;margin-bottom:10px;">KES ${r.price.toLocaleString()} / ${Jofa.t("rooms.perNight")}</div>
      <p style="color:var(--text-muted)">${L(r, "description")}</p>
      <div style="margin:10px 0;font-size:13px;color:var(--text-muted)">${r.bed} · ${r.capacity}</div>
      <ul class="amenities">${(r.amenities || []).map((a) => `<li>${a}</li>`).join("")}</ul>
      <div style="margin-top:14px;display:flex;gap:8px;">
        <button class="btn btn-primary" data-book="${r.id}">${Jofa.t("rooms.book")}</button>
      </div>`;
    $("#roomModalBody").querySelector("[data-book]").addEventListener("click", () => {
      closeModals();
      preselectRoom(r.id);
      $("#booking").scrollIntoView({ behavior: "smooth" });
    });
    openModal("roomModal");
  }

  /* ---------- Facilities ---------- */
  function renderFacilities() {
    const grid = $("#facilitiesGrid");
    grid.innerHTML = "";
    Jofa.FACILITIES.forEach((f) => {
      const name = lang() === "sw" ? f.sw : f.en;
      const desc = lang() === "sw" ? f.descSw : f.descEn;
      const card = document.createElement("div");
      card.className = "facility-card";
      card.innerHTML = `<div class="facility-icon">${iconSvg(f.icon)}</div><div class="facility-name">${name}</div><div class="facility-desc">${desc}</div>`;
      grid.appendChild(card);
    });
  }

  /* ---------- Why ---------- */
  function renderWhy() {
    const grid = $("#whyGrid");
    grid.innerHTML = "";
    Jofa.WHY.forEach((w) => {
      const item = document.createElement("div");
      item.className = "why-item";
      item.innerHTML = `<span class="dot"></span><span>${lang() === "sw" ? w.sw : w.en}</span>`;
      grid.appendChild(item);
    });
  }

  /* ---------- Menu cats ---------- */
  function renderMenuCats() {
    const ul = $("#menuCats");
    ul.innerHTML = "";
    Jofa.get(K.menu, []).filter((m) => m.available !== false).forEach((m) => {
      const li = document.createElement("li");
      li.textContent = lang() === "sw" ? (m.nameSw || m.name) : m.name;
      ul.appendChild(li);
    });
  }

  /* ---------- Gallery ---------- */
  let galleryItems = [];
  let lbIndex = 0;
  function renderGallery() {
    galleryItems = Jofa.get(K.gallery, []);
    const grid = $("#galleryGrid");
    grid.innerHTML = "";
    galleryItems.forEach((g, i) => {
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.innerHTML = `<img src="${g.url}" alt="${g.caption}" loading="lazy" onerror="this.style.background='var(--bg-alt)'" /><div class="cap">${lang() === "sw" ? (g.captionSw || g.caption) : g.caption}</div>`;
      item.addEventListener("click", () => openLightbox(i));
      grid.appendChild(item);
    });
  }
  function openLightbox(i) {
    lbIndex = i;
    updateLightbox();
    $("#lightbox").classList.add("open");
  }
  function updateLightbox() {
    const g = galleryItems[lbIndex];
    if (!g) return;
    $("#lbImg").src = g.url;
    $("#lbImg").alt = g.caption;
    $("#lbCaption").textContent = lang() === "sw" ? (g.captionSw || g.caption) : g.caption;
  }
  function closeLightbox() { $("#lightbox").classList.remove("open"); }
  function initLightbox() {
    $("#lbPrev").addEventListener("click", () => { lbIndex = (lbIndex - 1 + galleryItems.length) % galleryItems.length; updateLightbox(); });
    $("#lbNext").addEventListener("click", () => { lbIndex = (lbIndex + 1) % galleryItems.length; updateLightbox(); });
    $("#lightbox").querySelector("[data-close]").addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (e) => {
      if (!$("#lightbox").classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") { lbIndex = (lbIndex - 1 + galleryItems.length) % galleryItems.length; updateLightbox(); }
      if (e.key === "ArrowRight") { lbIndex = (lbIndex + 1) % galleryItems.length; updateLightbox(); }
    });
  }

  /* ---------- News ---------- */
  function renderNews() {
    const grid = $("#newsGrid");
    grid.innerHTML = "";
    Jofa.get(K.news, []).filter((n) => n.published).forEach((n) => {
      const card = document.createElement("div");
      card.className = "news-card";
      card.innerHTML = `<img src="${n.image}" alt="${n.title}" loading="lazy" onerror="this.style.background='var(--bg-alt)'" /><div class="news-body"><h3>${lang() === "sw" ? (n.titleSw || n.title) : n.title}</h3><p>${lang() === "sw" ? (n.excerptSw || n.excerpt) : n.excerpt}</p></div>`;
      grid.appendChild(card);
    });
    if (!grid.children.length) {
      grid.innerHTML = `<p style="color:var(--text-muted);text-align:center;grid-column:1/-1;">${Jofa.t("common.empty")}</p>`;
    }
  }

  /* ---------- Testimonials ---------- */
  function renderTestimonials() {
    const grid = $("#testimonialsGrid");
    grid.innerHTML = "";
    const items = Jofa.get(K.testimonials, []).filter((t) => t.published);
    if (!items.length) {
      grid.innerHTML = `<p style="color:var(--text-muted);text-align:center;grid-column:1/-1;">${Jofa.t("test.note")}</p>`;
      return;
    }
    items.forEach((t) => {
      const card = document.createElement("div");
      card.className = "test-card";
      card.innerHTML = `<p class="quote">“${t.text}”</p><div class="who">${t.name} ${t.role ? "— " + t.role : ""}</div>`;
      grid.appendChild(card);
    });
  }

  /* ---------- Booking form ---------- */
  function populateRoomSelect(selected) {
    const sel = $("#bkRoom");
    sel.innerHTML = "";
    rooms().forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r.id;
      opt.textContent = `${r.name} — KES ${r.price.toLocaleString()}`;
      if (selected && selected === r.id) opt.selected = true;
      sel.appendChild(opt);
    });
  }
  function preselectRoom(id) {
    populateRoomSelect(id);
  }
  function calcBooking() {
    const ci = $("#bkCheckin").value;
    const co = $("#bkCheckout").value;
    const room = Jofa.get(K.rooms, []).find((r) => r.id === $("#bkRoom").value);
    $("#bkNights").textContent = "0";
    $("#bkTotal").textContent = "KES 0";
    $("#bkBreakdown").textContent = Jofa.t("booking.breakdown");
    if (!ci || !co || !room) return;
    const a = new Date(ci), b = new Date(co);
    const nights = Math.round((b - a) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return;
    const total = nights * room.price;
    $("#bkNights").textContent = nights;
    $("#bkTotal").textContent = "KES " + total.toLocaleString();
    $("#bkBreakdown").textContent = `${nights} ${Jofa.t("booking.nights")} × KES ${room.price.toLocaleString()} = KES ${total.toLocaleString()}`;
  }
  function initBooking() {
    // min dates
    const today = new Date().toISOString().slice(0, 10);
    $("#bkCheckin").min = today;
    $("#bkCheckout").min = today;
    populateRoomSelect();
    ["bkCheckin", "bkCheckout", "bkRoom"].forEach((id) => {
      $("#" + id).addEventListener("change", calcBooking);
    });
    $("#bkCheckin").addEventListener("change", () => {
      const ci = $("#bkCheckin").value;
      if (ci) $("#bkCheckout").min = ci;
    });
    $("#bookingForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const err = $("#bkError");
      err.textContent = "";
      const ci = $("#bkCheckin").value;
      const co = $("#bkCheckout").value;
      const name = $("#bkName").value.trim();
      const phone = $("#bkPhone").value.trim();
      const email = $("#bkEmail").value.trim();
      const room = Jofa.get(K.rooms, []).find((r) => r.id === $("#bkRoom").value);
      if (!ci || !co || !name || !phone || !email || !room) {
        err.textContent = "Please fill all required fields.";
        return;
      }
      const a = new Date(ci), b = new Date(co);
      const nights = Math.round((b - a) / (1000 * 60 * 60 * 24));
      if (nights <= 0) {
        err.textContent = "Check-out must be after check-in.";
        return;
      }
      if (new Date(ci) < new Date(new Date().toISOString().slice(0, 10))) {
        err.textContent = "Check-in cannot be in the past.";
        return;
      }
      const booking = {
        id: Jofa.uid("bk"),
        ref: "JOF-" + Date.now().toString(36).toUpperCase(),
        guestName: name,
        phone, email,
        checkIn: ci, checkOut: co,
        guests: parseInt($("#bkGuests").value, 10) || 1,
        roomId: room.id,
        roomName: room.name,
        nights,
        pricePerNight: room.price,
        total: nights * room.price,
        specialRequests: $("#bkRequests").value.trim(),
        status: "Pending",
        createdAt: new Date().toISOString(),
        isDemo: false,
      };
      const list = Jofa.get(K.bookings, []);
      list.unshift(booking);
      Jofa.set(K.bookings, list);
      Jofa.broadcast();
      $("#bookingForm").reset();
      populateRoomSelect();
      calcBooking();
      toast(Jofa.t("booking.success") + " " + Jofa.t("booking.ref") + ": " + booking.ref);
    });
  }

  /* ---------- Contact form ---------- */
  function initContact() {
    $("#contactForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const err = $("#ctError");
      const suc = $("#ctSuccess");
      err.textContent = ""; suc.textContent = "";
      const name = $("#ctName").value.trim();
      const email = $("#ctEmail").value.trim();
      const msg = $("#ctMessage").value.trim();
      if (!name || !email || !msg) { err.textContent = "Please fill required fields."; return; }
      const rec = {
        id: Jofa.uid("ct"),
        name, email,
        phone: $("#ctPhone").value.trim(),
        subject: $("#ctSubject").value.trim(),
        message: msg,
        read: false,
        createdAt: new Date().toISOString(),
        isDemo: false,
      };
      const list = Jofa.get(K.contacts, []);
      list.unshift(rec);
      Jofa.set(K.contacts, list);
      Jofa.broadcast();
      $("#contactForm").reset();
      suc.textContent = Jofa.t("contact.success");
    });
  }

  /* ---------- Event modal ---------- */
  function initEvents() {
    $("#eventQuoteBtn").addEventListener("click", () => openModal("eventModal"));
    $("#eventForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const err = $("#evError");
      const suc = $("#evSuccess");
      err.textContent = ""; suc.textContent = "";
      const name = $("#evName").value.trim();
      const phone = $("#evPhone").value.trim();
      const email = $("#evEmail").value.trim();
      const type = $("#evType").value;
      const date = $("#evDate").value;
      const att = $("#evAttendees").value;
      if (!name || !phone || !email || !type || !date || !att) { err.textContent = "Please fill required fields."; return; }
      const rec = {
        id: Jofa.uid("ev"),
        name, phone, email,
        eventType: type,
        date,
        attendees: parseInt(att, 10),
        requirements: $("#evReq").value.trim(),
        status: "Pending",
        createdAt: new Date().toISOString(),
        isDemo: false,
      };
      const list = Jofa.get(K.events, []);
      list.unshift(rec);
      Jofa.set(K.events, list);
      Jofa.broadcast();
      $("#eventForm").reset();
      suc.textContent = Jofa.t("events.success");
    });
  }

  /* ---------- Menu modal ---------- */
  function initMenuModal() {
    $("#viewMenuBtn").addEventListener("click", () => {
      const body = $("#menuModalBody");
      body.innerHTML = "";
      const cats = [...new Set(Jofa.get(K.menu, []).map((m) => m.category))];
      cats.forEach((c) => {
        const h = document.createElement("h4");
        h.textContent = c;
        h.style.color = "var(--primary)";
        body.appendChild(h);
        Jofa.get(K.menu, []).filter((m) => m.category === c && m.available !== false).forEach((m) => {
          const row = document.createElement("div");
          row.style.cssText = "display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);";
          const price = m.price ? `KES ${m.price.toLocaleString()}` : "Price on request";
          row.innerHTML = `<img src="${m.image}" alt="${m.name}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;" onerror="this.style.background='var(--bg-alt)'" /><div><strong>${lang() === "sw" ? (m.nameSw || m.name) : m.name}</strong><div style="font-size:12px;color:var(--text-muted)">${m.description || ""}</div><div style="color:var(--gold);font-weight:600;font-size:13px;">${price}</div></div>`;
          body.appendChild(row);
        });
      });
      if (!Jofa.get(K.menu, []).length) body.innerHTML = `<p>${Jofa.t("common.empty")}</p>`;
      openModal("menuModal");
    });
  }

  /* ---------- Modals ---------- */
  function openModal(id) { $("#" + id).classList.add("open"); }
  function closeModals() { $$(".modal").forEach((m) => m.classList.remove("open")); }
  function initModals() {
    $$("[data-close]").forEach((el) => el.addEventListener("click", closeModals));
    $$(".modal").forEach((m) => {
      m.addEventListener("click", (e) => { if (e.target === m) closeModals(); });
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModals(); });
  }

  /* ---------- Icons (inline svg) ---------- */
  function iconSvg(name) {
    const map = {
      waves: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/></svg>',
      wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>',
      utensils: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>',
      car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L18 11l-2.7-3.6a1 1 0 0 0-.8-.4H9.5a1 1 0 0 0-.8.4L6 11l-3.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0zM5 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0z"/></svg>',
      parking: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
      bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
      coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
      bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>',
    };
    return map[name] || "";
  }

  /* ---------- Render all dynamic ---------- */
  function renderAll() {
    Jofa.applyI18n(document);
    loadSettingsIntoUI();
    renderRooms();
    renderFacilities();
    renderWhy();
    renderMenuCats();
    renderGallery();
    renderNews();
    renderTestimonials();
    populateRoomSelect($("#bkRoom").value);
    calcBooking();
  }

  /* ---------- Sync across tabs ---------- */
  function initSync() {
    window.addEventListener("storage", (e) => {
      if (e.key && e.key.startsWith("jofa_")) {
        renderAll();
      }
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initLang();
    initNav();
    initModals();
    initLightbox();
    initBooking();
    initContact();
    initEvents();
    initMenuModal();
    initSync();
    renderAll();
    // lucide
    if (window.lucide) window.lucide.createIcons();
  });
})();
