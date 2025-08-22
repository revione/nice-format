// =============================================
// NÚMEROS EN ALEMÁN - Sistema completo
// =============================================

// =====================
// NÚMEROS CARDINALES (0-100)
// =====================
export const CARDINAL_NUMBERS = {
  // Números básicos 0-20
  basic: [
    "null",
    "eins",
    "zwei",
    "drei",
    "vier",
    "fünf",
    "sechs",
    "sieben",
    "acht",
    "neun",
    "zehn",
    "elf",
    "zwölf",
    "dreizehn",
    "vierzehn",
    "fünfzehn",
    "sechzehn",
    "siebzehn",
    "achtzehn",
    "neunzehn",
    "zwanzig",
  ],

  // Decenas
  tens: ["zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"],

  // Números grandes
  large: [
    "hundert",
    "tausend",
    "million",
    "milliarde",
    "billion", // alemán: mil millones
    "billiarde", // alemán: mil billones
    "trillion",
  ],
};

// =====================
// NÚMEROS ORDINALES
// =====================
export const ORDINAL_NUMBERS = {
  // Ordinales básicos (1º-20º)
  basic: [
    "erste",
    "zweite",
    "dritte",
    "vierte",
    "fünfte",
    "sechste",
    "siebte", // también "siebente"
    "achte",
    "neunte",
    "zehnte",
    "elfte",
    "zwölfte",
    "dreizehnte",
    "vierzehnte",
    "fünfzehnte",
    "sechzehnte",
    "siebzehnte",
    "achtzehnte",
    "neunzehnte",
    "zwanzigste",
  ],

  // Ordinales de decenas
  tens: ["zwanzigste", "dreißigste", "vierzigste", "fünfzigste", "sechzigste", "siebzigste", "achtzigste", "neunzigste"],

  // Ordinales grandes
  large: ["hundertste", "tausendste", "millionste"],

  // Formas alternativas
  alternatives: [
    "siebente", // alternativa a "siebte"
    "dritte", // ya incluido arriba, pero importante
  ],
};

// =====================
// NÚMEROS FRACCIONARIOS
// =====================
export const FRACTIONAL_NUMBERS = [
  "halb", // medio/media
  "halbe", // media (declinado)
  "halben", // medio (declinado)
  "halber", // medio (declinado)
  "halbes", // medio (declinado)
  "drittel", // tercio
  "viertel", // cuarto
  "fünftel", // quinto
  "sechstel", // sexto
  "siebtel", // séptimo
  "achtel", // octavo
  "neuntel", // noveno
  "zehntel", // décimo
  "hundertstel", // centésimo
  "tausendstel", // milésimo
];

// =====================
// NÚMEROS MULTIPLICATIVOS
// =====================
export const MULTIPLICATIVE_NUMBERS = [
  "einfach", // simple
  "zweifach", // doble
  "dreifach", // triple
  "vierfach", // cuádruple
  "fünffach", // quíntuple
  "sechsfach", // séxtuple
  "siebenfach", // séptuple
  "achtfach", // óctuple
  "neunfach", // nónuple
  "zehnfach", // décuple
  "hundertfach", // centuple
  "tausendfach", // miluple
  "mehrfach", // múltiple
  "vielfach", // múltiple/diverso
];

// =====================
// NÚMEROS DISTRIBUTIVOS Y FRECUENCIA
// =====================
export const DISTRIBUTIVE_NUMBERS = [
  "einzeln", // individual/uno por uno
  "paarweise", // de dos en dos
  "dreierweise", // de tres en tres
  "zu zweit", // de dos (phrase)
  "zu dritt", // de tres (phrase)
  "zu viert", // de cuatro (phrase)
];

export const FREQUENCY_NUMBERS = [
  "einmal", // una vez
  "zweimal", // dos veces
  "dreimal", // tres veces
  "viermal", // cuatro veces
  "fünfmal", // cinco veces
  "sechsmal", // seis veces
  "siebenmal", // siete veces
  "achtmal", // ocho veces
  "neunmal", // nueve veces
  "zehnmal", // diez veces
  "hundertmal", // cien veces
  "tausendmal", // mil veces
  "mehrmals", // varias veces
  "oftmals", // a menudo
  "manchmal", // a veces (ya está en adverbios, pero relacionado)
];

// =====================
// NÚMEROS ROMANOS (REGEX)
// =====================
export const ROMAN_NUMERAL_REGEX = /^(?=[ivxlcdm]+$)m{0,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/i;

// =====================
// NÚMEROS ARÁBIGOS (REGEX)
// =====================
export const ARABIC_NUMERAL_REGEX = /^\d+([.,]\d+)?$/;

// =====================
// PREFIJOS Y SUFIJOS NUMÉRICOS
// =====================
export const NUMERIC_PREFIXES = [
  "mono",
  "uni", // uno
  "bi",
  "di",
  "zwei", // dos
  "tri",
  "drei", // tres
  "tetra",
  "vier", // cuatro
  "penta",
  "fünf", // cinco
  "hexa",
  "sechs", // seis
  "hepta",
  "sieben", // siete
  "okta",
  "acht", // ocho
  "nona",
  "neun", // nueve
  "deka",
  "zehn", // diez
  "multi",
  "viel", // muchos
];

export const NUMERIC_SUFFIXES = [
  "fach", // veces (zweifach)
  "mal", // veces (zweimal)
  "tel", // fracciones (drittel)
  "ste", // ordinales (erste)
  "te", // ordinales (dritte)
  "zig", // números aproximados (zwanzig)
];

// =====================
// PALABRAS RELACIONADAS CON NÚMEROS
// =====================
export const NUMBER_RELATED_WORDS = [
  // Cantidades aproximadas
  "einige", // algunos
  "etliche", // varios
  "zahlreiche", // numerosos
  "unzählige", // incontables
  "dutzende", // docenas
  "hunderte", // cientos
  "tausende", // miles
  "millionen", // millones

  // Comparaciones numéricas
  "mehr", // más
  "weniger", // menos
  "gleich", // igual
  "doppelt", // doble
  "halb", // medio

  // Orden
  "letzte", // último
  "vorletzte", // penúltimo
  "nächste", // siguiente
  "übernächste", // el siguiente del siguiente

  // Medidas
  "paar", // par/pareja (ein paar = unos pocos)
  "dutzend", // docena
  "schock", // sesenta (medida antigua)
];

// =====================
// FUNCIONES UTILITARIAS
// =====================

/**
 * Convierte array a Set normalizado para búsqueda rápida
 */
const toNormalizedSet = (arr) => new Set(arr.map((w) => w.toLowerCase()));

// Sets normalizados para búsqueda rápida
export const SETS = {
  cardinals: toNormalizedSet([...CARDINAL_NUMBERS.basic, ...CARDINAL_NUMBERS.tens, ...CARDINAL_NUMBERS.large]),
  ordinals: toNormalizedSet([...ORDINAL_NUMBERS.basic, ...ORDINAL_NUMBERS.tens, ...ORDINAL_NUMBERS.large, ...ORDINAL_NUMBERS.alternatives]),
  fractionals: toNormalizedSet(FRACTIONAL_NUMBERS),
  multiplicatives: toNormalizedSet(MULTIPLICATIVE_NUMBERS),
  frequency: toNormalizedSet(FREQUENCY_NUMBERS),
  distributive: toNormalizedSet(DISTRIBUTIVE_NUMBERS),
  related: toNormalizedSet(NUMBER_RELATED_WORDS),
};

/**
 * Detecta si una palabra es un número cardinal
 * @param {string} word - palabra a verificar
 * @returns {boolean}
 */
export function isCardinalNumber(word) {
  return SETS.cardinals.has(word.toLowerCase());
}

/**
 * Detecta si una palabra es un número ordinal
 * @param {string} word - palabra a verificar
 * @returns {boolean}
 */
export function isOrdinalNumber(word) {
  return SETS.ordinals.has(word.toLowerCase());
}

/**
 * Detecta si una palabra es un número fraccionario
 * @param {string} word - palabra a verificar
 * @returns {boolean}
 */
export function isFractionalNumber(word) {
  return SETS.fractionals.has(word.toLowerCase());
}

/**
 * Detecta si una palabra es un número multiplicativo
 * @param {string} word - palabra a verificar
 * @returns {boolean}
 */
export function isMultiplicativeNumber(word) {
  return SETS.multiplicatives.has(word.toLowerCase());
}

/**
 * Detecta si una palabra es de frecuencia numérica
 * @param {string} word - palabra a verificar
 * @returns {boolean}
 */
export function isFrequencyNumber(word) {
  return SETS.frequency.has(word.toLowerCase());
}

/**
 * Detecta si una palabra está relacionada con números
 * @param {string} word - palabra a verificar
 * @returns {boolean}
 */
export function isNumberRelated(word) {
  return SETS.related.has(word.toLowerCase());
}

/**
 * Detecta si una palabra es un número arábigo
 * @param {string} word - palabra a verificar
 * @returns {boolean}
 */
export function isArabicNumeral(word) {
  return ARABIC_NUMERAL_REGEX.test(word);
}

/**
 * Detecta si una palabra es un número romano
 * @param {string} word - palabra a verificar
 * @returns {boolean}
 */
export function isRomanNumeral(word) {
  return ROMAN_NUMERAL_REGEX.test(word.toLowerCase());
}

/**
 * Función principal de detección de números
 * @param {string} word - palabra a verificar
 * @returns {Object} información sobre el número detectado
 */
export function detectNumber(word) {
  const normalized = word.toLowerCase();

  // Números arábigos
  if (isArabicNumeral(word)) {
    return {
      isNumber: true,
      type: "arabic",
      subtype: word.includes(".") || word.includes(",") ? "decimal" : "integer",
      confidence: 1.0,
    };
  }

  // Números romanos
  if (isRomanNumeral(word)) {
    return {
      isNumber: true,
      type: "roman",
      subtype: "integer",
      confidence: 0.95,
    };
  }

  // Números cardinales
  if (isCardinalNumber(word)) {
    return {
      isNumber: true,
      type: "cardinal",
      subtype: "word",
      confidence: 0.9,
    };
  }

  // Números ordinales
  if (isOrdinalNumber(word)) {
    return {
      isNumber: true,
      type: "ordinal",
      subtype: "word",
      confidence: 0.9,
    };
  }

  // Números fraccionarios
  if (isFractionalNumber(word)) {
    return {
      isNumber: true,
      type: "fractional",
      subtype: "word",
      confidence: 0.85,
    };
  }

  // Números multiplicativos
  if (isMultiplicativeNumber(word)) {
    return {
      isNumber: true,
      type: "multiplicative",
      subtype: "word",
      confidence: 0.8,
    };
  }

  // Números de frecuencia
  if (isFrequencyNumber(word)) {
    return {
      isNumber: true,
      type: "frequency",
      subtype: "word",
      confidence: 0.8,
    };
  }

  // Relacionado con números (pero no es número en sí)
  if (isNumberRelated(word)) {
    return {
      isNumber: false,
      type: "number-related",
      subtype: "quantifier",
      confidence: 0.7,
      note: "Related to numbers but not a number itself",
    };
  }

  return {
    isNumber: false,
    type: null,
    subtype: null,
    confidence: 0,
  };
}

/**
 * Obtiene todas las palabras numéricas como array plano
 * @returns {Array} array con todas las palabras numéricas
 */
export function getAllNumberWords() {
  return [
    ...CARDINAL_NUMBERS.basic,
    ...CARDINAL_NUMBERS.tens,
    ...CARDINAL_NUMBERS.large,
    ...ORDINAL_NUMBERS.basic,
    ...ORDINAL_NUMBERS.tens,
    ...ORDINAL_NUMBERS.large,
    ...ORDINAL_NUMBERS.alternatives,
    ...FRACTIONAL_NUMBERS,
    ...MULTIPLICATIVE_NUMBERS,
    ...FREQUENCY_NUMBERS,
    ...DISTRIBUTIVE_NUMBERS,
    ...NUMBER_RELATED_WORDS,
  ];
}

// =====================
// EXPORTS DE CONJUNTOS
// =====================
export const BLOCKS_NUMBERS = {
  CARDINAL: CARDINAL_NUMBERS,
  ORDINAL: ORDINAL_NUMBERS,
  FRACTIONAL: FRACTIONAL_NUMBERS,
  MULTIPLICATIVE: MULTIPLICATIVE_NUMBERS,
  FREQUENCY: FREQUENCY_NUMBERS,
  DISTRIBUTIVE: DISTRIBUTIVE_NUMBERS,
  RELATED: NUMBER_RELATED_WORDS,
};

// Array plano con todos los números
export const ALL_NUMBERS = getAllNumberWords();
