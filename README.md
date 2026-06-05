# 🛒 AlphaStore — Full-Stack E-Commerce Store

> **Internship Project** · CodeAlpha · Built with the MERN Stack

[![Node.js](https://img.shields.io/badge/Node.js-26%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.3.2-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.5-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
  - [Seeding the Database](#seeding-the-database)
- [Pages & Routes](#-pages--routes)
- [Authentication & Authorization](#-authentication--authorization)
- [Contributing](#-contributing)
- [Acknowledgements](#-acknowledgements)

---

## 🌟 Overview

**AlphaStore** is a production-ready, full-stack e-commerce web application built as part of the **CodeAlpha Internship Program**. It provides a complete online shopping experience — from product browsing and cart management to checkout, order tracking, and an admin dashboard for store management.

The application follows a **RESTful architecture** with a React SPA on the frontend communicating with an Express/Node.js API backed by local MongoDB. Authentication is implemented with **JWT (JSON Web Tokens)** and passwords are hashed with **bcrypt**.

---

## 🚀 Live Demo

> _Deploy link can be added here once hosted (e.g., Vercel + Render / Railway)_

| Role  | Email | Password |
|-------|-------|----------|
| Admin | `msohaib.store@gmail.com` | `12345678` |
| User  | `jerry@gmail.com`  | `12345678` |

> ⚠️ Seed the database first to get these demo accounts. See [Seeding the Database](#seeding-the-database).

---

## ✨ Features

### Customer Features
- 🔍 **Product Browsing** — Search by keyword and filter by category in real time
- 🛍️ **Shopping Cart** — Add, update quantity, and remove items with persistent state
- 🔐 **Authentication** — Register & login with JWT-based session management
- 📦 **Order Management** — Place orders, view order history, and track delivery status
- ⭐ **Product Reviews** — Leave a verified review only after receiving a delivered order
- 👤 **User Profile** — Update name, email, and password

### Admin Features
- 📊 **Admin Dashboard** — Overview of products, orders, and users
- 🗂️ **Product CRUD** — Create, edit, and delete products with image upload support
- 📋 **Order Management** — View all orders and mark them as paid or delivered
- 👥 **User Management** — View all registered users

### Technical Highlights
- JWT-based stateless authentication with role-based access control (User / Admin)
- File upload via **Multer** with image type validation (JPG, PNG, WEBP)
- Automatic stock deduction on order placement
- Review gating — users can only review products from delivered orders
- Global error-handling middleware on the Express server
- React Context API for global state (cart, user session)
- Responsive UI with Bootstrap 5 and Bootstrap Icons

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router DOM, Bootstrap, Bootstrap Icons, Vite |
| **Backend** | Node.js, Express, ES Modules (`"type": "module"`) |
| **Database** | MongoDB + Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT), bcryptjs |
| **File Upload** | Multer |

---

## 📁 Project Structure

```
CodeAlpha_Ecommerce-Store/
└── ecommerce-store/
    ├── backend/                    # Express REST API
    │   ├── middleware/
    │   │   └── authMiddleware.js   # JWT protect & admin guards
    │   ├── models/
    │   │   ├── User.js             # User schema (bcrypt hashing)
    │   │   ├── Product.js          # Product schema with reviews subdocument
    │   │   └── Order.js            # Order schema with line items
    │   ├── routes/
    │   │   ├── userRoutes.js       # /api/users
    │   │   ├── productRoutes.js    # /api/products
    │   │   └── orderRoutes.js      # /api/orders
    │   ├── uploads/                # Multer-uploaded product images
    │   ├── seed.js                 # Database seeder script
    │   ├── server.js               # App entry point
    │   ├── .env                    # Environment variables (not committed)
    │   └── package.json
    │
    ├── src/                        # React frontend (Vite)
    │   ├── assets/                 # Static assets (images, SVGs)
    │   ├── components/
    │   │   ├── Header.jsx          # Navbar with cart badge & auth links
    │   │   ├── Footer.jsx
    │   │   ├── ProductCard.jsx     # Reusable product grid card
    │   │   └── ScrollToTop.jsx     # Auto-scroll on route change
    │   ├── context/
    │   │   └── StoreContext.jsx    # Global cart & user state (React Context)
    │   ├── pages/
    │   │   ├── Home.jsx            # Product listing with search/filter
    │   │   ├── ProductDetails.jsx  # Single product view & reviews
    │   │   ├── Cart.jsx            # Shopping cart
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Shipping.jsx        # Shipping address form
    │   │   ├── PlaceOrder.jsx      # Order summary & confirmation
    │   │   ├── OrderDetails.jsx    # Order status & tracking
    │   │   ├── Profile.jsx         # User profile & order history
    │   │   └── AdminDashboard.jsx  # Full admin panel
    │   ├── App.jsx                 # Route definitions
    │   └── main.jsx                # React DOM entry point
    │
    ├── public/
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🏁 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | `26.3.0` | [nodejs.org](https://nodejs.org/) |
| npm | `11.16.0` | Bundled with Node.js |
| MongoDB | `8.3.2` (Community Edition) | [mongodb.com](https://www.mongodb.com/) |
| VSCode | `1.121.0`| [code.visualstudio.com](https://code.visualstudio.com/) |

---

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/<your-username>/CodeAlpha_Ecommerce-Store.git
cd CodeAlpha_Ecommerce-Store/ecommerce-store
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ..           # back to ecommerce-store/
npm install
```

---

### Environment Variables

The project uses a `.env` file located in the `backend/` directory.

Update the values according to your environment:

```env
# backend/.env

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce-store
JWT_SECRET=supersecretkey_ecommerce_store_12345
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the Express server listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/ecommerce-store` |
| `JWT_SECRET` | Secret key used to sign JWTs | *(required — change in production)* |

> **⚠️ Security Note:** Never commit your `.env` file to version control. It is already listed in `.gitignore`.

---

### Running the App

You will need **two terminal windows** — one for the backend and one for the frontend.

**Terminal 1 — Start the Backend API**

```bash
cd ecommerce-store/backend
npm start
```

The API server starts at: `http://localhost:5000`

**Terminal 2 — Start the Frontend Dev Server**

```bash
cd ecommerce-store
npm run dev
```

The React app starts at: `http://localhost:5173`

> The frontend is pre-configured to proxy API requests to `http://localhost:5000` via `vite.config.js`.

---

### Seeding the Database

The project ships with a seed script that populates the database with sample products and a default admin user.

```bash
cd backend
npm run seed
```

This will insert sample products and create the following accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | `msohaib.store@gmail.com` | `12345678` |
| User | `jerry@gmail.com` | `12345678` |

To clear the database, you can modify `seed.js` to call `destroyData()` or drop the collection via MongoDB Compass.

---

### Users — `/api/users`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/users` | Public | Register a new user |
| `POST` | `/api/users/login` | Public | Authenticate user & get token |
| `GET` | `/api/users/profile` | Private | Get logged-in user profile |
| `PUT` | `/api/users/profile` | Private | Update logged-in user profile |

### Products — `/api/products`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/products` | Public | Get all products (supports `?keyword=` & `?category=`) |
| `GET` | `/api/products/:id` | Public | Get product by ID |
| `POST` | `/api/products` | Admin | Create a new product |
| `PUT` | `/api/products/:id` | Admin | Update a product |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |
| `POST` | `/api/products/:id/reviews` | Private | Submit a product review |

### Orders — `/api/orders`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/orders` | Private | Create a new order |
| `GET` | `/api/orders/myorders` | Private | Get current user's orders |
| `GET` | `/api/orders` | Admin | Get all orders |
| `GET` | `/api/orders/:id` | Private | Get order by ID |
| `PUT` | `/api/orders/:id/pay` | Private | Mark order as paid |
| `PUT` | `/api/orders/:id/deliver` | Admin | Mark order as delivered |

### Uploads — `/api/upload`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/upload` | Admin | Upload a product image (multipart/form-data, field: `image`) |

### Health Check

```
GET /api/health
```

Response:
```json
{ "status": "OK", "message": "E-commerce API is running" }
```

---

## 🗺️ Pages & Routes

| Path | Page | Access |
|------|------|--------|
| `/` | Home — product listing, search & category filter | Public |
| `/product/:id` | Product detail, image, reviews | Public |
| `/cart` | Shopping cart | Public |
| `/login` | Login form | Public |
| `/register` | Registration form | Public |
| `/shipping` | Shipping address | Private |
| `/placeorder` | Order summary & confirmation | Private |
| `/order/:id` | Order details & status | Private |
| `/profile` | User profile & order history | Private |
| `/admin` | Admin dashboard — products, orders, users | Admin |

---

## 🔐 Authentication & Authorization

This project uses **stateless JWT authentication**:

1. On login or registration, the server signs a JWT (expires in **30 days**) and returns it in the response body.
2. The client stores the token in `localStorage` and attaches it to subsequent requests via the `Authorization: Bearer <token>` header.
3. The `protect` middleware on the server decodes and verifies the token on every protected route.
4. The `admin` middleware checks `user.isAdmin === true` for admin-only routes.

```
Client                    Server
  |                         |
  |  POST /api/users/login  |
  |------------------------>|
  |  { token, user data }   |
  |<------------------------|
  |                         |
  |  GET /api/orders/myorders
  |  Authorization: Bearer <token>
  |------------------------>|
  |  [ orders array ]       |
  |<------------------------|
```

---

## 🤝 Contributing

This is an internship project, but contributions and suggestions are welcome.

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---
## 🙏 Acknowledgements

- [CodeAlpha](https://codealpha.tech/) — for the internship opportunity and project guidelines
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Vite](https://vitejs.dev/)

---

<div align="center">

Made with ❤️ during the **CodeAlpha Internship Program**

</div>
