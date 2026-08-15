/* ============================================================
   EDUNEXUS — SUBJECT MANAGEMENT MODULE (ADD, EDIT, DELETE, DETAILS)
   FLEXIBLE RESOURCE INPUTS (OPTIONAL SYLLABUS PDF & MANUAL SYLLABUS)
   ============================================================ */

class SubjectManagerController {
  constructor() {
    this.pendingFiles = {
      syllabus: null,
      pyq: null,
      materials: []
    };
  }

  resetPendingFiles() {
    this.pendingFiles = {
      syllabus: null,
      pyq: null,
      materials: []
    };
  }

  showAddSubjectModal() {
    this.resetPendingFiles();

    const modalHtml = `
      <div id="add-subject-modal" class="modal-overlay active" style="z-index:var(--z-modal);">
        <div class="modal-container fade-in" style="max-width:560px; width:92%; max-height:90vh; overflow-y:auto;">
          <div class="modal-header">
            <div>
              <h3 class="modal-title" style="display:flex; align-items:center; gap:0.5rem;">
                📘 Add New Subject
              </h3>
              <p style="font-size:0.775rem; color:var(--text-muted); margin-top:0.15rem;">
                Enter subject details and optional study resources to customize your learning path.
              </p>
            </div>
            <button class="modal-close" onclick="SubjectManager.closeAddSubjectModal()">&times;</button>
          </div>

          <div class="modal-body" style="padding:1.25rem 1.5rem;">
            <form id="add-subject-form" onsubmit="event.preventDefault(); SubjectManager.submitAddSubject();">
              
              <!-- 1. SUBJECT NAME (REQUIRED) -->
              <div class="form-group" style="margin-bottom:1.15rem;">
                <label class="form-label" style="font-weight:700;">Subject Name <span style="color:var(--accent-rose);">*</span></label>
                <input type="text" id="add-sub-name" class="form-control" placeholder="e.g. Database Management Systems" required />
              </div>

              <div class="form-group" style="margin-bottom:1.15rem;">
                <label class="form-label" style="font-weight:700;">Semester / Academic Level</label>
                <select id="add-sub-semester" class="form-control form-select">
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 6">Semester 6</option>
                </select>
              </div>

              <!-- 2. SYLLABUS PDF (OPTIONAL) -->
              <div class="form-group" style="margin-bottom:1.15rem; background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                <label class="form-label" style="font-weight:700; display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                  <span>Syllabus PDF <span style="font-size:0.75rem; color:var(--text-muted); font-weight:400;">(Optional)</span></span>
                  <span style="font-size:0.725rem; color:var(--text-muted);">PDF only (Max 10 MB)</span>
                </label>
                <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.6rem;">
                  Recommended: Upload your syllabus PDF for better topic analysis and personalized recommendations.
                </p>
                <input type="file" id="add-sub-syllabus-input" accept="application/pdf,.pdf" style="display:none;" onchange="SubjectManager.handleFileSelect(this, 'syllabus')" />
                <button type="button" class="btn btn-secondary w-full" style="justify-content:center; border:1px dashed var(--border-focus); padding:0.6rem;" onclick="document.getElementById('add-sub-syllabus-input').click()">
                  📄 Upload Syllabus PDF
                </button>
                <div id="syllabus-file-preview"></div>
              </div>

              <!-- 3. MANUAL SYLLABUS / TOPICS (OPTIONAL ALTERNATIVE) -->
              <div class="form-group" style="margin-bottom:1.15rem;">
                <label class="form-label" style="font-weight:700;">OR Enter syllabus/topics manually <span style="font-size:0.75rem; color:var(--text-muted); font-weight:400;">(Optional)</span></label>
                <textarea id="add-sub-manual-syllabus" class="form-control" rows="3" placeholder="Unit 1: Introduction to DBMS&#10;Unit 2: ER Model&#10;Unit 3: Relational Model&#10;Unit 4: SQL&#10;Unit 5: Normalization"></textarea>
              </div>

              <!-- 4. PREVIOUS YEAR QUESTIONS (PYQ) PDF (OPTIONAL) -->
              <div class="form-group" style="margin-bottom:1.15rem; background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                <label class="form-label" style="font-weight:700; display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                  <span>Previous Year Questions (PYQs) <span style="font-size:0.75rem; color:var(--text-muted); font-weight:400;">(Optional)</span></span>
                  <span style="font-size:0.725rem; color:var(--text-muted);">PDF only (Max 10 MB)</span>
                </label>
                <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.6rem;">
                  Recommended: Upload PYQs to improve question relevance and exam-oriented recommendations.
                </p>
                <input type="file" id="add-sub-pyq-input" accept="application/pdf,.pdf" style="display:none;" onchange="SubjectManager.handleFileSelect(this, 'pyq')" />
                <button type="button" class="btn btn-secondary w-full" style="justify-content:center; border:1px dashed var(--border-focus); padding:0.6rem;" onclick="document.getElementById('add-sub-pyq-input').click()">
                  📄 Upload PYQ PDF
                </button>
                <div id="pyq-file-preview"></div>
              </div>

              <!-- 5. ADDITIONAL STUDY MATERIAL (OPTIONAL) -->
              <div class="form-group" style="margin-bottom:1.25rem;">
                <label class="form-label" style="font-weight:700;">Additional Study Material <span style="font-size:0.75rem; color:var(--text-muted); font-weight:400;">(Optional)</span></label>
                <input type="file" id="add-sub-material-input" accept="application/pdf,.pdf" style="display:none;" onchange="SubjectManager.handleFileSelect(this, 'material')" />
                <button type="button" class="btn btn-outline btn-sm" onclick="document.getElementById('add-sub-material-input').click()">
                  + Upload Material (PDF)
                </button>
                <div id="material-file-preview"></div>
              </div>

              <!-- 6. INFORMATION / RECOMMENDATION NOTICE -->
              <div style="background:rgba(6, 182, 212, 0.08); border:1px solid rgba(6, 182, 212, 0.25); border-radius:var(--radius-sm); padding:0.85rem 1rem; margin-bottom:1.25rem;">
                <div style="font-size:0.825rem; font-weight:700; color:var(--accent-cyan); margin-bottom:0.25rem;">
                  💡 Improve Your Personalized Learning
                </div>
                <p style="font-size:0.775rem; color:var(--text-secondary); margin:0; line-height:1.45;">
                  EduNexus can work without uploaded PDFs, but providing your syllabus and previous-year questions helps us generate more relevant learning paths, practice questions, and exam-oriented recommendations.
                </p>
              </div>

              <!-- FORM FOOTER BUTTONS -->
              <div style="display:flex; align-items:center; justify-content:flex-end; gap:0.75rem; border-top:1px solid var(--border-color); padding-top:1rem;">
                <button type="button" class="btn btn-secondary" onclick="SubjectManager.closeAddSubjectModal()">Cancel</button>
                <button type="submit" id="add-sub-submit-btn" class="btn btn-primary">
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('add-subject-modal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  closeAddSubjectModal() {
    const modal = document.getElementById('add-subject-modal');
    if (modal) modal.remove();
    this.resetPendingFiles();
  }

  handleFileSelect(input, type) {
    const file = input.files && input.files[0];
    if (!file) return;

    const filename = file.name || '';
    const isPdf = filename.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';

    if (!isPdf) {
      if (window.Notifications) Notifications.toast('Please select a valid PDF file.', 'error');
      input.value = '';
      return;
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      if (window.Notifications) Notifications.toast('File size must be less than 10 MB.', 'error');
      input.value = '';
      return;
    }

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const fileObj = {
      name: filename,
      size: sizeFormatted,
      status: 'Ready for Analysis',
      uploadedAt: new Date().toISOString()
    };

    if (type === 'syllabus') {
      this.pendingFiles.syllabus = fileObj;
      this.renderFileCard('syllabus-file-preview', fileObj, 'syllabus');
    } else if (type === 'pyq') {
      this.pendingFiles.pyq = fileObj;
      this.renderFileCard('pyq-file-preview', fileObj, 'pyq');
    } else if (type === 'material') {
      if (!this.pendingFiles.materials) this.pendingFiles.materials = [];
      this.pendingFiles.materials.push(fileObj);
      this.renderMaterialsCards('material-file-preview');
    }
  }

  renderFileCard(containerId, fileObj, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="pdf-file-card fade-in" style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-tertiary); border:1px solid var(--border-focus); border-radius:var(--radius-sm); padding:0.65rem 0.85rem; margin-top:0.5rem;">
        <div style="display:flex; align-items:center; gap:0.65rem; min-width:0; flex:1;">
          <span style="font-size:1.3rem;">📄</span>
          <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            <div style="font-size:0.85rem; font-weight:700; color:var(--text-primary); text-overflow:ellipsis; overflow:hidden;">${fileObj.name}</div>
            <div style="font-size:0.725rem; color:var(--text-muted);">${fileObj.size} • <span style="color:#10B981; font-weight:600;">✓ PDF ready</span></div>
          </div>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" style="padding:0.25rem 0.55rem; font-size:0.75rem; color:var(--accent-rose); margin-left:0.5rem;" onclick="SubjectManager.removePendingFile('${type}')">
          Remove
        </button>
      </div>
    `;
  }

  renderMaterialsCards(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!this.pendingFiles.materials || this.pendingFiles.materials.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = this.pendingFiles.materials.map((fileObj, idx) => `
      <div class="pdf-file-card fade-in" style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.5rem 0.75rem; margin-top:0.4rem;">
        <div style="display:flex; align-items:center; gap:0.5rem; overflow:hidden;">
          <span style="font-size:1.1rem;">📄</span>
          <span style="font-size:0.8rem; font-weight:600; color:var(--text-primary); text-overflow:ellipsis; overflow:hidden;">${fileObj.name} (${fileObj.size})</span>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.45rem; font-size:0.7rem; color:var(--accent-rose);" onclick="SubjectManager.removeMaterialFile(${idx})">
          Remove
        </button>
      </div>
    `).join('');
  }

  removePendingFile(type) {
    if (type === 'syllabus') {
      this.pendingFiles.syllabus = null;
      const el = document.getElementById('syllabus-file-preview');
      if (el) el.innerHTML = '';
      const input = document.getElementById('add-sub-syllabus-input');
      if (input) input.value = '';
    } else if (type === 'pyq') {
      this.pendingFiles.pyq = null;
      const el = document.getElementById('pyq-file-preview');
      if (el) el.innerHTML = '';
      const input = document.getElementById('add-sub-pyq-input');
      if (input) input.value = '';
    }
  }

  removeMaterialFile(index) {
    if (this.pendingFiles.materials) {
      this.pendingFiles.materials.splice(index, 1);
      this.renderMaterialsCards('material-file-preview');
    }
  }

  submitAddSubject() {
    const nameInput = document.getElementById('add-sub-name');
    const name = nameInput ? nameInput.value.trim() : '';
    const semester = document.getElementById('add-sub-semester')?.value || 'Semester 3';
    const manualSyllabus = document.getElementById('add-sub-manual-syllabus')?.value.trim() || '';

    // 1. Validate Subject Name ONLY (Required)
    if (!name) {
      if (window.Notifications) Notifications.toast('Please enter the subject name.', 'error');
      return;
    }

    // Determine configuration status
    const hasSyllabusPdf = Boolean(this.pendingFiles.syllabus);
    const hasManualSyllabus = Boolean(manualSyllabus);
    const hasSyllabus = hasSyllabusPdf || hasManualSyllabus;
    const hasPyq = Boolean(this.pendingFiles.pyq);

    let status = 'Basic Subject';
    if (hasSyllabus && hasPyq) {
      status = 'Ready for Analysis';
    } else if (hasSyllabus || hasPyq) {
      status = 'Partially Prepared';
    }

    // Show loading state on button
    const submitBtn = document.getElementById('add-sub-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Adding Subject...';
    }

    setTimeout(() => {
      const code = name.split(' ').map(w => w[0]).join('').toUpperCase() + Math.floor(100 + Math.random() * 900);
      const newSubject = {
        id: 'SUB_' + Date.now(),
        name: name,
        code: code,
        semester: semester,
        assignedClasses: ['Sec-A', 'Sec-B'],
        syllabusFile: this.pendingFiles.syllabus,
        manualSyllabus: manualSyllabus,
        pyqFile: this.pendingFiles.pyq,
        additionalMaterials: this.pendingFiles.materials || [],
        progress: 0,
        status: status,
        createdAt: new Date().toISOString()
      };

      Storage.addSubject(newSubject);
      this.closeAddSubjectModal();

      if (window.Notifications) {
        Notifications.toast(`✓ Subject Created Successfully: ${name}`, 'success');
        if (!hasSyllabus) {
          Notifications.toast('⚠️ Add Your Syllabus: Add a syllabus to help EduNexus build a more accurate learning path.', 'warning', 5000);
        } else if (!hasPyq) {
          Notifications.toast('💡 Add Previous-Year Questions: Uploading PYQs helps create more relevant practice questions.', 'info', 5000);
        }
      }

      if (window.Router && Router.currentRoute === '/subjects') {
        Router.renderSubjects();
      }
    }, 300);
  }

  toggleCardDropdown(event, subjectId) {
    event.stopPropagation();
    const dropdown = document.getElementById(`sub-dropdown-${subjectId}`);
    if (dropdown) {
      document.querySelectorAll('.header-profile-dropdown.show').forEach(el => {
        if (el !== dropdown) el.classList.remove('show');
      });
      dropdown.classList.toggle('show');
    }
  }

  showEditSubjectModal(subjectId) {
    const s = Storage.getSubjectById(subjectId);
    if (!s) return;

    this.pendingFiles = {
      syllabus: s.syllabusFile || null,
      pyq: s.pyqFile || null,
      materials: s.additionalMaterials ? [...s.additionalMaterials] : []
    };

    const modalHtml = `
      <div id="edit-subject-modal" class="modal-overlay active" style="z-index:var(--z-modal);">
        <div class="modal-container fade-in" style="max-width:560px; width:92%; max-height:90vh; overflow-y:auto;">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">✏️ Edit Subject: ${s.name}</h3>
              <p style="font-size:0.775rem; color:var(--text-muted); margin-top:0.15rem;">
                Update subject details or add missing study resources.
              </p>
            </div>
            <button class="modal-close" onclick="SubjectManager.closeEditSubjectModal()">&times;</button>
          </div>

          <div class="modal-body" style="padding:1.25rem 1.5rem;">
            <form id="edit-subject-form" onsubmit="event.preventDefault(); SubjectManager.submitEditSubject('${s.id}');">
              
              <div class="form-group" style="margin-bottom:1.15rem;">
                <label class="form-label" style="font-weight:700;">Subject Name <span style="color:var(--accent-rose);">*</span></label>
                <input type="text" id="edit-sub-name" class="form-control" value="${s.name}" required />
              </div>

              <div class="form-group" style="margin-bottom:1.15rem;">
                <label class="form-label" style="font-weight:700;">Semester</label>
                <select id="edit-sub-semester" class="form-control form-select">
                  <option value="Semester 3" ${s.semester === 'Semester 3' ? 'selected' : ''}>Semester 3</option>
                  <option value="Semester 4" ${s.semester === 'Semester 4' ? 'selected' : ''}>Semester 4</option>
                  <option value="Semester 5" ${s.semester === 'Semester 5' ? 'selected' : ''}>Semester 5</option>
                  <option value="Semester 6" ${s.semester === 'Semester 6' ? 'selected' : ''}>Semester 6</option>
                </select>
              </div>

              <!-- SYLLABUS PDF (OPTIONAL) -->
              <div class="form-group" style="margin-bottom:1.15rem; background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                <label class="form-label" style="font-weight:700;">Syllabus PDF (Optional)</label>
                <input type="file" id="edit-sub-syllabus-input" accept="application/pdf,.pdf" style="display:none;" onchange="SubjectManager.handleFileSelect(this, 'syllabus')" />
                <button type="button" class="btn btn-secondary w-full" onclick="document.getElementById('edit-sub-syllabus-input').click()">
                  📄 ${s.syllabusFile ? 'Replace Syllabus PDF' : 'Upload Syllabus PDF'}
                </button>
                <div id="syllabus-file-preview">
                  ${s.syllabusFile ? `
                    <div class="pdf-file-card" style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.6rem 0.85rem; margin-top:0.5rem;">
                      <div style="display:flex; align-items:center; gap:0.6rem;">
                        <span style="font-size:1.2rem;">📄</span>
                        <div>
                          <div style="font-size:0.85rem; font-weight:700; color:var(--text-primary);">${s.syllabusFile.name}</div>
                          <div style="font-size:0.725rem; color:var(--text-muted);">${s.syllabusFile.size} • <span style="color:#10B981;">✓ Uploaded</span></div>
                        </div>
                      </div>
                      <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.5rem; font-size:0.75rem; color:var(--accent-rose);" onclick="SubjectManager.removePendingFile('syllabus')">Remove</button>
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- MANUAL SYLLABUS (OPTIONAL) -->
              <div class="form-group" style="margin-bottom:1.15rem;">
                <label class="form-label" style="font-weight:700;">Enter syllabus/topics manually (Optional)</label>
                <textarea id="edit-sub-manual-syllabus" class="form-control" rows="3" placeholder="Unit 1: Introduction...">${s.manualSyllabus || ''}</textarea>
              </div>

              <!-- PYQ PDF (OPTIONAL) -->
              <div class="form-group" style="margin-bottom:1.15rem; background:var(--bg-tertiary); padding:0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                <label class="form-label" style="font-weight:700;">Previous Year Questions (PYQ) (Optional)</label>
                <input type="file" id="edit-sub-pyq-input" accept="application/pdf,.pdf" style="display:none;" onchange="SubjectManager.handleFileSelect(this, 'pyq')" />
                <button type="button" class="btn btn-secondary w-full" onclick="document.getElementById('edit-sub-pyq-input').click()">
                  📄 ${s.pyqFile ? 'Replace PYQ PDF' : 'Upload PYQ PDF'}
                </button>
                <div id="pyq-file-preview">
                  ${s.pyqFile ? `
                    <div class="pdf-file-card" style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:0.6rem 0.85rem; margin-top:0.5rem;">
                      <div style="display:flex; align-items:center; gap:0.6rem;">
                        <span style="font-size:1.2rem;">📄</span>
                        <div>
                          <div style="font-size:0.85rem; font-weight:700; color:var(--text-primary);">${s.pyqFile.name}</div>
                          <div style="font-size:0.725rem; color:var(--text-muted);">${s.pyqFile.size} • <span style="color:#10B981;">✓ Uploaded</span></div>
                        </div>
                      </div>
                      <button type="button" class="btn btn-secondary btn-sm" style="padding:0.2rem 0.5rem; font-size:0.75rem; color:var(--accent-rose);" onclick="SubjectManager.removePendingFile('pyq')">Remove</button>
                    </div>
                  ` : ''}
                </div>
              </div>

              <div style="display:flex; align-items:center; justify-content:flex-end; gap:0.75rem; border-top:1px solid var(--border-color); padding-top:1rem;">
                <button type="button" class="btn btn-secondary" onclick="SubjectManager.closeEditSubjectModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    const existing = document.getElementById('edit-subject-modal');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  closeEditSubjectModal() {
    const modal = document.getElementById('edit-subject-modal');
    if (modal) modal.remove();
    this.resetPendingFiles();
  }

  submitEditSubject(subjectId) {
    const name = document.getElementById('edit-sub-name')?.value.trim();
    const semester = document.getElementById('edit-sub-semester')?.value;
    const manualSyllabus = document.getElementById('edit-sub-manual-syllabus')?.value.trim() || '';

    if (!name) {
      if (window.Notifications) Notifications.toast('Please enter the subject name.', 'error');
      return;
    }

    const hasSyllabusPdf = Boolean(this.pendingFiles.syllabus);
    const hasManualSyllabus = Boolean(manualSyllabus);
    const hasSyllabus = hasSyllabusPdf || hasManualSyllabus;
    const hasPyq = Boolean(this.pendingFiles.pyq);

    let status = 'Basic Subject';
    if (hasSyllabus && hasPyq) {
      status = 'Ready for Analysis';
    } else if (hasSyllabus || hasPyq) {
      status = 'Partially Prepared';
    }

    Storage.updateSubject(subjectId, {
      name: name,
      semester: semester,
      syllabusFile: this.pendingFiles.syllabus,
      manualSyllabus: manualSyllabus,
      pyqFile: this.pendingFiles.pyq,
      additionalMaterials: this.pendingFiles.materials || [],
      status: status
    });

    this.closeEditSubjectModal();
    if (window.Notifications) Notifications.toast('✓ Subject updated successfully.', 'success');

    if (window.Router && Router.currentRoute === '/subjects') {
      Router.renderSubjects();
    }
  }

  confirmDeleteSubject(subjectId) {
    const s = Storage.getSubjectById(subjectId);
    if (!s) return;

    const body = `
      <div style="text-align:center; padding:0.5rem 0;">
        <div style="font-size:2.8rem; margin-bottom:0.5rem; color:var(--accent-rose);">🗑️</div>
        <h3 style="font-size:1.25rem; font-weight:800; margin-bottom:0.35rem; color:var(--text-primary);">Delete ${s.name}?</h3>
        <p class="text-xs text-secondary" style="max-width:360px; margin:0 auto;">
          This will remove the subject and its associated syllabus, PYQ, and learning data from your account.
        </p>
      </div>
    `;

    const footer = `
      <button class="btn btn-secondary" onclick="Notifications.closeModal()">Cancel</button>
      <button class="btn btn-danger" onclick="Notifications.closeModal(); SubjectManager.deleteSubject('${s.id}');">Delete Subject</button>
    `;

    if (window.Notifications) {
      Notifications.openModal('Delete Subject', body, footer);
    }
  }

  deleteSubject(subjectId) {
    const success = Storage.deleteSubject(subjectId);
    if (success) {
      if (window.Notifications) Notifications.toast('Subject deleted successfully.', 'info');
      if (window.Router && Router.currentRoute === '/subjects') {
        Router.renderSubjects();
      }
    }
  }

  openSubjectDetails(subjectId) {
    if (window.Router) {
      Router.renderSubjectDetails(subjectId);
    }
  }
}

const SubjectManager = new SubjectManagerController();
window.SubjectManager = SubjectManager;

// Close dropdowns on document click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.header-profile-dropdown') && !e.target.closest('[onclick*="toggleCardDropdown"]')) {
    document.querySelectorAll('.header-profile-dropdown.show').forEach(el => el.classList.remove('show'));
  }
});
