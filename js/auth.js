/* ============================================================
   EDUNEXUS — AUTHENTICATION & ROLE SESSION MANAGER
   ============================================================ */

class AuthManager {
  constructor() {
    this.sessionKey = 'edunexus_current_user';
  }

  getCurrentUser() {
    try {
      const data = localStorage.getItem(this.sessionKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error fetching session', e);
      return null;
    }
  }

  setCurrentUser(user) {
    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(user));
    } catch (e) {
      console.error('Error saving session', e);
    }
  }

  /**
   * Triggers the Logout Confirmation Modal Overlay
   */
  confirmLogout() {
    const body = `
      <div style="text-align: center; padding: 0.5rem 0;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🚪</div>
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.35rem;">Log out of EduNexus?</h3>
        <p class="text-xs text-secondary">Are you sure you want to end your current session?</p>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="Notifications.closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="Notifications.closeModal(); Auth.logout();">Confirm Logout</button>
    `;

    Notifications.openModal('Log Out', body, footer);
  }

  /**
   * Clears ONLY active user session and redirects to Login Page
   */
  logout() {
    localStorage.removeItem(this.sessionKey);
    if (window.Notifications) {
      Notifications.toast('Logged out successfully.', 'info');
    }
    if (window.Router) {
      Router.navigate('/login');
    }
  }

  /**
   * PROTOTYPE FLEXIBLE AUTHENTICATION ENGINE (FOR COLLEGE DEMO & PROTOTYPE)
   * 
   * NOTE FOR FUTURE BACKEND INTEGRATION:
   * This flexible authentication logic allows entering any non-empty ID and password
   * for demo presentation purposes.
   * When integrating a production backend, replace this function with API token validation
   * and server-side role authorization checks.
   */
  login(role, userId, password) {
    const cleanId = (userId || '').trim();
    const cleanPass = (password || '').trim();
    const cleanRole = (role || 'student').toLowerCase();

    // 1. Empty Input Validation
    if (!cleanId && !cleanPass) {
      return { success: false, message: 'Please enter your ID and password.' };
    }
    if (!cleanId) {
      return { success: false, message: 'Please enter your ID.' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Please enter your password.' };
    }

    // 2. Session Data & Profile Resolution
    // If an existing stored user matches the ID, use their existing profile data.
    let user = Storage.getUserById(cleanId);

    if (!user || user.role.toLowerCase() !== cleanRole) {
      const defaultName = (cleanId === '0245' || cleanId.toUpperCase() === 'ECB0245' || cleanId.toUpperCase() === 'DEMO0245') ? 'ASHISH' : cleanId;
      user = {
        id: cleanId,
        name: defaultName,
        role: cleanRole,
        email: `${cleanId.toLowerCase()}@edunexus.edu`,
        mobileNumber: '+91 9876543210',
        schoolCode: 'ECB',
        institution: 'Engineering College Bikaner',
        rollNumber: cleanId.replace(/\D/g, '') || '0245',
        branch: cleanRole === 'teacher' ? 'Database Systems' : 'Computer Science',
        year: 'Undergraduate',
        semester: 'Semester 3',
        classId: 'Sec-A',
        streakDays: 5,
        achievements: ['first_quiz'],
        mindfulHistory: [],
        mindfulXP: 0
      };
      Storage.addUser(user);
    }

    this.setCurrentUser(user);
    return { success: true, user };
  }

  /**
   * Student Registration: Auto-generates ID from School Code + Roll Number
   */
  registerStudent({ fullName, schoolCode, rollNumber, classId, password, confirmPassword }) {
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match.' };
    }

    const cleanSchool = schoolCode.trim().toUpperCase();
    const cleanRoll = rollNumber.trim().padStart(4, '0');
    const generatedId = `${cleanSchool}${cleanRoll}`;

    if (Storage.getUserById(generatedId)) {
      return { success: false, message: `Student ID ${generatedId} already exists.` };
    }

    const newStudent = {
      id: generatedId,
      name: fullName,
      role: 'student',
      password,
      schoolCode: cleanSchool,
      rollNumber: cleanRoll,
      classId: classId || 'CSE-3A',
      branch: 'Computer Science & Engineering',
      semester: 'Semester 3',
      streakDays: 1,
      achievements: ['first_quiz']
    };

    Storage.addUser(newStudent);
    return { success: true, id: generatedId };
  }

  /**
   * Teacher Registration: Auto-generates ID from School Code + Last 4 digits of Mobile Number
   */
  registerTeacher({ fullName, schoolCode, mobileNumber, subject, password, confirmPassword }) {
    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match.' };
    }

    const cleanSchool = schoolCode.trim().toUpperCase();
    const cleanMobile = mobileNumber.trim();
    const last4 = cleanMobile.slice(-4) || '1234';
    const generatedId = `${cleanSchool}${last4}`;

    if (Storage.getUserById(generatedId)) {
      return { success: false, message: `Teacher ID ${generatedId} already exists.` };
    }

    const newTeacher = {
      id: generatedId,
      name: fullName,
      role: 'teacher',
      password,
      schoolCode: cleanSchool,
      mobileNumber: cleanMobile,
      subject: subject || 'Database Management Systems',
      assignedClasses: ['CSE-3A']
    };

    Storage.addUser(newTeacher);
    return { success: true, id: generatedId };
  }
}

const Auth = new AuthManager();
window.Auth = Auth;
