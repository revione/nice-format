import { IRREGULARS } from "./lemmas/IrregularVerbs.js";
import { REGULARS } from "./lemmas/RegularVerbs.js";
import { INSEPARABLE_PREFIXES, SEPARABLE_PREFIXES } from "./lemmas/prefixes.js";
import { AUX_BY_LEMMA } from "./lemmas/aux_by_lemma.js";

const normalize = (word) => word.toLowerCase();

// =====================
// CACHE GLOBAL DE DICCIONARIOS
// =====================
let verbDictionaries = null;

function buildRegular(lemma) {
  // Solo -en o -n
  const m = lemma.match(/^(.*?)(en|n)$/);
  if (!m) return null;

  let stem = m[1];

  // Para stems que acaban en s/ß/x/z, la terminación de du es -t (no -st)
  const hasSibilant = /[sßxz]$/.test(stem);

  // Ejemplos: arbeiten → arbeitest, atmen → atmest, pero wohnen → wohnst
  const needsE = (/[td]$/.test(stem) || /[^aeiouäöüy][mn]$/.test(stem)) && !hasSibilant;

  const praesens = {
    ich: stem + "e",
    du: hasSibilant ? stem + "t" : stem + (needsE ? "est" : "st"),
    "er/sie/es": stem + (needsE ? "et" : "t"),
    wir: lemma,
    ihr: stem + (needsE ? "et" : "t"),
    "sie/Sie": lemma,
  };

  const präteritum = {
    ich: stem + "te",
    du: stem + (needsE ? "etest" : "test"),
    "er/sie/es": stem + "te",
    wir: stem + "ten",
    ihr: stem + (needsE ? "etet" : "tet"),
    "sie/Sie": stem + "ten",
  };

  let partizip2;

  // Verificar si tiene prefijo inseparable
  const hasInseparablePrefix = INSEPARABLE_PREFIXES.some((p) => lemma.startsWith(p));

  if (hasInseparablePrefix) {
    partizip2 = stem + "t";
  } else {
    // Verificar prefijo separable
    const separablePrefix = SEPARABLE_PREFIXES.find((p) => lemma.startsWith(p));
    if (separablePrefix) {
      const baseStem = lemma.slice(separablePrefix.length);
      const baseMatch = baseStem.match(/^(.*?)(en|n)$/);
      if (baseMatch) {
        partizip2 = separablePrefix + "ge" + baseMatch[1] + "t";
      } else {
        partizip2 = "ge" + stem + "t"; // fallback
      }
    } else {
      partizip2 = "ge" + stem + "t";
    }
  }

  const aux = AUX_BY_LEMMA[lemma] || "haben";

  return {
    lemma,
    aux,
    praesens,
    präteritum,
    partizip2,
    imperativ: {
      du: stem + (needsE ? "e" : ""),
      ihr: stem + (needsE ? "et" : "t"),
      Sie: lemma + " Sie",
    },
    zuInfinitiv: "zu " + lemma,
  };
}

export function getVerbParadigm(lemma) {
  const key = normalize(lemma);
  if (IRREGULARS[key]) return IRREGULARS[key];
  return buildRegular(lemma);
}

export function generateVerbDictionaries(lemmas) {
  const finite = new Set();
  const participles = new Set();
  const imperatives = new Set();

  // LIMPIADO: Solo auxiliares esenciales, sin duplicados innecesarios
  const auxiliaries = new Set(
    [
      // sein
      "sein",
      "bin",
      "bist",
      "ist",
      "sind",
      "seid",
      "war",
      "warst",
      "waren",
      "wart",
      // haben
      "haben",
      "habe",
      "hast",
      "hat",
      "habt",
      "hatte",
      "hattest",
      "hatten",
      "hattet",
      // werden
      "werden",
      "werde",
      "wirst",
      "wird",
      "werdet",
      "wurde",
      "wurdest",
      "wurden",
      "wurdet",
    ].map(normalize)
  );

  const formToLemma = new Map();

  for (const lemma of lemmas) {
    const paradigm = getVerbParadigm(lemma);
    if (!paradigm) continue;

    const normalizedLemma = normalize(lemma);

    // Función auxiliar para registrar forma→lema
    const registerForm = (form, category) => {
      if (!form) return;
      const normalizedForm = normalize(form);

      // Añadir a diccionario correspondiente
      if (category === "finite") finite.add(normalizedForm);
      else if (category === "participle") participles.add(normalizedForm);
      else if (category === "imperative") imperatives.add(normalizedForm);

      // Registrar en mapa forma→lema
      if (!formToLemma.has(normalizedForm)) {
        formToLemma.set(normalizedForm, []);
      }
      if (!formToLemma.get(normalizedForm).includes(normalizedLemma)) {
        formToLemma.get(normalizedForm).push(normalizedLemma);
      }
    };

    // Formas finitas (presente y pretérito)
    Object.values(paradigm.praesens || {}).forEach((form) => {
      registerForm(form, "finite");
    });
    Object.values(paradigm.präteritum || {}).forEach((form) => {
      registerForm(form, "finite");
    });

    // Konjunktiv II si existe
    if (paradigm.konjunktiv2) {
      Object.values(paradigm.konjunktiv2).forEach((form) => {
        registerForm(form, "finite");
      });
    }

    // Participios
    if (paradigm.partizip2) {
      registerForm(paradigm.partizip2, "participle");
    }

    // Imperativos
    Object.values(paradigm.imperativ || {}).forEach((form) => {
      if (form && !form.includes(" ")) {
        // excluir "machen Sie" etc.
        registerForm(form, "imperative");
      }
    });

    // Auxiliares específicos del paradigma (añadir sin duplicar)
    if (paradigm.aux === "sein" || paradigm.aux === "haben") {
      auxiliaries.add(normalize(paradigm.aux));
    }
  }

  return {
    finite,
    participles,
    imperatives,
    auxiliaries,
    formToLemma, // Mapa para rendimiento
  };
}

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
