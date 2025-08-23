const MULTI_WORD_PHRASES = {
  "ein paar": {
    words: ["ein", "paar"],
    type: "number",
    subtype: "collective",
    confidence: 0.95,
  },

  "eine menge": {
    words: ["eine", "menge"],
    type: "number",
    subtype: "collective",
    confidence: 0.85,
  },

  "peinlich berührt": {
    words: ["peinlich", "berührt"],
    type: "adjective",
    subtype: "emotional",
    confidence: 0.9,
  },
};

const detectMultiWordPhrase = (words, startIndex) => {
  for (const [phrase, info] of Object.entries(MULTI_WORD_PHRASES)) {
    const phraseWords = info.words;

    // Verificar si hay suficientes palabras restantes
    if (startIndex + phraseWords.length > words.length) continue;

    // Verificar coincidencia palabra por palabra
    let matches = true;
    for (let i = 0; i < phraseWords.length; i++) {
      const wordInText = words[startIndex + i]?.toLowerCase();
      const wordInPhrase = phraseWords[i];

      if (wordInText !== wordInPhrase) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return {
        phrase,
        type: info.type,
        subtype: info.subtype,
        confidence: info.confidence,
        length: phraseWords.length,
      };
    }
  }

  return null;
};
