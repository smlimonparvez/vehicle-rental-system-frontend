# 🚗 Vehicle Rental System

A full-stack vehicle rental management application with a Node.js/TypeScript backend API and a Next.js 14 frontend. Customers can browse and book vehicles; admins manage the fleet, users, and booki[...]

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20Site-brightgreen?style=for-the-badge&logo=vercel)](https://vehicle-rental-frontend-kappa.vercel.app)  
[![API Base URL](https://img.shields.io/badge/API-Base%20URL-blue?style=for-the-badge)](https://vehicle-rental-system-back-end.vercel.app/api/v1)

**Live Demo (plain link):** https://vehicle-rental-frontend-kappa.vercel.app  
**API Base URL (plain link):** https://vehicle-rental-system-back-end.vercel.app/api/v1

---

## 📸 Features

### Customer
- Register / login with JWT authentication
- Browse all vehicles with search and type filtering
- View detailed vehicle information
- Book a vehicle for specific dates with automatic price calculation
- View and cancel own bookings
- Edit profile

### Admin
- Manage vehicles — add, edit, delete (with image URL support)
- Manage users — update roles, delete accounts
- Manage all bookings — view and mark as returned
- Dashboard with real-time statistics

### General
- Dark / light mode toggle
- Fully responsive (mobile-first)
- Role-based route protection
- Animated landing page with 7 sections

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + TypeScript | Runtime & language |
| Express.js 5 | Web framework |
| PostgreSQL (Neon) | Database |
| bcrypt | Password hashing |
| jsonwebtoken | JWT authentication |
| pg | PostgreSQL client |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| next-themes | Dark / light mode |
| lucide-react | Icons |
| react-hot-toast | Notifications |

---

## 📁 Project Structure

```
vehicle-rental-system/
│
├── backend/                          # Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts           # Neon DB connection + schema
│   │   ├── modules/
│   │   │   ├── auth/                 # Signup / signin
│   │   │   ├── users/                # User CRUD
│   │   │   ├── vehicles/             # Vehicle CRUD
│   │   │   └── bookings/             # Booking management
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    # JWT verify + role check
│   │   │   ├── error.middleware.ts   # Global error handler
│   │   │   └── validation.middleware.ts
│   │   ├── utils/
│   │   │   ├── jwt.utils.ts
│   │   │   └── response.utils.ts
│   │   ├── types/index.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── database/
│   │   ├── schema.sql
│   │   └── migration_add_image_url.sql
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                         # Next.js app
    └── src/
        ├── app/
        │   ├── (public)/             # No auth — vehicles, about, contact
        │   ├── (customer)/           # Customer-only — dashboard, bookings
        │   ├── (admin)/              # Admin-only — admin panel
        │   └── (auth)/               # Login, register
        ├── components/
        │   ├── auth/AuthGuard.tsx
        │   ├── home/                 # Landing page sections
        │   ├── layout/               # Navbar, Footer, Sidebar
        │   └── ui/                   # Badge, Modal, Skeleton, ThemeToggle
        ├── context/AuthContext.tsx
        ├── hooks/useScrollAnimation.ts
        ├── lib/
        │   ├── api.ts
        │   ├── auth.ts
        │   └── utils.ts
        └── types/index.ts
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database

---

### Backend

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

```bash
# 4. Run database schema
# Option A: using the setup script
npm run db:setup

# Option B: paste database/schema.sql into Neon SQL Editor

# 5. Run migration to add image_url column (if upgrading)
# Paste database/migration_add_image_url.sql into Neon SQL Editor

# 6. Start development server
npm run dev
```

API runs at `http://localhost:5000`

---

### Frontend

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1" > .env.local

# 4. Start development server
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## 🗄️ Database Schema

### Users
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| name | VARCHAR | Required |
| email | VARCHAR | Unique |
| password | VARCHAR | Hashed with bcrypt |
| phone | VARCHAR | Required |
| role | VARCHAR | `admin` or `customer` |

### Vehicles
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| vehicle_name | VARCHAR | Required |
| type | VARCHAR | `car`, `bike`, `van`, `SUV` |
| registration_number | VARCHAR | Unique |
| daily_rent_price | DECIMAL | Must be > 0 |
| availability_status | VARCHAR | `available` or `booked` |
| image_url | VARCHAR | Optional image URL |

### Bookings
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL | Primary key |
| customer_id | INT | FK → users |
| vehicle_id | INT | FK → vehicles |
| rent_start_date | DATE | Required |
| rent_end_date | DATE | Must be after start |
| total_price | DECIMAL | daily_price × days |
| status | VARCHAR | `active`, `cancelled`, `returned` |

---

## 🌐 API Endpoints

### Authentication
```
POST /api/v1/auth/signup    Public   Register new user
POST /api/v1/auth/signin    Public   Login, returns JWT token
```

### Vehicles
```
GET    /api/v1/vehicles              Public     List all vehicles
GET    /api/v1/vehicles/:id          Public     Get vehicle details
POST   /api/v1/vehicles              Admin      Create vehicle (+ image_url)
PUT    /api/v1/vehicles/:id          Admin      Update vehicle
DELETE /api/v1/vehicles/:id          Admin      Delete vehicle
```

### Users
```
GET    /api/v1/users                 Admin      List all users
PUT    /api/v1/users/:id             Admin/Own  Update user
DELETE /api/v1/users/:id             Admin      Delete user
```

### Bookings
```
POST   /api/v1/bookings              Auth       Create booking
GET    /api/v1/bookings              Auth       Get bookings (role-based)
PUT    /api/v1/bookings/:id          Auth       Update booking status
```

All protected endpoints require header:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Business Rules

| Rule | Description |
|------|-------------|
| Price calculation | `daily_rent_price × number_of_days` |
| Booking created | Vehicle status → `booked` |
| Booking returned | Vehicle status → `available` |
| Booking cancelled | Vehicle status → `available` |
| Customer cancel | Only before start date |
| Mark returned | Admin only |
| Delete user | Not allowed if active bookings exist |
| Delete vehicle | Not allowed if active bookings exist |

---

## 🚀 Deployment

### Backend → Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Set environment variables in Railway dashboard:
# DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV=production

# Deploy
git push origin main   # auto-deploys on push
```

### Frontend → Vercel

```bash
# Push to GitHub, then connect repo at vercel.com

# Set environment variable in Vercel dashboard:
NEXT_PUBLIC_API_URL = https://your-backend.railway.app/api/v1
```

---

## 🧪 Default Test Accounts

After running `npm run db:setup`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vehiclerental.com | admin123 |
| Customer | *(register via /register)* | — |

---

## 👤 Author

**Limon Parvez**  
GitHub: [@smlimonparvez](https://github.com/smlimonparvez)
