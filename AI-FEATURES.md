# ✨ Nexhire AI Features

This document explains the AI superpowers built into Nexhire. We use **Gemini 2.5 Flash** (via OpenRouter) to make the recruitment process faster, smarter, and more personalized. 

The system focuses on two main areas: **Applicant Scoring** and **Interview Preparation**.

---

## 1. AI-Powered Applicant Scoring & Match Analysis

When a candidate applies for a job, recruiters don't have to read through every single resume manually to find the best fit. Nexhire does the heavy lifting instantly.

**How it works:**
*   **Resume Reading:** When a candidate uploads a PDF resume, the backend uses a library (`PdfPig`) to read all the text inside the file.
*   **Deep Context:** The AI doesn't just look at the resume. It looks at the **Job Description** (requirements, role type) and the **Full Candidate Profile** (years of experience, cover letter, why they think they are suitable, and their education).
*   **The Output:** The AI analyzes all of this and gives the recruiter a simple card containing:
    *   **Match Score (1-100):** A quick number showing how well the candidate fits the role.
    *   **Extracted Skills:** A clean list of real skills the AI found across their resume and profile.
    *   **Recommendation:** A 2-3 sentence summary explaining exactly *why* they are a good or bad fit, highlighting strengths or warning about missing requirements.

*Where to find this: In the recruiter dashboard, inside the **Applicant Details** view.*

---

## 2. AI-Assisted Interview Scheduling & Prep

Once a recruiter shortlists a candidate, they need to interview them. Instead of coming up with questions from scratch, Nexhire's AI acts as a personal interview coach.

**How it works:**
*   **Context Gathering:** When the recruiter clicks "✨ Get AI Suggestions", the backend grabs the job details, the candidate's profile, AND the previous AI match score.
*   **Smart Scheduling:** The AI recommends the best **Interview Mode** (e.g., suggesting "Online" if the candidate lives far away) and an appropriate **Duration** (e.g., 60 minutes for a complex senior role).
*   **Targeted Focus Areas:** The AI highlights 3 to 5 specific topics or skill gaps the recruiter should probe during the interview. 
*   **Tailored Questions:** It generates exactly **5 custom interview questions**. These aren't generic questions—they directly reference the candidate's specific background (e.g., *"You mentioned 3 years of React experience on your resume; can you describe a time you optimized a complex component?"*).

*Where to find this: When clicking **Schedule Interview** or **Reschedule** on a shortlisted candidate.*

---

## 🧠 Under the Hood (For Developers)

*   **Model:** `google/gemini-2.5-flash`
*   **Provider:** OpenRouter
*   **Prompting Strategy:** We use strict System Prompts instructing the model to return **JSON only**. This allows our backend C# services to safely deserialize the AI's thoughts directly into UI components without breaking the app.
*   **Data Privacy Flow:** File reading happens locally on the backend. Only the extracted text and profile data are sent to the LLM. 

---

## 🔑 Setup Guide for Developers

To test these AI features locally, you need your own OpenRouter API key. Without it, the backend will return a 500 or 502 error when you try to use AI features.

### 1. Get an API Key
1. Go to [OpenRouter.ai](https://openrouter.ai/).
2. Create an account or log in.
3. Go to **Settings > Keys** and click **Create Key**.
4. Copy the generated API key.

### 2. Configure Your Local Backend
1. Open the `Nexhire-backend` folder.
2. If you don't already have one, create a file named `appsettings.Development.json` (or just edit `appsettings.json`).
3. Add the `OpenRouter` configuration block like this:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=nexhire_db;Username=postgres;Password=your_password"
  },
  "OpenRouter": {
    "ApiKey": "sk-or-v1-YOUR_API_KEY_HERE"
  }
}
```

### 3. Restart the Backend
Run `dotnet run` (or `dotnet watch run`) inside the `Nexhire-backend` directory to apply the new configuration. You can now use the "Run AI Analysis" and "Get AI Suggestions" buttons in the frontend!
