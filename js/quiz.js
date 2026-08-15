/* ============================================================
   EDUNEXUS — ADAPTIVE QUIZ ENGINE & EVALUATION HUB
   ============================================================ */

class QuizEngine {
  constructor() {
    this.viewMode = 'hub'; // 'hub' | 'active' | 'results'
    this.selectedSubjectFilter = 'ALL';
    this.currentQuiz = null;
    this.currentIndex = 0;
    this.userAnswers = [];
    this.timerInterval = null;
    this.secondsElapsed = 0;
    this.lastResult = null;
  }

  setFilter(subjectId) {
    this.selectedSubjectFilter = subjectId;
    this.renderHub();
  }

  renderHub(containerId = 'page-body-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    this.viewMode = 'hub';
    const activeUser = window.Auth ? Auth.getCurrentUser() : null;
    const studentId = activeUser ? activeUser.id : 'DEMO0245';

    const subjects = Storage.getSubjects();
    const topics = Storage.getTopics();
    const performance = Storage.getPerformance(studentId);
    const history = Storage.getQuizHistory(studentId);

    // Build available quiz cards
    const filteredTopics = this.selectedSubjectFilter === 'ALL'
      ? topics
      : topics.filter(t => t.subjectId === this.selectedSubjectFilter);

    const quizCards = filteredTopics.map(t => {
      const subj = subjects.find(s => s.id === t.subjectId) || { name: 'Engineering', code: 'ENG' };
      const perf = performance.find(p => p.topicId === t.id);
      const questionCount = Storage.getQuestionsByTopic(t.id).length || 5;

      return {
        id: t.id,
        subjectName: subj.name,
        subjectCode: subj.code || 'SUB',
        topicName: t.name,
        questionCount: Math.min(questionCount, 5),
        difficulty: t.difficulty || 'Medium',
        timeLimit: `${Math.min(questionCount, 5) * 2} Mins`,
        bestScore: perf ? perf.accuracy : null,
        status: perf ? perf.status : 'Not Attempted'
      };
    });

    container.innerHTML = `
      <div class="fade-in" style="padding-top:0.5rem; max-width:1050px;">
        <!-- HUB HEADER -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h1 style="font-size:1.5rem; font-weight:800; color:var(--text-primary);">
              🎯 QUIZZES & EVALUATION HUB
            </h1>
            <p style="font-size:0.875rem; color:var(--text-muted);">
              Test your concept knowledge, evaluate retention, and identify subject revision areas.
            </p>
          </div>
          <button class="btn btn-outline btn-sm" onclick="Router.navigate('/learning-path')">
            🌿 View Learning Path →
          </button>
        </div>

        <!-- SUBJECT FILTER TABS -->
        <div style="display:flex; gap:0.5rem; overflow-x:auto; padding-bottom:0.75rem; margin-bottom:1.5rem;">
          <button class="btn ${this.selectedSubjectFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}" style="white-space:nowrap;" onclick="Quiz.setFilter('ALL')">
            All Subjects
          </button>
          ${subjects.map(s => `
            <button class="btn ${this.selectedSubjectFilter === s.id ? 'btn-primary' : 'btn-secondary'}" style="white-space:nowrap;" onclick="Quiz.setFilter('${s.id}')">
              📘 ${s.name}
            </button>
          `).join('')}
        </div>

        <!-- AVAILABLE QUIZZES GRID -->
        <div style="margin-bottom:2rem;">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-bottom:1rem;">
            Available Practice Quizzes (${quizCards.length})
          </h3>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:1.25rem;">
            ${quizCards.map(q => `
              <div class="card card-gradient-border" style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
                <div>
                  <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
                    <span class="badge badge-cyan">${q.subjectCode}</span>
                    <span class="badge ${q.difficulty === 'Hard' ? 'badge-high' : q.difficulty === 'Medium' ? 'badge-medium' : 'badge-low'}">
                      ${q.difficulty}
                    </span>
                  </div>

                  <h4 style="font-size:1.05rem; font-weight:800; color:var(--text-primary); margin-bottom:0.35rem;">
                    ${q.topicName}
                  </h4>
                  <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.85rem;">
                    ${q.subjectName}
                  </p>

                  <div style="display:flex; align-items:center; gap:1rem; font-size:0.775rem; color:var(--text-secondary); margin-bottom:1rem; background:var(--bg-tertiary); padding:0.5rem 0.75rem; border-radius:var(--radius-sm);">
                    <span>❓ ${q.questionCount} Questions</span>
                    <span>⏱ ${q.timeLimit}</span>
                  </div>

                  <div style="margin-bottom:1.15rem; font-size:0.8rem;">
                    ${q.bestScore !== null ? `
                      <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="color:var(--text-muted);">Best Score:</span>
                        <strong style="color:${q.bestScore >= 75 ? '#10B981' : '#FBBF24'};">${q.bestScore}% (${q.status})</strong>
                      </div>
                    ` : `
                      <span style="color:var(--text-muted);">Status: <em>Not attempted yet</em></span>
                    `}
                  </div>
                </div>

                <button class="btn btn-primary btn-sm" style="width:100%; justify-content:center;" onclick="Quiz.startQuiz('${q.id}'); Router.renderQuiz();">
                  ${q.bestScore !== null ? '🔁 Retake Quiz' : '🚀 Start Quiz'}
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- RECENT QUIZ ATTEMPTS HISTORY -->
        <div class="card">
          <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-primary); margin-bottom:1rem;">
            📊 Recent Quiz Attempts & Accuracy
          </h3>

          ${history.length > 0 ? `
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Quiz Title</th>
                    <th>Score %</th>
                    <th>Correct / Total</th>
                    <th>Time Spent</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${history.slice().reverse().slice(0, 6).map(h => `
                    <tr>
                      <td><strong>${h.topicName}</strong></td>
                      <td>
                        <span style="font-weight:700; color:${h.score >= 75 ? '#10B981' : '#FBBF24'};">
                          ${h.score}%
                        </span>
                      </td>
                      <td>${h.correctCount} / ${h.totalQuestions}</td>
                      <td>${h.timeSpent || '1 min'}</td>
                      <td>${new Date(h.timestamp || Date.now()).toLocaleDateString()}</td>
                      <td>
                        <button class="btn btn-secondary btn-sm" onclick="Quiz.startQuiz('${h.topicId}'); Router.renderQuiz();">
                          Retake
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : `
            <p style="font-size:0.875rem; color:var(--text-muted); margin:0;">
              No quiz attempts recorded yet. Click <strong>Start Quiz</strong> on any card above to take your first test.
            </p>
          `}
        </div>
      </div>
    `;
  }

  startQuiz(targetId = 'TOP_DBMS_NORM', difficulty = null) {
    let questions = [];
    let topicName = 'Adaptive Evaluation Quiz';

    // 1. Check if targetId is a Subject or Topic
    if (targetId.startsWith('SUB_')) {
      const subject = Storage.getSubjects().find(s => s.id === targetId);
      if (!subject) {
        if (window.Notifications) Notifications.toast('Subject not found.', 'error');
        return false;
      }
      topicName = `${subject.name} Subject Quiz`;
      questions = Storage.getQuestionsBySubject(targetId);
    } else {
      const topic = Storage.getTopics().find(t => t.id === targetId);
      if (!topic) {
        if (window.Notifications) Notifications.toast('Topic not found.', 'error');
        return false;
      }
      topicName = topic.name;
      questions = Storage.getQuestionsByTopic(targetId);
    }

    if (!questions || questions.length === 0) {
      if (window.Notifications) {
        Notifications.toast('More verified questions will be added soon for this topic.', 'warning', 4500);
      }
      return false;
    }

    let activePool = questions;
    if (difficulty) {
      const filtered = questions.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
      if (filtered.length > 0) activePool = filtered;
    }

    const shuffled = [...activePool].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(shuffled.length, 5));

    this.currentQuiz = {
      topicId: targetId,
      topicName: topicName,
      questions: selectedQuestions
    };

    this.currentIndex = 0;
    this.userAnswers = new Array(selectedQuestions.length).fill(null);
    this.secondsElapsed = 0;
    this.viewMode = 'active';

    this.startTimer();
    return true;
  }

  exitQuiz() {
    this.stopTimer();
    this.currentQuiz = null;
    this.viewMode = 'hub';
    if (window.Router) Router.navigate('/quiz');
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.secondsElapsed++;
      this.updateTimerDisplay();
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimerDisplay() {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('quiz-timer-display');
    if (el) {
      const mins = Math.floor(this.secondsElapsed / 60).toString().padStart(2, '0');
      const secs = (this.secondsElapsed % 60).toString().padStart(2, '0');
      el.textContent = `${mins}:${secs}`;
    }
  }

  selectAnswer(optionIndex) {
    this.userAnswers[this.currentIndex] = optionIndex;
  }

  nextQuestion() {
    if (this.currentQuiz && this.currentIndex < this.currentQuiz.questions.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  previousQuestion() {
    if (this.currentQuiz && this.currentIndex > 0) {
      this.currentIndex--;
      return true;
    }
    return false;
  }

  submitQuiz() {
    this.stopTimer();

    if (!this.currentQuiz) return null;

    let correctCount = 0;
    const details = [];

    this.currentQuiz.questions.forEach((q, idx) => {
      const selected = this.userAnswers[idx];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;

      details.push({
        questionId: q.id,
        question: q.question,
        selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        concept: q.concept
      });
    });

    const totalQuestions = this.currentQuiz.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    const currentUser = Auth.getCurrentUser();
    const mins = Math.floor(this.secondsElapsed / 60);
    const secs = this.secondsElapsed % 60;
    const timeSpent = `${mins}m ${secs}s`;

    const result = {
      id: 'QUIZ_' + Date.now(),
      studentId: currentUser ? currentUser.id : 'ECB0245',
      topicId: this.currentQuiz.topicId,
      topicName: this.currentQuiz.topicName,
      score,
      correctCount,
      totalQuestions,
      details,
      timeSpent,
      timestamp: new Date().toISOString()
    };

    Storage.saveQuizResult(result);
    this.lastResult = result;
    this.viewMode = 'results';
    return result;
  }

  renderActiveQuiz(containerId = 'page-body-container') {
    const container = document.getElementById(containerId);
    if (!container || !this.currentQuiz) {
      this.renderHub(containerId);
      return;
    }

    const q = this.currentQuiz.questions[this.currentIndex];

    container.innerHTML = `
      <div class="card card-gradient-border fade-in" style="max-width:740px; margin:0 auto; padding:2rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; border-bottom:1px solid var(--border-color); padding-bottom:0.85rem;">
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">
              ${this.currentQuiz.topicName}
            </div>
            <h2 style="font-size:1.2rem; font-weight:800; color:var(--text-primary); margin-top:0.15rem;">
              Question ${this.currentIndex + 1} of ${this.currentQuiz.questions.length}
            </h2>
          </div>
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <button class="btn btn-secondary btn-sm" style="color:var(--accent-cyan); font-weight:700;" onclick="Quiz.showNexaHint()" title="Get a conceptual hint from NexaAI">
              💡 Need a Hint?
            </button>
            <div style="background:var(--bg-tertiary); padding:0.4rem 0.85rem; border-radius:var(--radius-sm); font-weight:700; color:var(--accent-cyan); font-family:monospace; border:1px solid var(--border-color);">
              ⏱ <span id="quiz-timer-display">00:00</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="Quiz.exitQuiz()" title="Exit Quiz">
              ✖ Exit
            </button>
          </div>
        </div>

        <div style="font-size:1.05rem; font-weight:600; color:var(--text-primary); margin-bottom:1.5rem; line-height:1.5;">
          ${q.question}
        </div>

        <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.75rem;">
          ${q.options.map((opt, idx) => {
            const isSelected = this.userAnswers[this.currentIndex] === idx;
            return `
              <button class="btn ${isSelected ? 'btn-primary' : 'btn-secondary'}" style="justify-content:flex-start; text-align:left; padding:0.85rem 1.15rem; border-radius:var(--radius-sm);" onclick="Quiz.selectAnswer(${idx}); Router.renderQuiz();">
                <strong style="margin-right:0.6rem;">${String.fromCharCode(65 + idx)}.</strong> ${opt}
              </button>
            `;
          }).join('')}
        </div>

        <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid var(--border-color); padding-top:1.25rem;">
          <button class="btn btn-secondary btn-sm" onclick="Quiz.previousQuestion(); Router.renderQuiz();" ${this.currentIndex === 0 ? 'disabled' : ''}>
            ← Previous
          </button>
          ${this.currentIndex < this.currentQuiz.questions.length - 1 ? `
            <button class="btn btn-primary btn-sm" onclick="Quiz.nextQuestion(); Router.renderQuiz();">
              Next Question →
            </button>
          ` : `
            <button class="btn btn-primary btn-sm" onclick="const res = Quiz.submitQuiz(); Router.renderQuizResults(res);">
              Submit Quiz <i class="ri-check-double-line"></i>
            </button>
          `}
        </div>
      </div>
    `;

    this.updateTimerDisplay();
  }

  showNexaHint() {
    if (!this.currentQuiz) return;
    const q = this.currentQuiz.questions[this.currentIndex];
    const hintRes = window.AIEngine ? AIEngine.askNexaAI('Need a hint', { question: q }) : { reply: 'Focus on core rules.' };

    if (window.Notifications) {
      Notifications.openModal('💡 NexaAI Conceptual Hint', `
        <div style="padding:0.5rem; font-size:0.9rem; color:var(--text-primary); line-height:1.5;">
          ${hintRes.reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
        </div>
      `, `<button class="btn btn-secondary" onclick="Notifications.closeModal()">Got it</button>`);
    }
  }

  executeNexaAction(actionType, targetTopicId) {
    if (actionType === 'TARGETED_REVISION' || actionType === 'REVIEW_PREREQUISITE') {
      if (targetTopicId) {
        const questions = Storage.getQuestionsByTopic(targetTopicId);
        if (questions && questions.length > 0) {
          const started = this.startQuiz(targetTopicId);
          if (started && window.Router) {
            Router.renderQuiz();
            if (window.Notifications) {
              Notifications.toast(`✦ NexaAI: Initiating targeted revision quiz on prerequisite...`, 'info', 4000);
            }
            return;
          }
        }
      }
      if (window.Router) {
        Router.navigate('/learning-path');
        if (window.Notifications) {
          Notifications.toast('✦ NexaAI: Directing to your Personalized Learning Path...', 'info', 4000);
        }
      }
    } else {
      if (window.Router) {
        Router.navigate('/learning-path');
        if (window.Notifications) {
          Notifications.toast('✦ NexaAI: Proceeding with recommended learning sequence...', 'success', 3500);
        }
      }
    }
  }

  renderResults(res = this.lastResult, containerId = 'page-body-container') {
    const container = document.getElementById(containerId);
    if (!container || !res) {
      this.renderHub(containerId);
      return;
    }

    const nexa = window.AIEngine ? AIEngine.getNexaAIInsight(res) : null;
    const riskBadgeClass = nexa ? (nexa.riskLevel === 'HIGH' ? 'badge-high' : nexa.riskLevel === 'MEDIUM' ? 'badge-medium' : 'badge-low') : 'badge-secondary';
    const riskColor = nexa ? (nexa.riskLevel === 'HIGH' ? '#EF4444' : nexa.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981') : '#06B6D4';

    container.innerHTML = `
      <div class="card card-gradient-border fade-in" style="max-width:820px; margin:0 auto; padding:2rem; text-align:center;">
        <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-primary); margin-bottom:0.35rem;">
          QUIZ EVALUATION COMPLETE
        </h2>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1.5rem;">${res.topicName}</p>

        <div style="width:130px; height:130px; border-radius:50%; background:var(--bg-tertiary); border:4px solid ${res.score >= 75 ? '#10B981' : '#F59E0B'}; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:0 auto 1.5rem auto;">
          <div style="font-size:2.2rem; font-weight:800; color:${res.score >= 75 ? '#10B981' : '#F59E0B'};">${res.score}%</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${res.correctCount} / ${res.totalQuestions} Correct</div>
        </div>

        <p style="font-size:0.925rem; color:var(--text-secondary); margin-bottom:1.75rem; max-width:580px; margin-left:auto; margin-right:auto;">
          ${res.score >= 75 
            ? '🎉 Outstanding performance! Your mastery for this topic has been updated on your Learning Path.' 
            : '💡 Diagnostic alert: Topic marked as Needs Revision. Your Learning Path has been updated with personalized study recommendations.'}
        </p>

        <!-- NEXAAI LEARNING INTELLIGENCE CARD -->
        ${nexa ? `
          <div class="card card-gradient-border" style="margin-bottom:1.75rem; text-align:left; background:var(--bg-secondary); border-left:4px solid ${riskColor}; border-radius:var(--radius-md);">
            <!-- CARD HEADER -->
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; border-bottom:1px solid var(--border-color); padding-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
              <div style="display:flex; align-items:center; gap:0.6rem;">
                <span style="font-size:1.4rem; color:var(--accent-cyan);">✦</span>
                <div>
                  <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-primary); margin:0; letter-spacing:-0.01em;">
                    NexaAI
                  </h3>
                  <div style="font-size:0.75rem; color:var(--accent-cyan); font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">
                    EduNexus Learning Intelligence
                  </div>
                </div>
              </div>
              <span class="badge ${riskBadgeClass}" style="font-size:0.8rem; padding:0.35rem 0.75rem; font-weight:800;">
                ⚡ ${nexa.riskLevel} RISK
              </span>
            </div>

            <!-- ANALYTICAL REASONING CHAIN -->
            <div style="margin-bottom:1.25rem; background:var(--bg-tertiary); padding:0.85rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
              <div style="font-size:0.725rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.6rem;">
                🧠 NexaAI Analytical Reasoning Chain
              </div>
              <div style="display:flex; align-items:center; flex-wrap:wrap; gap:0.4rem 0.6rem; font-size:0.8rem;">
                <span style="background:var(--bg-primary); padding:0.25rem 0.65rem; border-radius:4px; border:1px solid var(--border-color); font-weight:600; color:var(--text-primary);">
                  🎯 Quiz Score: ${res.score}%
                </span>
                <span style="color:var(--text-muted);">→</span>
                <span style="background:var(--bg-primary); padding:0.25rem 0.65rem; border-radius:4px; border:1px solid var(--border-color); font-weight:600; color:${nexa.weakTopic ? '#EF4444' : '#10B981'};">
                  ⚠️ Weak Topic: ${nexa.weakTopic ? nexa.weakTopic.name : 'None'}
                </span>
                <span style="color:var(--text-muted);">→</span>
                <span style="background:var(--bg-primary); padding:0.25rem 0.65rem; border-radius:4px; border:1px solid var(--border-color); font-weight:600; color:${nexa.prerequisiteGap ? '#F59E0B' : '#10B981'};">
                  🔗 Prerequisite: ${nexa.prerequisiteGap ? nexa.prerequisiteGap.name : 'None Detected'}
                </span>
                <span style="color:var(--text-muted);">→</span>
                <span class="badge ${riskBadgeClass}" style="font-size:0.75rem;">
                  ${nexa.riskLevel} RISK
                </span>
              </div>
            </div>

            <!-- THREE METRIC CARDS -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.25rem;">
              <div style="background:var(--bg-tertiary); padding:0.85rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                <div style="font-size:0.725rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Weak Topic</div>
                <div style="font-size:0.925rem; font-weight:700; color:var(--text-primary); margin-top:0.2rem;">
                  ${nexa.weakTopic ? nexa.weakTopic.name : 'No Weak Topic Identified'}
                </div>
              </div>

              <div style="background:var(--bg-tertiary); padding:0.85rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                <div style="font-size:0.725rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Possible Prerequisite Gap</div>
                <div style="font-size:0.925rem; font-weight:700; color:var(--text-primary); margin-top:0.2rem;">
                  ${nexa.prerequisiteGap ? nexa.prerequisiteGap.name : 'None Detected'}
                </div>
              </div>

              <div style="background:var(--bg-tertiary); padding:0.85rem 1rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                <div style="font-size:0.725rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Risk Level</div>
                <div style="font-size:0.95rem; font-weight:800; color:${riskColor}; margin-top:0.2rem;">
                  ${nexa.riskLevel} RISK
                </div>
              </div>
            </div>

            <!-- EXPLANATION -->
            <div style="margin-bottom:1.25rem;">
              <div style="font-size:0.85rem; font-weight:700; color:var(--text-primary); margin-bottom:0.35rem;">
                💡 Why this recommendation?
              </div>
              <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin:0;">
                ${nexa.explanation}
              </p>
            </div>

            <!-- RECOMMENDED ACTION & FUNCTIONAL BUTTON -->
            <div style="background:var(--bg-tertiary); padding:1rem 1.15rem; border-radius:var(--radius-sm); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
              <div>
                <div style="font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Recommended Action</div>
                <div style="font-size:0.9rem; font-weight:700; color:var(--text-primary); margin-top:0.15rem;">
                  ${nexa.recommendedAction}
                </div>
              </div>

              <button class="btn btn-primary" onclick="Quiz.executeNexaAction('${nexa.actionType}', '${nexa.targetTopicId}')">
                ${nexa.actionButtonText} →
              </button>
            </div>
          </div>
        ` : ''}

        <div style="display:flex; justify-content:center; gap:0.85rem; flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="Quiz.renderHub();">
            🎯 Return to Quizzes Hub
          </button>
          <button class="btn btn-primary" onclick="Router.navigate('/learning-path');">
            🌿 View Updated Learning Path →
          </button>
        </div>
      </div>
    `;
  }
}

const Quiz = new QuizEngine();
window.Quiz = Quiz;
