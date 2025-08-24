// superlatives.js
// Fuente de verdad: comparativos/superlativos especiales

/** Supletivos verdaderos (comparativo “de otra raíz”). */
export const SUPPLETIVE_COMPARATIVES = {
  gut: "besser",
  viel: "mehr",
  gern: "lieber",
  wenig: "weniger",
};

/** Supletivos verdaderos (superlativo “de otra raíz”). */
export const SUPPLETIVE_SUPERLATIVES = {
  gut: "best",
  viel: "meist",
  gern: "liebst",
  wenig: "weniger",
  wenig: "wenigst",
};

/** Irregulares NO supletivos (cambios de tema). */
export const IRREGULAR_COMPARATIVES = {
  nah: "näher",
  hoch: "höher", // pierde -ch en el tema
};

export const IRREGULAR_SUPERLATIVES = {
  nah: "nächst",
  hoch: "höchst",
};

// ---------- Generadores de mapas inversos (forma -> base) ----------
const invert = (obj) => Object.fromEntries(Object.entries(obj).map(([base, form]) => [form, base]));

// Inversos separados por tipo (útil para el detector)
export const REVERSE_SUPPLETIVE_COMPARATIVES = invert(SUPPLETIVE_COMPARATIVES);
export const REVERSE_SUPPLETIVE_SUPERLATIVES = invert(SUPPLETIVE_SUPERLATIVES);
export const REVERSE_IRREGULAR_COMPARATIVES = invert(IRREGULAR_COMPARATIVES);
export const REVERSE_IRREGULAR_SUPERLATIVES = invert(IRREGULAR_SUPERLATIVES);

// Inversos unificados (si prefieres usar uno solo por grado)
export const REVERSE_COMPARATIVES = {
  ...REVERSE_SUPPLETIVE_COMPARATIVES,
  ...REVERSE_IRREGULAR_COMPARATIVES,
};

export const REVERSE_SUPERLATIVES = {
  ...REVERSE_SUPPLETIVE_SUPERLATIVES,
  ...REVERSE_IRREGULAR_SUPERLATIVES,
};
