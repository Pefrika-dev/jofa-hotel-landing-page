/* ============================================================
   HOTEL JOFA — Shared Data Layer
   localStorage persistence, seed/demo data, i18n dictionary,
   and shared helpers used by both the public site and admin.
   ============================================================ */

(function (global) {
  "use strict";

  const PREFIX = "jofa_";
  const K = {
    theme: PREFIX + "theme",
    lang: PREFIX + "lang",
    rooms: PREFIX + "rooms",
    menu: PREFIX + "menu",
    bookings: PREFIX + "bookings",
    events: PREFIX + "events",
    contacts: PREFIX + "contacts",
    gallery: PREFIX + "gallery",
    news: PREFIX + "news",
    testimonials: PREFIX + "testimonials",
    settings: PREFIX + "settings",
    adminSession: PREFIX + "admin_session",
    seeded: PREFIX + "seeded",
  };

  /* ---------- Default seed data ---------- */

  const DEFAULT_SETTINGS = {
    phone: "0759 196 745",
    email: "info@hoteljofa.co.ke",
    address: "A1, Suba Kuria, Migori County, Kenya",
    website: "hoteljofa.co.ke",
    facebook: "https://www.facebook.com/hoteljofa",
    instagram: "https://www.instagram.com/hoteljofa",
    heroHeading: "Comfort, Elegance & Genuine African Hospitality.",
    heroDescription:
      "Discover comfortable accommodation, delicious dining, and welcoming hospitality along the Migori–Sirare Highway in Migori, Kenya.",
    whatsapp: "254759196745",
  };

  const DEFAULT_ROOMS = [
    {
      id: "room-single",
      name: "Standard Single",
      nameSw: "Chumba cha Kawaida (Mtu Mmoja)",
      price: 2000,
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      description:
        "A comfortable single room ideal for solo travellers and business guests, with a clean, restful setting.",
      descriptionSw:
        "Chumba cha starehe kwa msafiri mmoja au mgeni wa kibiashara, katika mazingira safi na ya utulivu.",
      bed: "1 Single Bed",
      capacity: "1 Guest",
      amenities: ["Breakfast included", "24/7 Room Service", "High-Speed Wi-Fi", "Parking"],
      enabled: true,
      proposed: false,
    },
    {
      id: "room-double",
      name: "Standard Double",
      nameSw: "Chumba cha Kawaida (Wawili)",
      price: 2500,
      image:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
      description:
        "A spacious double room suited to couples, families, and business travellers seeking extra comfort.",
      descriptionSw:
        "Chumba kikubwa cha wawili kinachofaa wanandoa, familia, na wasafiri wa kibiashara wanaotafuta starehe zaidi.",
      bed: "1 Double Bed",
      capacity: "2 Guests",
      amenities: ["Breakfast included", "24/7 Room Service", "High-Speed Wi-Fi", "Parking"],
      enabled: true,
      proposed: false,
    },
  ];

  const DEFAULT_MENU = [
    { id: "m1", name: "Indigenous Meals", category: "Indigenous", price: null, description: "Sample category — local Kenyan dishes (prices to be confirmed).", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80", available: true, sample: true },
    { id: "m2", name: "International Meals", category: "International", price: null, description: "Sample category — international cuisine (prices to be confirmed).", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80", available: true, sample: true },
    { id: "m3", name: "Special Dishes", category: "Special", price: null, description: "Sample category — chef's specials (prices to be confirmed).", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80", available: true, sample: true },
    { id: "m4", name: "Soft Drinks", category: "Beverages", price: null, description: "Sample category — non-alcoholic drinks (prices to be confirmed).", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80", available: true, sample: true },
    { id: "m5", name: "Alcoholic Beverages", category: "Beverages", price: null, description: "Sample category — alcoholic drinks (prices to be confirmed).", image: "https://images.unsplash.com/photo-1514362543473-4772b43df0d5?auto=format&fit=crop&w=800&q=80", available: true, sample: true },
  ];

  const DEFAULT_GALLERY = [
    { id: "g1", url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80", caption: "Guest room (illustrative)", captionSw: "Chumba cha wageni (mfano)" },
    { id: "g2", url: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=900&q=80", caption: "Swimming pool (illustrative)", captionSw: "Bwawa la kuogelea (mfano)" },
    { id: "g3", url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80", caption: "Restaurant (illustrative)", captionSw: "Mkahawa (mfano)" },
    { id: "g4", url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80", caption: "Dining (illustrative)", captionSw: "Chakula (mfano)" },
    { id: "g5", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80", caption: "Hotel exterior (illustrative)", captionSw: "Nje ya hoteli (mfano)" },
    { id: "g6", url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80", caption: "Events & conferences (illustrative)", captionSw: "Matukio na mikutano (mfano)" },
    { id: "g7", url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80", caption: "Outdoor seating (illustrative)", captionSw: "Viti vya nje (mfano)" },
    { id: "g8", url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80", caption: "Bedroom (illustrative)", captionSw: "Chumba cha kulala (mfano)" },
  ];

  const DEFAULT_NEWS = [
    { id: "n1", title: "Affordable Accommodation at Hotel Jofa", titleSw: "Malazi ya bei nafuu katika Hotel Jofa", excerpt: "Comfortable rooms along the Migori–Sirare Highway at friendly rates. (Demo content — requires approval before publication.)", excerptSw: "Vyumba vya starehe kando ya barabara ya Migori–Sirare kwa bei nafuu. (Maudhui ya mfano — yanahitaji idhini kabla ya kuchapishwa.)", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80", published: false, date: "2026-01-01" },
    { id: "n2", title: "Discover Hotel Facilities", titleSw: "Gundua Vifaa vya Hoteli", excerpt: "Swimming pool, restaurant, Wi-Fi and more for business and leisure travellers. (Demo content.)", excerptSw: "Bwawa la kuogelea, mkahawa, Wi-Fi na zaidi kwa wasafiri wa kibiashara na mapumziko. (Maudhui ya mfano.)", image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?auto=format&fit=crop&w=900&q=80", published: false, date: "2026-01-02" },
    { id: "n3", title: "Dining and Hospitality at Hotel Jofa", titleSw: "Chakula na Ukarimu katika Hotel Jofa", excerpt: "Enjoy a variety of meals in a welcoming environment. (Demo content.)", excerptSw: "Furahia aina mbalimbali za chakula katika mazingira ya ukarimu. (Maudhui ya mfano.)", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80", published: false, date: "2026-01-03" },
  ];

  const DEFAULT_TESTIMONIALS = []; // intentionally empty — do not fabricate

  const DEFAULT_DEMO_BOOKINGS = [
    {
      id: "demo-bk-1",
      ref: "JOF-DEMO-0001",
      guestName: "DEMO DATA — Sample Guest",
      phone: "0759 196 745",
      email: "demo@example.com",
      checkIn: futureDate(3),
      checkOut: futureDate(5),
      guests: 2,
      roomId: "room-double",
      roomName: "Standard Double",
      nights: 2,
      pricePerNight: 2500,
      total: 5000,
      specialRequests: "Demo record — not a real booking.",
      status: "Pending",
      createdAt: new Date().toISOString(),
      isDemo: true,
    },
  ];

  function futureDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  const DEFAULT_DEMO_EVENTS = [
    {
      id: "demo-ev-1",
      name: "DEMO DATA — Sample Event",
      phone: "0759 196 745",
      email: "demo@example.com",
      eventType: "Conference",
      date: futureDate(14),
      attendees: 20,
      requirements: "Demo record — not a real inquiry.",
      status: "Pending",
      createdAt: new Date().toISOString(),
      isDemo: true,
    },
  ];

  const DEFAULT_DEMO_CONTACTS = [
    {
      id: "demo-ct-1",
      name: "DEMO DATA — Sample Contact",
      email: "demo@example.com",
      phone: "0759 196 745",
      subject: "General enquiry (demo)",
      message: "Demo record — not a real message.",
      read: false,
      createdAt: new Date().toISOString(),
      isDemo: true,
    },
  ];

  /* ---------- Storage helpers ---------- */

  function get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return (typeof fallback === "function" ? fallback() : fallback);
      return JSON.parse(raw);
    } catch (e) {
      return (typeof fallback === "function" ? fallback() : fallback);
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("Storage write failed", e);
      return false;
    }
  }

  function remove(key) {
    localStorage.removeItem(key);
  }

  function uid(prefix) {
    return (prefix || "id") + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  // Phone numbers used by earlier demo seeds — replaced automatically so
  // browsers that already stored settings pick up the current hotel number.
  const LEGACY_PHONES = ["+254 714 602 887", "+254714602887"];
  const LEGACY_WHATSAPP = ["254714602887"];

  function migrateSettings() {
    const s = typeof get(K.settings, null) === "object" ? get(K.settings, null) : null;
    if (!s) return;
    let changed = false;
    if (!s.phone || LEGACY_PHONES.indexOf(s.phone) !== -1) {
      s.phone = DEFAULT_SETTINGS.phone;
      changed = true;
    }
    if (!s.whatsapp || LEGACY_WHATSAPP.indexOf(s.whatsapp) !== -1) {
      s.whatsapp = DEFAULT_SETTINGS.whatsapp;
      changed = true;
    }
    if (changed) set(K.settings, s);
  }

  function seed() {
    if (localStorage.getItem(K.seeded) === "1") {
      migrateSettings();
      return;
    }
    set(K.theme, "light");
    set(K.lang, "en");
    set(K.rooms, DEFAULT_ROOMS);
    set(K.menu, DEFAULT_MENU);
    set(K.bookings, DEFAULT_DEMO_BOOKINGS);
    set(K.events, DEFAULT_DEMO_EVENTS);
    set(K.contacts, DEFAULT_DEMO_CONTACTS);
    set(K.gallery, DEFAULT_GALLERY);
    set(K.news, DEFAULT_NEWS);
    set(K.testimonials, DEFAULT_TESTIMONIALS);
    set(K.settings, DEFAULT_SETTINGS);
    localStorage.setItem(K.seeded, "1");
  }

  function resetDemoData() {
    // preserve theme/lang/admin session? reset data only
    set(K.rooms, DEFAULT_ROOMS);
    set(K.menu, DEFAULT_MENU);
    set(K.bookings, DEFAULT_DEMO_BOOKINGS);
    set(K.events, DEFAULT_DEMO_EVENTS);
    set(K.contacts, DEFAULT_DEMO_CONTACTS);
    set(K.gallery, DEFAULT_GALLERY);
    set(K.news, DEFAULT_NEWS);
    set(K.testimonials, DEFAULT_TESTIMONIALS);
    set(K.settings, DEFAULT_SETTINGS);
    // reset seeded flag stays 1
    localStorage.setItem(K.seeded, "1");
  }

  /* ---------- Collections ---------- */

  const Collections = {
    rooms: K.rooms,
    menu: K.menu,
    bookings: K.bookings,
    events: K.events,
    contacts: K.contacts,
    gallery: K.gallery,
    news: K.news,
    testimonials: K.testimonials,
  };

  function list(name) {
    return get(Collections[name], []);
  }
  function saveList(name, arr) {
    return set(Collections[name], arr);
  }

  /* ---------- i18n ---------- */

  const I18N = {
    en: {
      "nav.home": "Home",
      "nav.rooms": "Rooms & Rates",
      "nav.facilities": "Facilities",
      "nav.restaurant": "Restaurant",
      "nav.gallery": "Gallery",
      "nav.about": "About Us",
      "nav.events": "Events",
      "nav.contact": "Contact",
      "nav.book": "Book a Room",
      "hero.eyebrow": "WELCOME TO HOTEL JOFA",
      "hero.title": "Comfort, Elegance & Genuine African Hospitality.",
      "hero.text": "Discover comfortable accommodation, delicious dining, and welcoming hospitality along the Migori–Sirare Highway in Migori, Kenya.",
      "hero.primary": "BOOK YOUR STAY",
      "hero.secondary": "EXPLORE OUR ROOMS",
      "hero.location": "Migori County, Kenya",
      "booking.title": "Check Availability & Request a Booking",
      "booking.checkin": "Check-in date",
      "booking.checkout": "Check-out date",
      "booking.guests": "Number of guests",
      "booking.room": "Room type",
      "booking.name": "Guest full name",
      "booking.phone": "Phone number",
      "booking.email": "Email address",
      "booking.requests": "Special requests",
      "booking.submit": "Submit Booking Inquiry",
      "booking.note": "Demo inquiry only — not a real-time reservation. Room availability is not verified and no payment is taken.",
      "booking.nights": "Nights",
      "booking.estimated": "Estimated total",
      "booking.breakdown": "Price breakdown",
      "booking.success": "Your booking inquiry has been received. A member of our team will contact you. (Demo only — no room has been reserved.)",
      "booking.ref": "Booking reference",
      "rooms.title": "Rooms & Rates",
      "rooms.subtitle": "Comfortable, affordable accommodation along the Migori–Sirare Highway.",
      "rooms.view": "View Details",
      "rooms.book": "Book This Room",
      "rooms.perNight": "per night",
      "rooms.breakfast": "Breakfast included",
      "rooms.service": "24/7 Room Service",
      "about.title": "About Hotel Jofa",
      "about.p1": "Hotel Jofa is located along the Migori–Sirare Highway in Migori County, Kenya. It serves local residents, business travellers, families, and travellers moving between Kenya and Tanzania.",
      "about.p2": "The hotel provides accommodation and hospitality services in a peaceful setting outside the busy town centre. It is suitable for accommodation, conferences, weddings, and family functions. The hotel opened in March 2020.",
      "about.map": "View on Google Maps",
      "fac.title": "Facilities",
      "fac.subtitle": "Everything you need for a comfortable stay.",
      "rest.title": "A Taste of Hospitality",
      "rest.text": "Enjoy a variety of meals and drinks in a welcoming hotel environment.",
      "rest.view": "View Dining Options",
      "gallery.title": "Gallery",
      "gallery.note": "Images are illustrative stock photography until the hotel supplies its own photos.",
      "events.title": "Events & Functions",
      "events.text": "Host conferences, weddings, family functions, and business gatherings at Hotel Jofa.",
      "events.quote": "Request an Event Quote",
      "events.name": "Name",
      "events.phone": "Phone",
      "events.email": "Email",
      "events.type": "Event type",
      "events.date": "Proposed date",
      "events.attendees": "Estimated attendees",
      "events.req": "Additional requirements",
      "events.success": "Your event inquiry has been received. We will contact you shortly. (Demo only.)",
      "why.title": "Why Choose Hotel Jofa",
      "test.title": "Guest Experiences",
      "test.note": "Demonstration preview — real testimonials will be added after verification. No fictional reviews are presented as genuine.",
      "news.title": "News & Updates",
      "news.note": "Demonstration content — requires approval before publication.",
      "contact.title": "Contact Us",
      "contact.call": "Call",
      "contact.email": "Email",
      "contact.whatsapp": "WhatsApp",
      "contact.map": "Google Maps Search",
      "contact.name": "Name",
      "contact.email": "Email",
      "contact.phone": "Phone",
      "contact.subject": "Subject",
      "contact.message": "Message",
      "contact.send": "Send Message",
      "contact.success": "Your message has been received. (Demo only — no email was sent.)",
      "footer.rights": "© 2026 Hotel Jofa. All rights reserved.",
      "footer.demo": "Designed for reliability, speed and a premium guest experience.",
      "admin.login": "Hotel Jofa Admin Panel",
      "admin.loginNote": "Enter your credentials to access the dashboard.",
      "admin.username": "Username",
      "admin.password": "Password",
      "admin.signin": "Sign In",
      "admin.logout": "Logout",
      "common.close": "Close",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.add": "Add",
      "common.search": "Search",
      "common.filter": "Filter",
      "common.status": "Status",
      "common.actions": "Actions",
      "common.confirm": "Are you sure?",
      "common.empty": "No records found.",
      "common.export": "Export CSV",
      "common.reset": "Reset Demo Data",
    },
    sw: {
      "nav.home": "Nyumbani",
      "nav.rooms": "Vyumba & Bei",
      "nav.facilities": "Vifaa",
      "nav.restaurant": "Mkahawa",
      "nav.gallery": "Picha",
      "nav.about": "Kuhusu Sisi",
      "nav.events": "Matukio",
      "nav.contact": "Mawasiliano",
      "nav.book": "Weka Chumba",
      "hero.eyebrow": "KARIBU HOTEL JOFA",
      "hero.title": "Starehe, Ustawi & Ukarimu Halisi wa Kiafrika.",
      "hero.text": "Gundua malazi ya starehe, chakula kitamu, na ukarimu wa karibu kando ya barabara ya Migori–Sirare, Migori, Kenya.",
      "hero.primary": "WEKA UGENI WAKO",
      "hero.secondary": "CHUNGUZA VYUMBA VYETU",
      "hero.location": "Kaunti ya Migori, Kenya",
      "booking.title": "Angalia Upatikanaji & Omba Kuhifadhi",
      "booking.checkin": "Tarehe ya kuingia",
      "booking.checkout": "Tarehe ya kutoka",
      "booking.guests": "Idadi ya wageni",
      "booking.room": "Aina ya chumba",
      "booking.name": "Jina kamili la mgeni",
      "booking.phone": "Nambari ya simu",
      "booking.email": "Barua pepe",
      "booking.requests": "Maombi maalum",
      "booking.submit": "Tuma Ombi la Kuhifadhi",
      "booking.note": "Ombi la mfano tu — sio uhifadhi wa wakati halisi. Upatikanaji wa chumba haujathibitishwa na hakuna malipo.",
      "booking.nights": "Usiku",
      "booking.estimated": "Jumla inayokadiriwa",
      "booking.breakdown": "Mgawanyo wa bei",
      "booking.success": "Ombi lako la kuhifadhi limepokelewa. Mwanachama wa timu yetu atawasiliana nawe. (Mfano tu — hakuna chumba kilichohifadhiwa.)",
      "booking.ref": "Nambari ya uhifadhi",
      "rooms.title": "Vyumba & Bei",
      "rooms.subtitle": "Malazi ya starehe na bei nafuu kando ya barabara ya Migori–Sirare.",
      "rooms.view": "Tazama Maelezo",
      "rooms.book": "Weka Chumba Hiki",
      "rooms.perNight": "kwa usiku",
      "rooms.breakfast": "Kifungua kinywa kimejumuishwa",
      "rooms.service": "Huduma ya chumba 24/7",
      "about.title": "Kuhusu Hotel Jofa",
      "about.p1": "Hotel Jofa iko kando ya barabara ya Migori–Sirare katika Kaunti ya Migori, Kenya. Inahudumia wakazi wa eneo, wasafiri wa kibiashara, familia, na wasafiri wanaosafiri kati ya Kenya na Tanzania.",
      "about.p2": "Hoteli hutoa malazi na huduma za ukarimu katika mazingira ya utulivu nje ya mjini. Inafaa kwa malazi, mikutano, harusi, na shughuli za familia. Hoteli ilifunguliwa Machi 2020.",
      "about.map": "Tazama kwenye Google Maps",
      "fac.title": "Vifaa",
      "fac.subtitle": "Kila kitu unachohitaji kwa ugeni wa starehe.",
      "rest.title": "Dhana ya Ukarimu",
      "rest.text": "Furahia aina mbalimbali za chakula na vinywaji katika mazingira ya ukarimu.",
      "rest.view": "Tazama Chaguzi za Chakula",
      "gallery.title": "Picha",
      "gallery.note": "Picha ni za mfano (stock) hadi hoteli itakapotoa picha zake.",
      "events.title": "Matukio & Shughuli",
      "events.text": "Fanya mikutano, harusi, shughuli za familia, na mikusanyiko ya kibiashara katika Hotel Jofa.",
      "events.quote": "Omba Bei ya Tukio",
      "events.name": "Jina",
      "events.phone": "Simu",
      "events.email": "Barua Pepe",
      "events.type": "Aina ya tukio",
      "events.date": "Tarehe iliyopendekezwa",
      "events.attendees": "Wahudhuriaji wanaokadiriwa",
      "events.req": "Mahitaji ya ziada",
      "events.success": "Ombi lako la tukio limepokelewa. Tutawasiliana nawe hivi karibuni. (Mfano tu.)",
      "why.title": "Kwa Nini Uchague Hotel Jofa",
      "test.title": "Uzoefu wa Wageni",
      "test.note": "Onyesho la mfano — maoni halisi yataongezwa baada ya uthibitisho. Hakuna maoni ya uongo yanayowasilishwa kama halisi.",
      "news.title": "Habari & Sasisho",
      "news.note": "Maudhui ya mfano — yanahitaji idhini kabla ya kuchapishwa.",
      "contact.title": "Wasiliana Nasi",
      "contact.call": "Piga Simu",
      "contact.email": "Barua Pepe",
      "contact.whatsapp": "WhatsApp",
      "contact.map": "Tafuta Google Maps",
      "contact.name": "Jina",
      "contact.email": "Barua Pepe",
      "contact.phone": "Simu",
      "contact.subject": "Mada",
      "contact.message": "Ujumbe",
      "contact.send": "Tuma Ujumbe",
      "contact.success": "Ujumbe wako umepokelewa. (Mfano tu — hakuna barua pepe iliyotumwa.)",
      "footer.rights": "© 2026 Hotel Jofa. Haki zote zimehifadhiwa.",
      "footer.tagline": "Starehe, umaridadi na ukarimu wa kweli wa Kiafrika huko Migori, Kenya.",
      "footer.dev": "Dhana la tovuti la",
      "footer.role": "Mhandisi wa Programu",
      "footer.author": "Imeundwa na",
      "footer.hire": "Inapatikana kwa ajira",
      "admin.login": "Jopo la Utawala la Hotel Jofa",
      "admin.loginNote": "Ingiza taarifa zako ili kuingia kwenye dashibodi.",
      "admin.username": "Jina la mtumiaji",
      "admin.password": "Nenosiri",
      "admin.signin": "Ingia",
      "admin.logout": "Toka",
      "common.close": "Funga",
      "common.save": "Hifadhi",
      "common.cancel": "Ghairi",
      "common.delete": "Futa",
      "common.edit": "Hariri",
      "common.add": "Ongeza",
      "common.search": "Tafuta",
      "common.filter": "Chuja",
      "common.status": "Hali",
      "common.actions": "Vitendo",
      "common.confirm": "Una uhakika?",
      "common.empty": "Hakuna rekodi.",
      "common.export": "Hamisha CSV",
      "common.reset": "Weka Upya Data za Mfano",
    },
  };

  function t(key) {
    const lang = get(K.lang, "en");
    const dict = I18N[lang] || I18N.en;
    return (dict && dict[key]) || (I18N.en[key] || key);
  }

  function applyI18n(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach((el) => {
      if (el.dataset && el.dataset.custom === "1") return;
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
  }

  /* ---------- Theme ---------- */
  function getTheme() {
    return get(K.theme, "light");
  }
  function setTheme(theme) {
    set(K.theme, theme);
    document.documentElement.setAttribute("data-theme", theme);
  }
  function initTheme() {
    const th = getTheme();
    document.documentElement.setAttribute("data-theme", th);
  }

  /* ---------- Facilities (fixed supplied list) ---------- */
  const FACILITIES = [
    { key: "pool", icon: "waves", en: "Swimming Pool", sw: "Bwawa la Kuogelea", descEn: "Relax and refresh in our swimming pool.", descSw: "Pumzika na onyesha usingizi katika bwawa letu." },
    { key: "wifi", icon: "wifi", en: "High-Speed Wi-Fi / Fibre Internet", sw: "Wi-Fi ya Kasi / Fibre", descEn: "Stay connected with reliable fibre internet.", descSw: "Baki umeunganishwa na intaneti ya fibre ya kuaminika." },
    { key: "restaurant", icon: "utensils", en: "Restaurant & Bar", sw: "Mkahawa & Baa", descEn: "Meals and drinks in a welcoming setting.", descSw: "Chakula na vinywaji katika mazingira ya ukarimu." },
    { key: "pickup", icon: "car", en: "Pick-up & Drop Services", sw: "Huduma za Kuchukua & Kuweka", descEn: "Convenient pick-up and drop-off for guests.", descSw: "Huduma rahisi za kuchukua na kuweka wageni." },
    { key: "parking", icon: "parking", en: "Parking Space", sw: "Eneo la Maegesho", descEn: "Secure parking available on site.", descSw: "Maegesho salama yanapatikana katika eneo." },
    { key: "roomservice", icon: "bell", en: "24/7 Room Service", sw: "Huduma ya Chumba 24/7", descEn: "Round-the-clock room service for your comfort.", descSw: "Huduma ya chumba saa zote kwa starehe yako." },
    { key: "breakfast", icon: "coffee", en: "Breakfast Included", sw: "Kifungua Kinywa Kimejumuishwa", descEn: "Breakfast is included with your stay.", descSw: "Kifungua kinywa kimejumuishwa na ugeni wako." },
    { key: "accom", icon: "bed", en: "Comfortable Accommodation", sw: "Malazi ya Starehe", descEn: "Clean, comfortable rooms for rest.", descSw: "Vyumba safi na vya starehe kwa mapumziko." },
  ];

  /* ---------- Why Choose ---------- */
  const WHY = [
    { en: "Convenient location along the Migori–Sirare Highway", sw: "Eneo rahisi kando ya barabara ya Migori–Sirare" },
    { en: "Comfortable accommodation", sw: "Malazi ya starehe" },
    { en: "Affordable room rates", sw: "Bei nafuu za vyumba" },
    { en: "Swimming pool", sw: "Bwawa la kuogelea" },
    { en: "Restaurant and bar", sw: "Mkahawa na baa" },
    { en: "Peaceful surroundings", sw: "Mazingira ya utulivu" },
    { en: "Hospitality for business and leisure travellers", sw: "Ukarimu kwa wasafiri wa kibiashara na mapumziko" },
  ];

  /* ---------- CSV export ---------- */
  function toCSV(rows, headers) {
    const esc = (v) => {
      if (v === null || v === undefined) return "";
      const s = String(v).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    };
    const lines = [headers.map(esc).join(",")];
    rows.forEach((r) => lines.push(headers.map((h) => esc(r[h])).join(",")));
    return lines.join("\n");
  }
  function downloadCSV(filename, csv) {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ---------- Broadcast sync ---------- */
  function broadcast() {
    try {
      localStorage.setItem(PREFIX + "sync", Date.now().toString());
    } catch (e) {}
  }

  /* ---------- Public API ---------- */
  global.Jofa = {
    K,
    PREFIX,
    seed,
    resetDemoData,
    get,
    set,
    remove,
    uid,
    t,
    applyI18n,
    getTheme,
    setTheme,
    initTheme,
    list,
    saveList,
    I18N,
    FACILITIES,
    WHY,
    DEFAULT_SETTINGS,
    toCSV,
    downloadCSV,
    broadcast,
    futureDate,
  };

  // auto-seed on load
  try { seed(); } catch (e) { console.error(e); }
})(window);
