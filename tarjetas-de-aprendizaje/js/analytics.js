import { state } from "./state.js";

export function validateData() {
  const issues = [];
  Object.entries(state.words).forEach(([g, w]) => {
    if (!w.german) issues.push(`Sin 'german': ${g}`);
    if (!w.spanish && !w.english) issues.push(`Sin traducciones: ${g}`);
    if (!w.dateCreated) issues.push(`Sin fecha de creación: ${g}`);
    if (w.mastered === undefined) issues.push(`Sin 'mastered': ${g}`);
  });
  Object.entries(state.contexts).forEach(([id, c]) => {
    if (!c.title) issues.push(`Contexto sin título: ${id}`);
    if (!c.text) issues.push(`Contexto sin texto: ${id}`);
  });
  console.log("Validación de datos:", issues.length === 0 ? "OK" : issues);
  return issues;
}

export function generateDetailedStats() {
  const wordsArr = Object.values(state.words);
  const totalWords = wordsArr.length;
  const stats = {
    totalWords,
    totalContexts: Object.keys(state.contexts).length,
    wordsByStatus: {
      mastered: wordsArr.filter((w) => w.mastered).length,
      active: wordsArr.filter((w) => !w.mastered).length,
      practiced: wordsArr.filter((w) => (w.totalPracticed || 0) > 0).length,
      unpracticed: wordsArr.filter((w) => (w.totalPracticed || 0) === 0).length,
    },
    practiceStats: {
      totalSessions: wordsArr.reduce((s, w) => s + (w.totalPracticed || 0), 0),
      averagePracticePerWord: 0,
      mostPracticedWord: null,
      recentlyStudied: wordsArr.filter((w) => w.lastStudied && Date.now() - new Date(w.lastStudied) <= 7 * 864e5).length,
    },
    masteryStats: {
      masteryRate: 0,
      recentlyMastered: wordsArr.filter((w) => w.masteryDate && Date.now() - new Date(w.masteryDate) <= 7 * 864e5).length,
    },
  };
  if (totalWords > 0) {
    stats.practiceStats.averagePracticePerWord = (stats.practiceStats.totalSessions / totalWords).toFixed(1);
    stats.masteryStats.masteryRate = ((stats.wordsByStatus.mastered / totalWords) * 100).toFixed(1);
    const most = wordsArr.reduce((max, w) => ((w.totalPracticed || 0) > (max.totalPracticed || 0) ? w : max), { totalPracticed: 0 });
    if (most.totalPracticed > 0) stats.practiceStats.mostPracticedWord = { german: most.german, count: most.totalPracticed };
  }
  return stats;
}
