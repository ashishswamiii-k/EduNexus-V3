/* ============================================================
   EDUNEXUS — SINGLE PAGE APPLICATION (SPA) ROUTER & GUARD
   ============================================================ */

class SPARouter {
  constructor() {
    this.authMode = 'signin'; // 'signin' or 'signup'
    this.currentRoleTab = 'student'; // 'student', 'teacher', 'admin'
    this.showPassword = false;

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

    // 1. Auth Guard & Back-Button Protection
    if (route.role && route.role !== 'all') {
      if (!user) {
        Notifications.toast('Session expired or logged out. Please sign in.', 'warning');
        this.navigate('/login');
        return;
      }
      if (user.role.toLowerCase() !== route.role.toLowerCase()) {
        Notifications.toast('Access denied. Redirecting to your dashboard.', 'error');
        this.navigate(`/${user.role.toLowerCase()}`);
        return;
      }
    }

    // Dismiss any open header dropdown on route change
    if (window.App) App.closeProfileDropdown();

    // 2. Hide / Show Shell Containers
    const authWrapper = document.getElementById('auth-view-wrapper');
    const appShell = document.getElementById('app-shell');

    if (path === '/login' || path === '/register') {
      if (user) {
        this.navigate(`/${user.role.toLowerCase()}`);
        return;
      }
      if (authWrapper) authWrapper.style.display = 'block';
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

    const navEl = document.getElementById('sidebar-nav-items');
    if (!navEl) return;

    let items = [];
    if (user.role === 'student') {
      items = [
        { path: '/student', label: 'Dashboard', icon: '🏠' },
        { path: '/subjects', label: 'My Subjects', icon: '📚' },
        { path: '/learning-path', label: 'Learning Path', icon: '🛣️' },
        { path: '/progress', label: 'Academic Progress', icon: '📊' },
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
      const name = user.name.split(' ')[0];
      welcomeEl.innerHTML = `Good morning, <strong>${name}</strong> <span class="wave-hand">👋</span>`;
    }
  }

  renderAuthView(animateType = 'entrance') {
    const container = document.getElementById('auth-view-wrapper');
    if (!container) return;

    let animClass = 'form-animate-entrance';
    if (animateType === 'tab') animClass = 'form-animate-tab';
    if (animateType === 'role') animClass = 'form-animate-role';

    container.innerHTML = `
      <div class="auth-split-wrapper">
        <!-- LEFT PANEL: PROTECTED SAAS FORM (44%) -->
        <div class="auth-left-panel">
          <div class="auth-left-content ${animClass}">
            <!-- Brand Logo -->
            <div class="auth-header-logo">
              <img src="assets/logo.png" alt="EduNexus — Personalized Learning Platform" class="edunexus-logo-img auth-logo-img">
            </div>

            <!-- Welcome Message -->
            <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 0.25rem;">
              ${this.authMode === 'signin' ? 'Welcome Back 👋' : 'Create Account 🚀'}
            </h2>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
              ${this.authMode === 'signin' ? 'AI-Powered Personalized Learning Platform.' : 'Start your adaptive learning journey today.'}
            </p>

            <!-- Segmented Control: Sign In / Create Account -->
            <div class="segmented-control">
              <button class="segmented-tab ${this.authMode === 'signin' ? 'active' : ''}" onclick="Router.setAuthMode('signin')">Sign In</button>
              <button class="segmented-tab ${this.authMode === 'signup' ? 'active' : ''}" onclick="Router.setAuthMode('signup')">Create Account</button>
            </div>

            <!-- Role Selector -->
            <div style="margin-bottom: 1.25rem;">
              <span class="text-xs text-secondary font-bold" style="display: block; margin-bottom: 0.35rem;">CONTINUE AS</span>
              <div class="role-tabs">
                <button class="role-tab ${this.currentRoleTab === 'student' ? 'active' : ''}" onclick="Router.setRoleTab('student')">Student</button>
                <button class="role-tab ${this.currentRoleTab === 'teacher' ? 'active' : ''}" onclick="Router.setRoleTab('teacher')">Teacher</button>
                <button class="role-tab ${this.currentRoleTab === 'admin' ? 'active' : ''}" onclick="Router.setRoleTab('admin')">Admin</button>
              </div>
            </div>

            <!-- SIGN IN FORM -->
            ${this.authMode === 'signin' ? `
              <form id="login-form" onsubmit="event.preventDefault(); Router.handleLoginSubmit();">
                <div class="form-group">
                  <label class="form-label">${this.currentRoleTab.toUpperCase()} ID</label>
                  <input type="text" id="login-user-id" class="form-control" placeholder="e.g. ECB0245 or ADMIN001" required value="${this.getDefaultUserId()}">
                </div>

                <div class="form-group">
                  <label class="form-label">Password</label>
                  <div class="password-input-wrapper">
                    <input type="${this.showPassword ? 'text' : 'password'}" id="login-password" class="form-control" placeholder="Enter password" required value="${this.getDefaultPassword()}">
                    <button type="button" class="password-toggle-btn" onclick="Router.togglePasswordVisibility()">
                      ${this.showPassword ? '👁️‍🗨️' : '👁️'}
                    </button>
                  </div>
                </div>

                <div class="flex justify-between items-center text-xs" style="margin-bottom: 1.25rem;">
                  <label class="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked> Remember me
                  </label>
                  <a class="auth-link" onclick="Notifications.toast('Please contact your institution administrator to reset your password.', 'warning', 4500)">Forgot Password?</a>
                </div>

                <button type="submit" class="btn btn-primary w-full btn-lg">
                  Sign In <span style="transition: transform 0.2s;" class="btn-arrow">&rarr;</span>
                </button>
              </form>
            ` : `
              <!-- CREATE ACCOUNT FORM -->
              <form id="register-form" onsubmit="event.preventDefault(); Router.handleRegisterSubmit();">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <input type="text" id="reg-name" class="form-control" placeholder="e.g. Ashish Swami" required>
                </div>

                <div class="grid grid-2 gap-2">
                  <div class="form-group">
                    <label class="form-label">Institution Code</label>
                    <input type="text" id="reg-school" class="form-control" value="ECB" required onkeyup="Router.updateGeneratedId()">
                  </div>
                  ${this.currentRoleTab === 'teacher' ? `
                    <div class="form-group">
                      <label class="form-label">Mobile Number</label>
                      <input type="text" id="reg-mobile" class="form-control" placeholder="98761234" required onkeyup="Router.updateGeneratedId()">
                    </div>
                  ` : `
                    <div class="form-group">
                      <label class="form-label">Student ID / Roll</label>
                      <input type="text" id="reg-roll" class="form-control" placeholder="0245" value="0248" required onkeyup="Router.updateGeneratedId()">
                    </div>
                  `}
                </div>

                <div style="padding: 0.5rem 0.75rem; background: var(--bg-tertiary); border-radius: var(--radius-sm); margin-bottom: 1rem; font-size: 0.8rem; color: var(--accent-cyan);">
                  Generated ${this.currentRoleTab.toUpperCase()} ID: <strong id="generated-id-preview">ECB0248</strong>
                </div>

                <div class="grid grid-2 gap-2">
                  <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" id="reg-pass" class="form-control" required value="student123">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Confirm Password</label>
                    <input type="password" id="reg-confirm" class="form-control" required value="student123">
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-full btn-lg" style="margin-top: 0.5rem;">CREATE ACCOUNT</button>
              </form>
            `}
          </div>
        </div>

        <!-- RIGHT PANEL: CLEAN UN-OBSCURED CANVAS (56%) -->
        <div class="auth-right-panel">
          <!-- ZONE 1: BACKGROUND DECORATIONS (z-index: 0) -->
          <div class="background-decoration-zone">
            <div class="right-panel-blob right-panel-blob-1"></div>
            <div class="right-panel-blob right-panel-blob-2"></div>
          </div>

          <!-- ZONE 2: BACKGROUND TEXT ZONE (z-index: 1) — STATIC FAINT TYPOGRAPHY -->
          <div class="background-text-zone">
            <span class="bg-text-item bg-text-top-left">LEARN</span>
            <span class="bg-text-item bg-text-top-right">ADAPT</span>
            <span class="bg-text-item bg-text-bottom-right">GROW</span>
          </div>

          <!-- ZONE 3: HERO INTERACTION ZONE & CENTER HERO GRAPHIC (z-index: 2) -->
          <div class="hero-interaction-zone">
            <!-- UN-OBSCURED CENTERED HERO GRAPHIC (z-index: 2) -->
            <div class="center-hero-zone">
              <div style="font-size: 5rem; filter: drop-shadow(0 0 24px rgba(6,182,212,0.4)); margin-bottom: 0.5rem;">
                💻 🎓 🧠
              </div>
              <h3 style="font-size: 1.5rem; font-weight: 800; color: #F8FAFC; margin-bottom: 0.35rem;">
                Learning That Adapts To You.
              </h3>
              <p class="text-xs text-secondary" style="max-width: 280px; margin: 0 auto; line-height: 1.5;">
                Prerequisite gap detection & early intervention platform for personalized learning.
              </p>
            </div>
          </div>

          <!-- ZONE 4: BOTTOM-CENTER FIXED ACTIVE LEARNER STUDY CHARACTER CARD (z-index: 3) -->
          <div class="study-character-zone">
            <div class="study-ai-popup">✦ Concept Mastered</div>
            <div class="study-avatar-container">
              👨‍🎓
            </div>
            <div class="study-info-box">
              <span style="font-size: 0.875rem; font-weight: 700; color: #F8FAFC;">Active Student</span>
              <span style="font-size: 0.75rem; color: var(--text-secondary);">📖 Reading DBMS 2NF Rules</span>
              <span style="font-size: 0.725rem; color: var(--accent-cyan); font-weight: 600;">💻 Real-time AI Sync Active</span>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.Animations) {
      Animations.initMagneticElements();
    }
  }

  setAuthMode(mode) {
    this.authMode = mode;
    this.renderAuthView('tab');
  }

  setRoleTab(role) {
    this.currentRoleTab = role;
    this.renderAuthView('role');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    const input = document.getElementById('login-password');
    if (input) {
      input.type = this.showPassword ? 'text' : 'password';
    }
  }

  getDefaultUserId() {
    if (this.currentRoleTab === 'student') return 'ECB0245';
    if (this.currentRoleTab === 'teacher') return 'ECB1234';
    if (this.currentRoleTab === 'admin') return 'ADMIN001';
    return '';
  }

  getDefaultPassword() {
    if (this.currentRoleTab === 'student') return 'student123';
    if (this.currentRoleTab === 'teacher') return 'teacher123';
    if (this.currentRoleTab === 'admin') return 'admin123';
    return '';
  }

  updateGeneratedId() {
    const school = document.getElementById('reg-school')?.value || 'ECB';
    const preview = document.getElementById('generated-id-preview');
    if (!preview) return;

    if (this.currentRoleTab === 'teacher') {
      const mobile = document.getElementById('reg-mobile')?.value || '1234';
      const last4 = mobile.slice(-4);
      preview.textContent = `${school.toUpperCase()}${last4}`;
    } else {
      const roll = document.getElementById('reg-roll')?.value || '0245';
      preview.textContent = `${school.toUpperCase()}${roll.padStart(4, '0')}`;
    }
  }

  handleLoginSubmit() {
    const userId = document.getElementById('login-user-id').value;
    const password = document.getElementById('login-password').value;

    const res = Auth.login(this.currentRoleTab, userId, password);
    if (res.success) {
      Notifications.toast(`Welcome back, ${res.user.name}!`, 'success');
      this.navigate(`/${res.user.role.toLowerCase()}`);
    } else {
      Notifications.toast(res.message, 'error');
    }
  }

  handleRegisterSubmit() {
    const name = document.getElementById('reg-name').value;
    const school = document.getElementById('reg-school').value;
    const pass = document.getElementById('reg-pass').value;
    const confirm = document.getElementById('reg-confirm').value;

    let res;
    if (this.currentRoleTab === 'teacher') {
      const mobile = document.getElementById('reg-mobile').value;
      const subject = 'Database Management Systems';
      res = Auth.registerTeacher({ fullName: name, schoolCode: school, mobileNumber: mobile, subject, password: pass, confirmPassword: confirm });
    } else {
      const roll = document.getElementById('reg-roll').value;
      const classId = 'Sec-A';
      res = Auth.registerStudent({ fullName: name, schoolCode: school, rollNumber: roll, classId, password: pass, confirmPassword: confirm });
    }

    if (res.success) {
      Notifications.toast(`Account ${res.id} created! Please sign in.`, 'success');
      this.setAuthMode('signin');
    } else {
      Notifications.toast(res.message, 'error');
    }
  }

  renderQuizView(container, topicId = 'TOP_DBMS_NORM') {
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
      <div class="quiz-container quiz-slide-in">
        <div class="quiz-header">
          <div>
            <span class="badge badge-cyan">Diagnostic Evaluation</span>
            <h3 style="font-weight: 700; font-size: 1.2rem; margin-top: 0.2rem;">${qData.topicName}</h3>
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
            <button class="btn btn-primary" onclick="Router.handleQuizSubmit()">SUBMIT EVALUATION &rarr;</button>
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
        <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.35rem;">EVALUATION COMPLETE</h3>
        <p style="font-size: 2.2rem; font-weight: 800; color: var(--accent-cyan);" id="quiz-score-counter-el">0%</p>
        <p class="text-sm text-secondary" style="margin-bottom: 1.5rem;">
          ${res.correctCount} out of ${res.totalQuestions} questions answered correctly.
        </p>

        <div style="padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius-md); text-align: left;">
          <h4 style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.35rem;"><span class="ai-sparkle-icon">✦</span> EduNexus AI Analysis</h4>
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

    setTimeout(() => {
      Animations.animateCountUp(document.getElementById('quiz-score-counter-el'), res.score, 1000, '%');
    }, 150);
  }

  renderLearningPathView(container) {
    const user = Auth.getCurrentUser();
    container.innerHTML = `
      <div class="stagger-section stagger-1">
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.5rem; font-weight: 800;">Personalized Learning Path</h2>
          <p class="text-sm text-secondary">AI-generated sequence designed for prerequisite recovery and topic mastery.</p>
        </div>
        <div id="path-visualizer-target"></div>
      </div>
    `;
    LearningPath.renderPathContainer(document.getElementById('path-visualizer-target'), user ? user.id : 'ECB0245');
  }

  renderSettingsView(container) {
    const user = Auth.getCurrentUser();
    let html = `
      <div class="stagger-section stagger-1">
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem;">Settings & Preferences</h2>
        <div class="card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Theme Configuration</h3>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <button class="btn btn-outline" onclick="Router.toggleTheme('dark')">🌙 Night Mode</button>
            <button class="btn btn-secondary" onclick="Router.toggleTheme('light')">☀ Light Mode</button>
          </div>
        </div>

        <div class="card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">Account Profile</h3>
          <p class="text-sm text-secondary">ID: ${user?.id} • Role: ${user?.role.toUpperCase()} • Course: ${user?.branch || 'Computer Science'}</p>
        </div>

        <div class="card" style="border-color: rgba(239, 68, 68, 0.3);">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #F87171; margin-bottom: 0.5rem;">Platform Reset</h3>
          <p class="text-sm text-secondary" style="margin-bottom: 1rem;">Reset LocalStorage data back to default state.</p>
          <button class="btn btn-danger" onclick="Router.confirmResetDemoData()">RESET PLATFORM STATE</button>
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
    const body = `<p>Reset all local storage data to initial state?</p>`;
    const footer = `
      <button class="btn btn-secondary" onclick="Notifications.closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="Storage.resetDemoData(); Notifications.closeModal(); Auth.logout(); Notifications.toast('Platform state reset successfully.', 'success');">Confirm Reset</button>
    `;
    Notifications.openModal('Reset Platform State', body, footer);
  }
}

const Router = new SPARouter();
window.Router = Router;
