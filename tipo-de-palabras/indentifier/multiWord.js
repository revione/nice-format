export const MULTI_WORD_PHRASES = {
  "ein paar": {
    words: ["ein", "paar"],
    type: "number",
    subtype: "collective",
    confidence: 0.95,
    rule: "multi-word-collective",
  },

  "eine menge": {
    words: ["eine", "menge"],
    type: "number",
    subtype: "collective",
    confidence: 0.85,
    rule: "multi-word-collective",
  },

  "peinlich berührt": {
    words: ["peinlich", "berührt"],
    type: "adjective",
    subtype: "emotional",
    confidence: 0.9,
    rule: "multi-word-adjective",
  },
};

export const detectMultiWordPhrase = ({ word, words, index, enableMultiWord = true }) => {
  if (!enableMultiWord || !words || index === undefined) return null;

  const normalizedWord = word.toLowerCase();

  for (const [phrase, config] of Object.entries(MULTI_WORD_PHRASES)) {
    const phraseWords = config.words;

    if (normalizedWord === phraseWords[0]) {
      if (index + phraseWords.length > words.length) continue;

      let matches = true;
      for (let i = 1; i < phraseWords.length; i++) {
        const nextWord = words[index + i]?.toLowerCase();
        if (nextWord !== phraseWords[i]) {
          matches = false;
          break;
        }
      }

      if (matches) {
        return {
          type: config.type,
          rule: config.rule,
          confidence: config.confidence,
          multiWordInfo: {
            phrase: phrase,
            lemma: phrase,
            length: phraseWords.length,
            subtype: config.subtype,
            isMultiWord: true,
            words: phraseWords,
          },
        };
      }
    }
  }

  return null;
};
