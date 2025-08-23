// =====================================================
// CLEAN identifier() API - DESTRUCTURING DIRECTO
// Recibe un objeto plano con destructuring
// =====================================================

import { ARTICLES, ARTICLES_AND_DETERMINANTS } from "./word-types/articles.js";
import { PREPOSITIONS } from "./word-types/prepositions.js";
import { PRONOUNS } from "./word-types/pronouns.js";
import { CONJUNCTIONS } from "./word-types/conjunctions.js";
import { ADVERBS, IRREGULAR_ADVERBS } from "./word-types/adverbs.js";
import { NOUN_LEMMAS, detectNounBySuffix } from "./word-types/noun.js";
import { GermanAdjectives } from "./word-types/adjectives/detection.js";
import { nonGermanWords } from "./word-types/nonGermanWords.js";
import { isVerbFormEnhanced, getVerbDictionaries, looksLikeFiniteVerbEnhanced } from "./verbs/VerbSystem.js";
import { specialCases } from "./word-types/specialCases.js";
import { detectNumber } from "./word-types/numbers/recognizer.js";

// =====================================================
// MULTI-WORD PHRASES CONFIGURATION
// =====================================================

const MULTI_WORD_PHRASES = {
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

// =====================================================
// MULTI-WORD DETECTION
// =====================================================

const detectMultiWordPhrase = ({ word, words, index, enableMultiWord = true }) => {
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

// =====================================================
// UTILITIES
// =====================================================

const normalize = (s) => {
  if (!s) return "";
  return s.toLowerCase();
};

const toSet = (arr) => new Set(arr.map((w) => normalize(w)));
const isCapitalized = (w) => /^[A-ZÄÖÜ]/.test(w);

const D = {
  articles: toSet(ARTICLES),
  preps: toSet(PREPOSITIONS),
  pronouns: toSet(PRONOUNS),
  conj: toSet(CONJUNCTIONS),
  adv: toSet(ADVERBS),
  nouns: toSet(NOUN_LEMMAS),
  nonDE: toSet(nonGermanWords),
  articlesAndDeterminants: new Set(ARTICLES_AND_DETERMINANTS.map(normalize)),
  irregularAdverbs: new Set(IRREGULAR_ADVERBS.map(normalize)),
};

const NUMERIC_RE = /^\d+([.,]\d+)?$/;
const ROMAN_NUMERAL_RE = /^(?=[ivxlcdm]+$)m{0,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/i;

const cleanToken = (raw) => {
  if (!raw) return "";
  let w = String(raw).trim();
  w = w.replace(/^[^\p{L}\p{N}\s-]+|[^\p{L}\p{N}\s-]+$/gu, "");
  return w;
};

// Heurísticas simplificadas
const looksLikeFiniteVerb = (word) => looksLikeFiniteVerbEnhanced(word);

const looksLikeNoun = (word, atSentenceStart = false) => {
  const w = normalize(word);
  if (D.nouns.has(w)) return true;
  if (!atSentenceStart && isCapitalized(word)) return true;
  const suffixResult = detectNounBySuffix(word);
  if (suffixResult.isNoun) return true;
  return false;
};

const looksLikeAdj = (word, context = {}) => GermanAdjectives.isAdjective(word, context);

const looksLikeAdverb = (word) => {
  const w = normalize(word);
  if (D.irregularAdverbs.has(w)) return true;
  if (w.endsWith("lich") || w.endsWith("weise") || w.endsWith("mals") || w.endsWith("wärts")) return true;
  if (w === "hin" || w === "her") return true;
  return false;
};

const hasAuxiliaryBefore = (words, index) => {
  const verbDictionaries = getVerbDictionaries();
  let steps = 0;
  for (let i = index - 1; i >= 0 && steps < 6; i--) {
    const w = normalize((words[i] || "").replace(/[.,;:!?()«»"""'''„‚]/g, ""));
    if (!w) continue;
    steps++;

    if (verbDictionaries?.auxiliaries?.has(w)) return true;

    if (["nicht", "schon", "noch", "auch", "nur", "sehr", "wirklich", "eben", "gerade", "vielleicht", "wohl"].includes(w)) {
      continue;
    }
    break;
  }
  return false;
};

const hasArticleBefore = (words, index) => {
  for (let i = index - 1; i >= 0 && i >= index - 2; i--) {
    const w = normalize(words[i] || "");
    if (D.articlesAndDeterminants.has(w)) return true;
  }
  return false;
};

const detectAmbiguity = ({ word, words, index, atSentenceStart }) => {
  const matches = [];
  const w = normalize(word);

  if (looksLikeNoun(word, atSentenceStart)) matches.push("noun");
  if (looksLikeAdj(word, { words, index })) matches.push("adjective");
  if (looksLikeFiniteVerb(word)) matches.push("verb");
  if (looksLikeAdverb(word)) matches.push("adverb");

  if (matches.length < 2) return null;

  let primary = matches[0];

  if (words && index !== undefined) {
    if (matches.includes("verb") && matches.includes("adjective") && hasAuxiliaryBefore(words, index)) {
      primary = "verb";
    } else if (matches.includes("adjective") && matches.includes("verb")) {
      primary = "adjective";
    }

    if (matches.includes("noun") && hasArticleBefore(words, index)) {
      primary = "noun";
    } else if (matches.includes("noun") && matches.includes("verb")) {
      primary = isCapitalized(word) ? "noun" : "verb";
    }
  }

  return { matches, primary };
};

// =====================================================
// FUNCIÓN PRINCIPAL identifier() CON DESTRUCTURING LIMPIO
// =====================================================

/**
 * Identifica el tipo o las de una frase
 * @param {Object} params - Parámetros con destructuring
 * @param {string} params.word - La palabra a identificar
 * @param {string[]} [params.words] - Array de palabras de la oración
 * @param {number} [params.index] - Índice de la palabra actual
 * @param {boolean} [params.atSentenceStart=false] - Si es la primera palabra
 * @param {string} [params.sentence] - Texto completo de la oración
 * @param {boolean} [params.enableMultiWord=true] - Detectar frases multi-palabra
 * @param {boolean} [params.enableDeepAnalysis=true] - Análisis profundo
 * @param {boolean} [params.fallbackToHeuristics=true] - Usar heurísticas como fallback
 * @returns {Object} Resultado de la identificación
 */
export const identifier = ({ word, words = [], index = 0, atSentenceStart = false, sentence = "", enableMultiWord = true, enableDeepAnalysis = true, fallbackToHeuristics = true }) => {
  const cleaned = cleanToken(word);
  if (!cleaned) return { type: "other", rule: "empty" };

  const original = cleaned;
  const w = normalize(cleaned);

  // =====================================================
  // STEP 0: MULTI-WORD DETECTION - MÁXIMA PRIORIDAD
  // =====================================================

  if (enableMultiWord) {
    const multiWordResult = detectMultiWordPhrase({
      word: original,
      words,
      index,
      enableMultiWord,
    });

    if (multiWordResult) {
      return multiWordResult;
    }
  }

  // =====================================================
  // STEP 1: NO-ALEMÁN EXPLÍCITO
  // =====================================================

  if (D.nonDE.has(w)) return { type: "foreign", rule: "non-german-list" };

  // =====================================================
  // STEP 2: NÚMEROS Y ORDINALES
  // =====================================================

  if (NUMERIC_RE.test(original)) {
    if (!original.includes(".")) return { type: "number", rule: "numeric" };
  }
  if (ROMAN_NUMERAL_RE.test(w)) return { type: "number", rule: "roman-numeral" };
  if (specialCases[w] === "number") return { type: "number", rule: "special-number" };

  // Detección de números usando recognizer
  const numberResult = detectNumber(original, {
    wordsInASentence: words,
    index,
    atSentenceStart,
  });

  if (numberResult.isNumber) {
    return {
      type: "number",
      rule: `number-${numberResult.type}-${numberResult.subtype}`,
      confidence: numberResult.confidence,
      numberInfo: {
        numberType: numberResult.type,
        subtype: numberResult.subtype,
        lemma: numberResult.lemma,
        value: numberResult.value,
        isDeclined: numberResult.isDeclined || false,
      },
    };
  }

  // =====================================================
  // STEP 3: CASOS ESPECIALES EXACTOS
  // =====================================================

  if (specialCases[w]) return { type: specialCases[w], rule: "special-case" };

  // =====================================================
  // STEP 4: ADVERBIOS POR SUFIJO Y DIRECCIONALES
  // =====================================================

  if (looksLikeAdverb(original)) {
    return { type: "adverb", rule: "adverb-pattern" };
  }

  // =====================================================
  // STEP 5: SISTEMA DE VERBOS
  // =====================================================

  const verbResult = isVerbFormEnhanced(original, {
    wordsInASentence: words,
    index,
    atSentenceStart,
  });

  if (verbResult?.isVerb) {
    if (verbResult.verbInfo?.readings?.some((r) => r.form === "participle") && verbResult.context?.likelyRole === "adjective") {
      const nextTok = words?.[index + 1]?.toLowerCase();
      if (["in", "auf", "an", "für", "mit", "durch", "um", "ohne", "gegen", "zu"].includes(nextTok)) {
        return {
          type: "verb",
          rule: "participle-reanalyzed-as-verb-by-prep",
          verbInfo: verbResult.verbInfo,
          context: verbResult.context,
          confidence: Math.min(1, (verbResult.confidence || 0.7) + 0.1),
        };
      }

      return {
        type: "ambiguous",
        options: ["verb", "adjective"],
        primary: "adjective",
        rule: "participle-without-auxiliary",
        verbInfo: verbResult.verbInfo,
        context: verbResult.context,
      };
    }

    return {
      type: "verb",
      rule: "enhanced-verb-system",
      verbInfo: verbResult.verbInfo,
      context: verbResult.context,
      confidence: verbResult.confidence,
    };
  }

  // =====================================================
  // STEP 6: COINCIDENCIAS LÉXICAS (alta prioridad)
  // =====================================================

  if (D.articles.has(w)) return { type: "article", rule: "lex-article" };
  if (D.preps.has(w)) return { type: "preposition", rule: "lex-preposition" };
  if (D.pronouns.has(w)) return { type: "pronoun", rule: "lex-pronoun" };
  if (D.conj.has(w)) return { type: "conjunction", rule: "lex-conjunction" };
  if (D.adv.has(w)) return { type: "adverb", rule: "lex-adverb" };
  if (D.nouns.has(w)) return { type: "noun", rule: "lex-noun" };

  // =====================================================
  // STEP 7: ADJETIVOS
  // =====================================================

  if (enableDeepAnalysis) {
    const adjectiveResult = GermanAdjectives.analyze(original, {
      tokens: words,
      currentIndex: index,
      atSentenceStart,
    });

    if (adjectiveResult.isAdjective) {
      return {
        type: "adjective",
        rule: "enhanced-adjective-system",
        adjectiveInfo: adjectiveResult,
        confidence: adjectiveResult.confidence,
      };
    }
  }

  // =====================================================
  // STEP 8: HEURÍSTICAS MORFOLÓGICAS MEJORADAS
  // =====================================================

  if (fallbackToHeuristics) {
    if (looksLikeNoun(original, atSentenceStart)) {
      const suffixInfo = detectNounBySuffix(original);

      if (suffixInfo.isNoun) {
        return {
          type: "noun",
          rule: `noun-suffix-${suffixInfo.type}`,
          suffixInfo: suffixInfo,
          confidence: suffixInfo.confidence,
        };
      }

      return {
        type: "noun",
        rule: isCapitalized(original) && !atSentenceStart ? "capitalized-noun" : "noun-heuristic",
      };
    }

    // =====================================================
    // STEP 9: DETECTAR AMBIGÜEDAD CON CONTEXTO
    // =====================================================

    const ambiguityResult = detectAmbiguity({
      word: original,
      words,
      index,
      atSentenceStart,
    });

    if (ambiguityResult) {
      return {
        type: "ambiguous",
        options: ambiguityResult.matches,
        primary: ambiguityResult.primary,
        rule: "multiple-weak-matches",
      };
    }

    // =====================================================
    // STEP 10: FORMA VERBAL FINITA POR SUFIJO
    // =====================================================

    if (looksLikeFiniteVerb(original)) {
      return { type: "verb", rule: "finite-verb-suffix" };
    }
  }

  // =====================================================
  // STEP 11: FALLBACK
  // =====================================================

  return { type: "other", rule: "fallback" };
};

export const getWordType = ({ word, words, index, atSentenceStart, ...options }) => identifier({ word, words, index, atSentenceStart, ...options }).type;

// const testIdentifier = () => {
//   const result = identifier(); "ein paar"
//   console.log(result);
// };

// testIdentifier();
