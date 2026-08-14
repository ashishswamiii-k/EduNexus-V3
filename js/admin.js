/* ============================================================
   EDUNEXUS — ADMIN DASHBOARD & SYSTEM MANAGEMENT CONTROLLER
   ============================================================ */

class AdminViewController {
  constructor() {
    this.activeTab = 'students';
  }

  renderDashboard(container) {
    const users = Storage.getUsers();
    const students = users.filter(u => u.role === 'student');
    const teachers = users.filter(u => u.role === 'teacher');
    const classes = Storage.getClasses();
    const subjects = Storage.getSubjects();
    const questions = Storage.getQuestions();

    let html = `
      <div class="animate-fade-in">
        <!-- Admin Stats Overview -->
        <div class="stats-grid">
          <div class="card stat-card">
            <div class="stat-icon">🎓</div>
            <div class="stat-content">
              <span class="stat-value">${students.length}</span>
              <span class="stat-label">Total Students</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">👩‍🏫</div>
            <div class="stat-content">
              <span class="stat-value">${teachers.length}</span>
              <span class="stat-label">Total Teachers</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">🏫</div>
            <div class="stat-content">
              <span class="stat-value">${classes.length}</span>
              <span class="stat-label">Active Classes</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <span class="stat-value">${subjects.length}</span>
              <span class="stat-label">Subjects</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">❓</div>
            <div class="stat-content">
              <span class="stat-value">${questions.length}</span>
              <span class="stat-label">Question Bank</span>
            </div>
          </div>
        </div>

        <!-- Admin Management Navigation Tabs -->
        <div class="role-tabs" style="margin-bottom: 1.5rem;">
          <button class="role-tab ${this.activeTab === 'students' ? 'active' : ''}" onclick="AdminView.switchTab('students')">Students</button>
          <button class="role-tab ${this.activeTab === 'teachers' ? 'active' : ''}" onclick="AdminView.switchTab('teachers')">Teachers</button>
          <button class="role-tab ${this.activeTab === 'classes' ? 'active' : ''}" onclick="AdminView.switchTab('classes')">Classes</button>
          <button class="role-tab ${this.activeTab === 'subjects' ? 'active' : ''}" onclick="AdminView.switchTab('subjects')">Subjects & Topics</button>
          <button class="role-tab ${this.activeTab === 'questions' ? 'active' : ''}" onclick="AdminView.switchTab('questions')">Question Bank</button>
          <button class="role-tab ${this.activeTab === 'analytics' ? 'active' : ''}" onclick="AdminView.switchTab('analytics')">Platform Analytics</button>
        </div>

        <!-- Dynamic Content Container -->
        <div id="admin-tab-content">
          ${this.renderTabContent()}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    const contentEl = document.getElementById('admin-tab-content');
    if (contentEl) {
      contentEl.innerHTML = this.renderTabContent();
    }
    // Update active tab button style
    document.querySelectorAll('.role-tabs .role-tab').forEach(btn => {
      if (btn.textContent.toLowerCase().includes(tabName.toLowerCase())) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  renderTabContent() {
    switch (this.activeTab) {
      case 'students': return this.renderStudentsTab();
      case 'teachers': return this.renderTeachersTab();
      case 'classes': return this.renderClassesTab();
      case 'subjects': return this.renderSubjectsTab();
      case 'questions': return this.renderQuestionsTab();
      case 'analytics': return this.renderAnalyticsTab();
      default: return this.renderStudentsTab();
    }
  }

  renderStudentsTab() {
    const students = Storage.getUsers().filter(u => u.role === 'student');
    let html = `
      <div class="card" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-weight: 700;">Student Roster Management</h3>
        <button class="btn btn-primary btn-sm" onclick="AdminView.openAddStudentModal()">+ Add New Student</button>
      </div>
      <div class="card p-0" style="padding: 0; overflow: hidden;">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Class</th>
                <th>School Code</th>
                <th>Streak</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
    `;

    students.forEach(s => {
      html += `
        <tr>
          <td><code>${s.id}</code></td>
          <td><strong>${s.name}</strong></td>
          <td>${s.classId || '10-A'}</td>
          <td>${s.schoolCode || 'ECB'}</td>
          <td>${s.streakDays || 1} Days</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="Notifications.toast('Edit Student details saved', 'success')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="AdminView.confirmDeleteUser('${s.id}')">Disable</button>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table></div></div>`;
    return html;
  }

  renderTeachersTab() {
    const teachers = Storage.getUsers().filter(u => u.role === 'teacher');
    let html = `
      <div class="card" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-weight: 700;">Teacher Management</h3>
        <button class="btn btn-primary btn-sm" onclick="AdminView.openAddTeacherModal()">+ Add New Teacher</button>
      </div>
      <div class="card p-0" style="padding: 0; overflow: hidden;">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Teacher ID</th>
                <th>Full Name</th>
                <th>Subject</th>
                <th>Mobile Number</th>
                <th>School Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
    `;

    teachers.forEach(t => {
      html += `
        <tr>
          <td><code>${t.id}</code></td>
          <td><strong>${t.name}</strong></td>
          <td>${t.subject || 'Mathematics'}</td>
          <td>${t.mobileNumber || 'N/A'}</td>
          <td>${t.schoolCode || 'ECB'}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="Notifications.toast('Edit Teacher saved', 'success')">Edit</button>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table></div></div>`;
    return html;
  }

  renderClassesTab() {
    const classes = Storage.getClasses();
    let html = `
      <div class="card" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-weight: 700;">School Classes & Sections</h3>
        <button class="btn btn-primary btn-sm" onclick="Notifications.toast('New class added!', 'success')">+ Create Class</button>
      </div>
      <div class="grid grid-3 gap-4">
    `;

    classes.forEach(c => {
      html += `
        <div class="card">
          <h4 style="font-size: 1.2rem; font-weight: 700;">${c.name}</h4>
          <p class="text-sm text-secondary">Section: ${c.section} • Enrolled Students: ${c.studentCount}</p>
          <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm">Edit</button>
            <button class="btn btn-outline btn-sm">View Students</button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  renderSubjectsTab() {
    const subjects = Storage.getSubjects();
    const topics = Storage.getTopics();
    let html = `
      <div class="card" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-weight: 700;">Subjects & Prerequisite Topics</h3>
        <button class="btn btn-primary btn-sm" onclick="Notifications.toast('Topic added successfully', 'success')">+ Add Topic</button>
      </div>
      <div class="grid grid-2 gap-4">
    `;

    subjects.forEach(s => {
      const subTopics = topics.filter(t => t.subjectId === s.id);
      html += `
        <div class="card">
          <h4 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">${s.name} (${s.code})</h4>
          <div class="flex flex-col gap-2">
      `;
      subTopics.forEach(tp => {
        html += `
          <div style="padding: 0.5rem; background: var(--bg-tertiary); border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-weight: 600; font-size: 0.9rem;">${tp.name}</span>
              ${tp.prerequisiteId ? `<span class="text-xs text-muted" style="display:block;">Prereq: Factorization</span>` : ''}
            </div>
            <span class="badge badge-cyan">${tp.difficulty}</span>
          </div>
        `;
      });
      html += `</div></div>`;
    });

    html += `</div>`;
    return html;
  }

  renderQuestionsTab() {
    const questions = Storage.getQuestions();
    let html = `
      <div class="card" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="font-weight: 700;">Question Bank Management</h3>
        <button class="btn btn-primary btn-sm" onclick="AdminView.openAddQuestionModal()">+ Add New Question</button>
      </div>
      <div class="flex flex-col gap-3">
    `;

    questions.forEach(q => {
      html += `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">${q.question}</h4>
            <span class="badge badge-cyan">${q.difficulty}</span>
          </div>
          <p class="text-xs text-secondary" style="margin-bottom: 0.75rem;">Options: ${q.options.join(' | ')}</p>
          <div style="padding: 0.5rem 0.75rem; background: var(--bg-tertiary); border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--accent-cyan);">
            <strong>Explanation:</strong> ${q.explanation}
          </div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  renderAnalyticsTab() {
    return `
      <div class="card">
        <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem;">Platform Analytics Overview</h3>
        <div class="grid grid-2 gap-4">
          <div style="padding: 1.5rem; background: var(--bg-tertiary); border-radius: var(--radius-md);">
            <h4 style="font-weight: 700; margin-bottom: 0.5rem;">Student Accuracy Distribution</h4>
            <p class="text-sm text-secondary">72% of active students have achieved mastery in foundation algebra topics.</p>
          </div>
          <div style="padding: 1.5rem; background: var(--bg-tertiary); border-radius: var(--radius-md);">
            <h4 style="font-weight: 700; margin-bottom: 0.5rem;">Prerequisite Gap Hotspots</h4>
            <p class="text-sm text-secondary">Factorization accounts for 65% of detected learning gaps in Class 10-A.</p>
          </div>
        </div>
      </div>
    `;
  }

  openAddStudentModal() {
    const body = `
      <form id="admin-add-student-form" onsubmit="event.preventDefault(); AdminView.submitAddStudent();">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" id="adm-st-name" class="form-control" placeholder="e.g. Rahul Sharma" required>
        </div>
        <div class="form-group">
          <label class="form-label">School Code</label>
          <input type="text" id="adm-st-school" class="form-control" value="ECB" required>
        </div>
        <div class="form-group">
          <label class="form-label">Roll Number</label>
          <input type="text" id="adm-st-roll" class="form-control" placeholder="e.g. 0250" required>
        </div>
        <div class="form-group">
          <label class="form-label">Class</label>
          <select id="adm-st-class" class="form-control form-select">
            <option value="10-A">10-A</option>
            <option value="10-B">10-B</option>
            <option value="11-A">11-A</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" id="adm-st-pass" class="form-control" value="student123" required>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="Notifications.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="document.getElementById('admin-add-student-form').dispatchEvent(new Event('submit'))">Save Student</button>
    `;

    Notifications.openModal('Add New Student', body, footer);
  }

  submitAddStudent() {
    const name = document.getElementById('adm-st-name').value;
    const school = document.getElementById('adm-st-school').value;
    const roll = document.getElementById('adm-st-roll').value;
    const classId = document.getElementById('adm-st-class').value;
    const pass = document.getElementById('adm-st-pass').value;

    const res = Auth.registerStudent({
      fullName: name,
      schoolCode: school,
      rollNumber: roll,
      classId,
      password: pass,
      confirmPassword: pass
    });

    if (res.success) {
      Notifications.closeModal();
      Notifications.toast(`Student ${res.id} created successfully!`, 'success');
      this.switchTab('students');
    } else {
      Notifications.toast(res.message, 'error');
    }
  }

  openAddQuestionModal() {
    const body = `
      <form id="admin-add-q-form" onsubmit="event.preventDefault(); AdminView.submitAddQuestion();">
        <div class="form-group">
          <label class="form-label">Question Text</label>
          <input type="text" id="adm-q-text" class="form-control" placeholder="Enter question..." required>
        </div>
        <div class="grid grid-2 gap-2">
          <div class="form-group">
            <label class="form-label">Option A</label>
            <input type="text" id="adm-q-opt0" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Option B</label>
            <input type="text" id="adm-q-opt1" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Option C</label>
            <input type="text" id="adm-q-opt2" class="form-control" required>
          </div>
          <div class="form-group">
            <label class="form-label">Option D</label>
            <input type="text" id="adm-q-opt3" class="form-control" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Correct Option Index (0 = A, 1 = B, 2 = C, 3 = D)</label>
          <select id="adm-q-correct" class="form-control form-select">
            <option value="0">Option A</option>
            <option value="1">Option B</option>
            <option value="2">Option C</option>
            <option value="3">Option D</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Explanation</label>
          <textarea id="adm-q-exp" class="form-control" rows="2" required></textarea>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="Notifications.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="document.getElementById('admin-add-q-form').dispatchEvent(new Event('submit'))">Save Question</button>
    `;

    Notifications.openModal('Add Question to Bank', body, footer);
  }

  submitAddQuestion() {
    const question = document.getElementById('adm-q-text').value;
    const opt0 = document.getElementById('adm-q-opt0').value;
    const opt1 = document.getElementById('adm-q-opt1').value;
    const opt2 = document.getElementById('adm-q-opt2').value;
    const opt3 = document.getElementById('adm-q-opt3').value;
    const correct = parseInt(document.getElementById('adm-q-correct').value);
    const explanation = document.getElementById('adm-q-exp').value;

    const q = {
      id: 'Q_' + Date.now(),
      subjectId: 'SUB_MATH',
      topicId: 'TOP_FACT',
      difficulty: 'Medium',
      question,
      options: [opt0, opt1, opt2, opt3],
      correctAnswer: correct,
      explanation
    };

    Storage.addQuestion(q);
    Notifications.closeModal();
    Notifications.toast('New question added to bank successfully!', 'success');
    this.switchTab('questions');
  }

  confirmDeleteUser(userId) {
    const body = `<p>Are you sure you want to disable account <strong>${userId}</strong>?</p>`;
    const footer = `
      <button class="btn btn-secondary" onclick="Notifications.closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="Notifications.closeModal(); Notifications.toast('Student account disabled.', 'warning');">Confirm Disable</button>
    `;
    Notifications.openModal('Disable Account Confirmation', body, footer);
  }
}

const AdminView = new AdminViewController();
window.AdminView = AdminView;
