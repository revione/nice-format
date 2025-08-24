/**
 * Genera todas las variantes ortográficas de una palabra alemana
 * @param {string} word - palabra alemana
 * @returns {string[]} - array de variantes
 */
export const generateGermanVariants = (word) => {
  const normalized = word?.trim().toLowerCase() || "";
  if (!normalized) return [];

  const variants = new Set([normalized]);

  // ß <-> ss
  variants.add(normalized.replace(/ß/g, "ss"));
  variants.add(normalized.replace(/ss/g, "ß"));

  // ä/ö/ü <-> ae/oe/ue
  variants.add(normalized.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue"));
  variants.add(normalized.replace(/ae/g, "ä").replace(/oe/g, "ö").replace(/ue/g, "ü"));

  // a/o/u para casos especiales (groß/gross)
  const deDigraph = normalized.replace(/ae/g, "a").replace(/oe/g, "o").replace(/ue/g, "u");
  if (deDigraph !== normalized) {
    variants.add(deDigraph);
    // También variantes ß/ss del deDigraph
    variants.add(deDigraph.replace(/ß/g, "ss"));
    variants.add(deDigraph.replace(/ss/g, "ß"));
  }

  return [...variants];
};
