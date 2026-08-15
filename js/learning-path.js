/* ============================================================
   EDUNEXUS — ADAPTIVE LEARNING PATH ENGINE & PREREQUISITE ROADMAP
   ============================================================ */

class LearningPathEngine {
  constructor() {
    this.containerId = 'page-body-container';
    this.selectedSubjectId = 'SUB_DBMS';
  }

  setSubject(subjectId) {
    this.selectedSubjectId = subjectId;
    this.render();
  }

  getStudentPathData(subjectId = this.selectedSubjectId, studentId = null) {
    const activeUser = window.Auth ? Auth.getCurrentUser() : null;
    const sId = studentId || (activeUser ? activeUser.id : 'DEMO0245');

    const subjects = Storage.getSubjects();
    const currentSubject = subjects.find(s => s.id === subjectId) || subjects[0] || { id: 'SUB_DBMS', name: 'Database Management Systems', code: 'DBMS101' };
    
    // Subject specific topics
    const subjectTopics = Storage.getTopicsBySubject(currentSubject.id);
    const performance = Storage.getPerformance(sId);

    // Build ordered roadmap for current subject
    const topicRoadmap = subjectTopics.map((topic, index) => {
      const perf = performance.find(p => p.topicId === topic.id);
      let status = 'Upcoming';
      let accuracy = perf ? perf.accuracy : null;
      let attempts = perf ? perf.totalAttempts : 0;

      if (perf) {
        if (perf.status === 'Mastered' || perf.accuracy >= 75) {
          status = 'Completed';
        } else if (perf.status === 'Needs Focus' || perf.accuracy < 75) {
          status = 'Weak Topic';
        }
      } else {
        // If unattempted, first uncompleted item is Current Focus
        if (index === 0) {
          status = 'Current Focus';
        } else {
          const prevPerf = performance.find(p => p.topicId === subjectTopics[index - 1]?.id);
          if (prevPerf && (prevPerf.status === 'Mastered' || prevPerf.accuracy >= 75)) {
            status = 'Current Focus';
          } else {
            status = 'Upcoming';
          }
        }
      }

      return {
        ...topic,
        status,
        accuracy,
        attempts
      };
    });

    const completedCount = topicRoadmap.filter(t => t.status === 'Completed').length;
    const weakTopics = topicRoadmap.filter(t => t.status === 'Weak Topic');
    const currentTopic = topicRoadmap.find(t => t.status === 'Current Focus' || t.status === 'Weak Topic') || topicRoadmap[0];
    const totalCount = topicRoadmap.length || 1;
    const completionPercent = Math.round((completedCount / totalCount) * 100);

    // Dynamic AI Recommendation text based on actual quiz evaluation
    let recommendation = '';
    if (weakTopics.length > 0) {
      recommendation = `⚠️ Diagnostic alert: Performance on ${weakTopics[0].name} is ${weakTopics[0].accuracy}% (Needs Revision). Review prerequisite concepts and attempt a revision quiz.`;
    } else if (currentTopic) {
      recommendation = `💡 You are currently focusing on ${currentTopic.name}. Complete the topic learning material to advance your roadmap.`;
    } else {
      recommendation = `🎉 Excellent progress! You have mastered all core topics in ${currentSubject.name}. Take a full subject quiz to test overall retention.`;
    }

    return {
      studentId: sId,
      subjects,
      currentSubject,
      topicRoadmap,
      completionPercent,
      completedCount,
      totalCount,
      weakTopics,
      currentTopic,
      recommendation
    };
  }

  render(containerId = this.containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = this.getStudentPathData();

    container.innerHTML = `
      <div class="fade-in" style="padding-top:0.5rem; max-width:980px;">
        <!-- HEADER -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h1 style="font-size:1.5rem; font-weight:800; color:var(--text-primary);">
              🌿 PERSONALIZED STUDY ROADMAP & LEARNING PATH
            </h1>
            <p style="font-size:0.875rem; color:var(--text-muted);">
              Sequenced study roadmap derived from diagnostic accuracy, prerequisites, and subject goals.
            </p>
          </div>
          <div style="text-align:right; background:var(--bg-tertiary); padding:0.6rem 1.2rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <div style="font-size:1.5rem; font-weight:800; color:var(--accent-cyan);">${data.completionPercent}%</div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">Roadmap Completion</div>
          </div>
        </div>

        <!-- SUBJECT TABS SELECTOR -->
        <div style="display:flex; gap:0.5rem; overflow-x:auto; padding-bottom:0.75rem; margin-bottom:1.5rem;">
          ${data.subjects.map(s => `
            <button class="btn ${s.id === data.currentSubject.id ? 'btn-primary' : 'btn-secondary'}" style="white-space:nowrap; padding:0.5rem 1rem;" onclick="LearningPath.setSubject('${s.id}')">
              📘 ${s.name} (${s.code || ''})
            </button>
          `).join('')}
        </div>

        <!-- NEXAAI LEARNING INTELLIGENCE SUMMARY BANNER -->
        ${(() => {
          const nexa = window.AIEngine ? AIEngine.getNexaAIInsightForStudent(data.studentId) : null;
          const riskColor = nexa ? (nexa.riskLevel === 'HIGH' ? '#EF4444' : nexa.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981') : 'var(--accent-cyan)';
          const riskBadge = nexa ? (nexa.riskLevel === 'HIGH' ? 'badge-high' : nexa.riskLevel === 'MEDIUM' ? 'badge-medium' : 'badge-low') : 'badge-cyan';
          return `
            <div class="card card-gradient-border" style="margin-bottom:1.5rem; border-left:4px solid ${riskColor}; background:var(--bg-secondary);">
              <div style="display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
                <div style="flex:1;">
                  <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
                    <span style="color:var(--accent-cyan); font-size:1.1rem;">✦</span>
                    <strong style="font-size:0.95rem; font-weight:800; color:var(--text-primary);">NexaAI Learning Intelligence</strong>
                    ${nexa ? `<span class="badge ${riskBadge}" style="font-size:0.725rem;">${nexa.riskLevel} RISK</span>` : ''}
                  </div>
                  <p style="font-size:0.875rem; color:var(--text-secondary); line-height:1.55; margin:0 0 0.5rem 0;">
                    ${nexa ? nexa.explanation : data.recommendation}
                  </p>
                  <div style="font-size:0.8rem; font-weight:700; color:var(--text-primary);">
                    🎯 Next Action: <span style="color:var(--accent-cyan);">${nexa ? nexa.recommendedAction : 'Complete current focus topic'}</span>
                  </div>
                </div>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                  ${nexa ? `
                    <button class="btn btn-primary btn-sm" onclick="Quiz.executeNexaAction('${nexa.actionType}', '${nexa.targetTopicId}')">
                      ${nexa.actionButtonText} →
                    </button>
                  ` : (data.currentTopic ? `
                    <button class="btn btn-primary btn-sm" onclick="Quiz.startQuiz('${data.currentTopic.id}'); Router.navigate('/quiz');">
                      🎯 Practice Topic Quiz
                    </button>
                  ` : '')}
                  <button class="btn btn-secondary btn-sm" onclick="App.openNexaAIChat('What should I study today?')">
                    ✦ Ask NexaAI for Study Plan
                  </button>
                </div>
              </div>
            </div>
          `;
        })()}

        <!-- SUBJECT STUDY ROADMAP SEQUENCE -->
        <div class="card" style="margin-bottom:1.5rem;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; border-bottom:1px solid var(--border-color); padding-bottom:0.75rem;">
            <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin:0;">
              📘 ${data.currentSubject.name} — Topic Sequence Roadmap
            </h3>
            <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">
              ${data.completedCount} of ${data.totalCount} Topics Mastered
            </span>
          </div>

          ${data.topicRoadmap.length > 0 ? `
            <div class="stagger-container" style="display:flex; flex-direction:column; gap:0.85rem;">
              ${data.topicRoadmap.map((t) => {
                let statusBadge = '';
                let statusBorder = 'border:1px solid var(--border-color); background:var(--bg-tertiary);';
                let icon = '○';

                if (t.status === 'Completed') {
                  icon = '✓';
                  statusBadge = `<span class="badge badge-low" style="background:rgba(16,185,129,0.15); color:#10B981; border:1px solid rgba(16,185,129,0.3);">✓ Completed (${t.accuracy}%)</span>`;
                } else if (t.status === 'Weak Topic') {
                  icon = '⚠️';
                  statusBorder = 'border:1px solid rgba(245,158,11,0.5); background:rgba(245,158,11,0.08);';
                  statusBadge = `<span class="badge" style="background:rgba(245,158,11,0.2); color:#FBBF24; border:1px solid rgba(245,158,11,0.4);">⚠️ Weak Topic (${t.accuracy}%)</span>`;
                } else if (t.status === 'Current Focus') {
                  icon = '→';
                  statusBorder = 'border:1px solid var(--accent-cyan); background:rgba(6,182,212,0.08);';
                  statusBadge = '<span class="badge badge-cyan">→ Current Focus</span>';
                } else {
                  statusBadge = '<span class="badge badge-secondary" style="opacity:0.7;">○ Upcoming</span>';
                }

                return `
                  <div class="card" style="${statusBorder} border-radius:var(--radius-md); padding:1rem 1.15rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.85rem; transition:transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;">
                    <div style="display:flex; align-items:center; gap:0.85rem;">
                      <div style="width:32px; height:32px; border-radius:50%; background:var(--bg-primary); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:1rem; color:var(--text-primary);">
                        ${icon}
                      </div>
                      <div>
                        <div style="font-size:0.95rem; font-weight:700; color:var(--text-primary);">${t.name}</div>
                        <div style="font-size:0.775rem; color:var(--text-muted); margin-top:0.15rem;">
                          ${t.unit || 'Unit 1'} • Difficulty: <strong>${t.difficulty || 'Medium'}</strong>
                          ${t.prerequisiteId ? ` • Prerequisite: <span style="color:var(--accent-cyan);">${t.prerequisiteId}</span>` : ''}
                        </div>
                      </div>
                    </div>

                    <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                      ${statusBadge}
                      <button class="btn btn-secondary btn-sm" onclick="App.openNexaAIChat('Why was this topic recommended?', '${t.id}')">
                        ✦ Ask NexaAI
                      </button>
                      <button class="btn btn-outline btn-sm" onclick="Quiz.startQuiz('${t.id}'); Router.navigate('/quiz');" title="Take Quiz for this topic">
                        🎯 Test Topic
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            <div style="text-align:center; padding:2.5rem 1.5rem; background:var(--bg-tertiary); border-radius:var(--radius-md); border:1px dashed var(--border-color);">
              <div style="font-size:2.5rem; margin-bottom:0.5rem;">📄</div>
              <h4 style="font-size:1.15rem; font-weight:800; color:var(--text-primary); margin-bottom:0.35rem;">Syllabus Not Provided</h4>
              <p style="font-size:0.85rem; color:var(--text-muted); max-width:420px; margin:0 auto 1.25rem auto;">
                Add your syllabus PDF or enter syllabus topics manually to generate your personalized learning path.
              </p>
              <button class="btn btn-primary" onclick="SubjectManager.showEditSubjectModal('${data.currentSubject.id}')">
                + Add Syllabus & Topics
              </button>
            </div>
          `}
        </div>

        <!-- RECOMMENDED STUDY MATERIALS FOR ACTIVE SUBJECT -->
        <div class="card">
          <h3 style="font-size:1rem; font-weight:800; color:var(--text-primary); margin-bottom:0.75rem;">
            📚 Course Study Resources & Uploaded Syllabus
          </h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
            <div style="background:var(--bg-tertiary); padding:0.85rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between;">
              <div>
                <div style="font-size:0.85rem; font-weight:700;">📄 Subject Syllabus</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${data.currentSubject.name} Curriculum</div>
              </div>
              <span class="badge badge-cyan">PDF</span>
            </div>
            <div style="background:var(--bg-tertiary); padding:0.85rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between;">
              <div>
                <div style="font-size:0.85rem; font-weight:700;">📄 PYQ Repository</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Previous Year Solved Papers</div>
              </div>
              <span class="badge badge-purple">PDF</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

const LearningPath = new LearningPathEngine();
window.LearningPath = LearningPath;
