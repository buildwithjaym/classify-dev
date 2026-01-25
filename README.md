# CLASSIFY

**Your all‑in‑one solution for class cancellations, grades, quizzes, and schedules.**

CLASSIFY is a modern web application designed to simplify academic life for students and faculty. It centralizes schedules, announcements, notifications, and future academic features into a single, fast, and reliable platform.

---

## ✨ Key Features

### 🎓 Student Experience

* View **today’s and weekly schedules** in real time
* Receive **instant notifications** for class cancellations or changes
* See **announcements** from faculty in one place
* Secure **login via Supabase Authentication**

### 🧑‍🏫 Faculty Experience

* Create and cancel class sessions
* Send announcements and notifications to students
* (Planned) Manage grades and quizzes

### ⚙️ Platform Highlights

* Clean, responsive UI with **micro‑animations** for smooth UX
* Real‑time backend powered by **Supabase**
* Modular monorepo architecture for easy scaling

---

## 🧱 Tech Stack

### Frontend

* **Vite** (fast dev server & bundler)
* Vanilla JavaScript (ES Modules)
* CSS with design tokens (light/dark theming)
* Supabase JS client (auth + realtime)

### Backend

* **Node.js + Express**
* Supabase Admin client (secure server‑side operations)
* JWT‑based authentication middleware

### Monorepo & Tooling

* **pnpm workspaces**
* Shared package for constants & data shapes
* Environment‑based configuration (`.env`)

---

## 📁 Project Structure

```text
classify/
├─ apps/
│  ├─ web/        # Vite frontend
│  └─ api/        # Express backend
├─ packages/
│  └─ shared/     # Shared constants & types
├─ docs/          # UI guidelines & API contracts
└─ .github/       # CI workflows
```

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

* Node.js 18+
* pnpm 9+
* A Supabase project

---

### 2️⃣ Install Dependencies

From the project root:

```bash
pnpm install
```

---

### 3️⃣ Environment Variables

Create the following files:

#### `apps/web/.env`

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_API_BASE_URL=http://localhost:3001
```

#### `apps/api/.env`

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_service_role_key
PORT=3001
```

> ⚠️ Never commit `.env` files or secret keys.

---

### 4️⃣ Run the App (Development)

In two terminals:

**Backend**

```bash
pnpm -C apps/api dev
```

**Frontend**

```bash
pnpm -C apps/web dev
```

* Web: [http://localhost:5173](http://localhost:5173)
* API: [http://localhost:3001](http://localhost:3001)

---

## 🔐 Authentication

CLASSIFY uses **Supabase Auth** for secure login:

* Email & password
* Magic link (passwordless)

Sessions are validated on both frontend and backend.

---

## 🌍 Deployment (Free Hosting)

Recommended free setup:

* **Frontend**: Cloudflare Pages / Netlify / Vercel
* **Backend**: Render (free web service)
* **Database & Auth**: Supabase

Environment variables must be configured in each hosting provider’s dashboard.

---

## 🛣️ Roadmap

* Grades & quiz management
* Role‑based dashboards (student / faculty / admin)
* Push notifications
* Offline‑friendly schedule view
* Mobile‑first optimizations

---

## 🤝 Contributing

Contributions are welcome:

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📜 License

This project is currently private and under active development.

---

## ❤️ Acknowledgements

Built with:

* Supabase
* Vite
* Express
* pnpm

CLASSIFY aims to make academic coordination simpler, clearer, and more human.
