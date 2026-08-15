/* ============================================================
   EDUNEXUS — SINGLE-PAGE ROUTER & MULTI-ROLE NAVIGATION ENGINE
   UNIVERSAL '←' BACK ARROW FOR SECONDARY PAGES • FIXED SIDEBAR
   ROBUST ROLE-BASED ROUTE PROTECTION & SESSION CONTROL
   ============================================================ */

class RouterEngine {
  constructor() {
    this.selectedRole = 'student'; // Default active role selector on login card

    this.routes = {
      '/': this.renderAuth.bind(this),
      '/auth': this.renderAuth.bind(this),
      '/login': this.renderAuth.bind(this),
      '/student': this.renderStudentDashboard.bind(this),
      '/teacher': () => TeacherModule.navigate('dashboard'),
      '/subjects': this.renderSubjects.bind(this),
      '/subject-details': this.renderSubjectDetails.bind(this),
      '/topics': this.renderTopics.bind(this),
      '/quiz': this.renderQuiz.bind(this),
      '/learning-path': this.renderLearningPath.bind(this),
      '/progress': this.renderProgress.bind(this),
      '/achievements': this.renderAchievements.bind(this),
      '/settings': this.renderSettings.bind(this),
      '/terms': this.renderTerms.bind(this),
      '/disclaimer': this.renderDisclaimer.bind(this),
      '/about': this.renderAbout.bind(this),
      '/licenses': this.renderLicenses.bind(this),

      // Teacher Sub-routes
      '/teacher-students': () => TeacherModule.navigate('students'),
      '/teacher-classes': () => TeacherModule.navigate('classes'),
      '/teacher-performance': () => TeacherModule.navigate('performance'),
      '/teacher-topics': () => TeacherModule.navigate('weak-topics'),
      '/teacher-interventions': () => TeacherModule.navigate('interventions'),
      '/teacher-quizzes': () => TeacherModule.navigate('quizzes'),
      '/teacher-reports': () => TeacherModule.navigate('notifications'),
      '/teacher-notifications': () => TeacherModule.navigate('notifications'),

      // Admin Sub-routes (7 Working Sections)
      '/admin': () => AdminView.navigate('dashboard'),
      '/admin-users': () => AdminView.navigate('users'),
      '/admin-students': () => AdminView.navigate('students'),
      '/admin-teachers': () => AdminView.navigate('teachers'),
      '/admin-classes': () => AdminView.navigate('institutes'),
      '/admin-subjects': () => AdminView.navigate('institutes'),
      '/admin-analytics': () => AdminView.navigate('analytics'),
      '/admin-reports': () => AdminView.navigate('analytics')
    };

    this.currentRoute = '/';
  }

  init() {
    window.addEventListener('popstate', () => {
      this.handleRoute(window.location.hash.replace('#', '') || '/');
    });

    window.addEventListener('hashchange', () => {
      this.handleRoute(window.location.hash.replace('#', '') || '/');
    });

    window.addEventListener('edunexus:profile-updated', (e) => {
      const user = e.detail || (window.Auth ? Auth.getCurrentUser() : null);
      if (user) {
        this.updateProfileElements(user);
      }
    });

    window.addEventListener('edunexus:subjects-updated', () => {
      if (this.currentRoute === '/subjects') {
        this.renderSubjects();
      } else if (this.currentRoute === '/student' && window.StudentDashboard) {
        StudentDashboard.render();
      }
    });

    const user = Auth.getCurrentUser();
    const currentHash = window.location.hash.replace('#', '');
    let initialRoute = currentHash;
    if (!user) {
      initialRoute = '/login';
    } else if (!currentHash || currentHash === '/' || currentHash === '/login' || currentHash === '/auth') {
      const role = (user.role || 'student').toLowerCase();
      initialRoute = role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/student';
    }
    this.navigate(initialRoute);
  }

  handleRouting() {
    const user = Auth.getCurrentUser();
    const currentHash = window.location.hash.replace('#', '');
    let route = currentHash;
    if (!user) {
      route = '/login';
    } else if (!currentHash || currentHash === '/' || currentHash === '/login' || currentHash === '/auth') {
      const role = (user.role || 'student').toLowerCase();
      route = role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/student';
    }
    this.handleRoute(route);
  }

  navigate(path) {
    this.currentRoute = path;
    window.location.hash = path;
    this.handleRoute(path);
  }

  handleRoute(path) {
    let user = Auth.getCurrentUser();

    // 1. Unauthenticated or Login Route: Render Fresh Login Page
    if (!user || path === '/' || path === '/auth' || path === '/login') {
      const authWrapper = document.getElementById('auth-view-wrapper');
      const appShell = document.getElementById('app-shell');
      const fab = document.querySelector('.nexaai-round-fab');
      if (authWrapper) authWrapper.style.display = 'block';
      if (appShell) appShell.style.display = 'none';
      if (fab) fab.style.display = 'none';
      this.renderAuth();
      return;
    }

    // 2. Role-Based Route Protection & Permissions Enforcer
    const userRole = (user.role || 'student').toLowerCase();
    const legalRoutes = ['/terms', '/disclaimer', '/about', '/licenses'];
    
    if (userRole === 'student') {
      const studentAllowed = ['/student', '/subjects', '/subject-details', '/topics', '/quiz', '/learning-path', '/progress', '/achievements', '/settings', ...legalRoutes];
      if (!studentAllowed.includes(path)) {
        if (window.Notifications) Notifications.toast('Access denied. Redirected to Student Dashboard.', 'error');
        window.location.hash = '/student';
        path = '/student';
      }
    } else if (userRole === 'teacher') {
      const teacherAllowed = ['/teacher', '/teacher-students', '/teacher-classes', '/teacher-performance', '/teacher-topics', '/teacher-interventions', '/teacher-quizzes', '/teacher-reports', '/settings', ...legalRoutes];
      if (!teacherAllowed.includes(path)) {
        if (window.Notifications) Notifications.toast('Access denied. Redirected to Teacher Dashboard.', 'error');
        window.location.hash = '/teacher';
        path = '/teacher';
      }
    } else if (userRole === 'admin') {
      const adminAllowed = ['/admin', '/admin-users', '/admin-students', '/admin-teachers', '/admin-classes', '/admin-subjects', '/admin-analytics', '/admin-reports', '/settings', ...legalRoutes];
      if (!adminAllowed.includes(path)) {
        if (window.Notifications) Notifications.toast('Access denied. Redirected to Admin Dashboard.', 'error');
        window.location.hash = '/admin';
        path = '/admin';
      }
    }

    this.currentRoute = path;

    const authWrapper = document.getElementById('auth-view-wrapper');
    const appShell = document.getElementById('app-shell');
    const fab = document.querySelector('.nexaai-round-fab');

    if (authWrapper) authWrapper.style.display = 'none';
    if (appShell) appShell.style.display = 'flex';
    if (fab) fab.style.display = 'flex';

    this.renderAppShell(user);

    const handler = this.routes[path] || (
      userRole === 'admin' ? this.routes['/admin'] :
      userRole === 'teacher' ? this.routes['/teacher'] :
      this.routes['/student']
    );
    handler();

    window.scrollTo(0, 0);

    const mainContent = document.querySelector('main.app-main') || document.getElementById('view-container');
    if (mainContent) {
      mainContent.classList.remove('page-route-enter');
      void mainContent.offsetWidth;
      mainContent.classList.add('page-route-enter');
    }

    if (window.App && typeof App.initScrollObserver === 'function') {
      setTimeout(() => {
        App.initScrollObserver();
      }, 60);
    }
  }

  navigateDashboard() {
    const user = Auth.getCurrentUser();
    if (!user) {
      this.navigate('/login');
      return;
    }
    const role = (user.role || 'student').toLowerCase();
    const targetRoute = role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/student';
    this.navigate(targetRoute);
  }

  updateActiveSidebarItem() {
    const navItems = document.querySelectorAll('#sidebar-nav-items .nav-item');
    navItems.forEach(item => {
      const dataRoute = item.getAttribute('data-route');
      if (dataRoute) {
        if (dataRoute === this.currentRoute) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      } else {
        const onclickAttr = item.getAttribute('onclick') || '';
        if (onclickAttr.includes(`'${this.currentRoute}'`)) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      }
    });
  }

  getInitials(name) {
    if (!name || typeof name !== 'string') return 'U';
    const cleanStr = name.trim();
    if (!cleanStr) return 'U';
    const parts = cleanStr.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (cleanStr.length >= 2) {
      return cleanStr.slice(0, 2).toUpperCase();
    }
    return cleanStr.toUpperCase();
  }

  updateProfileElements(user) {
    if (!user) return;

    const avatar = document.getElementById('sidebar-user-avatar');
    const userName = document.getElementById('sidebar-user-name');
    const userRole = document.getElementById('sidebar-user-role');
    const headerUserName = document.getElementById('header-user-name');

    const roleName = user.role ? (user.role.toLowerCase() === 'admin' ? 'ADMINISTRATOR' : user.role.toUpperCase()) : 'STUDENT';

    if (avatar) {
      if (user.avatarUrl) {
        avatar.innerHTML = `<img src="${user.avatarUrl}" alt="${user.name}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;" />`;
      } else {
        avatar.textContent = this.getInitials(user.name);
      }
    }
    if (userName) userName.textContent = user.name || user.id || 'User';
    if (userRole) userRole.textContent = roleName;
    if (headerUserName) headerUserName.textContent = user.name || 'Profile';

    // Re-render active dashboard top headers if needed
    if (this.currentRoute === '/student' && window.StudentDashboard) {
      StudentDashboard.render();
    } else if (this.currentRoute.startsWith('/teacher') && window.TeacherModule) {
      TeacherModule.navigate(TeacherModule.currentSection);
    } else if (this.currentRoute.startsWith('/admin') && window.AdminView) {
      AdminView.navigate(AdminView.currentSection);
    }
  }

  renderAppShell(user) {
    const navItems = document.getElementById('sidebar-nav-items');
    const role = (user.role || 'student').toLowerCase();
    const currentSidebarRole = navItems ? navItems.getAttribute('data-active-role') : null;

    if (navItems && (navItems.children.length === 0 || currentSidebarRole !== role)) {
      navItems.setAttribute('data-active-role', role);

      if (role === 'teacher') {
        navItems.innerHTML = `
          <a class="nav-item ${this.currentRoute === '/teacher' ? 'active' : ''}" onclick="Router.navigate('/teacher')" data-route="/teacher" data-section="dashboard" title="Dashboard">
            <span class="nav-icon"><i class="ri-dashboard-line"></i></span>
            <span class="nav-text">Dashboard</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/teacher-students' ? 'active' : ''}" onclick="Router.navigate('/teacher-students')" data-route="/teacher-students" data-section="students" title="Students">
            <span class="nav-icon"><i class="ri-user-line"></i></span>
            <span class="nav-text">Students</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/teacher-classes' ? 'active' : ''}" onclick="Router.navigate('/teacher-classes')" data-route="/teacher-classes" data-section="classes" title="Classes / Subjects">
            <span class="nav-icon"><i class="ri-book-3-line"></i></span>
            <span class="nav-text">Classes / Subjects</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/teacher-performance' ? 'active' : ''}" onclick="Router.navigate('/teacher-performance')" data-route="/teacher-performance" data-section="performance" title="Student Performance">
            <span class="nav-icon"><i class="ri-bar-chart-line"></i></span>
            <span class="nav-text">Student Performance</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/teacher-topics' ? 'active' : ''}" onclick="Router.navigate('/teacher-topics')" data-route="/teacher-topics" data-section="weak-topics" title="Weak Topics">
            <span class="nav-icon"><i class="ri-alert-line"></i></span>
            <span class="nav-text">Weak Topics</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/teacher-interventions' ? 'active' : ''}" onclick="Router.navigate('/teacher-interventions')" data-route="/teacher-interventions" data-section="interventions" title="Interventions">
            <span class="nav-icon"><i class="ri-lightbulb-line"></i></span>
            <span class="nav-text">Interventions</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/teacher-quizzes' ? 'active' : ''}" onclick="Router.navigate('/teacher-quizzes')" data-route="/teacher-quizzes" data-section="quizzes" title="Quiz Management">
            <span class="nav-icon"><i class="ri-questionnaire-line"></i></span>
            <span class="nav-text">Quiz Management</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/teacher-notifications' ? 'active' : ''}" onclick="Router.navigate('/teacher-notifications')" data-route="/teacher-notifications" data-section="notifications" title="Notifications" style="display:flex; align-items:center; justify-content:space-between;">
            <div style="display:flex; align-items:center; gap:0.85rem;">
              <span class="nav-icon"><i class="ri-notification-3-line"></i></span>
              <span class="nav-text">Notifications</span>
            </div>
            <span style="background:linear-gradient(135deg, #EC4899, #8B5CF6); color:#fff; font-size:0.7rem; font-weight:800; padding:0.1rem 0.45rem; border-radius:9999px;">8</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/settings' ? 'active' : ''}" onclick="Router.navigate('/settings')" data-route="/settings" data-section="settings" title="Settings">
            <span class="nav-icon"><i class="ri-settings-4-line"></i></span>
            <span class="nav-text">Settings</span>
          </a>
        `;
      } else if (role === 'admin') {
        navItems.innerHTML = `
          <a class="nav-item ${this.currentRoute === '/admin' ? 'active' : ''}" onclick="Router.navigate('/admin')" data-route="/admin" data-section="dashboard" title="Dashboard">
            <span class="nav-icon"><i class="ri-dashboard-line"></i></span>
            <span class="nav-text">Dashboard</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/admin-users' ? 'active' : ''}" onclick="Router.navigate('/admin-users')" data-route="/admin-users" data-section="users" title="Users">
            <span class="nav-icon"><i class="ri-group-line"></i></span>
            <span class="nav-text">Users</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/admin-students' ? 'active' : ''}" onclick="Router.navigate('/admin-students')" data-route="/admin-students" data-section="students" title="Students">
            <span class="nav-icon"><i class="ri-user-follow-line"></i></span>
            <span class="nav-text">Students</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/admin-teachers' ? 'active' : ''}" onclick="Router.navigate('/admin-teachers')" data-route="/admin-teachers" data-section="teachers" title="Teachers">
            <span class="nav-icon"><i class="ri-user-star-line"></i></span>
            <span class="nav-text">Teachers</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/admin-classes' ? 'active' : ''}" onclick="Router.navigate('/admin-classes')" data-route="/admin-classes" data-section="institutes" title="Institutes & Classes">
            <span class="nav-icon"><i class="ri-building-4-line"></i></span>
            <span class="nav-text">Institutes & Classes</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/admin-analytics' ? 'active' : ''}" onclick="Router.navigate('/admin-analytics')" data-route="/admin-analytics" data-section="analytics" title="System Analytics">
            <span class="nav-icon"><i class="ri-pulse-line"></i></span>
            <span class="nav-text">System Analytics</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/settings' ? 'active' : ''}" onclick="Router.navigate('/settings')" data-route="/settings" data-section="settings" title="Settings">
            <span class="nav-icon"><i class="ri-settings-4-line"></i></span>
            <span class="nav-text">Settings</span>
          </a>
        `;
      } else {
        // Student Sidebar
        navItems.innerHTML = `
          <a class="nav-item ${this.currentRoute === '/student' ? 'active' : ''}" onclick="Router.navigate('/student')" data-route="/student" title="Dashboard">
            <span class="nav-icon"><i class="ri-dashboard-line"></i></span>
            <span class="nav-text">Dashboard</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/subjects' ? 'active' : ''}" onclick="Router.navigate('/subjects')" data-route="/subjects" title="My Subjects">
            <span class="nav-icon"><i class="ri-book-3-line"></i></span>
            <span class="nav-text">My Subjects</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/learning-path' ? 'active' : ''}" onclick="Router.navigate('/learning-path')" data-route="/learning-path" title="Learning Path">
            <span class="nav-icon"><i class="ri-node-tree"></i></span>
            <span class="nav-text">Learning Path</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/quiz' ? 'active' : ''}" onclick="Router.navigate('/quiz')" data-route="/quiz" title="Quizzes">
            <span class="nav-icon"><i class="ri-questionnaire-line"></i></span>
            <span class="nav-text">Quizzes</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/progress' ? 'active' : ''}" onclick="Router.navigate('/progress')" data-route="/progress" title="Academic Progress">
            <span class="nav-icon"><i class="ri-bar-chart-line"></i></span>
            <span class="nav-text">Academic Progress</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/achievements' ? 'active' : ''}" onclick="Router.navigate('/achievements')" data-route="/achievements" title="Achievements">
            <span class="nav-icon"><i class="ri-medal-line"></i></span>
            <span class="nav-text">Achievements</span>
          </a>
          <a class="nav-item ${this.currentRoute === '/settings' ? 'active' : ''}" onclick="Router.navigate('/settings')" data-route="/settings" title="Settings">
            <span class="nav-icon"><i class="ri-settings-4-line"></i></span>
            <span class="nav-text">Settings</span>
          </a>
        `;
      }
    }
    this.updateActiveSidebarItem();

    // Update Sidebar User Footer
    this.updateProfileElements(user);

    // Inject Universal '←' Back Button ONLY for Secondary Pages (Not Main Dashboards)
    const isMainDashboard = (this.currentRoute === '/student' || this.currentRoute === '/teacher' || this.currentRoute === '/admin');
    const pageBody = document.getElementById('page-body-container');
    if (pageBody && !isMainDashboard) {
      const existingBtn = document.getElementById('universal-back-btn');
      if (!existingBtn) {
        pageBody.insertAdjacentHTML('afterbegin', `
          <button id="universal-back-btn" class="back-nav-btn" onclick="window.history.back()" title="Back" data-tooltip="Back">
            ←
          </button>
        `);
      }
    } else {
      const existingBtn = document.getElementById('universal-back-btn');
      if (existingBtn) existingBtn.remove();
    }
  }

  setRole(role) {
    this.selectedRole = (role || 'student').toLowerCase();

    // Update tab active state
    const tabs = document.querySelectorAll('.role-tab-btn');
    tabs.forEach(t => {
      if (t.dataset.role === this.selectedRole) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Animate switch
    const formCard = document.getElementById('auth-form-content');
    if (formCard) {
      formCard.classList.remove('form-animate-role');
      void formCard.offsetWidth; // trigger reflow
      formCard.classList.add('form-animate-role');
    }

    const idLabel = document.getElementById('auth-id-label');
    const idInput = document.getElementById('auth-userid');
    const pwdInput = document.getElementById('auth-password');
    const submitBtn = document.getElementById('auth-submit-btn');
    const roleFooter = document.getElementById('auth-role-footer');

    if (this.selectedRole === 'teacher') {
      if (idLabel) idLabel.textContent = 'Teacher ID';
      if (idInput) { idInput.value = 'ECB1234'; idInput.placeholder = 'Enter Teacher ID'; }
      if (pwdInput) { pwdInput.value = 'teacher123'; }
      if (submitBtn) submitBtn.innerHTML = 'Continue as Teacher &rarr;';
      if (roleFooter) roleFooter.innerHTML = '<span style="color:var(--text-muted); font-size:0.825rem;">New Teacher? Contact your institution administrator.</span>';
    } else if (this.selectedRole === 'admin') {
      if (idLabel) idLabel.textContent = 'Admin ID';
      if (idInput) { idInput.value = 'ADMIN001'; idInput.placeholder = 'Enter Admin ID'; }
      if (pwdInput) { pwdInput.value = 'admin123'; }
      if (submitBtn) submitBtn.innerHTML = 'Continue as Admin &rarr;';
      if (roleFooter) roleFooter.innerHTML = '<span style="color:var(--text-muted); font-size:0.825rem;">Admin accounts are managed by institution system setup.</span>';
    } else {
      // Student
      if (idLabel) idLabel.textContent = 'Student ID / Roll No';
      if (idInput) { idInput.value = 'ECB0245'; idInput.placeholder = 'Enter Student ID / Roll No'; }
      if (pwdInput) { pwdInput.value = 'student123'; }
      if (submitBtn) submitBtn.innerHTML = 'Continue as Student &rarr;';
      if (roleFooter) roleFooter.innerHTML = '<a onclick="Router.openStudentRegisterModal()" style="color:var(--accent-cyan); font-weight:600; cursor:pointer; text-decoration:underline; font-size:0.85rem;">New Student? Register</a>';
    }
  }

  useDemoAccount(role) {
    this.setRole(role);
    const idInput = document.getElementById('auth-userid');
    const pwdInput = document.getElementById('auth-password');
    if (role === 'teacher') {
      if (idInput) idInput.value = 'ECB1234';
      if (pwdInput) pwdInput.value = 'teacher123';
    } else if (role === 'admin') {
      if (idInput) idInput.value = 'ADMIN001';
      if (pwdInput) pwdInput.value = 'admin123';
    } else {
      if (idInput) idInput.value = 'ECB0245';
      if (pwdInput) pwdInput.value = 'student123';
    }
  }

  quickDemoLogin(role, username, password) {
    this.useDemoAccount(role);
    this.handleFreshLogin();
  }

  handleFreshLogin() {
    const userIdInput = (document.getElementById('auth-userid')?.value || '').trim();
    const pwdInput = (document.getElementById('auth-password')?.value || '').trim();
    const role = (this.selectedRole || 'student').toLowerCase();

    // 1. Empty field checks
    if (!userIdInput) {
      if (window.Notifications) Notifications.toast('Please enter your User ID.', 'error');
      return;
    }
    if (!pwdInput) {
      if (window.Notifications) Notifications.toast('Please enter your password.', 'error');
      return;
    }

    const idUpper = userIdInput.toUpperCase();
    const idLower = userIdInput.toLowerCase();
    const passLower = pwdInput.toLowerCase();

    // 2. Strict Role & Demo Account Validation
    let userSession = null;

    if (role === 'student') {
      if (idLower === 'teacher' || idLower === 'admin' || idUpper === 'ECB1234' || idUpper === 'ADMIN001') {
        if (window.Notifications) Notifications.toast('Invalid User ID or password.', 'error');
        return;
      }
      if (passLower !== 'student123' && passLower !== 'demo123' && passLower !== '12345') {
        if (window.Notifications) Notifications.toast('Invalid User ID or password.', 'error');
        return;
      }
      userSession = Storage.getUserById('ECB0245') || {
        id: 'ECB0245',
        name: 'Demo Student',
        role: 'student',
        email: 'student@edunexus.edu',
        mobileNumber: '+91 9876543210',
        schoolCode: 'ECB',
        institution: 'Engineering College Bikaner',
        rollNumber: '0245',
        branch: 'Computer Science',
        year: 'Undergraduate',
        semester: 'Semester 3',
        classId: 'Sec-A',
        streakDays: 7,
        achievements: ['first_quiz', 'streak_5', 'topic_master'],
        mindfulHistory: [],
        mindfulXP: 40,
        loggedIn: true
      };
      userSession.role = 'student';
      userSession.loggedIn = true;
    } else if (role === 'teacher') {
      if (idLower === 'student' || idLower === 'admin' || idUpper === 'ECB0245' || idUpper === 'ADMIN001') {
        if (window.Notifications) Notifications.toast('Invalid User ID or password.', 'error');
        return;
      }
      if (passLower !== 'teacher123' && passLower !== 'demo123') {
        if (window.Notifications) Notifications.toast('Invalid User ID or password.', 'error');
        return;
      }
      userSession = Storage.getUserById('ECB1234') || {
        id: 'ECB1234',
        name: 'Demo Teacher',
        role: 'teacher',
        email: 'teacher@edunexus.edu',
        schoolCode: 'ECB',
        branch: 'Database Management Systems',
        assignedClasses: ['Sec-A', 'Sec-B'],
        loggedIn: true
      };
      userSession.role = 'teacher';
      userSession.loggedIn = true;
    } else if (role === 'admin') {
      if (idLower === 'student' || idLower === 'teacher' || idUpper === 'ECB0245' || idUpper === 'ECB1234') {
        if (window.Notifications) Notifications.toast('Invalid User ID or password.', 'error');
        return;
      }
      if (passLower !== 'admin123' && passLower !== 'demo123') {
        if (window.Notifications) Notifications.toast('Invalid User ID or password.', 'error');
        return;
      }
      userSession = Storage.getUserById('ADMIN001') || {
        id: 'ADMIN001',
        name: 'Demo Administrator',
        role: 'admin',
        email: 'admin@edunexus.edu',
        schoolCode: 'ECB',
        loggedIn: true
      };
      userSession.role = 'admin';
      userSession.loggedIn = true;
    }

    if (!userSession) {
      if (window.Notifications) Notifications.toast('Invalid User ID or password.', 'error');
      return;
    }

    // 3. Save to single session key edunexus_current_user
    Auth.setCurrentUser(userSession);

    // 4. Target dashboard routing
    const targetRoute = role === 'admin' ? '/admin' : role === 'teacher' ? '/teacher' : '/student';
    this.navigate(targetRoute);

    // 5. Post-navigation toast
    if (window.Notifications && typeof Notifications.toast === 'function') {
      try { Notifications.toast(`Welcome back, ${userSession.name}!`, 'success'); } catch (e) {}
    }
  }

  handleLoginSubmit() {
    this.handleFreshLogin();
  }

  renderAuth() {
    const authWrapper = document.getElementById('auth-view-wrapper');
    if (!authWrapper) return;

    const role = this.selectedRole || 'student';

    authWrapper.innerHTML = `
      <div class="auth-split-wrapper fade-in">
        <!-- LEFT PANEL: SAAS FORM & ROLE SELECTOR -->
        <div class="auth-left-panel">
          <div class="auth-left-content form-animate-entrance">
            <!-- BRAND LOGO -->
            <div class="auth-header-logo">
              <img src="assets/logo.png" alt="EduNexus — AI Learning Platform" />
            </div>

            <!-- CARD HEADER -->
            <div style="margin-bottom: 1.25rem;">
              <h2 style="font-size:1.45rem; font-weight:800; color:var(--text-primary); margin-bottom:0.25rem; letter-spacing:-0.02em;">
                WELCOME BACK
              </h2>
              <p style="font-size:0.85rem; color:var(--text-muted);">
                Sign in to continue to EduNexus AI Learning Platform
              </p>
            </div>

            <!-- 1. ROLE SELECTOR SEGMENTED TABS -->
            <div style="margin-bottom: 1.25rem;">
              <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.4rem; letter-spacing:0.5px;">
                Select Account Role
              </div>
              <div class="role-tabs">
                <button type="button" class="role-tab role-tab-btn ${role === 'student' ? 'active' : ''}" data-role="student" onclick="Router.setRole('student')">
                  🎓 Student
                </button>
                <button type="button" class="role-tab role-tab-btn ${role === 'teacher' ? 'active' : ''}" data-role="teacher" onclick="Router.setRole('teacher')">
                  👨‍🏫 Teacher
                </button>
                <button type="button" class="role-tab role-tab-btn ${role === 'admin' ? 'active' : ''}" data-role="admin" onclick="Router.setRole('admin')">
                  🛡️ Admin
                </button>
              </div>
            </div>

            <!-- DYNAMIC ROLE FORM CARD -->
            <div id="auth-form-content" class="form-animate-role">
              <form onsubmit="event.preventDefault(); Router.handleFreshLogin();" novalidate>
                <div class="form-group" style="text-align:left; margin-bottom:1rem;">
                  <label id="auth-id-label" class="form-label">
                    ${role === 'teacher' ? 'Teacher ID' : role === 'admin' ? 'Admin ID' : 'User ID'}
                  </label>
                  <input type="text" id="auth-userid" class="form-control" 
                    value="${role === 'teacher' ? 'ECB1234' : role === 'admin' ? 'ADMIN001' : 'ECB0245'}" 
                    placeholder="${role === 'teacher' ? 'Enter Teacher ID' : role === 'admin' ? 'Enter Admin ID' : 'Enter User ID'}" />
                </div>

                <div class="form-group" style="text-align:left; margin-bottom:1.25rem;">
                  <label class="form-label">Password</label>
                  <div class="password-input-wrapper">
                    <input type="password" id="auth-password" class="form-control" 
                      value="${role === 'teacher' ? 'teacher123' : role === 'admin' ? 'admin123' : 'student123'}" 
                      placeholder="Enter Password"
                      onkeypress="if (event.key === 'Enter') Router.handleFreshLogin();" />
                    <button type="button" class="password-toggle-btn" onclick="const input=document.getElementById('auth-password'); input.type = input.type === 'password' ? 'text' : 'password';">
                      👁️
                    </button>
                  </div>
                </div>

                <button id="auth-submit-btn" type="submit" class="btn btn-primary btn-lg w-full">
                  LOGIN
                </button>
              </form>

              <!-- ROLE SPECIFIC FOOTER INFO -->
              <div id="auth-role-footer" style="text-align:center; margin-top:1.25rem;">
                ${role === 'teacher' ? `
                  <span style="color:var(--text-muted); font-size:0.825rem;">New Teacher? Contact your institution administrator.</span>
                ` : role === 'admin' ? `
                  <span style="color:var(--text-muted); font-size:0.825rem;">Admin accounts are managed by institution system setup.</span>
                ` : `
                  <a onclick="Router.openStudentRegisterModal()" style="color:var(--accent-cyan); font-weight:600; cursor:pointer; text-decoration:underline; font-size:0.85rem;">New Student? Register</a>
                `}
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT PANEL: UN-OBSCURED VISUAL CANVAS -->
        <div class="auth-right-panel">
          <div class="background-decoration-zone">
            <div class="right-panel-blob right-panel-blob-1"></div>
            <div class="right-panel-blob right-panel-blob-2"></div>
          </div>

          <div class="background-text-zone">
            <div class="bg-text-item bg-text-top-left">EDUNEXUS</div>
            <div class="bg-text-item bg-text-top-right">AI LEARNING</div>
            <div class="bg-text-item bg-text-bottom-right">V3.0</div>
          </div>

          <div class="hero-interaction-zone">
            <div class="center-hero-zone">
              <div style="font-size: 4rem; margin-bottom: 0.5rem; filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.5));">🎓</div>
              <h3 style="font-size: 1.35rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.35rem;">Adaptive Intelligence</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary);">Early Intervention & Personalized Academic Guidance for Engineering Students</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  openStudentRegisterModal() {
    const body = `
      <form id="student-reg-form" onsubmit="event.preventDefault(); Router.submitStudentRegister();">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" id="reg-fullname" class="form-control" placeholder="e.g. Vikram Sharma" required>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
          <div class="form-group">
            <label class="form-label">School / Institution Code</label>
            <input type="text" id="reg-school" class="form-control" value="ECB" required>
          </div>
          <div class="form-group">
            <label class="form-label">Roll Number</label>
            <input type="text" id="reg-roll" class="form-control" value="0248" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Class Section</label>
          <input type="text" id="reg-class" class="form-control" value="Sec-A">
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" id="reg-pass" class="form-control" value="student123" required>
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input type="password" id="reg-confirmpass" class="form-control" value="student123" required>
          </div>
        </div>
        <button type="submit" class="btn btn-primary w-full" style="margin-top:0.5rem;">Register Student Account</button>
      </form>
    `;
    Notifications.openModal('New Student Registration', body, null);
  }

  submitStudentRegister() {
    const fullName = document.getElementById('reg-fullname')?.value;
    const schoolCode = document.getElementById('reg-school')?.value;
    const rollNumber = document.getElementById('reg-roll')?.value;
    const classId = document.getElementById('reg-class')?.value;
    const password = document.getElementById('reg-pass')?.value;
    const confirmPassword = document.getElementById('reg-confirmpass')?.value;

    const res = Auth.registerStudent({ fullName, schoolCode, rollNumber, classId, password, confirmPassword });
    if (res.success) {
      Notifications.closeModal();
      Notifications.toast(`Student Account created! Student ID: ${res.id}`, 'success');
      this.setRole('student');
      const idInput = document.getElementById('auth-userid');
      const pwdInput = document.getElementById('auth-password');
      if (idInput) idInput.value = res.id;
      if (pwdInput) pwdInput.value = password;
    } else {
      Notifications.toast(res.message, 'error');
    }
  }

  renderStudentDashboard() {
    StudentDashboard.render();
  }

  renderTeacherDashboard() {
    const container = document.getElementById('page-body-container');
    if (container && window.TeacherView) TeacherView.renderDashboard(container);
  }

  renderTeacherStudents() {
    const container = document.getElementById('page-body-container');
    if (container && window.TeacherView) TeacherView.renderStudents(container);
  }

  renderTeacherClasses() {
    const container = document.getElementById('page-body-container');
    if (container && window.TeacherView) TeacherView.renderClasses(container);
  }

  renderTeacherPerformance() {
    const container = document.getElementById('page-body-container');
    if (container && window.TeacherView) TeacherView.renderPerformance(container);
  }

  renderTeacherTopics() {
    const container = document.getElementById('page-body-container');
    if (container && window.TeacherView) TeacherView.renderWeakTopics(container);
  }

  renderTeacherInterventions() {
    const container = document.getElementById('page-body-container');
    if (container && window.TeacherView) TeacherView.renderInterventions(container);
  }

  renderTeacherQuizzes() {
    const container = document.getElementById('page-body-container');
    if (container && window.TeacherView) TeacherView.renderQuizzes(container);
  }

  renderTeacherReports() {
    const container = document.getElementById('page-body-container');
    if (container && window.TeacherView) TeacherView.renderReports(container);
  }

  renderAdminDashboard() {
    const container = document.getElementById('page-body-container');
    if (container && window.AdminView) AdminView.renderDashboard(container);
  }

  renderAdminUsers() {
    this.renderAdminDashboard();
  }

  renderAdminStudents() {
    const container = document.getElementById('page-body-container');
    if (!container) return;
    const users = Storage.getUsers().filter(u => u.role === 'student');
    container.innerHTML = `
      <div class="fade-in" style="padding-top:0.5rem;">
        <h1 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:1.5rem;">REGISTERED STUDENT ACCOUNTS (${users.length})</h1>
        <div class="card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Institution Code</th>
                  <th>Branch & Semester</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(u => `
                  <tr>
                    <td><strong>${u.id}</strong></td>
                    <td>${u.name}</td>
                    <td>${u.schoolCode || 'ECB'}</td>
                    <td>${u.branch || 'Computer Science'} (${u.semester || 'Semester 3'})</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderAdminTeachers() {
    const container = document.getElementById('page-body-container');
    if (!container) return;
    const users = Storage.getUsers().filter(u => u.role === 'teacher');
    container.innerHTML = `
      <div class="fade-in" style="padding-top:0.5rem;">
        <h1 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:1.5rem;">INSTITUTION TEACHER ACCOUNTS (${users.length})</h1>
        <div class="card">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Teacher ID</th>
                  <th>Full Name</th>
                  <th>Subject</th>
                  <th>Assigned Classes</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(u => `
                  <tr>
                    <td><strong>${u.id}</strong></td>
                    <td>${u.name}</td>
                    <td>${u.subject || 'DBMS'}</td>
                    <td>${(u.assignedClasses || ['Sec-A']).join(', ')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  renderAdminClasses() {
    const container = document.getElementById('page-body-container');
    if (!container) return;
    const classes = Storage.getClasses();
    container.innerHTML = `
      <div class="fade-in" style="padding-top:0.5rem;">
        <h1 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:1.5rem;">INSTITUTION CLASS SECTIONS (${classes.length})</h1>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.25rem;">
          ${classes.map(c => `
            <div class="card card-gradient-border">
              <span class="badge badge-cyan" style="margin-bottom:0.5rem;">Section ${c.section}</span>
              <h3 style="font-size:1.2rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">${c.name}</h3>
              <p style="font-size:0.875rem; color:var(--text-muted);">Enrolled Capacity: ${c.studentCount} Students</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderAdminSubjects() {
    this.renderSubjects();
  }

  renderAdminAnalytics() {
    const container = document.getElementById('page-body-container');
    if (!container) return;
    const users = Storage.getUsers();
    const questions = Storage.getQuestions();
    container.innerHTML = `
      <div class="fade-in" style="padding-top:0.5rem;">
        <h1 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:1.5rem;">SYSTEM ANALYTICS & PLATFORM HEALTH</h1>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1rem; margin-bottom:2rem;">
          <div class="card text-center">
            <div style="font-size:2rem; font-weight:800; color:var(--accent-cyan);">${users.length}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Active Accounts</div>
          </div>
          <div class="card text-center">
            <div style="font-size:2rem; font-weight:800; color:var(--accent-purple);">${questions.length}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">MCQ Items</div>
          </div>
          <div class="card text-center">
            <div style="font-size:2rem; font-weight:800; color:var(--accent-emerald);">99.9%</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">System Uptime</div>
          </div>
          <div class="card text-center">
            <div style="font-size:2rem; font-weight:800; color:var(--accent-amber);">100%</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Role Protection</div>
          </div>
        </div>
      </div>
    `;
  }

  renderAdminReports() {
    const container = document.getElementById('page-body-container');
    if (!container) return;
    container.innerHTML = `
      <div class="fade-in" style="padding-top:0.5rem;">
        <h1 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:1.5rem;">SYSTEM AUDIT & INSTITUTION REPORTS</h1>
        <div class="card card-gradient-border">
          <h3>Institution Infrastructure Audit Report</h3>
          <p class="text-sm text-secondary" style="margin-top:0.5rem; margin-bottom:1.25rem;">Complete breakdown of student registration, instructor assignments, and system logs.</p>
          <button class="btn btn-primary" onclick="Notifications.toast('System Audit Report exported.', 'success')">📋 Export Audit Log</button>
        </div>
      </div>
    `;
  }

  renderSubjects() {
    const container = document.getElementById('page-body-container');
    if (!container) return;
    const subjects = Storage.getSubjects();

    if (subjects.length === 0) {
      container.innerHTML = `
        <div class="fade-in" style="padding-top:1rem;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
            <div>
              <h1 style="font-size:1.5rem; font-weight:800; color:var(--text-primary);">MY SUBJECTS (0)</h1>
              <p style="font-size:0.875rem; color:var(--text-muted);">Computer Science & Engineering Syllabus</p>
            </div>
            <button class="btn btn-primary" onclick="SubjectManager.showAddSubjectModal()">
              <i class="ri-add-line"></i> + Add Subject
            </button>
          </div>

          <div class="card card-gradient-border" style="text-align:center; padding:3.5rem 2rem; max-width:580px; margin:2rem auto;">
            <div style="font-size:3.5rem; margin-bottom:1rem;">📚</div>
            <h2 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin-bottom:0.5rem;">No subjects added yet</h2>
            <p style="font-size:0.875rem; color:var(--text-muted); margin-bottom:1.75rem; line-height:1.5;">
              Add your first subject with its syllabus and PYQs to begin your personalized learning journey.
            </p>
            <button class="btn btn-primary btn-lg" onclick="SubjectManager.showAddSubjectModal()">
              <i class="ri-add-line"></i> + Add Subject
            </button>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="fade-in" style="padding-top:0.5rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h1 style="font-size:1.5rem; font-weight:800; color:var(--text-primary);">MY SUBJECTS (${subjects.length})</h1>
            <p style="font-size:0.875rem; color:var(--text-muted);">Computer Science & Engineering Syllabus</p>
          </div>
          <button class="btn btn-primary" onclick="SubjectManager.showAddSubjectModal()">
            <i class="ri-add-line"></i> + Add Subject
          </button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:1.25rem;">
          ${subjects.map(s => {
            const hasSyllabusPdf = Boolean(s.syllabusFile);
            const hasManualSyllabus = Boolean(s.manualSyllabus && s.manualSyllabus.trim());
            const hasSyllabus = hasSyllabusPdf || hasManualSyllabus;
            const hasPyq = Boolean(s.pyqFile);

            let statusBadge = '<span class="badge badge-cyan">✓ Resources Ready</span>';
            if (!hasSyllabus && !hasPyq) {
              statusBadge = '<span class="badge badge-secondary" style="opacity:0.8;">Basic Subject</span>';
            } else if (!hasSyllabus || !hasPyq) {
              statusBadge = '<span class="badge badge-purple">Partially Prepared</span>';
            }

            return `
              <div class="card card-gradient-border" style="position:relative; display:flex; flex-direction:column; justify-content:space-between; height:100%;">
                <div>
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
                    <span class="badge badge-cyan">${s.code || 'SUB101'}</span>
                    <div style="display:flex; align-items:center; gap:0.5rem;">
                      ${statusBadge}
                      <div style="position:relative;">
                        <button class="btn btn-secondary btn-sm" style="padding:0.2rem 0.55rem; font-weight:bold;" onclick="SubjectManager.toggleCardDropdown(event, '${s.id}')" title="Subject Options">
                          ⋮
                        </button>
                        <div id="sub-dropdown-${s.id}" class="header-profile-dropdown" style="right:0; top:110%; width:145px; z-index:var(--z-dropdown);">
                          <a class="dropdown-item" onclick="SubjectManager.showEditSubjectModal('${s.id}')">✏️ Edit Subject</a>
                          <div style="height:1px; background:var(--border-color); margin:0.25rem 0;"></div>
                          <a class="dropdown-item text-danger" onclick="SubjectManager.confirmDeleteSubject('${s.id}')">🗑️ Delete Subject</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-primary); margin-bottom:0.35rem; line-height:1.3;">📘 ${s.name}</h3>
                  <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.85rem;">${s.semester || 'Semester 3'}</p>

                  <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1rem;">
                    ${hasSyllabusPdf ? `
                      <span style="font-size:0.725rem; font-weight:600; padding:0.2rem 0.5rem; background:rgba(16,185,129,0.12); color:#10B981; border-radius:4px; border:1px solid rgba(16,185,129,0.25);">
                        Syllabus ✓ (PDF)
                      </span>
                    ` : hasManualSyllabus ? `
                      <span style="font-size:0.725rem; font-weight:600; padding:0.2rem 0.5rem; background:rgba(16,185,129,0.12); color:#10B981; border-radius:4px; border:1px solid rgba(16,185,129,0.25);">
                        Syllabus ✓ (Manual)
                      </span>
                    ` : `
                      <span style="font-size:0.725rem; font-weight:600; padding:0.2rem 0.5rem; background:rgba(245,158,11,0.12); color:#FBBF24; border-radius:4px; border:1px solid rgba(245,158,11,0.25);">
                        ⚠ Syllabus missing
                      </span>
                    `}

                    ${hasPyq ? `
                      <span style="font-size:0.725rem; font-weight:600; padding:0.2rem 0.5rem; background:rgba(6,182,212,0.12); color:var(--accent-cyan); border-radius:4px; border:1px solid rgba(6,182,212,0.25);">
                        PYQs ✓
                      </span>
                    ` : `
                      <span style="font-size:0.725rem; font-weight:600; padding:0.2rem 0.5rem; background:rgba(245,158,11,0.12); color:#FBBF24; border-radius:4px; border:1px solid rgba(245,158,11,0.25);">
                        ⚠ PYQs missing
                      </span>
                    `}
                  </div>

                  <div style="margin-bottom:1.15rem;">
                    <div style="display:flex; align-items:center; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom:0.25rem;">
                      <span>Learning Progress</span>
                      <strong style="color:var(--accent-cyan);">${s.progress || 0}%</strong>
                    </div>
                    <div style="height:6px; background:var(--bg-tertiary); border-radius:var(--radius-full); overflow:hidden;">
                      <div style="width:${s.progress || 0}%; height:100%; background:var(--gradient-primary);"></div>
                    </div>
                  </div>
                </div>

                <div style="display:flex; gap:0.5rem; border-top:1px solid var(--border-color); padding-top:0.85rem; margin-top:auto;">
                  <button class="btn btn-primary btn-sm" style="flex:1;" onclick="SubjectManager.openSubjectDetails('${s.id}')">
                    Open Subject <i class="ri-arrow-right-line"></i>
                  </button>
                  ${(!hasSyllabus || !hasPyq) ? `
                    <button class="btn btn-outline btn-sm" onclick="SubjectManager.showEditSubjectModal('${s.id}')" title="Add Resources">
                      + Add Resources
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  renderSubjectDetails(subjectId) {
    const container = document.getElementById('page-body-container');
    if (!container) return;
    const targetId = subjectId || (this.activeDetailSubjectId || 'SUB_DBMS');
    this.activeDetailSubjectId = targetId;

    const s = Storage.getSubjectById(targetId);
    if (!s) {
      this.renderSubjects();
      return;
    }

    const hasSyllabusPdf = Boolean(s.syllabusFile);
    const hasManualSyllabus = Boolean(s.manualSyllabus && s.manualSyllabus.trim());
    const hasPyq = Boolean(s.pyqFile);

    container.innerHTML = `
      <div class="fade-in" style="padding-top:0.5rem; max-width:900px;">
        <button class="btn btn-secondary btn-sm" style="margin-bottom:1.25rem;" onclick="Router.navigate('/subjects')">
          ← Back to My Subjects
        </button>

        <div class="card card-gradient-border" style="margin-bottom:1.5rem;">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
            <div>
              <span class="badge badge-cyan" style="margin-bottom:0.35rem;">${s.code || 'SUB101'}</span>
              <h1 style="font-size:1.6rem; font-weight:800; color:var(--text-primary); margin-bottom:0.25rem;">📘 ${s.name}</h1>
              <p style="font-size:0.875rem; color:var(--text-muted);">${s.semester || 'Semester 3'} • Computer Science & Engineering</p>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-outline btn-sm" onclick="SubjectManager.showEditSubjectModal('${s.id}')">✏️ Edit Subject</button>
              <button class="btn btn-danger btn-sm" onclick="SubjectManager.confirmDeleteSubject('${s.id}')">🗑️ Delete</button>
            </div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
          <!-- SYLLABUS CARD -->
          <div class="card">
            <h3 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:0.75rem;">Syllabus Status</h3>
            ${hasSyllabusPdf ? `
              <div style="display:flex; align-items:center; gap:0.75rem; background:var(--bg-tertiary); padding:0.75rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                <span style="font-size:1.5rem;">📄</span>
                <div>
                  <div style="font-size:0.875rem; font-weight:700; color:var(--text-primary);">${s.syllabusFile.name}</div>
                  <div style="font-size:0.75rem; color:#10B981;">✓ Syllabus PDF Uploaded (${s.syllabusFile.size})</div>
                </div>
              </div>
            ` : hasManualSyllabus ? `
              <div style="background:var(--bg-tertiary); padding:0.75rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                <div style="font-size:0.85rem; font-weight:700; color:#10B981; margin-bottom:0.35rem;">✓ Manual Syllabus Entered</div>
                <div style="font-size:0.775rem; color:var(--text-secondary); white-space:pre-line;">${s.manualSyllabus}</div>
              </div>
            ` : `
              <div style="background:rgba(245, 158, 11, 0.08); padding:0.75rem 1rem; border-radius:var(--radius-sm); border:1px solid rgba(245, 158, 11, 0.3);">
                <div style="font-size:0.85rem; font-weight:700; color:#FBBF24; margin-bottom:0.25rem;">⚠️ Syllabus Not Provided</div>
                <p style="font-size:0.775rem; color:var(--text-muted); margin:0 0 0.5rem 0;">Add your syllabus to help EduNexus build a more accurate personalized learning path.</p>
                <button class="btn btn-secondary btn-sm" onclick="SubjectManager.showEditSubjectModal('${s.id}')">+ Add Syllabus</button>
              </div>
            `}
          </div>

          <!-- PYQ CARD -->
          <div class="card">
            <h3 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:0.75rem;">Previous Year Questions (PYQ)</h3>
            ${hasPyq ? `
              <div style="display:flex; align-items:center; gap:0.75rem; background:var(--bg-tertiary); padding:0.75rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                <span style="font-size:1.5rem;">📄</span>
                <div>
                  <div style="font-size:0.875rem; font-weight:700; color:var(--text-primary);">${s.pyqFile.name}</div>
                  <div style="font-size:0.75rem; color:var(--accent-cyan);">✓ PYQ PDF Uploaded (${s.pyqFile.size})</div>
                </div>
              </div>
            ` : `
              <div style="background:rgba(245, 158, 11, 0.08); padding:0.75rem 1rem; border-radius:var(--radius-sm); border:1px solid rgba(245, 158, 11, 0.3);">
                <div style="font-size:0.85rem; font-weight:700; color:#FBBF24; margin-bottom:0.25rem;">⚠️ PYQs Not Uploaded</div>
                <p style="font-size:0.775rem; color:var(--text-muted); margin:0 0 0.5rem 0;">Upload PYQs to improve practice question relevance and exam recommendations.</p>
                <button class="btn btn-secondary btn-sm" onclick="SubjectManager.showEditSubjectModal('${s.id}')">+ Upload PYQs</button>
              </div>
            `}
          </div>
        </div>

        <!-- ADDITIONAL STUDY MATERIAL -->
        <div class="card" style="margin-bottom:1.5rem;">
          <h3 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:0.75rem;">Additional Study Material</h3>
          ${s.additionalMaterials && s.additionalMaterials.length > 0 ? `
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              ${s.additionalMaterials.map(m => `
                <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-tertiary); padding:0.6rem 0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                  <div style="display:flex; align-items:center; gap:0.5rem;">
                    <span>📄</span>
                    <span style="font-size:0.85rem; font-weight:600; color:var(--text-primary);">${m.name}</span>
                  </div>
                  <span style="font-size:0.75rem; color:var(--text-muted);">${m.size}</span>
                </div>
              `).join('')}
            </div>
          ` : `
            <p style="font-size:0.85rem; color:var(--text-muted);">No additional study material uploaded yet.</p>
          `}
        </div>

        <!-- QUICK ACTIONS -->
        <div class="card card-gradient-border" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
          <div>
            <h3 style="font-size:1.1rem; font-weight:700;">Personalized Subject Learning</h3>
            <p style="font-size:0.85rem; color:var(--text-muted);">Start practicing questions or explore your AI learning path for this subject.</p>
          </div>
          <div style="display:flex; gap:0.75rem;">
            <button class="btn btn-primary" onclick="Quiz.startQuiz('${s.id}'); Router.navigate('/quiz');">
              🎯 Start Practice Quiz
            </button>
            <button class="btn btn-outline" onclick="Router.navigate('/learning-path')">
              🌿 View Learning Path
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderTopics() {
    this.renderSubjects();
  }

  renderQuiz() {
    const container = document.getElementById('page-body-container');
    if (!container) return;

    if (Quiz.viewMode === 'active' && Quiz.currentQuiz) {
      Quiz.renderActiveQuiz('page-body-container');
    } else if (Quiz.viewMode === 'results' && Quiz.lastResult) {
      Quiz.renderResults(Quiz.lastResult, 'page-body-container');
    } else {
      Quiz.renderHub('page-body-container');
    }
  }

  renderQuizResults(res) {
    Quiz.renderResults(res, 'page-body-container');
  }

  renderLearningPath() {
    LearningPath.render('page-body-container');
  }

  renderProgress() {
    const container = document.getElementById('page-body-container');
    if (!container) return;

    const currentUser = Auth.getCurrentUser() || { id: 'ECB0245', name: 'Student' };
    const studentId = currentUser.id;
    const studentPerf = Storage.getPerformance(studentId);
    const nexa = window.AIEngine ? AIEngine.getNexaAIInsightForStudent(studentId) : null;
    const subjects = Storage.getSubjects();
    const allTopics = Storage.getTopics();
    const allResults = (Storage.getDb().quizResults || []).filter(r => r.studentId === studentId || r.studentId === 'ECB0245');

    const masteredTopics = studentPerf.filter(p => p.accuracy >= 75);
    const totalTopicsCount = Math.max(allTopics.length, 1);
    const overallProgress = Math.round((masteredTopics.length / totalTopicsCount) * 100) || 76;

    // Strongest and Needs Attention Areas
    const sortedPerf = studentPerf.slice().sort((a, b) => b.accuracy - a.accuracy);
    const strongestArea = sortedPerf[0] ? `${sortedPerf[0].topicName} (${sortedPerf[0].accuracy}%)` : 'Data Structures & Algorithms';
    const weakAreaObj = studentPerf.find(p => p.accuracy < 60) || studentPerf.find(p => p.accuracy < 75) || sortedPerf[sortedPerf.length - 1];
    const needsAttentionArea = weakAreaObj ? `${weakAreaObj.topicName} (${weakAreaObj.accuracy}%)` : 'None';

    const riskLevel = nexa ? nexa.riskLevel : (weakAreaObj && weakAreaObj.accuracy < 60 ? 'HIGH' : weakAreaObj && weakAreaObj.accuracy < 78 ? 'MEDIUM' : 'LOW');
    const riskBadgeClass = riskLevel === 'HIGH' ? 'badge-high' : riskLevel === 'MEDIUM' ? 'badge-medium' : 'badge-low';
    const riskColor = riskLevel === 'HIGH' ? '#EF4444' : riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981';

    container.innerHTML = `
      <div class="fade-in" style="padding-top:0.5rem; max-width:1100px; margin:0 auto;">
        <!-- HEADER -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h1 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin:0;">
              📊 ACADEMIC PROGRESS & PERFORMANCE ANALYTICS
            </h1>
            <p style="font-size:0.875rem; color:var(--text-muted); margin-top:0.25rem;">
              Real-time curriculum mastery breakdown for <strong>${currentUser.name}</strong>.
            </p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="App.openNexaAIChat('Give me a full summary of my academic progress')">
            ✦ Ask NexaAI for Insights
          </button>
        </div>

        <!-- 1. OVERALL PROGRESS HERO CARD -->
        <div class="card card-gradient-border" style="margin-bottom:1.75rem; padding:1.5rem;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
            <div>
              <span style="font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em;">
                Overall Curriculum Mastery
              </span>
              <h2 style="font-size:2rem; font-weight:800; color:var(--text-primary); margin:0.1rem 0 0 0;" data-animate-value>
                ${overallProgress}%
              </h2>
            </div>
            <span class="badge ${riskBadgeClass}" style="font-size:0.8rem; padding:0.4rem 0.8rem; font-weight:800;">
              ${riskLevel} RISK
            </span>
          </div>

          <div style="width:100%; height:10px; background:var(--bg-tertiary); border-radius:5px; margin-bottom:1.25rem; overflow:hidden;">
            <div style="width:${overallProgress}%; height:100%; background:var(--gradient-primary); transition:width 0.6s cubic-bezier(0.16, 1, 0.3, 1);"></div>
          </div>

          <!-- KEY METRICS GRID -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; border-top:1px solid var(--border-color); padding-top:1.15rem;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">🏆 Strongest Area</div>
              <div style="font-size:0.95rem; font-weight:700; color:var(--accent-cyan); margin-top:0.2rem;">
                ${strongestArea}
              </div>
            </div>

            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">⚠️ Needs Attention</div>
              <div style="font-size:0.95rem; font-weight:700; color:#F59E0B; margin-top:0.2rem;">
                ${needsAttentionArea}
              </div>
            </div>

            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">🛡️ Academic Status</div>
              <div style="font-size:0.95rem; font-weight:700; color:${riskColor}; margin-top:0.2rem;">
                ${riskLevel === 'HIGH' ? 'Needs Immediate Intervention' : riskLevel === 'MEDIUM' ? 'Prerequisite Practice Recommended' : 'Optimal Academic Track'}
              </div>
            </div>
          </div>
        </div>

        <!-- 2. NEXAAI ACADEMIC INSIGHT BANNER -->
        ${nexa ? `
          <div class="card card-gradient-border" style="margin-bottom:1.75rem; background:var(--bg-secondary); border-left:4px solid ${riskColor}; padding:1.25rem;">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
              <div style="flex:1;">
                <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
                  <span style="color:var(--accent-cyan); font-size:1.1rem;">✦</span>
                  <strong style="font-size:1rem; font-weight:800; color:var(--text-primary);">NexaAI Academic Insight</strong>
                </div>
                <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.55; margin:0 0 0.5rem 0;">
                  ${nexa.explanation}
                </p>
                <div style="font-size:0.8rem; font-weight:700; color:var(--text-primary);">
                  🎯 Recommended Step: <span style="color:var(--accent-cyan);">${nexa.recommendedAction}</span>
                </div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="App.openNexaAIChat('What should I study first?')">
                ✦ Ask NexaAI
              </button>
            </div>
          </div>
        ` : ''}

        <!-- 3. RECENT PERFORMANCE TREND -->
        <div class="card" style="margin-bottom:1.75rem;">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-bottom:1rem;">
            📈 Recent Quiz Performance History
          </h3>
          ${allResults.length > 0 ? `
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem;">
              ${allResults.slice(-4).map(res => `
                <div style="background:var(--bg-tertiary); padding:0.85rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                  <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">${res.topicName}</div>
                  <div style="font-size:1.4rem; font-weight:800; color:${res.score >= 75 ? '#10B981' : '#F59E0B'}; margin:0.25rem 0;">
                    ${res.score}%
                  </div>
                  <div style="font-size:0.725rem; color:var(--text-secondary);">Score: ${res.score >= 75 ? 'Mastered' : 'Needs Practice'}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="text-align:center; padding:2rem 1rem; background:var(--bg-tertiary); border-radius:var(--radius-sm); border:1px dashed var(--border-color);">
              <p style="font-size:0.875rem; color:var(--text-muted); margin-bottom:1rem;">Complete diagnostic quizzes on your Learning Path to build your continuous performance trend.</p>
              <button class="btn btn-primary btn-sm" onclick="Router.navigate('/quiz')">🎯 Take a Quiz</button>
            </div>
          `}
        </div>

        <!-- 4. SUBJECT / TOPIC PROGRESS BREAKDOWN -->
        <div class="card">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-bottom:1rem;">
            📚 Subject Progress Breakdown
          </h3>
          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${subjects.map(sub => {
              const subTopics = allTopics.filter(t => t.subjectId === sub.id);
              const subPerf = studentPerf.filter(p => subTopics.some(t => t.id === p.topicId));
              const avgScore = subPerf.length > 0 ? Math.round(subPerf.reduce((acc, curr) => acc + curr.accuracy, 0) / subPerf.length) : 75;
              const statusBadge = avgScore >= 80 ? '<span class="badge badge-low">Strong</span>' : avgScore >= 65 ? '<span class="badge badge-medium">Improving</span>' : '<span class="badge badge-high">Needs Practice</span>';

              return `
                <div style="background:var(--bg-tertiary); padding:1rem 1.15rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem; flex-wrap:wrap; gap:0.5rem;">
                    <div>
                      <strong style="font-size:0.95rem; color:var(--text-primary);">${sub.name}</strong>
                      <span style="font-size:0.75rem; color:var(--text-muted); margin-left:0.5rem;">(${sub.code})</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:0.75rem;">
                      ${statusBadge}
                      <span style="font-size:0.9rem; font-weight:800; color:var(--accent-cyan);">${avgScore}%</span>
                    </div>
                  </div>
                  <div style="width:100%; height:6px; background:var(--bg-primary); border-radius:3px; overflow:hidden;">
                    <div style="width:${avgScore}%; height:100%; background:var(--gradient-primary); transition:width 0.4s ease;"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderAchievements() {
    const container = document.getElementById('page-body-container');
    if (!container) return;

    const user = Auth.getCurrentUser() || { id: 'ECB0245', achievements: [] };
    const history = Storage.getMindfulHistory(user.id);
    const isGoalDone = MindfulBreak.isDailyGoalCompleted(user.id);
    const isCompletedToday = MindfulBreak.hasCompletedToday(user.id);

    const userBadges = user.achievements || [];
    const bestScore = history.length > 0 ? Math.max(...history.map(h => h.focusScore || 80)) : 0;
    const totalXP = user.mindfulXP || 0;

    container.innerHTML = `
      <div class="fade-in" style="padding-top:0.5rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h1 style="font-size:1.5rem; font-weight:800; color:var(--text-primary);">ACHIEVEMENTS & MINDFUL REFRESH</h1>
            <p style="font-size:0.875rem; color:var(--text-muted);">Real activity unlocks & mental focus wellness rewards.</p>
          </div>
          <div style="background:var(--bg-secondary); border:1px solid var(--border-color); padding:0.5rem 1rem; border-radius:var(--radius-md); font-weight:700; color:#10B981;">
            ⭐ Total XP: ${totalXP}
          </div>
        </div>

        <!-- 1. SYSTEM BADGES GRID -->
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:1.15rem; margin-bottom:2rem;">
          <div class="card card-gradient-border" style="background:${userBadges.includes('first_quiz') ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)'}; border-color:${userBadges.includes('first_quiz') ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'};">
            <div style="font-size:1.6rem; margin-bottom:0.25rem;">🎯</div>
            <div style="font-size:0.875rem; font-weight:700; color:var(--text-primary);">FIRST QUIZ</div>
            <div style="font-size:0.75rem; color:${userBadges.includes('first_quiz') ? '#10B981' : 'var(--text-muted)'};">${userBadges.includes('first_quiz') ? 'Unlocked' : 'Locked'}</div>
          </div>

          <div class="card card-gradient-border" style="background:${userBadges.includes('streak_5') ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-tertiary)'}; border-color:${userBadges.includes('streak_5') ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-color)'};">
            <div style="font-size:1.6rem; margin-bottom:0.25rem;">🔥</div>
            <div style="font-size:0.875rem; font-weight:700; color:var(--text-primary);">7-DAY STREAK</div>
            <div style="font-size:0.75rem; color:#F59E0B;">5 / 7 Days</div>
          </div>

          <div class="card card-gradient-border" style="background:${userBadges.includes('topic_master') ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-tertiary)'}; border-color:${userBadges.includes('topic_master') ? 'rgba(139, 92, 246, 0.3)' : 'var(--border-color)'};">
            <div style="font-size:1.6rem; margin-bottom:0.25rem;">👑</div>
            <div style="font-size:0.875rem; font-weight:700; color:var(--text-primary);">TOPIC MASTER</div>
            <div style="font-size:0.75rem; color:var(--accent-purple);">${userBadges.includes('topic_master') ? 'Unlocked' : 'Locked'}</div>
          </div>

          <div class="card card-gradient-border" style="background:${userBadges.includes('mindful_learner') ? 'rgba(6, 182, 212, 0.1)' : 'var(--bg-tertiary)'}; border-color:${userBadges.includes('mindful_learner') ? 'rgba(6, 182, 212, 0.3)' : 'var(--border-color)'};">
            <div style="font-size:1.6rem; margin-bottom:0.25rem;">🧠</div>
            <div style="font-size:0.875rem; font-weight:700; color:var(--text-primary);">MINDFUL LEARNER</div>
            <div style="font-size:0.75rem; color:var(--accent-cyan);">${userBadges.includes('mindful_learner') ? 'Unlocked (3 Breaks)' : '3 Breaks Needed'}</div>
          </div>

          <div class="card card-gradient-border" style="background:${userBadges.includes('focus_master') ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)'}; border-color:${userBadges.includes('focus_master') ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-color)'};">
            <div style="font-size:1.6rem; margin-bottom:0.25rem;">🎯</div>
            <div style="font-size:0.875rem; font-weight:700; color:var(--text-primary);">FOCUS MASTER</div>
            <div style="font-size:0.75rem; color:#10B981;">${userBadges.includes('focus_master') ? 'Unlocked (7 Breaks)' : '7 Breaks Needed'}</div>
          </div>
        </div>

        <!-- 2. 🧠 MINDFUL BREAK SECTION -->
        <div class="card card-gradient-border" style="margin-bottom:2rem; background:linear-gradient(135deg, rgba(6, 182, 212, 0.06), rgba(139, 92, 246, 0.06));">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem;">
            <div>
              <span class="badge badge-cyan" style="margin-bottom:0.35rem;">Daily Focus Refresh</span>
              <h2 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); display:flex; align-items:center; gap:0.5rem;">
                🧠 MINDFUL BREAK
              </h2>
              <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.2rem;">
                Take a short 60-second mental refresh after completing your learning goals.
              </p>
            </div>
            ${isCompletedToday ? `
              <div style="background:rgba(16, 185, 129, 0.15); border:1px solid rgba(16, 185, 129, 0.3); padding:0.6rem 1.15rem; border-radius:var(--radius-md); color:#10B981; font-weight:700; font-size:0.9rem;">
                ✓ Today's Mindful Break Completed (+20 XP)
              </div>
            ` : isGoalDone ? `
              <button class="btn btn-primary btn-lg" onclick="MindfulBreak.startSession('${user.id}')">
                [ START MINDFUL BREAK ] →
              </button>
            ` : `
              <button class="btn btn-secondary btn-lg" disabled style="opacity:0.6; cursor:not-allowed;">
                🔒 Mindful Break Locked
              </button>
            `}
          </div>

          ${!isGoalDone ? `
            <div style="background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1rem; font-size:0.85rem; color:var(--text-muted);">
              🔒 <strong>Complete today's learning goals to unlock your mindful break.</strong>
              <div style="margin-top:0.25rem; font-size:0.8rem;">Head over to Dashboard and complete at least one task on Today's To-Do List.</div>
            </div>
          ` : isCompletedToday ? `
            <div style="background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1rem; font-size:0.85rem; color:var(--text-secondary);">
              🎉 <strong>You've completed today's mental refresh session!</strong> Come back tomorrow after finishing your next daily learning goals for another +20 XP refresh.
            </div>
          ` : `
            <div style="background:rgba(6, 182, 212, 0.1); border:1px solid rgba(6, 182, 212, 0.3); border-radius:var(--radius-md); padding:1rem; font-size:0.85rem; color:var(--accent-cyan);">
              ✨ <strong>You've completed today's learning goals!</strong> Click above to launch a 60-second focus mini-game refresh.
            </div>
          `}
        </div>

        <!-- 3. MINDFUL PROGRESS & RECENT HISTORY -->
        <div style="display:grid; grid-template-columns:1fr 2fr; gap:1.25rem;">
          <div class="card card-gradient-border">
            <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:1rem;">MINDFUL PROGRESS</h3>
            <div style="display:flex; flex-direction:column; gap:1rem;">
              <div style="background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-sm);">
                <div style="font-size:0.75rem; color:var(--text-muted);">MINDFUL BREAKS COMPLETED</div>
                <div style="font-size:1.5rem; font-weight:800; color:var(--accent-cyan); margin:0.2rem 0;">${history.length} / 7</div>
                <div style="height:4px; background:var(--border-color); border-radius:var(--radius-full); overflow:hidden;">
                  <div style="width:${Math.min(100, Math.round((history.length / 7) * 100))}%; height:100%; background:var(--accent-cyan);"></div>
                </div>
              </div>

              <div style="background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-sm);">
                <div style="font-size:0.75rem; color:var(--text-muted);">BEST FOCUS SCORE</div>
                <div style="font-size:1.5rem; font-weight:800; color:var(--accent-purple); margin:0.2rem 0;">${bestScore}%</div>
                <div style="font-size:0.75rem; color:#10B981;">High Mental Clarity</div>
              </div>
            </div>
          </div>

          <div class="card card-gradient-border">
            <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:1rem;">RECENT MINDFUL BREAKS</h3>
            <div style="display:flex; flex-direction:column; gap:0.65rem;">
              ${history.length === 0 ? `
                <div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.85rem;">
                  No Mindful Break sessions completed yet. Unlock your first break today!
                </div>
              ` : history.slice(-4).reverse().map(h => `
                <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-tertiary); padding:0.75rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    <span style="font-size:1.2rem;">🧠</span>
                    <div>
                      <div style="font-size:0.875rem; font-weight:700; color:var(--text-primary);">${h.gameName}</div>
                      <div style="font-size:0.725rem; color:var(--text-muted);">${h.date}</div>
                    </div>
                  </div>
                  <div style="font-size:0.9rem; font-weight:800; color:var(--accent-cyan);">
                    ${h.focusScore}% Focus
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderSettings() {
    const container = document.getElementById('page-body-container');
    if (!container) return;
    const user = Auth.getCurrentUser() || { name: 'User', email: 'user@edunexus.edu', mobileNumber: '+91 9876543210' };
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

    container.innerHTML = `
      <div class="fade-in" style="max-width:980px; width:100%; margin:0 auto; padding:0.5rem 0.5rem 2rem 0.5rem; box-sizing:border-box;">
        
        <!-- CENTERED SETTINGS HEADER -->
        <div style="text-align:center; margin-bottom:2rem;">
          <h1 style="font-size:1.6rem; font-weight:800; color:var(--text-primary); margin-bottom:0.25rem;">
            SETTINGS
          </h1>
          <p style="font-size:0.875rem; color:var(--text-muted); margin:0;">
            Manage your account preferences, visual appearance modes, and platform information
          </p>
        </div>

        <!-- 1. ACCOUNT & PROFILE -->
        <div class="card card-gradient-border" style="margin-bottom:1.5rem; width:100%;">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:1rem;">
            👤 ACCOUNT & PROFILE
          </h3>
          <form onsubmit="event.preventDefault(); Router.saveProfileSettings();">
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.15rem; margin-bottom:1.15rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" style="font-weight:600;">Full Name</label>
                <input type="text" id="setting-name" class="form-control" value="${user.name || ''}" required />
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" style="font-weight:600;">Account ID / Roll No (Fixed Authentication ID)</label>
                <input type="text" class="form-control" value="${user.id || 'ECB0245'}" disabled style="opacity:0.7; cursor:not-allowed;" />
              </div>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.15rem; margin-bottom:1.15rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" style="font-weight:600;">Email Address</label>
                <input type="email" id="setting-email" class="form-control" value="${user.email || 'user@edunexus.edu'}" required />
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" style="font-weight:600;">Mobile Number</label>
                <input type="text" id="setting-mobile" class="form-control" value="${user.mobileNumber || '+91 9876543210'}" required />
              </div>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.15rem; margin-bottom:1.15rem;">
              <div class="form-group" style="margin:0;">
                <label class="form-label" style="font-weight:600;">Academic Branch / Department</label>
                <input type="text" id="setting-branch" class="form-control" value="${user.branch || 'Computer Science & Engineering'}" />
              </div>
              <div class="form-group" style="margin:0;">
                <label class="form-label" style="font-weight:600;">Class / Section</label>
                <input type="text" id="setting-section" class="form-control" value="${user.classId || 'Sec-A'}" />
              </div>
            </div>
            <div style="display:flex; justify-content:flex-end;">
              <button type="submit" class="btn btn-primary btn-sm" style="padding:0.5rem 1.25rem;">
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        <!-- 2. APPEARANCE & VISUAL MODES -->
        <div class="card card-gradient-border" style="margin-bottom:2rem; width:100%;">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:0.35rem;">
            🎨 APPEARANCE & VISUAL MODES
          </h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.25rem;">
            Select your preferred visual mode for comfortable study sessions.
          </p>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1.15rem;">
            <button class="card ${currentTheme === 'light' ? 'card-gradient-border' : ''}" style="text-align:center; padding:1.35rem 1rem; cursor:pointer; background:var(--bg-tertiary); border:${currentTheme === 'light' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)'}; transition:transform 0.15s ease;" onclick="App.setTheme('light'); Router.renderSettings();">
              <div style="font-size:1.85rem; margin-bottom:0.35rem;">☀</div>
              <div style="font-size:0.925rem; font-weight:700; color:var(--text-primary);">Light Mode</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">Clean & Bright Interface</div>
            </button>

            <button class="card ${currentTheme === 'dark' ? 'card-gradient-border' : ''}" style="text-align:center; padding:1.35rem 1rem; cursor:pointer; background:var(--bg-tertiary); border:${currentTheme === 'dark' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)'}; transition:transform 0.15s ease;" onclick="App.setTheme('dark'); Router.renderSettings();">
              <div style="font-size:1.85rem; margin-bottom:0.35rem;">◐</div>
              <div style="font-size:0.925rem; font-weight:700; color:var(--text-primary);">Dark Mode</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">Sleek Neon Contrast</div>
            </button>

            <button class="card ${currentTheme === 'eyecare' ? 'card-gradient-border' : ''}" style="text-align:center; padding:1.35rem 1rem; cursor:pointer; background:var(--bg-tertiary); border:${currentTheme === 'eyecare' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)'}; transition:transform 0.15s ease;" onclick="App.setTheme('eyecare'); Router.renderSettings();">
              <div style="font-size:1.85rem; margin-bottom:0.35rem;">👁</div>
              <div style="font-size:0.925rem; font-weight:700; color:var(--text-primary);">Eye Care</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">Warm Academic Cream</div>
            </button>
          </div>
        </div>

        <!-- 3. LEGAL & INFORMATION SECTION (COMPACT & MINIMAL) -->
        <div style="border-top:1px solid var(--border-color); padding-top:1.5rem; margin-top:2rem;">
          <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); margin-bottom:0.85rem; text-align:center;">
            LEGAL & INFORMATION
          </div>

          <div style="display:flex; align-items:center; justify-content:center; flex-wrap:wrap; gap:0.6rem 1.15rem; font-size:0.85rem; margin-bottom:1.15rem;">
            <a onclick="Router.navigate('/terms')" style="cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem; color:var(--text-secondary); transition:color 0.15s ease;" onmouseover="this.style.color='var(--accent-cyan)'" onmouseout="this.style.color='var(--text-secondary)'">
              <span style="font-size:0.9rem;">📄</span> <span style="font-weight:600;">Terms & Conditions</span>
            </a>

            <span style="color:var(--border-color); font-size:0.8rem; user-select:none;">|</span>

            <a onclick="Router.navigate('/disclaimer')" style="cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem; color:var(--text-secondary); transition:color 0.15s ease;" onmouseover="this.style.color='var(--accent-cyan)'" onmouseout="this.style.color='var(--text-secondary)'">
              <span style="font-size:0.9rem;">⚠️</span> <span style="font-weight:600;">Disclaimer</span>
            </a>

            <span style="color:var(--border-color); font-size:0.8rem; user-select:none;">|</span>

            <a onclick="Router.navigate('/about')" style="cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem; color:var(--text-secondary); transition:color 0.15s ease;" onmouseover="this.style.color='var(--accent-cyan)'" onmouseout="this.style.color='var(--text-secondary)'">
              <span style="font-size:0.9rem;">ℹ️</span> <span style="font-weight:600;">About EduNexus</span>
            </a>

            <span style="color:var(--border-color); font-size:0.8rem; user-select:none;">|</span>

            <a onclick="Router.navigate('/licenses')" style="cursor:pointer; display:inline-flex; align-items:center; gap:0.35rem; color:var(--text-secondary); transition:color 0.15s ease;" onmouseover="this.style.color='var(--accent-cyan)'" onmouseout="this.style.color='var(--text-secondary)'">
              <span style="font-size:0.9rem;">📜</span> <span style="font-weight:600;">Open-Source Licenses</span>
            </a>
          </div>

          <!-- COPYRIGHT (FINAL ELEMENT AT BOTTOM OF SETTINGS PAGE) -->
          <div style="text-align:center; font-size:0.775rem; color:var(--text-muted); margin-top:0.5rem;">
            © 2026 EduNexus. All rights reserved.
          </div>
        </div>
      </div>
    `;
  }

  saveProfileSettings() {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const name = document.getElementById('setting-name')?.value?.trim();
    const email = document.getElementById('setting-email')?.value?.trim();
    const mobile = document.getElementById('setting-mobile')?.value?.trim();
    const branch = document.getElementById('setting-branch')?.value?.trim();
    const classId = document.getElementById('setting-section')?.value?.trim();

    if (!name || !email || !mobile) {
      if (window.Notifications) Notifications.toast('Please enter valid profile details.', 'error');
      return;
    }

    const updatedUser = Storage.updateUserProfile(user.id, {
      name: name,
      email: email,
      mobileNumber: mobile,
      branch: branch || user.branch || 'Computer Science',
      classId: classId || user.classId || 'Sec-A'
    });

    if (window.Notifications) {
      Notifications.toast('✓ Profile updated successfully', 'success');
    }

    const activeUser = Auth.getCurrentUser() || updatedUser;
    this.updateProfileElements(activeUser);

    if (this.currentRoute === '/settings') {
      this.renderSettings();
    }
  }

  renderTerms() {
    const container = document.getElementById('page-body-container');
    if (!container) return;

    container.innerHTML = `
      <div class="fade-in" style="max-width:850px; padding-top:0.5rem;">
        <button class="btn btn-secondary btn-sm" style="margin-bottom:1.25rem;" onclick="Router.navigate('/settings')">
          ← Back to Settings
        </button>

        <div class="card card-gradient-border" style="margin-bottom:1.5rem;">
          <span class="badge badge-cyan" style="margin-bottom:0.35rem;">Legal Information</span>
          <h1 style="font-size:1.6rem; font-weight:800; color:var(--text-primary); margin-bottom:0.25rem;">
            📄 Terms & Conditions
          </h1>
          <p style="font-size:0.875rem; color:var(--text-muted);">
            Platform usage guidelines and academic responsibilities.
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:1.25rem; margin-bottom:2rem;">
          <div class="card">
            <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">1. Educational Assistance Purpose</h3>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin:0;">
              EduNexus is designed as an educational study assistance platform to provide personalized learning roadmaps, diagnostic topic tracking, and practice activities for engineering students.
            </p>
          </div>

          <div class="card">
            <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">2. User Academic Responsibilities</h3>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin:0;">
              Students and users are solely responsible for how they utilize the information and recommendations provided by the platform. Users should verify all important academic information using official university syllabi, prescribed textbooks, and institutional faculty resources.
            </p>
          </div>

          <div class="card">
            <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">3. AI-Generated Recommendations & Accuracy</h3>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin:0;">
              AI-generated study recommendations, question pools, and topic evaluations are computational aids and may occasionally contain inaccuracies. Users are encouraged to cross-reference key concepts with official course materials.
            </p>
          </div>

          <div class="card">
            <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">4. Uploaded Content & Fair Use</h3>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin:0;">
              Any study materials, syllabus files, or previous-year question (PYQ) documents uploaded to EduNexus should belong to the user or be legally permitted for academic use within your educational institution.
            </p>
          </div>

          <div class="card">
            <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">5. Continuous Refinement & Updates</h3>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin:0;">
              System features, user interface components, and learning algorithms undergo continuous updates and refinements to support academic excellence.
            </p>
          </div>
        </div>

        <div style="text-align:center; font-size:0.8rem; color:var(--text-muted); border-top:1px solid var(--border-color); padding-top:1rem;">
          Last Updated: August 2026 • EduNexus Platform Terms
        </div>
      </div>
    `;
  }

  renderDisclaimer() {
    const container = document.getElementById('page-body-container');
    if (!container) return;

    container.innerHTML = `
      <div class="fade-in" style="max-width:850px; padding-top:0.5rem;">
        <button class="btn btn-secondary btn-sm" style="margin-bottom:1.25rem;" onclick="Router.navigate('/settings')">
          ← Back to Settings
        </button>

        <div class="card card-gradient-border" style="margin-bottom:1.5rem; border-left:4px solid #F59E0B;">
          <span class="badge" style="background:rgba(245,158,11,0.2); color:#FBBF24; margin-bottom:0.35rem;">Important Advisory</span>
          <h1 style="font-size:1.6rem; font-weight:800; color:var(--text-primary); margin-bottom:0.25rem;">
            ⚠️ Disclaimer
          </h1>
          <p style="font-size:0.875rem; color:var(--text-muted);">
            Important guidance regarding AI-generated content, academic guarantees, and exam prediction limitations.
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:1.25rem; margin-bottom:2rem;">
          <div class="card">
            <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">1. Educational Assistance Focus</h3>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin:0;">
              EduNexus is designed to provide educational assistance, personalized study roadmaps, diagnostic topic tracking, and practice activities to support student study routines.
            </p>
          </div>

          <div class="card">
            <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">2. AI Content Accuracy Warning</h3>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin:0;">
              AI-generated recommendations, question formulations, and concept breakdowns may not always be completely accurate. Students should verify important academic information with official syllabus documents, prescribed textbooks, and university faculty.
            </p>
          </div>

          <div class="card">
            <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">3. No Guarantee of Exam Results or Grades</h3>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin:0;">
              EduNexus does <strong>NOT</strong> guarantee examination questions, university examination results, letter grades, class rankings, or academic success. Diagnostic scores within EduNexus reflect practice activity performance within the application only.
            </p>
          </div>

          <div class="card">
            <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">4. Supplementary Assistance Disclaimer</h3>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin:0;">
              Recommendations generated by EduNexus are intended as learning assistance and should not be considered a substitute for professional academic instruction or official institutional advising.
            </p>
          </div>

          <div class="card">
            <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">5. Syllabus & PYQ Upload Limitation</h3>
            <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.6; margin:0;">
              Uploading syllabus and previous-year question (PYQ) documents helps improve the relevance of generated practice questions and learning paths, but does <strong>NOT</strong> guarantee the prediction of future university examination questions.
            </p>
          </div>
        </div>

        <div style="text-align:center; font-size:0.8rem; color:var(--text-muted); border-top:1px solid var(--border-color); padding-top:1rem;">
          EduNexus Educational Advisory
        </div>
      </div>
    `;
  }

  renderAbout() {
    const container = document.getElementById('page-body-container');
    if (!container) return;

    container.innerHTML = `
      <div class="fade-in" style="max-width:850px; padding-top:0.5rem;">
        <button class="btn btn-secondary btn-sm" style="margin-bottom:1.25rem;" onclick="Router.navigate('/settings')">
          ← Back to Settings
        </button>

        <div class="card card-gradient-border" style="margin-bottom:1.5rem;">
          <span class="badge badge-cyan" style="margin-bottom:0.35rem;">Platform Vision & Overview</span>
          <h1 style="font-size:1.6rem; font-weight:800; color:var(--text-primary); margin-bottom:0.25rem;">
            ℹ️ About EduNexus
          </h1>
          <p style="font-size:0.875rem; color:var(--text-muted);">
            AI-Powered Personalized Learning & Early Intervention Platform
          </p>
        </div>

        <!-- 1. MISSION OVERVIEW -->
        <div class="card" style="margin-bottom:1.25rem;">
          <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:0.6rem;">Mission & Platform Concept</h3>
          <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.65; margin-bottom:0.85rem;">
            EduNexus personalizes learning by analyzing student performance, quiz results, mistakes, response time, topic-wise performance, and learning progress.
          </p>
          <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.65; margin-bottom:0.5rem; font-weight:600;">
            The platform helps students:
          </p>
          <ul style="font-size:0.85rem; color:var(--text-secondary); line-height:1.65; padding-left:1.2rem; margin:0 0 0.85rem 0;">
            <li>Identify weak areas</li>
            <li>Follow personalized learning paths</li>
            <li>Practice through adaptive quizzes</li>
            <li>Receive targeted recommendations</li>
          </ul>
          <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.65; margin:0;">
            Teachers can use performance insights to identify students who may require additional support.
          </p>
        </div>

        <!-- 2. CORE VISION BANNER -->
        <div class="card card-gradient-border" style="margin-bottom:1.5rem; text-align:center; padding:1.5rem; background:linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1));">
          <div style="font-size:0.8rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--accent-cyan); margin-bottom:0.25rem;">
            Vision
          </div>
          <h2 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin:0;">
            "Learn smarter. Practice better. Improve continuously."
          </h2>
        </div>

        <!-- 3. FOOTER -->
        <div style="text-align:center; padding:1.5rem 0 1rem 0; border-top:1px solid var(--border-color); color:var(--text-muted); font-size:0.825rem;">
          <div style="font-weight:800; font-size:1.1rem; color:var(--text-primary); margin-bottom:0.25rem;">EduNexus</div>
          <div style="font-size:0.75rem;">© 2026 EduNexus. Built for engineering academic excellence.</div>
        </div>
      </div>
    `;
  }

  renderLicenses() {
    const container = document.getElementById('page-body-container');
    if (!container) return;

    container.innerHTML = `
      <div class="fade-in" style="max-width:850px; padding-top:0.5rem;">
        <button class="btn btn-secondary btn-sm" style="margin-bottom:1.25rem;" onclick="Router.navigate('/settings')">
          ← Back to Settings
        </button>

        <div class="card card-gradient-border" style="margin-bottom:1.5rem;">
          <span class="badge badge-cyan" style="margin-bottom:0.35rem;">Attributions & Open Source</span>
          <h1 style="font-size:1.6rem; font-weight:800; color:var(--text-primary); margin-bottom:0.25rem;">
            📜 Open-Source & Third-Party Licenses
          </h1>
          <p style="font-size:0.875rem; color:var(--text-muted);">
            Licenses and attributions for third-party libraries, icon sets, and typography used in EduNexus.
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:1.15rem; margin-bottom:2rem;">
          <div class="card">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.35rem;">
              <h3 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin:0;">Google Fonts (Inter, Outfit, JetBrains Mono)</h3>
              <span class="badge badge-low">SIL Open Font License 1.1</span>
            </div>
            <p style="font-size:0.825rem; color:var(--text-muted); margin:0;">
              Typography assets for UI headers, body prose, and monospace code/timer displays.
            </p>
          </div>

          <div class="card">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.35rem;">
              <h3 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin:0;">Remix Icon Library</h3>
              <span class="badge badge-cyan">Apache License 2.0</span>
            </div>
            <p style="font-size:0.825rem; color:var(--text-muted); margin:0;">
              Open-source neutral icon system for navigation icons and status badges.
            </p>
          </div>

          <div class="card">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.35rem;">
              <h3 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin:0;">Chart.js Visualizer</h3>
              <span class="badge badge-purple">MIT License</span>
            </div>
            <p style="font-size:0.825rem; color:var(--text-muted); margin:0;">
              Canvas charting library for rendering analytics progress trends and performance distributions.
            </p>
          </div>
        </div>

        <div style="text-align:center; font-size:0.8rem; color:var(--text-muted); border-top:1px solid var(--border-color); padding-top:1rem;">
          EduNexus Open-Source Attributions
        </div>
      </div>
    `;
  }
}

const Router = new RouterEngine();
window.Router = Router;
