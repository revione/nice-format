import {
  ALL_CARDINALS,
  ALL_ORDINALS,
  ALL_FRACTIONS,
  ALL_MULTIPLICATIVE,
  ALL_COLLECTIVE,
  COLLECTIVE_PHRASES,
  ADJECTIVE_ENDINGS,
  MULTIPLICATIVE_ADJECTIVE_FORMS,
  NUMBERS_DATA,
} from "./lemmas/numbers.js";

const PATTERNS = {
  // Números decimales alemanes: 3,5 / 1.234,56 / 1234
  decimal: /^\d{1,3}(?:\.\d{3})*(?:,\d+)?$/,

  // Números ordinales con punto: 3. / 30. / 100.
  ordinalDot: /^\d+\.$/,

  // Números ordinales informales: 3te / 30te / 100ste
  ordinalInformal: /^\d+(?:te|ste)$/,

  // Fracciones con barra: 1/2 / 3/4 / 7/8
  fractionSlash: /^\d+\s*\/\s*\d+$/,

  // Números romanos: I, II, III, IV, V, X, etc.
  roman: /^(?=[IVXLCDM]+$)M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i,

  // Rangos: 10-20 / 5-10 / 100-200
  range: /^\d+[-–—]\d+$/,

  // Multiplicativos con números: 2x / 3x / 10x
  multiplicativeX: /^\d+x$/i,

  // Porcentajes: 50% / 3,5%
  percentage: /^\d+(?:,\d+)?%$/,

  // Entero simple: 123
  integer: /^\d+$/,

  // Hora HH:MM (10:30, 9:05)
  timeHHMM: /^\d{1,2}:\d{2}$/,

  // Hora HH.MM (10.30, 9.05)
  timeHHdotMM: /^\d{1,2}\.\d{2}$/,
};

// =====================================================
// FUNCIONES DE PARSING NUMÉRICO
// =====================================================

/**
 * Convierte números alemanes a valor numérico
 * 1.234,56 → 1234.56 / 3,5 → 3.5
 */
function parseGermanNumber(surface) {
  if (!PATTERNS.decimal.test(surface)) return null;

  // Reemplazar separadores alemanes: . para miles, , para decimales
  const normalized = surface.replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);

  return Number.isFinite(value) ? value : null;
}

/**
 * Convierte fracciones numéricas a valor decimal
 * 1/2 → 0.5 / 3/4 → 0.75
 */
function parseFraction(surface) {
  const match = surface.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!match) return null;

  const [, numerator, denominator] = match;
  const num = parseInt(numerator, 10);
  const den = parseInt(denominator, 10);

  if (den === 0) return null;
  return num / den;
}

/**
 * Convierte números romanos a arábigos
 * III → 3, IV → 4, IX → 9, etc.
 */
function parseRomanNumeral(surface) {
  const roman = surface.toUpperCase();
  if (!PATTERNS.roman.test(roman)) return null;

  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  let prevValue = 0;

  for (let i = roman.length - 1; i >= 0; i--) {
    const currentValue = values[roman[i]];
    if (currentValue < prevValue) {
      result -= currentValue;
    } else {
      result += currentValue;
    }
    prevValue = currentValue;
  }

  return result;
}

// =====================================================
// FUNCIONES DE DETECCIÓN DE FORMAS DECLINADAS
// =====================================================

/**
 * Quita terminaciones de adjetivos de una palabra
 * Para detectar ordinales declinados: zweiten → zweit
 */
function stripAdjectiveEnding(word) {
  const lower = word.toLowerCase();

  for (const ending of ADJECTIVE_ENDINGS) {
    if (lower.endsWith(ending) && lower.length > ending.length + 2) {
      return lower.slice(0, -ending.length);
    }
  }
  return lower;
}

/**
 * Encuentra el lemma de un ordinal desde una forma declinada
 * zweiten → zweite, ersten → erste, etc.
 */
function getOrdinalLemma(word) {
  const lower = word.toLowerCase();

  // Si ya está en la lista de ordinales, devolverlo
  if (ALL_ORDINALS.includes(lower)) {
    return { lemma: lower, isDeclined: false };
  }

  // Intentar quitar terminación de adjetivo
  const stem = stripAdjectiveEnding(lower);

  // Buscar la forma base (terminada en 'e')
  const baseForms = [stem + "e", stem + "te", stem + "ste"];

  for (const form of baseForms) {
    if (ALL_ORDINALS.includes(form)) {
      return { lemma: form, isDeclined: true };
    }
  }

  return null;
}

// =====================================================
// FUNCIONES DE VERIFICACIÓN POR TIPO
// =====================================================

/**
 * Verifica si una palabra es un cardinal
 */
function isCardinal(word) {
  return ALL_CARDINALS.includes(word.toLowerCase());
}

/**
 * Verifica si una palabra es un ordinal (incluyendo formas declinadas)
 */
function isOrdinal(word) {
  const result = getOrdinalLemma(word);
  return result !== null;
}

/**
 * Verifica si una palabra es una fracción
 */
function isFraction(word) {
  const lower = word.toLowerCase();
  return ALL_FRACTIONS.includes(lower) || ALL_FRACTIONS.includes(word);
}

/**
 * Verifica si una palabra es multiplicativa
 */
function isMultiplicative(word) {
  return ALL_MULTIPLICATIVE.includes(word.toLowerCase());
}

/**
 * Verifica si una palabra es colectiva
 */
function isCollective(word) {
  return ALL_COLLECTIVE.includes(word.toLowerCase());
}

/**
 * Verifica si una frase es un colectivo especial
 */
function isCollectivePhrase(words) {
  if (Array.isArray(words) && words.length === 2) {
    const phrase = words.join(" ").toLowerCase();
    return COLLECTIVE_PHRASES.includes(phrase);
  }
  return false;
}

// =====================================================
// FUNCIÓN PRINCIPAL DE DETECCIÓN
// =====================================================

/**
 * Detecta qué tipo de número es una palabra
 * Devuelve información completa sobre el número
 */
export function detectNumber(word, context = {}) {
  const result = {
    isNumber: false,
    type: null,
    subtype: null,
    lemma: null,
    value: null,
    isDeclined: false,
    confidence: 0,
  };

  const lower = word.toLowerCase();

  // =====================================================
  // PATRONES NUMÉRICOS (REGEX)
  // =====================================================

  // Hora HH:MM
  if (PATTERNS.timeHHMM.test(lower)) {
    const [hh, mm] = lower.split(":").map((n) => parseInt(n, 10));
    if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
      result.isNumber = true;
      result.type = "time";
      result.subtype = "clock";
      result.lemma = `${hh}:${String(mm).padStart(2, "0")}`;
      result.value = { hours: hh, minutes: mm };
      result.confidence = 0.96;
      return result;
    }
  }

  // Hora HH.MM
  if (PATTERNS.timeHHdotMM.test(lower)) {
    const [hh, mm] = lower.split(".").map((n) => parseInt(n, 10));
    if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
      result.isNumber = true;
      result.type = "time";
      result.subtype = "clock";
      result.lemma = `${hh}.${String(mm).padStart(2, "0")}`;
      result.value = { hours: hh, minutes: mm };
      result.confidence = 0.96;
      return result;
    }
  }

  // Números decimales alemanes: 3,5 / 1.234,56
  if (PATTERNS.decimal.test(word)) {
    const value = parseGermanNumber(word);

    if (value !== null) {
      result.isNumber = true;
      result.type = "cardinal";
      result.subtype = "decimal";
      result.value = value;
      result.confidence = 0.98;
      return result;
    }
  }

  // Ordinales con punto: 30. / 100.
  if (PATTERNS.ordinalDot.test(word)) {
    const value = parseInt(word.slice(0, -1), 10);
    result.isNumber = true;
    result.type = "ordinal";
    result.subtype = "numeric_dot";
    result.value = value;
    result.confidence = 0.95;
    return result;
  }

  // Ordinales informales: 30te / 100ste
  if (PATTERNS.ordinalInformal.test(lower)) {
    const numPart = lower.replace(/(te|ste)$/, "");
    const value = parseInt(numPart, 10);
    result.isNumber = true;
    result.type = "ordinal";
    result.subtype = "numeric_informal";
    result.value = value;
    result.confidence = 0.9;
    return result;
  }

  // Fracciones con barra: 1/2 / 3/4
  if (PATTERNS.fractionSlash.test(word)) {
    const value = parseFraction(word);
    if (value !== null) {
      result.isNumber = true;
      result.type = "fraction";
      result.subtype = "slash";
      result.value = value;
      result.confidence = 0.95;
      return result;
    }
  }

  // Números romanos: I, II, III, IV, V, etc.
  if (PATTERNS.roman.test(word.toUpperCase())) {
    const value = parseRomanNumeral(word);
    result.isNumber = true;
    result.type = "cardinal";
    result.subtype = "roman";
    result.value = value;
    result.confidence = 0.9;
    return result;
  }

  // Porcentajes: 50% / 3,5%
  if (PATTERNS.percentage.test(word)) {
    const numPart = word.slice(0, -1);
    const value = parseGermanNumber(numPart);
    result.isNumber = true;
    result.type = "percentage";
    result.subtype = "numeric";
    result.value = value;
    result.confidence = 0.95;
    return result;
  }

  // Entero simple: 123 (cardinal)
  if (PATTERNS.integer.test(word)) {
    const value = parseInt(word, 10);
    result.isNumber = true;
    result.type = "cardinal";
    result.subtype = "integer";
    result.value = value;
    result.lemma = lower;
    result.confidence = 0.9;
    return result;
  }

  // Rangos: 10-20 / 5-10
  if (PATTERNS.range.test(word)) {
    const [start, end] = word.split(/[-–—]/).map((n) => parseInt(n.trim(), 10));
    result.isNumber = true;
    result.type = "range";
    result.subtype = "numeric";
    result.value = { start, end };
    result.confidence = 0.85;
    return result;
  }

  // =====================================================
  // NÚMEROS LEXICALES (PALABRAS)
  // =====================================================

  // Cardinales
  if (isCardinal(word)) {
    result.isNumber = true;
    result.type = "cardinal";
    result.subtype = "word";
    result.lemma = lower;
    result.confidence = 0.95;
    return result;
  }

  // Ordinales (incluyendo formas declinadas)
  if (isOrdinal(word)) {
    const ordinalInfo = getOrdinalLemma(word);
    result.isNumber = true;
    result.type = "ordinal";
    result.subtype = "word";
    result.lemma = ordinalInfo.lemma;
    result.isDeclined = ordinalInfo.isDeclined;
    result.confidence = 0.9;
    return result;
  }

  // Fracciones
  if (isFraction(word)) {
    result.isNumber = true;
    result.type = "fraction";
    result.subtype = "word";
    result.lemma = lower;
    result.confidence = 0.9;
    return result;
  }

  // Multiplicativos
  if (isMultiplicative(word)) {
    result.isNumber = true;
    result.type = "multiplicative";
    result.subtype = MULTIPLICATIVE_ADJECTIVE_FORMS.includes(lower) ? "adjective" : "adverb";
    result.lemma = lower;
    result.confidence = 0.85;
    return result;
  }

  // Colectivos
  if (isCollective(word)) {
    result.isNumber = true;
    result.type = "collective";
    result.subtype = "word";
    result.lemma = lower;
    result.confidence = 0.8;
    return result;
  }

  return result;
}

// =====================================================
// TOKENIZADOR MEJORADO
// =====================================================

/**
 * Tokeniza una oración preservando información de posición
 * Maneja mejor los números alemanes y frases especiales
 */
function tokenize(sentence) {
  const tokens = [];

  // Regex mejorado que captura:
  // - Palabras con guiones: einundzwanzig
  // - Números alemanes: 1.234,56
  // - Fracciones: 1/2
  // - Ordinales: 30.
  // - Porcentajes: 50%
  // - Rangos: 10-20
  const regex = new RegExp(
    String.raw`
      [A-Za-zÄÖÜäöüß]+(?:-[A-Za-zÄÖÜäöüß]+)*|      # palabras (con guiones)
      \d{1,2}:\d{2}|                               # HH:MM
      \d+(?:\.\d{3})*(?:,\d+)?%?|                  # 1.234,56  o  50%
      \d+\.|                                       # 30.
      \d+\/\d+|                                    # 1/2
      \d+[-–—]\d+|                                 # 10-20
      \d+|                                         # entero
      [^\s]                                        # símbolo suelto
    `,
    "g"
  );

  let match;
  while ((match = regex.exec(sentence)) !== null) {
    tokens.push({
      surface: match[0],
      lower: match[0].toLowerCase(),
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return tokens;
}

// =====================================================
// RECONOCEDOR PRINCIPAL PARA ORACIONES
// =====================================================

/**
 * Reconoce números en una oración alemana
 * Devuelve tokens y entidades numéricas encontradas
 */
export function recognizeNumbersInSentence(sentence) {
  const tokens = tokenize(sentence);
  const numbers = [];
  const consumed = new Array(tokens.length).fill(false);

  /**
   * Marca tokens como consumidos y crea una entidad numérica
   */
  const markAsNumber = (tokenStart, tokenEnd, payload) => {
    const charStart = tokens[tokenStart].start;
    const charEnd = tokens[tokenEnd].end;
    const surface = sentence.slice(charStart, charEnd);

    numbers.push({
      ...payload,
      surface,
      spanChar: [charStart, charEnd],
      spanToken: [tokenStart, tokenEnd],
    });

    // Marcar tokens como consumidos
    for (let i = tokenStart; i <= tokenEnd; i++) {
      consumed[i] = true;
    }
  };

  // =====================================================
  // PROCESAMIENTO TOKEN POR TOKEN
  // =====================================================

  for (let i = 0; i < tokens.length; i++) {
    if (consumed[i]) continue;

    const token = tokens[i];
    const nextToken = tokens[i + 1];

    // =====================================================
    // FRASES MULTI-TOKEN
    // =====================================================

    // "ein paar" - colectivo especial
    if (token.lower === "ein" && nextToken && nextToken.lower === "paar") {
      markAsNumber(i, i + 1, {
        type: "collective",
        subtype: "phrase",
        lemma: "ein paar",
        confidence: 0.95,
      });
      continue;
    }

    // =====================================================
    // DETECCIÓN USANDO LA FUNCIÓN detectNumber
    // =====================================================

    const numberResult = detectNumber(token.surface, {
      tokens: tokens,
      currentIndex: i,
      sentence: sentence,
    });

    if (numberResult.isNumber) {
      markAsNumber(i, i, {
        type: numberResult.type,
        subtype: numberResult.subtype,
        lemma: numberResult.lemma,
        value: numberResult.value,
        isDeclined: numberResult.isDeclined,
        confidence: numberResult.confidence,
      });
    }
  }

  return { tokens, numbers };
}

// =====================================================
// FUNCIONES DE INTEGRACIÓN CON SISTEMA EXISTENTE
// =====================================================

/**
 * Integra la detección de números con el sistema identifyWord
 * Devuelve información compatible con tu sistema existente
 */
export function identifyNumberWord(word, opts = {}) {
  const result = detectNumber(word, opts);

  if (result.isNumber) {
    return {
      type: "number",
      rule: `number-${result.type}-${result.subtype}`,
      confidence: result.confidence,
      numberInfo: {
        numberType: result.type,
        subtype: result.subtype,
        lemma: result.lemma,
        value: result.value,
        isDeclined: result.isDeclined || false,
      },
    };
  }

  return null;
}

/**
 * Versión simple para verificar si una palabra es número
 */
export function isNumber(word) {
  const result = detectNumber(word);
  return result.isNumber;
}

/**
 * Obtiene información completa sobre un número
 */
export function getNumberInfo(word, context = {}) {
  return detectNumber(word, context);
}

/**
 * Verifica si una palabra es de un tipo específico de número
 */
export function isNumberOfType(word, type) {
  const result = detectNumber(word);
  return result.isNumber && result.type === type;
}

// =====================================================
// FUNCIONES DE UTILIDAD PARA ANÁLISIS
// =====================================================

/**
 * Obtiene todas las palabras numéricas de un texto
 */
export function extractNumbersFromText(text) {
  const result = recognizeNumbersInSentence(text);
  return result.numbers;
}

/**
 * Cuenta cuántos números hay en un texto por tipo
 */
export function countNumbersByType(text) {
  const numbers = extractNumbersFromText(text);
  const counts = {
    cardinal: 0,
    ordinal: 0,
    fraction: 0,
    multiplicative: 0,
    collective: 0,
    percentage: 0,
    range: 0,
    total: 0,
  };

  numbers.forEach((num) => {
    if (counts.hasOwnProperty(num.type)) {
      counts[num.type]++;
    }
    counts.total++;
  });

  return counts;
}

/**
 * Obtiene estadísticas sobre el reconocimiento de números
 */
export function getRecognitionStats() {
  return {
    totalWordsInDatabase: NUMBERS_DATA.stats.total,
    supportedTypes: ["cardinal", "ordinal", "fraction", "multiplicative", "collective"],
    supportedPatterns: Object.keys(PATTERNS),
    canHandleDeclinedForms: true,
    canHandleMultiWordPhrases: true,
  };
}

// =====================================================
// EXPORT PRINCIPAL
// =====================================================

export default {
  // Funciones principales
  detectNumber,
  recognizeNumbersInSentence,
  identifyNumberWord,
  isNumber,
  getNumberInfo,
  isNumberOfType,

  // Funciones de análisis
  extractNumbersFromText,
  countNumbersByType,
  getRecognitionStats,

  // Funciones de verificación específica
  isCardinal,
  isOrdinal,
  isFraction,
  isMultiplicative,
  isCollective,
  isCollectivePhrase,

  // Estadísticas
  stats: getRecognitionStats(),
};

// =====================================================
// EJEMPLOS Y PRUEBAS DE DESARROLLO
// =====================================================

const testNumberRecognizer = () => {
  console.log("=== TESTING GERMAN NUMBER RECOGNIZER ===");

  // Ejemplo 1: Números básicos
  const result1 = recognizeNumbersInSentence("Er gewann den 3. und den einundzwanzigsten Platz.");
  console.log("Ejemplo 1:", result1.numbers);

  // Ejemplo 2: Fracciones y colectivos
  const result2 = recognizeNumbersInSentence("Wir brauchen ein paar Minuten und 1/2 Liter.");
  console.log("Ejemplo 2:", result2.numbers);

  // Ejemplo 3: Decimales alemanes
  const result3 = recognizeNumbersInSentence("Die zweite Chance kam nach 3,5 Tagen.");
  console.log("Ejemplo 3:", result3.numbers);

  // Ejemplo 4: Tu texto específico
  const result4 = recognizeNumbersInSentence("die 30. Datei sortieren und die zweite Serie ergänzen");
  console.log("Ejemplo 4:", result4.numbers);

  // Ejemplo 5: Ordinales declinados
  const result5 = recognizeNumbersInSentence("zum zweiten Mal in dieser Woche");
  console.log("Ejemplo 5:", result5.numbers);

  // Prueba de integración con identifyWord
  console.log("\nPruebas de integración:");
  const testWords = ["dreißig", "3,5", "zweiten", "30.", "hundertste", "III", "beide"];

  testWords.forEach((word) => {
    const result = identifyNumberWord(word);
    console.log(`${word}: ${result ? `${result.type} (${result.numberInfo.numberType})` : "no es número"}`);
  });

  // Estadísticas
  console.log("\nEstadísticas:", getRecognitionStats());
};

// testNumberRecognizer();
