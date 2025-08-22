// =====================
// Adverbios en alemán
// =====================

export const ADV_PLACE = [
  "hier",
  "dort",
  "da",
  "überall",
  "nirgends",
  "irgendwo",
  "anderswo",
  "links",
  "rechts",
  "geradeaus",
  "vorne",
  "vorn",
  "hinten",
  "rein",
  "raus",
  "hoch",
  "runter",
  "zurück",
  "weg",
  "her",
  "hin",
  "daran",
  "darauf",
  "daraus",
];

export const ADV_TIME = [
  "heute",
  "gestern",
  "morgen",
  "jetzt",
  "damals",
  "dann",
  "danach",
  "vorher",
  "zuvor",
  "bald",
  "schon",
  "noch",
  "bereits",
  "endlich",
  "schließlich",
  "sofort",
  "gleich",
  "spät",
  "früh",
  "pünktlich",
  "rechtzeitig",
  "verspätet",
  "verfrüht",
  "immer",
  "nie",
  "oft",
  "manchmal",
  "meistens",
  "selten",
  "nachts",
  "zweimal",
  "einmal",
  "später",
  "früher",
];

export const ADV_MANNER = [
  "gern",
  "gerne",
  "schnell",
  "langsam",
  "leise",
  "laut",
  "ruhig",
  "aufmerksam",
  "freundlich",
  "behutsam",
  "direkt",
  "zusammen",
  "gemeinsam",
  "allein",
  "einzeln",
  "plötzlich",
  "anders",
  "genauso",
  "irgendwie",
  "unnötig",
  "flexibel",
  "angenehm",
  "recht", // correctamente, bastante
];

export const ADV_DEGREE = [
  "sehr",
  "ziemlich",
  "völlig",
  "ganz",
  "halb",
  "etwas",
  "mehr",
  "weniger",
  "genug",
  "fast",
  "kaum",
  "total",
  "echt",
  "absolut",
  "relativ",
  "besonders",
  "teilweise",
  "wirklich",
  "tatsächlich",
  "hauptsächlich",
  "normalerweise",
  "üblicherweise",
  "viel",
  "wenig",
  "etwa", // aproximadamente
  "eher", // más bien, antes bien
];

export const ADV_MODALITY = [
  "wahrscheinlich",
  "vielleicht",
  "sicher",
  "bestimmt",
  "definitiv",
  "klar",
  "eigentlich",
  "wohl", // probablemente
];

export const ADV_CONNECTIVE = [
  "dann",
  "darum",
  "wiederum",
  "ebenso",
  "ebenfalls",
  "zusätzlich",
  "weiterhin",
  "außerdem",
  "schließlich",
  "immerhin",
  "zwar",
  "jedoch",
  "allerdings",
  "übrigens",
  "nämlich",
  "quasi",
  "eben",
  "doch",
  "so",
  "also",
];

export const ADV_PARTICLES = [
  "ja",
  "nein",
  "oh",
  "hm",
  "ok",
  "na",
  "super",
  "danke",
  "mal", // partícula modal: Komm mal her!
];

// =====================
// Export conjunto plano
// =====================
export const BLOCKS_ADVERBS = {
  PLACE: ADV_PLACE,
  TIME: ADV_TIME,
  MANNER: ADV_MANNER,
  DEGREE: ADV_DEGREE,
  MODALITY: ADV_MODALITY,
  CONNECTIVE: ADV_CONNECTIVE,
  PARTICLES: ADV_PARTICLES,
};

export const ADVERBS = Array.from(new Set([...ADV_PLACE, ...ADV_TIME, ...ADV_MANNER, ...ADV_DEGREE, ...ADV_MODALITY, ...ADV_CONNECTIVE, ...ADV_PARTICLES]));

export const IRREGULAR_ADVERBS = [
  "gern",
  "gerne", // manera: con gusto
  "kaum", // grado: apenas
  "schon", // tiempo: ya
  "eben", // conectivo: precisamente
  "mal", // partícula: una vez / partícula modal
  "wohl", // modalidad: probablemente
  "etwa", // grado: aproximadamente
  "fast", // grado: casi
  "ziemlich", // grado: bastante
  "ganz", // grado: completamente
  "recht", // manera: correctamente / bastante
  "eher", // grado: más bien
  "doch", // conectivo: sin embargo
  "ja", // partícula: sí
  "nein", // partícula: no
  "später", // tiempo: más tarde
  "früher", // tiempo: antes/más temprano
];

// =====================
// FUNCIONES ÚTILES
// =====================

/**
 * Verifica si una palabra es un adverbio irregular
 * @param {string} word - palabra a verificar
 * @returns {boolean}
 */
export function isIrregularAdverb(word) {
  return IRREGULAR_ADVERBS.includes(word.toLowerCase());
}

/**
 * Obtiene la categoría de un adverbio
 * @param {string} word - palabra a verificar
 * @returns {string|null} - categoría del adverbio o null
 */
export function getAdverbCategory(word) {
  const normalized = word.toLowerCase();

  if (ADV_PLACE.includes(normalized)) return "place";
  if (ADV_TIME.includes(normalized)) return "time";
  if (ADV_MANNER.includes(normalized)) return "manner";
  if (ADV_DEGREE.includes(normalized)) return "degree";
  if (ADV_MODALITY.includes(normalized)) return "modality";
  if (ADV_CONNECTIVE.includes(normalized)) return "connective";
  if (ADV_PARTICLES.includes(normalized)) return "particles";

  return null;
}
