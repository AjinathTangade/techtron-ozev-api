# Techtron OZEV API

A Node.js REST API backend for managing OZEV (Office for Zero Emission Vehicles) installer registrations. Built for integration with a Shopify storefront, this API handles installer sign-ups, document uploads, admin authentication, and installer approval/deletion.

**Live API:** `https://techtron-ozev-api.onrender.com`  
**Hosted on:** Render  
**Database:** Firebase Firestore  
**File Storage:** Cloudinary

---

## Live Project URLs

### Shopify Frontend Pages

| Page | URL | Purpose |
|---|---|---|
| Become Installer | [/pages/become-installer](https://new-shoe-brand.myshopify.com/pages/become-installer) | Installer registration form |
| Find Installer | [/pages/find-installer](https://new-shoe-brand.myshopify.com/pages/find-installer) | Public installer search |
| OZEV Admin | [/pages/ozev-admin](https://new-shoe-brand.myshopify.com/pages/ozev-admin) | Admin login and installer management |

### API Base

| Environment | URL |
|---|---|
| Production | `https://techtron-ozev-api.onrender.com` |
| Local Dev | `http://localhost:5000` |

---

## Table of Contents

- [Live Project URLs](#live-project-urls)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
  - [Installer Endpoints](#installer-endpoints)
  - [Admin Endpoints](#admin-endpoints)
- [Authentication](#authentication)
- [File Uploads](#file-uploads)
- [Shopify Integration](#shopify-integration)
- [Deployment](#deployment)

---

## Tech Stack

| Package | Purpose |
|---|---|
| `express` v5 | Web framework |
| `firebase-admin` | Firestore database |
| `multer` + `multer-storage-cloudinary` | File upload handling |
| `jsonwebtoken` | Admin JWT authentication |
| `bcryptjs` | Password hashing |
| `nodemailer` | Email notifications |
| `cors` | Cross-origin request handling |
| `dotenv` | Environment variable management |
| `uuid` | Unique ID generation |

---

## Project Structure

```
techtron-ozev-api/
├── server.js                        # Entry point, Express setup, CORS, routes
├── package.json
├── .env                             # Environment variables (not committed)
│
├── config/
│   ├── firebase.js                  # Firebase Admin SDK initialisation
│   ├── cloudinary.js                # Cloudinary SDK configuration
│   └── firebase-service-account.json # Firebase credentials (not committed)
│
├── controllers/
│   ├── installerController.js       # POST /api/installers/register
│   ├── searchInstallerController.js # GET  /api/installers/search
│   ├── adminController.js           # POST /api/admin/login
│   └── adminInstallerController.js  # GET / PATCH / DELETE /api/admin/installers
│
├── middleware/
│   ├── authMiddleware.js            # JWT verification for admin routes
│   └── uploadMiddleware.js          # Multer + Cloudinary file upload config
│
├── routes/
│   ├── installerRoutes.js           # Public installer routes
│   └── adminRoutes.js               # Protected admin routes
│
├── services/                        # Email / notification services
└── uploads/                         # Temp upload directory
```

---

## Environment Variables

Create a `.env` file in the project root with the following:

```env
# Firebase
FIREBASE_SERVICE_ACCOUNT=./config/firebase-service-account.json

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_super_secret_key

# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=yourpassword

# Server
PORT=5000
```

> **Never commit `.env` or `firebase-service-account.json` to version control.**

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore enabled
- A Cloudinary account
- A Render account (or any Node.js host)

### Local Development

```bash
# Clone the repo
git clone https://github.com/AjinathTangade/techtron-ozev-api.git
cd techtron-ozev-api

# Install dependencies
npm install

# Add your .env file (see above)

# Start dev server with hot reload
npm run dev

# Or start without nodemon
npm start
```

The server will run on `http://localhost:5000`.

---

## API Reference

**Base URL:** `https://techtron-ozev-api.onrender.com`

---

### Installer Endpoints

#### `POST /api/installers/register`

Register a new installer application. Accepts `multipart/form-data` (required for file uploads).

**Request — Form Fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `fullName` | string | ✅ | Installer's full name |
| `companyName` | string | ✅ | Company name |
| `email` | string | ✅ | Contact email |
| `phone` | string | ✅ | Contact phone number |
| `city` | string | ✅ | Primary city |
| `postcode` | string | ✅ | Postcode |
| `qualifications` | string | ❌ | Qualifications and certifications |
| `edition18` | file | ✅ | 18th Edition Certificate (PDF/JPG/PNG) |
| `ozev` | file | ✅ | OZEV Certificate (PDF/JPG/PNG) |
| `insurance` | file | ✅ | Insurance Document (PDF/JPG/PNG) |

**Response `201`:**
```json
{
  "success": true,
  "message": "Installer registered successfully",
  "id": "firestore-document-id"
}
```

**Response `400/500`:**
```json
{
  "error": "Error message here"
}
```

---

#### `GET /api/installers/search?query=`

Search approved installers by city or postcode. Partial matches are supported.

**Query Parameters:**

| Param | Required | Description |
|---|---|---|
| `query` | ✅ | City name or postcode to search |

**Example:**
```
GET /api/installers/search?query=Manchester
GET /api/installers/search?query=M1
```

**Response `200`:**
```json
[
  {
    "firestoreId": "abc123",
    "fullName": "John Smith",
    "companyName": "Techtron EV Ltd",
    "city": "Manchester",
    "postcode": "M1 1AA",
    "status": "approved",
    "contactEmail": "john@example.com",
    "contactPhone": "+44 7700 900000"
  }
]
```

---

### Admin Endpoints

All admin endpoints (except `/login`) require a Bearer token in the `Authorization` header.

---

#### `POST /api/admin/login`

Authenticate as admin and receive a JWT token.

**Request Body (`application/json`):**
```json
{
  "email": "admin@example.com",
  "password": "yourpassword"
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response `401`:**
```json
{
  "error": "Invalid credentials"
}
```

> The token expires after **24 hours**. Store it in `localStorage` on the client and send it as `Authorization: Bearer <token>` on every protected request.

---

#### `GET /api/admin/installers`

Retrieve all installer registrations.

**Headers:**
```
Authorization: Bearer <token>
```

**Response `200`:**
```json
[
  {
    "firestoreId": "abc123",
    "fullName": "John Smith",
    "companyName": "Techtron EV Ltd",
    "email": "john@example.com",
    "phone": "+44 7700 900000",
    "city": "Manchester",
    "postcode": "M1 1AA",
    "status": "pending",
    "qualifications": "18th Edition, NVQ Level 3"
  }
]
```

> **Note:** The `firestoreId` field is the real Firestore document ID. Use this for approve and delete operations — not the `id` field inside the document data.

---

#### `PATCH /api/admin/installers/:id/approve`

Approve an installer registration. Sets `status` to `"approved"` and records `approvedAt` timestamp.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**

| Param | Description |
|---|---|
| `id` | The `firestoreId` of the installer |

**Response `200`:**
```json
{
  "success": true,
  "message": "Installer approved successfully"
}
```

**Response `404`:**
```json
{
  "error": "Installer not found"
}
```

---

#### `DELETE /api/admin/installers/:id`

Permanently delete an installer registration from Firestore.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Params:**

| Param | Description |
|---|---|
| `id` | The `firestoreId` of the installer |

**Response `200`:**
```json
{
  "success": true,
  "message": "Installer deleted successfully"
}
```

**Response `404`:**
```json
{
  "error": "Installer not found"
}
```

---

## Authentication

Admin routes use **JWT (JSON Web Token)** authentication.

1. Call `POST /api/admin/login` with valid credentials
2. Store the returned token: `localStorage.setItem('adminToken', token)`
3. Include it on every protected request:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Tokens expire after **24 hours** — the admin will need to log in again
5. Logout by clearing the token: `localStorage.removeItem('adminToken')`

There is no server-side session. Logout is purely client-side token removal.

---

## File Uploads

Documents uploaded during registration are stored on **Cloudinary** via `multer-storage-cloudinary`.

- Accepted formats: PDF, JPG, JPEG, PNG
- Three required files per registration:
  - `edition18` — 18th Edition Electrical Certificate
  - `ozev` — OZEV Authorisation Certificate
  - `insurance` — Public Liability Insurance Document
- Cloudinary URLs are saved to the installer's Firestore document

---

## Shopify Integration

This API powers three Shopify Liquid sections:

| Section | File | Description |
|---|---|---|
| Installer Registration | `sections/ozev-register.liquid` | Public form to apply as an installer |
| Installer Finder | `sections/ozev-finder.liquid` | Public search by city/postcode |
| Admin Dashboard | `sections/ozev-admin.liquid` | Protected admin panel |

Each section has a corresponding CSS and JS asset:

```
assets/
  ozev-register.css / ozev-register.js
  ozev-finder.css   / ozev-finder.js
  ozev-admin.css    / ozev-admin.js
```

Config (API URL, labels, messages) is managed entirely through the **Shopify Customizer** — no hardcoded values in asset files.

### CORS

The API allows requests from any `*.myshopify.com` or `*.shopify.com` origin. To restrict to your store only, update the `cors` config in `server.js`.

---

## Deployment

The API is deployed on **Render** (free tier).

### Re-deploy after changes

```bash
# Commit and push to GitHub — Render auto-deploys from main branch
git add .
git commit -m "your message"
git push origin main
```

### Important: Express 5 + Node 24 compatibility

Express 5 uses a newer version of `path-to-regexp` that does **not** accept bare `*` wildcards. Use the named wildcard syntax instead:

```js
// ❌ Breaks on Node 24 / Express 5
app.options('*', cors());

// ✅ Correct
app.options('/{*path}', cors());
```

