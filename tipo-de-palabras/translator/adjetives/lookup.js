import { ADJECTIVES_IMPORTED, ADJ_GRADABLE } from "./lemmas/index.js";
import { makeAdjectivesFromList } from "./lemmas/utils.js";
import { analyzeAdjective } from "./detection.js";
import { generateGermanVariants } from "./utils/variants.js";

/**
 * Mapa simple de formas explícitas con sus variantes
 */
const buildDirectFormsMap = () => {
  const map = new Map();

  for (const entry of ADJECTIVES_IMPORTED) {
    if (entry.de) {
      // Verificación de integridad
      for (const variant of generateGermanVariants(entry.de)) {
        if (!map.has(variant)) {
          map.set(variant, entry);
        }
      }
    }
  }

  return map;
};

// Cache
let DIRECT_FORMS_CACHE = null;
const getDirectForms = () => {
  if (!DIRECT_FORMS_CACHE) {
    DIRECT_FORMS_CACHE = buildDirectFormsMap();
  }
  return DIRECT_FORMS_CACHE;
};

/**
 * Busca entrada: directo primero, análisis morfológico después
 */
const findEntry = (deWord) => {
  const directForms = getDirectForms();

  // 1. Buscar forma directa
  for (const variant of generateGermanVariants(deWord)) {
    const direct = directForms.get(variant);
    if (direct) {
      return { ...direct, de: deWord };
    }
  }

  // 2. Análisis morfológico
  const analysis = analyzeAdjective(deWord);

  if (!analysis.base || analysis.confidence < 0.5) {
    return null;
  }

  // 3. Buscar base y generar traducción
  for (const baseVariant of generateGermanVariants(analysis.base)) {
    const baseEntry = directForms.get(baseVariant);

    if (baseEntry && baseEntry.form === "base") {
      const targetForm = analysis.degree || "base";

      // Forma base o no gradable
      if (targetForm === "base" || analysis.degree === null) {
        return {
          ...baseEntry,
          de: deWord,
          form: "base",
        };
      }

      // Generar comp/sup si es gradable
      if ((targetForm === "comp" || targetForm === "sup") && ADJ_GRADABLE.get(baseEntry.de) !== false) {
        try {
          const [generated] = makeAdjectivesFromList([
            {
              base: { de: baseEntry.de, es: baseEntry.es },
              gradable: baseEntry.gradable,
            },
          ]);

          const targetTranslation = generated[targetForm];
          if (targetTranslation?.es) {
            return {
              ...baseEntry,
              de: deWord,
              es: targetTranslation.es,
              form: targetForm,
            };
          }
        } catch (error) {
          console.warn(`Error generando ${targetForm} para ${analysis.base}:`, error);
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

  // Determinar la base alemana usando análisis
  const analysis = analyzeAdjective(deWord);
  const baseDe = analysis.base || entry.de;
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
