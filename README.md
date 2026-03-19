# FlowOps — Frontend

React frontend for [FlowOps](https://github.com/Siddhi-1711/flowops), a multi-tenant workflow approval SaaS. Built with React 19, Vite, and a custom design system.

**Live → [flowops-frontend.netlify.app](https://flowops-frontend.netlify.app)**

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Company Admin | siddhi@acme.com | test1234 |
| Approver | raj@test.com | test1234 |
| Employee | priya@test.com | test1234 |

---

## Pages

| Page | Role | Description |
|------|------|-------------|
| Landing | Public | Marketing page with feature overview |
| Register | Public | Create a new company workspace |
| Login | Public | Sign in to existing account |
| Dashboard | All | Stats overview + request history |
| Requests | All | Submit and track approval requests |
| Approvals | Approver, Admin | Approve or reject pending requests |
| Templates | Admin | Build multi-stage workflow templates |
| Users | Admin | Manage team members and roles |

---

## Tech Stack

- **React 19** + **Vite**
- **React Router v7** — client-side routing with protected routes
- **Axios** — HTTP client with JWT Bearer token interceptor
- **DM Sans** — custom typography via Google Fonts
- **CSS variables** — consistent design system (colors, spacing, radius)

---

## Project Structure

```
src/
├── api/
│   └── axios.js          Axios instance with baseURL from VITE_API_URL
├── components/
│   └── Layout.jsx         Sidebar + role-based nav + logout
└── pages/
    ├── Landing.jsx
    ├── Login.jsx
    ├── Register.jsx
    ├── Dashboard.jsx
    ├── Requests.jsx
    ├── Approvals.jsx
    ├── Templates.jsx
    └── Users.jsx
```

---

## Local Development

```bash
git clone https://github.com/Siddhi-1711/flowops-frontend.git
cd flowops-frontend
cp .env.example .env.local
npm install
npm run dev
```

Runs on `http://localhost:5173`. Make sure the backend is running on `http://localhost:8080`.

### Environment Variables

```env
VITE_API_URL=http://localhost:8080
```

---

## Backend

This frontend connects to the [FlowOps Spring Boot backend](https://github.com/Siddhi-1711/flowops).

---

## Author

**Siddhi Kunjir**
- GitHub: [@Siddhi-1711](https://github.com/Siddhi-1711)