/**
 * utils/shared.js - DATOS Y CONSTANTES COMPARTIDAS (LIMPIADO)
 * Solo mantiene lo que realmente se usa
 */

import { transformUmlaut } from "./variants.js";

// === REGLAS ALEMANAS ===

export const needsEst = (baseDe) => /(?:sch|tsch|[dtzsxß])$/.test(baseDe);

/**
 * Crea tema para comparativo/superlativo alemán
 */
export const makeGermanStem = (baseDe, irregularities) => {
  let stem = baseDe;

  if (irregularities?.includes("umlaut")) {
    stem = transformUmlaut.applyUmlaut(stem);
  }

  // Duplicación específica para "fit" -> "fitter"
  if (baseDe === "fit") {
    stem = "fitt";
  }

  return stem;
};

// === PATRONES DE IDIOMAS ===

export const LANGUAGE_PATTERNS = {
  es: {
    comp: { prefix: "más ", suffix: "" },
    sup: { prefix: "el/la más ", suffix: "" },
  },
  en: {
    comp: { prefix: "more ", suffix: "" },
    sup: { prefix: "most ", suffix: "" },
  },
};

// === MAPA UNIFICADO DE FORMAS IRREGULARES ===

/**
 * Mapa unificado: base → { comp, sup, type }
 */
export const IRREGULAR_MAP = new Map([
  // Supletivos (formas completamente diferentes)
  ["gut", { comp: "besser", sup: "best", type: "suppletive" }],
  ["viel", { comp: "mehr", sup: "meist", type: "suppletive" }],
  ["gern", { comp: "lieber", sup: "liebst", type: "suppletive" }],
  ["wenig", { comp: "weniger", sup: "wenigst", type: "suppletive" }],

  // Irregulares (cambios de tema reconocibles)
  ["nah", { comp: "näher", sup: "nächst", type: "irregular" }],
  ["hoch", { comp: "höher", sup: "höchst", type: "irregular" }], // pierde -ch
]);

/**
 * Mapas inversos: form → base
 */
export const REVERSE_COMP_MAP = new Map([
  ["besser", "gut"],
  ["mehr", "viel"],
  ["lieber", "gern"],
  ["weniger", "wenig"],
  ["näher", "nah"],
  ["höher", "hoch"],
]);

export const REVERSE_SUP_MAP = new Map([
  ["best", "gut"],
  ["meist", "viel"],
  ["liebst", "gern"],
  ["wenigst", "wenig"],
  ["nächst", "nah"],
  ["höchst", "hoch"],
]);

// === FUNCIONES DE LOOKUP ===

/**
 * Obtiene formas irregulares para una base
 */
export const getIrregularForms = (base) => IRREGULAR_MAP.get(base) || null;

/**
 * Busca base desde forma comparativa
 */
export const getBaseFromComp = (comp) => REVERSE_COMP_MAP.get(comp) || null;

/**
 * Busca base desde forma superlativa
 */
export const getBaseFromSup = (sup) => REVERSE_SUP_MAP.get(sup) || null;

/**
 * Lookup combinado para análisis
 */
export const tryIrregularLookup = (form) => {
  // Comparativo
  let base = getBaseFromComp(form);
  if (base) {
    const formData = getIrregularForms(base);
    return {
      base,
      degree: "comp",
      type: formData.type,
      confidence: 0.95,
    };
  }

  // Superlativo
  base = getBaseFromSup(form);
  if (base) {
    const formData = getIrregularForms(base);
    return {
      base,
      degree: "sup",
      type: formData.type,
      confidence: 0.95,
    };
  }

  return null;
};
