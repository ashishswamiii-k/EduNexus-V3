# EduNexus — AI-Powered Personalized Learning & Early Intervention Platform

> **Learn at your pace. Grow with AI.**  
> *SIH 2026 Prototype — Fully Offline-First, LocalStorage Powered, Android WebView Compatible*

---

## 🌟 Overview

**EduNexus** is an AI-powered personalized learning and early intervention platform designed to help students overcome learning gaps before they compound into academic failure. Unlike conventional learning systems that only flag low scores, **EduNexus identifies root prerequisite weaknesses** (e.g. flagging a weakness in *Factorization* when a student struggles with *Quadratic Equations*) and dynamically constructs an adaptive, step-by-step learning path.

---

## 🚀 Key Features

### 🎓 1. Student Portal
- **Interactive Dashboard**: Track overall performance, 5-day streak, mastered topic counts, and monthly progress.
- **Assigned Subjects & Topics**: Explore class-assigned subjects (Mathematics, Science, English, Computer Science) and topic breakdowns.
- **Adaptive Quiz Engine**: Interactive question player with timer, progress indicators, immediate score calculation, and detailed explanations.
- **EduNexus AI Learning Engine**: Real-time local evaluation of student quiz attempts:
  - Weak Topic Detection (< 50% accuracy).
  - Prerequisite Learning Gap Identification (e.g. Factorization → Quadratic Equations).
  - Risk Level Scoring (LOW, MEDIUM, HIGH).
- **Personalized Learning Path**: Dynamic node graph visualization with an animated reading student character.
- **Achievements & Badges**: Automatic badge unlocking (First Quiz, 5-Day Streak, Topic Master, etc.).
- **Teacher Intervention Banner**: Immediate notification when a teacher assigns a targeted revision activity.

### 👩‍🏫 2. Teacher Portal
- **Class Performance Overview**: View total assigned students, class average scores, improving student counts, and high-risk alerts.
- **Student Roster & Filters**: Search students by name or ID, and filter by risk level (HIGH, MEDIUM, LOW).
- **Student Performance Profile Modal**: Detailed breakdown of student topic accuracy, quiz history, and AI insights.
- **Create Intervention Workflow**: Assign targeted revision notes, practice sets, or extra quizzes to high-risk students in real-time.

### ⚡ 3. Admin Portal
- **System Overview**: Manage total students, teachers, classes, subjects, and question bank statistics.
- **Full CRUD Management**:
  - Add/Edit/Disable Students & Teachers.
  - Create and manage Classes & Sections (10-A, 10-B, 11-A).
  - Assign Subjects & map Prerequisite Topics.
  - Question Bank Editor (create multiple choice questions with explanations, topic tags, and difficulty ratings).
- **Platform Analytics**: Visual summaries of student accuracy distribution and prerequisite gap hotspots.
- **Developer Demo Reset**: One-click reset to restore initial presentation data.

### 🎨 4. Design & Micro-Interactions
- **Official Branding**: Premium EduNexus logo asset.
- **Theme Toggle**: Seamless switching between **Dark Mode** (default) and **Light Mode**.
- **Visual Effects**:
  - Soft animated splash loading screen.
  - Magnetic logo hover effect.
  - Individual letter expansion on brand text.
  - Desktop cursor spotlight with radial glowing overlay.
  - Animated student reading character walking along the learning path.

---

## 🔑 Demo Credentials

| Role | User ID | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student** | `ECB0245` | `student123` | Demo Student (Class 10-A) with pre-seeded Factorization gap |
| **Teacher** | `ECB1234` | `teacher123` | Demo Teacher (Mathematics, Class 10-A) |
| **Admin** | `ADMIN001` | `admin123` | System Administrator |

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (CSS Custom Properties, Glassmorphism, Responsive Grid System), Vanilla JavaScript (ES6+ Modular).
- **Persistence Layer**: LocalStorage (`edunexus_db_v1` & `edunexus_current_user`).
- **Dependencies**: 0 external npm/server dependencies (100% offline-first).

---

## 💻 How to Run Locally

1. **Option A: Direct File Execution**
   - Simply double-click or open `index.html` in any web browser (Chrome, Edge, Firefox, Safari).

2. **Option B: Local Web Server**
   - Open terminal in the project directory:
     ```bash
     python -m http.server 8080
     ```
   - Open browser at `http://localhost:8080`.

---

## 📱 Android Studio WebView Packaging Guide

To convert EduNexus into a native Android APK/AAB:

1. Create a new Android Studio project (Empty Activity).
2. Copy the entire contents of this directory into your Android app assets folder:
   ```
   app/src/main/assets/
   ```
3. In `MainActivity.java` or `MainActivity.kt`, load `index.html`:
   ```java
   WebView webView = findViewById(R.id.webview);
   webView.getSettings().setJavaScriptEnabled(true);
   webView.getSettings().setDomStorageEnabled(true); // Enables LocalStorage!
   webView.loadUrl("file:///android_asset/index.html");
   ```
4. Build & Generate Signed APK / AAB.

---

## 🔄 Resetting Demo Data

To reset the application data back to the original presentation state at any time:
1. Navigate to **Settings** (`#/settings`).
2. Click **RESET DEMO DATA**.
3. Confirm reset in the modal prompt.
