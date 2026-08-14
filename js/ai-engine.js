/* ============================================================
   EDUNEXUS — AI LEARNING & EARLY INTERVENTION ENGINE
   ============================================================ */

class AILearningEngine {
  constructor() {}

  /**
   * Main analysis function that runs for a student
   */
  analyzeStudent(studentId) {
    const performances = Storage.getPerformance(studentId);
    const topics = Storage.getTopics();
    const quizHistory = (Storage.getDb().quizHistory || []).filter(q => q.studentId === studentId);

    // 1. Detect Weak Topics (Accuracy < 50%)
    const weakTopics = performances.filter(p => p.accuracy < 50);

    // 2. Prerequisite Gap Analysis
    const learningGaps = [];
    weakTopics.forEach(weak => {
      const topicObj = topics.find(t => t.id === weak.topicId);
      if (topicObj && topicObj.prerequisiteId) {
        const prereqTopic = topics.find(t => t.id === topicObj.prerequisiteId);
        const prereqPerf = performances.find(p => p.topicId === topicObj.prerequisiteId);

        if (prereqTopic && (!prereqPerf || prereqPerf.accuracy < 50)) {
          learningGaps.push({
            targetTopicId: topicObj.id,
            targetTopicName: topicObj.name,
            targetAccuracy: weak.accuracy,
            prereqTopicId: prereqTopic.id,
            prereqTopicName: prereqTopic.name,
            prereqAccuracy: prereqPerf ? prereqPerf.accuracy : 0,
            recommendation: `Revise ${prereqTopic.name} before continuing with ${topicObj.name}.`
          });
        }
      }
    });

    // 3. Risk Level Calculation (LOW / MEDIUM / HIGH)
    let riskLevel = 'LOW';
    let riskReason = 'Student performance is steady with good mastery.';

    if (learningGaps.length > 0 || weakTopics.length >= 2) {
      riskLevel = 'HIGH';
      riskReason = `Critical learning gap detected in prerequisite topic (${learningGaps[0]?.prereqTopicName || weakTopics[0]?.topicName}).`;
    } else if (weakTopics.length === 1 || performances.some(p => p.accuracy >= 50 && p.accuracy < 70)) {
      riskLevel = 'MEDIUM';
      riskReason = 'Student is showing moderate struggle in recent topic assessments.';
    }

    // 4. Overall Progress Metrics
    const totalAccuracy = performances.length > 0
      ? Math.round(performances.reduce((acc, curr) => acc + curr.accuracy, 0) / performances.length)
      : 0;

    const masteredCount = performances.filter(p => p.accuracy >= 75).length;

    return {
      studentId,
      overallAccuracy: totalAccuracy,
      masteredTopicsCount: masteredCount,
      weakTopics,
      learningGaps,
      riskLevel,
      riskReason,
      recommendedPath: this.generatePersonalizedPath(studentId, learningGaps, weakTopics)
    };
  }

  /**
   * Generates dynamic Personalized Learning Path Nodes
   */
  generatePersonalizedPath(studentId, learningGaps, weakTopics) {
    const nodes = [];

    // Step 1: Foundation (Mastered topic)
    nodes.push({
      id: 1,
      title: 'Algebra Basics',
      type: 'Foundation',
      status: 'Mastered',
      icon: '✓',
      description: 'Solid foundation mastered with 82% score.'
    });

    // Step 2: Identified Prerequisite Gap or Weak Topic
    if (learningGaps.length > 0) {
      const gap = learningGaps[0];
      nodes.push({
        id: 2,
        title: `Prerequisite Gap: ${gap.prereqTopicName}`,
        type: 'Learning Gap',
        status: 'Needs Focus',
        icon: '⚠️',
        description: gap.recommendation,
        topicId: gap.prereqTopicId,
        action: 'TAKE_REVISION'
      });
    } else if (weakTopics.length > 0) {
      nodes.push({
        id: 2,
        title: `Focus Topic: ${weakTopics[0].topicName}`,
        type: 'Weak Area',
        status: 'Needs Focus',
        icon: '⚠️',
        description: `Current accuracy is ${weakTopics[0].accuracy}%. Review material and practice.`,
        topicId: weakTopics[0].topicId,
        action: 'PRACTICE'
      });
    } else {
      nodes.push({
        id: 2,
        title: 'Factorization Practice',
        type: 'Practice',
        status: 'In Progress',
        icon: '📚',
        description: 'Practice polynomial factoring problems.'
      });
    }

    // Step 3: Targeted Practice
    nodes.push({
      id: 3,
      title: 'Targeted Remedial Practice',
      type: 'Interactive Practice',
      status: 'Current',
      icon: '⚡',
      description: 'AI-guided step-by-step adaptive problem set.'
    });

    // Step 4: Diagnostic Assessment
    nodes.push({
      id: 4,
      title: 'Diagnostic Re-assessment',
      type: 'Assessment',
      status: 'Upcoming',
      icon: '📝',
      description: 'Validate mastery before progressing to advanced topics.'
    });

    // Step 5: Advanced Goal
    nodes.push({
      id: 5,
      title: 'Quadratic Equations & Beyond',
      type: 'Advanced Goal',
      status: 'Locked',
      icon: '🚀',
      description: 'Master quadratic formulas and real-world word problems.'
    });

    return nodes;
  }

  /**
   * Adaptive Quiz Recommendation: Adjust question difficulty
   */
  getAdaptiveDifficulty(lastScore) {
    if (lastScore >= 80) return 'Hard';
    if (lastScore < 50) return 'Easy';
    return 'Medium';
  }
}

const AIEngine = new AILearningEngine();
window.AIEngine = AIEngine;
