/* ============================================================
   EDUNEXUS — SINGLE PAGE APPLICATION (SPA) ROUTER & GUARD
   ============================================================ */

class SPARouter {
  constructor() {
    this.routes = {
      '/login': { role: null, handler: () => this.renderAuthView('login') },
      '/register': { role: null, handler: () => this.renderAuthView('register') },

      // Student Routes
      '/student': { role: 'student', handler: (c) => StudentView.renderDashboard(c) },
      '/subjects': { role: 'student', handler: (c, query) => StudentView.renderSubjects(c) },
      '/topics': { role: 'student', handler: (c, query) => StudentView.renderTopics(c, query.subjectId) },
      '/quiz': { role: 'student', handler: (c, query) => this.renderQuizView(c, query.topicId) },
      '/learning-path': { role: 'student', handler: (c) => this.renderLearningPathView(c) },
      '/progress': { role: 'student', handler: (c) => StudentView.renderProgress(c) },
      '/achievements': { role: 'student', handler: (c) => StudentView.renderAchievements(c) },

      // Teacher Routes
      '/teacher': { role: 'teacher', handler: (c) => TeacherView.renderDashboard(c) },

      // Admin Routes
      '/admin': { role: 'admin', handler: (c) => AdminView.renderDashboard(c) },

      // Shared Settings
      '/settings': { role: 'all', handler: (c) => this.renderSettingsView(c) }
    };

    window.addEventListener('hashchange', () => this.handleRouting());
  }

  navigate(path) {
    window.location.hash = `#${path}`;
  }

  handleRouting() {
    const hash = window.location.hash.slice(1) || '/login';
    const [path, queryString] = hash.split('?');
    const query = {};

    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [k, v] = pair.split('=');
        query[k] = decodeURIComponent(v || '');
      });
    }

    const route = this.routes[path] || this.routes['/login'];
    const user = Auth.getCurrentUser();

    // 1. Auth Guard
    if (route.role && route.role !== 'all') {
      if (!user) {
        this.navigate('/login');
        return;
      }
      if (user.role.toLowerCase() !== route.role.toLowerCase()) {
        Notifications.toast('Access denied. Redirecting to your dashboard.', 'error');
        this.navigate(`/${user.role.toLowerCase()}`);
        return;
      }
    }

    // 2. Hide / Show Shell Containers
    const authWrapper = document.getElementById('auth-view-wrapper');
    const appShell = document.getElementById('app-shell');

    if (path === '/login' || path === '/register') {
      if (user) {
        this.navigate(`/${user.role.toLowerCase()}`);
        return;
      }
      if (authWrapper) authWrapper.style.display = 'flex';
      if (appShell) appShell.style.display = 'none';
      route.handler();
    } else {
      if (authWrapper) authWrapper.style.display = 'none';
      if (appShell) appShell.style.display = 'flex';

      this.updateSidebarUI(user, path);
      this.updateHeaderUI(user, path);

      const mainContainer = document.getElementById('page-body-container');
      if (mainContainer) {
        mainContainer.innerHTML = '';
        route.handler(mainContainer, query);
      }
    }
  }

  updateSidebarUI(user, activePath) {
    if (!user) return;

    // Sidebar navigation menu per role
    const navEl = document.getElementById('sidebar-nav-items');
    if (!navEl) return;

    let items = [];
    if (user.role === 'student') {
      items = [
        { path: '/student', label: 'Dashboard', icon: '🏠' },
        { path: '/subjects', label: 'My Subjects', icon: '📚' },
        { path: '/learning-path', label: 'Learning Path', icon: '🛣️' },
        { path: '/progress', label: 'My Progress', icon: '📊' },
        { path: '/achievements', label: 'Achievements', icon: '🏆' },
        { path: '/settings', label: 'Settings', icon: '⚙️' }
      ];
    } else if (user.role === 'teacher') {
      items = [
        { path: '/teacher', label: 'Teacher Dashboard', icon: '🏠' },
        { path: '/settings', label: 'Settings', icon: '⚙️' }
      ];
    } else if (user.role === 'admin') {
      items = [
        { path: '/admin', label: 'Admin Dashboard', icon: '⚡' },
        { path: '/settings', label: 'Settings', icon: '⚙️' }
      ];
    }

    let navHtml = '';
    items.forEach(item => {
      const isActive = activePath === item.path;
      navHtml += `
        <a class="nav-item ${isActive ? 'active' : ''}" onclick="Router.navigate('${item.path}')">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-text">${item.label}</span>
        </a>
      `;
    });

    navEl.innerHTML = navHtml;

    // User Footer
    const userNameEl = document.getElementById('sidebar-user-name');
    const userRoleEl = document.getElementById('sidebar-user-role');
    const userAvatarEl = document.getElementById('sidebar-user-avatar');

    if (userNameEl) userNameEl.textContent = user.name;
    if (userRoleEl) userRoleEl.textContent = user.role.toUpperCase();
    if (userAvatarEl) userAvatarEl.textContent = user.name.charAt(0).toUpperCase();
  }

  updateHeaderUI(user, path) {
    const welcomeEl = document.getElementById('header-welcome-text');
    if (welcomeEl && user) {
      welcomeEl.innerHTML = `Good morning, <strong>${user.name}</strong> 👋`;
    }
  }

  renderAuthView(mode = 'login') {
    const container = document.getElementById('auth-view-container');
    if (!container) return;

    if (mode === 'login') {
      container.innerHTML = `
        <div class="auth-card animate-fade-in">
          <div class="auth-brand">
            <img src="assets/logo.svg" alt="EduNexus Logo" class="magnetic-target">
            <p class="auth-subtitle">Learn at your pace. Grow with AI.</p>
          </div>

          <div class="role-tabs">
            <button class="role-tab active" data-role="student" onclick="Router.setRoleTab('student')">STUDENT</button>
            <button class="role-tab" data-role="teacher" onclick="Router.setRoleTab('teacher')">TEACHER</button>
            <button class="role-tab" data-role="admin" onclick="Router.setRoleTab('admin')">ADMIN</button>
          </div>

          <form id="login-form" onsubmit="event.preventDefault(); Router.handleLoginSubmit();">
            <div class="form-group">
              <label class="form-label">User ID / Roll Number</label>
              <input type="text" id="login-user-id" class="form-control" placeholder="e.g. ECB0245 or ADMIN001" required value="ECB0245">
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="login-password" class="form-control" placeholder="Enter password" required value="student123">
            </div>

            <div style="text-align: right; margin-bottom: 1.25rem;">
              <a class="auth-link text-xs" onclick="Notifications.toast('Please contact your institution administrator to reset your credentials.', 'warning', 4500)">Forgot Password?</a>
            </div>

            <button type="submit" class="btn btn-primary w-full btn-lg">LOGIN &rarr;</button>
          </form>

          <div class="auth-footer-text">
            <span id="reg-link-student">New Student? <a class="auth-link" onclick="Router.navigate('/register')">Create Account</a></span>
            <span id="reg-link-teacher" class="hidden">New Teacher? <a class="auth-link" onclick="Router.navigate('/register?role=teacher')">Create Account</a></span>
          </div>
        </div>
      `;
    } else {
      // Registration View
      const isTeacher = window.location.hash.includes('role=teacher');
      container.innerHTML = `
        <div class="auth-card animate-fade-in" style="max-width: 480px;">
          <div class="auth-brand">
            <img src="assets/logo.svg" alt="EduNexus Logo">
            <h3 style="font-size: 1.2rem; font-weight: 700; margin-top: 0.5rem;">${isTeacher ? 'Teacher Registration' : 'Student Registration'}</h3>
          </div>

          <form id="register-form" onsubmit="event.preventDefault(); Router.handleRegisterSubmit(${isTeacher});">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="reg-name" class="form-control" placeholder="e.g. Ashish Swami" required>
            </div>

            <div class="grid grid-2 gap-2">
              <div class="form-group">
                <label class="form-label">School Code</label>
                <input type="text" id="reg-school" class="form-control" value="ECB" required>
              </div>
              ${isTeacher ? `
                <div class="form-group">
                  <label class="form-label">Mobile Number</label>
                  <input type="text" id="reg-mobile" class="form-control" placeholder="10-digit number" required>
                </div>
              ` : `
                <div class="form-group">
                  <label class="form-label">Roll Number</label>
                  <input type="text" id="reg-roll" class="form-control" placeholder="e.g. 0248" required>
                </div>
              `}
            </div>

            ${isTeacher ? `
              <div class="form-group">
                <label class="form-label">Subject</label>
                <input type="text" id="reg-subject" class="form-control" value="Mathematics" required>
              </div>
            ` : `
              <div class="form-group">
                <label class="form-label">Class</label>
                <select id="reg-class" class="form-control form-select">
                  <option value="10-A">Class 10-A</option>
                  <option value="10-B">Class 10-B</option>
                  <option value="11-A">Class 11-A</option>
                </select>
              </div>
            `}

            <div class="grid grid-2 gap-2">
              <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" id="reg-pass" class="form-control" required>
              </div>
              <div class="form-group">
                <label class="form-label">Confirm Password</label>
                <input type="password" id="reg-confirm" class="form-control" required>
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-full btn-lg" style="margin-top: 1rem;">CREATE ACCOUNT</button>
          </form>

          <div class="auth-footer-text">
            Already registered? <a class="auth-link" onclick="Router.navigate('/login')">Log In</a>
          </div>
        </div>
      `;
    }
  }

  setRoleTab(role) {
    this.currentRoleTab = role;
    document.querySelectorAll('.role-tab').forEach(tab => {
      if (tab.getAttribute('data-role') === role) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    const userField = document.getElementById('login-user-id');
    const passField = document.getElementById('login-password');
    const regStudentLink = document.getElementById('reg-link-student');
    const regTeacherLink = document.getElementById('reg-link-teacher');

    if (role === 'student') {
      if (userField) userField.value = 'ECB0245';
      if (passField) passField.value = 'student123';
      if (regStudentLink) regStudentLink.classList.remove('hidden');
      if (regTeacherLink) regTeacherLink.classList.add('hidden');
    } else if (role === 'teacher') {
      if (userField) userField.value = 'ECB1234';
      if (passField) passField.value = 'teacher123';
      if (regStudentLink) regStudentLink.classList.add('hidden');
      if (regTeacherLink) regTeacherLink.classList.remove('hidden');
    } else if (role === 'admin') {
      if (userField) userField.value = 'ADMIN001';
      if (passField) passField.value = 'admin123';
      if (regStudentLink) regStudentLink.classList.add('hidden');
      if (regTeacherLink) regTeacherLink.classList.add('hidden');
    }
  }

  handleLoginSubmit() {
    const role = document.querySelector('.role-tab.active')?.getAttribute('data-role') || 'student';
    const userId = document.getElementById('login-user-id').value;
    const password = document.getElementById('login-password').value;

    const res = Auth.login(role, userId, password);
    if (res.success) {
      Notifications.toast(`Welcome back, ${res.user.name}!`, 'success');
      this.navigate(`/${res.user.role.toLowerCase()}`);
    } else {
      Notifications.toast(res.message, 'error');
    }
  }

  handleRegisterSubmit(isTeacher = false) {
    const name = document.getElementById('reg-name').value;
    const school = document.getElementById('reg-school').value;
    const pass = document.getElementById('reg-pass').value;
    const confirm = document.getElementById('reg-confirm').value;

    let res;
    if (isTeacher) {
      const mobile = document.getElementById('reg-mobile').value;
      const subject = document.getElementById('reg-subject').value;
      res = Auth.registerTeacher({ fullName: name, schoolCode: school, mobileNumber: mobile, subject, password: pass, confirmPassword: confirm });
    } else {
      const roll = document.getElementById('reg-roll').value;
      const classId = document.getElementById('reg-class').value;
      res = Auth.registerStudent({ fullName: name, schoolCode: school, rollNumber: roll, classId, password: pass, confirmPassword: confirm });
    }

    if (res.success) {
      Notifications.toast(`Account ${res.id} created! Please login.`, 'success');
      this.navigate('/login');
    } else {
      Notifications.toast(res.message, 'error');
    }
  }

  renderQuizView(container, topicId = 'TOP_FACT') {
    const started = Quiz.startQuiz(topicId);
    if (!started) return;

    this.renderQuizStep(container);
  }

  renderQuizStep(container) {
    const qData = Quiz.currentQuiz;
    const qObj = qData.questions[Quiz.currentIndex];
    const totalQ = qData.questions.length;
    const currentQNum = Quiz.currentIndex + 1;
    const selected = Quiz.userAnswers[Quiz.currentIndex];

    let optionsHtml = '';
    qObj.options.forEach((opt, idx) => {
      const isSelected = selected === idx;
      optionsHtml += `
        <button class="quiz-option-btn ${isSelected ? 'selected' : ''}" onclick="Quiz.selectAnswer(${idx}); Router.renderQuizStep(document.getElementById('page-body-container'));">
          <span class="quiz-option-letter">${String.fromCharCode(65 + idx)}</span>
          <span>${opt}</span>
        </button>
      `;
    });

    const html = `
      <div class="quiz-container animate-fade-in">
        <div class="quiz-header">
          <div>
            <h3 style="font-weight: 700; font-size: 1.2rem;">${qData.topicName} Quiz</h3>
            <span class="text-xs text-secondary">Question ${currentQNum} of ${totalQ}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--bg-tertiary); padding: 0.4rem 0.85rem; border-radius: var(--radius-full); font-weight: 700;">
            ⏱ <span id="quiz-timer-display">00:00</span>
          </div>
        </div>

        <div class="progress-bar-container" style="margin-bottom: 1.5rem;">
          <div class="progress-bar-fill" style="width: ${(currentQNum / totalQ) * 100}%;"></div>
        </div>

        <div class="card quiz-question-card">
          <h4 class="quiz-question-text">${qObj.question}</h4>
          <div class="quiz-options">
            ${optionsHtml}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button class="btn btn-secondary" ${Quiz.currentIndex === 0 ? 'disabled' : ''} onclick="Quiz.previousQuestion(); Router.renderQuizStep(document.getElementById('page-body-container'));">&larr; Previous</button>
          
          ${currentQNum === totalQ ? `
            <button class="btn btn-primary" onclick="Router.handleQuizSubmit()">SUBMIT QUIZ &rarr;</button>
          ` : `
            <button class="btn btn-primary" onclick="Quiz.nextQuestion(); Router.renderQuizStep(document.getElementById('page-body-container'));">Next &rarr;</button>
          `}
        </div>
      </div>
    `;

    container.innerHTML = html;
    Quiz.updateTimerDisplay();
  }

  handleQuizSubmit() {
    const res = Quiz.submitQuiz();
    if (!res) return;

    const body = `
      <div style="text-align: center; padding: 1rem 0;">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">${res.score >= 70 ? '🎉' : '⚠️'}</div>
        <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.35rem;">Quiz Score: ${res.score}%</h3>
        <p class="text-sm text-secondary" style="margin-bottom: 1.5rem;">
          ${res.correctCount} out of ${res.totalQuestions} questions answered correctly.
        </p>

        <div style="padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius-md); text-align: left;">
          <h4 style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.35rem;">✦ EduNexus AI Analysis</h4>
          <p style="font-size: 0.85rem; color: var(--text-primary);">
            ${res.score < 50 ? `Learning gap detected in ${res.topicName}. Prerequisite revision path updated.` : `Great job! Mastery in ${res.topicName} updated.`}
          </p>
        </div>
      </div>
    `;

    const footer = `
      <button class="btn btn-primary w-full" onclick="Notifications.closeModal(); Router.navigate('/learning-path');">View Updated Learning Path</button>
    `;

    Notifications.openModal('Quiz Result & AI Evaluation', body, footer);
  }

  renderLearningPathView(container) {
    const user = Auth.getCurrentUser();
    container.innerHTML = `
      <div class="animate-fade-in">
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800;">Personalized Learning Path</h2>
          <p class="text-sm text-secondary">AI-generated sequence designed for optimal prerequisite recovery and topic mastery.</p>
        </div>
        <div id="path-visualizer-target"></div>
      </div>
    `;
    LearningPath.renderPathContainer(document.getElementById('path-visualizer-target'), user ? user.id : 'ECB0245');
  }

  renderSettingsView(container) {
    const user = Auth.getCurrentUser();
    let html = `
      <div class="animate-fade-in">
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem;">Settings & Preferences</h2>
        <div class="card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Theme Configuration</h3>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <button class="btn btn-outline" onclick="Router.toggleTheme('dark')">🌙 Dark Mode</button>
            <button class="btn btn-secondary" onclick="Router.toggleTheme('light')">☀ Light Mode</button>
          </div>
        </div>

        <div class="card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">Account Details</h3>
          <p class="text-sm text-secondary">ID: ${user?.id} • Role: ${user?.role.toUpperCase()}</p>
        </div>

        <div class="card" style="border-color: rgba(239, 68, 68, 0.3);">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #F87171; margin-bottom: 0.5rem;">Developer / Demo Reset</h3>
          <p class="text-sm text-secondary" style="margin-bottom: 1rem;">Reset LocalStorage data back to original SIH presentation demo state.</p>
          <button class="btn btn-danger" onclick="Router.confirmResetDemoData()">RESET DEMO DATA</button>
        </div>
      </div>
    `;
    container.innerHTML = html;
  }

  toggleTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    Notifications.toast(`Theme updated to ${mode} mode.`, 'success');
  }

  confirmResetDemoData() {
    const body = `<p>Reset all local storage prototype data to initial demo state?</p>`;
    const footer = `
      <button class="btn btn-secondary" onclick="Notifications.closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="Storage.resetDemoData(); Notifications.closeModal(); Auth.logout(); Notifications.toast('Demo data reset successfully.', 'success');">Confirm Reset</button>
    `;
    Notifications.openModal('Reset Demo Data', body, footer);
  }
}

const Router = new SPARouter();
window.Router = Router;
