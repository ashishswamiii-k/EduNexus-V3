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

  updateProfile(fields) {
    const current = this.getCurrentUser();
    if (!current) return null;

    const updated = { ...current, ...fields };
    this.setCurrentUser(updated);

    if (window.Storage && Storage.updateUser) {
      Storage.updateUser(updated);
    }

    // Broadcast profile update event to update sidebars, headers, and UI elements in real time
    window.dispatchEvent(new CustomEvent('edunexus:profile-updated', { detail: updated }));
    return updated;
  }

  openProfileModal(isEditMode = false) {
    const user = this.getCurrentUser() || { name: 'User', role: 'student', id: 'USER01' };
    const role = (user.role || 'student').toLowerCase();
    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';

    const avatarHtml = user.avatarUrl
      ? `<img src="${user.avatarUrl}" alt="${user.name}" style="width:84px; height:84px; border-radius:50%; object-fit:cover; border:3px solid var(--accent-purple); box-shadow:0 4px 12px rgba(0,0,0,0.15);" />`
      : `<div style="width:84px; height:84px; border-radius:50%; background:linear-gradient(135deg, #6366F1, #8B5CF6); color:#fff; font-size:1.8rem; font-weight:800; display:flex; align-items:center; justify-content:center; border:3px solid var(--accent-purple); box-shadow:0 4px 12px rgba(0,0,0,0.15); margin:0 auto;">${initials}</div>`;

    let roleFieldsHtml = '';
    if (role === 'teacher') {
      roleFieldsHtml = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; margin-bottom:0.85rem;">
          <div><label class="form-label" style="font-size:0.75rem;">Teacher ID (Protected)</label><input type="text" class="form-control" value="${user.id || 'ECB1234'}" disabled style="opacity:0.7;" /></div>
          <div><label class="form-label" style="font-size:0.75rem;">Institution</label><input type="text" class="form-control" value="${user.institution || user.schoolCode || 'Government Eng. College Bikaner'}" disabled style="opacity:0.7;" /></div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; margin-bottom:0.85rem;">
          <div><label class="form-label" style="font-size:0.75rem;">Full Name</label><input type="text" id="prof-edit-name" class="form-control" value="${user.name || ''}" ${isEditMode ? '' : 'disabled'} /></div>
          <div><label class="form-label" style="font-size:0.75rem;">Official Email</label><input type="email" id="prof-edit-email" class="form-control" value="${user.email || 'dr.mehta@ecb.ac.in'}" ${isEditMode ? '' : 'disabled'} /></div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; margin-bottom:0.85rem;">
          <div><label class="form-label" style="font-size:0.75rem;">Department</label><input type="text" id="prof-edit-dept" class="form-control" value="${user.branch || user.subject || 'Computer Science & Engineering'}" ${isEditMode ? '' : 'disabled'} /></div>
          <div><label class="form-label" style="font-size:0.75rem;">Assigned Classes</label><input type="text" class="form-control" value="${(user.assignedClasses || ['Sec-A', 'Sec-B']).join(', ')}" disabled style="opacity:0.7;" /></div>
        </div>
      `;
    } else if (role === 'admin') {
      roleFieldsHtml = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; margin-bottom:0.85rem;">
          <div><label class="form-label" style="font-size:0.75rem;">Admin ID (Protected)</label><input type="text" class="form-control" value="${user.id || 'ADM001'}" disabled style="opacity:0.7;" /></div>
          <div><label class="form-label" style="font-size:0.75rem;">Access Level</label><input type="text" class="form-control" value="Full Administrator" disabled style="opacity:0.7;" /></div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; margin-bottom:0.85rem;">
          <div><label class="form-label" style="font-size:0.75rem;">Full Name</label><input type="text" id="prof-edit-name" class="form-control" value="${user.name || ''}" ${isEditMode ? '' : 'disabled'} /></div>
          <div><label class="form-label" style="font-size:0.75rem;">Official Email</label><input type="email" id="prof-edit-email" class="form-control" value="${user.email || 'admin@ecb.ac.in'}" ${isEditMode ? '' : 'disabled'} /></div>
        </div>
      `;
    } else {
      // Student
      roleFieldsHtml = `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; margin-bottom:0.85rem;">
          <div><label class="form-label" style="font-size:0.75rem;">Student ID (Protected)</label><input type="text" class="form-control" value="${user.id || 'ECB0245'}" disabled style="opacity:0.7;" /></div>
          <div><label class="form-label" style="font-size:0.75rem;">Roll Number</label><input type="text" class="form-control" value="${user.rollNumber || '0245'}" disabled style="opacity:0.7;" /></div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; margin-bottom:0.85rem;">
          <div><label class="form-label" style="font-size:0.75rem;">Full Name</label><input type="text" id="prof-edit-name" class="form-control" value="${user.name || ''}" ${isEditMode ? '' : 'disabled'} /></div>
          <div><label class="form-label" style="font-size:0.75rem;">Email Address</label><input type="email" id="prof-edit-email" class="form-control" value="${user.email || 'rahul.meena@ecb.ac.in'}" ${isEditMode ? '' : 'disabled'} /></div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; margin-bottom:0.85rem;">
          <div><label class="form-label" style="font-size:0.75rem;">Branch</label><input type="text" id="prof-edit-dept" class="form-control" value="${user.branch || 'Computer Science'}" ${isEditMode ? '' : 'disabled'} /></div>
          <div><label class="form-label" style="font-size:0.75rem;">Semester & Class</label><input type="text" class="form-control" value="${user.semester || 'Semester 3'} (${user.classId || 'Sec-A'})" disabled style="opacity:0.7;" /></div>
        </div>
      `;
    }

    const bodyHtml = `
      <div style="text-align:center; margin-bottom:1.25rem;">
        <div style="position:relative; display:inline-block; margin-bottom:0.75rem;">
          ${avatarHtml}
        </div>

        <div style="display:flex; justify-content:center; gap:0.5rem; margin-bottom:1rem;">
          <input type="file" id="avatar-file-input" accept="image/png, image/jpeg, image/jpg, image/webp" style="display:none;" onchange="Auth.handleAvatarSelected(event)" />
          <button class="btn btn-action-ghost" onclick="document.getElementById('avatar-file-input').click()">📷 Change Profile Picture</button>
        </div>

        <div style="font-size:1.2rem; font-weight:800; color:var(--text-primary);">${user.name}</div>
        <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; font-weight:700;">${role}</div>
      </div>

      <form id="profile-edit-form" onsubmit="event.preventDefault(); Auth.saveProfileEdit();">
        ${roleFieldsHtml}
        
        <div style="display:flex; justify-content:flex-end; gap:0.65rem; margin-top:1.25rem;">
          ${isEditMode ? `
            <button type="button" class="btn btn-action-ghost" onclick="Auth.openProfileModal(false)">Cancel</button>
            <button type="submit" class="btn btn-action-purple">✓ Save Changes</button>
          ` : `
            <button type="button" class="btn btn-action-purple" onclick="Auth.openProfileModal(true)">✎ Edit Profile</button>
          `}
        </div>
      </form>
    `;

    Notifications.openModal(`${role.toUpperCase()} PROFILE`, bodyHtml, null);
  }

  handleAvatarSelected(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      Notifications.toast('Invalid image size. Please select an image under 5 MB.', 'error');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      Notifications.toast('Invalid image format. Please select a JPG, PNG, JPEG, or WEBP image.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      this.updateProfile({ avatarUrl: base64Data });
      Notifications.toast('✓ Profile picture updated successfully', 'success');
      this.openProfileModal(false);
    };
    reader.readAsDataURL(file);
  }

  saveProfileEdit() {
    const nameEl = document.getElementById('prof-edit-name');
    const emailEl = document.getElementById('prof-edit-email');
    const deptEl = document.getElementById('prof-edit-dept');

    const updates = {};
    if (nameEl && nameEl.value.trim()) updates.name = nameEl.value.trim();
    if (emailEl && emailEl.value.trim()) updates.email = emailEl.value.trim();
    if (deptEl && deptEl.value.trim()) updates.branch = deptEl.value.trim();

    this.updateProfile(updates);
    Notifications.closeModal();
    Notifications.toast('✓ Profile updated successfully', 'success');
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
