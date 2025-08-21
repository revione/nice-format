// EnhancedVerbSystem.js

import {
  generateVerbDictionaries,
  buildVerbMap,
  getVerbParadigm,
  isIrregularVerb,
  getPrefixInfo,
} from "./VerbForms.js";
import { IRREGULARS } from "./verbs/IrregularVerbs.js";
import { REGULARS } from "./verbs/RegularVerbs.js";

// =====================
// 1) NORMALIZACIÓN CONSISTENTE
// =====================
const normalize = (word) => word.toLowerCase();

// =====================
// 2) CONSTANTES Y DICCIONARIOS GLOBALES
// =====================
let verbDictionaries = null;
let verbMap = null;

// Artículos y contracciones (reutilizar sin recrear)
const ARTICLE_TOKENS = new Set(
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
    // contracciones artículo+preposición
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
  ].map((x) => x.toLowerCase())
);

// Regex para limpiar puntuación y comillas tipográficas
const CLEAN_QUOTE_PUNCT_RE = /[.,;:!?()«»"“”'‘’„‚]/g;

// Palabras que se saltan al buscar auxiliares
const SKIP_WORDS = new Set([
  "nicht",
  "schon",
  "noch",
  "auch",
  "nur",
  "sehr",
  "wirklich",
  "eben",
  "gerade",
  "vielleicht",
  "wohl",
  "doch",
  "halt",
  "ja",
  "denn",
]);

// =====================
// 3) INICIALIZACIÓN
// =====================
function initializeVerbDictionaries() {
  if (!verbDictionaries) {
    const ALL_LEMMAS = [...REGULARS, ...Object.keys(IRREGULARS)];
    verbDictionaries = generateVerbDictionaries(ALL_LEMMAS);
    verbMap = buildVerbMap(ALL_LEMMAS);
  }
  return verbDictionaries;
}

export function getVerbDictionaries() {
  return initializeVerbDictionaries();
}

// =====================
// 4) UTILIDADES PARA INFINITIVOS CON "ZU" PEGADO
// =====================
function extractZuInfinitive(normalized) {
  if (!normalized.endsWith("en")) return null;

  // Caso A: "zu" al inicio y la parte restante también empieza por "zu"
  // (p.ej., "zuzusehen" -> "zusehen", "zuzugeben" -> "zugeben")
  if (normalized.startsWith("zu")) {
    const rest = normalized.slice(2); // CORREGIDO: definir 'rest'
    if (rest.startsWith("zu")) {
      if (verbMap && verbMap[rest]) return rest;
      // Fallback léxico-agnóstico
      if (/en$/.test(rest)) return rest;
    }
  }

  // Caso B: "zu" pegado en cualquier otra posición (p.ej., "zurückzugehen")
  // Recorremos todas las apariciones a partir de índice 1
  let i = normalized.indexOf("zu", 1);
  while (i !== -1) {
    if (i < normalized.length - 2) {
      const candidate = normalized.slice(0, i) + normalized.slice(i + 2);
      if (verbMap && verbMap[candidate]) return candidate;
      // Fallback léxico-agnóstico (si parece infinitivo)
      if (/en$/.test(candidate)) return candidate;
    }
    i = normalized.indexOf("zu", i + 2);
  }
  return null;
}

// =====================
// 5) ANÁLISIS DE VERBOS PRINCIPAL
// =====================

/**
 * Analiza una palabra para determinar si es una forma verbal
 */
export function isVerbFormEnhanced(word, context = {}) {
  const normalized = normalize(word);
  const dicts = initializeVerbDictionaries();

  // Resultado base
  const result = {
    isVerb: false,
    verbInfo: null,
    context: null,
    confidence: 0,
  };

  // Buscar lecturas (interpretaciones) de la palabra
  const readings = [];

  // 1. Formas finitas (presente, pretérito, konjunktiv)
  if (dicts.finite.has(normalized)) {
    readings.push({
      form: "finite",
      confidence: 0.9,
      tense: determineFiniteTense(normalized),
    });
  }

  // 2. Participios
  if (dicts.participles.has(normalized)) {
    readings.push({
      form: "participle",
      confidence: 0.8,
      type: "partizip2",
    });
  }

  // 3. Imperativos
  if (dicts.imperatives.has(normalized)) {
    readings.push({
      form: "imperative",
      confidence: 0.85,
    });
  }

  // 4. Infinitivos normales
  if (verbMap && verbMap[normalized]) {
    readings.push({
      form: "infinitive",
      confidence: 0.7,
      lemma: normalized,
    });
  }

  // 5. Infinitivos con "zu" pegado (abzuholen → abholen)
  const zuInfinitiveLemma = extractZuInfinitive(normalized);
  if (zuInfinitiveLemma) {
    readings.push({
      form: "infinitive",
      confidence: 0.72, // ligeramente mayor por match explícito
      lemma: zuInfinitiveLemma,
      note: "zu-infinitive-glued",
    });
  }

  // Si no hay lecturas, no es verbo
  if (readings.length === 0) {
    return result;
  }

  // Analizar contexto sintáctico
  const contextInfo = analyzeContext(word, context, readings);

  // Determinar si realmente es verbo basado en contexto
  const isActuallyVerb = determineVerbLikelihood(readings, contextInfo);

  if (isActuallyVerb) {
    // Obtener lemma: prioritizar el de las lecturas, sino calcular
    const readingLemma = readings.find(
      (r) => typeof r.lemma === "string"
    )?.lemma;
    const lemma = readingLemma || findLemma(normalized);

    result.isVerb = true;
    result.verbInfo = {
      readings,
      lemma,
      irregular: isIrregularVerb(lemma),
      prefixInfo: getPrefixInfo(lemma),
    };
    result.context = contextInfo;

    // Calcular confidence con bonificaciones contextuales
    const baseConf = Math.max(...readings.map((r) => r.confidence));
    const bonusZu = contextInfo.hasZuNear ? 0.05 : 0;
    const bonusAux =
      contextInfo.hasAuxiliaryBefore &&
      readings.some((r) => r.form === "participle")
        ? 0.05
        : 0;
    const bonusInfAuxAfter =
      contextInfo.hasAuxiliaryAfter &&
      readings.some((r) => r.form === "infinitive")
        ? 0.03
        : 0;
    result.confidence = Math.min(
      1.0,
      baseConf + bonusZu + bonusAux + bonusInfAuxAfter
    );
  }

  return result;
}

// =====================
// 6) FUNCIONES AUXILIARES
// =====================

function determineFiniteTense(normalized) {
  const dicts = getVerbDictionaries();
  if (dicts.formToLemma && dicts.formToLemma.has(normalized)) {
    const possibleLemmas = dicts.formToLemma.get(normalized);

    for (const lemma of possibleLemmas) {
      const paradigm = getVerbParadigm(lemma);
      if (!paradigm) continue;

      // Buscar en presente
      if (
        Object.values(paradigm.praesens || {}).some(
          (form) => normalize(form) === normalized
        )
      ) {
        return "praesens";
      }

      // Buscar en pretérito
      if (
        Object.values(paradigm.präteritum || {}).some(
          (form) => normalize(form) === normalized
        )
      ) {
        return "präteritum";
      }

      // Buscar en konjunktiv
      if (
        paradigm.konjunktiv2 &&
        Object.values(paradigm.konjunktiv2).some(
          (form) => normalize(form) === normalized
        )
      ) {
        return "konjunktiv2";
      }
    }
  }

  return "unknown";
}

function analyzeContext(word, context, readings) {
  const { tokens = [], currentIndex = 0, atSentenceStart = false } = context;

  const contextInfo = {
    hasAuxiliaryBefore: false,
    hasAuxiliaryAfter: false,
    hasArticleBefore: false,
    hasZuNear: false,
    position: "unknown",
    likelyRole: "verb",
  };

  // Detectar "zu" 1-2 posiciones antes del infinitivo
  for (let i = Math.max(0, currentIndex - 2); i < currentIndex; i++) {
    const token = (tokens[i] || "").toLowerCase();
    if (token.replace(CLEAN_QUOTE_PUNCT_RE, "") === "zu") {
      contextInfo.hasZuNear = true;
      break;
    }
  }

  // Buscar auxiliares antes (para participios)
  contextInfo.hasAuxiliaryBefore = hasAuxiliaryInRange(
    tokens,
    Math.max(0, currentIndex - 3),
    currentIndex - 1,
    true
  );

  // Buscar auxiliares después (para infinitivos)
  contextInfo.hasAuxiliaryAfter = hasAuxiliaryInRange(
    tokens,
    Math.max(0, currentIndex + 1),
    Math.min(tokens.length - 1, currentIndex + 3)
  );

  // Buscar artículos antes (indica uso nominal)
  contextInfo.hasArticleBefore = hasArticleInRange(
    tokens,
    Math.max(0, currentIndex - 2),
    Math.min(tokens.length - 1, currentIndex - 1)
  );

  // Determinar posición en la oración
  if (atSentenceStart) {
    contextInfo.position = "sentence_start";
  } else if (currentIndex === tokens.length - 1) {
    contextInfo.position = "sentence_end";
  } else {
    contextInfo.position = "middle";
  }

  // Para participios, determinar rol probable
  if (readings.some((r) => r.form === "participle")) {
    if (contextInfo.hasAuxiliaryBefore) {
      contextInfo.likelyRole = "verb";
    } else if (contextInfo.hasArticleBefore) {
      contextInfo.likelyRole = "adjective";
    } else {
      contextInfo.likelyRole = "adjective"; // por defecto sin auxiliar
    }
  }

  return contextInfo;
}

function hasAuxiliaryInRange(tokens, start, end, nearestFirst = false) {
  if (!tokens || start > end) return false;

  const dicts = getVerbDictionaries();
  const indices = [];
  if (nearestFirst) {
    // del más cercano al más lejano: end, end-1, ..., start
    for (let i = end; i >= start; i--) indices.push(i);
  } else {
    // orden natural: start, start+1, ..., end
    for (let i = start; i <= end; i++) indices.push(i);
  }
  for (const i of indices) {
    if (i < 0 || i >= tokens.length) continue;

    const token = normalize(
      String(tokens[i] || "").replace(CLEAN_QUOTE_PUNCT_RE, "")
    );
    if (!token) continue;

    if (dicts.auxiliaries.has(token)) return true;

    // Saltar palabras comunes que no afectan la estructura verbal
    if (SKIP_WORDS.has(token)) {
      continue;
    }

    // Si encontramos otra palabra significativa, parar búsqueda
    break;
  }

  return false;
}

function hasArticleInRange(tokens, start, end) {
  if (!tokens || start > end) return false;

  for (let i = start; i <= end; i++) {
    if (i < 0 || i >= tokens.length) continue;

    const token = normalize(
      String(tokens[i] || "").replace(CLEAN_QUOTE_PUNCT_RE, "")
    );
    if (ARTICLE_TOKENS.has(token)) return true;
  }

  return false;
}

function determineVerbLikelihood(readings, contextInfo) {
  // Formas claramente verbales (finitas, imperativas) → siempre verbo
  if (readings.some((r) => r.form === "finite" || r.form === "imperative")) {
    return true;
  }

  // Infinitivos → generalmente verbos, especialmente con contexto
  if (readings.some((r) => r.form === "infinitive")) {
    if (contextInfo.hasZuNear || contextInfo.hasAuxiliaryAfter) return true;
    return true; // fallback: infinitivos son típicamente verbos
  }

  // Participios → depende del contexto sintáctico
  if (readings.some((r) => r.form === "participle")) {
    // Con auxiliar antes → claramente verbo
    if (contextInfo.hasAuxiliaryBefore) {
      return true;
    }

    // Con artículo antes → probablemente adjetivo
    if (contextInfo.hasArticleBefore) {
      return false;
    }

    // Sin contexto claro → puede ser ambos, defaultear a verbo
    return true;
  }

  return false;
}

function findLemma(normalized) {
  const dicts = getVerbDictionaries();

  // Usar el mapa de rendimiento si está disponible
  if (dicts.formToLemma && dicts.formToLemma.has(normalized)) {
    return dicts.formToLemma.get(normalized)[0]; // tomar el primero
  }

  // Buscar en el mapa de verbos directamente
  if (verbMap && verbMap[normalized]) {
    return verbMap[normalized].lemma;
  }

  // Fallback: buscar en todos los paradigmas (menos eficiente)
  for (const [lemma, paradigm] of Object.entries(verbMap || {})) {
    const allForms = [
      ...Object.values(paradigm.praesens || {}),
      ...Object.values(paradigm.präteritum || {}),
      ...Object.values(paradigm.konjunktiv2 || {}),
      ...Object.values(paradigm.imperativ || {}),
      paradigm.partizip2,
    ].filter(Boolean);

    if (allForms.some((form) => normalize(form) === normalized)) {
      return paradigm.lemma;
    }
  }

  return normalized; // fallback final
}

// =====================
// 7) EXPORTACIONES PARA COMPATIBILIDAD
// =====================

export function looksLikeFiniteVerbEnhanced(word) {
  const result = isVerbFormEnhanced(word);
  return (
    result.isVerb && result.verbInfo?.readings?.some((r) => r.form === "finite")
  );
}

// =====================
// 8) FUNCIONES ADICIONALES PARA DEBUGGING Y ANÁLISIS
// =====================

/**
 * Obtener información detallada sobre un verbo
 */
export function getVerbAnalysis(word, context = {}) {
  const result = isVerbFormEnhanced(word, context);

  if (!result.isVerb) {
    return {
      word,
      isVerb: false,
      reason: "No verb forms found",
    };
  }

  return {
    word,
    isVerb: true,
    lemma: result.verbInfo.lemma,
    readings: result.verbInfo.readings,
    irregular: result.verbInfo.irregular,
    prefixInfo: result.verbInfo.prefixInfo,
    contextAnalysis: result.context,
    confidence: result.confidence,
  };
}

/**
 * Verificar si una palabra es ambigua entre verbo y otro tipo
 */
export function checkVerbAmbiguity(word, context = {}) {
  const verbResult = isVerbFormEnhanced(word, context);

  if (!verbResult.isVerb) return null;

  // Verificar si podría ser participio usado como adjetivo
  const hasParticiple = verbResult.verbInfo.readings.some(
    (r) => r.form === "participle"
  );

  if (hasParticiple && !verbResult.context.hasAuxiliaryBefore) {
    return {
      isAmbiguous: true,
      possibilities: ["verb", "adjective"],
      primary:
        verbResult.context.likelyRole === "adjective" ? "adjective" : "verb",
      reason: "participle-without-auxiliary",
    };
  }

  return {
    isAmbiguous: false,
    primary: "verb",
  };
}
