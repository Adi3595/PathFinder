<div align="center">
  <h1>🎯 Pathfinder AI</h1>
  <p><strong>Career Success Platform</strong> — AI-powered career growth for students & freshers</p>
  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
    <img src="https://img.shields.io/badge/Gemini_3_Flash-4285F4?logo=google&logoColor=white" alt="Gemini" />
  </p>
</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **AI Resume Analysis** | Upload your resume and get instant AI-powered feedback on strengths, weaknesses, ATS optimization tips, and an overall score out of 100. |
| 🎤 **Smart Mock Interviews** | Practice interviews for any role with an AI interviewer. Receive real-time feedback on communication, technical skills, and overall performance. |
| 🗺️ **Personalized Learning Paths** | Generate custom skill roadmaps with milestones, durations, and curated resources tailored to your target role and current skills. |
| 💼 **LinkedIn Optimization** | Optimize your professional profile to stand out to recruiters and hiring managers. |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS v4, Framer Motion, Lucide React |
| **State & Auth** | Firebase Authentication (Google Sign-In), React Context |
| **Database** | Cloud Firestore |
| **AI / ML** | Google GenAI SDK (Gemini 3 Flash Preview) |
| **Data Viz** | Recharts, D3 |
| **Routing** | React Router v7 |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│           React + TypeScript            │
│         (Vite Dev Server / Build)       │
├─────────────────────────────────────────┤
│  React Router  │  Framer Motion (UI)    │
│  Auth Context  │  Tailwind CSS (Styles) │
├─────────────────────────────────────────┤
│         Firebase SDK (Client)           │
│  • Authentication  • Firestore Database │
├─────────────────────────────────────────┤
│         Google GenAI (Gemini)           │
│  • Resume Analysis  • Interview Q&A     │
│  • Feedback Scoring • Roadmap Gen       │
└─────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [Firebase](https://firebase.google.com/) project with Firestore enabled
- A [Google AI Studio](https://aistudio.google.com/) API key for Gemini

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pathfinder-ai_-career-success-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

Ensure `firebase-applet-config.json` exists in the project root with your Firebase project credentials:

```json
{
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT_ID.appspot.com",
  "messagingSenderId": "...",
  "appId": "...",
  "firestoreDatabaseId": "(default)"
}
```

> 🔒 Firestore Security Rules are enforced. See [`firestore.rules`](./firestore.rules) and [`security_spec.md`](./security_spec.md) for details.

### 4. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ Never commit `.env.local` to version control. It is already ignored in `.gitignore`.

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📋 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google AI Studio API key for Gemini model access |

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Vite dev server on port 3000 |
| `build` | `npm run build` | Production build to `dist/` |
| `preview` | `npm run preview` | Preview production build locally |
| `lint` | `npm run lint` | Run TypeScript type-checking (`tsc --noEmit`) |
| `clean` | `npm run clean` | Remove `dist/` directory |

---

## 📁 Project Structure

```
pathfinder-ai_-career-success-platform/
├── public/                     # Static assets
├── src/
│   ├── App.tsx                 # Root component with routing & auth guards
│   ├── main.tsx                # Application entry point
│   ├── index.css               # Global styles & Tailwind directives
│   ├── components/
│   │   └── layout/
│   │       └── Sidebar.tsx     # Navigation sidebar
│   ├── hooks/
│   │   └── useAuth.tsx         # Firebase auth context & hook
│   ├── lib/
│   │   ├── firebase.ts         # Firebase initialization & helpers
│   │   ├── gemini.ts           # Gemini AI service functions
│   │   └── utils.ts            # Utility functions
│   └── pages/
│       ├── Home.tsx            # Landing / sign-in page
│       ├── Dashboard.tsx       # User dashboard overview
│       ├── ResumeAnalyzer.tsx  # AI resume analysis page
│       ├── MockInterview.tsx   # Mock interview practice page
│       ├── Roadmap.tsx         # Skill roadmap generator page
│       └── Profile.tsx         # User profile page
├── firebase-applet-config.json # Firebase client configuration
├── firebase-blueprint.json     # Firebase project blueprint
├── firestore.rules             # Firestore security rules
├── security_spec.md            # Security specification & invariants
├── metadata.json               # App metadata & capabilities
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies & scripts
└── README.md                   # You are here! 📍
```

---

## 🔐 Security

This project implements strict Firestore security rules to protect user data. Key invariants include:

- **User Isolation**: Users can only access their own profiles, interviews, roadmaps, and resume analyses.
- **Immutable Interviews**: Once an interview is marked `completed`, it cannot be modified.
- **Data Validation**: Confidence scores and level scores are bounded between 0 and 100.
- **Attack Prevention**: Rules guard against identity theft, profile hijacking, spoofed ownership, large payload attacks, shadow field injection, state skips, future dating, ID poisoning, role escalation, orphaned writes, email overwrites, and array blast attacks.

For full details, see [`security_spec.md`](./security_spec.md) and [`firestore.rules`](./firestore.rules).

---

## 🔌 APIs & Integrations

| Service | Usage |
|---------|-------|
| **Firebase Authentication** | Google Sign-In via popup |
| **Cloud Firestore** | User profiles, resume analyses, interview transcripts, roadmaps |
| **Google GenAI (Gemini 3 Flash Preview)** | Resume analysis scoring, interview question generation, interview feedback evaluation, skill roadmap generation |

---

## 🧠 AI Capabilities

The app leverages **Gemini 3 Flash Preview** with structured JSON output schemas for reliable, parseable responses:

- **Resume Analysis** → `{ score, strengths[], weaknesses[], recommendations[], atsOptimizationTips[] }`
- **Interview Feedback** → `{ overallScore, communicationScore, technicalScore, summary, improvementAreas[] }`
- **Skill Roadmap** → `{ milestones: [{ title, description, duration, resources[] }] }`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes TypeScript type-checking (`npm run lint`) before submitting.

---

## 📄 License

---

<div align="center">
  <p>Built with ❤️ for aspiring professionals everywhere.</p>
  <p><sub>View in AI Studio: <a href="https://ai.studio/apps/3b0d6ffe-2c99-461b-8927-e155bfc2b816">Pathfinder AI</a></sub></p>
</div>

