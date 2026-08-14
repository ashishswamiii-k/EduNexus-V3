/* ============================================================
   EDUNEXUS — CENTRAL LOCALSTORAGE DATA MANAGEMENT LAYER
   AI-POWERED PERSONALIZED LEARNING PLATFORM
   ============================================================ */

const STORAGE_KEY = 'edunexus_db_v1';

// Initial Demo Curriculum Dataset (Computer Science & Engineering)
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
      name: 'Ashish Swami',
      role: 'student',
      password: 'student123',
      schoolCode: 'ECB',
      rollNumber: '0245',
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-A',
      streakDays: 7,
      achievements: ['first_quiz', 'streak_5', 'topic_master']
    },
    {
      id: 'ECB0246',
      name: 'Rohan Sharma',
      role: 'student',
      password: 'student123',
      schoolCode: 'ECB',
      rollNumber: '0246',
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-A',
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
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-B',
      streakDays: 10,
      achievements: ['first_quiz', 'topic_master', 'fast_improver']
    },
    {
      id: 'ECB1234',
      name: 'Dr. R.K. Mehta',
      role: 'teacher',
      password: 'teacher123',
      schoolCode: 'ECB',
      mobileNumber: '9876541234',
      subject: 'Database Management Systems',
      assignedClasses: ['Sec-A']
    }
  ],

  classes: [
    { id: 'Sec-A', name: 'Computer Science - Section A', section: 'A', studentCount: 62 },
    { id: 'Sec-B', name: 'Computer Science - Section B', section: 'B', studentCount: 58 }
  ],

  subjects: [
    // Semester 3 Subjects
    { id: 'SUB_DBMS', name: 'Database Management Systems', code: 'DBMS101', semester: 'Semester 3', assignedClasses: ['Sec-A', 'Sec-B'] },
    { id: 'SUB_DSA', name: 'Data Structures & Algorithms', code: 'DSA101', semester: 'Semester 3', assignedClasses: ['Sec-A', 'Sec-B'] },
    { id: 'SUB_OOPS', name: 'Object Oriented Programming', code: 'OOP101', semester: 'Semester 3', assignedClasses: ['Sec-A', 'Sec-B'] },
    { id: 'SUB_DELD', name: 'Digital Electronics & Logic Design', code: 'DIG101', semester: 'Semester 3', assignedClasses: ['Sec-A', 'Sec-B'] },
    { id: 'SUB_AEM', name: 'Advanced Engineering Mathematics', code: 'MAT101', semester: 'Semester 3', assignedClasses: ['Sec-A', 'Sec-B'] },

    // Semester 4 Subjects
    { id: 'SUB_DM', name: 'Discrete Mathematics', code: 'MAT102', semester: 'Semester 4', assignedClasses: ['Sec-A', 'Sec-B'] },
    { id: 'SUB_COA', name: 'Computer Organization & Architecture', code: 'COA101', semester: 'Semester 4', assignedClasses: ['Sec-A', 'Sec-B'] },
    { id: 'SUB_OS', name: 'Operating Systems', code: 'OS101', semester: 'Semester 4', assignedClasses: ['Sec-A', 'Sec-B'] }
  ],

  topics: [
    // DBMS Topics
    { id: 'TOP_DBMS_ER', subjectId: 'SUB_DBMS', unit: 'Unit 1', name: 'ER Diagrams & Data Modeling', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_DBMS_REL', subjectId: 'SUB_DBMS', unit: 'Unit 2', name: 'Relational Algebra & Tuple Calculus', difficulty: 'Easy', prerequisiteId: 'TOP_DBMS_ER' },
    { id: 'TOP_DBMS_NORM', subjectId: 'SUB_DBMS', unit: 'Unit 3', name: 'DBMS Normalization (1NF, 2NF, 3NF, BCNF)', difficulty: 'Medium', prerequisiteId: 'TOP_DBMS_REL' },
    { id: 'TOP_DBMS_TRANS', subjectId: 'SUB_DBMS', unit: 'Unit 4', name: 'Transaction Processing & ACID Properties', difficulty: 'Hard', prerequisiteId: 'TOP_DBMS_NORM' },
    { id: 'TOP_DBMS_INDEX', subjectId: 'SUB_DBMS', unit: 'Unit 5', name: 'Indexing & B-Tree Query Optimization', difficulty: 'Hard', prerequisiteId: 'TOP_DBMS_TRANS' },

    // DSA Topics
    { id: 'TOP_DS_ARR', subjectId: 'SUB_DSA', unit: 'Unit 1', name: 'Arrays, Stacks & Queues', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_DS_LINK', subjectId: 'SUB_DSA', unit: 'Unit 2', name: 'Singly & Doubly Linked Lists', difficulty: 'Medium', prerequisiteId: 'TOP_DS_ARR' },
    { id: 'TOP_DS_BST', subjectId: 'SUB_DSA', unit: 'Unit 3', name: 'Binary Search Trees & AVL Trees', difficulty: 'Hard', prerequisiteId: 'TOP_DS_LINK' },
    { id: 'TOP_DS_GRAPH', subjectId: 'SUB_DSA', unit: 'Unit 4', name: 'Graph Traversal (DFS/BFS) & Shortest Path', difficulty: 'Hard', prerequisiteId: 'TOP_DS_BST' },

    // OOPs Topics
    { id: 'TOP_OOP_CLASS', subjectId: 'SUB_OOPS', unit: 'Unit 1', name: 'Classes, Objects & Constructors', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_OOP_POLY', subjectId: 'SUB_OOPS', unit: 'Unit 2', name: 'Inheritance & Polymorphism', difficulty: 'Medium', prerequisiteId: 'TOP_OOP_CLASS' },
    { id: 'TOP_OOP_VIRT', subjectId: 'SUB_OOPS', unit: 'Unit 3', name: 'Virtual Functions & STL Templates', difficulty: 'Hard', prerequisiteId: 'TOP_OOP_POLY' },

    // DELD Topics
    { id: 'TOP_DELD_BOOL', subjectId: 'SUB_DELD', unit: 'Unit 1', name: 'Boolean Algebra & K-Map Minimization', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_DELD_COMB', subjectId: 'SUB_DELD', unit: 'Unit 2', name: 'Combinational Logic Circuits', difficulty: 'Medium', prerequisiteId: 'TOP_DELD_BOOL' },

    // OS Topics
    { id: 'TOP_OS_PROC', subjectId: 'SUB_OS', unit: 'Unit 1', name: 'Process Control & Thread Management', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_OS_SCHED', subjectId: 'SUB_OS', unit: 'Unit 2', name: 'CPU Scheduling Algorithms (FCFS, SJF, RR)', difficulty: 'Medium', prerequisiteId: 'TOP_OS_PROC' },
    { id: 'TOP_OS_MEM', subjectId: 'SUB_OS', unit: 'Unit 3', name: 'Paging & Virtual Memory Management', difficulty: 'Hard', prerequisiteId: 'TOP_OS_SCHED' }
  ],

  questions: [
    // DBMS Question 1
    {
      id: 'DBMS_NORM_001',
      subjectId: 'SUB_DBMS',
      unit: 'Unit 3',
      topicId: 'TOP_DBMS_NORM',
      difficulty: 'Medium',
      question: 'Which Normal Form eliminates partial functional dependency where a non-prime attribute depends on a proper subset of a candidate key?',
      options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
      correctAnswer: 1,
      explanation: '2NF requires that the relation is in 1NF and no non-prime attribute is dependent on any proper subset of any candidate key of the relation.',
      concept: 'Partial Dependency',
      prerequisite: 'Relational Algebra'
    },
    // DBMS Question 2
    {
      id: 'DBMS_REL_001',
      subjectId: 'SUB_DBMS',
      unit: 'Unit 2',
      topicId: 'TOP_DBMS_REL',
      difficulty: 'Easy',
      question: 'Which fundamental Relational Algebra operator selects tuples from a relation that satisfy a given predicate sigma (σ)?',
      options: ['Projection (π)', 'Selection (σ)', 'Cartesian Product (×)', 'Rename (ρ)'],
      correctAnswer: 1,
      explanation: 'Selection (σ) filters rows/tuples based on a specified boolean condition.',
      concept: 'Relational Operators',
      prerequisite: 'ER Modeling'
    },
    // DSA Question 1
    {
      id: 'DS_BST_001',
      subjectId: 'SUB_DSA',
      unit: 'Unit 3',
      topicId: 'TOP_DS_BST',
      difficulty: 'Medium',
      question: 'What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST) of size n?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 2,
      explanation: 'In the worst case (skewed tree), a BST degenerates into a single linked list, resulting in O(n) search time.',
      concept: 'Tree Height & Complexity',
      prerequisite: 'Linked Lists'
    },
    // OS Question 1
    {
      id: 'OS_SCHED_001',
      subjectId: 'SUB_OS',
      unit: 'Unit 2',
      topicId: 'TOP_OS_SCHED',
      difficulty: 'Medium',
      question: 'Which non-preemptive CPU scheduling algorithm guarantees the minimum average waiting time for a given set of processes?',
      options: ['First-Come First-Served (FCFS)', 'Shortest Job First (SJF)', 'Round Robin (RR)', 'Priority Scheduling'],
      correctAnswer: 1,
      explanation: 'SJF is optimal because it gives the minimum average waiting time for a given set of processes.',
      concept: 'CPU Scheduling Optimization',
      prerequisite: 'Process Management'
    },
    // OOPs Question 1
    {
      id: 'OOP_POLY_001',
      subjectId: 'SUB_OOPS',
      unit: 'Unit 2',
      topicId: 'TOP_OOP_POLY',
      difficulty: 'Easy',
      question: 'In Object Oriented Programming, which mechanism enables dynamic binding at runtime using base class pointers?',
      options: ['Function Overloading', 'Virtual Functions', 'Operator Overloading', 'Constructors'],
      correctAnswer: 1,
      explanation: 'Virtual functions enable runtime polymorphism by using vtables to resolve method calls at execution time.',
      concept: 'Runtime Polymorphism',
      prerequisite: 'Classes & Objects'
    }
  ],

  performance: [
    {
      studentId: 'ECB0245',
      topicId: 'TOP_DBMS_REL',
      topicName: 'Relational Algebra & Tuple Calculus',
      accuracy: 84,
      totalAttempts: 6,
      status: 'Mastered'
    },
    {
      studentId: 'ECB0245',
      topicId: 'TOP_DBMS_NORM',
      topicName: 'DBMS Normalization (1NF, 2NF, 3NF, BCNF)',
      accuracy: 48,
      totalAttempts: 5,
      status: 'Needs Focus'
    },
    {
      studentId: 'ECB0245',
      topicId: 'TOP_OS_SCHED',
      topicName: 'CPU Scheduling Algorithms (FCFS, SJF, RR)',
      accuracy: 55,
      totalAttempts: 4,
      status: 'Needs Focus'
    },
    {
      studentId: 'ECB0245',
      topicId: 'TOP_OOP_POLY',
      topicName: 'Inheritance & Polymorphism',
      accuracy: 88,
      totalAttempts: 7,
      status: 'Mastered'
    }
  ],

  quizHistory: [
    {
      id: 'QUIZ_201',
      studentId: 'ECB0245',
      topicId: 'TOP_DBMS_NORM',
      topicName: 'DBMS Normalization (1NF, 2NF, 3NF, BCNF)',
      score: 40,
      totalQuestions: 5,
      correctCount: 2,
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ],

  interventions: [
    {
      id: 'INT_001',
      studentId: 'ECB0245',
      teacherId: 'ECB1234',
      teacherName: 'Dr. R.K. Mehta',
      topicId: 'TOP_DBMS_NORM',
      topicName: 'DBMS Normalization (1NF, 2NF, 3NF, BCNF)',
      type: 'Prerequisite Recovery',
      note: 'Please revise Relational Algebra partial dependency rules before re-attempting the DBMS Normalization evaluation quiz.',
      createdAt: new Date().toISOString(),
      status: 'Active'
    }
  ],

  notifications: [
    {
      id: 'NOTIF_001',
      userId: 'ECB0245',
      title: 'Teacher Recommended Activity',
      message: 'Dr. R.K. Mehta recommended revising DBMS 2NF Normalization.',
      type: 'warning',
      timestamp: new Date().toISOString(),
      read: false
    }
  ],

  dailyGoals: {
    'ECB0245': {
      tasks: [
        { title: 'Revise DBMS Normalization 2NF Rules', completed: true },
        { title: 'Solve 10 Functional Dependency Practice MCQs', completed: true },
        { title: 'Take DBMS Diagnostic Assessment', completed: false },
        { title: 'Review Relational Algebra Prerequisite Notes', completed: false }
      ]
    }
  },

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

  getUsers() { return this.getDb().users || []; }
  getUserById(id) { return this.getUsers().find(u => u.id.toLowerCase() === id.toLowerCase()); }
  addUser(user) {
    const db = this.getDb();
    db.users.push(user);
    this.saveDb(db);
  }

  getClasses() { return this.getDb().classes || []; }
  getSubjects() { return this.getDb().subjects || []; }
  getTopics() { return this.getDb().topics || []; }
  getTopicsBySubject(subjectId) { return this.getTopics().filter(t => t.subjectId === subjectId); }
  getQuestions() { return this.getDb().questions || []; }
  getQuestionsByTopic(topicId) { return this.getQuestions().filter(q => q.topicId === topicId); }

  getPerformance(studentId) {
    return (this.getDb().performance || []).filter(p => p.studentId === studentId);
  }

  saveQuizResult(result) {
    const db = this.getDb();
    if (!db.quizHistory) db.quizHistory = [];
    db.quizHistory.push(result);

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

    if (db.dailyGoals && db.dailyGoals[result.studentId]) {
      db.dailyGoals[result.studentId].tasks[2].completed = true;
    }

    this.saveDb(db);
  }

  getInterventions(studentId) {
    const list = this.getDb().interventions || [];
    return studentId ? list.filter(i => i.studentId === studentId) : list;
  }

  addIntervention(intervention) {
    const db = this.getDb();
    if (!db.interventions) db.interventions = [];
    db.interventions.push(intervention);
    
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

  getNotifications(userId) {
    return (this.getDb().notifications || []).filter(n => n.userId === userId);
  }

  getDailyGoal(studentId) {
    const db = this.getDb();
    const goals = db.dailyGoals && db.dailyGoals[studentId] ? db.dailyGoals[studentId] : {
      tasks: [
        { title: 'Revise DBMS Normalization 2NF Rules', completed: true },
        { title: 'Solve 10 Functional Dependency Practice MCQs', completed: true },
        { title: 'Take DBMS Diagnostic Assessment', completed: false },
        { title: 'Review Relational Algebra Prerequisite Notes', completed: false }
      ]
    };
    const completedCount = goals.tasks.filter(t => t.completed).length;
    return { tasks: goals.tasks, completedCount };
  }

  toggleDailyTask(studentId, taskIdx) {
    const db = this.getDb();
    if (!db.dailyGoals) db.dailyGoals = {};
    if (!db.dailyGoals[studentId]) {
      db.dailyGoals[studentId] = {
        tasks: [
          { title: 'Revise DBMS Normalization 2NF Rules', completed: true },
          { title: 'Solve 10 Functional Dependency Practice MCQs', completed: true },
          { title: 'Take DBMS Diagnostic Assessment', completed: false },
          { title: 'Review Relational Algebra Prerequisite Notes', completed: false }
        ]
      };
    }
    const t = db.dailyGoals[studentId].tasks[taskIdx];
    if (t) t.completed = !t.completed;
    this.saveDb(db);
  }
}

const Storage = new StorageManager();
window.Storage = Storage;
