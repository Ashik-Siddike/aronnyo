# 247School (Play-Learn-Grow-Kids) - Project Context

## 🌟 Project Overview
**247School** is a comprehensive, interactive, and gamified educational platform built for kids (Nursery to 5th Standard). It provides a fun learning environment with dynamic lessons, interactive games, quizzes, and a robust tracking system for students, parents, and administrators. 

The platform supports bilingual capabilities (Bangla and English) and a fully functional Dark/Light mode, aiming to provide a premium, visually appealing, and highly engaging user experience.

---

## 🛠️ Technology Stack
*   **Frontend:** React (Vite), TypeScript, Tailwind CSS, Shadcn UI, Recharts, Lucide React (Icons).
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (via official MongoDB Native Driver).
*   **State Management & Contexts:** React Context API (`AuthContext`, `StudentActivityContext`, `ThemeContext`, `LangContext`, `NotificationContext`).
*   **Deployment:** Vercel (Deployed as a monorepo using `vercel.json` rewrites to route `/api/*` to the server and other routes to the React app).

---

## 🚀 Key Features & Modules

### 1. 🎓 Student Experience & Gamification
*   **Interactive Learning:** Dynamic lessons across various subjects (Math, English, Bangla, Science).
*   **Mini-Games:** Built-in educational games including Counting Game, Addition/Subtraction Games, Multiplication Game, Spelling Wizard, Animal Quiz, Plant Explorer, and Memory Match.
*   **Gamified Dashboard:** Students earn **Stars (⭐)** and **Badges** upon completing lessons and quizzes. Tracks **Learning Streaks**, **Accuracy**, and **Total Hours Learned**.
*   **Legendary Levels:** A visually engaging profile page where students rank up from beginner levels to "Legends" based on their earned stars.
*   **Leaderboard:** Global ranking system (All-Time and Weekly) to encourage healthy competition among students.
*   **AI Chatbot:** An integrated AI assistant component to provide hints and help to students while learning.
*   **Daily Challenges:** A daily routine system giving students 3 specific questions every day for bonus stars.
*   **Text-to-Speech (TTS):** Integrated Google Translate TTS for reading lesson content in both Bengali and English.

### 2. 👨‍👩‍👧‍👦 Parent Panel
*   **Progress Monitoring:** Parents can view detailed insights into their child's performance.
*   **Time Tracking & Analytics:** Dynamic charts showing study hours, subject-wise progress, accuracy, and recent activities.
*   **AI Recommendations:** Automated suggestions based on the child's strengths and weaknesses.

### 3. 🛡️ Admin & Teacher Tools
*   **Admin Dashboard:** Centralized hub for platform management.
*   **Content Management:** Create, edit, and publish new lessons, chapters, and quizzes dynamically.
*   **User Management:** Manage student and teacher accounts.
*   **Attendance System:** Bulk attendance entry system for teachers, with stats visible on the student dashboard.
*   **Report Cards:** Automated grade calculation based on quiz/lesson scores. Includes a browser-based PDF printing feature for generating official report cards.

### 4. ⚙️ Core Infrastructure & Contexts
*   **ThemeContext:** Global Dark/Light mode toggle stored in `localStorage`.
*   **LangContext:** Real-time translation system between English (EN) and Bengali (BN).
*   **NotificationContext:** System to alert students of earned badges, completed activities, and admin announcements.
*   **StudentActivityContext:** Syncs learning progress directly with MongoDB in real-time.
*   **Self-Healing Profile Logic:** Automatically creates default profile documents in the `profiles` collection for registered users if they are missing on first login/access, ensuring database consistency.
*   **Database Optimizations:** 
    *   N+1 query issue on `/api/attendance/students` solved via bulk `$in` queries mapped in-memory.
    *   MongoDB indexes created on `attendance(student_id)`, `contents(grade_id)`, and `chapters(subject_id)` for high performance.

---

## 📂 Project Structure (High-Level)

```text
play-learn-grow-kids/
├── server/                 # Backend Directory
│   ├── server.js           # Main Express server & MongoDB API endpoints
│   ├── seed.js             # Database seeding script
│   └── package.json        # Backend dependencies
├── src/                    # Frontend Directory
│   ├── components/         # Reusable UI components (Header, Layout, GamesSection, etc.)
│   │   ├── admin/          # Admin-specific components (ReportCard, Attendance, etc.)
│   │   └── ui/             # Shadcn UI base components
│   ├── contexts/           # React Contexts (Auth, Theme, Lang, Notifications, Activity)
│   ├── pages/              # Route components (Dashboard, Lessons, Games, Profile, etc.)
│   ├── services/           # API wrappers (api.ts, activityService.ts) connecting to backend
│   ├── App.tsx             # Main application router and provider wrapper
│   └── main.tsx            # React DOM entry point
├── package.json            # Frontend dependencies
├── tailwind.config.js      # Tailwind CSS configuration
├── vercel.json             # Vercel deployment configuration
└── PROJECT_CONTEXT.md      # This documentation file
```

---

## 🔌 API Endpoints Reference (`server.js`)
*   `/api/auth/login`, `/api/auth/register` — Authentication.
*   `/api/activity`, `/api/activity/:userId` — Track and retrieve student learning activities.
*   `/api/student-dashboard`, `/api/parent-dashboard` — Aggregated stats for dashboards.
*   `/api/leaderboard` — Ranking system data.
*   `/api/attendance` — GET and POST for tracking daily presence.
*   `/api/report-cards` — GET and POST for managing exam results.
*   `/api/contents`, `/api/grades`, `/api/subjects` — CRUD operations for syllabus data.
*   `/api/daily-challenge`, `/api/daily-challenge/submit` — Daily challenge questions and submissions.
*   `/api/profiles/:userId` — Fetch or dynamically create user profiles.
*   `/api/health` — Database connection health status.

---

## 🎯 Next Immediate Goals / Roadmap
1.  **AI Hint Integration:** Deeply integrating the AI tutor inside specific lessons to provide context-aware hints.
2.  **PWA/Offline Mode:** Setting up service workers so kids can play simple games even without internet.
