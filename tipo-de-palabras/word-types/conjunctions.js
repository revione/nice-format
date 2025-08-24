// =====================
// Conjunciones en alemán
// =====================

export const CONJ_COORDINATING = ["und", "oder", "aber", "denn", "sondern", "doch"];

export const CONJ_SUBORDINATING = [
  "dass",
  "weil",
  "ob",
  "wenn",
  "als",
  "bevor",
  "nachdem",
  "bis",
  "seit",
  "sobald",
  "solange",
  "falls",
  "sofern",
  "obwohl",
  "während",
  "ehe",
  "indem",
  "damit",
  "sodass",
  "zumal",
  "obgleich",
  "obschon",
];

export const CONJ_ADVERBIAL = [
  "deshalb",
  "daher",
  "folglich",
  "somit",
  "also",
  "trotzdem",
  "dennoch",
  "außerdem",
  "übrigens",
  "allerdings",
  "freilich",
  "jedenfalls",
  "immerhin",
  "hingegen",
  "dagegen",
  "vielmehr",
  "nämlich",
  "zwar",
  "jedoch",
  "so", // cuando funciona como conector adverbial
  "dafür",
  "sogar",
  "zwischendurch",
  "sonst",
  "dazu",
];

export const CONJ_CORRELATIVE = {
  entweder: ["entweder", "oder"],
  weder: ["weder", "noch"],
  sowohl: ["sowohl", "als auch"],
  nichtNur: ["nicht nur", "sondern auch"],
};

export const BLOCKS_CONJUNCTIONS = {
  COORDINATING: CONJ_COORDINATING,
  SUBORDINATING: CONJ_SUBORDINATING,
  ADVERBIAL: CONJ_ADVERBIAL,
  CORRELATIVE: CONJ_CORRELATIVE,
};

export const CONJUNCTIONS = Array.from(new Set([...CONJ_COORDINATING, ...CONJ_SUBORDINATING, ...CONJ_ADVERBIAL, ...Object.values(CONJ_CORRELATIVE).flat()]));

// =====================
// Notas:
// - Koordinierend: no cambian orden (SVO normal).
// - Subordinierend: verbo al final de la subordinada.
// - Konjunktionaladverbien: se comportan como Adv. en posición 1 -> verbo en 2º.
// - Correlativas: suelen venir en pares, no son simples palabras aisladas.
// =====================
