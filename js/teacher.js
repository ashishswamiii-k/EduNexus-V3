/* ============================================================
   EDUNEXUS — TEACHER DASHBOARD & INTERVENTION CONTROLLER
   ============================================================ */

class TeacherViewController {
  constructor() {}

  renderDashboard(container) {
    const users = Storage.getUsers().filter(u => u.role === 'student');
    const teacher = Auth.getCurrentUser();

    let html = `
      <div class="animate-fade-in">
        <!-- Overview Stats -->
        <div class="stats-grid">
          <div class="card stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <span class="stat-value">${users.length}</span>
              <span class="stat-label">Total Assigned Students</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <span class="stat-value">72%</span>
              <span class="stat-label">Class Average Score</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
              <span class="stat-value">18</span>
              <span class="stat-label">Students Improving</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon" style="background: rgba(239, 68, 68, 0.12); color: var(--accent-rose);">⚠</div>
            <div class="stat-content">
              <span class="stat-value" style="color: #F87171;">1</span>
              <span class="stat-label">High Risk (Needs Intervention)</span>
            </div>
          </div>
        </div>

        <!-- Roster Controls & Filters -->
        <div class="card" style="margin-bottom: 1.5rem;">
          <div class="flex justify-between items-center gap-4 flex-wrap">
            <h3 style="font-size: 1.15rem; font-weight: 700;">Student Performance Roster</h3>
            <div class="flex items-center gap-3">
              <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="teacher-student-search" class="form-control" placeholder="Search student name or ID..." onkeyup="TeacherView.filterRoster()">
              </div>
              <select id="teacher-risk-filter" class="form-control form-select" style="max-width: 160px;" onchange="TeacherView.filterRoster()">
                <option value="ALL">All Risk Levels</option>
                <option value="HIGH">High Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="LOW">Low Risk</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Student Roster Data Table -->
        <div class="card p-0" style="padding: 0; overflow: hidden;">
          <div class="table-responsive">
            <table class="data-table" id="teacher-roster-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>ID</th>
                  <th>Class</th>
                  <th>Average Score</th>
                  <th>Weak Topic</th>
                  <th>AI Risk Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
    `;

    users.forEach(student => {
      const analysis = AIEngine.analyzeStudent(student.id);
      const weakTopicName = analysis.weakTopics.length > 0 ? analysis.weakTopics[0].topicName : 'None';
      
      let badge = `<span class="badge badge-low">LOW</span>`;
      if (analysis.riskLevel === 'HIGH') badge = `<span class="badge badge-high">HIGH</span>`;
      if (analysis.riskLevel === 'MEDIUM') badge = `<span class="badge badge-medium">MEDIUM</span>`;

      html += `
        <tr data-student-id="${student.id}" data-name="${student.name.toLowerCase()}" data-risk="${analysis.riskLevel}">
          <td><strong style="color: var(--text-primary);">${student.name}</strong></td>
          <td><code>${student.id}</code></td>
          <td>${student.classId || '10-A'}</td>
          <td><span class="font-bold">${analysis.overallAccuracy}%</span></td>
          <td>${weakTopicName !== 'None' ? `<span style="color: #F87171;">${weakTopicName}</span>` : '<span style="color: #34D399;">Mastered</span>'}</td>
          <td>${badge}</td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="TeacherView.openStudentProfileModal('${student.id}')">View Profile & AI Insights</button>
          </td>
        </tr>
      `;
    });

    html += `
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  filterRoster() {
    const searchVal = document.getElementById('teacher-student-search')?.value.toLowerCase() || '';
    const riskVal = document.getElementById('teacher-risk-filter')?.value || 'ALL';
    const rows = document.querySelectorAll('#teacher-roster-table tbody tr');

    rows.forEach(row => {
      const name = row.getAttribute('data-name');
      const id = row.getAttribute('data-student-id').toLowerCase();
      const risk = row.getAttribute('data-risk');

      const matchesSearch = name.includes(searchVal) || id.includes(searchVal);
      const matchesRisk = riskVal === 'ALL' || risk === riskVal;

      if (matchesSearch && matchesRisk) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  openStudentProfileModal(studentId) {
    const student = Storage.getUserById(studentId);
    if (!student) return;

    const analysis = AIEngine.analyzeStudent(studentId);
    const performances = Storage.getPerformance(studentId);

    let perfHtml = '';
    performances.forEach(p => {
      perfHtml += `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
          <span style="font-weight: 600;">${p.topicName}</span>
          <span class="${p.accuracy < 50 ? 'text-danger' : 'text-cyan'} font-bold">${p.accuracy}%</span>
        </div>
      `;
    });

    const body = `
      <div style="display: flex; flex-direction: column; gap: 1.2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 700;">${student.name}</h3>
            <p class="text-xs text-secondary">Student ID: ${student.id} • Class: ${student.classId}</p>
          </div>
          <span class="badge badge-${analysis.riskLevel.toLowerCase()}">${analysis.riskLevel} RISK</span>
        </div>

        <div style="padding: 1rem; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md);">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: #F87171; margin-bottom: 0.35rem;">✦ AI Early Intervention Analysis</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary);">${analysis.riskReason}</p>
        </div>

        <div>
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;">Topic Accuracy Breakdown</h4>
          ${perfHtml}
        </div>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="Notifications.closeModal()">Close</button>
      <button class="btn btn-primary" onclick="TeacherView.openCreateInterventionModal('${student.id}')">⚡ CREATE INTERVENTION</button>
    `;

    Notifications.openModal(`Student Performance Profile`, body, footer);
  }

  openCreateInterventionModal(studentId) {
    const student = Storage.getUserById(studentId);
    if (!student) return;

    const topics = Storage.getTopics();

    let topicOptionsHtml = '';
    topics.forEach(t => {
      topicOptionsHtml += `<option value="${t.id}">${t.name}</option>`;
    });

    const body = `
      <form id="create-intervention-form" onsubmit="event.preventDefault(); TeacherView.submitIntervention('${studentId}');">
        <div class="form-group">
          <label class="form-label">Student</label>
          <input type="text" class="form-control" value="${student.name} (${student.id})" disabled>
        </div>

        <div class="form-group">
          <label class="form-label">Target Weak Topic</label>
          <select id="int-topic-id" class="form-control form-select">
            ${topicOptionsHtml}
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Intervention Action Type</label>
          <select id="int-type" class="form-control form-select">
            <option value="Revision">Targeted Prerequisite Revision</option>
            <option value="Practice">Adaptive Practice Set</option>
            <option value="Extra Quiz">Remedial Quiz Assessment</option>
            <option value="Teacher Guidance">1-on-1 Teacher Consultation</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Teacher Instructions / Guidance Note</label>
          <textarea id="int-note" class="form-control" rows="3" placeholder="Provide clear guidance for the student..." required>Please review Factorization fundamentals before re-attempting Quadratic Equations.</textarea>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="Notifications.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="document.getElementById('create-intervention-form').dispatchEvent(new Event('submit'))">Assign Intervention</button>
    `;

    Notifications.openModal(`Assign Early Intervention`, body, footer);
  }

  submitIntervention(studentId) {
    const topicId = document.getElementById('int-topic-id').value;
    const type = document.getElementById('int-type').value;
    const note = document.getElementById('int-note').value;
    const teacher = Auth.getCurrentUser();
    const topic = Storage.getTopics().find(t => t.id === topicId);

    const intervention = {
      id: 'INT_' + Date.now(),
      studentId,
      teacherId: teacher ? teacher.id : 'ECB1234',
      teacherName: teacher ? teacher.name : 'Demo Teacher',
      topicId,
      topicName: topic ? topic.name : 'Target Topic',
      type,
      note,
      createdAt: new Date().toISOString(),
      status: 'Active'
    };

    Storage.addIntervention(intervention);
    Notifications.closeModal();
    Notifications.toast(`Intervention assigned to student successfully!`, 'success');
  }
}

const TeacherView = new TeacherViewController();
window.TeacherView = TeacherView;
