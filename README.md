# EduNexus — AI-Powered Personalized Learning & Early Intervention Platform

"Learning That Adapts To You."

EduNexus is an enterprise-grade AI personalized learning and early intervention platform designed for B.Tech Computer Science & Engineering students, educators, and institution administrators. It delivers real-time prerequisite gap analysis, adaptive problem sets, personalized learning paths, and automated teacher early interventions.

---

## 🌟 Key Platform Features

- **Split-Screen SaaS Authentication**: Modern 44%/56% split login screen featuring interactive floating AI cards, segmented Sign In / Create Account controls, role-based authentication (Student, Teacher, Admin), and automated Student ID (`ECB0245`) / Teacher ID (`ECB1234`) generation.
- **B.Tech CSE Semester 3 Curriculum**: Pre-loaded engineering courses including Data Structures, Database Management Systems (DBMS), Operating Systems, Object-Oriented Programming (OOP), and Computer Networks.
- **Adaptive Question & Evaluation Engine**: Engineering question bank complete with concept metadata, difficulty tracking, response timing, and explanation breakdowns.
- **AI Prerequisite Gap Analyzer**: Automatic detection of core concept gaps (e.g. 2NF partial dependency in DBMS Normalization) to update sequential learning paths before students attempt advanced topics.
- **Teacher Early Intervention Hub**: Academic risk roster highlighting students needing attention (`HIGH`, `MEDIUM`, `LOW` risk) with one-click recommendation dispatch.
- **System Administrator Control Center**: Branch and semester curriculum mapping, user management, and institution-wide analytics.
- **Offline-First Architecture**: 100% functional without external backend dependencies using LocalStorage persistence, ready for Android Studio WebView conversion.

---

## 🔑 Demo Credentials

| Role | User ID / Roll Number | Default Password | Initial Focus Area |
| :--- | :--- | :--- | :--- |
| **Student** | `ECB0245` | `student123` | DBMS Normalization Gap |
| **Teacher** | `ECB1234` | `teacher123` | Class Risk Roster & Early Intervention |
| **Administrator** | `ADMIN001` | `admin123` | Branch Curriculum & User Management |

---

## 🚀 Quick Start & Usage

1. Open `index.html` in any web browser or host using a local HTTP server:
   ```bash
   python -m http.server 8080
   ```
2. Navigate to `http://localhost:8080` in your web browser.
3. Sign in as **Student** (`ECB0245`) to explore the personalized dashboard, weak topic alerts, evaluation quiz, and interactive learning path.
4. Sign in as **Teacher** (`ECB1234`) to review class risk alerts and issue early intervention recommendations.
