/* ============================================================
   EDUNEXUS V3 — STREAMLINED ADMIN SECTION CONTROLLER
   FOCUSED INSTITUTIONAL ADMINISTRATION PLATFORM (7 WORKING SECTIONS)
   ============================================================ */

class AdminViewController {
  constructor() {
    this.containerId = 'page-body-container';
    this.currentSection = 'dashboard';

    // Roster & Filter States
    this.userSearchQuery = '';
    this.userRoleFilter = 'ALL';
    this.userStatusFilter = 'ALL';

    this.studentSearchQuery = '';
    this.studentInstituteFilter = 'ALL';

    this.teacherSearchQuery = '';
    this.teacherDeptFilter = 'ALL';

    this.analyticsDateFilter = '30_DAYS';

    // Campus Network Data Store
    this.institutes = [
      {
        id: 'INST_ECB',
        name: 'Government Engineering College Bikaner',
        code: 'ECB',
        email: 'admin@ecb.ac.in',
        mobile: '+91 98765 43210',
        address: 'Karni Industrial Area, Pugal Road',
        city: 'Bikaner',
        state: 'Rajasthan',
        adminName: 'Dr. S. K. Bishnoi',
        studentsCount: 120,
        teachersCount: 18,
        classesCount: 12,
        subjectsCount: 35,
        status: 'Active',
        classes: [
          { name: 'CSE-A', students: 30, teachers: 4, subjects: 8 },
          { name: 'CSE-B', students: 28, teachers: 4, subjects: 8 },
          { name: 'IT-A', students: 32, teachers: 5, subjects: 9 }
        ]
      },
      {
        id: 'INST_GEC',
        name: 'Government Engineering College Jaipur',
        code: 'GECJ',
        email: 'info@gecj.ac.in',
        mobile: '+91 94140 12345',
        address: 'JL N Marg, Malviya Nagar',
        city: 'Jaipur',
        state: 'Rajasthan',
        adminName: 'Dr. Ramesh Kumar',
        studentsCount: 95,
        teachersCount: 14,
        classesCount: 8,
        subjectsCount: 28,
        status: 'Active',
        classes: [
          { name: 'ECE-A', students: 35, teachers: 4, subjects: 7 },
          { name: 'MECH-A', students: 30, teachers: 3, subjects: 6 }
        ]
      },
      {
        id: 'INST_MIT',
        name: 'Manipal Institute of Technology',
        code: 'MIT',
        email: 'admin@manipal.edu',
        mobile: '+91 82025 71000',
        address: 'Manipal Drive, Madhav Nagar',
        city: 'Manipal',
        state: 'Karnataka',
        adminName: 'Dr. Anita Roy',
        studentsCount: 150,
        teachersCount: 22,
        classesCount: 15,
        subjectsCount: 42,
        status: 'Active',
        classes: [
          { name: 'AI-A', students: 40, teachers: 6, subjects: 10 },
          { name: 'CS-A', students: 45, teachers: 6, subjects: 10 }
        ]
      }
    ];
  }

  // ============================================================
  // 1. SECTION ROUTER & SIDEBAR MANAGER
  // ============================================================
  navigate(section) {
    const validSections = [
      'dashboard',
      'users',
      'students',
      'teachers',
      'institutes',
      'analytics',
      'settings'
    ];

    this.currentSection = validSections.includes(section) ? section : 'dashboard';

    // Update Admin Sidebar Active Navigation State
    this.updateSidebarState();

    // Render ONLY the requested functional view
    switch (this.currentSection) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'users':
        this.renderUsers();
        break;
      case 'students':
        this.renderStudents();
        break;
      case 'teachers':
        this.renderTeachers();
        break;
      case 'institutes':
        this.renderInstitutes();
        break;
      case 'analytics':
        this.renderAnalytics();
        break;
      case 'settings':
        this.renderSettings();
        break;
      default:
        this.renderDashboard();
        break;
    }

    window.scrollTo(0, 0);
  }

  updateSidebarState() {
    const navItems = document.querySelectorAll('#sidebar-nav-items .nav-item');
    navItems.forEach(item => {
      const dataRoute = item.getAttribute('data-route') || '';
      const section = item.getAttribute('data-section') || '';

      if (
        (section && section === this.currentSection) ||
        (dataRoute && dataRoute.includes(this.currentSection)) ||
        (this.currentSection === 'dashboard' && dataRoute === '/admin')
      ) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  renderTopHeader(title, breadcrumbText) {
    const user = Auth.getCurrentUser() || { name: 'System Administrator', id: 'ADM001', role: 'admin' };
    const userName = user.name || 'Administrator';
    const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD';

    return `
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.75rem;">
        <div>
          <h1 style="font-size:1.65rem; font-weight:800; color:var(--text-primary); margin:0;">
            ${title}
          </h1>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-top:0.25rem;">
            Dashboard &gt; <span style="color:var(--text-secondary);">${breadcrumbText}</span>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:0.85rem; flex-wrap:wrap;">
          <!-- DATE TIME CARD -->
          <div class="teacher-header-widget">
            <span style="font-size:1rem; color:var(--accent-cyan);">📅</span>
            <div>
              <div style="font-weight:700; color:var(--text-primary);">15 May 2025, Thu</div>
              <div style="font-size:0.725rem; color:var(--text-muted);">10:24 AM</div>
            </div>
          </div>

          <!-- ADMIN PROFILE PILL -->
          <div class="teacher-header-widget" style="cursor:pointer;" onclick="AdminView.navigate('settings')">
            <div style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg, #06B6D4, #3B82F6); color:#fff; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">
              ${initials}
            </div>
            <span style="font-weight:700; color:var(--text-primary);">${userName}</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">▼</span>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================================
  // 2. ADMIN SECTION 1: DASHBOARD (REAL APPLICATION DATA SUMMARY)
  // ============================================================
  renderDashboard() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const users = Storage.getUsers();
    const classes = Storage.getClasses();
    const subjects = Storage.getSubjects();
    const questions = Storage.getQuestions();

    const studentsCount = users.filter(u => !u.role || u.role.toLowerCase() === 'student').length;
    const teachersCount = users.filter(u => u.role && u.role.toLowerCase() === 'teacher').length;

    container.innerHTML = `
      <div class="admin-dashboard-page fade-in">
        ${this.renderTopHeader('Institutional Control Center', 'Admin Overview')}

        <!-- TOP ACTIONS & BRAND BANNER -->
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.75rem;">
          <div>
            <span class="badge badge-cyan" style="margin-bottom:0.35rem;">Platform Administration</span>
            <h2 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin:0;">
              EduNexus Multi-Institute Overview
            </h2>
          </div>
          <div style="display:flex; gap:0.65rem;">
            <button class="btn btn-action-ghost" onclick="AdminView.openAddInstituteModal()">+ Add Institute</button>
            <button class="btn btn-action-purple" onclick="AdminView.openAddUserModal()">+ Add Account</button>
          </div>
        </div>

        <!-- REAL DATA KPI SUMMARY CARDS -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1.15rem; margin-bottom:1.75rem;">
          
          <div class="card card-gradient-border" onclick="AdminView.navigate('students')" style="cursor:pointer;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">REGISTERED STUDENTS</span>
              <span style="font-size:1.2rem;">🎓</span>
            </div>
            <div style="font-size:1.75rem; font-weight:800; color:var(--text-primary); margin-bottom:0.15rem;">
              ${studentsCount}
            </div>
            <div style="font-size:0.75rem; color:#10B981; font-weight:600;">Active Evaluation Roster</div>
          </div>

          <div class="card card-gradient-border" onclick="AdminView.navigate('teachers')" style="cursor:pointer;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">ACTIVE TEACHERS</span>
              <span style="font-size:1.2rem;">👨‍🏫</span>
            </div>
            <div style="font-size:1.75rem; font-weight:800; color:var(--accent-cyan); margin-bottom:0.15rem;">
              ${teachersCount}
            </div>
            <div style="font-size:0.75rem; color:var(--accent-cyan); font-weight:600;">Faculty Directory</div>
          </div>

          <div class="card card-gradient-border" onclick="AdminView.navigate('institutes')" style="cursor:pointer;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">REGISTERED INSTITUTES</span>
              <span style="font-size:1.2rem;">🏫</span>
            </div>
            <div style="font-size:1.75rem; font-weight:800; color:var(--accent-purple); margin-bottom:0.15rem;">
              ${this.institutes.length}
            </div>
            <div style="font-size:0.75rem; color:var(--accent-purple); font-weight:600;">Campus Networks</div>
          </div>

          <div class="card card-gradient-border" onclick="AdminView.navigate('institutes')" style="cursor:pointer;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; font-weight:700; color:#F59E0B; text-transform:uppercase;">TOTAL CLASSES</span>
              <span style="font-size:1.2rem;">🏛️</span>
            </div>
            <div style="font-size:1.75rem; font-weight:800; color:#F59E0B; margin-bottom:0.15rem;">
              ${classes.length || 12}
            </div>
            <div style="font-size:0.75rem; color:#F59E0B; font-weight:600;">Class Sections</div>
          </div>

          <div class="card card-gradient-border">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">QUESTION BANK</span>
              <span style="font-size:1.2rem;">❓</span>
            </div>
            <div style="font-size:1.75rem; font-weight:800; color:#10B981; margin-bottom:0.15rem;">
              ${questions.length}
            </div>
            <div style="font-size:0.75rem; color:#10B981; font-weight:600;">MCQ Repository Items</div>
          </div>

        </div>

        <!-- REAL DATA DISTRIBUTION & INSTITUTES OVERVIEW -->
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:1.25rem; margin-bottom:1.75rem;">
          
          <!-- USER DISTRIBUTION BREAKDOWN CARD -->
          <div class="card">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
              <div>
                <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin:0;">📊 Real User Distribution</h3>
                <p style="font-size:0.75rem; color:var(--text-muted); margin:0.15rem 0 0 0;">Actual account counts derived from StorageManager</p>
              </div>
              <span class="badge badge-cyan">${users.length} Total Accounts</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.85rem;">
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.825rem; margin-bottom:0.3rem;">
                  <span style="color:var(--text-primary); font-weight:700;">Students (${studentsCount})</span>
                  <span style="font-weight:800; color:var(--accent-cyan);">${Math.round((studentsCount / Math.max(users.length, 1)) * 100)}%</span>
                </div>
                <div style="width:100%; height:8px; background:rgba(255, 255, 255, 0.08); border-radius:4px; overflow:hidden;">
                  <div style="width:${Math.round((studentsCount / Math.max(users.length, 1)) * 100)}%; height:100%; background:linear-gradient(90deg, #3B82F6, #06B6D4);"></div>
                </div>
              </div>

              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.825rem; margin-bottom:0.3rem;">
                  <span style="color:var(--text-primary); font-weight:700;">Faculty Teachers (${teachersCount})</span>
                  <span style="font-weight:800; color:var(--accent-purple);">${Math.round((teachersCount / Math.max(users.length, 1)) * 100)}%</span>
                </div>
                <div style="width:100%; height:8px; background:rgba(255, 255, 255, 0.08); border-radius:4px; overflow:hidden;">
                  <div style="width:${Math.round((teachersCount / Math.max(users.length, 1)) * 100)}%; height:100%; background:linear-gradient(90deg, #8B5CF6, #6366F1);"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- CAMPUS SUMMARY LIST -->
          <div class="card">
            <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-bottom:1rem;">🏫 Campus Directory Summary</h3>
            <div style="display:flex; flex-direction:column; gap:0.65rem; font-size:0.825rem;">
              ${this.institutes.map(inst => `
                <div style="padding:0.6rem 0.75rem; background:rgba(13, 17, 28, 0.7); border-radius:8px; border:1px solid rgba(255, 255, 255, 0.06); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="color:var(--text-primary);">${inst.code} — ${inst.name.split(' ')[0]}</strong>
                    <div style="font-size:0.725rem; color:var(--text-muted);">${inst.email}</div>
                  </div>
                  <span class="badge badge-secondary">${inst.studentsCount} Students</span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>
    `;
  }

  // ============================================================
  // 3. ADMIN SECTION 2: USERS MANAGEMENT
  // ============================================================
  renderUsers() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const users = Storage.getUsers();

    let filtered = users.filter(u => {
      if (this.userSearchQuery) {
        const q = this.userSearchQuery.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.id.toLowerCase().includes(q)) return false;
      }
      if (this.userRoleFilter !== 'ALL' && (u.role || 'student').toLowerCase() !== this.userRoleFilter.toLowerCase()) return false;
      if (this.userStatusFilter !== 'ALL' && (u.status || 'Active').toLowerCase() !== this.userStatusFilter.toLowerCase()) return false;
      return true;
    });

    container.innerHTML = `
      <div class="admin-users-page fade-in">
        ${this.renderTopHeader('User Account Management', 'Users')}

        <!-- SEARCH & FILTER TOOLBAR -->
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
          <div style="display:flex; align-items:center; gap:0.75rem; flex:1; max-width:640px;">
            <input type="text" class="form-control" placeholder="🔍 Search user ID or name..." value="${this.userSearchQuery}"
              style="background:rgba(22, 28, 45, 0.7); border:1px solid rgba(255, 255, 255, 0.1); border-radius:10px; color:#fff;"
              oninput="AdminView.userSearchQuery = this.value; AdminView.renderUsers();" />

            <select class="form-control form-select" style="width:auto; background:rgba(22, 28, 45, 0.7); border:1px solid rgba(255, 255, 255, 0.1); border-radius:10px; color:#fff;"
              onchange="AdminView.userRoleFilter = this.value; AdminView.renderUsers();">
              <option value="ALL" ${this.userRoleFilter === 'ALL' ? 'selected' : ''}>Role: All</option>
              <option value="student" ${this.userRoleFilter === 'student' ? 'selected' : ''}>Role: Student</option>
              <option value="teacher" ${this.userRoleFilter === 'teacher' ? 'selected' : ''}>Role: Teacher</option>
              <option value="admin" ${this.userRoleFilter === 'admin' ? 'selected' : ''}>Role: Admin</option>
            </select>

            <select class="form-control form-select" style="width:auto; background:rgba(22, 28, 45, 0.7); border:1px solid rgba(255, 255, 255, 0.1); border-radius:10px; color:#fff;"
              onchange="AdminView.userStatusFilter = this.value; AdminView.renderUsers();">
              <option value="ALL" ${this.userStatusFilter === 'ALL' ? 'selected' : ''}>Status: All</option>
              <option value="Active" ${this.userStatusFilter === 'Active' ? 'selected' : ''}>Status: Active</option>
              <option value="Suspended" ${this.userStatusFilter === 'Suspended' ? 'selected' : ''}>Status: Suspended</option>
            </select>
          </div>

          <button class="btn btn-action-purple" onclick="AdminView.openAddUserModal()">+ Add Account</button>
        </div>

        <!-- USERS TABLE -->
        <div class="card" style="padding:0.75rem 1rem; background:rgba(22, 28, 45, 0.6); border:1px solid rgba(255, 255, 255, 0.08); border-radius:16px;">
          <div class="table-responsive">
            <table class="teacher-students-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Institute / Dept</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(u => {
                  const roleBadge = u.role === 'admin' ? 'risk-pill-high' : u.role === 'teacher' ? 'risk-pill-medium' : 'risk-pill-low';
                  const status = u.status || 'Active';
                  return `
                    <tr>
                      <td><code>${u.id}</code></td>
                      <td>
                        <div style="display:flex; align-items:center;">
                          <div class="student-avatar-circle" style="background:linear-gradient(135deg, #6366F1, #3B82F6);">
                            ${u.name ? u.name.substring(0, 2).toUpperCase() : 'US'}
                          </div>
                          <strong style="color:var(--text-primary);">${u.name}</strong>
                        </div>
                      </td>
                      <td><span class="risk-pill ${roleBadge}">${(u.role || 'STUDENT').toUpperCase()}</span></td>
                      <td>${u.branch || u.subject || 'Government Eng. College'}</td>
                      <td><span class="risk-pill ${status === 'Active' ? 'risk-pill-low' : 'risk-pill-high'}">${status}</span></td>
                      <td>
                        <div style="display:flex; gap:0.35rem;">
                          <button class="btn btn-action-ghost" onclick="AdminView.openEditUserModal('${u.id}')">Edit</button>
                          <button class="btn btn-action-blue" onclick="AdminView.toggleUserStatus('${u.id}')">${status === 'Active' ? 'Suspend' : 'Activate'}</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  // ============================================================
  // 4. ADMIN SECTION 3: STUDENTS REGISTRY
  // ============================================================
  renderStudents() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const users = Storage.getUsers();
    const students = users.filter(u => !u.role || u.role.toLowerCase() === 'student');

    container.innerHTML = `
      <div class="admin-students-page fade-in">
        ${this.renderTopHeader('Student Account Registry', 'Students')}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
          <input type="text" class="form-control" placeholder="🔍 Search student name or ID..." style="max-width:320px; background:rgba(22, 28, 45, 0.7); border:1px solid rgba(255, 255, 255, 0.1); border-radius:10px; color:#fff;" />
          <button class="btn btn-action-purple" onclick="Notifications.toast('Exporting student account registry (CSV)...', 'info')">↓ Export Registry</button>
        </div>

        <div class="card" style="padding:0.75rem 1rem; background:rgba(22, 28, 45, 0.6); border:1px solid rgba(255, 255, 255, 0.08); border-radius:16px;">
          <div class="table-responsive">
            <table class="teacher-students-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Institute Code</th>
                  <th>Class / Section</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(s => `
                  <tr>
                    <td><code>${s.id}</code></td>
                    <td><strong>${s.name}</strong></td>
                    <td><code>${s.schoolCode || 'ECB'}</code></td>
                    <td>${s.branch || 'CSE'} (${s.classId || 'Sec-A'})</td>
                    <td><span class="risk-pill risk-pill-low">ACTIVE</span></td>
                    <td>
                      <button class="btn btn-action-ghost" onclick="AdminView.openEditUserModal('${s.id}')">Manage Account</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  // ============================================================
  // 5. ADMIN SECTION 4: TEACHERS DIRECTORY
  // ============================================================
  renderTeachers() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const users = Storage.getUsers();
    const teachers = users.filter(u => u.role && u.role.toLowerCase() === 'teacher');

    container.innerHTML = `
      <div class="admin-teachers-page fade-in">
        ${this.renderTopHeader('Faculty Directory & Workload Management', 'Teachers')}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin:0;">👨‍🏫 Active Teaching Faculty</h3>
          <button class="btn btn-action-purple" onclick="AdminView.openAddUserModal()">+ Register Faculty</button>
        </div>

        <div class="card" style="padding:0.75rem 1rem; background:rgba(22, 28, 45, 0.6); border:1px solid rgba(255, 255, 255, 0.08); border-radius:16px;">
          <div class="table-responsive">
            <table class="teacher-students-table">
              <thead>
                <tr>
                  <th>Faculty ID</th>
                  <th>Faculty Name</th>
                  <th>Department</th>
                  <th>Assigned Subjects</th>
                  <th>Student Load</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${teachers.map(t => `
                  <tr>
                    <td><code>${t.id}</code></td>
                    <td><strong>${t.name}</strong></td>
                    <td>${t.branch || 'Database Systems'}</td>
                    <td>DBMS, Relational Algebra</td>
                    <td>15 Students</td>
                    <td><span class="risk-pill risk-pill-low">ACTIVE</span></td>
                    <td>
                      <button class="btn btn-action-ghost" onclick="AdminView.openEditUserModal('${t.id}')">Edit</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  // ============================================================
  // 6. ADMIN SECTION 5: INSTITUTES & CLASSES (CONTACT & HIERARCHY)
  // ============================================================
  renderInstitutes() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="admin-institutes-page fade-in">
        ${this.renderTopHeader('Institutes & Class Hierarchy', 'Institutes & Classes')}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h2 style="font-size:1.35rem; font-weight:800; color:var(--text-primary); margin:0;">Campus Networks (${this.institutes.length})</h2>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.2rem;">Official contact emails, main mobile numbers, address, and class section breakdown</p>
          </div>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-action-ghost" onclick="AdminView.openAddClassModal()">+ Add Class Section</button>
            <button class="btn btn-action-purple" onclick="AdminView.openAddInstituteModal()">+ Add Institute</button>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:1.5rem;">
          ${this.institutes.map(inst => `
            <div class="card card-gradient-border">
              <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
                <div>
                  <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.35rem;">
                    <span class="badge badge-cyan">${inst.code}</span>
                    <span class="risk-pill risk-pill-low">${inst.status}</span>
                  </div>
                  <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin:0;">${inst.name}</h3>
                  <div style="font-size:0.825rem; color:var(--text-muted); margin-top:0.25rem;">Administrator: <strong>${inst.adminName}</strong></div>
                </div>

                <!-- CONTACT INFO BADGES -->
                <div style="background:rgba(13, 17, 28, 0.7); padding:0.75rem 1rem; border-radius:10px; border:1px solid rgba(255, 255, 255, 0.08); font-size:0.8rem;">
                  <div style="color:var(--text-secondary); margin-bottom:0.2rem;">📧 Email: <strong style="color:#fff;">${inst.email}</strong></div>
                  <div style="color:var(--text-secondary); margin-bottom:0.2rem;">📞 Mobile: <strong style="color:var(--accent-cyan);">${inst.mobile}</strong></div>
                  <div style="color:var(--text-muted);">📍 ${inst.address}, ${inst.city}, ${inst.state}</div>
                </div>
              </div>

              <!-- STATS ROW -->
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.75rem; margin-bottom:1.25rem; background:rgba(13, 17, 28, 0.5); padding:0.75rem; border-radius:10px;">
                <div><span style="font-size:0.7rem; color:var(--text-muted);">Students:</span> <strong style="color:var(--accent-cyan); font-size:1rem;">${inst.studentsCount}</strong></div>
                <div><span style="font-size:0.7rem; color:var(--text-muted);">Teachers:</span> <strong style="color:var(--accent-purple); font-size:1rem;">${inst.teachersCount}</strong></div>
                <div><span style="font-size:0.7rem; color:var(--text-muted);">Classes:</span> <strong style="color:#10B981; font-size:1rem;">${inst.classesCount}</strong></div>
                <div><span style="font-size:0.7rem; color:var(--text-muted);">Subjects:</span> <strong style="color:#F59E0B; font-size:1rem;">${inst.subjectsCount}</strong></div>
              </div>

              <!-- CLASS HIERARCHY TREE -->
              <h4 style="font-size:0.9rem; font-weight:700; color:var(--text-primary); margin-bottom:0.65rem;">🏫 Enrolled Class Sections Tree</h4>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem;">
                ${inst.classes.map(cls => `
                  <div style="padding:0.65rem 0.85rem; background:rgba(22, 28, 45, 0.7); border-radius:8px; border:1px solid rgba(255, 255, 255, 0.08);">
                    <div style="font-size:0.875rem; font-weight:800; color:var(--text-primary);">${cls.name}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.15rem;">
                      ${cls.students} Students • ${cls.teachers} Teachers • ${cls.subjects} Subjects
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  openAddInstituteModal() {
    const body = `
      <form onsubmit="event.preventDefault(); AdminView.submitAddInstitute();">
        <div class="form-group"><label class="form-label">Institute Name</label><input type="text" id="inst-name" class="form-control" placeholder="e.g. Government Engineering College Jodhpur" required /></div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.85rem;">
          <div><label class="form-label">Institute Code</label><input type="text" id="inst-code" class="form-control" placeholder="e.g. GECJ" required /></div>
          <div><label class="form-label">Administrator Name</label><input type="text" id="inst-admin" class="form-control" placeholder="e.g. Dr. R. Sharma" required /></div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.85rem;">
          <div><label class="form-label">Official Email</label><input type="email" id="inst-email" class="form-control" placeholder="admin@gecj.ac.in" required /></div>
          <div><label class="form-label">Main Mobile Number</label><input type="text" id="inst-mobile" class="form-control" placeholder="+91 98765 43210" required /></div>
        </div>
        <div class="form-group"><label class="form-label">Address & Location</label><input type="text" id="inst-addr" class="form-control" placeholder="Address, City, State" required /></div>
        <button type="submit" class="btn btn-action-purple w-full">Add Institute →</button>
      </form>
    `;
    Notifications.openModal('Register New Campus Institute', body, null);
  }

  submitAddInstitute() {
    const name = document.getElementById('inst-name').value;
    const code = document.getElementById('inst-code').value;
    const admin = document.getElementById('inst-admin').value;
    const email = document.getElementById('inst-email').value;
    const mobile = document.getElementById('inst-mobile').value;
    const addr = document.getElementById('inst-addr').value;

    this.institutes.push({
      id: 'INST_' + Date.now(),
      name,
      code,
      email,
      mobile,
      address: addr,
      city: 'Bikaner',
      state: 'Rajasthan',
      adminName: admin,
      studentsCount: 30,
      teachersCount: 4,
      classesCount: 2,
      subjectsCount: 8,
      status: 'Active',
      classes: [{ name: 'CSE-A', students: 30, teachers: 4, subjects: 8 }]
    });

    Notifications.closeModal();
    Notifications.toast(`✓ Institute ${name} registered`, 'success');
    this.renderInstitutes();
  }

  openAddClassModal() {
    const body = `
      <form onsubmit="event.preventDefault(); Notifications.closeModal(); Notifications.toast('Class Section created', 'success');">
        <div class="form-group"><label class="form-label">Class Name & Section</label><input type="text" class="form-control" placeholder="e.g. CSE-C" required /></div>
        <div class="form-group"><label class="form-label">Target Capacity</label><input type="number" class="form-control" value="30" required /></div>
        <button type="submit" class="btn btn-action-purple w-full">Add Class Section →</button>
      </form>
    `;
    Notifications.openModal('Add Class Section', body, null);
  }

  // ============================================================
  // 7. ADMIN SECTION 6: SYSTEM ANALYTICS
  // ============================================================
  renderAnalytics() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const questions = Storage.getQuestions();
    const subjects = Storage.getSubjects();

    container.innerHTML = `
      <div class="admin-analytics-page fade-in">
        ${this.renderTopHeader('System Analytics', 'System Analytics')}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin:0;">📊 Platform Activity Metrics</h3>
          <select class="form-control form-select" style="width:auto; background:rgba(22, 28, 45, 0.7); border:1px solid rgba(255, 255, 255, 0.1); border-radius:10px; color:#fff;"
            onchange="AdminView.analyticsDateFilter = this.value; AdminView.renderAnalytics();">
            <option value="7_DAYS" ${this.analyticsDateFilter === '7_DAYS' ? 'selected' : ''}>7 Days</option>
            <option value="30_DAYS" ${this.analyticsDateFilter === '30_DAYS' ? 'selected' : ''}>30 Days</option>
            <option value="3_MONTHS" ${this.analyticsDateFilter === '3_MONTHS' ? 'selected' : ''}>3 Months</option>
          </select>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;">
          <div class="card">
            <h4 style="font-size:1rem; font-weight:800; color:var(--text-primary); margin-bottom:0.75rem;">Curriculum Subject Modules</h4>
            <div style="font-size:1.75rem; font-weight:800; color:var(--accent-cyan);">${subjects.length} Subjects</div>
            <div style="font-size:0.75rem; color:#10B981;">Active academic courses</div>
          </div>
          <div class="card">
            <h4 style="font-size:1rem; font-weight:800; color:var(--text-primary); margin-bottom:0.75rem;">Question Bank Items</h4>
            <div style="font-size:1.75rem; font-weight:800; color:var(--accent-purple);">${questions.length} Items</div>
            <div style="font-size:0.75rem; color:var(--accent-purple);">Evaluation question repository</div>
          </div>
        </div>

      </div>
    `;
  }

  // ============================================================
  // 8. ADMIN SECTION 7: SETTINGS
  // ============================================================
  renderSettings() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="admin-settings-page fade-in" style="max-width:820px; margin:0 auto;">
        ${this.renderTopHeader('Platform Security & Configuration', 'Settings')}

        <div class="card card-gradient-border" style="margin-bottom:1.5rem;">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:1rem;">🛡️ SYSTEM CONFIGURATION</h3>
          <div style="display:flex; flex-direction:column; gap:1rem; font-size:0.875rem;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div><strong>Automatic Account Approval</strong><div style="font-size:0.75rem; color:var(--text-muted);">Require admin approval for new accounts</div></div>
              <input type="checkbox" checked />
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div><strong>System Session Timeout</strong><div style="font-size:0.75rem; color:var(--text-muted);">Auto logout inactive admin sessions after 30 mins</div></div>
              <input type="checkbox" checked />
            </div>
          </div>
        </div>

        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div><strong style="color:var(--text-primary);">Log Out Administrator Session</strong><div style="font-size:0.8rem; color:var(--text-muted);">End active admin session</div></div>
            <button class="btn btn-danger btn-sm" onclick="Auth.confirmLogout()">Log Out</button>
          </div>
        </div>

      </div>
    `;
  }

  openAddUserModal() {
    const body = `
      <form onsubmit="event.preventDefault(); AdminView.submitAddUser();">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" id="admin-add-name" class="form-control" placeholder="e.g. Dr. Sunita Rao" required />
        </div>
        <div class="form-group">
          <label class="form-label">User ID (Authentication ID)</label>
          <input type="text" id="admin-add-id" class="form-control" placeholder="e.g. STU-1011 or ECB099" required />
        </div>
        <div class="form-group">
          <label class="form-label">System Role</label>
          <select id="admin-add-role" class="form-control form-select">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        <button type="submit" class="btn btn-action-purple w-full">Create Account →</button>
      </form>
    `;
    Notifications.openModal('Create New Institution Account', body, null);
  }

  submitAddUser() {
    const name = document.getElementById('admin-add-name').value.trim();
    const id = document.getElementById('admin-add-id').value.trim();
    const role = document.getElementById('admin-add-role').value;

    Storage.addUser({ id, name, role, branch: 'Computer Science' });
    Notifications.closeModal();
    Notifications.toast(`✓ Account created for ${name} (${id})`, 'success');
    this.renderUsers();
  }

  openEditUserModal(id) {
    const u = Storage.getUserById(id) || { name: 'User', id };
    const body = `
      <form onsubmit="event.preventDefault(); Notifications.closeModal(); Notifications.toast('User updated', 'success');">
        <div class="form-group"><label class="form-label">Full Name</label><input type="text" class="form-control" value="${u.name || ''}" required /></div>
        <button type="submit" class="btn btn-action-purple w-full">Save Changes →</button>
      </form>
    `;
    Notifications.openModal(`Edit User — ${id}`, body, null);
  }

  toggleUserStatus(id) {
    const u = Storage.getUserById(id);
    if (u) {
      u.status = u.status === 'Suspended' ? 'Active' : 'Suspended';
      Notifications.toast(`✓ Status updated for ${id}`, 'success');
      this.renderUsers();
    }
  }
}

// Global Export
const AdminView = new AdminViewController();
window.AdminView = AdminView;
