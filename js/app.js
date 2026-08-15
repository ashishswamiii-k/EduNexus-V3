/* ============================================================
   EDUNEXUS — MASTER APPLICATION INITIALIZER & THEME ENGINE
   PERMANENT FIXED 250PX SIDEBAR • NO COLLAPSE TOGGLES
   ============================================================ */

class AppController {
  constructor() {
    this.sessionThemeKey = 'edunexus_theme_mode';
    this.init();
  }

  init() {
    const run = () => {
      // 1. Initialize Local Storage Database
      if (window.Storage) Storage.init();

      // 2. Restore Persistent Theme Preference
      this.restoreTheme();

      // 3. Initial SPA Route Resolution
      if (window.Router) {
        if (typeof Router.handleRouting === 'function') {
          Router.handleRouting();
        } else if (typeof Router.init === 'function') {
          Router.init();
        }
      }

      // 4. Bind Keyboard Accessibility & Click Outside Listeners
      this.bindEventListeners();

      // 5. Initialize Splash Screen Entrance
      this.initSplashScreen();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }
  }

  restoreTheme() {
    try {
      const theme = localStorage.getItem(this.sessionThemeKey) || 'dark';
      this.setTheme(theme, false);
    } catch (e) {
      console.error('Error restoring theme preference', e);
      this.setTheme('dark', false);
    }
  }

  setTheme(themeName, showToast = true) {
    const validThemes = ['dark', 'light', 'eyecare'];
    const selected = validThemes.includes(themeName) ? themeName : 'dark';

    document.documentElement.setAttribute('data-theme', selected);

    try {
      localStorage.setItem(this.sessionThemeKey, selected);
    } catch (e) {
      console.error('Error saving theme preference', e);
    }

    if (showToast && window.Notifications) {
      const labels = { dark: 'Dark Mode', light: 'Light Mode', eyecare: 'Eye Protection Warm Mode' };
      Notifications.toast(`Theme set to ${labels[selected]}`, 'success');
    }
  }

  toggleEyeCareTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'eyecare' ? 'dark' : 'eyecare';
    this.setTheme(next, true);
  }

  initSplashScreen() {
    setTimeout(() => {
      const splash = document.getElementById('edunexus-splash-screen');
      if (splash) {
        splash.classList.add('fade-out');
        setTimeout(() => {
          if (splash && splash.parentNode) {
            splash.parentNode.removeChild(splash);
          }
        }, 500);
      }
    }, 750);
  }

  toggleProfileDropdown() {
    const dropdown = document.getElementById('header-profile-dropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  closeProfileDropdown() {
    const dropdown = document.getElementById('header-profile-dropdown');
    if (dropdown) {
      dropdown.classList.remove('show');
    }
  }

  openNexaAIChat(initialPrompt = '', contextTopicId = null) {
    const user = window.Auth ? Auth.getCurrentUser() : null;
    const userName = user ? user.name : 'Student';
    const topics = window.Storage ? Storage.getTopics() : [];
    const activeTopic = contextTopicId ? topics.find(t => t.id === contextTopicId) : null;

    let chatHtml = `
      <div id="nexaai-chat-container" style="display:flex; flex-direction:column; height:460px; max-height:75vh;">
        <!-- CHAT FEED -->
        <div id="nexaai-chat-feed" style="flex:1; overflow-y:auto; padding:0.85rem; display:flex; flex-direction:column; gap:0.85rem; background:var(--bg-tertiary); border-radius:var(--radius-md); border:1px solid var(--border-color); margin-bottom:1rem;">
          <div style="background:var(--bg-secondary); border:1px solid var(--border-color); border-left:3px solid var(--accent-cyan); padding:0.85rem 1rem; border-radius:var(--radius-sm); font-size:0.875rem; color:var(--text-primary); line-height:1.5;">
            <div style="display:flex; align-items:center; gap:0.4rem; font-weight:800; color:var(--accent-cyan); margin-bottom:0.35rem;">
              ✦ NexaAI Learning Assistant
            </div>
            Hello ${userName}! I am NexaAI, your EduNexus Learning Assistant. How can I help you today?
            ${activeTopic ? `<div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.35rem; font-weight:600;">Context: 📘 ${activeTopic.name}</div>` : ''}
          </div>
        </div>

        <!-- QUICK PROMPT CHIPS -->
        <div style="display:flex; gap:0.4rem; overflow-x:auto; padding-bottom:0.5rem; margin-bottom:0.6rem; font-size:0.75rem;">
          <button class="btn btn-secondary btn-sm" style="white-space:nowrap; padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="App.sendNexaChatMessage('Why am I weak in this topic?')">⚠️ Weak Topics</button>
          <button class="btn btn-secondary btn-sm" style="white-space:nowrap; padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="App.sendNexaChatMessage('What should I study today?')">📅 Study Plan</button>
          <button class="btn btn-secondary btn-sm" style="white-space:nowrap; padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="App.sendNexaChatMessage('Explain normalization in DBMS')">📚 DBMS Normalization</button>
          <button class="btn btn-secondary btn-sm" style="white-space:nowrap; padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="App.sendNexaChatMessage('Give me practice questions')">🎯 Practice MCQs</button>
        </div>

        <!-- INPUT BOX -->
        <form onsubmit="event.preventDefault(); App.sendNexaChatMessage();" style="display:flex; gap:0.5rem;">
          <input type="text" id="nexaai-chat-input" class="form-control" placeholder="Ask NexaAI anything about your subjects, topics, or study plan..." style="flex:1;">
          <button type="submit" class="btn btn-primary" style="padding:0.5rem 1.15rem;">Send ✦</button>
        </form>
      </div>
    `;

    if (window.Notifications) {
      Notifications.openModal('✦ NexaAI — EduNexus Learning Intelligence', chatHtml, `<button class="btn btn-secondary" onclick="Notifications.closeModal()">Close</button>`);
    }

    if (initialPrompt) {
      setTimeout(() => {
        this.sendNexaChatMessage(initialPrompt, contextTopicId);
      }, 200);
    }
  }

  sendNexaChatMessage(customPrompt = null, contextTopicId = null) {
    const input = document.getElementById('nexaai-chat-input');
    const feed = document.getElementById('nexaai-chat-feed');
    if (!feed) return;

    const query = customPrompt || (input ? input.value.trim() : '');
    if (!query) return;

    if (input && !customPrompt) input.value = '';

    // Append User Message
    const userMsgDiv = document.createElement('div');
    userMsgDiv.style.cssText = 'align-self:flex-end; background:var(--accent-cyan); color:#000; padding:0.65rem 0.95rem; border-radius:12px 12px 2px 12px; max-width:82%; font-size:0.85rem; font-weight:600; line-height:1.4;';
    userMsgDiv.textContent = query;
    feed.appendChild(userMsgDiv);
    feed.scrollTop = feed.scrollHeight;

    // Get NexaAI Response
    setTimeout(() => {
      const res = window.AIEngine ? AIEngine.askNexaAI(query, { topicId: contextTopicId }) : { reply: 'NexaAI is ready.' };
      
      const aiMsgDiv = document.createElement('div');
      aiMsgDiv.style.cssText = 'align-self:flex-start; background:var(--bg-secondary); border:1px solid var(--border-color); border-left:3px solid var(--accent-cyan); padding:0.85rem 1rem; border-radius:12px 12px 12px 2px; max-width:88%; font-size:0.85rem; color:var(--text-primary); line-height:1.55;';
      
      let htmlContent = res.reply
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n- /g, '<br>• ');

      if (res.actionText && res.actionType) {
        htmlContent += `
          <div style="margin-top:0.85rem; padding-top:0.6rem; border-top:1px solid var(--border-color);">
            <button class="btn btn-primary btn-sm" onclick="Notifications.closeModal(); Quiz.executeNexaAction('${res.actionType}', '${res.targetTopicId}')">
              ${res.actionText} →
            </button>
          </div>
        `;
      }

      aiMsgDiv.innerHTML = htmlContent;
      feed.appendChild(aiMsgDiv);
      feed.scrollTop = feed.scrollHeight;
    }, 250);
  }

  openNexaAIFileAnalysis(fileName = 'C_Programming_Notes.pdf', fileText = '') {
    const user = window.Auth ? Auth.getCurrentUser() : null;
    const studentId = user ? user.id : 'ECB0245';
    const analysis = window.AIEngine ? AIEngine.analyzeDocumentContent(fileName, fileText, studentId) : null;

    if (!analysis || analysis.error) {
      if (window.Notifications) {
        Notifications.toast(analysis ? analysis.error : 'Unable to analyze file content.', 'error');
      }
      return;
    }

    const html = `
      <div id="nexaai-file-analysis-view" class="fade-in" style="max-width:840px; margin:0 auto; text-align:left;">
        <!-- HEADER -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.25rem; border-bottom:1px solid var(--border-color); padding-bottom:0.85rem; flex-wrap:wrap; gap:0.5rem;">
          <div style="display:flex; align-items:center; gap:0.65rem;">
            <span style="font-size:1.5rem; color:var(--accent-cyan);">✦</span>
            <div>
              <h3 style="font-size:1.2rem; font-weight:800; color:var(--text-primary); margin:0;">NexaAI File Analysis</h3>
              <div style="font-size:0.75rem; color:var(--accent-cyan); font-weight:700; text-transform:uppercase;">Document Intelligence Report</div>
            </div>
          </div>
          <span class="badge badge-cyan" style="font-size:0.8rem; padding:0.4rem 0.8rem; font-weight:700;">
            📄 ${analysis.fileName}
          </span>
        </div>

        <!-- 1. WHAT THIS FILE CONTAINS -->
        <div style="margin-bottom:1.25rem; background:var(--bg-tertiary); padding:1rem 1.15rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
          <div style="font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:0.35rem;">
            1. Document Summary & Contents
          </div>
          <p style="font-size:0.875rem; color:var(--text-primary); line-height:1.55; margin:0;">
            ${analysis.summary}
          </p>
        </div>

        <!-- 2. DETECTED TOPICS & KEY CONCEPTS GRID -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; margin-bottom:1.25rem;">
          <div style="background:var(--bg-tertiary); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <div style="font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem;">
              2. Major Topics Detected (${analysis.topicsDetected.length})
            </div>
            <ul style="margin:0; padding-left:1.15rem; font-size:0.85rem; color:var(--text-primary); display:flex; flex-direction:column; gap:0.35rem;">
              ${analysis.topicsDetected.map(t => `<li style="font-weight:700;">${t}</li>`).join('')}
            </ul>
          </div>

          <div style="background:var(--bg-tertiary); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <div style="font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem;">
              3. Key Concepts & Definitions
            </div>
            <ul style="margin:0; padding-left:1.15rem; font-size:0.825rem; color:var(--text-secondary); display:flex; flex-direction:column; gap:0.35rem;">
              ${analysis.keyConcepts.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- 4. COMBINED STUDENT PERFORMANCE INSIGHT -->
        ${analysis.studentCombinedInsight ? `
          <div class="card card-gradient-border" style="margin-bottom:1.25rem; background:var(--bg-secondary); border-left:4px solid #F59E0B; padding:1rem 1.15rem;">
            <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.8rem; font-weight:800; color:#F59E0B; text-transform:uppercase; margin-bottom:0.35rem;">
              ⚠️ NexaAI Combined Performance Match
            </div>
            <p style="font-size:0.875rem; color:var(--text-primary); line-height:1.55; margin:0;">
              ${analysis.studentCombinedInsight.message}
            </p>
          </div>
        ` : ''}

        <!-- 5. SUGGESTED STUDY ORDER & DIFFICULT AREAS -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
          <div style="background:var(--bg-tertiary); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <div style="font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem;">
              4. Suggested Study Order
            </div>
            <ol style="margin:0; padding-left:1.25rem; font-size:0.85rem; color:var(--text-primary); display:flex; flex-direction:column; gap:0.3rem;">
              ${analysis.suggestedStudyOrder.map(s => `<li>${s}</li>`).join('')}
            </ol>
          </div>

          <div style="background:var(--bg-tertiary); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--border-color);">
            <div style="font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem;">
              5. High Focus / Technically Dense Areas
            </div>
            <ul style="margin:0; padding-left:1.15rem; font-size:0.85rem; color:var(--text-primary); display:flex; flex-direction:column; gap:0.3rem;">
              ${analysis.difficultAreas.map(d => `<li style="color:#F87171; font-weight:700;">${d}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- RECOMMENDED ACTION & BUTTONS -->
        <div style="background:var(--bg-tertiary); padding:1.15rem; border-radius:var(--radius-md); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="font-size:0.75rem; font-weight:800; color:var(--text-muted); text-transform:uppercase;">NexaAI Recommended Action</div>
            <div style="font-size:0.9rem; font-weight:700; color:var(--text-primary); margin-top:0.2rem;">
              ${analysis.suggestedAction}
            </div>
          </div>

          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" onclick="Notifications.closeModal(); Quiz.startQuiz('${analysis.targetTopicId}'); Router.navigate('/quiz');">
              🎯 Generate Practice Questions
            </button>
            <button class="btn btn-secondary btn-sm" onclick="Notifications.closeModal(); App.openNexaAIChat('What should I study first from ${analysis.fileName}?');">
              💬 Ask NexaAI
            </button>
          </div>
        </div>
      </div>
    `;

    if (window.Notifications) {
      Notifications.openModal('✦ NexaAI File Analysis', html, `<button class="btn btn-secondary" onclick="Notifications.closeModal()">Close</button>`);
    }
  }

  triggerFileUploadForAnalysis() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.pdf,.doc,.docx,.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const filename = file.name;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        App.openNexaAIFileAnalysis(filename, text);
      };

      if (filename.endsWith('.txt') || filename.endsWith('.json')) {
        reader.readAsText(file);
      } else {
        App.openNexaAIFileAnalysis(filename, `Study material text stream for ${filename}`);
      }
    };
    input.click();
  }

  bindEventListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (window.Notifications) Notifications.closeModal();
        this.closeProfileDropdown();
      }
    });

    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('header-profile-dropdown');
      const profileBtn = e.target.closest('.header-actions');
      if (dropdown && dropdown.classList.contains('show') && !profileBtn) {
        this.closeProfileDropdown();
      }
    });
  }
}

const App = new AppController();
window.App = App;
