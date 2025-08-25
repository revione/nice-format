export const state = {
  words: {},
  contexts: {},
  currentStudySession: [],
  currentCardIndex: 0,
  sessionStats: { practiced: 0, mastered: 0 },
  studyLanguages: ["es", "en"],
  selectedWords: new Set(),
  filteredWords: [],
  showContextInfo: false,
  sessionCompletedWords: new Set(),
  groupByContext: true,
};

export const VERSION = "2.0";
