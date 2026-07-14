# 🚀 Nexhire — AI-Powered Recruitment & Talent Management Platform

Nexhire is a full-stack recruitment platform with AI-powered candidate ranking using Google Gemini via OpenRouter.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, React Router, Axios |
| **Backend** | ASP.NET Core 8 Web API, C# |
| **Database** | PostgreSQL + Entity Framework Core 8 |
| **AI** | OpenRouter API → Google Gemini 2.5 Flash |
| **Auth** | JWT Bearer Tokens |

---

## 📁 Project Structure

```
/
├── Nexhire-backend/          # ASP.NET Core 8 API
│   ├── Controllers/          # API endpoints
│   ├── Services/             # Business logic (Auth, Jobs, Applications, AI)
│   ├── Models/               # EF Core models
│   ├── DTOs/                 # Request/Response shapes
│   ├── Data/                 # AppDbContext
│   ├── Migrations/           # EF Core migrations
│   └── appsettings.json      # Config (no secrets!)
│
└── nexhire-client-vite/      # React + Vite frontend
    └── src/
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 14+](https://www.postgresql.org/download/)
- [EF Core CLI tools](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)

```bash
# Install EF Core tools (once, globally)
dotnet tool install --global dotnet-ef
```

---

## 🔧 Local Setup (First Time)

### 1. Clone the repository

```bash
git clone https://github.com/salitha07/Nexhire--AI-Powered-Recruitment-and-Talent-Management-Platform.git
cd Nexhire--AI-Powered-Recruitment-and-Talent-Management-Platform
```

---

### 2. Set up the Database

Create a PostgreSQL database named `Nexhiredb`:

```sql
CREATE DATABASE "Nexhiredb";
```

---

### 3. Configure Backend Secrets (Required)

> ⚠️ **Never put real secrets in `appsettings.json`** — it is committed to git.  
> Use **dotnet User Secrets** instead. These are stored only on your local machine.

Navigate to the backend folder and run these commands:

```bash
cd Nexhire-backend

# Your PostgreSQL connection (update password to match yours)
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=Nexhiredb;Username=postgres;Password=YOUR_POSTGRES_PASSWORD"

# Your JWT secret key (make up any long random string)
dotnet user-secrets set "JwtSettings:SecretKey" "your-super-secret-jwt-key-min-32-chars"

# Your OpenRouter API key (get a FREE key at https://openrouter.ai/keys)
dotnet user-secrets set "OpenRouter:ApiKey" "sk-or-v1-YOUR_KEY_HERE"
```

**Getting an OpenRouter key (free):**
1. Go to [openrouter.ai](https://openrouter.ai) → Sign up
2. Go to [openrouter.ai/keys](https://openrouter.ai/keys) → Create key
3. Paste it in the command above

---

### 4. Apply Database Migrations

```bash
# From the Nexhire-backend folder:
dotnet ef database update
```

This creates all tables including `AIResults`.

---

### 5. Run the Backend

```bash
# From the Nexhire-backend folder:
dotnet run
```

API runs at: **http://localhost:5062**  
Swagger UI: **http://localhost:5062/swagger**

---

### 6. Run the Frontend

```bash
# From the nexhire-client-vite folder:
cd ../nexhire-client-vite
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🤖 AI Candidate Ranking

Nexhire uses OpenRouter (Google Gemini 2.5 Flash) to automatically rank candidates against job descriptions.

### Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/ai/rank/{applicationId}` | JWT | Analyse candidate & save AI result |
| `GET` | `/api/ai/result/{applicationId}` | JWT | Fetch previously saved AI result |

### AI Response Format

```json
{
  "id": 1,
  "applicationId": 5,
  "matchScore": 82,
  "extractedSkills": "React, TypeScript, Node.js, REST APIs",
  "recommendation": "Strong Hire — candidate's skills closely match the job requirements",
  "createdAt": "2026-07-14T16:00:00Z"
}
```

---

## 🔑 API Endpoints Overview

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `POST` | `/api/auth/register` | None | Register a new user |
| `POST` | `/api/auth/login` | None | Login, receive JWT |
| `GET` | `/api/jobs` | None | List all active jobs |
| `POST` | `/api/jobs` | Recruiter | Create a job posting |
| `POST` | `/api/applications` | Candidate | Apply to a job |
| `GET` | `/api/applications/my` | Candidate | View my applications |
| `GET` | `/api/applications/job/{jobId}` | Recruiter | View applicants for a job |
| `PUT` | `/api/applications/{id}/status` | Recruiter | Shortlist / Reject |
| `POST` | `/api/ai/rank/{applicationId}` | Any role | AI rank a candidate |
| `GET` | `/api/ai/result/{applicationId}` | Any role | Get cached AI result |

---

## 👥 User Roles

| Role | Can do |
|------|--------|
| `candidate` | Register, apply to jobs, view own applications |
| `recruiter` | Post jobs, view applicants, shortlist/reject, trigger AI ranking |
| `hiring_manager` | View AI results |
| `admin` | Full access |

---

## 🛡️ Security Notes

- **No secrets in git** — all sensitive values use `dotnet user-secrets` locally
- JWT tokens expire after 60 minutes
- Passwords are hashed with BCrypt
- CORS is configured for `http://localhost:3000` (update for production)

---

## 🚀 Running in Production

For deployment, set secrets as **environment variables** instead of user-secrets:

```bash
export ConnectionStrings__DefaultConnection="Host=...;..."
export JwtSettings__SecretKey="your-production-secret"
export OpenRouter__ApiKey="sk-or-v1-..."
```

> Note: Use double underscores `__` to represent nested JSON keys in environment variables.
