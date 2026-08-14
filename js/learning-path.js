/* ============================================================
   EDUNEXUS — PERSONALIZED LEARNING PATH VISUALIZER
   ============================================================ */

class LearningPathVisualizer {
  constructor() {}

  renderPathContainer(containerEl, studentId) {
    if (!containerEl) return;

    const analysis = AIEngine.analyzeStudent(studentId);
    const pathNodes = analysis.recommendedPath;

    let html = `
      <div class="learning-path-wrapper">
        <!-- Animated Student Character Reading Book -->
        <div style="width: 100%; max-width: 480px; position: relative; height: 50px; margin-bottom: 0.5rem; overflow: hidden;">
          <div class="reading-student-character" title="Student exploring learning path">
            <div class="reading-student-avatar">📖</div>
          </div>
        </div>
    `;

    pathNodes.forEach((node, idx) => {
      let cardClass = 'path-node-card';
      let badgeClass = 'badge-cyan';

      if (node.status === 'Mastered') {
        cardClass += ' mastered';
        badgeClass = 'badge-low';
      } else if (node.status === 'Needs Focus') {
        cardClass += ' weak-gap';
        badgeClass = 'badge-high';
      } else if (node.status === 'Current') {
        cardClass += ' current node-active';
        badgeClass = 'badge-cyan';
      }

      html += `
        <div class="${cardClass}">
          <div style="font-size: 1.75rem; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${node.icon}
          </div>
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem;">
              <h4 style="font-size: 1rem; font-weight: 700;">${node.title}</h4>
              <span class="badge ${badgeClass}">${node.status}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">${node.description}</p>
            ${node.action ? `<button class="btn btn-primary btn-sm" style="margin-top: 0.75rem;" onclick="Router.navigate('/quiz?topicId=${node.topicId}')">Start Recommended Activity</button>` : ''}
          </div>
        </div>
      `;

      if (idx < pathNodes.length - 1) {
        html += `<div class="path-connector-line"></div>`;
      }
    });

    html += `</div>`;
    containerEl.innerHTML = html;
  }
}

const LearningPath = new LearningPathVisualizer();
window.LearningPath = LearningPath;
