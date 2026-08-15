/* ============================================================
   EDUNEXUS — TEACHER DASHBOARD & EARLY INTERVENTION CONTROLLER
   ============================================================ */

class TeacherViewController {
  constructor() {}

  renderDashboard(container) {
    const user = Auth.getCurrentUser();
    const teacherName = user ? user.name : 'Dr. R.K. Mehta';

    let html = `
      <div class="stagger-section stagger-1">
        <!-- HEADER -->
        <div style="margin-bottom: 1.75rem;">
          <h2 style="font-size: 1.6rem; font-weight: 800;">Student Performance & Early Intervention Overview</h2>
          <p class="text-sm text-secondary">Academic Performance & AI Early Intervention Hub • Instructor: ${teacherName}</p>
        </div>

        <!-- STAT CARDS -->
        <div class="stats-grid" style="margin-bottom: 2rem;">
          <div class="card stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <span class="stat-value">74%</span>
              <span class="stat-label">Class Average Score</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">👨‍🎓</div>
            <div class="stat-content">
              <span class="stat-value">62</span>
              <span class="stat-label">Enrolled Students</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon" style="background: rgba(239, 68, 68, 0.12); color: #F87171;">⚠️</div>
            <div class="stat-content">
              <span class="stat-value text-danger">8</span>
              <span class="stat-label">Needing Attention</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">📉</div>
            <div class="stat-content">
              <span class="stat-value" style="font-size: 1.1rem; font-weight: 700; color: var(--accent-amber);">DBMS Normalization</span>
              <span class="stat-label">Weakest Topic</span>
            </div>
          </div>
        </div>

        <!-- AI EARLY INTERVENTION CARD -->
        <div class="card card-gradient-border" style="margin-bottom: 2rem;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span class="badge badge-cyan"><span class="ai-sparkle-icon">✦</span> AI EARLY INTERVENTION ALERT</span>
              </div>
              <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.4rem;">
                8 students are struggling with DBMS Normalization (2NF & 3NF).
              </h3>
              <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 650px;">
                Suggested Action: Conduct a targeted revision on functional dependency and 2NF partial dependency rules before introducing 3NF/BCNF.
              </p>
            </div>
            <button class="btn btn-primary" onclick="TeacherView.openCreateInterventionModal()">
              Create Intervention &rarr;
            </button>
          </div>
        </div>

        <!-- STUDENT RISK ROSTER TABLE -->
        <div class="card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="font-size: 1.1rem; font-weight: 700;">Student Academic Risk Roster</h3>
            <div class="search-box">
              <input type="text" class="form-control" placeholder="Search student name or ID..." onkeyup="TeacherView.filterRoster(this.value)">
            </div>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Academic Score</th>
                  <th>Weak Topic</th>
                  <th>Risk Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="teacher-roster-tbody">
                <tr>
                  <td><strong>${(Storage.getUserById('ECB0245') || Storage.getUserById('0245') || { name: 'ASHISH' }).name}</strong></td>
                  <td>ECB0245</td>
                  <td><span class="text-danger font-bold">48%</span></td>
                  <td>DBMS Normalization</td>
                  <td><span class="badge badge-high">HIGH RISK</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="TeacherView.openStudentProfileModal('ECB0245')">Profile</button>
                    <button class="btn btn-primary btn-sm" onclick="TeacherView.openCreateInterventionModal('ECB0245')">Intervene</button>
                  </td>
                </tr>
                <tr>
                  <td><strong>Rohan Sharma</strong></td>
                  <td>ECB0246</td>
                  <td><span class="text-warning font-bold">58%</span></td>
                  <td>CPU Scheduling</td>
                  <td><span class="badge badge-medium">MEDIUM RISK</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="TeacherView.openStudentProfileModal('ECB0246')">Profile</button>
                    <button class="btn btn-outline btn-sm" onclick="TeacherView.openCreateInterventionModal('ECB0246')">Intervene</button>
                  </td>
                </tr>
                <tr>
                  <td><strong>Priya Patel</strong></td>
                  <td>ECB0247</td>
                  <td><span class="text-cyan font-bold">81%</span></td>
                  <td>None</td>
                  <td><span class="badge badge-low">LOW RISK</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="TeacherView.openStudentProfileModal('ECB0247')">Profile</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  openStudentProfileModal(studentId) {
    const user = Storage.getUserById(studentId);
    const nexa = window.AIEngine ? AIEngine.getNexaAIInsightForStudent(studentId) : null;
    const riskBadgeClass = nexa ? (nexa.riskLevel === 'HIGH' ? 'badge-high' : nexa.riskLevel === 'MEDIUM' ? 'badge-medium' : 'badge-low') : 'badge-secondary';
    const riskColor = nexa ? (nexa.riskLevel === 'HIGH' ? '#EF4444' : nexa.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981') : '#06B6D4';

    const body = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; align-items: center; justify-content:space-between; flex-wrap:wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="user-avatar" style="width: 50px; height: 50px; font-size: 1.2rem;">${user ? user.name.charAt(0) : 'S'}</div>
            <div>
              <h4 style="font-weight: 700; font-size: 1.1rem; color:var(--text-primary);">${user ? user.name : 'Student'}</h4>
              <p class="text-xs text-secondary">ID: ${studentId} • Course: ${user ? user.branch : 'Computer Science'}</p>
            </div>
          </div>
          ${nexa ? `<span class="badge ${riskBadgeClass}" style="font-size:0.8rem; font-weight:800;">${nexa.riskLevel} RISK</span>` : ''}
        </div>

        <!-- NEXAAI LEARNING INTELLIGENCE DIAGNOSTIC CARD -->
        <div class="card card-gradient-border" style="padding: 1rem; background: var(--bg-tertiary); border-left:4px solid ${riskColor};">
          <div style="display:flex; align-items:center; gap:0.4rem; margin-bottom:0.6rem;">
            <span style="color:var(--accent-cyan);">✦</span>
            <h5 style="font-size: 0.95rem; font-weight: 800; color:var(--text-primary); margin:0;">
              NexaAI Learning Intelligence Breakdown
            </h5>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:0.85rem; font-size:0.8rem;">
            <div style="background:var(--bg-primary); padding:0.6rem 0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
              <div style="color:var(--text-muted); font-size:0.7rem; font-weight:700; text-transform:uppercase;">Weak Topic</div>
              <div style="font-weight:700; color:var(--text-primary); margin-top:0.15rem;">
                ${nexa && nexa.weakTopic ? nexa.weakTopic.name : 'None Identified'}
              </div>
            </div>

            <div style="background:var(--bg-primary); padding:0.6rem 0.75rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
              <div style="color:var(--text-muted); font-size:0.7rem; font-weight:700; text-transform:uppercase;">Prerequisite Gap</div>
              <div style="font-weight:700; color:var(--text-primary); margin-top:0.15rem;">
                ${nexa && nexa.prerequisiteGap ? nexa.prerequisiteGap.name : 'None Detected'}
              </div>
            </div>
          </div>

          <p class="text-xs text-secondary" style="line-height:1.5; margin-bottom:0.75rem;">
            ${nexa ? nexa.explanation : 'No active prerequisite diagnostic alerts.'}
          </p>

          <div style="font-size:0.8rem; font-weight:700; color:var(--text-primary); margin-bottom:0.85rem;">
            Suggested Intervention: <span style="color:var(--accent-cyan);">${nexa ? nexa.recommendedAction : 'Regular course progress'}</span>
          </div>

          <button class="btn btn-primary btn-sm w-full" onclick="Notifications.closeModal(); TeacherView.openCreateInterventionModal('${studentId}');">
            ⚡ Create Early Intervention →
          </button>
        </div>
      </div>
    `;
    Notifications.openModal('Student Profile & NexaAI Diagnostic', body, `<button class="btn btn-secondary" onclick="Notifications.closeModal()">Close</button>`);
  }

  openCreateInterventionModal(studentId = 'ECB0245') {
    const body = `
      <form id="intervention-form" onsubmit="event.preventDefault(); TeacherView.submitIntervention('${studentId}');">
        <div class="form-group">
          <label class="form-label">Target Student ID</label>
          <input type="text" class="form-control" value="${studentId}" readonly>
        </div>
        <div class="form-group">
          <label class="form-label">Weak Topic</label>
          <select id="int-topic" class="form-control form-select">
            <option value="TOP_DBMS_NORM">DBMS Normalization</option>
            <option value="TOP_OS_SCHED">CPU Scheduling Algorithms</option>
            <option value="TOP_DS_BST">Binary Search Trees & AVL Trees</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Intervention Guidance / Recommendation</label>
          <textarea id="int-note" class="form-control" rows="3" required>Please revise Relational Algebra partial dependency rules before taking the DBMS 2NF diagnostic quiz.</textarea>
        </div>
        <button type="submit" class="btn btn-primary w-full">Send Intervention Alert</button>
      </form>
    `;
    Notifications.openModal('Create Early Intervention', body, null);
  }

  submitIntervention(studentId) {
    const topicId = document.getElementById('int-topic').value;
    const note = document.getElementById('int-note').value;
    const user = Auth.getCurrentUser();

    const topicObj = Storage.getTopics().find(t => t.id === topicId);

    Storage.addIntervention({
      id: 'INT_' + Date.now(),
      studentId: studentId,
      teacherId: user ? user.id : 'ECB1234',
      teacherName: user ? user.name : 'Dr. R.K. Mehta',
      topicId: topicId,
      topicName: topicObj ? topicObj.name : 'DBMS Normalization',
      type: 'Prerequisite Recovery',
      note: note,
      createdAt: new Date().toISOString(),
      status: 'Active'
    });

    Notifications.closeModal();
    Notifications.toast('Early Intervention alert sent successfully!', 'success');
  }

  filterRoster(query) {
    const q = query.toLowerCase();
    const rows = document.querySelectorAll('#teacher-roster-tbody tr');
    rows.forEach(r => {
      const text = r.textContent.toLowerCase();
      r.style.display = text.includes(q) ? '' : 'none';
    });
  }
}

const TeacherView = new TeacherViewController();
window.TeacherView = TeacherView;
