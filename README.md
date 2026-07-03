# 🍽️ Khansama of Bhopal - Late Night Restaurant Web App

A premium, state-of-the-art web application for **Khansama of Bhopal**, featuring a beautiful, dynamic, dark-themed customer-facing frontend and a robust admin management portal. 

Built using a modern decoupled architecture: **React + Vite (Frontend)** and **FastAPI + PostgreSQL (Backend)**.

---

## 🚀 Features

### 🌟 Customer Experience
- **Interactive Menu**: Multi-category filterable menu with real-time searches, sorting, and dietary indicators (Veg/Non-Veg).
- **Online Table Booking**: Simple reservation form for dining reservations.
- **Visual Food Gallery**: Visual showcase of ambient dining shots and dishes.
- **Customer Reviews**: Dynamic testimonials showing verified client feedback directly on the homepage.
- **Cart & Checkout**: Full item addition, discount calculation, and order tracking code generator.

### 👑 Admin Management Portal
- **Foods Manager**: Add, edit, or delete dishes with image uploads from your system, price controls, discount percentages, and dietary tags.
- **Categories Control**: Manage the system taxonomy and add/edit custom categories.
- **Testimonial Approvals**: Approve or hide customer reviews, and highlight best reviews as "featured".
- **Visual Assets Manager**: Upload restaurant media directly to custom folders and albums.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS (for styling), Axios, React Router, Lucide Icons, React Hot Toast.
- **Backend**: FastAPI (Python 3.10+), SQLAlchemy (ORM), PostgreSQL, Uvicorn, Jose (JWT Authentication), Passlib (Password hashing).

---

## 💻 Local Setup

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate your virtual environment:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate   # Windows
   source .venv/bin/activate  # macOS/Linux
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5174`.

---

## 📁 Project Structure

```
khansama_web/
├── backend/
│   ├── auth/          # JWT tokens & Password hashes
│   ├── config/        # Environment configurations
│   ├── database/      # DB session and PostgreSQL connection
│   ├── models/        # SQLAlchemy Database models
│   ├── routers/       # Router endpoints (auth, menu, orders, gallery)
│   ├── main.py        # FastAPI entrypoint
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/ # Shared UI elements (Navbar, Footer, Sidebar)
│   │   ├── context/    # Global Auth and Cart States
│   │   ├── pages/      # Customer & Admin pages
│   │   └── services/   # Axios API client handlers
│   ├── vite.config.js  # Vite server configurations
│   └── package.json
└── uploads/            # Server-hosted uploaded images/media
```

---

## 📤 Deployment Guide

### Part 1: Push to GitHub
1. Open Git Bash or terminal in the **root project directory** (`khansama_web`).
2. Initialize Git:
   ```bash
   git init
   ```
3. Create a `.gitignore` in the root (exclude node_modules, env files, .venv):
   ```
   # Frontend
   frontend/node_modules/
   frontend/dist/
   
   # Backend
   backend/.venv/
   backend/__pycache__/
   backend/*.pyc
   
   # Environment & Assets
   .env
   backend/.env
   uploads/
   ```
4. Stage and commit files:
   ```bash
   git add .
   git commit -m "Initial commit - Khansama Web Project"
   ```
5. Go to [GitHub](https://github.com), log in, and create a **New Repository** (keep it public or private, do not initialize with README).
6. Copy the remote URL and run the following in your local terminal:
   ```bash
   git branch -M main
   git remote add origin YOUR_REPOSITORY_URL
   git push -u origin main
   ```

---

### Part 2: Deploy Backend (Render.com)
FastAPI runs Python code, which **cannot** be hosted on Netlify (Netlify only hosts static files). You can deploy the backend to [Render](https://render.com) for free:

1. Create a free account on Render.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT` (set the working directory or root to backend if prompted, or configure build paths).
5. Add your database environment variables under **Environment Variables** matching your PostgreSQL setup.
6. Once deployed, copy your Render Service URL (e.g. `https://khansama-backend.onrender.com`).

---

### Part 3: Deploy Frontend (Netlify)
Netlify will host your React SPA static files.

1. Go to [Netlify](https://www.netlify.com) and log in.
2. Click **Add new site** -> **Import from Git**.
3. Choose GitHub and connect your repo.
4. Set the following deployment configurations:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. **Handling API Proxy redirects**: Since the frontend uses `/api` to request backend resources, you need to redirect requests to your Render URL. 
   - Inside your `frontend/public` directory, create a file named `_redirects` containing:
     ```
     /api/*  https://your-backend-render-url.onrender.com/api/:splat  200
     /*      /index.html  200
     ```
   - Replace `https://your-backend-render-url.onrender.com` with your actual Render backend URL. This ensures all `/api` calls are securely routed to the backend.
6. Click **Deploy Site**. Your frontend is now live!
