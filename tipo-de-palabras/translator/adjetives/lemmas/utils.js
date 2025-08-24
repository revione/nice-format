import { SUPPLETIVE_COMPARATIVES, SUPPLETIVE_SUPERLATIVES, IRREGULAR_COMPARATIVES, IRREGULAR_SUPERLATIVES } from "./superlatives.js";

// --- Builders por idioma (podés agregar más en BUILDERS) ---
export const BUILDERS = {
  es: { comp: (s) => `más ${s}`, sup: (s) => `el/la más ${s}` },
  en: { comp: (s) => `more ${s}`, sup: (s) => `most ${s}` },
  // pt: { comp: (s) => `mais ${s}`, sup: (s) => `o/a mais ${s}` },
};

// --- Reglas y excepciones para el alemán (de) ---
// Umlaut
const UMLAUT_MAP = { a: "ä", o: "ö", u: "ü" };

/** Aplica umlaut a la ÚLTIMA vocal a/o/u en la palabra. */
const applyUmlaut = (word) =>
  word.replace(/[aou](?!.*[aou])/i, (m) => {
    const low = m.toLowerCase();
    const rep = UMLAUT_MAP[low] || m;
    return m === low ? rep : rep.toUpperCase();
  });

/** Muchos superlativos escritos requieren -est.  */
const needsEst = (baseDe) => /(?:sch|tsch|[dtzsxß])$/.test(baseDe);

/** Duplicación de consonante en el tema (comparativo/superlativo). */
const DOUBLE_STEM_SET = new Set(["fit"]); // fit -> fitt-

/** Crea el tema para comparativo (aplicando irregularidades). */
const makeCompStemDe = (baseDe, irregularities) => {
  let stem = baseDe;
  // Umlaut (krank -> kränk-; stark -> stärk-; etc.)
  if (irregularities?.includes("umlaut")) stem = applyUmlaut(stem);
  // Duplicación final (fit -> fitt-)
  if (DOUBLE_STEM_SET.has(baseDe)) stem = `${baseDe}${baseDe.slice(-1)}`;
  return stem;
};

/** Crea el tema para superlativo (mismas reglas que comparativo). */
const makeSupStemDe = (baseDe, irregularities) => makeCompStemDe(baseDe, irregularities);

// --- Generador principal: completa comp/sup y propaga a otros idiomas ---
export const makeAdjectivesFromList = (list) => {
  if (!Array.isArray(list)) {
    throw new TypeError("makeAdjectivesFromList: se esperaba un array");
  }

  return list.map((entry) => {
    if (!entry?.base?.de) throw new Error("Cada entrada necesita base.de");

    const { irregularities, gradable } = entry; // <<< leemos gradable
    const base = { ...entry.base };
    const comp = { ...(entry.comp || {}) };
    const sup = { ...(entry.sup || {}) };

    // --- Alemán (de) ---
    if (gradable !== false) {
      // Comparativo
      if (!comp.de) {
        // 1) Supletivo verdadero (gut → besser)
        if (irregularities?.includes("suppletive") && SUPPLETIVE_COMPARATIVES[base.de]) {
          comp.de = SUPPLETIVE_COMPARATIVES[base.de];
          // 2) Irregular no supletivo (hoch → höher; nah → näher)
        } else if (IRREGULAR_COMPARATIVES[base.de]) {
          comp.de = IRREGULAR_COMPARATIVES[base.de];
        } else {
          const stem = makeCompStemDe(base.de, irregularities);
          comp.de = `${stem}er`;
        }
      }

      // Superlativo
      if (!sup.de) {
        // 1) Supletivo o marcado como superlativo irregular (gut → best)
        if (irregularities?.includes("suppletive") || irregularities?.includes("irregular superlative")) {
          const mapped = SUPPLETIVE_SUPERLATIVES[base.de] || IRREGULAR_SUPERLATIVES[base.de];
          if (mapped) {
            sup.de = mapped;
          } else {
            const stem = makeSupStemDe(base.de, irregularities);
            sup.de = `${stem}${needsEst(base.de) ? "est" : "st"}`;
          }
          // 2) Irregular no supletivo explícito (hoch → höchst; nah → nächst)
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
        // <<< idem
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
    // Siempre agregar la forma base si existe
    if (base && typeof base === "object" && base.de) {
      out.push({ ...base, form: "base", gradable });
    }

    // Solo agregar comp/sup si el adjetivo es gradable Y las formas tienen contenido
    if (gradable !== false) {
      if (comp && typeof comp === "object" && comp.de) {
        out.push({ ...comp, form: "comp", gradable });
      }
      if (sup && typeof sup === "object" && sup.de) {
        out.push({ ...sup, form: "sup", gradable });
      }
    }
  }
  return out;
};

/**
 * Pipeline cómodo:
 * 1) completa comp/sup si faltan
 * 2) aplana a lista simple de formas
 *
 * @param {Array} list - [{ base:{de, es, ...}, comp?, sup?, irregularities? }, ...]
 * @returns {Array}    - [{ de:'', es:'', en?:'' }, ...]
 */
export const flatteAdj = (list) => {
  if (!Array.isArray(list)) throw new TypeError("flatteAdj: se esperaba un array");
  const completed = makeAdjectivesFromList(list);
  return flattenBlocks(completed);
};
