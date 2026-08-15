/* ============================================================
   EDUNEXUS — MINDFUL BREAK MINI-GAME SYSTEM
   5 ROTATING FOCUS & WELLNESS REFRESH MINI-GAMES
   ============================================================ */

class MindfulBreakController {
  constructor() {
    this.timerInterval = null;
    this.timeLeft = 60;
    this.currentGameIndex = 0;
    this.gameState = {};
  }

  getTodayKey() {
    return new Date().toISOString().split('T')[0];
  }

  isDailyGoalCompleted(studentId = 'ECB0245') {
    const tasks = Storage.getTodoList(studentId);
    if (!tasks || tasks.length === 0) return false;
    const completedCount = tasks.filter(t => t.completed).length;
    return completedCount >= 1;
  }

  hasCompletedToday(studentId = 'ECB0245') {
    const user = Storage.getUserById(studentId) || Auth.getCurrentUser();
    if (!user || !user.mindfulHistory) return false;
    const today = this.getTodayKey();
    return user.mindfulHistory.some(h => h.date === today);
  }

  startSession(studentId = 'ECB0245') {
    if (!this.isDailyGoalCompleted(studentId)) {
      if (window.Notifications) Notifications.toast('Complete today\'s learning goals to unlock your mindful break!', 'warning');
      return;
    }

    if (this.hasCompletedToday(studentId)) {
      if (window.Notifications) Notifications.toast('You have already completed today\'s Mindful Break!', 'info');
      return;
    }

    this.currentGameIndex = Math.floor(Math.random() * 5);
    this.openStartModal();
  }

  openStartModal() {
    const gameTitles = [
      '🧠 Memory Match',
      '🎯 Pattern Recall',
      '⚡ Focus Tap',
      '🧩 Number Sequence',
      '📚 Word Recall'
    ];
    const gameDescs = [
      'Flip cards and match matching pairs.',
      'Remember and repeat the shape sequence.',
      'Tap only the target floating shapes.',
      'Solve the missing number patterns.',
      'Remember words flashed on screen.'
    ];

    const modalHtml = `
      <div id="mindful-modal-overlay" class="modal-overlay active">
        <div class="modal-container fade-in" style="max-width: 520px; padding: 2rem;">
          <div class="modal-header" style="border-bottom: 1px solid var(--border-color); padding-bottom: 0.85rem;">
            <h3 class="modal-title" style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">
              🧠 MINDFUL BREAK
            </h3>
            <button class="modal-close" onclick="MindfulBreak.closeModal()">&times;</button>
          </div>
          <div class="modal-body" style="text-align: center; padding: 1.5rem 0;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">🌿</div>
            <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.35rem;">
              ${gameTitles[this.currentGameIndex]}
            </h4>
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem;">
              ${gameDescs[this.currentGameIndex]}
            </p>
            <div style="background: var(--bg-tertiary); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-size: 0.8rem; color: var(--accent-cyan); font-weight: 600; margin-bottom: 1.5rem;">
              ⏱ Duration: ~60 Seconds • Focus Refresh • Award: +20 XP
            </div>
            <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="MindfulBreak.launchGame()">
              Start Mindful Break →
            </button>
          </div>
        </div>
      </div>
    `;

    this.removeModal();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  launchGame() {
    this.timeLeft = 60;
    this.renderGameContainer();
    this.startTimer();

    switch (this.currentGameIndex) {
      case 0: this.initMemoryMatch(); break;
      case 1: this.initPatternRecall(); break;
      case 2: this.initFocusTap(); break;
      case 3: this.initNumberSequence(); break;
      case 4: this.initWordRecall(); break;
      default: this.initMemoryMatch(); break;
    }
  }

  renderGameContainer() {
    const modalHtml = `
      <div id="mindful-modal-overlay" class="modal-overlay active">
        <div class="modal-container fade-in" style="max-width: 560px; padding: 1.75rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 0.85rem; margin-bottom: 1.25rem;">
            <div>
              <span class="badge badge-purple" style="font-size: 0.7rem;">🧠 Mindful Break</span>
              <h3 id="mindful-game-title" style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 0.15rem;">Loading Game...</h3>
            </div>
            <div style="background: var(--bg-tertiary); padding: 0.4rem 0.85rem; border-radius: var(--radius-sm); font-weight: 700; color: var(--accent-cyan); font-family: monospace;">
              ⏱ <span id="mindful-timer-val">00:60</span>
            </div>
          </div>
          <div id="mindful-game-body" style="min-height: 260px; display: flex; flex-direction: column; justify-content: center;">
          </div>
        </div>
      </div>
    `;
    this.removeModal();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      const el = document.getElementById('mindful-timer-val');
      if (el) el.textContent = `00:${this.timeLeft < 10 ? '0' + this.timeLeft : this.timeLeft}`;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.finishGame(70, 75); // Fallback finish on time out
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  removeModal() {
    const el = document.getElementById('mindful-modal-overlay');
    if (el) el.remove();
  }

  closeModal() {
    this.stopTimer();
    this.removeModal();
  }

  // ============================================================
  // GAME 1 — MEMORY MATCH
  // ============================================================
  initMemoryMatch() {
    document.getElementById('mindful-game-title').textContent = '🧩 Memory Match';
    const items = ['🟦', '🟩', '🟨', '🟥', '🟦', '🟩', '🟨', '🟥'];
    items.sort(() => Math.random() - 0.5);

    this.gameState = {
      cards: items.map((val, idx) => ({ id: idx, val, flipped: false, matched: false })),
      flippedIndices: [],
      matchedCount: 0,
      attempts: 0
    };

    this.renderMemoryMatch();
  }

  renderMemoryMatch() {
    const body = document.getElementById('mindful-game-body');
    if (!body) return;

    body.innerHTML = `
      <div style="font-size: 0.85rem; color: var(--text-muted); text-align: center; margin-bottom: 1rem;">
        Match all 4 pair colors • Attempts: <strong>${this.gameState.attempts}</strong>
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.85rem; max-width: 380px; margin: 0 auto;">
        ${this.gameState.cards.map((c, i) => `
          <button class="card" style="height: 75px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; cursor: pointer; background: ${c.flipped || c.matched ? 'var(--bg-tertiary)' : 'var(--gradient-primary)'}; border: 1px solid var(--border-color); ${c.matched ? 'opacity: 0.5;' : ''}" onclick="MindfulBreak.flipMemoryCard(${i})">
            ${c.flipped || c.matched ? c.val : '❓'}
          </button>
        `).join('')}
      </div>
    `;
  }

  flipMemoryCard(idx) {
    const { cards, flippedIndices } = this.gameState;
    if (cards[idx].flipped || cards[idx].matched || flippedIndices.length >= 2) return;

    cards[idx].flipped = true;
    flippedIndices.push(idx);
    this.renderMemoryMatch();

    if (flippedIndices.length === 2) {
      this.gameState.attempts++;
      const [i1, i2] = flippedIndices;
      if (cards[i1].val === cards[i2].val) {
        cards[i1].matched = true;
        cards[i2].matched = true;
        this.gameState.matchedCount += 2;
        this.gameState.flippedIndices = [];
        this.renderMemoryMatch();

        if (this.gameState.matchedCount === cards.length) {
          const accuracy = Math.max(50, Math.round((4 / this.gameState.attempts) * 100));
          const focusScore = Math.min(100, Math.round(accuracy * 0.95 + 10));
          setTimeout(() => this.finishGame(accuracy, focusScore), 600);
        }
      } else {
        setTimeout(() => {
          cards[i1].flipped = false;
          cards[i2].flipped = false;
          this.gameState.flippedIndices = [];
          this.renderMemoryMatch();
        }, 800);
      }
    }
  }

  // ============================================================
  // GAME 2 — PATTERN RECALL
  // ============================================================
  initPatternRecall() {
    document.getElementById('mindful-game-title').textContent = '🎯 Pattern Recall';
    const symbols = ['●', '■', '▲', '★'];
    const pattern = [
      symbols[Math.floor(Math.random() * 4)],
      symbols[Math.floor(Math.random() * 4)],
      symbols[Math.floor(Math.random() * 4)],
      symbols[Math.floor(Math.random() * 4)]
    ];

    this.gameState = {
      symbols,
      pattern,
      userPattern: [],
      showingPattern: true
    };

    const body = document.getElementById('mindful-game-body');
    body.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
          Memorize the pattern sequence below!
        </div>
        <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem;">
          ${pattern.map(s => `<div class="card" style="font-size: 2.2rem; padding: 0.85rem 1.25rem; color: var(--accent-cyan);">${s}</div>`).join('')}
        </div>
        <div style="font-size: 0.8rem; color: var(--accent-purple); font-weight: 600;">
          Hiding sequence in 3 seconds...
        </div>
      </div>
    `;

    setTimeout(() => {
      this.gameState.showingPattern = false;
      this.renderPatternInput();
    }, 3000);
  }

  renderPatternInput() {
    const body = document.getElementById('mindful-game-body');
    if (!body) return;
    const { symbols, userPattern, pattern } = this.gameState;

    body.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          Tap buttons in the correct sequence (${userPattern.length} of ${pattern.length}):
        </div>
        <div style="display: flex; justify-content: center; gap: 0.85rem; margin-bottom: 1.5rem; min-height: 50px;">
          ${userPattern.map(s => `<div class="card" style="font-size: 1.8rem; padding: 0.5rem 1rem;">${s}</div>`).join('')}
        </div>
        <div style="display: flex; justify-content: center; gap: 0.85rem;">
          ${symbols.map(s => `
            <button class="btn btn-secondary btn-lg" style="font-size: 1.5rem; width: 60px; height: 60px;" onclick="MindfulBreak.tapPatternSymbol('${s}')">
              ${s}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  tapPatternSymbol(symbol) {
    if (this.gameState.showingPattern) return;
    this.gameState.userPattern.push(symbol);
    this.renderPatternInput();

    if (this.gameState.userPattern.length === this.gameState.pattern.length) {
      let correct = 0;
      this.gameState.pattern.forEach((s, idx) => {
        if (s === this.gameState.userPattern[idx]) correct++;
      });
      const accuracy = Math.round((correct / this.gameState.pattern.length) * 100);
      const focusScore = Math.min(100, accuracy + 5);
      setTimeout(() => this.finishGame(accuracy, focusScore), 500);
    }
  }

  // ============================================================
  // GAME 3 — FOCUS TAP
  // ============================================================
  initFocusTap() {
    document.getElementById('mindful-game-title').textContent = '⚡ Focus Tap';
    this.gameState = {
      tappedCorrect: 0,
      totalTargets: 4,
      items: [
        { id: 1, color: 'cyan', isTarget: true, label: '🔵 Circle' },
        { id: 2, color: 'purple', isTarget: false, label: '🟣 Square' },
        { id: 3, color: 'cyan', isTarget: true, label: '🔵 Circle' },
        { id: 4, color: 'amber', isTarget: false, label: '🟠 Triangle' },
        { id: 5, color: 'cyan', isTarget: true, label: '🔵 Circle' },
        { id: 6, color: 'cyan', isTarget: true, label: '🔵 Circle' }
      ]
    };

    this.renderFocusTap();
  }

  renderFocusTap() {
    const body = document.getElementById('mindful-game-body');
    if (!body) return;

    body.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 0.9rem; font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.5rem;">
          Instruction: Tap ONLY the BLUE Circles! (${this.gameState.tappedCorrect} / ${this.gameState.totalTargets})
        </div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
          ${this.gameState.items.map(item => `
            <button class="card card-gradient-border" style="padding: 1.25rem 0.85rem; font-weight: 700; cursor: pointer; background: var(--bg-tertiary);" onclick="MindfulBreak.tapFocusItem(${item.id})">
              ${item.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  tapFocusItem(itemId) {
    const item = this.gameState.items.find(i => i.id === itemId);
    if (!item) return;

    if (item.isTarget) {
      this.gameState.tappedCorrect++;
      this.gameState.items = this.gameState.items.filter(i => i.id !== itemId);
      this.renderFocusTap();

      if (this.gameState.tappedCorrect >= this.gameState.totalTargets) {
        setTimeout(() => this.finishGame(95, 92), 400);
      }
    } else {
      if (window.Notifications) Notifications.toast('Oops! That was not a Blue Circle.', 'warning');
    }
  }

  // ============================================================
  // GAME 4 — NUMBER SEQUENCE
  // ============================================================
  initNumberSequence() {
    document.getElementById('mindful-game-title').textContent = '🧩 Number Sequence';
    this.gameState = {
      qIndex: 0,
      correctCount: 0,
      questions: [
        { seq: '2 → 4 → 6 → ? → 10', answer: 8, options: [7, 8, 9, 12] },
        { seq: '5 → 10 → 15 → ? → 25', answer: 20, options: [18, 20, 22, 24] },
        { seq: '3 → 9 → 27 → ? → 243', answer: 81, options: [54, 72, 81, 90] }
      ]
    };

    this.renderNumberSequence();
  }

  renderNumberSequence() {
    const body = document.getElementById('mindful-game-body');
    if (!body) return;
    const q = this.gameState.questions[this.gameState.qIndex];

    body.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
          Sequence Puzzle ${this.gameState.qIndex + 1} of 3
        </div>
        <div style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1.5rem;">
          ${q.seq}
        </div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; max-width: 320px; margin: 0 auto;">
          ${q.options.map(opt => `
            <button class="btn btn-secondary btn-lg" onclick="MindfulBreak.answerNumberSequence(${opt})">
              ${opt}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  answerNumberSequence(val) {
    const q = this.gameState.questions[this.gameState.qIndex];
    if (val === q.answer) this.gameState.correctCount++;

    this.gameState.qIndex++;
    if (this.gameState.qIndex < this.gameState.questions.length) {
      this.renderNumberSequence();
    } else {
      const accuracy = Math.round((this.gameState.correctCount / 3) * 100);
      const focusScore = Math.min(100, accuracy + 10);
      this.finishGame(accuracy, focusScore);
    }
  }

  // ============================================================
  // GAME 5 — WORD RECALL
  // ============================================================
  initWordRecall() {
    document.getElementById('mindful-game-title').textContent = '📚 Word Recall';
    const targetWords = ['BOOK', 'APPLE', 'CHAIR', 'LIGHT', 'RIVER'];
    const extraWords = ['SUN', 'MUSIC', 'DESK', 'STAR'];

    this.gameState = {
      targetWords,
      allWords: [...targetWords, ...extraWords].sort(() => Math.random() - 0.5),
      selected: [],
      showing: true
    };

    const body = document.getElementById('mindful-game-body');
    body.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          Memorize these 5 words!
        </div>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.65rem; margin-bottom: 1.5rem;">
          ${targetWords.map(w => `<span class="badge badge-purple" style="font-size: 1rem; padding: 0.5rem 0.85rem;">${w}</span>`).join('')}
        </div>
        <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 600;">
          Hiding words in 4 seconds...
        </div>
      </div>
    `;

    setTimeout(() => {
      this.gameState.showing = false;
      this.renderWordRecallSelection();
    }, 4000);
  }

  renderWordRecallSelection() {
    const body = document.getElementById('mindful-game-body');
    if (!body) return;
    const { allWords, selected } = this.gameState;

    body.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
          Select the 5 words you saw (${selected.length} / 5):
        </div>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.65rem; margin-bottom: 1.5rem;">
          ${allWords.map(w => {
            const isSel = selected.includes(w);
            return `
              <button class="btn ${isSel ? 'btn-primary' : 'btn-secondary'} btn-sm" onclick="MindfulBreak.toggleWordSelect('${w}')">
                ${w}
              </button>
            `;
          }).join('')}
        </div>
        ${selected.length === 5 ? `
          <button class="btn btn-primary" onclick="MindfulBreak.submitWordRecall()">
            Submit Words ✓
          </button>
        ` : ''}
      </div>
    `;
  }

  toggleWordSelect(word) {
    let { selected } = this.gameState;
    if (selected.includes(word)) {
      this.gameState.selected = selected.filter(w => w !== word);
    } else if (selected.length < 5) {
      this.gameState.selected.push(word);
    }
    this.renderWordRecallSelection();
  }

  submitWordRecall() {
    let correct = 0;
    this.gameState.selected.forEach(w => {
      if (this.gameState.targetWords.includes(w)) correct++;
    });
    const accuracy = Math.round((correct / 5) * 100);
    const focusScore = Math.min(100, accuracy + 8);
    this.finishGame(accuracy, focusScore);
  }

  // ============================================================
  // GAME COMPLETION & REWARD ALLOCATION
  // ============================================================
  finishGame(accuracy, focusScore) {
    this.stopTimer();

    const gameNames = ['Memory Match', 'Pattern Recall', 'Focus Tap', 'Number Sequence', 'Word Recall'];
    const gameName = gameNames[this.currentGameIndex];
    const user = Auth.getCurrentUser() || { id: 'ECB0245' };

    const result = {
      id: 'MB_' + Date.now(),
      date: this.getTodayKey(),
      gameName,
      accuracy,
      focusScore,
      xpEarned: 20,
      timestamp: new Date().toISOString()
    };

    // Save persistence
    Storage.saveMindfulResult(user.id, result);

    const body = document.getElementById('mindful-game-body');
    if (!body) return;

    body.innerHTML = `
      <div class="fade-in" style="text-align: center; padding: 1rem 0;">
        <div style="font-size: 3rem; margin-bottom: 0.35rem;">🎉</div>
        <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">
          MIND BREAK COMPLETE!
        </h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">
          Mental Refresh Activity: <strong>${gameName}</strong>
        </p>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
          <div style="background: var(--bg-tertiary); border-radius: var(--radius-sm); padding: 0.75rem;">
            <div style="font-size: 0.7rem; color: var(--text-muted);">ACCURACY</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--accent-cyan);">${accuracy}%</div>
          </div>
          <div style="background: var(--bg-tertiary); border-radius: var(--radius-sm); padding: 0.75rem;">
            <div style="font-size: 0.7rem; color: var(--text-muted);">FOCUS SCORE</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: var(--accent-purple);">${focusScore}%</div>
          </div>
          <div style="background: var(--bg-tertiary); border-radius: var(--radius-sm); padding: 0.75rem;">
            <div style="font-size: 0.7rem; color: var(--text-muted);">REWARD</div>
            <div style="font-size: 1.2rem; font-weight: 800; color: #10B981;">+20 XP ⭐</div>
          </div>
        </div>

        <button class="btn btn-primary" style="width: 100%;" onclick="MindfulBreak.closeModal(); Router.navigate('/achievements');">
          Continue Learning →
        </button>
      </div>
    `;

    if (window.Notifications) Notifications.toast('Mindful Break completed! +20 XP awarded.', 'success');
  }
}

const MindfulBreak = new MindfulBreakController();
window.MindfulBreak = MindfulBreak;
