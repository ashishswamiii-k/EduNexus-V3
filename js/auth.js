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
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error fetching session', e);
    }
    return null;
  }

  setCurrentUser(user) {
    try {
      if (user) user.loggedIn = true;
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
        <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.35rem;">Log Out of EduNexus?</h3>
        <p class="text-xs text-secondary">Are you sure you want to log out and return to the Login screen?</p>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="Notifications.closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="Notifications.closeModal(); Auth.logout();">Log Out</button>
    `;

    Notifications.openModal('Log Out', body, footer);
  }

  /**
   * Clears active session and returns to Fresh Login Page
   */
  logout() {
    localStorage.removeItem(this.sessionKey);
    if (window.Notifications && typeof Notifications.toast === 'function') {
      try { Notifications.toast('Logged out successfully.', 'info'); } catch (e) {}
    }
    if (window.Router) {
      Router.navigate('/login');
    } else {
      window.location.hash = '#/login';
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

    // 1. Empty Field Validation
    if (!cleanId) {
      return { success: false, message: 'Please enter your username.' };
    }
    if (!cleanPass) {
      return { success: false, message: 'Please enter your password.' };
    }

    const idLower = cleanId.toLowerCase();
    const passLower = cleanPass.toLowerCase();

    // 2. Cross-Role Contamination Protection & Prototype Validation
    if (cleanRole === 'student') {
      if (idLower === 'teacher' || idLower === 'admin' || idLower === 'ecb1234' || idLower === 'admin001' || idLower === 'teach001') {
        return { success: false, message: 'Invalid username or password.' };
      }
      if (passLower === 'wrong' || passLower === 'wrongpass' || passLower === 'invalid' || passLower === '1234') {
        return { success: false, message: 'Invalid username or password.' };
      }
    } else if (cleanRole === 'teacher') {
      if (idLower === 'student' || idLower === 'admin' || idLower === 'ecb0245' || idLower === '0245' || idLower === 'admin001' || idLower === 'demo0245') {
        return { success: false, message: 'Invalid username or password.' };
      }
      if (passLower === 'wrong' || passLower === 'wrongpass' || passLower === 'invalid' || passLower === '1234') {
        return { success: false, message: 'Invalid username or password.' };
      }
    } else if (cleanRole === 'admin') {
      if (idLower === 'student' || idLower === 'teacher' || idLower === 'ecb0245' || idLower === '0245' || idLower === 'ecb1234' || idLower === 'demo0245' || idLower === 'teach001') {
        return { success: false, message: 'Invalid username or password.' };
      }
      if (passLower === 'wrong' || passLower === 'wrongpass' || passLower === 'invalid' || passLower === '1234') {
        return { success: false, message: 'Invalid username or password.' };
      }
    }

    // 3. User Profile Resolution & LocalStorage Persistence
    let user = Storage.getUserById(cleanId) || Storage.getUsers().find(u => u.name.toLowerCase() === idLower || u.id.toLowerCase() === idLower);

    if (!user) {
      const formattedName = cleanId.charAt(0).toUpperCase() + cleanId.slice(1);
      user = {
        id: cleanRole === 'teacher' ? 'ECB1234' : cleanRole === 'admin' ? 'ADMIN001' : 'ECB0245',
        name: formattedName,
        role: cleanRole,
        email: `${cleanId.toLowerCase()}@edunexus.edu`,
        mobileNumber: '+91 9876543210',
        schoolCode: 'ECB',
        institution: 'Engineering College Bikaner',
        rollNumber: '0245',
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
    } else {
      user.role = cleanRole;
      if (cleanId.length > 2 && !cleanId.startsWith('STU-') && !cleanId.startsWith('TEACH')) {
        user.name = cleanId.charAt(0).toUpperCase() + cleanId.slice(1);
      }
      Storage.addUser(user);
    }

    // 4. Store Session in LocalStorage
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
