import { IRREGULARS } from "./verbs/IrregularVerbs.js";
import { REGULARS } from "./verbs/RegularVerbs.js";
import { generateVerbDictionaries, getVerbParadigm } from "./VerbForms.js";

const normalize = (word) => word.toLowerCase();

// =====================
// CACHE GLOBAL DE DICCIONARIOS
// =====================
let verbDictionaries = null;

/**
 * Genera y cachea los diccionarios de verbos
 * @returns {Object} Diccionarios de formas verbales
 */
export function getVerbDictionaries() {
  if (!verbDictionaries) {
    // Generar lista de todos los lemas de verbos
    const allVerbLemmas = [...Object.keys(IRREGULARS), ...REGULARS];

    // Generar diccionarios usando VerbForms.js
    verbDictionaries = generateVerbDictionaries(allVerbLemmas);
  }
  return verbDictionaries;
}

// =====================
// ANÁLISIS DE CONTEXTO VERBAL
// =====================

function analyzeVerbContext(word, context = {}) {
  const { tokens = [], currentIndex = 0, atSentenceStart = false } = context;

  const contextInfo = {
    hasAuxiliaryBefore: false,
    hasSubjectBefore: false,
    hasParticleBefore: false,
    isLikelyFinite: false,
    isLikelyParticiple: false,
    likelyRole: "unknown", // finite, participle, imperative
    position: "unknown",
  };

  // Verificar auxiliar antes (para participios)
  if (currentIndex > 0) {
    const prevTokens = tokens.slice(Math.max(0, currentIndex - 3), currentIndex);
    for (const token of prevTokens) {
      const normalizedToken = normalize(token);
      if (getVerbDictionaries().auxiliaries.has(normalizedToken)) {
        contextInfo.hasAuxiliaryBefore = true;
        break;
      }
    }
  }

  // Verificar sujeto antes (para verbos finitos)
  if (currentIndex > 0) {
    const prevToken = normalize(tokens[currentIndex - 1] || "");
    const pronouns = ["ich", "du", "er", "sie", "es", "wir", "ihr"];
    if (pronouns.includes(prevToken)) {
      contextInfo.hasSubjectBefore = true;
    }
  }

  // Determinar posición
  if (atSentenceStart) {
    contextInfo.position = "sentence_start";
    contextInfo.isLikelyFinite = true; // En alemán, los verbos al inicio suelen ser finitos
  } else if (currentIndex === tokens.length - 1) {
    contextInfo.position = "sentence_end";
  } else {
    contextInfo.position = "middle";
  }

  // Lógica de determinación de rol
  if (contextInfo.hasAuxiliaryBefore) {
    contextInfo.likelyRole = "participle";
    contextInfo.isLikelyParticiple = true;
  } else if (contextInfo.hasSubjectBefore || atSentenceStart) {
    contextInfo.likelyRole = "finite";
    contextInfo.isLikelyFinite = true;
  } else {
    // Heurística adicional basada en la forma
    if (word.startsWith("ge") && word.length > 4) {
      contextInfo.likelyRole = "participle";
      contextInfo.isLikelyParticiple = true;
    } else {
      contextInfo.likelyRole = "finite";
      contextInfo.isLikelyFinite = true;
    }
  }

  return contextInfo;
}

// =====================
// DETECCIÓN PRINCIPAL DE VERBOS
// =====================

/**
 * Función principal de detección de verbos con contexto
 */
export function isVerbFormEnhanced(word, context = {}) {
  const normalized = normalize(word);
  const dictionaries = getVerbDictionaries();

  const result = {
    isVerb: false,
    confidence: 0,
    verbInfo: null,
    context: null,
    readings: [],
  };

  // Analizar contexto
  const contextInfo = analyzeVerbContext(word, context);

  // Verificar en diccionarios
  let found = false;
  let possibleLemmas = [];

  if (dictionaries.finite.has(normalized)) {
    found = true;
    possibleLemmas = dictionaries.formToLemma.get(normalized) || [];
    result.readings.push({
      form: "finite",
      confidence: contextInfo.isLikelyFinite ? 0.9 : 0.7,
    });
  }

  if (dictionaries.participles.has(normalized)) {
    found = true;
    if (!possibleLemmas.length) {
      possibleLemmas = dictionaries.formToLemma.get(normalized) || [];
    }
    result.readings.push({
      form: "participle",
      confidence: contextInfo.isLikelyParticiple ? 0.9 : 0.6,
    });
  }

  if (dictionaries.imperatives.has(normalized)) {
    found = true;
    if (!possibleLemmas.length) {
      possibleLemmas = dictionaries.formToLemma.get(normalized) || [];
    }
    result.readings.push({
      form: "imperative",
      confidence: contextInfo.position === "sentence_start" ? 0.8 : 0.5,
    });
  }

  if (!found) {
    return result;
  }

  // Calcular confianza total
  let totalConfidence = 0;
  if (result.readings.length > 0) {
    totalConfidence = Math.max(...result.readings.map((r) => r.confidence));
  }

  // Bonificaciones contextuales
  if (contextInfo.hasAuxiliaryBefore && result.readings.some((r) => r.form === "participle")) {
    totalConfidence = Math.min(1.0, totalConfidence + 0.1);
  }

  if (contextInfo.hasSubjectBefore && result.readings.some((r) => r.form === "finite")) {
    totalConfidence = Math.min(1.0, totalConfidence + 0.1);
  }

  result.isVerb = true;
  result.confidence = totalConfidence;
  result.context = contextInfo;

  if (possibleLemmas.length > 0) {
    result.verbInfo = {
      lemma: possibleLemmas[0], // Tomar el primero por simplicidad
      allLemmas: possibleLemmas,
      readings: result.readings,
    };
  }

  return result;
}

// =====================
// FUNCIONES AUXILIARES
// =====================

/**
 * Verificar si una palabra parece un verbo finito
 */
export function looksLikeFiniteVerbEnhanced(word) {
  const result = isVerbFormEnhanced(word, {});
  return result.isVerb && result.readings.some((r) => r.form === "finite");
}

/**
 * Verificar si una palabra parece un participio
 */
export function looksLikeParticipleEnhanced(word) {
  const result = isVerbFormEnhanced(word, {});
  return result.isVerb && result.readings.some((r) => r.form === "participle");
}

/**
 * Obtener información completa de un verbo
 */
export function getVerbInfo(word, context = {}) {
  const result = isVerbFormEnhanced(word, context);

  if (!result.isVerb) {
    return {
      word,
      isVerb: false,
      reason: "No verb found",
    };
  }

  let paradigm = null;
  if (result.verbInfo?.lemma) {
    paradigm = getVerbParadigm(result.verbInfo.lemma);
  }

  return {
    word,
    isVerb: true,
    lemma: result.verbInfo?.lemma,
    allLemmas: result.verbInfo?.allLemmas,
    readings: result.readings,
    paradigm,
    contextAnalysis: result.context,
    confidence: result.confidence,
  };
}

// =====================
// FUNCIONES DE COMPATIBILIDAD
// =====================

/**
 * Función simple para verificar si es verbo (sin contexto)
 */
export function isVerb(word) {
  const result = isVerbFormEnhanced(word, {});
  return result.isVerb;
}

/**
 * Verificar si es verbo finito (función simple)
 */
export function looksLikeFiniteVerb(word) {
  return looksLikeFiniteVerbEnhanced(word);
}
