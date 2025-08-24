/**
 * utils/variants.js - GENERACIÓN DE VARIANTES ALEMANAS
 * API unificada, sin duplicaciones ni confusiones
 */

// --- Mapas de transformación ---
const UMLAUT_MAP = { a: "ä", o: "ö", u: "ü", A: "Ä", O: "Ö", U: "Ü" };
const REVERSE_UMLAUT_MAP = { ä: "a", ö: "o", ü: "u", Ä: "A", Ö: "O", Ü: "U" };

/**
 * Transformaciones de umlaut
 */
export const transformUmlaut = {
  toUmlaut: (s) => s.replace(/ae/g, "ä").replace(/oe/g, "ö").replace(/ue/g, "ü").replace(/Ae/g, "Ä").replace(/Oe/g, "Ö").replace(/Ue/g, "Ü"),
  fromUmlaut: (s) => s.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/Ä/g, "Ae").replace(/Ö/g, "Oe").replace(/Ü/g, "Ue"),
  reverseUmlaut: (s) => s.replace(/[ÄÖÜäöü]/g, (m) => REVERSE_UMLAUT_MAP[m] ?? m),
  applyUmlaut: (word) => word.replace(/[aouAOU](?!.*[aouAOU])/g, (m) => UMLAUT_MAP[m] || m),
};

/**
 * FUNCIÓN PRINCIPAL: Genera variantes ortográficas de palabra alemana
 */
export const generateGermanVariants = (word) => {
  const normalized = word?.trim().toLowerCase() || "";
  if (!normalized) return [];

  const variants = new Set([normalized]);

  // 1. ß <-> ss
  variants.add(normalized.replace(/ß/g, "ss"));
  variants.add(normalized.replace(/ss/g, "ß"));

  // 2. ä/ö/ü <-> ae/oe/ue
  const withDigraphs = transformUmlaut.fromUmlaut(normalized);
  if (withDigraphs !== normalized) {
    variants.add(withDigraphs);
    variants.add(withDigraphs.replace(/ß/g, "ss"));
    variants.add(withDigraphs.replace(/ss/g, "ß"));
  }

  // 3. ae/oe/ue -> a/o/u (casos especiales)
  const deDigraph = withDigraphs.replace(/ae/g, "a").replace(/oe/g, "o").replace(/ue/g, "u");
  if (deDigraph !== withDigraphs) {
    variants.add(deDigraph);
    variants.add(deDigraph.replace(/ß/g, "ss"));
    variants.add(deDigraph.replace(/ss/g, "ß"));
  }

  // 4. Variantes con umlaut aplicado
  const withUmlaut = transformUmlaut.toUmlaut(normalized);
  if (withUmlaut !== normalized) {
    variants.add(withUmlaut);
    variants.add(withUmlaut.replace(/ß/g, "ss"));
    variants.add(withUmlaut.replace(/ss/g, "ß"));
  }

  return [...variants];
};

/**
 * Variantes para stems (más agresivo para análisis morfológico)
 */
export const generateStemVariants = (stem) => {
  if (!stem) return [];

  const variants = new Set(generateGermanVariants(stem));

  // Insertar 'e' antes de última consonante (dunkel -> dunkl + e -> dunkel)
  const plusE = stem.replace(/([bcdfghjklmnpqrstvwxyz])$/i, "e$1");
  if (plusE !== stem) {
    variants.add(plusE);
    for (const variant of generateGermanVariants(plusE)) {
      variants.add(variant);
    }
  }

  // adjetivos que pierden la -e antes de -er/-est (leise -> leiser/leisest-)
  const terminalE = `${stem}e`;
  if (terminalE !== stem) {
    variants.add(terminalE);
    for (const variant of generateGermanVariants(terminalE)) {
      variants.add(variant);
    }
  }

  return [...variants];
};
