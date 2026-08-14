/* ============================================================
   EDUNEXUS — AUTHENTICATION & ROLE MANAGEMENT MODULE
   ============================================================ */

const SESSION_KEY = 'edunexus_current_user';

class AuthManager {
  constructor() {
    this.currentUser = this.loadSession();
  }

  loadSession() {
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isLoggedIn() {
    return !!this.currentUser;
  }

  login(role, userId, password) {
    if (!userId || !password) {
      return { success: false, message: 'Please enter User ID and Password.' };
    }

    const user = Storage.getUserById(userId.trim());

    if (!user) {
      return { success: false, message: 'Invalid credentials.' };
    }

    // Role strict check
    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return { success: false, message: 'Invalid credentials.' };
    }

    // Password check
    if (user.password !== password) {
      return { success: false, message: 'Invalid credentials.' };
    }

    // Auth Successful! Store session
    this.currentUser = {
      id: user.id,
      name: user.name,
      role: user.role,
      classId: user.classId || null,
      schoolCode: user.schoolCode || 'ECB',
      subject: user.subject || null
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(this.currentUser));
    return { success: true, user: this.currentUser };
  }

  registerStudent({ fullName, schoolCode, rollNumber, classId, password, confirmPassword }) {
    if (!fullName || !schoolCode || !rollNumber || !classId || !password) {
      return { success: false, message: 'All required fields must be filled.' };
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match.' };
    }

    const generatedId = `${schoolCode.toUpperCase()}${rollNumber.padStart(4, '0')}`;

    if (Storage.getUserById(generatedId)) {
      return { success: false, message: `An account with ID ${generatedId} already exists.` };
    }

    const newStudent = {
      id: generatedId,
      name: fullName.trim(),
      role: 'student',
      password: password,
      schoolCode: schoolCode.toUpperCase(),
      rollNumber: rollNumber,
      classId: classId,
      streakDays: 1,
      achievements: []
    };

    Storage.addUser(newStudent);
    return { success: true, id: generatedId, message: 'Registration successful! You can now log in.' };
  }

  registerTeacher({ fullName, schoolCode, mobileNumber, subject, password, confirmPassword }) {
    if (!fullName || !schoolCode || !mobileNumber || !subject || !password) {
      return { success: false, message: 'All required fields must be filled.' };
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match.' };
    }

    const last4 = mobileNumber.slice(-4);
    const generatedId = `${schoolCode.toUpperCase()}${last4}`;

    if (Storage.getUserById(generatedId)) {
      return { success: false, message: `A teacher account with ID ${generatedId} already exists.` };
    }

    const newTeacher = {
      id: generatedId,
      name: fullName.trim(),
      role: 'teacher',
      password: password,
      schoolCode: schoolCode.toUpperCase(),
      mobileNumber: mobileNumber,
      subject: subject,
      assignedClasses: ['10-A']
    };

    Storage.addUser(newTeacher);
    return { success: true, id: generatedId, message: 'Teacher registration successful! You can now log in.' };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem(SESSION_KEY);
    window.location.hash = '#/login';
    if (window.Router) {
      window.Router.navigate('/login');
    }
  }
}

const Auth = new AuthManager();
window.Auth = Auth;
