import { ARTICLES, ARTICLES_AND_DETERMINANTS } from "./word-types/articles.js";
import { PREPOSITIONS } from "./word-types/prepositions.js";
import { PRONOUNS } from "./word-types/pronouns.js";
import { CONJUNCTIONS } from "./word-types/conjunctions.js";
import { ADVERBS, IRREGULAR_ADVERBS } from "./word-types/adverbs.js";
import { NOUN_LEMMAS, detectNounBySuffix } from "./word-types/noun.js";

import { isAdjective, enhancedAdjectiveDetection, isLikelyDeclinedAdjective } from "./word-types/adjectives.js";

import { nonGermanWords } from "./nonGermanWords.js";
import { isVerbFormEnhanced, getVerbDictionaries, looksLikeFiniteVerbEnhanced } from "./VerbSystem.js";
import { specialCases } from "./word-types/specialCases.js";

// ------------------------- Utils y Diccionarios CORREGIDOS -------------------------

const normalize = (s) => {
  if (!s) return "";
  return s.toLowerCase();
};

const toSet = (arr) => new Set(arr.map((w) => normalize(w)));
const isCapitalized = (w) => /^[A-ZÄÖÜ]/.test(w);

// Diccionarios normalizados CONSISTENTEMENTE
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

// Terminaciones típicas de adjetivo declinado
const ADJ_ENDINGS = ["e", "en", "em", "er", "es"];

// Números
const NUMERIC_RE = /^\d+([.,]\d+)?$/;
const ROMAN_NUMERAL_RE = /^(?=[ivxlcdm]+$)m{0,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/i;

// ------------------------- Limpieza -------------------------
function cleanToken(raw) {
  if (!raw) return "";
  let w = String(raw).trim();
  w = w.replace(/^[^\p{L}\p{N}\s-]+|[^\p{L}\p{N}\s-]+$/gu, "");
  return w;
}

// ------------------------- Heurísticas para verbos -------------------------
function looksLikeFiniteVerb(word) {
  return looksLikeFiniteVerbEnhanced(word);
}

// ------------------------- Heurísticas Mejoradas -------------------------
function looksLikeNoun(word, { atSentenceStart = false } = {}) {
  const w = normalize(word);

  // 1. Verificar en diccionario conocido
  if (D.nouns.has(w)) return true;

  // 2. Capitalización (sin ser inicio de oración)
  if (!atSentenceStart && isCapitalized(word)) return true;

  // 3. Usar la nueva función de detección por sufijos
  const suffixResult = detectNounBySuffix(word);
  if (suffixResult.isNoun) return true;

  return false;
}

function looksLikeAdj(word, context = {}) {
  const result = enhancedAdjectiveDetection(word, context);
  return result.isAdjective;
}

function looksLikeAdverb(word) {
  const w = normalize(word);

  if (D.irregularAdverbs.has(w)) return true;
  if (w.endsWith("lich") || w.endsWith("weise") || w.endsWith("mals") || w.endsWith("wärts")) return true;
  if (w === "hin" || w === "her") return true;

  return false;
}

// Función mejorada para detectar formas declinadas - USANDO FUNCIONES DE ADJECTIVES.JS
function isDeclinedForm(word) {
  return isLikelyDeclinedAdjective(word);
}

function looksLikeDeclinedAdj(word) {
  const w = normalize(word);
  return ADJ_ENDINGS.some((end) => w.endsWith(end)) || isDeclinedForm(w);
}

// Función para detectar "noch" como conjunción en "weder...noch"
function isNochConjunction(word, sentence) {
  if (normalize(word) !== "noch") return false;
  return /\bweder\b/i.test(sentence);
}

function hasAuxiliaryBefore(wordsInASentence, index) {
  const verbDictionaries = getVerbDictionaries();
  let steps = 0;
  for (let i = index - 1; i >= 0 && steps < 6; i--) {
    const w = normalize((wordsInASentence[i] || "").replace(/[.,;:!?()«»"""'''„‚]/g, ""));
    if (!w) continue;
    steps++;

    if (verbDictionaries?.auxiliaries?.has(w)) return true;

    if (["nicht", "schon", "noch", "auch", "nur", "sehr", "wirklich", "eben", "gerade", "vielleicht", "wohl"].includes(w)) {
      continue;
    }
    break;
  }
  return false;
}

function hasArticleBefore(wordsInASentence, index) {
  for (let i = index - 1; i >= 0 && i >= index - 2; i--) {
    const w = normalize(wordsInASentence[i] || "");
    if (D.articlesAndDeterminants.has(w)) return true;
  }
  return false;
}

function detectAmbiguity(word, opts = {}) {
  const matches = [];
  const w = normalize(word);

  if (looksLikeNoun(word, opts)) matches.push("noun");
  if (looksLikeAdj(word, opts)) matches.push("adjective");
  if (looksLikeFiniteVerb(word)) matches.push("verb");
  if (looksLikeAdverb(word)) matches.push("adverb");

  if (matches.length < 2) return null;

  let primary = matches[0];
  const { wordsInASentence, index } = opts;

  if (matches.includes("verb") && matches.includes("adjective") && wordsInASentence && hasAuxiliaryBefore(wordsInASentence, index)) {
    primary = "verb";
  } else if (matches.includes("adjective") && matches.includes("verb")) {
    primary = "adjective";
  }

  if (matches.includes("noun") && wordsInASentence && hasArticleBefore(wordsInASentence, index)) {
    primary = "noun";
  } else if (matches.includes("noun") && matches.includes("verb")) {
    primary = isCapitalized(word) ? "noun" : "verb";
  }

  return { matches, primary };
}

// ------------------------- Núcleo: clasificar -------------------------
export function identifyWord(raw, opts = {}) {
  const atSentenceStart = !!opts.atSentenceStart;
  const sentence = opts.sentence || "";
  const wordsInASentence = opts.wordsInASentence || [];
  const index = opts.index || 0;

  const cleaned = cleanToken(raw);
  if (!cleaned) return { type: "other", rule: "empty" };

  const original = cleaned;
  const w = normalize(cleaned);

  // 0) No-alemán explícito
  if (D.nonDE.has(w)) return { type: "foreign", rule: "non-german-list" };

  // 1) Números y ordinales
  if (NUMERIC_RE.test(original)) return { type: "number", rule: "numeric" };
  if (ROMAN_NUMERAL_RE.test(w)) return { type: "number", rule: "roman-numeral" };
  if (specialCases[w] === "number") return { type: "number", rule: "special-number" };

  // 2) Casos especiales exactos
  if (specialCases[w]) return { type: specialCases[w], rule: "special-case" };

  // 2.1) Adverbios por sufijo y direccionales
  if (looksLikeAdverb(original)) {
    return { type: "adverb", rule: "adverb-pattern" };
  }

  // *** SISTEMA DE VERBOS ***
  const verbResult = isVerbFormEnhanced(original, {
    wordsInASentence,
    index,
    atSentenceStart,
  });

  if (verbResult?.isVerb) {
    if (verbResult.verbInfo?.readings?.some((r) => r.form === "participle") && verbResult.context?.likelyRole === "adjective") {
      const nextTok = (opts.wordsInASentence?.[opts.index + 1] || "").toLowerCase();
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

  // 3) Coincidencias léxicas (alta prioridad)
  if (D.articles.has(w)) return { type: "article", rule: "lex-article" };
  if (D.preps.has(w)) return { type: "preposition", rule: "lex-preposition" };
  if (D.pronouns.has(w)) return { type: "pronoun", rule: "lex-pronoun" };
  if (D.conj.has(w)) return { type: "conjunction", rule: "lex-conjunction" };
  if (D.adv.has(w)) return { type: "adverb", rule: "lex-adverb" };
  if (D.nouns.has(w)) return { type: "noun", rule: "lex-noun" };

  // *** SISTEMA DE ADJETIVOS MEJORADO ***
  const adjectiveResult = isAdjective(original, {
    wordsInASentence,
    index,
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

  // 4) Heurísticas morfológicas mejoradas
  if (looksLikeNoun(original, { atSentenceStart })) {
    // Usar la nueva función de detección por sufijos para más información
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

  // 4d) Detectar ambigüedad con contexto
  const ambiguityResult = detectAmbiguity(original, {
    atSentenceStart,
    wordsInASentence,
    index,
  });
  if (ambiguityResult) {
    return {
      type: "ambiguous",
      options: ambiguityResult.matches,
      primary: ambiguityResult.primary,
      rule: "multiple-weak-matches",
    };
  }

  // 4e) Forma verbal finita por sufijo
  if (looksLikeFiniteVerb(original)) {
    return { type: "verb", rule: "finite-verb-suffix" };
  }

  // 5) Fallback
  return { type: "other", rule: "fallback" };
}
