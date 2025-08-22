// =====================
// Helpers y utilidades
// =====================
const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean);

// Orden por caso: nominativ / akkusativ / dativ / genitiv
// Cada array por caso va en orden de género: [Masc, Fem, Neut, Plural]

// ---- Paradigma ein- (ein/kein/posesivos) ----
// Devuelve bloques por caso con orden M/F/N/Pl (Pl vacío si includePlural=false)
// euer -> eur- antes de terminación
const stemAdjust = (s) => (s === "euer" ? "eur" : s);

/**
 * Construye bloques por caso para un único "stem" del paradigma ein-
 * @param {string} stem p.ej. "ein", "kein", "mein", "Ihr"
 * @param {boolean} includePlural si true, llena plural; si false, plural vacío (como "ein")
 */
function buildEinBlocks(stem, includePlural = true) {
  const s = stemAdjust(stem);
  return {
    nominativ: [s, s + "e", s, includePlural ? s + "e" : ""],
    akkusativ: [s + "en", s + "e", s, includePlural ? s + "e" : ""],
    dativ: [s + "em", s + "er", s + "em", includePlural ? s + "en" : ""],
    genitiv: [s + "es", s + "er", s + "es", includePlural ? s + "er" : ""],
  };
}

/**
 * Fusiona varios bloques ein- (p.ej. todos los posesivos) en uno solo por caso,
 * concatenando todas las formas y eliminando duplicados.
 */
function mergeEinBlocks(stems, includePlural = true) {
  const acc = { nominativ: [], akkusativ: [], dativ: [], genitiv: [] };
  for (const st of stems) {
    const b = buildEinBlocks(st, includePlural);
    for (const k of Object.keys(acc)) acc[k].push(...b[k]);
  }
  for (const k of Object.keys(acc)) acc[k] = uniq(acc[k]);
  return acc;
}

// ---- Paradigma der- (dieser/jener/jeder/welcher/solcher/mancher) ----
// Tabla base de terminaciones por caso/género para el tipo der-
const DER_ENDINGS = {
  nominativ: ["er", "e", "es", "e"],
  akkusativ: ["en", "e", "es", "e"],
  dativ: ["em", "er", "em", "en"],
  genitiv: ["es", "er", "es", "er"],
};

/**
 * Construye bloques por caso para un "stem" der- (p.ej. "dies", "jed", "welch")
 */
function buildDerBlocks(stem) {
  const out = {};
  for (const kase of Object.keys(DER_ENDINGS)) {
    out[kase] = DER_ENDINGS[kase].map((end) => stem + end);
  }
  return out;
}

/**
 * Fusiona varios stems der- en un solo bloque por caso.
 */
function mergeDerBlocks(stems) {
  const acc = { nominativ: [], akkusativ: [], dativ: [], genitiv: [] };
  for (const st of stems) {
    const b = buildDerBlocks(st);
    for (const k of Object.keys(acc)) acc[k].push(...b[k]);
  }
  for (const k of Object.keys(acc)) acc[k] = uniq(acc[k]);
  return acc;
}

// ---- Cuantificadores (plural) ----
// Usamos la pauta común en plural: Nom/Akk = base; Dat = base + "n"; Gen = base + "r"
// (p.ej. alle → allen/aller; viele → vielen/vieler; mehrere → mehreren/mehrerer; etc.)
function buildPluralQuantifierBlocks(basePluralForm) {
  return {
    nominativ: ["", "", "", basePluralForm],
    akkusativ: ["", "", "", basePluralForm],
    dativ: ["", "", "", basePluralForm + "n"],
    genitiv: ["", "", "", basePluralForm + "r"],
  };
}
function mergePluralQuantifiers(bases) {
  const acc = { nominativ: [], akkusativ: [], dativ: [], genitiv: [] };
  for (const base of bases) {
    const b = buildPluralQuantifierBlocks(base);
    for (const k of Object.keys(acc)) acc[k].push(...b[k]);
  }
  for (const k of Object.keys(acc)) acc[k] = uniq(acc[k]);
  return acc;
}

// =======================================
// BLOQUES CONCRETOS (completando "todo")
// =======================================

// 1) Definidos (der/die/das)
export const BLOCKS_DEFINITE = {
  nominativ: ["der", "die", "das", "die"],
  akkusativ: ["den", "die", "das", "die"],
  dativ: ["dem", "der", "dem", "den"],
  genitiv: ["des", "der", "des", "der"],
};
export const DEFINITE = uniq(Object.values(BLOCKS_DEFINITE).flat());

// 2) Indefinidos (ein) — sin plural
export const BLOCKS_INDEFINITE = buildEinBlocks("ein", false);
export const INDEFINITE = uniq(Object.values(BLOCKS_INDEFINITE).flat());

// 3) Negación (kein) — con plural
export const BLOCKS_NEGATIVE = buildEinBlocks("kein", true);
export const NEGATIVE = uniq(Object.values(BLOCKS_NEGATIVE).flat());

// 4) Posesivos (paradigma ein- con plural): mein, dein, sein, ihr, unser, euer, Ihr
export const BLOCKS_POSSESSIVES = mergeEinBlocks(["mein", "dein", "sein", "ihr", "unser", "euer", "Ihr"], true);
export const POSSESSIVES = uniq(Object.values(BLOCKS_POSSESSIVES).flat());

// 5) Determinantes tipo der-: dieser, jener, jeder, welcher, solcher, mancher
// Stems: dies-, jen-, jed-, welch-, solch-, manch-
export const BLOCKS_DER_PARADIGM = mergeDerBlocks(["dies", "jen", "jed", "welch", "solch", "manch"]);
export const DER_PARADIGM = uniq(Object.values(BLOCKS_DER_PARADIGM).flat());

// 6) Cuantificadores frecuentes (plural): alle, beide, einige, mehrere, viele, wenige, sämtliche, zahlreiche, etliche
export const BLOCKS_QUANTIFIERS = mergePluralQuantifiers(["alle", "beide", "einige", "mehrere", "viele", "wenige", "sämtliche", "zahlreiche", "etliche"]);
export const QUANTIFIERS = uniq(Object.values(BLOCKS_QUANTIFIERS).flat());

// 7) Contracciones (prep + artículo) — lexicalizadas, sin distinción de caso aquí
export const BLOCKS_CONTRACTIONS = {
  // + dem
  dem: ["am", "beim", "im", "vom", "zum", "hinterm", "überm", "unterm", "vorm"],
  // + das
  das: ["ans", "ins", "aufs", "durchs", "fürs", "ums", "übers", "unters", "hinters", "vors"],
  // + der
  der: ["zur"],
};
export const CONTRACTIONS = uniq(Object.values(BLOCKS_CONTRACTIONS).flat());

// =====================
// CONJUNTO COMPLETO PARA DETECCIÓN DE CONTEXTO
// =====================

// Artículos y determinantes (para detección de contexto nominal)
// Incluye todas las formas que pueden aparecer antes de un sustantivo
export const ARTICLES_AND_DETERMINANTS = uniq([...DEFINITE, ...INDEFINITE, ...NEGATIVE, ...POSSESSIVES, ...DER_PARADIGM, ...QUANTIFIERS, "solche", "manche", "welche", "diese", "jene"]);

// =====================
// EXPORTS DE CONJUNTO
// =====================
export const BLOCKS = {
  DEFINITE: BLOCKS_DEFINITE,
  INDEFINITE: BLOCKS_INDEFINITE,
  NEGATIVE: BLOCKS_NEGATIVE,
  POSSESSIVES: BLOCKS_POSSESSIVES,
  DER_PARADIGM: BLOCKS_DER_PARADIGM,
  QUANTIFIERS: BLOCKS_QUANTIFIERS,
  CONTRACTIONS: BLOCKS_CONTRACTIONS,
};

export const ARTICLES = uniq([...DEFINITE, ...INDEFINITE, ...NEGATIVE, ...POSSESSIVES, ...DER_PARADIGM, ...QUANTIFIERS, ...CONTRACTIONS]);
