/* ============================================================
   EDUNEXUS — ADMIN DASHBOARD & SYSTEM MANAGEMENT CONTROLLER
   ============================================================ */

class AdminViewController {
  constructor() {}

  renderDashboard(container) {
    const users = Storage.getUsers();
    const classes = Storage.getClasses();
    const subjects = Storage.getSubjects();
    const questions = Storage.getQuestions();

    let html = `
      <div class="stagger-section stagger-1">
        <!-- HEADER -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.75rem;">
          <div>
            <h2 style="font-size: 1.6rem; font-weight: 800;">System Administrator Control Center</h2>
            <p class="text-sm text-secondary">Manage institution accounts, courses, subjects, and question bank.</p>
          </div>
          <button class="btn btn-primary" onclick="AdminView.openAddUserModal()">+ Add New Account</button>
        </div>

        <!-- SYSTEM STATS GRID -->
        <div class="stats-grid" style="margin-bottom: 2rem;">
          <div class="card stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <span class="stat-value">${users.length}</span>
              <span class="stat-label">Total System Accounts</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">🏛️</div>
            <div class="stat-content">
              <span class="stat-value">${classes.length}</span>
              <span class="stat-label">Class Sections</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <span class="stat-value">${subjects.length}</span>
              <span class="stat-label">Curriculum Subjects</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">❓</div>
            <div class="stat-content">
              <span class="stat-value">${questions.length}</span>
              <span class="stat-label">MCQ Question Items</span>
            </div>
          </div>
        <!-- NEXAAI PLATFORM INSIGHT -->
        <div class="card card-gradient-border" style="margin-bottom: 2rem; border-left:4px solid var(--accent-cyan); background:var(--bg-secondary);">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:1rem;">
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="color:var(--accent-cyan); font-size:1.1rem;">✦</span>
                <h3 style="font-size: 1.15rem; font-weight: 800; color:var(--text-primary); margin:0;">
                  NexaAI Platform Insight — Prerequisite Gap Hotspots
                </h3>
              </div>
              <p style="font-size:0.85rem; color:var(--text-muted); margin:0.2rem 0 0 0;">
                Curriculum bottleneck breakdown calculated across diagnostic quiz evaluations.
              </p>
            </div>
            <span class="badge badge-cyan">3 Hotspots Detected</span>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.75rem; font-size:0.85rem;">
            <div>
              <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:0.25rem;">
                <span>Relational Algebra & Partial Dependency (DBMS)</span>
                <span class="text-danger">High Impact (40% Students)</span>
              </div>
              <div style="height:8px; background:var(--bg-tertiary); border-radius:4px; overflow:hidden;">
                <div style="width:80%; height:100%; background:#EF4444; border-radius:4px;"></div>
              </div>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:0.25rem;">
                <span>Singly & Doubly Linked Lists (DSA)</span>
                <span class="text-warning">Medium Impact (25% Students)</span>
              </div>
              <div style="height:8px; background:var(--bg-tertiary); border-radius:4px; overflow:hidden;">
                <div style="width:60%; height:100%; background:#F59E0B; border-radius:4px;"></div>
              </div>
            </div>

            <div>
              <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:0.25rem;">
                <span>CPU Scheduling Context Switching (OS)</span>
                <span class="text-warning">Medium Impact (20% Students)</span>
              </div>
              <div style="height:8px; background:var(--bg-tertiary); border-radius:4px; overflow:hidden;">
                <div style="width:45%; height:100%; background:#06B6D4; border-radius:4px;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- COURSE & SUBJECT ASSIGNMENT CARD -->
        <div class="card" style="margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 700;">Course & Subject Curriculum Mapping</h3>
              <p class="text-xs text-secondary">Enrolled Subject Structure.</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="Notifications.toast('Curriculum mapping updated.', 'success')">Save Mapping</button>
          </div>

          <div class="grid grid-2 gap-3">
            <div style="padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius-sm);">
              <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--accent-cyan);">Semester 3</h4>
              <p class="text-xs text-muted" style="margin-bottom: 0.5rem;">5 Core Subjects</p>
              <ul style="font-size: 0.8rem; color: var(--text-secondary); list-style: disc; padding-left: 1.25rem;">
                <li>Database Management Systems</li>
                <li>Data Structures & Algorithms</li>
                <li>Object Oriented Programming</li>
                <li>Digital Electronics & Logic Design</li>
                <li>Advanced Engineering Mathematics</li>
              </ul>
            </div>
            <div style="padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius-sm);">
              <h4 style="font-size: 0.9rem; font-weight: 700; color: var(--accent-cyan);">Semester 4</h4>
              <p class="text-xs text-muted" style="margin-bottom: 0.5rem;">3 Core Subjects</p>
              <ul style="font-size: 0.8rem; color: var(--text-secondary); list-style: disc; padding-left: 1.25rem;">
                <li>Discrete Mathematics</li>
                <li>Computer Organization & Architecture</li>
                <li>Operating Systems</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- SYSTEM USERS TABLE -->
        <div class="card">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 style="font-size: 1.1rem; font-weight: 700;">Registered Institution Accounts</h3>
            <div class="search-box">
              <input type="text" class="form-control" placeholder="Search user ID or name..." onkeyup="AdminView.filterUsers(this.value)">
            </div>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Course / Subject</th>
                  <th>Institution Code</th>
                </tr>
              </thead>
              <tbody id="admin-users-tbody">
                ${users.map(u => `
                  <tr>
                    <td><strong>${u.id}</strong></td>
                    <td>${u.name}</td>
                    <td><span class="badge ${u.role === 'admin' ? 'badge-cyan' : u.role === 'teacher' ? 'badge-medium' : 'badge-low'}">${u.role.toUpperCase()}</span></td>
                    <td>${u.branch || u.subject || 'System Admin'}</td>
                    <td>${u.schoolCode || 'ECB'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  openAddUserModal() {
    const body = `
      <form id="add-user-form" onsubmit="event.preventDefault(); AdminView.submitAddUser();">
        <div class="form-group">
          <label class="form-label">Role</label>
          <select id="add-role" class="form-control form-select">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" id="add-name" class="form-control" placeholder="e.g. Vikram Singh" required>
        </div>
        <div class="form-group">
          <label class="form-label">Generated User ID</label>
          <input type="text" id="add-id" class="form-control" value="ECB0249" required>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" id="add-pass" class="form-control" value="student123" required>
        </div>
        <button type="submit" class="btn btn-primary w-full">Create Institution Account</button>
      </form>
    `;
    Notifications.openModal('Add New Institution Account', body, null);
  }

  submitAddUser() {
    const role = document.getElementById('add-role').value;
    const name = document.getElementById('add-name').value;
    const id = document.getElementById('add-id').value;
    const pass = document.getElementById('add-pass').value;

    Storage.addUser({
      id: id,
      name: name,
      role: role,
      password: pass,
      schoolCode: 'ECB',
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-A'
    });

    Notifications.closeModal();
    Notifications.toast(`Account ${id} created successfully!`, 'success');
    this.renderDashboard(document.getElementById('page-body-container'));
  }

  filterUsers(query) {
    const q = query.toLowerCase();
    const rows = document.querySelectorAll('#admin-users-tbody tr');
    rows.forEach(r => {
      const text = r.textContent.toLowerCase();
      r.style.display = text.includes(q) ? '' : 'none';
    });
  }
}

const AdminView = new AdminViewController();
window.AdminView = AdminView;
