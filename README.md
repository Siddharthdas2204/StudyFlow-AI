# StudyFlow AI - Next Gen Academic Platform

StudyFlow AI is a futuristic, all-in-one study platform powered by Groq LLaMA and Supabase. It features a stunning "Cyberpunk" UI designed for modern learners.

## 🚀 Stunning Features

- **Socrates AI Tutor**: Intelligent chat with voice assistant and automated note generation.
- **Image Doubt Solver**: Upload any problem (handwritten or printed) for instant step-by-step explanations.
- **Lecture to Notes**: Convert audio recordings of lectures into structured, searchable study notes.
- **Exam Predictor**: Predict likely exam questions based on your study material and difficulty level.
- **Coding Playground**: Write, run, and explain code in multiple languages using Piston and AI.
- **Study Roadmap**: Personalized, phase-by-phase learning plans for any subject.
- **PDF Study Mode**: Ask questions, summarize, or generate quizzes from your uploaded documents.
- **Focus Mode**: Integrated Pomodoro timer and session tracking.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS 4, Framer Motion (Modern "Cyberpunk" Design System).
- **Backend & Auth**: Supabase Auth, Groq AI SDK.
- **Packages**: Lucide-React, Sonner, React-Dropzone.
- **Deployment**: Vercel (Production Ready).

### 1. Prerequisites
- [npm](https://www.npmjs.com/) installed.
- [Supabase](https://supabase.com/) project.
- [Groq AI](https://console.groq.com/) API key.

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in the required values:
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Running Locally
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## 🌐 Deployment

This project is configured for seamless deployment on **Vercel**.
1. Push your code to GitHub.
2. Link the repository to a new project in the Vercel Dashboard.
3. Add your environment variables in the Vercel project settings.
4. Deploy!

## 🔐 Security & Industry Best Practices
- **Multi-user Support**: All data is securely isolated by `user_id`.
- **Supabase Auth**: Industry-standard authentication with Google and Demo Mode fallbacks.
- **API Rate Limiting**: Ready for production scaling.
- **Modular Architecture**: Clean separation between frontend, backend, and database logic.
