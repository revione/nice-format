// identifyWordType.js

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
const toSet = (arr) => new Set(arr.map((w) => normalize(w.toLowerCase())));
const endsWithAny = (w, arr) => arr.some((s) => w.endsWith(s));
const isCapitalized = (w) => /^[A-ZÄÖÜ]/.test(w);

// Función de normalización mejorada
const normalize = (s) => {
  if (!s) return "";
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
};

// Diccionarios normalizados
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
  // normalizamos specialCases
  special: Object.fromEntries(
    Object.entries(specialCases).map(([k, v]) => [normalize(k), v])
  ),
};

// Sufijos nominales
const NOUN_SUFFIXES = [
  "ung",
  "heit",
  "keit",
  "schaft",
  "taet",
  "tion",
  "itaet",
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
  "bueschel",
  "ecke",
  "zimmer",
  "ausdruck",
  "finger",
  "schuhe",
  "tasche",
  "flaeche",
  "grund",
  "teil",
  "winkel",
  "symbol",
  "foto",
  "werbung", // corregido de "werb" a "werbung"
];

// Terminaciones típicas de adjetivo declinado
const ADJ_ENDINGS = ["e", "en", "em", "er", "es"];

// Prefijos comunes para participios/adjetivos de origen verbal
const PART_PREF = ["ge", "be", "ver", "zer", "ent", "er"];

// Contracciones/artículos frecuentes
const ARTICLE_FORMS = new Set(
  [
    "am",
    "im",
    "ins",
    "ans",
    "zum",
    "zur",
    "vom",
    "aufs",
    "durchs",
    "fuers",
    "ums",
    "uebers",
    "unters",
    "hinters",
    "vors",
  ].map(normalize)
);

// Auxiliares verbales para detección de participios
const VERBAL_AUXILIARIES = new Set(
  [
    "wurde",
    "wurden",
    "wird",
    "werden",
    "hat",
    "haben",
    "hatte",
    "hatten",
    "ist",
    "sind",
    "war",
    "waren",
    "sein",
    "gewesen",
  ].map(normalize)
);

// Artículos y determinantes
const ARTICLES_AND_DETERMINANTS = new Set(
  [
    "der",
    "die",
    "das",
    "ein",
    "eine",
    "einer",
    "einem",
    "einen",
    "den",
    "dem",
    "des",
    "dieser",
    "diese",
    "dieses",
    "jener",
    "jene",
    "jenes",
    "welcher",
    "welche",
    "welches",
    "alle",
    "viele",
    "einige",
    "manche",
    "solche",
    "keine",
    "keiner",
    "keinem",
    "keinen",
  ].map(normalize)
);

// Adverbios direccionales conocidos
const DIRECTIONAL_ADVERBS = new Set(
  [
    "hin",
    "her",
    "dahin",
    "dorthin",
    "hierhin",
    "wohin",
    "daher",
    "hierher",
    "woher",
    "hinein",
    "herein",
    "hinaus",
    "heraus",
    "hinauf",
    "herauf",
    "hinunter",
    "herunter",
    "hinueber",
    "herueber",
  ].map(normalize)
);

// Números
const NUMERIC_RE = /^\d+([.,]\d+)?$/;
// Adverbios irregulares adicionales
const IRREGULAR_ADVERBS = new Set(
  [
    "gern",
    "gerne",
    "kaum",
    "schon",
    "eben",
    "mal",
    "wohl",
    "etwa",
    "fast",
    "ziemlich",
    "ganz",
    "recht",
    "eher",
    "doch",
    "ja",
    "nein",
  ].map(normalize)
);

// Números ordinales - expresión regular mejorada
const ORDINAL_RE =
  /^(?:\d+\.|(?:(?:nullte|erste|zweite|dritte|vierte|f[üu]nfte|sechste|siebte|siebente|achte|neunte|zehnte|elfte|zw[öo]lfte|dreizehnte|vierzehnte|f[üu]nfzehnte|sechzehnte|siebzehnte|achtzehnte|neunzehnte)|(?:(?:ein|zwei|drei|vier|f[üu]nf|sechs|sieben|acht|neun)(?:-|)?und(?:zwanzig|drei(?:ss|ß)ig|vierzig|f[üu]nfzig|sechzig|siebzig|achtzig|neunzig)ste|(?:zwanzig|drei(?:ss|ß)ig|vierzig|f[üu]nfzig|sechzig|siebzig|achtzig|neunzig)ste)|(?:[a-zaeoeuess-]*?(?:hundert|tausend|million(?:en)?|milliard(?:e|en)|billion(?:en)?|billiard(?:e|en)|trillion(?:en)?)+(?:[a-zaeoeuess-]*)?ste)))(?:n|r|m|s|en|er|em|es|ns)?$/iu;

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
  w = w.replace(/^[^\w\säöüßáéíóúüñç]+|[^\w\säöüßáéíóúüñç]+$/gi, "");
  return w;
}

// ------------------------- Heurísticas Mejoradas -------------------------
function looksLikeNoun(word, { atSentenceStart = false } = {}) {
  const w = normalize(word);
  return (
    D.nouns.has(w) ||
    (!atSentenceStart && isCapitalized(word)) ||
    endsWithAny(w, NOUN_SUFFIXES)
  );
}

function looksLikeAdj(word) {
  const w = normalize(word);
  return (
    D.adjBasic.has(w) ||
    D.adjDecl.has(w) ||
    D.adjT.has(w) ||
    D.adjEn.has(w) ||
    (PART_PREF.some((p) => w.startsWith(p)) &&
      (w.endsWith("t") || w.endsWith("en"))) ||
    isDeclinedForm(w)
  );
}

// Función mejorada para detectar adverbios
function looksLikeAdverb(word) {
  const w = normalize(word);

  // Adverbios irregulares específicos
  if (IRREGULAR_ADVERBS.has(w)) return true;

  // Adverbios direccionales específicos
  if (DIRECTIONAL_ADVERBS.has(w)) return true;

  // Sufijos típicos de adverbios alemanes
  if (
    w.endsWith("lich") ||
    w.endsWith("weise") ||
    w.endsWith("mals") ||
    w.endsWith("waerts")
  ) {
    return true;
  }

  // Solo "hin" o "her" exactos, no como sufijo
  if (w === "hin" || w === "her") return true;

  return false;
}

// Función mejorada para detectar formas declinadas
function isDeclinedForm(word) {
  const endings = ["en", "er", "em", "es", "e"];
  const w = normalize(word);

  // Stems conocidos corregidos y normalizados
  const commonAdjStems = [
    "direkt",
    "ober",
    "unter",
    "freundlich",
    "hellgruen",
    "dunkelblau",
    "wichtig",
    "moeglich",
    "verschieden",
    "besonder",
    "eigen",
    "natuerlich",
    "oval",
    "sanft",
    "ausgepraegt",
    "mittler",
    "entspannt", // corregido "ausgepragt"
  ].map(normalize);

  for (const stem of commonAdjStems) {
    for (const ending of endings) {
      if (w === stem + ending) return true;
    }
  }

  // Verificar si la raíz existe en diccionarios de adjetivos
  for (const ending of endings) {
    if (w.endsWith(ending)) {
      const stem = w.slice(0, -ending.length);
      if (D.adjBasic.has(stem) || D.adjT.has(stem)) {
        return true;
      }
    }
  }

  return false;
}

function looksLikeDeclinedAdj(word) {
  const w = normalize(word);
  return ADJ_ENDINGS.some((end) => w.endsWith(end)) || isDeclinedForm(w);
}

function looksLikeFiniteVerb(word) {
  const w = normalize(word);

  // Evita categorías conocidas
  if (D.adv.has(w) || D.nouns.has(w) || D.adjBasic.has(w) || D.adjDecl.has(w))
    return false;

  if (looksLikeAdverb(word)) return false;
  if (isDeclinedForm(w)) return false;

  return /(e|st|t|en|te|et)$/.test(w) || D.verbsInf.has(w);
}

// Función para detectar "noch" como conjunción en "weder...noch"
function isNochConjunction(word, sentence) {
  if (normalize(word) !== "noch") return false;
  return /\bweder\b/i.test(sentence);
}

// Funciones auxiliares para detección de contexto
function hasAuxiliaryBefore(tokens, index) {
  // mira hasta 3 palabras atrás
  for (let i = index - 1; i >= 0 && i >= index - 3; i--) {
    const w = normalize(tokens[i]);
    if (VERBAL_AUXILIARIES.has(w)) return true;
  }
  return false;
}

function hasArticleBefore(tokens, index) {
  // mira 1–2 palabras atrás
  for (let i = index - 1; i >= 0 && i >= index - 2; i--) {
    const w = normalize(tokens[i]);
    if (ARTICLES_AND_DETERMINANTS.has(w) || ARTICLE_FORMS.has(w)) return true;
  }
  return false;
}

// Función para detectar ambigüedad con contexto mejorado
function detectAmbiguity(word, opts = {}) {
  const matches = [];
  const w = normalize(word);

  if (looksLikeNoun(word, opts)) matches.push("noun");
  if (looksLikeAdj(word)) matches.push("adjective");
  if (looksLikeFiniteVerb(word)) matches.push("verb");
  if (looksLikeAdverb(word)) matches.push("adverb");

  if (matches.length < 2) return null;

  // Sistema de prioridad con contexto
  let primary = matches[0];
  const { tokens, currentIndex } = opts;

  // Contexto: auxiliar antes + participio → priorizar verb
  if (
    matches.includes("verb") &&
    matches.includes("adjective") &&
    tokens &&
    hasAuxiliaryBefore(tokens, currentIndex)
  ) {
    primary = "verb";
  }
  // Sin auxiliar: participios → priorizar adjective
  else if (matches.includes("adjective") && matches.includes("verb")) {
    primary = "adjective";
  }

  // Contexto: artículo antes + ambiguo → priorizar noun
  if (
    matches.includes("noun") &&
    tokens &&
    hasArticleBefore(tokens, currentIndex)
  ) {
    primary = "noun";
  }
  // Sin artículo: noun vs verb → usar mayúscula como criterio
  else if (matches.includes("noun") && matches.includes("verb")) {
    primary = isCapitalized(word) ? "noun" : "verb";
  }

  return { matches, primary };
}

// ------------------------- Núcleo: clasificar -------------------------
/**
 * identifyWord — versión mejorada con contexto
 */
export function identifyWord(raw, opts = {}) {
  const atSentenceStart = !!opts.atSentenceStart;
  const sentence = opts.sentence || "";
  const tokens = opts.tokens || [];
  const currentIndex = opts.currentIndex || 0;

  const cleaned = cleanToken(raw);
  if (!cleaned) return { type: "other", rule: "empty" };

  const original = cleaned;
  const w = normalize(cleaned);

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

  // 2.2) adverbios por sufijo y direccionales
  if (looksLikeAdverb(original)) {
    return { type: "adverb", rule: "adverb-pattern" };
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

  // 4c) adjetivo declinado por terminación
  if (looksLikeDeclinedAdj(original) && !looksLikeFiniteVerb(original)) {
    return { type: "adjective", rule: "declined-adj-ending" };
  }

  // 4d) detectar ambigüedad con contexto antes de decidir verbo
  const ambiguityResult = detectAmbiguity(original, {
    atSentenceStart,
    tokens,
    currentIndex,
  });
  if (ambiguityResult) {
    return {
      type: "ambiguous",
      options: ambiguityResult.matches,
      primary: ambiguityResult.primary,
      rule: "multiple-weak-matches",
    };
  }

  // 4e) forma verbal finita por sufijo
  if (looksLikeFiniteVerb(original)) {
    return { type: "verb", rule: "finite-verb-suffix" };
  }

  // 5) fallback
  return { type: "other", rule: "fallback" };
}

// ------------------------- API compatible: string -------------------------
export const identifyWordType = (word, opts = {}) =>
  identifyWord(word, opts).type;

// ------------------------- Clasificación de tokens con contexto -------------------------
export function classifyTokens(tokens) {
  const results = [];
  let atStart = true;
  const fullSentence = tokens.join(" ");

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const res = identifyWord(tok, {
      atSentenceStart: atStart,
      sentence: fullSentence,
      tokens: tokens,
      currentIndex: i,
    });
    results.push({ token: tok, ...res });

    const trimmed = String(tok || "");
    if (/[.!?]$/.test(trimmed)) atStart = true;
    else if (/\S/.test(trimmed)) atStart = false;
  }
  return results;
}
