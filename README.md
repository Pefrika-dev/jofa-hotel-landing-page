# HOTEL JOFA — Website & Admin Dashboard

Premium business website for HOTEL JOFA, Migori, Kenya. Built with clean, modern frontend code and a lightweight admin panel for managing content with ease.

## Overview
A fully responsive, multi-page website for Hotel Jofa featuring a public landing page and a dedicated admin dashboard. Content is managed through an intuitive admin panel with data stored in the browser via `localStorage` for this deployment. Designed and developed by **Thomas Hondo Chacha – Software Engineer**.

## Project Structure
```
hotel-jofa/
├── index.html
├── css/style.css
├── js/data.js
├── js/script.js
├── admin/
│   ├── index.html
│   ├── css/admin.css
│   └── js/admin.js
├── assets/images/
├── assets/icons/
└── README.md
```

## Run Locally
- Open `index.html` directly in a browser, or
- Use the VS Code Live Server extension for a local server.

Admin dashboard: open `admin/index.html`.

## Demo Login
Username: `admin`
Password: `JofaDemo2026!`

Notice: DEMO ADMIN ACCESS — NOT FOR PRODUCTION USE. Frontend-only auth is not secure.

## Features
- Responsive premium UI, light/dark themes, EN/SW language switcher
- Functional demo booking inquiry (localStorage)
- Room management, menu, gallery, news, testimonials
- Event & contact inquiry forms
- Admin CRUD for bookings, rooms, menu, events, contacts, gallery, news, testimonials
- CSV export, reset demo data
- Cross-tab sync via storage events

## localStorage
Shared keys prefixed `jofa_`. Public site and admin use the same schema.

## Reset Demo Data
Admin Dashboard → Overview → "Reset Demo Data" (confirms first).

## Replace Stock Photos
Edit image URLs in admin dashboard (Gallery/Rooms/News/Menu) or in `js/data.js` defaults.

## Production Requirements
- Secure backend + database
- Real availability & booking logic
- Secure authentication (hashed passwords, sessions, authorization)
- Payment gateway integration
- Email/SMS notifications
- Real hotel photos and verified details
- HTTPS hosting and monitoring

Frontend-only admin authentication and localStorage are not suitable for production.
