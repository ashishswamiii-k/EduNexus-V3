/* ============================================================
   EDUNEXUS V3 — REBUILT TEACHER MODULE (PRODUCTION EDTECH UI)
   MATCHING REFERENCE DESIGN (input_file_0.png)
   ============================================================ */

class TeacherModuleController {
  constructor() {
    this.containerId = 'page-body-container';
    this.currentSection = 'dashboard';

    // Roster State
    this.searchQuery = '';
    this.currentRiskFilter = 'ALL';
    this.currentPerfFilter = 'ALL';
    this.currentSortBy = 'accuracy_desc';
    this.currentPage = 1;
    this.rowsPerPage = 25;

    // Notifications State
    this.notifications = [
      { id: 'TN_1', title: 'Quiz Submitted', message: 'Rahul Meena (ECB0245) completed DBMS Normalization evaluation quiz.', time: '10 mins ago', type: 'quiz', read: false },
      { id: 'TN_2', title: 'High-Risk Alert', message: 'Ashish Swami requires early prerequisite intervention in DBMS Normalization.', time: '1 hour ago', type: 'alert', read: false },
      { id: 'TN_3', title: 'Pushed Question Completed', message: 'Priya Verma answered targeted question on Relational Algebra.', time: '2 hours ago', type: 'task', read: true },
      { id: 'TN_4', title: 'Class Accuracy Improved', message: 'B.Tech CSE Sec-A average accuracy increased by +4.2% this week.', time: '1 day ago', type: 'info', read: true }
    ];
  }

  // ============================================================
  // 1. SECTION ROUTER & SIDEBAR MANAGER
  // ============================================================
  navigate(section) {
    const validSections = [
      'dashboard',
      'students',
      'classes',
      'performance',
      'weak-topics',
      'interventions',
      'quizzes',
      'notifications',
      'settings'
    ];

    this.currentSection = validSections.includes(section) ? section : 'dashboard';

    // Update Sidebar Navigation Active State
    this.updateSidebarState();

    // Render requested view
    switch (this.currentSection) {
      case 'dashboard':
        this.renderDashboard();
        break;
      case 'students':
        this.renderStudents();
        break;
      case 'classes':
        this.renderClasses();
        break;
      case 'performance':
        this.renderPerformance();
        break;
      case 'weak-topics':
        this.renderWeakTopics();
        break;
      case 'interventions':
        this.renderInterventions();
        break;
      case 'quizzes':
        this.renderQuizzes();
        break;
      case 'notifications':
        this.renderNotifications();
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
        (this.currentSection === 'dashboard' && dataRoute === '/teacher')
      ) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  getStudentStats() {
    const defaultRoster = [
      { id: 'STU-1011', name: 'Kanchan', branch: 'Computer Science', section: 'Sec-A', avgAccuracy: 96, learningProgress: 98, weakTopicName: 'None', riskStatus: 'LOW', avatarBg: 'linear-gradient(135deg, #EC4899, #8B5CF6)' },
      { id: 'STU-1008', name: 'Arjun Yadav', branch: 'Computer Science', section: 'Sec-B', avgAccuracy: 88, learningProgress: 100, weakTopicName: 'None', riskStatus: 'LOW', avatarBg: 'linear-gradient(135deg, #F59E0B, #D97706)' },
      { id: 'STU-1010', name: 'Aditya Verma', branch: 'Computer Science', section: 'Sec-B', avgAccuracy: 86, learningProgress: 100, weakTopicName: 'None', riskStatus: 'LOW', avatarBg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' },
      { id: '843285', name: 'ASHISH', branch: 'Computer Science', section: 'Sec-A', avgAccuracy: 78, learningProgress: 80, weakTopicName: 'None', riskStatus: 'LOW', avatarBg: 'linear-gradient(135deg, #3B82F6, #6366F1)' },
      { id: 'ECB0246', name: 'Rohan Sharma', branch: 'Computer Science', section: 'Sec-A', avgAccuracy: 72, learningProgress: 65, weakTopicName: 'Binary Search Trees', riskStatus: 'LOW', avatarBg: 'linear-gradient(135deg, #EF4444, #DC2626)' },
      { id: 'DEM00245', name: 'TILLU', branch: 'Computer Science', section: 'Sec-A', avgAccuracy: 70, learningProgress: 60, weakTopicName: 'Binary Search Trees', riskStatus: 'LOW', avatarBg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' },
      { id: 'STU-1004', name: 'Aarav Sharma', branch: 'Computer Science', section: 'Sec-A', avgAccuracy: 65, learningProgress: 50, weakTopicName: 'Binary Search Trees', riskStatus: 'MEDIUM', avatarBg: 'linear-gradient(135deg, #10B981, #059669)' },
      { id: 'ECB0245', name: 'Rahul Meena', branch: 'Computer Science', section: 'Sec-A', avgAccuracy: 60, learningProgress: 38, weakTopicName: 'DBMS Normalization', riskStatus: 'MEDIUM', avatarBg: 'linear-gradient(135deg, #3B82F6, #2563EB)' },
      { id: 'STU-1006', name: 'Rohan Gupta', branch: 'Computer Science', section: 'Sec-A', avgAccuracy: 48, learningProgress: 25, weakTopicName: 'Recursion & Dynamic Programming', riskStatus: 'HIGH', avatarBg: 'linear-gradient(135deg, #F59E0B, #B45309)' }
    ];

    const users = Storage.getUsers().filter(u => !u.role || u.role.toLowerCase() === 'student');
    const perfList = Storage.getDb().performance || [];

    // Merge custom students created via Auth/Storage
    users.forEach(u => {
      if (!defaultRoster.some(r => r.id === u.id)) {
        const sPerf = perfList.filter(p => p.studentId === u.id);
        let acc = 74;
        let prog = 60;
        if (sPerf.length > 0) {
          acc = Math.round(sPerf.reduce((a, b) => a + b.accuracy, 0) / sPerf.length);
          prog = Math.round((sPerf.filter(p => p.accuracy >= 75).length / sPerf.length) * 100);
        }
        let risk = acc < 55 ? 'HIGH' : acc < 72 ? 'MEDIUM' : 'LOW';
        defaultRoster.push({
          id: u.id,
          name: u.name,
          branch: u.branch || 'Computer Science',
          section: u.classId || 'Sec-A',
          avgAccuracy: acc,
          learningProgress: prog,
          weakTopicName: acc < 60 ? 'DBMS Normalization' : acc < 72 ? 'Binary Search Trees' : 'None',
          riskStatus: risk,
          avatarBg: 'linear-gradient(135deg, #6366F1, #8B5CF6)'
        });
      }
    });

    const totalScore = defaultRoster.reduce((a, b) => a + b.avgAccuracy, 0);
    const classAverage = defaultRoster.length > 0 ? Math.round(totalScore / defaultRoster.length) : 74;

    return {
      students: defaultRoster,
      classAverage,
      totalCount: defaultRoster.length,
      activeCount: Math.round(defaultRoster.length * 0.86),
      highCount: defaultRoster.filter(s => s.riskStatus === 'HIGH').length,
      mediumCount: defaultRoster.filter(s => s.riskStatus === 'MEDIUM').length,
      lowCount: defaultRoster.filter(s => s.riskStatus === 'LOW').length,
      avgProgress: 68
    };
  }

  getInitials(name) {
    if (!name) return 'ST';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  // Common Header Widget Renderer (Matching Reference Top Right Controls)
  renderTopHeader(title, breadcrumbText) {
    const user = Auth.getCurrentUser();
    const teacherName = user ? user.name : 'Mr. Ashish';

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

          <!-- NOTIFICATION BELL -->
          <div class="teacher-header-bell" onclick="TeacherModule.navigate('notifications')" title="Notifications">
            🔔
            <span class="teacher-header-bell-badge">8</span>
          </div>

          <!-- TEACHER PROFILE PILL -->
          <div class="teacher-header-widget" style="cursor:pointer;" onclick="Auth.openProfileModal(false)" title="Click to view Teacher Profile">
            ${user.avatarUrl ? `<img src="${user.avatarUrl}" alt="${teacherName}" style="width:28px; height:28px; border-radius:50%; object-fit:cover;" />` : `
              <div style="width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg, #3B82F6, #6366F1); color:#fff; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">
                ${teacherName.substring(0, 2).toUpperCase()}
              </div>
            `}
            <span style="font-weight:700; color:var(--text-primary);">${teacherName}</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">▼</span>
          </div>

        </div>
      </div>
    `;
  }

  // ============================================================
  // 2. TEACHER SECTION 1: DASHBOARD
  // ============================================================
  renderDashboard() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const stats = this.getStudentStats();
    const subjects = Storage.getSubjects();
    const interventions = Storage.getInterventions();
    const sortedPerformers = [...stats.students].sort((a, b) => b.avgAccuracy - a.avgAccuracy);
    const highRiskStudents = stats.students.filter(s => s.riskStatus === 'HIGH' || s.riskStatus === 'MEDIUM');

    container.innerHTML = `
      <div class="teacher-dashboard-page fade-in">
        
        <!-- TOP HEADER -->
        ${this.renderTopHeader('Teacher Analytics Overview', 'Dashboard Overview')}

        <!-- KPI SUMMARY CARDS -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:1.15rem; margin-bottom:1.75rem;">
          
          <div class="card card-gradient-border" onclick="TeacherModule.navigate('students')" style="cursor:pointer;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">TOTAL STUDENTS</span>
              <span style="font-size:1.2rem;">👥</span>
            </div>
            <div style="font-size:1.75rem; font-weight:800; color:var(--text-primary); margin-bottom:0.15rem;">
              ${stats.totalCount}
            </div>
            <div style="font-size:0.75rem; color:#10B981; font-weight:600;">100% Active Enrollment</div>
          </div>

          <div class="card card-gradient-border" onclick="TeacherModule.navigate('performance')" style="cursor:pointer;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">AVERAGE ACCURACY</span>
              <span style="font-size:1.2rem;">🎯</span>
            </div>
            <div style="font-size:1.75rem; font-weight:800; color:var(--accent-cyan); margin-bottom:0.15rem;">
              ${stats.classAverage}%
            </div>
            <div style="font-size:0.75rem; color:#10B981; font-weight:600;">↑ 8.4% this evaluation</div>
          </div>

          <div class="card card-gradient-border" onclick="TeacherModule.filterByRisk('MEDIUM')" style="cursor:pointer;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; font-weight:700; color:#F59E0B; text-transform:uppercase;">STUDENTS AT RISK</span>
              <span style="font-size:1.2rem;">⚠️</span>
            </div>
            <div style="font-size:1.75rem; font-weight:800; color:#F59E0B; margin-bottom:0.15rem;">
              ${stats.mediumCount + stats.highCount}
            </div>
            <div style="font-size:0.75rem; color:#F59E0B; font-weight:600;">Requires topic attention</div>
          </div>

          <div class="card card-gradient-border" onclick="TeacherModule.navigate('interventions')" style="cursor:pointer;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.4rem;">
              <span style="font-size:0.75rem; font-weight:700; color:var(--accent-purple); text-transform:uppercase;">ACTIVE INTERVENTIONS</span>
              <span style="font-size:1.2rem;">💡</span>
            </div>
            <div style="font-size:1.75rem; font-weight:800; color:var(--accent-purple); margin-bottom:0.15rem;">
              ${interventions.length || 3}
            </div>
            <div style="font-size:0.75rem; color:var(--accent-purple); font-weight:600;">Prerequisite action plans</div>
          </div>

        </div>

        <!-- CHARTS & TOP PERFORMERS -->
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:1.25rem; margin-bottom:1.75rem;">
          
          <!-- CLASS ACCURACY TREND CHART -->
          <div class="card">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
              <div>
                <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin:0;">📈 Overall Class Performance Trend</h3>
                <p style="font-size:0.75rem; color:var(--text-muted); margin:0.15rem 0 0 0;">Average evaluation accuracy over time</p>
              </div>
              <span class="badge badge-cyan">Semester 3</span>
            </div>

            <div style="background:rgba(13, 17, 28, 0.7); padding:1.25rem; border-radius:12px; border:1px solid rgba(255, 255, 255, 0.08);">
              <div style="display:flex; align-items:flex-end; justify-content:space-between; height:140px; border-bottom:1px solid rgba(255, 255, 255, 0.1); padding-bottom:0.5rem;">
                <div style="display:flex; flex-direction:column; align-items:center; gap:0.35rem; flex:1;">
                  <div style="width:32px; height:75px; background:linear-gradient(180deg, #6366F1, #3B82F6); border-radius:6px 6px 0 0; opacity:0.65;"></div>
                  <span style="font-size:0.725rem; font-weight:700; color:var(--text-muted);">Week 1 (64%)</span>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center; gap:0.35rem; flex:1;">
                  <div style="width:32px; height:90px; background:linear-gradient(180deg, #6366F1, #3B82F6); border-radius:6px 6px 0 0; opacity:0.8;"></div>
                  <span style="font-size:0.725rem; font-weight:700; color:var(--text-muted);">Week 2 (69%)</span>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center; gap:0.35rem; flex:1;">
                  <div style="width:32px; height:65px; background:linear-gradient(180deg, #EF4444, #DC2626); border-radius:6px 6px 0 0;"></div>
                  <span style="font-size:0.725rem; font-weight:700; color:#EF4444;">Week 3 (58%)</span>
                </div>
                <div style="display:flex; flex-direction:column; align-items:center; gap:0.35rem; flex:1;">
                  <div style="width:32px; height:110px; background:linear-gradient(180deg, #10B981, #059669); border-radius:6px 6px 0 0;"></div>
                  <span style="font-size:0.725rem; font-weight:800; color:#10B981;">Current (${stats.classAverage}%)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- TOP PERFORMERS RANKING -->
          <div class="card">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
              <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin:0;">🏆 Top Performing Students</h3>
              <button class="btn btn-link btn-xs" onclick="TeacherModule.navigate('performance')">All Ranks →</button>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.65rem;">
              ${sortedPerformers.slice(0, 3).map((st, i) => `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:0.65rem 0.85rem; background:rgba(13, 17, 28, 0.7); border-radius:10px; border:1px solid rgba(255, 255, 255, 0.08);">
                  <div style="display:flex; align-items:center; gap:0.65rem;">
                    <span style="font-size:1.2rem;">${['🥇', '🥈', '🥉'][i]}</span>
                    <div>
                      <strong style="font-size:0.875rem; color:var(--text-primary);">${st.name}</strong>
                      <div style="font-size:0.725rem; color:var(--text-muted);">${st.id} • ${st.section}</div>
                    </div>
                  </div>
                  <span style="font-size:0.95rem; font-weight:800; color:#10B981;">${st.avgAccuracy}%</span>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

      </div>
    `;
  }

  // ============================================================
  // 3. TEACHER SECTION 2: STUDENTS ROSTER (EXACT MATCH FOR input_file_0.png)
  // ============================================================
  renderStudents() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const stats = this.getStudentStats();

    // Filtering logic
    let filtered = stats.students.filter(s => {
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q) && !s.branch.toLowerCase().includes(q)) return false;
      }
      if (this.currentRiskFilter !== 'ALL' && s.riskStatus !== this.currentRiskFilter) return false;
      return true;
    });

    container.innerHTML = `
      <div class="teacher-students-page fade-in">
        
        <!-- TOP HEADER -->
        ${this.renderTopHeader('Students', 'Students')}

        <!-- TOOLBAR: SEARCH, FILTERS, EXPORT -->
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem;">
          
          <div style="display:flex; align-items:center; gap:0.85rem; flex:1; max-width:600px;">
            <!-- SEARCH INPUT -->
            <div style="position:relative; flex:1;">
              <span style="position:absolute; left:0.85rem; top:50%; transform:translateY(-50%); color:var(--text-muted); font-size:0.9rem;">🔍</span>
              <input type="text" class="form-control" placeholder="Search students..." value="${this.searchQuery}" 
                style="padding-left:2.3rem; background:rgba(22, 28, 45, 0.7); border:1px solid rgba(255, 255, 255, 0.1); border-radius:10px; color:#fff;"
                oninput="TeacherModule.searchQuery = this.value; TeacherModule.renderStudents();" />
            </div>

            <!-- FILTERS DROPDOWN -->
            <select class="form-control form-select" style="width:auto; min-width:140px; background:rgba(22, 28, 45, 0.7); border:1px solid rgba(255, 255, 255, 0.1); border-radius:10px; color:#fff;"
              onchange="TeacherModule.currentRiskFilter = this.value; TeacherModule.renderStudents();">
              <option value="ALL" ${this.currentRiskFilter === 'ALL' ? 'selected' : ''}>⚱️ Filters</option>
              <option value="LOW" ${this.currentRiskFilter === 'LOW' ? 'selected' : ''}>Risk: Low Risk</option>
              <option value="MEDIUM" ${this.currentRiskFilter === 'MEDIUM' ? 'selected' : ''}>Risk: Medium Risk</option>
              <option value="HIGH" ${this.currentRiskFilter === 'HIGH' ? 'selected' : ''}>Risk: High Risk</option>
            </select>
          </div>

          <!-- EXPORT BUTTON -->
          <button class="btn btn-action-purple" onclick="Notifications.toast('Exporting student roster data (CSV)...', 'info')" style="padding:0.55rem 1.25rem !important; border-radius:10px !important;">
            ↓ Export
          </button>
        </div>

        <!-- MAIN TABLE CARD WITH PURPLE-TO-BLUE GRADIENT HEADER -->
        <div class="card" style="padding:0.75rem 1rem; background:rgba(22, 28, 45, 0.6); border:1px solid rgba(255, 255, 255, 0.08); border-radius:16px;">
          <div class="table-responsive">
            <table class="teacher-students-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Branch / Section</th>
                  <th>Overall Accuracy</th>
                  <th>Learning Progress</th>
                  <th>Weak Topic</th>
                  <th>Risk Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.length > 0 ? filtered.map(s => {
                  const initials = this.getInitials(s.name);
                  const riskClass = s.riskStatus === 'HIGH' ? 'risk-pill-high' : s.riskStatus === 'MEDIUM' ? 'risk-pill-medium' : 'risk-pill-low';
                  const scoreColor = s.avgAccuracy >= 80 ? '#10B981' : s.avgAccuracy >= 60 ? '#10B981' : '#EF4444';

                  return `
                    <tr>
                      <!-- STUDENT NAME WITH INITIAL AVATAR -->
                      <td>
                        <div style="display:flex; align-items:center;">
                          <div class="student-avatar-circle" style="background:${s.avatarBg || 'linear-gradient(135deg, #6366F1, #8B5CF6)'};">
                            ${initials}
                          </div>
                          <strong style="color:var(--text-primary); font-size:0.875rem;">${s.name}</strong>
                        </div>
                      </td>

                      <!-- STUDENT ID -->
                      <td><code class="student-id-badge" style="padding:0.2rem 0.45rem; border-radius:6px; font-size:0.775rem;">${s.id}</code></td>

                      <!-- BRANCH / SECTION -->
                      <td>
                        <div style="font-size:0.825rem; font-weight:700; color:var(--text-primary);">${s.branch}</div>
                        <div style="font-size:0.725rem; color:var(--text-muted);">(${s.section})</div>
                      </td>

                      <!-- OVERALL ACCURACY -->
                      <td>
                        <strong style="font-size:0.95rem; color:${scoreColor};">${s.avgAccuracy}%</strong>
                      </td>

                      <!-- LEARNING PROGRESS BAR -->
                      <td>
                        <div style="font-size:0.775rem; font-weight:700; color:var(--text-primary); margin-bottom:0.2rem;">${s.learningProgress}%</div>
                        <div class="progress-track" style="width:110px; height:6px; background:rgba(255, 255, 255, 0.1); border-radius:3px; overflow:hidden;">
                          <div style="width:${s.learningProgress}%; height:100%; background:linear-gradient(90deg, #3B82F6, #06B6D4); border-radius:3px;"></div>
                        </div>
                      </td>

                      <!-- WEAK TOPIC -->
                      <td>
                        <span class="weak-topic-text" style="font-size:0.825rem; font-weight:700; color:var(--text-primary);">
                          ${s.weakTopicName}
                        </span>
                      </td>

                      <!-- RISK STATUS PILL -->
                      <td>
                        <span class="risk-pill ${riskClass}">
                          ${s.riskStatus} RISK
                        </span>
                      </td>

                      <!-- ACTIONS BUTTON GROUP -->
                      <td>
                        <div style="display:flex; align-items:center; gap:0.4rem;">
                          <button class="btn btn-action-ghost" onclick="TeacherModule.openStudentProfileModal('${s.id}')">View Profile</button>
                          <button class="btn btn-action-purple" onclick="TeacherModule.openCreateInterventionModal('${s.id}')">Intervene</button>
                          <button class="btn btn-action-blue" onclick="TeacherModule.openPushQuestionModal('${s.id}')">Push Q</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('') : `
                  <tr>
                    <td colspan="8" style="text-align:center; padding:2rem; color:var(--text-muted);">
                      No matching students found for search criteria.
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>

          <!-- FOOTER PAGINATION BAR (MATCHING input_file_0.png) -->
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; padding:0.85rem 0.5rem 0.25rem 0.5rem; font-size:0.8rem; color:var(--text-muted);">
            <div>Showing 1 to ${filtered.length} of ${stats.totalCount} students</div>

            <div style="display:flex; align-items:center; gap:1.25rem;">
              <div style="display:flex; align-items:center; gap:0.35rem;">
                <button class="btn btn-action-ghost" style="padding:0.2rem 0.5rem !important;">&lt;</button>
                <button class="btn btn-action-purple" style="padding:0.2rem 0.55rem !important; border-radius:6px !important;">1</button>
                <button class="btn btn-action-ghost" style="padding:0.2rem 0.5rem !important;">&gt;</button>
              </div>

              <div style="display:flex; align-items:center; gap:0.4rem;">
                <span>Rows per page:</span>
                <select class="form-control form-select" style="width:auto; padding:0.2rem 0.5rem; background:rgba(22, 28, 45, 0.7); border:1px solid rgba(255, 255, 255, 0.1); border-radius:6px; color:#fff; font-size:0.775rem;">
                  <option value="25">25 ▼</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>

        </div>

      </div>
    `;
  }

  filterByRisk(riskLevel) {
    this.currentRiskFilter = riskLevel || 'ALL';
    this.navigate('students');
  }

  // ============================================================
  // 4. TEACHER SECTION 3: CLASSES & SUBJECTS
  // ============================================================
  renderClasses() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const subjects = Storage.getSubjects();

    container.innerHTML = `
      <div class="teacher-classes-page fade-in">
        ${this.renderTopHeader('Classes & Course Subjects', 'Classes & Subjects')}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin:0;">🏫 Class Sections</h3>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-action-ghost" onclick="TeacherModule.openAddClassModal()">+ Add Class</button>
            <button class="btn btn-action-purple" onclick="TeacherModule.openAddSubjectModal()">+ Add Subject</button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem; margin-bottom:2rem;">
          <div class="card card-gradient-border">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span class="badge badge-cyan">Sec-A</span>
              <span style="font-size:0.8rem; color:#10B981; font-weight:700;">15 Students</span>
            </div>
            <h4 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-bottom:0.25rem;">B.Tech CSE — Semester 3</h4>
            <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">Computer Science & Engineering</p>
            <button class="btn btn-action-ghost w-full" onclick="TeacherModule.navigate('students')">View Students</button>
          </div>

          <div class="card card-gradient-border">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span class="badge badge-purple">Sec-B</span>
              <span style="font-size:0.8rem; color:#10B981; font-weight:700;">12 Students</span>
            </div>
            <h4 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-bottom:0.25rem;">B.Tech CSE — Semester 3</h4>
            <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">Computer Science & Engineering</p>
            <button class="btn btn-action-ghost w-full" onclick="TeacherModule.navigate('students')">View Students</button>
          </div>
        </div>

        <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-bottom:1rem;">📘 Course Curriculum Subjects (${subjects.length})</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;">
          ${subjects.map(s => `
            <div class="card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <span class="badge badge-cyan">${s.code || 'CS301'}</span>
                <span style="font-size:0.75rem; color:var(--text-muted);">${s.semester || 'Semester 3'}</span>
              </div>
              <h4 style="font-size:1.05rem; font-weight:800; color:var(--text-primary); margin-bottom:0.35rem;">${s.name}</h4>
              <p style="font-size:0.825rem; color:var(--text-secondary); margin-bottom:1rem;">${s.description || 'Core academic curriculum module.'}</p>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  // ============================================================
  // 5. TEACHER SECTION 4: STUDENT PERFORMANCE
  // ============================================================
  renderPerformance() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const stats = this.getStudentStats();
    const sorted = [...stats.students].sort((a, b) => b.avgAccuracy - a.avgAccuracy);

    container.innerHTML = `
      <div class="teacher-performance-page fade-in">
        ${this.renderTopHeader('Student Performance', 'Student Performance')}

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1.15rem; margin-bottom:1.75rem;">
          <div class="card card-gradient-border">
            <div style="font-size:0.75rem; font-weight:700; color:#F59E0B; text-transform:uppercase;">🏆 1st Ranker</div>
            <div style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin:0.25rem 0;">${sorted[0]?.name || 'Kavya Sharma'}</div>
            <div style="font-size:0.85rem; color:#10B981; font-weight:700;">${sorted[0]?.avgAccuracy || 94}% Overall Accuracy</div>
          </div>
          <div class="card card-gradient-border">
            <div style="font-size:0.75rem; font-weight:700; color:var(--accent-cyan); text-transform:uppercase;">🥈 2nd Ranker</div>
            <div style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin:0.25rem 0;">${sorted[1]?.name || 'Neha Kumari'}</div>
            <div style="font-size:0.85rem; color:var(--accent-cyan); font-weight:700;">${sorted[1]?.avgAccuracy || 91}% Overall Accuracy</div>
          </div>
          <div class="card card-gradient-border">
            <div style="font-size:0.75rem; font-weight:700; color:var(--accent-purple); text-transform:uppercase;">🥉 3rd Ranker</div>
            <div style="font-size:1.25rem; font-weight:800; color:var(--text-primary); margin:0.25rem 0;">${sorted[2]?.name || 'Arjun Yadav'}</div>
            <div style="font-size:0.85rem; color:var(--accent-purple); font-weight:700;">${sorted[2]?.avgAccuracy || 88}% Overall Accuracy</div>
          </div>
        </div>

        <div class="card">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-bottom:1rem;">📊 Full Class Diagnostic Roster</h3>
          <div class="table-responsive">
            <table class="teacher-students-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Accuracy</th>
                  <th>Progress</th>
                  <th>Risk Status</th>
                </tr>
              </thead>
              <tbody>
                ${sorted.map((s, i) => `
                  <tr>
                    <td><strong>#${i + 1}</strong></td>
                    <td><strong>${s.name}</strong></td>
                    <td><code>${s.id}</code></td>
                    <td><strong style="color:${s.avgAccuracy >= 80 ? '#10B981' : s.avgAccuracy >= 60 ? '#10B981' : '#EF4444'};">${s.avgAccuracy}%</strong></td>
                    <td>${s.learningProgress}%</td>
                    <td><span class="risk-pill ${s.riskStatus === 'HIGH' ? 'risk-pill-high' : s.riskStatus === 'MEDIUM' ? 'risk-pill-medium' : 'risk-pill-low'}">${s.riskStatus} RISK</span></td>
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
  // 6. TEACHER SECTION 5: WEAK TOPICS
  // ============================================================
  renderWeakTopics() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const topics = [
      { name: 'Binary Search Trees', subject: 'Data Structures', affected: 4, avgAcc: 42, priority: 'HIGH', students: ['Rohan Sharma', 'TILLU', 'ASHISH', 'Aarav Sharma'] },
      { name: 'DBMS Normalization', subject: 'Database Management', affected: 2, avgAcc: 58, priority: 'MEDIUM', students: ['Rahul Meena', 'Rohan Gupta'] },
      { name: 'Recursion & Dynamic Programming', subject: 'Algorithms', affected: 3, avgAcc: 48, priority: 'HIGH', students: ['Rohan Gupta', 'Aarav Sharma', 'TILLU'] }
    ];

    container.innerHTML = `
      <div class="teacher-topics-page fade-in">
        ${this.renderTopHeader('Weak Topics', 'Weak Topics')}

        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          ${topics.map(t => `
            <div class="card card-gradient-border">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                <div>
                  <span class="badge ${t.priority === 'HIGH' ? 'badge-high' : 'badge-medium'}">${t.priority} PRIORITY</span>
                  <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-primary); margin:0.35rem 0 0 0;">${t.name}</h3>
                </div>
                <div style="text-align:right;">
                  <div style="font-size:1.5rem; font-weight:800; color:${t.avgAcc < 50 ? '#EF4444' : '#F59E0B'};">${t.avgAcc}%</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Avg Accuracy</div>
                </div>
              </div>

              <div style="background:rgba(13, 17, 28, 0.7); padding:0.85rem; border-radius:10px; margin-bottom:1rem;">
                <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.35rem;">Struggling Students (${t.affected})</div>
                <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
                  ${t.students.map(st => `<span class="badge badge-secondary">👤 ${st}</span>`).join('')}
                </div>
              </div>

              <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
                <button class="btn btn-action-purple" onclick="TeacherModule.openPushQuestionModal()">🚀 Push Quiz</button>
                <button class="btn btn-action-blue" onclick="TeacherModule.openCreateInterventionModal()">⚡ Intervene</button>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  // ============================================================
  // 7. TEACHER SECTION 6: INTERVENTIONS
  // ============================================================
  renderInterventions() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const list = Storage.getInterventions();

    container.innerHTML = `
      <div class="teacher-interventions-page fade-in">
        ${this.renderTopHeader('Interventions', 'Interventions')}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin:0;">💡 Active Prerequisite Interventions</h3>
          <button class="btn btn-action-purple" onclick="TeacherModule.openCreateInterventionModal()">+ Create Intervention</button>
        </div>

        <div class="card">
          <div class="table-responsive">
            <table class="teacher-students-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Topic Focus</th>
                  <th>Teacher Remedial Note</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${list.length > 0 ? list.map(item => `
                  <tr>
                    <td><code>${item.studentId || 'ECB0245'}</code></td>
                    <td><strong>${item.topicName || 'Binary Search Trees'}</strong></td>
                    <td>${item.note || 'Review prerequisite trees.'}</td>
                    <td><span class="risk-pill ${item.status === 'Completed' ? 'risk-pill-low' : 'risk-pill-high'}">${item.status || 'Active'}</span></td>
                    <td>
                      <button class="btn btn-action-ghost" onclick="TeacherModule.toggleInterventionStatus('${item.id}')">${item.status === 'Completed' ? 'Reopen' : 'Complete'}</button>
                    </td>
                  </tr>
                `).join('') : `
                  <tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--text-muted);">No active interventions created yet.</td></tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  // ============================================================
  // 8. TEACHER SECTION 7: QUIZ MANAGEMENT
  // ============================================================
  renderQuizzes() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const questions = Storage.getQuestions();

    container.innerHTML = `
      <div class="teacher-quizzes-page fade-in">
        ${this.renderTopHeader('Quiz Management', 'Quiz Management')}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin:0;">📝 Question Bank Repository (${questions.length})</h3>
          <div style="display:flex; gap:0.5rem;">
            <button class="btn btn-action-ghost" onclick="TeacherModule.openAddQuestionModal()">+ Add Question</button>
            <button class="btn btn-action-purple" onclick="TeacherModule.openPushQuestionModal()">🚀 Push Question</button>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:1rem;">
          ${questions.map((q, idx) => `
            <div class="card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <span class="badge badge-cyan">${q.subjectId || 'SUB_DBMS'}</span>
                <button class="btn btn-danger-outline btn-xs" onclick="TeacherModule.deleteQuestion('${q.id}')">Delete</button>
              </div>
              <h4 style="font-size:0.975rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">Q${idx + 1}: ${q.question}</h4>
            </div>
          `).join('')}
        </div>

      </div>
    `;
  }

  // ============================================================
  // 9. TEACHER SECTION 8: NOTIFICATIONS
  // ============================================================
  renderNotifications() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="teacher-notifications-page fade-in">
        ${this.renderTopHeader('Notifications', 'Notifications')}

        <div style="display:flex; flex-direction:column; gap:0.85rem;">
          ${this.notifications.map(n => `
            <div class="card" style="padding:1rem 1.25rem;">
              <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                <strong style="color:var(--text-primary);">${n.title}</strong>
                <span style="font-size:0.75rem; color:var(--text-muted);">${n.time}</span>
              </div>
              <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">${n.message}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ============================================================
  // 10. TEACHER SECTION 9: SETTINGS
  // ============================================================
  renderSettings() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const user = Auth.getCurrentUser() || { name: 'Mr. Ashish', email: 'teacher@edunexus.edu', id: 'ECB1234', branch: 'Computer Science Dept.' };

    container.innerHTML = `
      <div class="teacher-settings-page fade-in" style="max-width:820px; margin:0 auto;">
        ${this.renderTopHeader('Settings', 'Settings')}

        <div class="card card-gradient-border" style="margin-bottom:1.5rem;">
          <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:1rem;">👤 INSTRUCTOR PROFILE</h3>
          <form onsubmit="event.preventDefault(); TeacherModule.saveProfile();">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem;">
              <div>
                <label class="form-label">Full Name</label>
                <input type="text" id="t-setting-name" class="form-control" value="${user.name || 'Mr. Ashish'}" required />
              </div>
              <div>
                <label class="form-label">Teacher ID</label>
                <input type="text" class="form-control" value="${user.id || 'ECB1234'}" disabled style="opacity:0.7;" />
              </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem;">
              <div>
                <label class="form-label">Email</label>
                <input type="email" id="t-setting-email" class="form-control" value="${user.email || 'teacher@edunexus.edu'}" required />
              </div>
              <div>
                <label class="form-label">Department</label>
                <input type="text" id="t-setting-branch" class="form-control" value="${user.branch || 'Computer Science Dept.'}" />
              </div>
            </div>
            <button type="submit" class="btn btn-action-purple">Save Instructor Profile</button>
          </form>
        </div>

        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <strong style="color:var(--text-primary);">Log Out Session</strong>
              <div style="font-size:0.8rem; color:var(--text-muted);">End active instructor session</div>
            </div>
            <button class="btn btn-danger btn-sm" onclick="Auth.confirmLogout()">Log Out</button>
          </div>
        </div>

      </div>
    `;
  }

  saveProfile() {
    const user = Auth.getCurrentUser();
    if (!user) return;
    const name = document.getElementById('t-setting-name')?.value?.trim();
    const email = document.getElementById('t-setting-email')?.value?.trim();
    const branch = document.getElementById('t-setting-branch')?.value?.trim();

    Storage.updateUserProfile(user.id, { name, email, branch });
    Notifications.toast('✓ Instructor Profile updated', 'success');
    this.renderSettings();
  }

  // Modals (Intervention, Push Question, Class, Subject, Question)
  openCreateInterventionModal(targetStudentId = 'STU-1009') {
    const body = `
      <form onsubmit="event.preventDefault(); TeacherModule.submitCreateIntervention();">
        <div class="form-group"><label class="form-label">Student ID</label><input type="text" id="int-student-id" class="form-control" value="${targetStudentId}" required /></div>
        <div class="form-group"><label class="form-label">Weak Topic</label><input type="text" id="int-topic" class="form-control" value="Binary Search Trees" required /></div>
        <div class="form-group"><label class="form-label">Remedial Note</label><textarea id="int-note" class="form-control" rows="3" required>Assigned diagnostic tree traversal practice activity.</textarea></div>
        <button type="submit" class="btn btn-action-purple w-full">Create Intervention →</button>
      </form>
    `;
    Notifications.openModal('Create Early Intervention', body, null);
  }

  submitCreateIntervention() {
    const studentId = document.getElementById('int-student-id').value.trim();
    const topic = document.getElementById('int-topic').value;
    const note = document.getElementById('int-note').value;
    const db = Storage.getDb();
    if (!db.interventions) db.interventions = [];
    db.interventions.push({ id: 'INT_' + Date.now(), studentId, topicName: topic, note, status: 'Active' });
    Storage.saveDb(db);
    Notifications.closeModal();
    Notifications.toast(`✓ Intervention created for ${studentId}`, 'success');
    if (this.currentSection === 'interventions') this.renderInterventions();
  }

  toggleInterventionStatus(id) {
    const list = Storage.getInterventions();
    const item = list.find(x => x.id === id);
    if (item) {
      Storage.updateInterventionStatus(id, item.status === 'Active' ? 'Completed' : 'Active');
      Notifications.toast('Status updated', 'success');
      if (this.currentSection === 'interventions') this.renderInterventions();
    }
  }

  openPushQuestionModal(targetStudentId = 'STU-1009') {
    const body = `
      <form onsubmit="event.preventDefault(); TeacherModule.submitPushQuestion();">
        <div class="form-group"><label class="form-label">Target Student ID</label><input type="text" id="push-student-id" class="form-control" value="${targetStudentId}" required /></div>
        <div class="form-group"><label class="form-label">Subject</label><input type="text" id="push-subject" class="form-control" value="Data Structures" required /></div>
        <div class="form-group"><label class="form-label">Topic</label><input type="text" id="push-topic" class="form-control" value="Binary Search Trees" required /></div>
        <div class="form-group"><label class="form-label">Question Text</label><textarea id="push-text" class="form-control" rows="3" required>What is the worst-case time complexity of searching in an unbalanced BST?</textarea></div>
        <button type="submit" class="btn btn-action-blue w-full">🚀 Push Question to Student →</button>
      </form>
    `;
    Notifications.openModal('Push Question to Specific Student', body, null);
  }

  submitPushQuestion() {
    const studentId = document.getElementById('push-student-id').value.trim();
    const subject = document.getElementById('push-subject').value;
    const topic = document.getElementById('push-topic').value;
    const text = document.getElementById('push-text').value;

    Storage.addPushQuestion({ studentId, subjectName: subject, topicName: topic, questionText: text });
    Notifications.closeModal();
    Notifications.toast(`✓ Question pushed to Student ${studentId}`, 'success');
  }

  openStudentProfileModal(studentId = 'STU-1009') {
    const stats = this.getStudentStats();
    const s = stats.students.find(x => x.id === studentId) || { name: 'Kavya Sharma', id: 'STU-1009', avgAccuracy: 94, learningProgress: 100, riskStatus: 'LOW', weakTopicName: 'None' };

    const body = `
      <div>
        <div style="display:flex; align-items:center; gap:0.85rem; margin-bottom:1.25rem;">
          <div class="student-avatar-circle" style="width:48px; height:48px; font-size:1.1rem; background:linear-gradient(135deg, #6366F1, #8B5CF6);">
            ${this.getInitials(s.name)}
          </div>
          <div>
            <h3 style="font-size:1.2rem; font-weight:800; color:var(--text-primary); margin:0;">${s.name}</h3>
            <div style="font-size:0.8rem; color:var(--text-muted);">ID: <code>${s.id}</code> • ${s.branch} (${s.section})</div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem;">
          <div style="background:rgba(13, 17, 28, 0.7); padding:0.75rem; border-radius:8px; text-align:center;">
            <div style="font-size:0.7rem; color:var(--text-muted);">Overall Accuracy</div>
            <div style="font-size:1.25rem; font-weight:800; color:#10B981;">${s.avgAccuracy}%</div>
          </div>
          <div style="background:rgba(13, 17, 28, 0.7); padding:0.75rem; border-radius:8px; text-align:center;">
            <div style="font-size:0.7rem; color:var(--text-muted);">Learning Progress</div>
            <div style="font-size:1.25rem; font-weight:800; color:var(--accent-cyan);">${s.learningProgress}%</div>
          </div>
        </div>

        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-action-purple style="flex:1;" onclick="Notifications.closeModal(); TeacherModule.openCreateInterventionModal('${s.id}');">Intervene</button>
          <button class="btn btn-action-blue style="flex:1;" onclick="Notifications.closeModal(); TeacherModule.openPushQuestionModal('${s.id}');">Push Question</button>
        </div>
      </div>
    `;
    Notifications.openModal(`Student Profile — ${s.name}`, body, null);
  }

  openAddClassModal() {
    const body = `<form onsubmit="event.preventDefault(); Notifications.closeModal(); Notifications.toast('Class Section added', 'success');"><div class="form-group"><label class="form-label">Class Name</label><input class="form-control" placeholder="e.g. B.Tech CSE" required /></div><button type="submit" class="btn btn-action-purple w-full">Add Class →</button></form>`;
    Notifications.openModal('Add Class Section', body, null);
  }

  openAddSubjectModal() {
    const body = `<form onsubmit="event.preventDefault(); Notifications.closeModal(); Notifications.toast('Course Subject added', 'success');"><div class="form-group"><label class="form-label">Subject Name</label><input class="form-control" placeholder="e.g. Artificial Intelligence" required /></div><button type="submit" class="btn btn-action-purple w-full">Add Subject →</button></form>`;
    Notifications.openModal('Add Subject', body, null);
  }

  openAddQuestionModal() {
    const body = `<form onsubmit="event.preventDefault(); Notifications.closeModal(); Notifications.toast('Question saved to Bank', 'success');"><div class="form-group"><label class="form-label">Question</label><input class="form-control" placeholder="Enter question..." required /></div><button type="submit" class="btn btn-action-purple w-full">Save Question →</button></form>`;
    Notifications.openModal('Add Question to Bank', body, null);
  }

  deleteQuestion(id) {
    Storage.deleteQuestion(id);
    Notifications.toast('Question deleted', 'info');
    this.renderQuizzes();
  }
}

// Global Export
const TeacherModule = new TeacherModuleController();
window.TeacherModule = TeacherModule;
window.TeacherView = TeacherModule;
