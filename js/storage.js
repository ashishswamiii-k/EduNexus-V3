/* ============================================================
   EDUNEXUS — CENTRAL LOCALSTORAGE DATA MANAGEMENT LAYER
   STRICT AUTOMATIC QUESTION AUDIT & VALIDATION SYSTEM
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
      id: 'DEMO0245',
      name: 'ASHISH',
      role: 'student',
      password: 'student123',
      email: 'ashish.swami@edunexus.edu',
      mobileNumber: '+91 9876543210',
      schoolCode: 'DEMO',
      institution: 'EduNexus Academy',
      rollNumber: '0245',
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-A',
      streakDays: 7,
      achievements: ['first_quiz', 'streak_5', 'topic_master', 'mindful_learner'],
      id: 'ECB0245',
      name: 'Rahul Meena',
      role: 'student',
      password: 'student123',
      email: 'rahul.meena@edunexus.edu',
      mobileNumber: '+91 9876543210',
      schoolCode: 'ECB',
      institution: 'Engineering College Bikaner',
      rollNumber: '1001',
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-A',
      streakDays: 5,
      achievements: ['first_quiz'],
      mindfulHistory: [],
      mindfulXP: 40
    },
    {
      id: '0245',
      name: 'Rahul Meena',
      role: 'student',
      password: 'student123',
      email: 'rahul.meena@edunexus.edu',
      mobileNumber: '+91 9876543210',
      schoolCode: 'ECB',
      institution: 'Engineering College Bikaner',
      rollNumber: '1001',
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-A',
      streakDays: 5,
      achievements: ['first_quiz'],
      mindfulHistory: [],
      mindfulXP: 40
    },
    {
      id: 'STU-1002',
      name: 'Priya Verma',
      role: 'student',
      password: 'student123',
      email: 'priya.verma@edunexus.edu',
      mobileNumber: '+91 9876543212',
      schoolCode: 'ECB',
      institution: 'Engineering College Bikaner',
      rollNumber: '1002',
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-A',
      streakDays: 2,
      achievements: ['first_quiz'],
      mindfulHistory: [],
      mindfulXP: 20
    },
    {
      id: 'STU-1003',
      name: 'Simran Kumari',
      role: 'student',
      password: 'student123',
      email: 'simran.kumari@edunexus.edu',
      mobileNumber: '+91 9876543213',
      schoolCode: 'ECB',
      institution: 'Engineering College Bikaner',
      rollNumber: '1003',
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-B',
      streakDays: 3,
      achievements: ['first_quiz'],
      mindfulHistory: [],
      mindfulXP: 20
    },
    {
      id: 'STU-1011',
      name: 'Kanchan',
      role: 'student',
      password: 'student123',
      email: 'kanchan@edunexus.edu',
      mobileNumber: '+91 9876543221',
      schoolCode: 'ECB',
      institution: 'Engineering College Bikaner',
      rollNumber: '1011',
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-A',
      streakDays: 12,
      achievements: ['first_quiz', 'streak_5', 'topic_master', 'mindful_learner'],
      mindfulHistory: [],
      mindfulXP: 100
    },
    {
      id: 'STU-1004',
      name: 'Aarav Sharma',
      role: 'student',
      password: 'student123',
      email: 'aarav.sharma@edunexus.edu',
      mobileNumber: '+91 9876543214',
      schoolCode: 'ECB',
      institution: 'Engineering College Bikaner',
      rollNumber: '1004',
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-A',
      streakDays: 6,
      achievements: ['first_quiz', 'streak_5'],
      mindfulHistory: [],
      mindfulXP: 40
    },
    {
      id: 'STU-1006',
      name: 'Rohan Gupta',
      role: 'student',
      password: 'student123',
      email: 'rohan.gupta@edunexus.edu',
      mobileNumber: '+91 9876543216',
      schoolCode: 'ECB',
      institution: 'Engineering College Bikaner',
      rollNumber: '1006',
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-A',
      streakDays: 5,
      achievements: ['first_quiz', 'streak_5'],
      mindfulHistory: [],
      mindfulXP: 40
    },
    {
      id: 'STU-1008',
      name: 'Arjun Yadav',
      role: 'student',
      password: 'student123',
      email: 'arjun.yadav@edunexus.edu',
      mobileNumber: '+91 9876543218',
      schoolCode: 'ECB',
      institution: 'Engineering College Bikaner',
      rollNumber: '1008',
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-B',
      streakDays: 10,
      achievements: ['first_quiz', 'streak_5', 'topic_master'],
      mindfulHistory: [],
      mindfulXP: 80
    },
    {
      id: 'STU-1010',
      name: 'Aditya Verma',
      role: 'student',
      password: 'student123',
      email: 'aditya.verma@edunexus.edu',
      mobileNumber: '+91 9876543220',
      schoolCode: 'ECB',
      institution: 'Engineering College Bikaner',
      rollNumber: '1010',
      branch: 'Computer Science',
      year: 'Undergraduate',
      semester: 'Semester 3',
      classId: 'Sec-B',
      streakDays: 9,
      achievements: ['first_quiz', 'streak_5', 'topic_master'],
      mindfulHistory: [],
      mindfulXP: 60
    },
    {
      id: 'TEACH001',
      name: 'Prof. Demo Teacher',
      role: 'teacher',
      password: 'teacher123',
      schoolCode: 'DEMO',
      mobileNumber: '+91 9876541234',
      subject: 'Database Management Systems',
      assignedClasses: ['Sec-A', 'Sec-B']
    },
    {
      id: 'ECB1234',
      name: 'Dr. R.K. Mehta',
      role: 'teacher',
      password: 'teacher123',
      schoolCode: 'ECB',
      mobileNumber: '+91 9876541234',
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
    { id: 'SUB_DBMS', name: 'Database Management Systems', code: 'DBMS101', semester: 'Semester 3', assignedClasses: ['Sec-A', 'Sec-B'], syllabusFile: { name: 'DBMS_Syllabus.pdf', size: '2.4 MB', status: 'Ready for Analysis' }, pyqFile: { name: 'DBMS_PYQ_2022_2025.pdf', size: '3.1 MB', status: 'Ready for Analysis' } },
    { id: 'SUB_DSA', name: 'Data Structures & Algorithms', code: 'DSA101', semester: 'Semester 3', assignedClasses: ['Sec-A', 'Sec-B'], syllabusFile: { name: 'DSA_Syllabus.pdf', size: '1.8 MB', status: 'Ready for Analysis' }, pyqFile: { name: 'DSA_PYQ_2021_2024.pdf', size: '2.9 MB', status: 'Ready for Analysis' } },
    { id: 'SUB_OOPS', name: 'Object Oriented Programming', code: 'OOP101', semester: 'Semester 3', assignedClasses: ['Sec-A', 'Sec-B'], syllabusFile: { name: 'OOP_Syllabus.pdf', size: '1.5 MB', status: 'Ready for Analysis' }, pyqFile: { name: 'OOP_PYQ_2022_2025.pdf', size: '2.2 MB', status: 'Ready for Analysis' } },
    { id: 'SUB_DELD', name: 'Digital Electronics & Logic Design', code: 'DIG101', semester: 'Semester 3', assignedClasses: ['Sec-A', 'Sec-B'], syllabusFile: { name: 'DELD_Syllabus.pdf', size: '2.1 MB', status: 'Ready for Analysis' }, pyqFile: { name: 'DELD_PYQ_2020_2024.pdf', size: '3.4 MB', status: 'Ready for Analysis' } },
    { id: 'SUB_AEM', name: 'Advanced Engineering Mathematics', code: 'MAT101', semester: 'Semester 3', assignedClasses: ['Sec-A', 'Sec-B'], syllabusFile: { name: 'AEM_Syllabus.pdf', size: '2.6 MB', status: 'Ready for Analysis' }, pyqFile: { name: 'AEM_PYQ_2019_2024.pdf', size: '4.1 MB', status: 'Ready for Analysis' } },

    // Semester 4 Subjects
    { id: 'SUB_DM', name: 'Discrete Mathematics', code: 'MAT102', semester: 'Semester 4', assignedClasses: ['Sec-A', 'Sec-B'], syllabusFile: { name: 'DM_Syllabus.pdf', size: '1.9 MB', status: 'Ready for Analysis' }, pyqFile: { name: 'DM_PYQ_2021_2025.pdf', size: '2.7 MB', status: 'Ready for Analysis' } },
    { id: 'SUB_COA', name: 'Computer Organization & Architecture', code: 'COA101', semester: 'Semester 4', assignedClasses: ['Sec-A', 'Sec-B'], syllabusFile: { name: 'COA_Syllabus.pdf', size: '2.3 MB', status: 'Ready for Analysis' }, pyqFile: { name: 'COA_PYQ_2020_2024.pdf', size: '3.0 MB', status: 'Ready for Analysis' } },
    { id: 'SUB_OS', name: 'Operating Systems', code: 'OS101', semester: 'Semester 4', assignedClasses: ['Sec-A', 'Sec-B'], syllabusFile: { name: 'OS_Syllabus.pdf', size: '2.2 MB', status: 'Ready for Analysis' }, pyqFile: { name: 'OS_PYQ_2021_2025.pdf', size: '3.5 MB', status: 'Ready for Analysis' } }
  ],

  topics: [
    // DBMS Topics
    { id: 'TOP_DBMS_ER', subjectId: 'SUB_DBMS', unit: 'Unit 1', name: 'ER Diagrams & Data Modeling', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_DBMS_REL', subjectId: 'SUB_DBMS', unit: 'Unit 2', name: 'Relational Algebra & Tuple Calculus', difficulty: 'Easy', prerequisiteId: 'TOP_DBMS_ER' },
    { id: 'TOP_DBMS_NORM', subjectId: 'SUB_DBMS', unit: 'Unit 3', name: 'DBMS Normalization (1NF, 2NF, 3NF, BCNF)', difficulty: 'Medium', prerequisiteId: 'TOP_DBMS_REL' },
    { id: 'TOP_DBMS_TRANS', subjectId: 'SUB_DBMS', unit: 'Unit 4', name: 'Transaction Processing & ACID Properties', difficulty: 'Hard', prerequisiteId: 'TOP_DBMS_NORM' },

    // DSA Topics
    { id: 'TOP_DS_ARR', subjectId: 'SUB_DSA', unit: 'Unit 1', name: 'Arrays, Stacks & Queues', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_DS_LINK', subjectId: 'SUB_DSA', unit: 'Unit 2', name: 'Singly & Doubly Linked Lists', difficulty: 'Medium', prerequisiteId: 'TOP_DS_ARR' },
    { id: 'TOP_DS_BST', subjectId: 'SUB_DSA', unit: 'Unit 3', name: 'Binary Search Trees & AVL Trees', difficulty: 'Hard', prerequisiteId: 'TOP_DS_LINK' },

    // OOPs Topics
    { id: 'TOP_OOP_CLASS', subjectId: 'SUB_OOPS', unit: 'Unit 1', name: 'Classes, Objects & Constructors', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_OOP_POLY', subjectId: 'SUB_OOPS', unit: 'Unit 2', name: 'Inheritance & Polymorphism', difficulty: 'Medium', prerequisiteId: 'TOP_OOP_CLASS' },

    // DELD Topics
    { id: 'TOP_DELD_BOOL', subjectId: 'SUB_DELD', unit: 'Unit 1', name: 'Boolean Algebra & K-Map Minimization', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_DELD_COMB', subjectId: 'SUB_DELD', unit: 'Unit 2', name: 'Combinational & Sequential Circuits', difficulty: 'Medium', prerequisiteId: 'TOP_DELD_BOOL' },

    // AEM Topics
    { id: 'TOP_AEM_CALC', subjectId: 'SUB_AEM', unit: 'Unit 1', name: 'Matrix Algebra & Differential Calculus', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_AEM_FOUR', subjectId: 'SUB_AEM', unit: 'Unit 2', name: 'Fourier Series & Laplace Transforms', difficulty: 'Medium', prerequisiteId: 'TOP_AEM_CALC' },

    // DM Topics
    { id: 'TOP_DM_SET', subjectId: 'SUB_DM', unit: 'Unit 1', name: 'Set Theory & Mathematical Logic', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_DM_GRAPH', subjectId: 'SUB_DM', unit: 'Unit 2', name: 'Graph Theory & Recurrence Relations', difficulty: 'Medium', prerequisiteId: 'TOP_DM_SET' },

    // COA Topics
    { id: 'TOP_COA_ALU', subjectId: 'SUB_COA', unit: 'Unit 1', name: 'ALU & Memory Architecture', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_COA_PIPE', subjectId: 'SUB_COA', unit: 'Unit 2', name: 'Pipelining & Cache Organization', difficulty: 'Medium', prerequisiteId: 'TOP_COA_ALU' },

    // OS Topics
    { id: 'TOP_OS_PROC', subjectId: 'SUB_OS', unit: 'Unit 1', name: 'Process Control & Thread Management', difficulty: 'Easy', prerequisiteId: null },
    { id: 'TOP_OS_SCHED', subjectId: 'SUB_OS', unit: 'Unit 2', name: 'CPU Scheduling Algorithms', difficulty: 'Medium', prerequisiteId: 'TOP_OS_PROC' },
    { id: 'TOP_OS_MEM', subjectId: 'SUB_OS', unit: 'Unit 3', name: 'Virtual Memory & Page Table Management', difficulty: 'Hard', prerequisiteId: 'TOP_OS_SCHED' }
  ],

  questions: [
    {
      id: 'DBMS_ER_001', subjectId: 'SUB_DBMS', unit: 'Unit 1', topicId: 'TOP_DBMS_ER', difficulty: 'Easy',
      question: 'In an Entity-Relationship (ER) diagram, how is a weak entity set graphically represented?',
      options: ['Single rectangle', 'Double rectangle', 'Ellipse', 'Diamond box'],
      correctAnswer: 1, explanation: 'Weak entity sets do not have a primary key of their own and are represented using double rectangles.', concept: 'Weak Entity Sets', prerequisite: 'ER Diagrams'
    },
    {
      id: 'DBMS_REL_001', subjectId: 'SUB_DBMS', unit: 'Unit 2', topicId: 'TOP_DBMS_REL', difficulty: 'Easy',
      question: 'Which fundamental Relational Algebra operator selects tuples from a relation that satisfy a given predicate sigma (σ)?',
      options: ['Projection (π)', 'Selection (σ)', 'Cartesian Product (×)', 'Rename (ρ)'],
      correctAnswer: 1, explanation: 'Selection (σ) filters rows/tuples based on a specified boolean condition.', concept: 'Relational Operators', prerequisite: 'ER Modeling'
    },
    {
      id: 'DBMS_SQL_001', subjectId: 'SUB_DBMS', unit: 'Unit 1', topicId: 'TOP_DBMS_ER', difficulty: 'Easy',
      question: 'Which SQL clause is used to filter group results after an aggregation GROUP BY operation?',
      options: ['WHERE', 'HAVING', 'ORDER BY', 'FILTER BY'],
      correctAnswer: 1, explanation: 'The HAVING clause filters aggregated groups after the GROUP BY clause is processed.', concept: 'SQL Aggregation', prerequisite: 'SQL Basics'
    },
    {
      id: 'DBMS_KEY_001', subjectId: 'SUB_DBMS', unit: 'Unit 1', topicId: 'TOP_DBMS_ER', difficulty: 'Easy',
      question: 'Which constraint ensures that a key uniquely identifies each row in a database table and cannot contain NULL values?',
      options: ['Foreign Key', 'Primary Key', 'Super Key', 'Candidate Key'],
      correctAnswer: 1, explanation: 'Primary Key uniquely identifies each tuple in a relation and strictly forbids NULL values.', concept: 'Key Constraints', prerequisite: 'Relational Model'
    },
    {
      id: 'DBMS_NORM_001', subjectId: 'SUB_DBMS', unit: 'Unit 3', topicId: 'TOP_DBMS_NORM', difficulty: 'Medium',
      question: 'Which Normal Form eliminates partial functional dependency where a non-prime attribute depends on a proper subset of a candidate key?',
      options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
      correctAnswer: 1, explanation: '2NF requires that the relation is in 1NF and no non-prime attribute is dependent on any proper subset of any candidate key.', concept: 'Partial Dependency', prerequisite: 'Relational Algebra'
    },
    {
      id: 'DBMS_NORM_002', subjectId: 'SUB_DBMS', unit: 'Unit 3', topicId: 'TOP_DBMS_NORM', difficulty: 'Medium',
      question: 'A relation R is in Boyce-Codd Normal Form (BCNF) if for every non-trivial functional dependency X -> Y, which condition must hold true?',
      options: ['Y must be a prime attribute', 'X must be a super key', 'X and Y must belong to the same domain', 'R must be in 4NF'],
      correctAnswer: 1, explanation: 'BCNF requires that for every functional dependency X -> Y, X must be a super key of relation R.', concept: 'BCNF Rule', prerequisite: '3NF Normalization'
    },
    {
      id: 'DBMS_TRANS_001', subjectId: 'SUB_DBMS', unit: 'Unit 4', topicId: 'TOP_DBMS_TRANS', difficulty: 'Medium',
      question: 'Which ACID property guarantees that all operations within a database transaction execute completely or not at all?',
      options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
      correctAnswer: 0, explanation: 'Atomicity ensures all-or-nothing execution for database transactions.', concept: 'ACID Properties', prerequisite: 'Transaction Processing'
    },
    {
      id: 'DBMS_INDEX_001', subjectId: 'SUB_DBMS', unit: 'Unit 4', topicId: 'TOP_DBMS_TRANS', difficulty: 'Medium',
      question: 'In a B+ Tree index of order m, where are the actual data pointers or record keys stored?',
      options: ['Only in internal root nodes', 'Exclusively in the leaf nodes', 'Uniformly in all tree nodes', 'In an unindexed linear file'],
      correctAnswer: 1, explanation: 'In B+ Trees, internal nodes store index search keys, while leaf nodes contain all actual data pointers linked together.', concept: 'B+ Tree Indexing', prerequisite: 'File Organization'
    },
    {
      id: 'DBMS_LOCK_001', subjectId: 'SUB_DBMS', unit: 'Unit 4', topicId: 'TOP_DBMS_TRANS', difficulty: 'Hard',
      question: 'In Strict Two-Phase Locking (Strict 2PL), when are exclusive (X) locks held by a transaction released?',
      options: ['Immediately after reading', 'At the end of the shrinking phase', 'At the very end after transaction commit or abort', 'When another transaction requests a shared lock'],
      correctAnswer: 2, explanation: 'Strict 2PL requires that all exclusive locks held by a transaction are held until the transaction completes (commit/abort) to prevent cascading rollbacks.', concept: 'Concurrency Control', prerequisite: 'Two-Phase Locking'
    },
    {
      id: 'DBMS_ISOL_001', subjectId: 'SUB_DBMS', unit: 'Unit 4', topicId: 'TOP_DBMS_TRANS', difficulty: 'Hard',
      question: 'Which transaction isolation level prevents dirty reads, non-repeatable reads, and phantom reads?',
      options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
      correctAnswer: 3, explanation: 'Serializable is the highest isolation level and guarantees complete immunity from dirty reads, non-repeatable reads, and phantom reads.', concept: 'Transaction Isolation', prerequisite: 'ACID Consistency'
    },

    // DSA Questions
    {
      id: 'DSA_ARR_001', subjectId: 'SUB_DSA', unit: 'Unit 1', topicId: 'TOP_DS_ARR', difficulty: 'Easy',
      question: 'Which data structure operates on a Last-In, First-Out (LIFO) principle?',
      options: ['Queue', 'Stack', 'Array', 'Linked List'],
      correctAnswer: 1, explanation: 'A Stack is a LIFO linear data structure where elements are pushed and popped from the same top end.', concept: 'LIFO Operations', prerequisite: 'Linear Data Structures'
    },
    {
      id: 'DSA_ARR_002', subjectId: 'SUB_DSA', unit: 'Unit 1', topicId: 'TOP_DS_ARR', difficulty: 'Easy',
      question: 'What is the time complexity of accessing an element in an array by its index?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
      correctAnswer: 0, explanation: 'Array element access via base address + (index * element_size) takes constant time O(1).', concept: 'Array Indexing', prerequisite: 'Base Pointer Addressing'
    },
    {
      id: 'DSA_QUEUE_001', subjectId: 'SUB_DSA', unit: 'Unit 1', topicId: 'TOP_DS_ARR', difficulty: 'Easy',
      question: 'Which queue variant allows insertion and deletion of elements from both the front and rear ends?',
      options: ['Circular Queue', 'Priority Queue', 'Double-Ended Queue (Deque)', 'Single Queue'],
      correctAnswer: 2, explanation: 'A Double-Ended Queue (Deque) supports push/pop at both front and rear ends.', concept: 'Deque Operations', prerequisite: 'Queue ADT'
    },
    {
      id: 'DSA_TREE_001', subjectId: 'SUB_DSA', unit: 'Unit 3', topicId: 'TOP_DS_BST', difficulty: 'Easy',
      question: 'What is the maximum number of children a node can have in a Binary Tree?',
      options: ['1', '2', '3', 'Unlimited'],
      correctAnswer: 1, explanation: 'A Binary Tree limits each parent node to a maximum of two child nodes (left and right).', concept: 'Binary Tree Definition', prerequisite: 'Tree Fundamentals'
    },
    {
      id: 'DS_BST_001', subjectId: 'SUB_DSA', unit: 'Unit 3', topicId: 'TOP_DS_BST', difficulty: 'Medium',
      question: 'What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST) of size n?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctAnswer: 2, explanation: 'In the worst case (skewed tree), a BST degenerates into a single linked list, resulting in O(n) search time.', concept: 'Tree Height & Complexity', prerequisite: 'Linked Lists'
    },
    {
      id: 'DSA_SORT_001', subjectId: 'SUB_DSA', unit: 'Unit 2', topicId: 'TOP_DS_LINK', difficulty: 'Medium',
      question: 'Which divide-and-conquer sorting algorithm has a guaranteed worst-case time complexity of O(n log n)?',
      options: ['Quick Sort', 'Merge Sort', 'Bubble Sort', 'Insertion Sort'],
      correctAnswer: 1, explanation: 'Merge Sort always divides arrays evenly and merges in O(n log n) worst-case time.', concept: 'Divide & Conquer', prerequisite: 'Sorting Algorithms'
    },
    {
      id: 'DSA_AVL_001', subjectId: 'SUB_DSA', unit: 'Unit 3', topicId: 'TOP_DS_BST', difficulty: 'Medium',
      question: 'In an AVL tree, what is the maximum allowable difference between the heights of the left and right subtrees for any node?',
      options: ['0', '1', '2', 'log n'],
      correctAnswer: 1, explanation: 'An AVL tree requires that the Balance Factor (Height_Left - Height_Right) stays within {-1, 0, +1}.', concept: 'AVL Balance Factor', prerequisite: 'BST Rotations'
    },
    {
      id: 'DSA_GRAPH_001', subjectId: 'SUB_DSA', unit: 'Unit 3', topicId: 'TOP_DS_BST', difficulty: 'Medium',
      question: 'Which graph traversal technique uses a Queue data structure to visit vertices layer by layer?',
      options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Preorder Traversal', 'Postorder Traversal'],
      correctAnswer: 1, explanation: 'BFS uses a FIFO Queue to explore neighbor vertices level by level.', concept: 'Graph Traversal', prerequisite: 'Queue & Graph ADT'
    },
    {
      id: 'DSA_DIJK_001', subjectId: 'SUB_DSA', unit: 'Unit 3', topicId: 'TOP_DS_BST', difficulty: 'Hard',
      question: 'What is the primary limitation of Dijkstra algorithm when finding the shortest path in a weighted graph?',
      options: ['Cannot handle cyclic graphs', 'Cannot process negative edge weights', 'Only works on trees', 'Requires unweighted edges'],
      correctAnswer: 1, explanation: 'Dijkstra greedy choice property assumes non-negative edge weights; negative edges can cause re-evaluations and incorrect distances.', concept: 'Greedy Shortest Path', prerequisite: 'Graph Edge Weights'
    },
    {
      id: 'DSA_RB_001', subjectId: 'SUB_DSA', unit: 'Unit 3', topicId: 'TOP_DS_BST', difficulty: 'Hard',
      question: 'In a Red-Black tree, what property must hold regarding the path length from any node to its descendant leaf nodes?',
      options: ['Every path contains the same total number of nodes', 'Every path contains the same number of black nodes', 'Red nodes must have red children', 'Root must be colored red'],
      correctAnswer: 1, explanation: 'Red-Black trees require that every simple path from a node to any of its descendant NIL leaves contains the same number of black nodes.', concept: 'Red-Black Tree Properties', prerequisite: 'Balanced Search Trees'
    },

    // OOPs Questions
    {
      id: 'OOP_CLASS_001', subjectId: 'SUB_OOPS', unit: 'Unit 1', topicId: 'TOP_OOP_CLASS', difficulty: 'Easy',
      question: 'Which OOP concept wraps data attributes and methods together into a single unit while hiding internal state?',
      options: ['Polymorphism', 'Encapsulation', 'Inheritance', 'Abstraction'],
      correctAnswer: 1, explanation: 'Encapsulation bundles state variables and methods inside a class, exposing controlled public interfaces.', concept: 'Encapsulation', prerequisite: 'OOP Fundamentals'
    },

    // OS Questions
    {
      id: 'OS_PROC_001', subjectId: 'SUB_OS', unit: 'Unit 1', topicId: 'TOP_OS_PROC', difficulty: 'Easy',
      question: 'Which operating system structure contains all control information for an active process (PID, registers, state)?',
      options: ['File Control Block (FCB)', 'Process Control Block (PCB)', 'Inode Table', 'Page Directory'],
      correctAnswer: 1, explanation: 'The PCB maintains process context including PID, registers, stack pointer, and accounting information.', concept: 'Process Management', prerequisite: 'OS Concepts'
    },
    {
      id: 'OS_PAGE_001', subjectId: 'SUB_OS', unit: 'Unit 3', topicId: 'TOP_OS_MEM', difficulty: 'Medium',
      question: 'What event occurs when a process attempts to access a virtual memory page that is not currently loaded in physical RAM?',
      options: ['Segmentation Fault', 'Page Fault Interrupt', 'General Protection Fault', 'System Crash'],
      correctAnswer: 1, explanation: 'A Page Fault occurs when a valid page reference misses in physical RAM, signaling the OS to fetch the page from disk.', concept: 'Demand Paging', prerequisite: 'Virtual Memory'
    }
  ],

  performance: [
    // HIGH RISK STUDENTS (< 60%)
    { studentId: 'ECB0245', topicId: 'TOP_DBMS_NORM', topicName: 'DBMS Normalization (1NF, 2NF, 3NF, BCNF)', accuracy: 42, totalAttempts: 5, status: 'Needs Focus' },
    { studentId: 'ECB0245', topicId: 'TOP_OS_SCHED', topicName: 'CPU Scheduling Algorithms', accuracy: 55, totalAttempts: 4, status: 'Needs Focus' },
    { studentId: 'ECB0245', topicId: 'TOP_DBMS_REL', topicName: 'Relational Algebra & Tuple Calculus', accuracy: 78, totalAttempts: 6, status: 'Mastered' },

    { studentId: '0245', topicId: 'TOP_DBMS_NORM', topicName: 'DBMS Normalization (1NF, 2NF, 3NF, BCNF)', accuracy: 42, totalAttempts: 5, status: 'Needs Focus' },
    { studentId: '0245', topicId: 'TOP_OS_SCHED', topicName: 'CPU Scheduling Algorithms', accuracy: 55, totalAttempts: 4, status: 'Needs Focus' },
    { studentId: '0245', topicId: 'TOP_DBMS_REL', topicName: 'Relational Algebra & Tuple Calculus', accuracy: 78, totalAttempts: 6, status: 'Mastered' },

    { studentId: 'STU-1002', topicId: 'TOP_DS_BST', topicName: 'Binary Search Trees & AVL Trees', accuracy: 40, totalAttempts: 4, status: 'Needs Focus' },
    { studentId: 'STU-1002', topicId: 'TOP_DS_LINK', topicName: 'Singly & Doubly Linked Lists', accuracy: 48, totalAttempts: 3, status: 'Needs Focus' },
    { studentId: 'STU-1002', topicId: 'TOP_DS_ARR', topicName: 'Arrays, Stacks & Queues', accuracy: 85, totalAttempts: 5, status: 'Mastered' },

    { studentId: 'STU-1003', topicId: 'TOP_COA_PIPE', topicName: 'Pipelining & Cache Organization', accuracy: 50, totalAttempts: 4, status: 'Needs Focus' },
    { studentId: 'STU-1003', topicId: 'TOP_COA_ALU', topicName: 'ALU & Memory Architecture', accuracy: 54, totalAttempts: 3, status: 'Needs Focus' },

    // MEDIUM RISK STUDENTS (60% - 78%)
    { studentId: 'STU-1004', topicId: 'TOP_DBMS_NORM', topicName: 'DBMS Normalization (1NF, 2NF, 3NF, BCNF)', accuracy: 65, totalAttempts: 4, status: 'Needs Focus' },
    { studentId: 'STU-1004', topicId: 'TOP_DBMS_REL', topicName: 'Relational Algebra & Tuple Calculus', accuracy: 78, totalAttempts: 5, status: 'Mastered' },

    { studentId: 'STU-1005', topicId: 'TOP_OS_MEM', topicName: 'Virtual Memory & Page Table Management', accuracy: 68, totalAttempts: 3, status: 'Needs Focus' },
    { studentId: 'STU-1005', topicId: 'TOP_OS_SCHED', topicName: 'CPU Scheduling Algorithms', accuracy: 82, totalAttempts: 5, status: 'Mastered' },

    { studentId: 'STU-1006', topicId: 'TOP_DM_GRAPH', topicName: 'Graph Theory & Recurrence Relations', accuracy: 64, totalAttempts: 4, status: 'Needs Focus' },
    { studentId: 'STU-1006', topicId: 'TOP_DM_SET', topicName: 'Set Theory & Mathematical Logic', accuracy: 74, totalAttempts: 4, status: 'Needs Focus' },

    // LOW RISK STUDENTS (> 78%)
    { studentId: 'STU-1007', topicId: 'TOP_OOP_POLY', topicName: 'Inheritance & Polymorphism', accuracy: 92, totalAttempts: 6, status: 'Mastered' },
    { studentId: 'STU-1007', topicId: 'TOP_OOP_CLASS', topicName: 'Classes, Objects & Constructors', accuracy: 90, totalAttempts: 5, status: 'Mastered' },

    { studentId: 'STU-1008', topicId: 'TOP_DBMS_REL', topicName: 'Relational Algebra & Tuple Calculus', accuracy: 88, totalAttempts: 7, status: 'Mastered' },
    { studentId: 'STU-1008', topicId: 'TOP_DBMS_ER', topicName: 'ER Diagrams & Data Modeling', accuracy: 88, totalAttempts: 6, status: 'Mastered' },

    { studentId: 'STU-1009', topicId: 'TOP_DS_BST', topicName: 'Binary Search Trees & AVL Trees', accuracy: 94, totalAttempts: 8, status: 'Mastered' },
    { studentId: 'STU-1009', topicId: 'TOP_DS_LINK', topicName: 'Singly & Doubly Linked Lists', accuracy: 94, totalAttempts: 7, status: 'Mastered' },

    { studentId: 'STU-1010', topicId: 'TOP_DELD_BOOL', topicName: 'Boolean Algebra & K-Map Minimization', accuracy: 86, totalAttempts: 5, status: 'Mastered' },
    { studentId: 'STU-1010', topicId: 'TOP_DELD_COMB', topicName: 'Combinational & Sequential Circuits', accuracy: 86, totalAttempts: 5, status: 'Mastered' }
  ],

  quizHistory: [
    { id: 'QUIZ_101', studentId: 'ECB0245', topicId: 'TOP_DBMS_NORM', topicName: 'DBMS Normalization (1NF, 2NF, 3NF, BCNF)', score: 48, totalQuestions: 5, correctCount: 2, timestamp: new Date(Date.now() - 86400000 * 1).toISOString() },
    { id: 'QUIZ_102', studentId: 'ECB0245', topicId: 'TOP_DS_BST', topicName: 'Binary Search Trees & AVL Trees', score: 82, totalQuestions: 5, correctCount: 4, timestamp: new Date(Date.now() - 86400000 * 3).toISOString() }
  ],

  interventions: [
    {
      id: 'INT_001', studentId: 'ECB0245', teacherId: 'ECB1234', teacherName: 'Dr. R.K. Mehta',
      topicId: 'TOP_DBMS_NORM', topicName: 'DBMS Normalization (1NF, 2NF, 3NF, BCNF)',
      type: 'Prerequisite Recovery', note: 'Please revise Relational Algebra partial dependency rules before re-attempting the DBMS Normalization evaluation quiz.',
      createdAt: new Date().toISOString(), status: 'Active'
    }
  ],

  notifications: [],

  // SMART TO-DO TASK SYSTEM
  todoTasks: {
    'ECB0245': [
      { id: 'TASK_1', title: 'Revise DBMS Normalization 2NF Rules', duration: '15 min', priority: 'High', completed: false, isAiSuggested: true },
      { id: 'TASK_2', title: 'Solve 10 DBMS Practice MCQs', duration: '10 Q', priority: 'High', completed: false, isAiSuggested: true },
      { id: 'TASK_3', title: 'Complete Data Structures BST Practice Quiz', duration: '5 Q', priority: 'Medium', completed: true, isAiSuggested: false },
      { id: 'TASK_4', title: 'Review Relational Algebra Prerequisite Notes', duration: '20 min', priority: 'Low', completed: false, isAiSuggested: false }
    ]
  },

  settings: { theme: 'dark' }
};

class StorageManager {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.resetDemoData();
    } else {
      // Ensure essential demo accounts & performance profiles are present in existing localStorage
      const db = this.getDb();
      let updated = false;

      DEFAULT_DEMO_DATA.users.forEach(demoUser => {
        const exists = db.users && db.users.some(u => u.id.toLowerCase() === demoUser.id.toLowerCase());
        if (!exists) {
          if (!db.users) db.users = [];
          db.users.push(demoUser);
          updated = true;
        } else {
          // Update demo names for consistency
          const target = db.users.find(u => u.id.toLowerCase() === demoUser.id.toLowerCase());
          if (target && target.name !== demoUser.name) {
            target.name = demoUser.name;
            updated = true;
          }
        }
      });

      DEFAULT_DEMO_DATA.performance.forEach(demoPerf => {
        const exists = db.performance && db.performance.some(p => p.studentId === demoPerf.studentId && p.topicId === demoPerf.topicId);
        if (!exists) {
          if (!db.performance) db.performance = [];
          db.performance.push(demoPerf);
          updated = true;
        }
      });

      if (updated) {
        this.saveDb(db);
      }
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

  getRandomQuote() {
    const quotes = [
      { text: "Small progress every day adds up to big results.", category: "Consistency" },
      { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", category: "Learning" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Persistence" },
      { text: "Discipline is choosing between what you want now and what you want most.", category: "Discipline" },
      { text: "Curiosity is the wick in the candle of learning.", category: "Curiosity" },
      { text: "Focus on process, and the results will take care of themselves.", category: "Improvement" }
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  validateQuestion(q) {
    if (!q || typeof q !== 'object') return false;
    if (!q.id || !q.subjectId || !q.topicId || !q.question) return false;

    const subjects = this.getSubjects();
    const subjectObj = subjects.find(s => s.id === q.subjectId);
    if (!subjectObj) return false;

    const topics = this.getTopics();
    const topicObj = topics.find(t => t.id === q.topicId);
    if (!topicObj) return false;

    if (topicObj.subjectId !== q.subjectId) return false;
    if (!Array.isArray(q.options) || q.options.length !== 4) return false;
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) return false;
    if (!q.explanation || typeof q.explanation !== 'string' || q.explanation.trim() === '') return false;

    const validDiff = ['easy', 'medium', 'hard'];
    if (!q.difficulty || !validDiff.includes(q.difficulty.toLowerCase())) return false;

    return true;
  }

  getUsers() { return this.getDb().users || []; }
  getUserById(id) { return this.getUsers().find(u => u.id.toLowerCase() === id.toLowerCase()); }

  updateUserProfile(userId, updatedData) {
    const db = this.getDb();
    if (!db.users) db.users = [];
    let u = db.users.find(x => x.id.toLowerCase() === userId.toLowerCase());
    
    if (u) {
      Object.assign(u, updatedData);
    } else {
      const current = (window.Auth && typeof Auth.getCurrentUser === 'function') ? Auth.getCurrentUser() : null;
      u = Object.assign({ id: userId }, current || {}, updatedData);
      db.users.push(u);
    }
    
    this.saveDb(db);

    // Sync active session user in localStorage
    if (window.Auth && typeof Auth.getCurrentUser === 'function') {
      const current = Auth.getCurrentUser();
      if (current && current.id.toLowerCase() === userId.toLowerCase()) {
        const updatedCurrent = Object.assign({}, current, updatedData);
        Auth.setCurrentUser(updatedCurrent);
      }
    }

    // Dispatch real-time global event
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('edunexus:profile-updated', { detail: u }));
    }
    return u;
  }

  getClasses() { return this.getDb().classes || []; }
  getSubjects() { return this.getDb().subjects || []; }

  getSubjectById(id) {
    return this.getSubjects().find(s => s.id === id);
  }

  addSubject(subject) {
    const db = this.getDb();
    if (!db.subjects) db.subjects = [];
    db.subjects.push(subject);
    this.saveDb(db);
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('edunexus:subjects-updated', { detail: subject }));
    }
  }

  updateSubject(id, updatedData) {
    const db = this.getDb();
    if (!db.subjects) db.subjects = [];
    const index = db.subjects.findIndex(s => s.id === id);
    if (index !== -1) {
      db.subjects[index] = Object.assign({}, db.subjects[index], updatedData);
      this.saveDb(db);
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(new CustomEvent('edunexus:subjects-updated', { detail: db.subjects[index] }));
      }
      return db.subjects[index];
    }
    return null;
  }

  deleteSubject(id) {
    const db = this.getDb();
    if (!db.subjects) return false;
    db.subjects = db.subjects.filter(s => s.id !== id);
    this.saveDb(db);
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('edunexus:subjects-updated', { detail: { id, deleted: true } }));
    }
    return true;
  }

  getTopics() { return this.getDb().topics || []; }
  getTopicsBySubject(subjectId) { return this.getTopics().filter(t => t.subjectId === subjectId); }

  getQuestions() {
    const raw = this.getDb().questions || [];
    return raw.filter(q => this.validateQuestion(q));
  }

  getQuestionsBySubject(subjectId) {
    return this.getQuestions().filter(q => q.subjectId === subjectId);
  }

  getQuestionsByTopic(topicId) {
    const topic = this.getTopics().find(t => t.id === topicId);
    if (!topic) return [];
    return this.getQuestions().filter(q => q.topicId === topicId && q.subjectId === topic.subjectId);
  }

  getPerformance(studentId) {
    return (this.getDb().performance || []).filter(p => p.studentId === studentId);
  }

  getQuizHistory(studentId) {
    const list = this.getDb().quizHistory || [];
    return studentId ? list.filter(q => q.studentId === studentId) : list;
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

    this.saveDb(db);
  }

  getInterventions(studentId) {
    const list = this.getDb().interventions || [];
    return studentId ? list.filter(i => i.studentId === studentId) : list;
  }

  getNotifications(userId) {
    return (this.getDb().notifications || []).filter(n => n.userId === userId);
  }

  // TO-DO LEARNING TASK SYSTEM API
  getTodoList(studentId = 'ECB0245') {
    const db = this.getDb();
    if (!db.todoTasks) db.todoTasks = {};
    if (!db.todoTasks[studentId]) {
      db.todoTasks[studentId] = [
        { id: 'TASK_1', title: 'Revise DBMS Normalization 2NF Rules', duration: '15 min', priority: 'High', completed: false, isAiSuggested: true },
        { id: 'TASK_2', title: 'Solve 10 DBMS Practice MCQs', duration: '10 Q', priority: 'High', completed: false, isAiSuggested: true },
        { id: 'TASK_3', title: 'Complete Data Structures BST Practice Quiz', duration: '5 Q', priority: 'Medium', completed: true, isAiSuggested: false },
        { id: 'TASK_4', title: 'Review Relational Algebra Prerequisite Notes', duration: '20 min', priority: 'Low', completed: false, isAiSuggested: false }
      ];
      this.saveDb(db);
    }
    return db.todoTasks[studentId];
  }

  addTodoTask(studentId, taskObj) {
    const db = this.getDb();
    if (!db.todoTasks) db.todoTasks = {};
    if (!db.todoTasks[studentId]) db.todoTasks[studentId] = [];

    const newTask = {
      id: 'TASK_' + Date.now(),
      title: taskObj.title,
      duration: taskObj.duration || '15 min',
      priority: taskObj.priority || 'Medium',
      completed: false,
      isAiSuggested: !!taskObj.isAiSuggested
    };

    db.todoTasks[studentId].push(newTask);
    this.saveDb(db);
    return newTask;
  }

  toggleTodoTask(studentId, taskId) {
    const db = this.getDb();
    if (db.todoTasks && db.todoTasks[studentId]) {
      const task = db.todoTasks[studentId].find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        this.saveDb(db);
        return task;
      }
    }
    return null;
  }

  deleteTodoTask(studentId, taskId) {
    const db = this.getDb();
    if (db.todoTasks && db.todoTasks[studentId]) {
      db.todoTasks[studentId] = db.todoTasks[studentId].filter(t => t.id !== taskId);
      this.saveDb(db);
      return true;
    }
    return false;
  }

  // TEACHER MODULE EXPANDED API
  addClass(classObj) {
    const db = this.getDb();
    if (!db.classes) db.classes = [];
    const newClass = {
      id: classObj.id || 'CLS_' + Date.now(),
      name: classObj.name || 'B.Tech CSE',
      section: classObj.section || 'Sec-A',
      studentCount: parseInt(classObj.studentCount) || 15,
      description: classObj.description || 'Computer Science & Engineering',
      createdAt: new Date().toISOString()
    };
    db.classes.push(newClass);
    this.saveDb(db);
    return newClass;
  }

  addSubject(subjectObj) {
    const db = this.getDb();
    if (!db.subjects) db.subjects = [];
    const newSubject = {
      id: subjectObj.id || 'SUB_' + Date.now(),
      code: subjectObj.code || 'CS301',
      name: subjectObj.name || 'New Subject',
      semester: subjectObj.semester || 'Semester 3',
      description: subjectObj.description || 'Core Computer Science Module',
      credits: parseInt(subjectObj.credits) || 4,
      createdAt: new Date().toISOString()
    };
    db.subjects.push(newSubject);
    this.saveDb(db);
    return newSubject;
  }

  addQuestion(qObj) {
    const db = this.getDb();
    if (!db.questions) db.questions = [];
    const newQ = {
      id: qObj.id || 'Q_' + Date.now(),
      subjectId: qObj.subjectId || 'SUB_DBMS',
      topicId: qObj.topicId || 'TOP_DBMS_NORM',
      difficulty: qObj.difficulty || 'Medium',
      question: qObj.question || 'Sample Question Text',
      options: qObj.options || ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: parseInt(qObj.correctAnswer) || 0,
      explanation: qObj.explanation || 'Solution explanation.',
      attempts: qObj.attempts || 12,
      accuracy: qObj.accuracy || 65,
      createdAt: new Date().toISOString()
    };
    db.questions.push(newQ);
    this.saveDb(db);
    return newQ;
  }

  deleteQuestion(qId) {
    const db = this.getDb();
    if (!db.questions) return false;
    db.questions = db.questions.filter(q => q.id !== qId);
    this.saveDb(db);
    return true;
  }

  addPushQuestion(pushObj) {
    const db = this.getDb();
    if (!db.pushedQuestions) db.pushedQuestions = [];
    const newPush = {
      id: pushObj.id || 'PUSH_' + Date.now(),
      studentId: pushObj.studentId || 'ECB0245',
      teacherId: pushObj.teacherId || 'ECB1234',
      questionText: pushObj.questionText || 'Custom Teacher Question',
      subjectName: pushObj.subjectName || 'Database Management Systems',
      topicName: pushObj.topicName || 'DBMS Normalization',
      difficulty: pushObj.difficulty || 'Medium',
      explanation: pushObj.explanation || 'Instructor note on this targeted problem.',
      deadline: pushObj.deadline || 'Tomorrow, 5:00 PM',
      createdAt: new Date().toISOString(),
      status: 'Assigned'
    };
    db.pushedQuestions.push(newPush);

    // Also push to student's To-Do list
    this.addTodoTask(newPush.studentId, {
      title: `🎯 Teacher Question: ${newPush.topicName}`,
      duration: '15 min',
      priority: 'High',
      isAiSuggested: true
    });

    this.saveDb(db);
    return newPush;
  }

  getPushQuestions(studentId = 'ECB0245') {
    const db = this.getDb();
    if (!db.pushedQuestions) return [];
    return db.pushedQuestions.filter(p => p.studentId.toLowerCase() === studentId.toLowerCase());
  }

  deleteIntervention(id) {
    const db = this.getDb();
    if (!db.interventions) return false;
    db.interventions = db.interventions.filter(i => i.id !== id);
    this.saveDb(db);
    return true;
  }

  updateInterventionStatus(id, newStatus) {
    const db = this.getDb();
    if (!db.interventions) return null;
    const item = db.interventions.find(i => i.id === id);
    if (item) {
      item.status = newStatus;
      this.saveDb(db);
      return item;
    }
    return null;
  }

  // MINDFUL BREAK STORAGE API
  getMindfulHistory(studentId = 'ECB0245') {
    const u = this.getUserById(studentId);
    return u ? (u.mindfulHistory || []) : [];
  }

  saveMindfulResult(studentId, result) {
    const db = this.getDb();
    const u = db.users.find(x => x.id.toLowerCase() === studentId.toLowerCase());
    if (u) {
      if (!u.mindfulHistory) u.mindfulHistory = [];
      u.mindfulHistory.push(result);
      u.mindfulXP = (u.mindfulXP || 0) + (result.xpEarned || 20);

      // Check Mindful Badge Unlocks
      if (!u.achievements) u.achievements = [];
      const historyCount = u.mindfulHistory.length;

      if (historyCount >= 3 && !u.achievements.includes('mindful_learner')) {
        u.achievements.push('mindful_learner');
      }
      if (historyCount >= 7 && !u.achievements.includes('focus_master')) {
        u.achievements.push('focus_master');
      }
      if (result.gameName === 'Focus Tap' && result.accuracy >= 90 && !u.achievements.includes('quick_thinker')) {
        u.achievements.push('quick_thinker');
      }
      if (result.gameName === 'Memory Match' && result.accuracy >= 90 && !u.achievements.includes('memory_master')) {
        u.achievements.push('memory_master');
      }

      const distinctDates = new Set(u.mindfulHistory.map(h => h.date));
      if (distinctDates.size >= 7 && !u.achievements.includes('consistent_learner')) {
        u.achievements.push('consistent_learner');
      }

      this.saveDb(db);
      if (window.Auth && Auth.getCurrentUser) {
        const current = Auth.getCurrentUser();
        if (current && current.id.toLowerCase() === studentId.toLowerCase()) {
          Auth.setCurrentUser(u);
        }
      }
      return u;
    }
    return null;
  }

  updateUser(updatedData) {
    if (!updatedData || !updatedData.id) return null;
    const db = this.getDb();
    const idx = db.users.findIndex(u => u.id.toLowerCase() === updatedData.id.toLowerCase());
    if (idx !== -1) {
      db.users[idx] = { ...db.users[idx], ...updatedData };
      this.saveDb(db);
      return db.users[idx];
    } else {
      db.users.push(updatedData);
      this.saveDb(db);
      return updatedData;
    }
  }
}

const Storage = new StorageManager();
window.Storage = Storage;
