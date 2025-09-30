# Tiny Records Feature

A minimal full-stack demo that implements a **secure records system** with login, session cookies, and a Next.js frontend.

---

## Deliverables

### Backend (Next.js API Routes + TypeScript + In-Memory Storage)

- **Authentication**
  - `POST /api/login`
    - Accepts `{ email: "demo@sma.local", password: "demo123" }`
    - On success, sets an `sid` **httpOnly cookie**
    - Used for all subsequent requests
- **Records API**
  - `GET /api/records`  
    - Auth required (valid session cookie)  
    - Returns only the caller’s records
  - `POST /api/records`  
    - Auth required (valid session cookie)  
    - Accepts body `{ title, priority }`  
    - Validates:
      - `title` ≥ 3 characters
      - `priority` must be `low | med | high`
    - Inserts a new record
- **Storage**
  - In-memory array with fields:
    - `id`
    - `user_email`
    - `title`
    - `priority`
    - `created_at`
- **Constraints**
  - User-scoped records (based on email in session)
  - Invalid requests return JSON errors instead of crashing

---

### Frontend (Next.js + TypeScript + MUI + React Hook Form + TanStack Query)

- **Login Page**
  - Form fields: `email`, `password`
  - Submits to `/api/login`
  - On success → redirects to `/records`
- **Records Page**
  - **Record Form**
    - Fields:
      - `title` (minimum 3 characters, required)
      - `priority` (low / med / high)
    - Submit posts to `/api/records`
    - Submit button disabled until valid
  - **Records List**
    - Uses TanStack Query to fetch from `/api/records`
    - Displays user-scoped records with `title`, `priority`, `created_at`, and `user_email`
- **UI Notes**
  - Material UI components (`Paper`, `Stack`, `TextField`, `Button`, etc.)
  - Light background even in dark mode
  - Loading states with spinners
  - Inline validation error messages

---

## Session Auth

- Session handled via **httpOnly cookies** only (iron-session)
- No JWTs or localStorage
- Keeps frontend minimal and secure

---

## Summary

This project shows how to build a tiny but secure full-stack feature with:

- **Backend:** Next.js API routes, TypeScript, in-memory storage
- **Frontend:** Next.js + TypeScript, MUI, React Hook Form, TanStack Query
- **Auth:** Session cookie only
- **Records:** User-scoped CRUD with validation and error handling
