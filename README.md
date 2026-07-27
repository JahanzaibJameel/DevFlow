
<h1 align="center">🚀 DevFlow</h1>

<p align="center">
  <strong>Enterprise Project Management Platform — Powered by AI</strong><br/>
  Production-ready Next.js 16 application with real-time collaboration, intelligent automation, and a modern, pixel-perfect UI.
</p>

<p align="center">
  <a href="https://github.com/JahanzaibJameel/DevFlow/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/yourusername/devflow?style=for-the-badge&color=3B82F6" alt="License">
  </a>
  <a href="#">
    <img src="https://img.shields.io/badge/version-1.0.0-3B82F6?style=for-the-badge" alt="Version">
  </a>
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js" alt="Next.js">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS">
  </a>
  <a href="https://supabase.com/">
    <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase" alt="Supabase">
  </a>
  <a href="https://openai.com/">
    <img src="https://img.shields.io/badge/AI-OpenAI-412991?style=for-the-badge&logo=openai" alt="OpenAI">
  </a>
  <a href="https://vercel.com/">
    <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel" alt="Vercel">
  </a>
</p>

---

# 📚 Documentation Index

> Jump straight to what you need.

| Guide | Description |
|-------|-------------|
| [START_HERE.md](START_HERE.md) | Onboarding & architecture overview |
| [QUICKSTART.md](QUICKSTART.md) | 5-minute setup guide |
| [PROJECT_GUIDE.md](PROJECT_GUIDE.md) | Complete developer handbook |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Deep dive into architecture and technical decisions |
| [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) | Production readiness checklist |

---

# ✨ Features

<table>
<tr>
<td width="50%">

### 🎨 Modern UI

20+ production-ready components built with **shadcn/ui** and **Tailwind CSS v4**.

</td>
<td width="50%">

### 📄 17 Ready Pages

Authentication, dashboard, projects, tasks, teams, admin panel, and more.

</td>
</tr>

<tr>
<td>

### 🔐 Authentication

- Email & Password
- Magic Links
- Google OAuth
- GitHub OAuth
- Protected Routes

</td>

<td>

### 🤖 AI Features

- Bug Analysis
- Task Decomposition
- Deadline Prediction
- AI Standups
- Smart Suggestions

</td>
</tr>

<tr>
<td>

### 📊 Analytics Dashboard

- KPI Cards
- Charts
- Activity Timeline
- Deadline Alerts

</td>

<td>

### 🛡️ Enterprise Security

- Zod Validation
- Rate Limiting
- XSS Protection
- CSRF Ready
- Row-Level Security

</td>
</tr>
</table>

---

# 🔌 API Overview

| Module | Endpoints |
|---------|-----------|
| **Projects** | `GET / POST / PUT / DELETE /api/projects` |
| **Tasks** | CRUD, filtering, assignment |
| **AI** | `/api/ai/bug-analysis`<br>`/api/ai/decompose`<br>`/api/ai/deadline`<br>`/api/ai/standup` |
| **Notifications** | `/api/notifications` |
| **Files** | Supabase Storage Uploads |
| **Health** | `/api/health` |
| **Webhooks** | Stripe & Resend |

---

# 🚀 Quick Start

## Prerequisites

- Node.js **18.17+**
- pnpm *(recommended)* or npm
- Supabase Account
- OpenAI API Key
- Resend API Key

---

## Installation

```bash
git clone https://github.com/yourusername/devflow.git

cd devflow

pnpm install
```

---

## Environment Variables

Copy the example file.

```bash
cp .env.example .env.local
```

Fill in the following values.

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

DATABASE_URL=postgresql://...

OPENAI_API_KEY=sk-...

RESEND_API_KEY=re_...
```

---

## Run Development Server

```bash
pnpm dev
```

Open:

```
http://localhost:3000
```

---

# 🧰 Tech Stack

| Layer | Technology |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| State Management | Zustand + TanStack Query |
| AI | OpenAI GPT |
| Testing | Vitest + RTL + Playwright |
| Monitoring | Sentry + PostHog |
| Deployment | Vercel + Docker |

---

# 📁 Project Structure

```text
devflow/
│
├── app/
├── components/
├── hooks/
├── lib/
├── store/
├── types/
├── public/
├── docs/
│
├── .env.example
├── package.json
└── README.md
```

---

# 🖼️ Screenshots

<details>

<summary><strong>📸 Click to View</strong></summary>

<br>

<p align="center">
<img src="https://via.placeholder.com/900x500/F8FAFC/0F172A?text=Light+Dashboard" width="90%" alt="Light Dashboard">

<br><br>

<img src="https://via.placeholder.com/900x500/0F172A/F8FAFC?text=Dark+Dashboard" width="90%" alt="Dark Dashboard">
</p>

</details>

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push to GitHub

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

See the **LICENSE** file for more details.

---

<p align="center">
Made with ❤️ by <strong>Muhammad Jahanzaib</strong>
</p>
