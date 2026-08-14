/* ============================================================
   EDUNEXUS — ADAPTIVE QUIZ ENGINE & EVALUATION MODULE
   ============================================================ */

class QuizEngine {
  constructor() {
    this.currentQuiz = null;
    this.currentIndex = 0;
    this.userAnswers = [];
    this.timerInterval = null;
    this.secondsElapsed = 0;
  }

  startQuiz(topicId, difficulty = null) {
    const questions = Storage.getQuestionsByTopic(topicId);
    const topic = Storage.getTopics().find(t => t.id === topicId);

    if (!questions || questions.length === 0) {
      if (window.Notifications) {
        Notifications.toast('No questions available for this topic yet.', 'warning');
      }
      return false;
    }

    // Filter by difficulty if provided, else use all
    let activeQuestions = questions;
    if (difficulty) {
      const filtered = questions.filter(q => q.difficulty === difficulty);
      if (filtered.length > 0) activeQuestions = filtered;
    }

    this.currentQuiz = {
      topicId,
      topicName: topic ? topic.name : 'General Quiz',
      questions: activeQuestions
    };

    this.currentIndex = 0;
    this.userAnswers = new Array(activeQuestions.length).fill(null);
    this.secondsElapsed = 0;

    this.startTimer();
    return true;
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
        selectedOption: selected,
        correctOption: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        options: q.options
      });
    });

    const totalQuestions = this.currentQuiz.questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const currentUser = Auth.getCurrentUser();

    const quizRecord = {
      id: 'QUIZ_' + Date.now(),
      studentId: currentUser ? currentUser.id : 'DEMO_STUDENT',
      topicId: this.currentQuiz.topicId,
      topicName: this.currentQuiz.topicName,
      score: scorePercentage,
      correctCount,
      totalQuestions,
      timeTakenSeconds: this.secondsElapsed,
      timestamp: new Date().toISOString(),
      details
    };

    // Save result to LocalStorage
    Storage.saveQuizResult(quizRecord);

    // Re-run AI engine analysis immediately
    if (currentUser) {
      AIEngine.analyzeStudent(currentUser.id);
    }

    return quizRecord;
  }
}

const Quiz = new QuizEngine();
window.Quiz = Quiz;
