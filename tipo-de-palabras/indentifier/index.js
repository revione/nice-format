import { detectMultiWordPhrase } from "./multiWord.js";
import { ARTICLES, ARTICLES_AND_DETERMINANTS } from "../word-types/articles.js";
import { PREPOSITIONS } from "../word-types/prepositions.js";
import { PRONOUNS } from "../word-types/pronouns.js";
import { CONJUNCTIONS } from "../word-types/conjunctions.js";
import { ADVERBS, IRREGULAR_ADVERBS } from "../word-types/adverbs.js";
import { NOUN_LEMMAS, detectNounBySuffix } from "../word-types/noun.js";
import { GermanAdjectives } from "../word-types/adjectives/detection.js";
import { nonGermanWords } from "../word-types/nonGermanWords.js";
import { specialCases } from "../word-types/specialCases.js";
import { detectNumber } from "../word-types/numbers/recognizer.js";
import { isVerb } from "../verbs/recognizer.js";

const _cache = new Map();
const MAX_CACHE_SIZE = 10000;
let _cacheStats = { hits: 0, misses: 0, evictions: 0 };

/**
 * Genera contexto hash solo de palabras relevantes alrededor
 * Evita invalidar cache por cambios irrelevantes en la oración
 */
const getContextHash = (words, index) => {
  if (!words || words.length === 0) return "nocontext";

  // Solo las 2 palabras antes y 1 después (relevantes para contexto)
  const start = Math.max(0, index - 2);
  const end = Math.min(words.length, index + 2);
  const contextWindow = words.slice(start, end);

  // Normalizar y unir
  return contextWindow.map((w) => w?.toLowerCase() || "").join("|");
};

/**
 * Genera key de cache optimizada
 */
const getCacheKey = (word, words, index, atSentenceStart, flags) => {
  const contextHash = getContextHash(words, index);
  const flagsStr = `${flags.enableMultiWord ? "M" : ""}${flags.enableDeepAnalysis ? "D" : ""}${flags.fallbackToHeuristics ? "H" : ""}`;

  return `${word}#${contextHash}#${atSentenceStart ? "S" : ""}#${flagsStr}`;
};

/**
 * Limpia cache cuando excede el límite (LRU simple)
 */
const evictOldEntries = () => {
  if (_cache.size <= MAX_CACHE_SIZE) return;

  // Eliminar las primeras 1000 entradas (más antiguas)
  const keysToDelete = Array.from(_cache.keys()).slice(0, 1000);
  keysToDelete.forEach((key) => _cache.delete(key));
  _cacheStats.evictions += keysToDelete.length;
};

/**
 * Exporta estadísticas de cache para debugging
 */
export const getCacheStats = () => ({ ..._cacheStats, size: _cache.size });

/**
 * Limpia el cache manualmente
 */
export const clearCache = () => {
  _cache.clear();
  _cacheStats = { hits: 0, misses: 0, evictions: 0 };
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

const cleanToken = (raw) => {
  if (!raw) return "";
  let w = String(raw).trim();
  w = w.replace(/^[^\p{L}\p{N}\s-]+|[^\p{L}\p{N}\s-]+$/gu, "");
  return w;
};

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

const hasArticleBefore = (words, index) => {
  for (let i = index - 1; i >= 0 && i >= index - 2; i--) {
    const w = normalize(words[i] || "");
    if (D.articlesAndDeterminants.has(w)) return true;
  }
  return false;
};

const detectAmbiguity = ({ word, words, index, atSentenceStart }) => {
  const matches = [];

  if (looksLikeNoun(word, atSentenceStart)) matches.push("noun");
  if (looksLikeAdj(word, { words, index })) matches.push("adjective");
  if (looksLikeAdverb(word)) matches.push("adverb");

  if (matches.length < 2) return null;

  let primary = matches[0];

  if (words && index !== undefined) {
    if (matches.includes("noun") && hasArticleBefore(words, index)) {
      primary = "noun";
    } else if (matches.includes("noun") && matches.includes("adjective")) {
      primary = isCapitalized(word) ? "noun" : "adjective";
    }
  }

  return { matches, primary };
};

// =====================================================
// FUNCIÓN PRINCIPAL identifier()
// =====================================================

/**
 * Identifica el tipo de palabra alemana
 * @param {Object} params - Parámetros con destructuring
 * @returns {Object} Resultado de la identificación
 */
const _identifierImpl = ({ word, words = [], index = 0, atSentenceStart = false, sentence = "", enableMultiWord = true, enableDeepAnalysis = true, fallbackToHeuristics = true }) => {
  const original = word;
  const w = normalize(word);

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
  // STEP 2: NÚMEROS
  // =====================================================

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

  if (looksLikeAdverb(original)) return { type: "adverb", rule: "adverb-pattern" };

  // =====================================================
  // STEP 5: SISTEMA DE VERBOS
  // =====================================================

  const verbResult = isVerb(original, {
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
  }

  // =====================================================
  // STEP 10: FALLBACK
  // =====================================================

  return { type: "other", rule: "fallback" };
};

/**
 * Identifica el tipo de palabra alemana (WRAPPER CON CACHING)
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
export const identifier = (params) => {
  const { word, words = [], index = 0, atSentenceStart = false, enableMultiWord = true, enableDeepAnalysis = true, fallbackToHeuristics = true, ...rest } = params;

  // Limpieza inicial
  const cleaned = cleanToken(word);
  if (!cleaned) return { type: "other", rule: "empty" };

  // Generar key de cache
  const cacheKey = getCacheKey(cleaned, words, index, atSentenceStart, {
    enableMultiWord,
    enableDeepAnalysis,
    fallbackToHeuristics,
  });

  // Buscar en cache
  const cached = _cache.get(cacheKey);
  if (cached) {
    _cacheStats.hits++;
    return cached;
  }

  // Cache miss - ejecutar análisis
  _cacheStats.misses++;
  const result = _identifierImpl({
    word: cleaned,
    words,
    index,
    atSentenceStart,
    enableMultiWord,
    enableDeepAnalysis,
    fallbackToHeuristics,
    ...rest,
  });

  // Guardar en cache
  _cache.set(cacheKey, result);
  evictOldEntries();

  return result;
};

export const getWordType = ({ word, words, index, atSentenceStart, ...options }) => identifier({ word, words, index, atSentenceStart, ...options }).type;
