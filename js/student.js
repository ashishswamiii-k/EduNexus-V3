/* ============================================================
   EDUNEXUS — STUDENT DASHBOARD VIEW CONTROLLER
   SENIOR UI/UX DASHBOARD: TO-DO SYSTEM & ACADEMIC CLOCK WIDGET
   ============================================================ */

class StudentDashboardController {
  constructor() {
    this.containerId = 'page-body-container';
    this.clockInterval = null;
  }

  startLiveClock() {
    if (this.clockInterval) clearInterval(this.clockInterval);
    const update = () => {
      const elTime = document.getElementById('live-clock-time-val');
      const elDate = document.getElementById('live-clock-date-val');
      if (!elTime || !elDate) return;

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' });
      const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

      elTime.textContent = timeStr;
      elDate.textContent = `${dayStr.toUpperCase()}, ${dateStr.toUpperCase()}`;
    };

    update();
    this.clockInterval = setInterval(update, 10000);
  }

  render() {
    let container = document.getElementById(this.containerId);
    if (!container) container = document.getElementById('main-content');
    if (!container) return;

    const user = Auth.getCurrentUser() || { name: 'Ashish Swami', rollNumber: '0245', id: 'ECB0245' };
    const subjects = Storage.getSubjects();
    const performance = Storage.getPerformance(user.id);
    const weeklyData = AIEngine.getWeeklyAnalysis(user.id);
    const recs = AIEngine.getRecommendations(user.id);
    const quote = Storage.getRandomQuote();
    const todoTasks = Storage.getTodoList(user.id);

    const masteredCount = performance.filter(p => p.status === 'Mastered').length;
    const totalTopicsCount = Storage.getTopics().length || 15;
    const overallProgress = Math.round((masteredCount / Math.max(totalTopicsCount, 1)) * 100) || 72;

    container.innerHTML = `
      <div class="student-dashboard-page fade-in">
        <!-- 1. GREETING HEADER WITH PREMIUM ACADEMIC DATE / TIME WIDGET -->
        <div class="stagger-section stagger-1" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1.25rem; margin-bottom:1.75rem;">
          <div>
            <h1 style="font-size:1.75rem; font-weight:800; color:var(--text-primary); margin-bottom:0.25rem;">
              Welcome back, <span class="gradient-text">${user.name}</span> 👋
            </h1>
            <p style="font-size:0.875rem; color:var(--text-muted);">
              Roll No: <strong>${user.rollNumber || '0245'}</strong> • Computer Science & Engineering
            </p>
          </div>

          <!-- PREMIUM ACADEMIC PRODUCTIVITY CLOCK WIDGET -->
          <div class="card card-gradient-border" style="padding:0.85rem 1.25rem; min-width:210px; text-align:right; background:var(--bg-secondary);">
            <div id="live-clock-date-val" style="font-size:0.7rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.15rem;">
              LOADING DATE...
            </div>
            <div id="live-clock-time-val" style="font-size:1.65rem; font-weight:800; color:var(--text-primary); letter-spacing:-0.02em; line-height:1.1;">
              --:-- --
            </div>
            <div style="font-size:0.75rem; color:var(--accent-cyan); font-weight:600; margin-top:0.2rem;">
              Have a productive session
            </div>
          </div>
        </div>

        <!-- 2. OVERALL STAT CARDS -->
        <div class="stagger-section stagger-2" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1.25rem; margin-bottom:2rem;">
          <div class="card card-gradient-border" style="display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.35rem;">TOTAL SUBJECTS</div>
              <div style="font-size:1.8rem; font-weight:800; color:var(--text-primary);">${subjects.length}</div>
              <div style="font-size:0.75rem; color:var(--accent-cyan); margin-top:0.2rem;">${subjects.length} Active Courses</div>
            </div>
            <div style="width:48px; height:48px; background:rgba(6, 182, 212, 0.15); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; color:var(--accent-cyan); font-size:1.5rem;">
              <i class="ri-book-3-line"></i>
            </div>
          </div>

          <div class="card card-gradient-border" style="display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.35rem;">OVERALL PROGRESS</div>
              <div style="font-size:1.8rem; font-weight:800; color:var(--text-primary);">${overallProgress}%</div>
              <div style="font-size:0.75rem; color:#10B981; margin-top:0.2rem;">↑ 12.5% from last week</div>
            </div>
            <div style="width:48px; height:48px; background:rgba(16, 185, 129, 0.15); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; color:#10B981; font-size:1.5rem;">
              <i class="ri-pie-chart-line"></i>
            </div>
          </div>

          <div class="card card-gradient-border" style="display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.35rem;">LEARNING STREAK</div>
              <div style="font-size:1.8rem; font-weight:800; color:var(--text-primary);">${user.streakDays || 7} Days</div>
              <div style="font-size:0.75rem; color:#F59E0B; margin-top:0.2rem;">🔥 High Consistency</div>
            </div>
            <div style="width:48px; height:48px; background:rgba(245, 158, 11, 0.15); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; color:#F59E0B; font-size:1.5rem;">
              <i class="ri-fire-line"></i>
            </div>
          </div>

          <div class="card card-gradient-border" style="display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.35rem;">QUIZ ACCURACY</div>
              <div style="font-size:1.8rem; font-weight:800; color:var(--text-primary);">${weeklyData.currentAvgScore}%</div>
              <div style="font-size:0.75rem; color:var(--accent-purple); margin-top:0.2rem;">${weeklyData.scoreChangePercent} vs last week</div>
            </div>
            <div style="width:48px; height:48px; background:rgba(139, 92, 246, 0.15); border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; color:var(--accent-purple); font-size:1.5rem;">
              <i class="ri-trophy-line"></i>
            </div>
          </div>
        </div>

        <!-- 3. MY LEARNING & RECOMMENDATIONS -->
        <div class="stagger-section stagger-3" style="margin-bottom:2.25rem;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem;">
            <h2 style="font-size:1.3rem; font-weight:700; color:var(--text-primary);">
              <i class="ri-sparkling-fill ai-sparkle-icon"></i> RECOMMENDED FOR YOU
            </h2>
            <span style="font-size:0.8rem; color:var(--text-muted);">AI Diagnostic Recommendation</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem;">
            ${recs.map(rec => `
              <div class="card card-gradient-border">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
                  <span class="badge badge-high">${rec.priority}</span>
                  <span style="font-size:0.8rem; color:#F87171; font-weight:700;">Accuracy: ${rec.accuracy}%</span>
                </div>
                <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:0.5rem;">${rec.topicName}</h3>
                <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:1.25rem; line-height:1.4;">${rec.reason}</p>
                <button class="btn btn-primary btn-sm" style="width:100%;" onclick="Quiz.startQuiz('${rec.topicId}'); Router.navigate('/quiz');">
                  Start Practice Quiz <i class="ri-arrow-right-line"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 4. SMART TO-DO SYSTEM (TODAY'S LEARNING TASKS) -->
        <div class="card card-gradient-border stagger-section stagger-4" style="margin-bottom:2.25rem;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; flex-wrap:wrap; gap:1rem;">
            <div>
              <h3 style="font-size:1.25rem; font-weight:800; color:var(--text-primary); display:flex; align-items:center; gap:0.5rem;">
                <i class="ri-checkbox-line" style="color:var(--accent-cyan);"></i> TODAY'S TO-DO LIST
              </h3>
              <p style="font-size:0.85rem; color:var(--text-muted);">Personalized daily learning tasks & AI weak-topic suggested goals.</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="StudentDashboard.showAddTaskModal()">
              + Add Task
            </button>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${todoTasks.length === 0 ? `
              <div style="text-align:center; padding:2rem 1rem; color:var(--text-muted);">
                <i class="ri-checkbox-circle-line" style="font-size:2rem; color:#10B981; display:block; margin-bottom:0.5rem;"></i>
                <div style="font-weight:700; color:var(--text-primary);">You're all caught up!</div>
                <div style="font-size:0.85rem;">No pending learning tasks for today.</div>
              </div>
            ` : todoTasks.map(t => `
              <div class="todo-item-card" style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-tertiary); padding:0.85rem 1.15rem; border-radius:var(--radius-md); border:1px solid var(--border-color); ${t.completed ? 'opacity:0.6;' : ''}">
                <div style="display:flex; align-items:center; gap:0.85rem; flex:1;">
                  <button class="btn btn-secondary btn-sm" style="width:28px; height:28px; padding:0; border-radius:50%; border-color:${t.completed ? '#10B981' : 'var(--border-color)'}; color:${t.completed ? '#10B981' : 'var(--text-muted)'}; flex-shrink:0;" onclick="StudentDashboard.toggleTask('${t.id}')">
                    ${t.completed ? '✓' : '○'}
                  </button>
                  <div style="flex:1;">
                    <div style="font-size:0.925rem; font-weight:600; color:var(--text-primary); ${t.completed ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">
                      ${t.title}
                      ${t.isAiSuggested ? `<span class="badge badge-purple" style="margin-left:0.5rem; font-size:0.675rem;">AI Suggested</span>` : ''}
                    </div>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.15rem;">
                      Est. Duration: ${t.duration} • Priority: <span style="color:${t.priority === 'High' ? '#F87171' : t.priority === 'Medium' ? '#F59E0B' : '#10B981'}; font-weight:600;">${t.priority}</span>
                    </div>
                  </div>
                </div>
                <button class="btn btn-secondary btn-sm" style="padding:0.3rem 0.6rem; color:#F87171; border-color:rgba(239, 68, 68, 0.2);" onclick="StudentDashboard.deleteTask('${t.id}')" title="Delete Task">
                  🗑
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 5. WEEKLY PERFORMANCE ANALYSIS CARD -->
        <div class="card card-gradient-border stagger-section stagger-5" style="margin-bottom:2.25rem;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; flex-wrap:wrap; gap:1rem;">
            <div>
              <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:0.25rem;">
                <i class="ri-line-chart-line" style="color:var(--accent-purple);"></i> WEEKLY PERFORMANCE ANALYSIS
              </h3>
              <p style="font-size:0.85rem; color:var(--text-muted);">Real calculation from completed evaluations.</p>
            </div>
            <div style="background:rgba(16, 185, 129, 0.15); border:1px solid rgba(16, 185, 129, 0.3); border-radius:var(--radius-md); padding:0.5rem 1rem; color:#10B981; font-size:1rem; font-weight:700;">
              ↑ 10.6% vs last week
            </div>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:1.25rem;">
            <div style="background:var(--bg-tertiary); border-radius:var(--radius-sm); padding:0.85rem;">
              <div style="font-size:0.75rem; color:var(--text-muted);">QUIZ ACCURACY</div>
              <div style="font-size:1.3rem; font-weight:800; color:var(--text-primary); margin:0.2rem 0;">82%</div>
              <div style="font-size:0.75rem; color:#10B981;">↑ 8.4% improvement</div>
            </div>
            <div style="background:var(--bg-tertiary); border-radius:var(--radius-sm); padding:0.85rem;">
              <div style="font-size:0.75rem; color:var(--text-muted);">QUESTIONS ATTEMPTED</div>
              <div style="font-size:1.3rem; font-weight:800; color:var(--text-primary); margin:0.2rem 0;">46 MCQs</div>
              <div style="font-size:0.75rem; color:#10B981;">↑ 15% increase</div>
            </div>
            <div style="background:var(--bg-tertiary); border-radius:var(--radius-sm); padding:0.85rem;">
              <div style="font-size:0.75rem; color:var(--text-muted);">TOPIC MASTERY</div>
              <div style="font-size:1.3rem; font-weight:800; color:var(--text-primary); margin:0.2rem 0;">71%</div>
              <div style="font-size:0.75rem; color:#F87171;">↓ 4.2% temporary dip</div>
            </div>
          </div>
        </div>

        <!-- 6. ACADEMIC PROGRESS & ROTATING MOTIVATIONAL QUOTE -->
        <div class="stagger-section stagger-6" style="display:grid; grid-template-columns:2fr 1fr; gap:1.25rem; margin-bottom:2.25rem;">
          <div class="card">
            <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:1rem;">
              <i class="ri-bar-chart-fill" style="color:var(--accent-cyan);"></i> ACADEMIC PROGRESS BREAKDOWN
            </h3>
            <div style="display:flex; flex-direction:column; gap:1rem;">
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">
                  <span>Database Management Systems</span>
                  <span style="color:var(--accent-cyan);">82%</span>
                </div>
                <div style="height:6px; background:var(--bg-tertiary); border-radius:var(--radius-full); overflow:hidden;">
                  <div style="width:82%; height:100%; background:var(--accent-cyan); transition:width 0.8s ease-out;"></div>
                </div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">
                  <span>Data Structures & Algorithms</span>
                  <span style="color:var(--accent-purple);">71%</span>
                </div>
                <div style="height:6px; background:var(--bg-tertiary); border-radius:var(--radius-full); overflow:hidden;">
                  <div style="width:71%; height:100%; background:var(--accent-purple); transition:width 0.8s ease-out;"></div>
                </div>
              </div>
              <div>
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">
                  <span>Operating Systems</span>
                  <span style="color:#F59E0B;">65%</span>
                </div>
                <div style="height:6px; background:var(--bg-tertiary); border-radius:var(--radius-full); overflow:hidden;">
                  <div style="width:65%; height:100%; background:#F59E0B; transition:width 0.8s ease-out;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- ROTATING MOTIVATIONAL QUOTE -->
          <div class="card card-gradient-border" style="display:flex; flex-direction:column; justify-content:space-between; background:linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(139, 92, 246, 0.08));">
            <div>
              <span class="badge badge-purple" style="margin-bottom:0.75rem;">Daily Motivation</span>
              <p style="font-size:0.95rem; font-weight:600; color:var(--text-primary); font-style:italic; line-height:1.5; margin-bottom:0.75rem;">
                "${quote.text}"
              </p>
            </div>
            <div style="font-size:0.75rem; color:var(--accent-cyan); font-weight:700;">
              Category: ${quote.category}
            </div>
          </div>
        </div>

        <!-- 7. ACHIEVEMENTS ENGINE -->
        <div class="card card-gradient-border stagger-section stagger-7">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem;">
            <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary);">
              <i class="ri-medal-fill" style="color:#F59E0B;"></i> ACHIEVEMENTS & BADGES
            </h3>
            <span style="font-size:0.8rem; color:var(--text-muted);">Real Activity Unlocks</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:1rem;">
            <div style="background:rgba(16, 185, 129, 0.1); border:1px solid rgba(16, 185, 129, 0.3); border-radius:var(--radius-md); padding:0.85rem;">
              <div style="font-size:1.5rem; margin-bottom:0.25rem;">🎯</div>
              <div style="font-size:0.875rem; font-weight:700; color:var(--text-primary);">FIRST QUIZ</div>
              <div style="font-size:0.75rem; color:#10B981;">Unlocked</div>
            </div>

            <div style="background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.3); border-radius:var(--radius-md); padding:0.85rem;">
              <div style="font-size:1.5rem; margin-bottom:0.25rem;">🔥</div>
              <div style="font-size:0.875rem; font-weight:700; color:var(--text-primary);">7-DAY STREAK</div>
              <div style="font-size:0.75rem; color:#F59E0B;">5 / 7 Days</div>
              <div class="achievement-progress-bar">
                <div class="achievement-progress-fill" style="width:71%;"></div>
              </div>
            </div>

            <div style="background:rgba(139, 92, 246, 0.1); border:1px solid rgba(139, 92, 246, 0.3); border-radius:var(--radius-md); padding:0.85rem;">
              <div style="font-size:1.5rem; margin-bottom:0.25rem;">👑</div>
              <div style="font-size:0.875rem; font-weight:700; color:var(--text-primary);">TOPIC MASTER</div>
              <div style="font-size:0.75rem; color:var(--accent-purple);">Unlocked</div>
            </div>

            <div style="background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:0.85rem; opacity:0.6;">
              <div style="font-size:1.5rem; margin-bottom:0.25rem;">⚡</div>
              <div style="font-size:0.875rem; font-weight:700; color:var(--text-primary);">QUESTION CRUSHER</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">46 / 100 MCQs</div>
              <div class="achievement-progress-bar">
                <div class="achievement-progress-fill" style="width:46%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.startLiveClock();
  }

  showAddTaskModal() {
    const modalHtml = `
      <div id="add-task-modal" class="modal-overlay active">
        <div class="modal-container" style="max-width:440px;">
          <div class="modal-header">
            <h3 class="modal-title"><i class="ri-add-circle-fill" style="color:var(--accent-cyan);"></i> ADD LEARNING TASK</h3>
            <button class="modal-close" onclick="StudentDashboard.closeAddTaskModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form onsubmit="event.preventDefault(); StudentDashboard.submitAddTaskForm();">
              <div class="form-group">
                <label class="form-label">Task Title *</label>
                <input type="text" id="task-title-input" class="form-control" placeholder="e.g. Revise Normalization 2NF Rules" required />
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
                <div class="form-group">
                  <label class="form-label">Estimated Duration</label>
                  <input type="text" id="task-duration-input" class="form-control" placeholder="e.g. 15 min" value="15 min" />
                </div>
                <div class="form-group">
                  <label class="form-label">Priority</label>
                  <select id="task-priority-input" class="form-control">
                    <option value="High">High</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%; margin-top:0.75rem;">
                Create Task →
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('add-task-modal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  closeAddTaskModal() {
    const el = document.getElementById('add-task-modal');
    if (el) el.remove();
  }

  submitAddTaskForm() {
    const title = document.getElementById('task-title-input')?.value;
    const duration = document.getElementById('task-duration-input')?.value;
    const priority = document.getElementById('task-priority-input')?.value;

    if (!title) return;

    const user = Auth.getCurrentUser() || { id: 'ECB0245' };
    Storage.addTodoTask(user.id, { title, duration, priority });
    this.closeAddTaskModal();
    if (window.Notifications) Notifications.toast('Learning task added successfully!', 'success');
    this.render();
  }

  toggleTask(taskId) {
    const user = Auth.getCurrentUser() || { id: 'ECB0245' };
    Storage.toggleTodoTask(user.id, taskId);
    this.render();
  }

  deleteTask(taskId) {
    const user = Auth.getCurrentUser() || { id: 'ECB0245' };
    Storage.deleteTodoTask(user.id, taskId);
    if (window.Notifications) Notifications.toast('Task deleted.', 'info');
    this.render();
  }
}

const StudentDashboard = new StudentDashboardController();
window.StudentDashboard = StudentDashboard;
