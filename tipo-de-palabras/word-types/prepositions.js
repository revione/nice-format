// =====================
// PREPOSICIONES en alemán
// Organización por caso y comportamiento
// =====================

const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean);

// ---- 1) Rigen ACUSATIVO (siempre Akkusativ) ----
// Núcleo: movimiento/afectación del recorrido/objeto
export const PREP_AKK = [
  "durch",
  "für",
  "gegen",
  "ohne",
  "um",
  "bis", // a menudo sin artículo: "bis Montag"; con otra prep: "bis zu", "bis nach"
  "wider", // más formal/rarísima, ~contra
  "per", // préstamo: per Mail, per Post
  "pro", // en expresiones de tasa: pro Kopf
  "je", // distributivo: je Stunde, je Person
];

// ---- 2) Rigen DATIVO (siempre Dativ) ----
// Núcleo: estático/situación, compañía, instrumento, procedencia cercana, destino “a” (zu)
export const PREP_DAT = [
  "aus",
  "bei",
  "mit",
  "nach",
  "seit",
  "von",
  "zu",
  "ab", // temporal: ab nächster Woche
  "außer",
  "entgegen", // dativo; sentido “en contra de”
  "entsprechend",
  "gemäß",
  "nahe", // dativo en uso moderno: nahe dem Bahnhof
  "gegenüber", // normalmente pospuesta: dem Haus gegenüber
  "zufolge", // pospuesta: dem Bericht zufolge
];

// ---- 3) Rigen GENITIVO (siempre Genitiv) ----
// Muy frecuentes en registro formal/escrito
export const PREP_GEN = [
  "während",
  "trotz",
  "wegen", // en coloquial puede ir con Dat., aquí canonical Gen.
  "statt",
  "anstatt",
  "außerhalb",
  "innerhalb",
  "oberhalb",
  "unterhalb",
  "diesseits",
  "jenseits",
  "beiderseits",
  "abseits",
  "anlässlich",
  "angesichts",
  "aufgrund",
  "infolge",
  "hinsichtlich",
  "bezüglich",
  "mittels",
  "kraft",
  "mangels",
  "zwecks",
  "laut", // Gen o Dat: ver MIXTAS
  "dank", // Gen o Dat: ver MIXTAS
  "namens",
  "seitens",
  "unweit",
  "inmitten",
  "längs",
  "zugunsten",
];

// ---- 4) Wechselpräpositionen (Akk/Dat según movimiento vs. ubicación) ----
// Akk = destino/dirección (“Wohin?”), Dat = ubicación (“Wo?”)
export const PREP_TWO_WAY = ["an", "auf", "hinter", "in", "neben", "über", "unter", "vor", "zwischen"];

// ---- 5) Mixtas / variación de caso por uso/registro ----
// - “wegen”, “trotz”, “während”, “laut”, “dank” → Gen (estándar), Dat en coloquial/legal.
// - “entlang” puede ir prepuesta (rara, Gen) o pospuesta (muy común, Akk/Dat).
export const PREP_MIX = {
  dat_or_gen: ["wegen", "trotz", "während", "laut", "dank"],
  // “entlang”: lo tratamos aparte por su colocación
};

// ---- 6) Posposiciones / colocación especial ----
export const PREP_POSTPOSITION = {
  // Normalmente POSPUESTAS al sintagma
  dativ: ["gegenüber", "zufolge"], // dem Plan gegenüber / dem Bericht zufolge
  // “entlang”: muy común pospuesta con Akk (den Fluss entlang) o Dat (dem Fluss entlang);
  // prepuesta es culta/poética con Gen (entlang des Flusses).
  variable: ["entlang"],
};

// ---- 7) Contracciones (Prep + Artikel) útiles para parsing léxico ----
export const PREP_CONTRACTIONS = {
  // + dem
  dem: ["am", "beim", "im", "vom", "zum", "hinterm", "überm", "unterm", "vorm"],
  // + das
  das: ["ans", "ins", "aufs", "durchs", "fürs", "ums", "übers", "unters", "hinters", "vors"],
  // + der
  der: ["zur"],
};

// ---- 8) Multi-palabra frecuentes (opcionales, pero útiles) ----
// Incluye perífrasis que combinan “bis” con otra prep. o sustantivos lexicalizados.
export const PREP_MULTIWORD = [
  "bis zu",
  "bis nach",
  "bis an",
  "bis in",
  "bis auf",
  // Locuciones nominalizadas frecuentes en textos administrativos:
  "im Zuge", // de “Zug” (sust.) → con Dat por la contracción
  "im Rahmen",
  "im Hinblick auf",
  "in Bezug auf",
];

// =====================
// EXPORTS DE CONJUNTO
// =====================
export const BLOCKS_PREPOSITIONS = {
  AKK: PREP_AKK,
  DAT: PREP_DAT,
  GEN: PREP_GEN,
  TWO_WAY: PREP_TWO_WAY,
  MIX: PREP_MIX,
  POSTPOSITION: PREP_POSTPOSITION,
  CONTRACTIONS: PREP_CONTRACTIONS,
  MULTIWORD: PREP_MULTIWORD,
};

// Conjunto plano (solo entradas “simples” de una palabra, sin duplicar las multiword ni claves especiales)
export const PREPOSITIONS = uniq([
  ...PREP_AKK,
  ...PREP_DAT,
  ...PREP_GEN,
  ...PREP_TWO_WAY,
  ...PREP_CONTRACTIONS.dem,
  ...PREP_CONTRACTIONS.das,
  ...PREP_CONTRACTIONS.der,
  // No incluimos aquí las multiword ni las categorías “MIX/POSTPOSITION” (son metadatos)
]);

// =====================
// Notas rápidas y pautas
// =====================
// - Wechselpräpositionen → Akk (dirección: “Wohin?”) vs. Dat (ubicación: “Wo?”).
//   Ej.: in die Stadt (Akk) vs. in der Stadt (Dat).
// - “wegen/trotz/während/laut/dank” → Gen estándar; Dat en coloquial/administrativo (añádelo si quieres tolerancia).
// - “entlang” → pospuesta con Akk/Dat (“den Weg entlang / dem Weg entlang”); prepuesta con Gen (formal).
// - “gegenüber” y “zufolge” → casi siempre pospuestas al SN: “dem Kind gegenüber”, “dem Bericht zufolge”.
// - “bis” suele ir sin artículo (bis Montag) o con otra prep.: “bis zu”, “bis nach”.
// - Las contracciones están aquí para que el parser identifique tokens ya fusionados (am, im, zum, etc.).
