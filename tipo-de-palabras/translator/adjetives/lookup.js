import { ADJECTIVES_IMPORTED, ADJ_GRADABLE } from "./lemmas/index.js";
import { makeAdjectivesFromList } from "./lemmas/utils.js";
import { analyzeAdjective } from "./detection.js";

/** Normaliza una palabra DE para comparar (lowercase, trim). */
const norm = (s) => s?.trim().toLowerCase() || "";

/** Genera variantes ortográficas útiles para comparar. */
const deVariants = (s) => {
  const x = norm(s);
  if (!x) return [];
  const v = new Set([x]);
  // ß <-> ss
  v.add(x.replace(/ß/g, "ss"));
  v.add(x.replace(/ss/g, "ß"));
  // ä/ö/ü <-> ae/oe/ue
  v.add(x.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue"));
  v.add(x.replace(/ae/g, "ä").replace(/oe/g, "ö").replace(/ue/g, "ü"));
  return [...v];
};

/**
 * Crea un mapa completo de todas las formas posibles (base/comp/sup)
 * desde los datos base, incluyendo formas generadas
 */
const buildCompleteFormsMap = () => {
  // Primero, agrupa las entradas por base alemana
  const baseGroups = new Map();

  for (const entry of ADJECTIVES_IMPORTED) {
    if (entry.form === "base") {
      const baseDe = norm(entry.de);
      if (!baseGroups.has(baseDe)) {
        baseGroups.set(baseDe, {
          base: entry,
          comp: null,
          sup: null,
          originalEntry: {
            base: { de: entry.de, es: entry.es },
            gradable: entry.gradable,
          },
        });
      }
    }
  }

  // Busca formas comp/sup explícitas existentes
  for (const entry of ADJECTIVES_IMPORTED) {
    if (entry.form === "comp" || entry.form === "sup") {
      // Encuentra la base correspondiente usando análisis
      const analysis = analyzeAdjective(entry.de);
      if (analysis.base && analysis.confidence > 0.7) {
        const baseDe = norm(analysis.base);
        const group = baseGroups.get(baseDe);
        if (group && !group[entry.form]) {
          group[entry.form] = entry;
          // Actualiza la entrada original con la forma explícita
          if (entry.form === "comp") {
            group.originalEntry.comp = { de: entry.de, es: entry.es };
          } else {
            group.originalEntry.sup = { de: entry.de, es: entry.es };
          }
        }
      }
    }
  }

  // Genera formas completas usando las reglas de utils.js
  const completeFormsMap = new Map();

  for (const [baseDe, group] of baseGroups.entries()) {
    try {
      // Generar formas completas
      const [generated] = makeAdjectivesFromList([group.originalEntry]);

      // Agregar forma base
      const baseForm = {
        ...group.base,
        de: group.base.de,
        form: "base",
      };

      // Agregar todas las variantes de la forma base
      for (const variant of deVariants(baseForm.de)) {
        completeFormsMap.set(variant, baseForm);
      }

      // Agregar forma comparativa si es gradable
      if (generated.comp && generated.comp.de && ADJ_GRADABLE.get(group.base.de) !== false) {
        const compForm = {
          ...group.base,
          de: generated.comp.de,
          es: group.comp ? group.comp.es : generated.comp.es,
          form: "comp",
        };

        for (const variant of deVariants(compForm.de)) {
          completeFormsMap.set(variant, compForm);
        }
      }

      // Agregar forma superlativa si es gradable
      if (generated.sup && generated.sup.de && ADJ_GRADABLE.get(group.base.de) !== false) {
        const supForm = {
          ...group.base,
          de: generated.sup.de,
          es: group.sup ? group.sup.es : generated.sup.es,
          form: "sup",
        };

        for (const variant of deVariants(supForm.de)) {
          completeFormsMap.set(variant, supForm);
        }
      }
    } catch (error) {
      console.warn(`Error generando formas para ${baseDe}:`, error);
    }
  }

  // *** NUEVA SECCIÓN: Agregar formas supletivas directamente ***
  // Esto asegura que formas como "lieber", "liebsten" estén en el mapa
  for (const entry of ADJECTIVES_IMPORTED) {
    for (const variant of deVariants(entry.de)) {
      if (!completeFormsMap.has(variant)) {
        completeFormsMap.set(variant, entry);
      }
    }
  }

  return completeFormsMap;
};

// Cache global de formas completas
let COMPLETE_FORMS_CACHE = null;
const getCompleteForms = () => {
  if (!COMPLETE_FORMS_CACHE) {
    COMPLETE_FORMS_CACHE = buildCompleteFormsMap();
  }
  return COMPLETE_FORMS_CACHE;
};

/**
 * Busca una entrada usando el análisis morfológico primero,
 * luego busca en las formas completas
 */
const findEntry = (deWord) => {
  const completeForms = getCompleteForms();

  // Primero, intenta encontrar directamente en las formas completas
  const vars = deVariants(deWord);
  for (const variant of vars) {
    const direct = completeForms.get(variant);
    if (direct) {
      return {
        ...direct,
        de: deWord, // Preserva la forma original de entrada
      };
    }
  }

  // Si no encuentra directamente, usa el análisis morfológico
  const analysis = analyzeAdjective(deWord);

  if (analysis.base && analysis.confidence > 0.5) {
    // Busca la base en las formas completas
    const baseVars = deVariants(analysis.base);
    for (const baseVar of baseVars) {
      const baseEntry = completeForms.get(baseVar);
      if (baseEntry && baseEntry.form === "base") {
        // Crear entrada para la forma analizada
        const targetForm = analysis.degree || "base";

        if (targetForm === "base") {
          return {
            ...baseEntry,
            de: deWord,
            form: "base",
          };
        }

        // Para comp/sup, generar las formas si no existen
        try {
          const [generated] = makeAdjectivesFromList([
            {
              base: { de: baseEntry.de, es: baseEntry.es },
              gradable: baseEntry.gradable,
            },
          ]);

          if (targetForm === "comp" && generated.comp) {
            return {
              ...baseEntry,
              de: deWord,
              es: generated.comp.es,
              form: "comp",
            };
          }

          if (targetForm === "sup" && generated.sup) {
            return {
              ...baseEntry,
              de: deWord,
              es: generated.sup.es,
              form: "sup",
            };
          }
        } catch (error) {
          console.warn(`Error generando forma ${targetForm} para ${analysis.base}:`, error);
        }
      }
    }
  }

  return null;
};

/**
 * Traduce un adjetivo alemán (cualquier forma) al idioma pedido.
 * @param {string} deWord - forma en alemán (base/comp/sup/declinada)
 * @param {object} opts
 * @param {string} [opts.lang='es'] - idioma destino; si 'all', devuelve todas las traducciones
 * @returns {object|null} { de, form, gradable, translation, translations?, baseDe }
 */
export function translateAdjective(deWord, { lang = "es" } = {}) {
  if (!deWord) return null;

  const entry = findEntry(deWord);
  if (!entry) return null;

  // Determinar la base alemana
  let baseDe = entry.de;
  if (entry.form !== "base") {
    // Usar el análisis para encontrar la base
    const analysis = analyzeAdjective(deWord);
    if (analysis.base) {
      baseDe = analysis.base;
    }
  }

  const gradable = ADJ_GRADABLE.get(baseDe) ?? entry.gradable ?? true;

  // Si piden 'all', devolver todas las traducciones
  if (lang === "all") {
    const translations = Object.fromEntries(Object.entries(entry).filter(([k, v]) => !["de", "form", "gradable"].includes(k) && typeof v === "string"));

    return {
      de: deWord,
      baseDe,
      form: entry.form,
      gradable,
      translations,
    };
  }

  return {
    de: deWord,
    baseDe,
    form: entry.form,
    gradable,
    translation: entry[lang] || null,
  };
}

/**
 * Azúcar sintáctico: devuelve solo la traducción en `lang`,
 * o `null` si no se encuentra.
 */
export const tr = (deWord, lang = "es") => translateAdjective(deWord, { lang })?.translation ?? null;
