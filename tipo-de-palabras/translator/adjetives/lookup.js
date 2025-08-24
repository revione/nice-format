import { ADJECTIVES_IMPORTED, ADJ_GRADABLE } from "./lemmas/index.js";
import { makeAdjectivesFromList } from "./lemmas/utils.js";
import { analyzeAdjective } from "./detection.js";

/** Normaliza una palabra DE para comparar (lowercase, trim). */
const norm = (s) => s?.trim().toLowerCase() || "";

/**
 * Crea un mapa simple de todas las formas explícitas en ADJECTIVES_IMPORTED
 * y sus variantes ortográficas (ß/ss, ä/ae, etc.)
 */
const buildDirectFormsMap = () => {
  const map = new Map();

  // Genera variantes ortográficas
  const addVariants = (word, entry) => {
    const x = norm(word);
    if (!x) return;

    const variants = new Set([x]);
    // ß <-> ss
    variants.add(x.replace(/ß/g, "ss"));
    variants.add(x.replace(/ss/g, "ß"));
    // ä/ö/ü <-> ae/oe/ue
    variants.add(x.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue"));
    variants.add(x.replace(/ae/g, "ä").replace(/oe/g, "ö").replace(/ue/g, "ü"));

    for (const variant of variants) {
      if (!map.has(variant)) {
        map.set(variant, entry);
      }
    }
  };

  // Agregar todas las formas explícitas
  for (const entry of ADJECTIVES_IMPORTED) {
    addVariants(entry.de, entry);
  }

  return map;
};

// Cache global
let DIRECT_FORMS_CACHE = null;
const getDirectForms = () => {
  if (!DIRECT_FORMS_CACHE) {
    DIRECT_FORMS_CACHE = buildDirectFormsMap();
  }
  return DIRECT_FORMS_CACHE;
};

/**
 * Busca una entrada: primero busca formas explícitas,
 * luego usa análisis morfológico para generar la traducción
 */
const findEntry = (deWord) => {
  const directForms = getDirectForms();
  const normalizedWord = norm(deWord);

  // 1. Buscar forma explícita directa
  const directMatch = directForms.get(normalizedWord);
  if (directMatch) {
    return {
      ...directMatch,
      de: deWord, // Preserva la forma original
    };
  }

  // 2. Usar análisis morfológico
  const analysis = analyzeAdjective(deWord);

  if (!analysis.base || analysis.confidence < 0.5) {
    return null;
  }

  // 3. Buscar la entrada base
  const baseNorm = norm(analysis.base);
  const baseEntry = directForms.get(baseNorm);

  if (!baseEntry || baseEntry.form !== "base") {
    return null;
  }

  // 4. Si es la forma base o null (adjetivos no gradables), devolverla directamente
  if (analysis.degree === "base" || analysis.degree === null) {
    return {
      ...baseEntry,
      de: deWord,
      form: analysis.degree || "base",
    };
  }

  // 5. Para comp/sup, generar la traducción usando utils.js
  if (analysis.degree === "comp" || analysis.degree === "sup") {
    try {
      const [generated] = makeAdjectivesFromList([
        {
          base: { de: baseEntry.de, es: baseEntry.es },
          gradable: baseEntry.gradable,
        },
      ]);

      const targetTranslation = generated[analysis.degree];
      if (targetTranslation && targetTranslation.es) {
        return {
          ...baseEntry,
          de: deWord,
          es: targetTranslation.es,
          form: analysis.degree,
        };
      }
    } catch (error) {
      console.warn(`Error generando forma ${analysis.degree} para ${analysis.base}:`, error);
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
