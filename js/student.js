/* ============================================================
   EDUNEXUS — STUDENT DASHBOARD & VIEWS CONTROLLER
   ============================================================ */

class StudentViewController {
  constructor() {}

  renderDashboard(container) {
    const user = Auth.getCurrentUser();
    const analysis = AIEngine.analyzeStudent(user ? user.id : 'ECB0245');
    const interventions = Storage.getInterventions(user ? user.id : 'ECB0245');

    let html = `
      <div class="animate-fade-in">
        <!-- Teacher Intervention Banner if available -->
        ${interventions.length > 0 ? `
          <div class="intervention-banner">
            <div style="display: flex; align-items: center; gap: 1rem;">
              <span style="font-size: 1.75rem;">⚠</span>
              <div>
                <h4 style="font-weight: 700; color: #F87171;">Teacher Recommended Activity</h4>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">${interventions[0].note}</p>
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="Router.navigate('/quiz?topicId=${interventions[0].topicId}')">Start Activity</button>
          </div>
        ` : ''}

        <!-- Stats Overview Cards -->
        <div class="stats-grid">
          <div class="card stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <span class="stat-value">${analysis.overallAccuracy}%</span>
              <span class="stat-label">Overall Performance</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
              <span class="stat-value">5 Days</span>
              <span class="stat-label">Learning Streak</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <span class="stat-value">${analysis.masteredTopicsCount}/6</span>
              <span class="stat-label">Topics Mastered</span>
            </div>
          </div>
          <div class="card stat-card">
            <div class="stat-icon">🚀</div>
            <div class="stat-content">
              <span class="stat-value">+12%</span>
              <span class="stat-label">Monthly Improvement</span>
            </div>
          </div>
        </div>

        <!-- AI Insight Alert Card -->
        <div class="card card-gradient-border" style="margin-bottom: 2rem;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span class="badge badge-cyan">✦ AI LEARNING INSIGHT</span>
                <span class="badge badge-${analysis.riskLevel.toLowerCase()}">${analysis.riskLevel} RISK</span>
              </div>
              <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.4rem;">
                ${analysis.learningGaps.length > 0 ? `Learning gap detected: ${analysis.learningGaps[0].targetTopicName}` : 'Performance Insights'}
              </h3>
              <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 600px;">
                ${analysis.learningGaps.length > 0 ? analysis.learningGaps[0].recommendation : analysis.riskReason}
              </p>
            </div>
            <button class="btn btn-primary" onclick="Router.navigate('/learning-path')">VIEW LEARNING PATH &rarr;</button>
          </div>
        </div>

        <!-- Assigned Subjects Section -->
        <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem;">My Subjects</h3>
        <div class="grid grid-2 gap-4">
    `;

    const subjects = Storage.getSubjects();
    subjects.forEach(sub => {
      const topics = Storage.getTopicsBySubject(sub.id);
      html += `
        <div class="card subject-card" onclick="Router.navigate('/subjects?id=${sub.id}')">
          <div class="subject-header">
            <div>
              <h4 class="subject-title">${sub.name}</h4>
              <span class="text-xs text-secondary">${topics.length} Topics • ${sub.code}</span>
            </div>
            <span class="badge badge-cyan">In Progress</span>
          </div>
          <div class="progress-bar-container" style="margin-bottom: 0.75rem;">
            <div class="progress-bar-fill" style="width: ${sub.id === 'SUB_MATH' ? '72' : '80'}%;"></div>
          </div>
          <div class="flex justify-between text-xs text-secondary">
            <span>Overall Progress</span>
            <span class="font-bold text-primary">${sub.id === 'SUB_MATH' ? '72%' : '80%'}</span>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  renderSubjects(container) {
    const subjects = Storage.getSubjects();
    let html = `
      <div class="animate-fade-in">
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem;">My Subjects</h2>
        <div class="grid grid-2 gap-4">
    `;

    subjects.forEach(sub => {
      const topics = Storage.getTopicsBySubject(sub.id);
      html += `
        <div class="card subject-card" onclick="Router.navigate('/topics?subjectId=${sub.id}')">
          <div class="subject-header">
            <div>
              <h3 class="subject-title">${sub.name}</h3>
              <p class="text-sm text-secondary">${sub.code} • ${topics.length} Study Topics</p>
            </div>
            <button class="btn btn-outline btn-sm">Explore Topics</button>
          </div>
          <div class="progress-bar-container" style="margin-top: 1rem; margin-bottom: 0.5rem;">
            <div class="progress-bar-fill" style="width: 75%;"></div>
          </div>
          <span class="text-xs text-secondary">75% Complete</span>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  renderTopics(container, subjectId = 'SUB_MATH') {
    const topics = Storage.getTopicsBySubject(subjectId);
    const subject = Storage.getSubjects().find(s => s.id === subjectId);
    const user = Auth.getCurrentUser();
    const perf = Storage.getPerformance(user ? user.id : 'ECB0245');

    let html = `
      <div class="animate-fade-in">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          <div>
            <h2 style="font-size: 1.5rem; font-weight: 800;">${subject ? subject.name : 'Mathematics'} Topics</h2>
            <p class="text-sm text-secondary">Master each topic step-by-step with adaptive AI evaluations.</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="Router.navigate('/subjects')">&larr; Back to Subjects</button>
        </div>

        <div class="flex flex-col gap-3">
    `;

    topics.forEach(t => {
      const p = perf.find(x => x.topicId === t.id);
      const acc = p ? p.accuracy : 0;
      let statusBadge = `<span class="badge badge-cyan">In Progress</span>`;
      if (acc >= 75) statusBadge = `<span class="badge badge-low">Mastered</span>`;
      else if (p && acc < 50) statusBadge = `<span class="badge badge-high">Needs Focus</span>`;

      html += `
        <div class="card" style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
              <h4 style="font-size: 1.1rem; font-weight: 700;">${t.name}</h4>
              ${statusBadge}
              <span class="badge badge-cyan" style="opacity: 0.8;">${t.difficulty}</span>
            </div>
            <p class="text-sm text-secondary">Prerequisite: ${t.prerequisiteId ? 'Factorization' : 'None'} • Accuracy: ${acc}%</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="StudentView.openTopicMaterialModal('${t.name}')">Learning Material</button>
            <button class="btn btn-primary btn-sm" onclick="Router.navigate('/quiz?topicId=${t.id}')">Take Quiz &rarr;</button>
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }

  openTopicMaterialModal(topicName) {
    const body = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <p style="font-size: 0.95rem; color: var(--text-secondary);">
          Review the core mathematical concepts and formulas for <strong>${topicName}</strong> before taking the evaluation quiz.
        </p>
        <div style="padding: 1rem; background: var(--bg-tertiary); border-radius: var(--radius-md); border-left: 4px solid var(--accent-cyan);">
          <h4 style="font-weight: 700; margin-bottom: 0.5rem;">Key Formula & Rules</h4>
          <code style="font-family: monospace; color: var(--accent-cyan);">x² + (a+b)x + ab = (x+a)(x+b)</code>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted);">
          Example: x² + 5x + 6 can be broken down by finding two numbers that multiply to 6 and add up to 5 (2 and 3).
        </p>
      </div>
    `;
    Notifications.openModal(`Study Material: ${topicName}`, body, `<button class="btn btn-primary" onclick="Notifications.closeModal()">Got It!</button>`);
  }

  renderProgress(container) {
    const user = Auth.getCurrentUser();
    const performances = Storage.getPerformance(user ? user.id : 'ECB0245');

    let html = `
      <div class="animate-fade-in">
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem;">Learning Progress & Analytics</h2>
        <div class="card" style="margin-bottom: 2rem;">
          <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem;">Topic Accuracy Breakdown</h3>
          <div class="flex flex-col gap-4">
    `;

    performances.forEach(p => {
      html += `
        <div>
          <div class="flex justify-between text-sm margin-bottom: 0.35rem;">
            <span class="font-bold">${p.topicName}</span>
            <span class="${p.accuracy < 50 ? 'text-danger' : 'text-cyan'} font-bold">${p.accuracy}%</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${p.accuracy}%; background: ${p.accuracy < 50 ? 'var(--accent-rose)' : 'var(--gradient-primary)'};"></div>
          </div>
        </div>
      `;
    });

    html += `</div></div></div>`;
    container.innerHTML = html;
  }

  renderAchievements(container) {
    const user = Auth.getCurrentUser();
    const unlocked = user?.achievements || ['first_quiz', 'streak_5'];

    const achievementsList = [
      { id: 'first_quiz', title: 'First Quiz', icon: '🏆', desc: 'Completed your first evaluation quiz.' },
      { id: 'streak_5', title: '5 Day Streak', icon: '🔥', desc: 'Maintained a 5-day active learning streak.' },
      { id: 'topic_master', title: 'Topic Master', icon: '⭐', desc: 'Scored 85%+ on any topic quiz.' },
      { id: 'quiz_10', title: '10 Quizzes Completed', icon: '📚', desc: 'Finished 10 adaptive quizzes.' },
      { id: 'fast_improver', title: 'Fast Improver', icon: '🚀', desc: 'Boosted a weak topic score by over +20%.' }
    ];

    let html = `
      <div class="animate-fade-in">
        <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem;">My Achievements</h2>
        <div class="grid grid-3 gap-4">
    `;

    achievementsList.forEach(item => {
      const isUnlocked = unlocked.includes(item.id);
      html += `
        <div class="card" style="text-align: center; opacity: ${isUnlocked ? '1' : '0.45'};">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">${item.icon}</div>
          <h4 style="font-weight: 700; margin-bottom: 0.25rem;">${item.title}</h4>
          <p class="text-xs text-secondary">${item.desc}</p>
          <span class="badge ${isUnlocked ? 'badge-cyan' : 'badge-medium'}" style="margin-top: 0.75rem;">
            ${isUnlocked ? 'UNLOCKED' : 'LOCKED'}
          </span>
        </div>
      `;
    });

    html += `</div></div>`;
    container.innerHTML = html;
  }
}

const StudentView = new StudentViewController();
window.StudentView = StudentView;
