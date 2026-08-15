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
