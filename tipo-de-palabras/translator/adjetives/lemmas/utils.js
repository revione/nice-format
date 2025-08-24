import { SUPPLETIVE_COMPARATIVES, SUPPLETIVE_SUPERLATIVES, IRREGULAR_COMPARATIVES, IRREGULAR_SUPERLATIVES } from "./superlatives.js";
import { transformUmlaut } from "../utils/variants.js";

// --- Builders por idioma ---
const LANGUAGE_PATTERNS = {
  es: {
    comp: { prefix: "más ", suffix: "" },
    sup: { prefix: "el/la más ", suffix: "" },
  },
  en: {
    comp: { prefix: "more ", suffix: "" },
    sup: { prefix: "most ", suffix: "" },
  },
};

export const BUILDERS = Object.fromEntries(
  Object.entries(LANGUAGE_PATTERNS).map(([lang, patterns]) => [
    lang,
    {
      comp: (s) => `${patterns.comp.prefix}${s}${patterns.comp.suffix}`,
      sup: (s) => `${patterns.sup.prefix}${s}${patterns.sup.suffix}`,
    },
  ])
);

// --- Reglas alemanas ---
const DOUBLE_STEM_SET = new Set(["fit"]);
const needsEst = (baseDe) => /(?:sch|tsch|[dtzsxß])$/.test(baseDe);

/**
 * Crea el tema unificado para comparativo y superlativo
 * @param {string} baseDe - Forma base en alemán
 * @param {Array} [irregularities] - Irregularidades aplicables
 * @returns {string} - Tema para comp/sup
 */
const makeAdjStemDe = (baseDe, irregularities) => {
  let stem = baseDe;

  // Aplicar umlaut si está marcado
  if (irregularities?.includes("umlaut")) {
    stem = transformUmlaut.applyUmlaut(stem);
  }

  // Duplicación de consonante final (fit -> fitt-)
  if (DOUBLE_STEM_SET.has(baseDe)) {
    stem = `${baseDe}${baseDe.slice(-1)}`;
  }

  return stem;
};

// Aliases para claridad (mantener compatibilidad)
const makeCompStemDe = makeAdjStemDe;
const makeSupStemDe = makeAdjStemDe;

/**
 * Helper para crear resultado de análisis con manejo de gradabilidad
 * @param {Object} params - Parámetros del resultado
 * @returns {Object} - Resultado de análisis normalizado
 */
const createGradedResult = ({ entry, base, rawDegree, confidence, message, gradable }) => {
  const degree = gradable !== false ? rawDegree : null;
  const adjustedConfidence = degree ? confidence : Math.max(confidence - 0.15, 0.1);
  const finalMessage = degree ? message : `${message} (no gradable → grado nulo)`;

  return {
    ...entry,
    degree,
    confidence: adjustedConfidence,
    notes: [finalMessage],
  };
};

// --- Generador principal: completa comp/sup y propaga a otros idiomas ---
export const makeAdjectivesFromList = (list) => {
  if (!Array.isArray(list)) {
    throw new TypeError("makeAdjectivesFromList: se esperaba un array");
  }

  return list.map((entry) => {
    if (!entry?.base?.de) throw new Error("Cada entrada necesita base.de");

    const { irregularities, gradable } = entry;
    const base = { ...entry.base };
    const comp = { ...(entry.comp || {}) };
    const sup = { ...(entry.sup || {}) };

    // --- Alemán (de) - Solo si es gradable ---
    if (gradable !== false) {
      // Comparativo
      if (!comp.de) {
        if (irregularities?.includes("suppletive") && SUPPLETIVE_COMPARATIVES[base.de]) {
          comp.de = SUPPLETIVE_COMPARATIVES[base.de];
        } else if (IRREGULAR_COMPARATIVES[base.de]) {
          comp.de = IRREGULAR_COMPARATIVES[base.de];
        } else {
          const stem = makeCompStemDe(base.de, irregularities);
          comp.de = `${stem}er`;
        }
      }

      // Superlativo
      if (!sup.de) {
        if (irregularities?.includes("suppletive") || irregularities?.includes("irregular superlative")) {
          const mapped = SUPPLETIVE_SUPERLATIVES[base.de] || IRREGULAR_SUPERLATIVES[base.de];
          if (mapped) {
            sup.de = mapped;
          } else {
            const stem = makeSupStemDe(base.de, irregularities);
            sup.de = `${stem}${needsEst(base.de) ? "est" : "st"}`;
          }
        } else if (IRREGULAR_SUPERLATIVES[base.de]) {
          sup.de = IRREGULAR_SUPERLATIVES[base.de];
        } else {
          const stem = makeSupStemDe(base.de, irregularities);
          sup.de = `${stem}${needsEst(base.de) ? "est" : "st"}`;
        }
      }
    }

    // --- Otros idiomas ---
    const targetLangs = Object.keys(base).filter((k) => k !== "de");
    for (const lang of targetLangs) {
      const tr = base[lang];
      const b = BUILDERS[lang];
      if (!b || !tr) continue;
      if (gradable !== false) {
        comp[lang] ||= b.comp(tr);
        sup[lang] ||= b.sup(tr);
      }
    }

    return { ...entry, base, comp, sup };
  });
};

// --- Aplanador: [{ base, comp, sup }] -> [{ de:'', es:'', en?:'' }, ...] ---
export const flattenBlocks = (blocks) => {
  if (!Array.isArray(blocks)) throw new TypeError("flattenBlocks: se esperaba un array");

  const out = [];
  for (const { base, comp, sup, gradable } of blocks) {
    // Siempre agregar la forma base
    if (base?.de) {
      out.push({ ...base, form: "base", gradable });
    }

    // Solo agregar comp/sup si es gradable
    if (gradable !== false) {
      if (comp?.de) {
        out.push({ ...comp, form: "comp", gradable });
      }
      if (sup?.de) {
        out.push({ ...sup, form: "sup", gradable });
      }
    }
  }
  return out;
};

/**
 * Pipeline cómodo: completa comp/sup + aplana
 */
export const flatteAdj = (list) => {
  if (!Array.isArray(list)) throw new TypeError("flatteAdj: se esperaba un array");
  const completed = makeAdjectivesFromList(list);
  return flattenBlocks(completed);
};
