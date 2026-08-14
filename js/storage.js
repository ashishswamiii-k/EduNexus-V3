/* ============================================================
   EDUNEXUS — CENTRAL LOCALSTORAGE DATA MANAGEMENT LAYER
   ============================================================ */

const STORAGE_KEY = 'edunexus_db_v1';

// Initial Demo Dataset to tell the SIH Presentation Story
const DEFAULT_DEMO_DATA = {
  users: [
    {
      id: 'ADMIN001',
      name: 'System Administrator',
      role: 'admin',
      password: 'admin123',
      schoolCode: 'ECB'
    },
    {
      id: 'ECB0245',
      name: 'Demo Student',
      role: 'student',
      password: 'student123',
      schoolCode: 'ECB',
      rollNumber: '0245',
      classId: '10-A',
      streakDays: 5,
      achievements: ['first_quiz', 'streak_5']
    },
    {
      id: 'ECB0246',
      name: 'Rohan Sharma',
      role: 'student',
      password: 'student123',
      schoolCode: 'ECB',
      rollNumber: '0246',
      classId: '10-A',
      streakDays: 3,
      achievements: ['first_quiz']
    },
    {
      id: 'ECB0247',
      name: 'Priya Patel',
      role: 'student',
      password: 'student123',
      schoolCode: 'ECB',
      rollNumber: '0247',
      classId: '10-B',
      streakDays: 7,
      achievements: ['first_quiz', 'topic_master']
    },
    {
      id: 'ECB1234',
      name: 'Demo Teacher',
      role: 'teacher',
      password: 'teacher123',
      schoolCode: 'ECB',
      mobileNumber: '9876541234',
      subject: 'Mathematics',
      assignedClasses: ['10-A']
    }
  ],

  classes: [
    { id: '10-A', name: 'Class 10-A', section: 'A', studentCount: 25 },
    { id: '10-B', name: 'Class 10-B', section: 'B', studentCount: 28 },
    { id: '11-A', name: 'Class 11-A', section: 'A', studentCount: 22 }
  ],

  subjects: [
    { id: 'SUB_MATH', name: 'Mathematics', code: 'MATH10', assignedClasses: ['10-A', '10-B'] },
    { id: 'SUB_SCI', name: 'Science', code: 'SCI10', assignedClasses: ['10-A', '10-B'] },
    { id: 'SUB_ENG', name: 'English', code: 'ENG10', assignedClasses: ['10-A', '10-B', '11-A'] },
    { id: 'SUB_CS', name: 'Computer Science', code: 'CS10', assignedClasses: ['10-A'] }
  ],

  topics: [
    { id: 'TOP_ALG', subjectId: 'SUB_MATH', name: 'Algebra', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_FACT', subjectId: 'SUB_MATH', name: 'Factorization', difficulty: 'Medium', prerequisiteId: 'TOP_ALG' },
    { id: 'TOP_QUAD', subjectId: 'SUB_MATH', name: 'Quadratic Equations', difficulty: 'Hard', prerequisiteId: 'TOP_FACT' },
    { id: 'TOP_GEO', subjectId: 'SUB_MATH', name: 'Geometry', difficulty: 'Medium', prerequisiteId: null },
    { id: 'TOP_TRIG', subjectId: 'SUB_MATH', name: 'Trigonometry', difficulty: 'Hard', prerequisiteId: 'TOP_GEO' },
    { id: 'TOP_STAT', subjectId: 'SUB_MATH', name: 'Statistics', difficulty: 'Easy', prerequisiteId: null },

    { id: 'TOP_PHYS', subjectId: 'SUB_SCI', name: 'Physics - Motion', difficulty: 'Medium', prerequisiteId: null },
    { id: 'TOP_CHEM', subjectId: 'SUB_SCI', name: 'Chemistry - Reactions', difficulty: 'Medium', prerequisiteId: null }
  ],

  questions: [
    {
      id: 'Q001',
      subjectId: 'SUB_MATH',
      topicId: 'TOP_FACT',
      difficulty: 'Medium',
      question: 'What is the factorization of: x² + 5x + 6?',
      options: ['(x+1)(x+6)', '(x+2)(x+3)', '(x+4)(x+2)', 'None of these'],
      correctAnswer: 1,
      explanation: '2 × 3 = 6 and 2 + 3 = 5. Therefore x² + 5x + 6 factors into (x+2)(x+3).'
    },
    {
      id: 'Q002',
      subjectId: 'SUB_MATH',
      topicId: 'TOP_FACT',
      difficulty: 'Medium',
      question: 'Factorize completely: x² - 9',
      options: ['(x-3)²', '(x+3)(x-3)', '(x-9)(x+1)', 'x(x-9)'],
      correctAnswer: 1,
      explanation: 'Difference of squares formula: a² - b² = (a+b)(a-b). Here a=x and b=3.'
    },
    {
      id: 'Q003',
      subjectId: 'SUB_MATH',
      topicId: 'TOP_QUAD',
      difficulty: 'Hard',
      question: 'What are the roots of the equation x² - 5x + 6 = 0?',
      options: ['x = 1, 6', 'x = 2, 3', 'x = -2, -3', 'x = 0, 5'],
      correctAnswer: 1,
      explanation: 'Factoring (x-2)(x-3) = 0 gives roots x = 2 and x = 3.'
    },
    {
      id: 'Q004',
      subjectId: 'SUB_MATH',
      topicId: 'TOP_ALG',
      difficulty: 'Easy',
      question: 'Simplify the expression: 3x + 4x - 2x',
      options: ['5x', '9x', '4x', '6x'],
      correctAnswer: 0,
      explanation: '(3 + 4 - 2)x = 5x.'
    },
    {
      id: 'Q005',
      subjectId: 'SUB_MATH',
      topicId: 'TOP_GEO',
      difficulty: 'Medium',
      question: 'What is the sum of interior angles in a triangle?',
      options: ['90°', '180°', '360°', '270°'],
      correctAnswer: 1,
      explanation: 'The sum of internal angles of any Euclidean triangle is always 180°.'
    }
  ],

  // Seeded Quiz Performance & History for Demo Presentation
  performance: [
    {
      studentId: 'ECB0245',
      topicId: 'TOP_ALG',
      topicName: 'Algebra',
      accuracy: 82,
      totalAttempts: 5,
      status: 'Mastered'
    },
    {
      studentId: 'ECB0245',
      topicId: 'TOP_FACT',
      topicName: 'Factorization',
      accuracy: 43,
      totalAttempts: 4,
      status: 'Needs Focus'
    },
    {
      studentId: 'ECB0245',
      topicId: 'TOP_QUAD',
      topicName: 'Quadratic Equations',
      accuracy: 38,
      totalAttempts: 3,
      status: 'Needs Focus'
    },
    {
      studentId: 'ECB0245',
      topicId: 'TOP_GEO',
      topicName: 'Geometry',
      accuracy: 90,
      totalAttempts: 6,
      status: 'Mastered'
    }
  ],

  quizHistory: [
    {
      id: 'QUIZ_101',
      studentId: 'ECB0245',
      topicId: 'TOP_FACT',
      topicName: 'Factorization',
      score: 40,
      totalQuestions: 5,
      correctCount: 2,
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'QUIZ_102',
      studentId: 'ECB0245',
      topicId: 'TOP_QUAD',
      topicName: 'Quadratic Equations',
      score: 35,
      totalQuestions: 5,
      correctCount: 1,
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ],

  // Interventions assigned by teachers to students
  interventions: [
    {
      id: 'INT_001',
      studentId: 'ECB0245',
      teacherId: 'ECB1234',
      teacherName: 'Demo Teacher',
      topicId: 'TOP_FACT',
      topicName: 'Factorization',
      type: 'Revision',
      note: 'Please complete the prerequisite Factorization practice before taking the Quadratic Equations quiz.',
      createdAt: new Date().toISOString(),
      status: 'Active'
    }
  ],

  notifications: [
    {
      id: 'NOTIF_001',
      userId: 'ECB0245',
      title: 'Teacher Recommended Activity',
      message: 'Demo Teacher recommended revising Factorization.',
      type: 'warning',
      timestamp: new Date().toISOString(),
      read: false
    }
  ],

  settings: {
    theme: 'dark'
  }
};

class StorageManager {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.resetDemoData();
    }
  }

  getDb() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : DEFAULT_DEMO_DATA;
    } catch (e) {
      console.error('Error reading LocalStorage', e);
      return DEFAULT_DEMO_DATA;
    }
  }

  saveDb(db) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Error saving to LocalStorage', e);
    }
  }

  resetDemoData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_DATA));
  }

  // User CRUD
  getUsers() { return this.getDb().users || []; }
  getUserById(id) { return this.getUsers().find(u => u.id.toLowerCase() === id.toLowerCase()); }
  addUser(user) {
    const db = this.getDb();
    db.users.push(user);
    this.saveDb(db);
  }
  updateUser(id, updatedFields) {
    const db = this.getDb();
    const idx = db.users.findIndex(u => u.id.toLowerCase() === id.toLowerCase());
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...updatedFields };
      this.saveDb(db);
    }
  }

  // Classes CRUD
  getClasses() { return this.getDb().classes || []; }
  addClass(cls) {
    const db = this.getDb();
    db.classes.push(cls);
    this.saveDb(db);
  }

  // Subjects & Topics CRUD
  getSubjects() { return this.getDb().subjects || []; }
  addSubject(sub) {
    const db = this.getDb();
    db.subjects.push(sub);
    this.saveDb(db);
  }
  getTopics() { return this.getDb().topics || []; }
  getTopicsBySubject(subjectId) {
    return this.getTopics().filter(t => t.subjectId === subjectId);
  }
  addTopic(topic) {
    const db = this.getDb();
    db.topics.push(topic);
    this.saveDb(db);
  }

  // Question Bank CRUD
  getQuestions() { return this.getDb().questions || []; }
  getQuestionsByTopic(topicId) {
    return this.getQuestions().filter(q => q.topicId === topicId);
  }
  addQuestion(q) {
    const db = this.getDb();
    db.questions.push(q);
    this.saveDb(db);
  }

  // Performance & Quiz Record Updates
  getPerformance(studentId) {
    return (this.getDb().performance || []).filter(p => p.studentId === studentId);
  }

  saveQuizResult(result) {
    const db = this.getDb();
    if (!db.quizHistory) db.quizHistory = [];
    db.quizHistory.push(result);

    // Update topic accuracy
    if (!db.performance) db.performance = [];
    let p = db.performance.find(x => x.studentId === result.studentId && x.topicId === result.topicId);
    if (p) {
      p.totalAttempts = (p.totalAttempts || 0) + 1;
      p.accuracy = Math.round((p.accuracy + result.score) / 2);
      p.status = p.accuracy >= 75 ? 'Mastered' : 'Needs Focus';
    } else {
      db.performance.push({
        studentId: result.studentId,
        topicId: result.topicId,
        topicName: result.topicName,
        accuracy: result.score,
        totalAttempts: 1,
        status: result.score >= 75 ? 'Mastered' : 'Needs Focus'
      });
    }

    this.saveDb(db);
  }

  // Interventions CRUD
  getInterventions(studentId) {
    const list = this.getDb().interventions || [];
    return studentId ? list.filter(i => i.studentId === studentId) : list;
  }

  addIntervention(intervention) {
    const db = this.getDb();
    if (!db.interventions) db.interventions = [];
    db.interventions.push(intervention);
    
    // Auto-create notification for student
    if (!db.notifications) db.notifications = [];
    db.notifications.push({
      id: 'NOTIF_' + Date.now(),
      userId: intervention.studentId,
      title: 'Teacher Recommended Activity',
      message: `${intervention.teacherName} recommended: ${intervention.note}`,
      type: 'warning',
      timestamp: new Date().toISOString(),
      read: false
    });

    this.saveDb(db);
  }

  // Notifications
  getNotifications(userId) {
    return (this.getDb().notifications || []).filter(n => n.userId === userId);
  }
}

const Storage = new StorageManager();
window.Storage = Storage;
