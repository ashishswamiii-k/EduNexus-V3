/* ============================================================
   EDUNEXUS — TEACHER DASHBOARD & EARLY INTERVENTION CONTROLLER
   ============================================================ */

class TeacherViewController {
  constructor() {
    this.currentRiskFilter = 'ALL';
  }

  getStudentStats() {
    const users = Storage.getUsers().filter(u => u.role === 'student' && u.id !== '0245');
    const allPerf = Storage.getDb().performance || [];

    let totalScore = 0;
    let totalPerfCount = 0;

    const list = users.map(u => {
      const studentPerf = allPerf.filter(p => p.studentId === u.id);
      let avgAccuracy = 75;
      let weakTopicName = 'None';
      let prereqGapName = 'None';

      if (studentPerf.length > 0) {
        const sum = studentPerf.reduce((a, b) => a + b.accuracy, 0);
        avgAccuracy = Math.round(sum / studentPerf.length);

        const weak = studentPerf.find(p => p.status === 'Needs Focus' || p.accuracy < 75);
        if (weak) {
          weakTopicName = weak.topicName;
          const topicObj = Storage.getTopics().find(t => t.id === weak.topicId);
          if (topicObj && topicObj.prerequisiteId) {
            const prereqObj = Storage.getTopics().find(t => t.id === topicObj.prerequisiteId);
            if (prereqObj) prereqGapName = prereqObj.name;
          }
        }
      }

      totalScore += avgAccuracy;
      totalPerfCount++;

      let riskStatus = 'LOW';
      if (avgAccuracy < 60) {
        riskStatus = 'HIGH';
      } else if (avgAccuracy <= 78) {
        riskStatus = 'MEDIUM';
      } else {
        riskStatus = 'LOW';
      }

      return {
        id: u.id,
        name: u.name,
        rollNumber: u.rollNumber || u.id,
        branch: u.branch || 'Computer Science',
        avgAccuracy,
        weakTopicName,
        prereqGapName,
        riskStatus
      };
    });

    const classAverage = totalPerfCount > 0 ? Math.round(totalScore / totalPerfCount) : 74;
    const highCount = list.filter(s => s.riskStatus === 'HIGH').length;
    const mediumCount = list.filter(s => s.riskStatus === 'MEDIUM').length;
    const lowCount = list.filter(s => s.riskStatus === 'LOW').length;

    return {
      students: list,
      classAverage,
      totalCount: list.length,
      highCount,
      mediumCount,
      lowCount
    };
  }

  renderDashboard(containerId = 'page-body-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = Auth.getCurrentUser();
    const teacherName = user ? user.name : 'Dr. R.K. Mehta';
    const stats = this.getStudentStats();
    const nexaClass = window.AIEngine ? AIEngine.getClassNexaAIInsight() : null;

    let html = `
      <div class="stagger-section stagger-1" style="max-width:1100px; margin:0 auto;">
        <!-- HEADER -->
        <div style="margin-bottom: 1.75rem;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color:var(--text-primary);">
            Student Performance & Early Intervention Overview
          </h2>
          <p class="text-sm text-secondary">Academic Performance & AI Early Intervention Hub • Instructor: ${teacherName}</p>
        </div>

        <!-- STAT CARDS -->
        <div class="stats-grid" style="margin-bottom: 2rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:1.25rem;">
          <div class="card stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <span class="stat-value">${stats.classAverage}%</span>
              <span class="stat-label">Class Average Score</span>
            </div>
          </div>

          <div class="card stat-card">
            <div class="stat-icon">👨‍🎓</div>
            <div class="stat-content">
              <span class="stat-value">${stats.totalCount}</span>
              <span class="stat-label">Total Roster Students</span>
            </div>
          </div>

          <div class="card stat-card" onclick="TeacherView.filterByRisk('HIGH')" style="cursor:pointer;">
            <div class="stat-icon" style="background: rgba(239, 68, 68, 0.12); color: #F87171;">⚠️</div>
            <div class="stat-content">
              <span class="stat-value text-danger">${stats.highCount}</span>
              <span class="stat-label">High Risk Students</span>
            </div>
          </div>

          <div class="card stat-card" onclick="TeacherView.filterByRisk('MEDIUM')" style="cursor:pointer;">
            <div class="stat-icon" style="background: rgba(245, 158, 11, 0.12); color: #FBBF24;">🟠</div>
            <div class="stat-content">
              <span class="stat-value text-warning">${stats.mediumCount}</span>
              <span class="stat-label">Medium Risk Students</span>
            </div>
          </div>

          <div class="card stat-card" onclick="TeacherView.filterByRisk('LOW')" style="cursor:pointer;">
            <div class="stat-icon" style="background: rgba(16, 185, 129, 0.12); color: #10B981;">🟢</div>
            <div class="stat-content">
              <span class="stat-value text-cyan">${stats.lowCount}</span>
              <span class="stat-label">Low Risk Students</span>
            </div>
          </div>
        </div>

        <!-- NEXAAI CLASS INSIGHT CARD -->
        <div class="card card-gradient-border" style="margin-bottom: 2rem; border-left:4px solid #EF4444; background:var(--bg-secondary);">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span class="badge badge-high"><span class="ai-sparkle-icon">✦</span> NEXAAI CLASS INSIGHT</span>
                <span class="badge badge-secondary">${stats.highCount} High-Risk Alert</span>
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color:var(--text-primary); margin-bottom: 0.4rem;">
                ${nexaClass ? nexaClass.summary : `${stats.highCount} students require immediate prerequisite intervention.`}
              </h3>
              <p style="font-size: 0.875rem; color: var(--text-secondary); max-width: 680px; margin:0;">
                Suggested Action: ${nexaClass ? nexaClass.recommendedIntervention : 'Conduct targeted revision on core prerequisites before unit assessments.'}
              </p>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="TeacherView.filterByRisk('HIGH')">
                View High Risk (${stats.highCount})
              </button>
              <button class="btn btn-primary btn-sm" onclick="TeacherView.openCreateInterventionModal()">
                Create Intervention &rarr;
              </button>
            </div>
          </div>
        </div>

        <!-- STUDENT RISK ROSTER TABLE WITH RISK FILTER TABS -->
        <div class="card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap:wrap; gap:1rem;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 800; color:var(--text-primary); margin:0;">Student Academic Risk Roster</h3>
              <p style="font-size:0.8rem; color:var(--text-muted); margin:0.2rem 0 0 0;">Dynamic risk classification derived from quiz evaluation scores and prerequisite gap detection.</p>
            </div>

            <!-- RISK FILTERS -->
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button class="btn btn-sm ${this.currentRiskFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}" onclick="TeacherView.filterByRisk('ALL')">
                All (${stats.totalCount})
              </button>
              <button class="btn btn-sm ${this.currentRiskFilter === 'HIGH' ? 'btn-primary' : 'btn-secondary'}" style="${this.currentRiskFilter === 'HIGH' ? '' : 'color:#EF4444;'}" onclick="TeacherView.filterByRisk('HIGH')">
                🔴 High Risk (${stats.highCount})
              </button>
              <button class="btn btn-sm ${this.currentRiskFilter === 'MEDIUM' ? 'btn-primary' : 'btn-secondary'}" style="${this.currentRiskFilter === 'MEDIUM' ? '' : 'color:#F59E0B;'}" onclick="TeacherView.filterByRisk('MEDIUM')">
                🟠 Medium Risk (${stats.mediumCount})
              </button>
              <button class="btn btn-sm ${this.currentRiskFilter === 'LOW' ? 'btn-primary' : 'btn-secondary'}" style="${this.currentRiskFilter === 'LOW' ? '' : 'color:#10B981;'}" onclick="TeacherView.filterByRisk('LOW')">
                🟢 Low Risk (${stats.lowCount})
              </button>
            </div>
          </div>

          <div style="margin-bottom:1rem;">
            <input type="text" class="form-control" placeholder="Search student name or ID..." onkeyup="TeacherView.filterRoster(this.value)">
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Overall Accuracy</th>
                  <th>Weak Topic</th>
                  <th>Prerequisite Gap</th>
                  <th>Risk Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="teacher-roster-tbody">
                ${stats.students.map(s => {
                  let badgeClass = s.riskStatus === 'HIGH' ? 'badge-high' : s.riskStatus === 'MEDIUM' ? 'badge-medium' : 'badge-low';
                  let scoreColor = s.riskStatus === 'HIGH' ? 'text-danger' : s.riskStatus === 'MEDIUM' ? 'text-warning' : 'text-cyan';

                  return `
                    <tr data-risk="${s.riskStatus}">
                      <td><strong>${s.name}</strong></td>
                      <td>${s.id}</td>
                      <td><span class="${scoreColor} font-bold">${s.avgAccuracy}%</span></td>
                      <td>${s.weakTopicName}</td>
                      <td><span style="color:${s.prereqGapName !== 'None' ? '#F59E0B' : 'var(--text-muted)'}; font-weight:600;">${s.prereqGapName}</span></td>
                      <td><span class="badge ${badgeClass}">${s.riskStatus} RISK</span></td>
                      <td>
                        <button class="btn btn-secondary btn-sm" onclick="TeacherView.openStudentProfileModal('${s.id}')">Profile</button>
                        <button class="btn btn-primary btn-sm" onclick="TeacherView.openCreateInterventionModal('${s.id}')">Intervene</button>
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

    container.innerHTML = html;
    this.applyCurrentFilter();
  }

  filterByRisk(riskLevel) {
    this.currentRiskFilter = riskLevel;
    this.renderDashboard();
  }

  applyCurrentFilter() {
    const rows = document.querySelectorAll('#teacher-roster-tbody tr');
    let visibleCount = 0;
    rows.forEach(r => {
      const risk = r.getAttribute('data-risk');
      const isVisible = (this.currentRiskFilter === 'ALL' || risk === this.currentRiskFilter);
      
      if (isVisible) {
        r.style.display = '';
        r.style.opacity = '0';
        r.style.transform = 'translateY(8px)';
        const delay = visibleCount * 30;
        visibleCount++;
        setTimeout(() => {
          r.style.opacity = '1';
          r.style.transform = 'translateY(0)';
        }, delay);
      } else {
        r.style.opacity = '0';
        r.style.transform = 'translateY(-8px)';
        setTimeout(() => {
          r.style.display = 'none';
        }, 150);
      }
    });
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
