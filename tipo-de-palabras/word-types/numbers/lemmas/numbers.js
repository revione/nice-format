// =====================================================
// DATOS ESTÁTICOS DE NÚMEROS ALEMANES
// word-types/numbers/lemmas/numbers.js
// Solo arrays de lemmas y datos - Sin lógica
// =====================================================

// =====================================================
// CARDINALES - Determinantes (no adjetivos)
// =====================================================

export const CARDINALS_BASIC = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"];

export const CARDINALS_TEENS = ["dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn"];

export const CARDINALS_TENS = ["zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];

export const CARDINALS_HUNDREDS = ["hundert", "tausend"];

export const CARDINALS_BIG = ["Million", "Milliarde", "Billion", "Billiarde", "Trillion"];

// Números compuestos frecuentes (21-99)
export const CARDINALS_COMPOUND = [
  // 21-29
  "einundzwanzig",
  "zweiundzwanzig",
  "dreiundzwanzig",
  "vierundzwanzig",
  "fünfundzwanzig",
  "sechsundzwanzig",
  "siebenundzwanzig",
  "achtundzwanzig",
  "neunundzwanzig",

  // 31-39
  "einunddreißig",
  "zweiunddreißig",
  "dreiunddreißig",
  "vierunddreißig",
  "fünfunddreißig",
  "sechsunddreißig",
  "siebenunddreißig",
  "achtunddreißig",
  "neununddreißig",

  // 41-49
  "einundvierzig",
  "zweiundvierzig",
  "dreiundvierzig",
  "vierundvierzig",
  "fünfundvierzig",
  "sechsundvierzig",
  "siebenundvierzig",
  "achtundvierzig",
  "neunundvierzig",

  // 51-59
  "einundfünfzig",
  "zweiundfünfzig",
  "dreiundfünfzig",
  "vierundfünfzig",
  "fünfundfünfzig",
  "sechsundfünfzig",
  "siebenundfünfzig",
  "achtundfünfzig",
  "neunundfünfzig",

  // 61-69
  "einundsechzig",
  "zweiundsechzig",
  "dreiundsechzig",
  "vierundsechzig",
  "fünfundsechzig",
  "sechsundsechzig",
  "siebenundsechzig",
  "achtundsechzig",
  "neunundsechzig",

  // 71-79
  "einundsiebzig",
  "zweiundsiebzig",
  "dreiundsiebzig",
  "vierundsiebzig",
  "fünfundsiebzig",
  "sechsundsiebzig",
  "siebenundsiebzig",
  "achtundsiebzig",
  "neunundsiebzig",

  // 81-89
  "einundachtzig",
  "zweiundachtzig",
  "dreiundachtzig",
  "vierundachtzig",
  "fünfundachtzig",
  "sechsundachtzig",
  "siebenundachtzig",
  "achtundachtzig",
  "neunundachtzig",

  // 91-99
  "einundneunzig",
  "zweiundneunzig",
  "dreiundneunzig",
  "vierundneunzig",
  "fünfundneunzig",
  "sechsundneunzig",
  "siebenundneunzig",
  "achtundneunzig",
  "neunundneunzig",
];

// Centenas compuestas
export const CARDINALS_HUNDREDS_COMPOUND = ["einhundert", "zweihundert", "dreihundert", "vierhundert", "fünfhundert", "sechshundert", "siebenhundert", "achthundert", "neunhundert"];

// Miles compuestos
export const CARDINALS_THOUSANDS = ["eintausend", "zweitausend", "dreitausend", "viertausend", "fünftausend", "sechstausend", "siebentausend", "achttausend", "neuntausend"];

// Array completo de cardinales
export const ALL_CARDINALS = [
  ...CARDINALS_BASIC,
  ...CARDINALS_TEENS,
  ...CARDINALS_TENS,
  ...CARDINALS_HUNDREDS,
  ...CARDINALS_BIG,
  ...CARDINALS_COMPOUND,
  ...CARDINALS_HUNDREDS_COMPOUND,
  ...CARDINALS_THOUSANDS,
];

// =====================================================
// ORDINALES - Adjetivos en uso real
// =====================================================

export const ORDINALS_BASIC = ["erste", "zweite", "dritte", "vierte", "fünfte", "sechste", "siebte", "achte", "neunte", "zehnte", "elfte", "zwölfte"];

export const ORDINALS_TEENS = ["dreizehnte", "vierzehnte", "fünfzehnte", "sechzehnte", "siebzehnte", "achtzehnte", "neunzehnte"];

export const ORDINALS_TENS = ["zwanzigste", "dreißigste", "vierzigste", "fünfzigste", "sechzigste", "siebzigste", "achtzigste", "neunzigste"];

export const ORDINALS_HUNDREDS = ["hundertste", "tausendste"];

// Ordinales compuestos (21ª, 22ª, etc.)
export const ORDINALS_COMPOUND = [
  // 21ª-29ª
  "einundzwanzigste",
  "zweiundzwanzigste",
  "dreiundzwanzigste",
  "vierundzwanzigste",
  "fünfundzwanzigste",
  "sechsundzwanzigste",
  "siebenundzwanzigste",
  "achtundzwanzigste",
  "neunundzwanzigste",

  // 31ª-39ª
  "einunddreißigste",
  "zweiunddreißigste",
  "dreiunddreißigste",
  "vierunddreißigste",
  "fünfunddreißigste",
  "sechsunddreißigste",
  "siebenunddreißigste",
  "achtunddreißigste",
  "neununddreißigste",

  // Más comunes hasta 100ª
  "vierzigste",
  "fünfzigste",
  "sechzigste",
  "siebzigste",
  "achtzigste",
  "neunzigste",
  "einhundertste",
];

// Array completo de ordinales
export const ALL_ORDINALS = [...ORDINALS_BASIC, ...ORDINALS_TEENS, ...ORDINALS_TENS, ...ORDINALS_HUNDREDS, ...ORDINALS_COMPOUND];

// =====================================================
// FRACCIONES - Híbridos sustantivo/adjetivo
// =====================================================

export const FRACTIONS_BASIC = [
  "halb",
  "halbe",
  "halben",
  "halber",
  "halbes", // medio/media con declinaciones
  "Drittel",
  "Viertel",
  "Fünftel",
  "Sechstel",
  "Siebtel",
  "Achtel",
  "Neuntel",
  "Zehntel",
];

export const FRACTIONS_ORDINAL_BASED = ["Elftel", "Zwölftel", "Dreizehntel", "Vierzehntel", "Fünfzehntel", "Sechzehntel", "Siebzehntel", "Achtzehntel", "Neunzehntel", "Zwanzigstel"];

export const FRACTIONS_COMPOUND = [
  // Números con mitad
  "einhalb",
  "anderthalb",
  "eineinhalb", // 1.5
  "zweieinhalb",
  "dreieinhalb",
  "viereinhalb",
  "fünfeinhalb",
  "sechseinhalb",
  "siebeneinhalb",
  "achteinhalb",
  "neuneinhalb", // 2.5 - 9.5

  // Fracciones grandes
  "Hundertstel",
  "Tausendstel",
  "Millionstel",
];

// Expresiones decimales en palabras
export const FRACTIONS_DECIMAL_WORDS = [
  "komma", // für 3,5 = "drei Komma fünf"
  "punkt", // alternative (menos común en alemán)
];

// Array completo de fracciones
export const ALL_FRACTIONS = [...FRACTIONS_BASIC, ...FRACTIONS_ORDINAL_BASED, ...FRACTIONS_COMPOUND, ...FRACTIONS_DECIMAL_WORDS];

// =====================================================
// MULTIPLICATIVOS - Adverbiales
// =====================================================

export const MULTIPLICATIVE_BASIC = ["einmal", "zweimal", "dreimal", "viermal", "fünfmal", "sechsmal", "siebenmal", "achtmal", "neunmal", "zehnmal"];

export const MULTIPLICATIVE_EXTENDED = [
  "elfmal",
  "zwölfmal",
  "dreizehnmal",
  "vierzehnmal",
  "fünfzehnmal",
  "sechzehnmal",
  "siebzehnmal",
  "achtzehnmal",
  "neunzehnmal",
  "zwanzigmal",
  "dreißigmal",
  "vierzigmal",
  "fünfzigmal",
  "hundertmal",
  "tausendmal",
];

export const MULTIPLICATIVE_IRREGULAR = [
  "mehrmals",
  "oftmals",
  "manchmal",
  "nochmals",
  "vielmals",
  "zigmal",
  "x-mal", // umgangssprachlich
];

// Formas adjetivales (einfach, zweifach, etc.)
export const MULTIPLICATIVE_ADJECTIVE_FORMS = [
  "einfach",
  "zweifach",
  "dreifach",
  "vierfach",
  "fünffach",
  "sechsfach",
  "siebenfach",
  "achtfach",
  "neunfach",
  "zehnfach",
  "elffach",
  "zwölffach",
  "mehrfach",
  "vielfach",
  "hundertfach",
  "tausendfach",
  "millionenfach",
];

// Array completo de multiplicativos
export const ALL_MULTIPLICATIVE = [...MULTIPLICATIVE_BASIC, ...MULTIPLICATIVE_EXTENDED, ...MULTIPLICATIVE_IRREGULAR, ...MULTIPLICATIVE_ADJECTIVE_FORMS];

// =====================================================
// COLECTIVOS - Determinantes colectivos
// =====================================================

export const COLLECTIVE_BASIC = ["beide", "sämtliche", "alle", "viele", "wenige", "einige", "mehrere", "etliche"];

export const COLLECTIVE_APPROXIMATE = ["dutzende", "hunderte", "tausende", "millionen", "milliarden", "unzählige", "zahlreiche", "ungezählte", "abzählbare"];

// Array completo de colectivos
export const ALL_COLLECTIVE = [...COLLECTIVE_BASIC, ...COLLECTIVE_APPROXIMATE];

// =====================================================
// EXPRESIONES Y FRASES ESPECIALES
// =====================================================

// Frases que requieren manejo especial (multi-token)
export const COLLECTIVE_PHRASES = [
  "ein paar", // se maneja como frase especial en recognizer
  "eine Menge",
  "eine Anzahl",
  "eine Vielzahl",
];

// Palabras que modifican números (aproximación)
export const APPROXIMATE_MODIFIERS = [
  "circa",
  "ca",
  "etwa",
  "ungefähr",
  "rund",
  "knapp",
  "gut",
  "über",
  "unter",
  "zwischen",
  "gegen", // "gegen zehn Uhr" = around 10 o'clock
];

// Conectores para rangos
export const RANGE_CONNECTORS = [
  "bis", // 5 bis 10
  "zwischen", // zwischen 5 und 10
  "von", // von 5 bis 10
  "und", // 5 und 10 (en rangos)
];

// =====================================================
// PATRONES Y SUFIJOS (para uso en recognizer)
// =====================================================

export const ORDINAL_SUFFIXES = [
  "te",
  "ste", // 30te, 100ste (informal)
];

export const MULTIPLICATIVE_SUFFIXES = ["mal", "fach"];

export const FRACTION_SUFFIXES = [
  "tel",
  "stel", // Fünftel, Hundertstel
];

// Terminaciones de adjetivos (para ordinales declinados)
export const ADJECTIVE_ENDINGS = ["e", "en", "em", "er", "es"];

// =====================================================
// ESTADÍSTICAS (solo informativo)
// =====================================================

export const STATISTICS = {
  cardinals: ALL_CARDINALS.length,
  ordinals: ALL_ORDINALS.length,
  fractions: ALL_FRACTIONS.length,
  multiplicatives: ALL_MULTIPLICATIVE.length,
  collectives: ALL_COLLECTIVE.length,
  get total() {
    return this.cardinals + this.ordinals + this.fractions + this.multiplicatives + this.collectives;
  },
};

// =====================================================
// EXPORTS AGRUPADOS PARA FACILIDAD DE USO
// =====================================================

export const NUMBERS_DATA = {
  // Arrays principales
  cardinals: ALL_CARDINALS,
  ordinals: ALL_ORDINALS,
  fractions: ALL_FRACTIONS,
  multiplicatives: ALL_MULTIPLICATIVE,
  collectives: ALL_COLLECTIVE,

  // Frases especiales
  phrases: COLLECTIVE_PHRASES,
  modifiers: APPROXIMATE_MODIFIERS,
  connectors: RANGE_CONNECTORS,

  // Sufijos y patrones
  suffixes: {
    ordinal: ORDINAL_SUFFIXES,
    multiplicative: MULTIPLICATIVE_SUFFIXES,
    fraction: FRACTION_SUFFIXES,
    adjective: ADJECTIVE_ENDINGS,
  },

  // Estadísticas
  stats: STATISTICS,
};

// Export por defecto
export default NUMBERS_DATA;
