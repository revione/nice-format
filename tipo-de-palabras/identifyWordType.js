// identifyWordType.js — Clasificador por reglas y prioridad (compat con tu API)

import {
  articles,
  prepositions,
  pronouns,
  conjunctions,
  adverbs,
  commonNouns,
  infinitiveVerbs,
  basicAdjectives,
  declinedAdjectives,
  adjectivesEndingInT,
  adjectivesEndingInEn,
  specialCases,
} from "./WordTypes.js";

import { nonGermanWords } from "./nonGermanWords.js";

// ------------------------- Utils y Diccionarios -------------------------
const toSet = (arr) => new Set(arr.map((w) => w.toLowerCase()));
const lc = (w) => w.toLowerCase();
const endsWithAny = (w, arr) => arr.some((s) => w.endsWith(s));
const isCapitalized = (w) => /^[A-ZÄÖÜ]/.test(w);

// Diccionarios en minúsculas
const D = {
  articles: toSet(articles),
  preps: toSet(prepositions),
  pronouns: toSet(pronouns),
  conj: toSet(conjunctions),
  adv: toSet(adverbs),
  nouns: toSet(commonNouns),
  verbsInf: toSet(infinitiveVerbs),
  adjBasic: toSet(basicAdjectives),
  adjDecl: toSet(declinedAdjectives),
  adjT: toSet(adjectivesEndingInT),
  adjEn: toSet(adjectivesEndingInEn),
  nonDE: toSet(nonGermanWords),
  // normalizamos specialCases a minúscula
  special: Object.fromEntries(
    Object.entries(specialCases).map(([k, v]) => [k.toLowerCase(), v])
  ),
};

// Sufijos nominales
const NOUN_SUFFIXES = [
  "ung",
  "heit",
  "keit",
  "schaft",
  "tät",
  "tion",
  "ität",
  "ment",
  "ismus",
  "ist",
  "ling",
  "lein",
  "chen",
  "tum",
  "nis",
  "anz",
  "enz",
  "ik",
  "ur",
  "eur",
  "ion",
  // compuestos frecuentes de tu dominio
  "büschel",
  "ecke",
  "zimmer",
  "ausdruck",
  "finger",
  "schuhe",
  "tasche",
  "fläche",
  "grund",
  "teil",
  "winkel",
  "symbol",
  "foto",
  "werb",
];

// Terminaciones típicas de adjetivo declinado
const ADJ_ENDINGS = ["e", "en", "em", "er", "es"];

// Prefijos comunes para participios/adjetivos de origen verbal
const PART_PREF = ["ge", "be", "ver", "zer", "ent", "er"];

// Contracciones/artículos frecuentes
const ARTICLE_FORMS = new Set([
  "am",
  "im",
  "ins",
  "ans",
  "zum",
  "zur",
  "vom",
  "aufs",
  "durchs",
  "fürs",
  "ums",
  "übers",
  "unters",
  "hinters",
  "vors",
]);

// Números
const NUMERIC_RE = /^\d+([.,]\d+)?$/;

const ORDINAL_RE =
  /^(?:\d+\.|(?:(?:nullte|erste|zweite|dritte|vierte|fünfte|sechste|siebte|siebente|achte|neunte|zehnte|elfte|zwölfte|dreizehnte|vierzehnte|fünfzehnte|sechzehnte|siebzehnte|achtzehnte|neunzehnte)|(?:(?:ein|zwei|drei|vier|fünf|sechs|sieben|acht|neun)(?:-|)?und(?:zwanzig|drei(?:ß|ss)ig|vierzig|fünfzig|sechzig|siebzig|achtzig|neunzig)ste|(?:zwanzig|drei(?:ß|ss)ig|vierzig|fünfzig|sechzig|siebzig|achtzig|neunzig)ste)|(?:[a-zäöüß-]*?(?:hundert|tausend|million(?:en)?|milliard(?:e|en)|billion(?:en)?|billiard(?:e|en)|trillion(?:en)?)+(?:[a-zäöüß-]*)?ste)))(?:n|r|m|s|en|er|em|es|ns)?$/iu;

// ------------------------- WORD_TYPES Definition -------------------------
export const WORD_TYPES = {
  VERB: { id: "verb", color: "#e74c3c", emoji: "🔴", label: "verbo" },
  NOUN: { id: "noun", color: "#3498db", emoji: "🔵", label: "sustantivo" },
  ARTICLE: { id: "article", color: "#f39c12", emoji: "🟡", label: "artículo" },
  ADJECTIVE: {
    id: "adjective",
    color: "#ff9500",
    emoji: "🟠",
    label: "adjetivo",
  },
  PRONOUN: { id: "pronoun", color: "#00d084", emoji: "🟢", label: "pronombre" },
  PREPOSITION: {
    id: "preposition",
    color: "#9b59b6",
    emoji: "🟣",
    label: "preposición",
  },
  CONJUNCTION: {
    id: "conjunction",
    color: "#8b4513",
    emoji: "🟤",
    label: "conjunción",
  },
  ADVERB: { id: "adverb", color: "#8a2be2", emoji: "🟪", label: "adverbio" },
  NUMBER: { id: "number", color: "#17a2b8", emoji: "🔢", label: "número" },
  FOREIGN: {
    id: "foreign",
    color: "#ff6b6b",
    emoji: "🌍",
    label: "extranjero",
  },
  OTHER: { id: "other", color: "#95a5a6", emoji: "⚫", label: "otra" },
  AMBIGUOUS: {
    id: "ambiguous",
    color: "#ff6b35",
    emoji: "🔶",
    label: "ambigua",
  },
};

// ------------------------- Limpieza -------------------------
function cleanToken(raw) {
  if (!raw) return "";
  let w = String(raw).trim();
  // recorta signos al borde, conserva letras alemanas
  w = w.replace(/^[^\w\säöüßáéíóúüñç]+|[^\w\säöüßáéíóúüñç]+$/gi, "");
  return w;
}

// ------------------------- Heurísticas -------------------------
function looksLikeNoun(word, { atSentenceStart = false } = {}) {
  const w = lc(word);
  return (
    D.nouns.has(w) ||
    (!atSentenceStart && isCapitalized(word)) ||
    endsWithAny(w, NOUN_SUFFIXES)
  );
}

function looksLikeAdj(word) {
  const w = lc(word);
  return (
    D.adjBasic.has(w) ||
    D.adjDecl.has(w) ||
    D.adjT.has(w) ||
    D.adjEn.has(w) ||
    (PART_PREF.some((p) => w.startsWith(p)) &&
      (w.endsWith("t") || w.endsWith("en"))) ||
    // Formas declinadas de adjetivos conocidos
    isDeclinedForm(w)
  );
}

// Nueva función para detectar formas declinadas de adjetivos
function isDeclinedForm(word) {
  const commonAdjStems = [
    "direkt",
    "ober",
    "unter",
    "freundlich",
    "hellgrün",
    "dunkelblau",
    "wichtig",
    "möglich",
    "verschieden",
    "besonder",
    "eigen",
  ];

  const endings = ["en", "er", "em", "es", "e"];

  for (const stem of commonAdjStems) {
    for (const ending of endings) {
      if (word === stem + ending) return true;
    }
  }
  return false;
}

function looksLikeDeclinedAdj(word) {
  const w = lc(word);
  return ADJ_ENDINGS.some((end) => w.endsWith(end)) || isDeclinedForm(w);
}

function looksLikeFiniteVerb(word) {
  const w = lc(word);
  // evita adverbios/sustantivos/adj conocidos
  if (D.adv.has(w) || D.nouns.has(w) || D.adjBasic.has(w) || D.adjDecl.has(w))
    return false;

  // Evita formas declinadas de adjetivos
  if (isDeclinedForm(w)) return false;

  // sufijos finitos muy comunes: -e, -st, -t, -en, -te, -et
  return /(e|st|t|en|te|et)$/.test(w) || D.verbsInf.has(w);
}

// Función para detectar "noch" como conjunción en "weder...noch"
function isNochConjunction(word, sentence) {
  if (lc(word) !== "noch") return false;
  return /\bweder\b/i.test(sentence);
}

// ------------------------- Núcleo: clasificar -------------------------
/**
 * identifyWord — versión detallada
 * @param {string} raw
 * @param {object} opts { atSentenceStart?: boolean, sentence?: string }  // marca si es primera palabra de oración y contexto de oración
 * @returns {{ type: string, rule: string, options?: string[], primary?: string }}
 */
export function identifyWord(raw, opts = {}) {
  const atSentenceStart = !!opts.atSentenceStart;
  const sentence = opts.sentence || "";
  const cleaned = cleanToken(raw);
  if (!cleaned) return { type: "other", rule: "empty" };

  const original = cleaned; // importante para capitalización
  const w = lc(cleaned); // clave para diccionarios

  // 0) no-alemán explícito
  if (D.nonDE.has(w)) return { type: "foreign", rule: "non-german-list" };

  // 1) números y ordinales
  if (NUMERIC_RE.test(original)) return { type: "number", rule: "numeric" };
  if (ORDINAL_RE.test(w)) return { type: "number", rule: "ordinal" };
  if (D.special[w] === "number")
    return { type: "number", rule: "special-number" };

  // 2) casos especiales exactos
  if (D.special[w]) return { type: D.special[w], rule: "special-case" };

  // 2.1) "noch" contextual (weder...noch)
  if (isNochConjunction(original, sentence)) {
    return { type: "conjunction", rule: "weder-noch" };
  }

  // 3) coincidencias léxicas (alta prioridad)
  if (D.articles.has(w) || ARTICLE_FORMS.has(w))
    return { type: "article", rule: "lex-article" };
  if (D.preps.has(w)) return { type: "preposition", rule: "lex-preposition" };
  if (D.pronouns.has(w)) return { type: "pronoun", rule: "lex-pronoun" };
  if (D.conj.has(w)) return { type: "conjunction", rule: "lex-conjunction" };
  if (D.adv.has(w)) return { type: "adverb", rule: "lex-adverb" };
  if (D.nouns.has(w)) return { type: "noun", rule: "lex-noun" };
  if (
    D.adjBasic.has(w) ||
    D.adjDecl.has(w) ||
    D.adjT.has(w) ||
    D.adjEn.has(w)
  ) {
    return { type: "adjective", rule: "lex-adjective" };
  }
  if (D.verbsInf.has(w)) return { type: "verb", rule: "lex-verb" };

  // 4) heurísticas morfológicas
  // 4a) sustantivo por mayúscula/sufijo
  if (looksLikeNoun(original, { atSentenceStart })) {
    return {
      type: "noun",
      rule:
        isCapitalized(original) && !atSentenceStart
          ? "capitalized-noun"
          : "noun-suffix",
    };
  }

  // 4b) participio/adjetivo
  if (looksLikeAdj(original)) {
    // si además parece forma verbal → ambiguo (preferimos adjetivo)
    if (looksLikeFiniteVerb(original)) {
      return {
        type: "ambiguous",
        options: ["adjective", "verb"],
        primary: "adjective",
        rule: "participle-adj",
      };
    }
    return { type: "adjective", rule: "participle-adj" };
  }

  // 4c) adjetivo declinado por terminación (y no claramente verbo)
  if (looksLikeDeclinedAdj(original) && !looksLikeFiniteVerb(original)) {
    return { type: "adjective", rule: "declined-adj-ending" };
  }

  // 4d) forma verbal finita por sufijo
  if (looksLikeFiniteVerb(original)) {
    return { type: "verb", rule: "finite-verb-suffix" };
  }

  // 5) fallback
  return { type: "other", rule: "fallback" };
}

// ------------------------- API compatible: string -------------------------
/**
 * Mantiene tu API original: devuelve solo el tipo (string)
 */
export const identifyWordType = (word, opts = {}) =>
  identifyWord(word, opts).type;

// ------------------------- (Opcional) Lote con detección de inicio de oración -------------------------
/**
 * Clasifica una lista de tokens y marca la primera palabra tras . ! ? como inicio de oración
 */
export function classifyTokens(tokens) {
  const results = [];
  let atStart = true;
  const fullSentence = tokens.join(" "); // Para contexto de "weder...noch"

  for (const tok of tokens) {
    const res = identifyWord(tok, {
      atSentenceStart: atStart,
      sentence: fullSentence,
    });
    results.push({ token: tok, ...res });
    // actualizar inicio de oración
    const trimmed = String(tok || "");
    if (/[.!?]$/.test(trimmed)) atStart = true;
    else if (/\S/.test(trimmed)) atStart = false;
  }
  return results;
}
