import { DECLENSIONS, DET } from "./lemmas/declensions.js";
import { BLOCKS, ADJ_META, PATTERNS } from "./lemmas/data-loader.js";
import { COLOR_PREFIXES, COLOR_SUFFIXES, DECLINABLE_COLORS, INDECLINABLE_COLORS } from "./lemmas/colors.js";

export const KASE = { NOM: "nom", AKK: "akk", DAT: "dat", GEN: "gen" };
export const GENUS = { M: "m", F: "f", N: "n", PL: "pl" };

let _indices = null;

const MULTI_WORD_MAP = {
  "peinlich berührt": "peinlich_berührt",
};

const SPECIAL_MATERIALS = ["kupfer", "gold", "silber", "bronze", "messing"];

export const analyzeGermanAdjective = (word, context = {}, data) => {
  const originalWord = word;
  let normalized = word.toLowerCase().trim();

  // ✅ PASO 1: Preprocesar multi-palabras automáticamente
  for (const [original, replacement] of Object.entries(MULTI_WORD_MAP)) {
    if (originalWord.toLowerCase().includes(original)) {
      normalized = replacement;
      break;
    }
  }

  // ✅ PASO 2: Lookup directo (diccionario) - PRIMERA PRIORIDAD
  let directResult = analyzeDirectLookup(normalized, data);
  if (!directResult && normalized !== originalWord.toLowerCase()) {
    directResult = analyzeDirectLookup(originalWord.toLowerCase(), data);
  }

  if (directResult) {
    if (normalized.includes("_") || directResult.lemma.includes(" ") || directResult.lemma.includes("_")) {
      directResult.displayLemma = directResult.lemma.replace(/_/g, " ");
      directResult.isMultiWord = true;
    }
    return directResult;
  }

  // ✅ PASO 3: Análisis de compuestos de colores automático
  const colorResult = analyzeColorCompounds(normalized);
  if (colorResult) return colorResult;

  // ✅ PASO 4: Análisis de patrones productivos
  const patternResult = analyzeByPatterns(normalized, data.patterns);
  if (patternResult) return patternResult;

  // ✅ PASO 5: Análisis contextual (si se proporciona contexto)
  const contextResult = analyzeByContext(normalized, context);
  if (contextResult) return contextResult;

  // ✅ PASO 6: No encontrado
  return {
    isAdjective: false,
    confidence: 0,
    lemma: null,
    method: "none",
    word: originalWord,
  };
};

const buildIndices = (data) => {
  if (_indices) return _indices;

  const domainMap = new Map();
  const allLemmas = new Set();

  for (const [domain, lemmas] of Object.entries(data.blocks)) {
    for (const lemma of lemmas) {
      allLemmas.add(lemma);
      if (!domainMap.has(lemma)) {
        domainMap.set(lemma, []);
      }
      domainMap.get(lemma).push(domain);
    }
  }

  const formIndex = new Map();
  for (const lemma of allLemmas) {
    const meta = data.adjectiveMeta[lemma] || {};
    const forms = generateAllForms(lemma, meta, data.declensions, data.constants);

    for (const form of forms) {
      if (!formIndex.has(form)) {
        formIndex.set(form, []);
      }
      formIndex.get(form).push(lemma);
    }
  }

  _indices = { domainMap, allLemmas, formIndex };
  return _indices;
};

const generateAllForms = (lemma, meta, declensions, constants) => {
  const forms = new Set([lemma]);

  if (lemma.includes(" ")) {
    const underscored = lemma.replace(/ /g, "_");
    forms.add(underscored);
  }
  if (lemma.includes("_")) {
    const spaced = lemma.replace(/_/g, " ");
    forms.add(spaced);
  }

  if (meta.indeclinable) return forms;

  const cases = Object.values(constants.KASE);
  const genders = Object.values(constants.GENUS);
  const determiners = Object.values(constants.DET);

  // Formas base
  for (const det of determiners) {
    for (const kase of cases) {
      for (const genus of genders) {
        const form = decline(lemma, { det, kase, genus }, declensions);
        if (form && form !== lemma) forms.add(form);
      }
    }
  }

  if (meta.comp) {
    forms.add(meta.comp);
    for (const det of determiners) {
      for (const kase of cases) {
        for (const genus of genders) {
          const form = decline(meta.comp, { det, kase, genus }, declensions);
          if (form && form !== meta.comp) forms.add(form);
        }
      }
    }
  }

  if (meta.sup) {
    forms.add(meta.sup);
    for (const det of determiners) {
      for (const kase of cases) {
        for (const genus of genders) {
          const form = decline(meta.sup, { det, kase, genus }, declensions);
          if (form && form !== meta.sup) forms.add(form);
        }
      }
    }
  }

  return forms;
};

const decline = (lemma, { det = "none", kase = "nom", genus = "m" } = {}, declensions) => {
  const key = `${kase}|${genus}`;
  const ending = declensions[det]?.[key];
  return ending !== undefined ? lemma + ending : lemma;
};

const analyzeDirectLookup = (word, data) => {
  const { formIndex, domainMap } = buildIndices(data);
  const matches = formIndex.get(word);

  if (!matches?.length) return null;

  const lemma = matches[0];
  const meta = data.adjectiveMeta[lemma] || {};
  const domains = domainMap.get(lemma) || [];

  return {
    isAdjective: true,
    confidence: 0.98,
    lemma,
    meta,
    domains,
    method: "direct",
    isDeclined: word !== lemma,
    allPossibleLemmas: matches,
  };
};

const analyzeColorCompounds = (word) => {
  const stripDeclension = (w) => {
    for (const ending of ["en", "em", "er", "es", "e"]) {
      if (w.endsWith(ending) && w.length > ending.length + 2) {
        return w.slice(0, -ending.length);
      }
    }
    return w;
  };

  for (const prefix of COLOR_PREFIXES) {
    if (word.startsWith(prefix)) {
      const remaining = stripDeclension(word.slice(prefix.length));
      if (DECLINABLE_COLORS.includes(remaining) || INDECLINABLE_COLORS.includes(remaining)) {
        return {
          isAdjective: true,
          confidence: 0.85,
          lemma: prefix + remaining, // lemma base sin declinación
          meta: { colorCompound: true, prefix, baseColor: remaining },
          domains: ["color"],
          method: "color_prefix",
          isDeclined: word !== prefix + remaining,
          colorInfo: { type: "prefix", prefix, base: remaining },
        };
      }
    }
  }

  for (const suffix of COLOR_SUFFIXES) {
    const core = stripDeclension(word);
    if (core.endsWith(suffix)) {
      const base = core.slice(0, -suffix.length);
      if (DECLINABLE_COLORS.includes(base) || SPECIAL_MATERIALS.includes(base)) {
        return {
          isAdjective: true,
          confidence: 0.85,
          lemma: base + suffix, // lemma base sin declinación
          meta: { colorCompound: true, baseColor: base, suffix },
          domains: ["color"],
          method: "color_suffix",
          isDeclined: word !== base + suffix,
          colorInfo: { type: "suffix", base, suffix },
        };
      }
    }
  }

  return null;
};

const analyzeByPatterns = (word, patterns) => {
  // Sufijos productivos directos
  for (const [suffix, info] of Object.entries(patterns.productive)) {
    if (word.endsWith(suffix)) {
      let confidence = info.confidence * 0.85;

      if (suffix === "weise") confidence *= 0.5;

      return {
        isAdjective: true,
        confidence,
        lemma: word,
        meta: { patternDerived: true, suffixType: info.type },
        domains: [info.type],
        method: "pattern",
        pattern: suffix,
        isDeclined: false,
        patternInfo: info,
      };
    }
  }

  for (const ending of patterns.declension) {
    if (word.endsWith(ending) && word.length > ending.length + 2) {
      const stem = word.slice(0, -ending.length);

      for (const [suffix, info] of Object.entries(patterns.productive)) {
        if (stem.endsWith(suffix)) {
          let confidence = info.confidence * 0.75;
          if (suffix === "weise") confidence *= 0.5;

          return {
            isAdjective: true,
            confidence,
            lemma: stem,
            meta: { patternDerived: true, suffixType: info.type },
            domains: [info.type],
            method: "declined_pattern",
            pattern: suffix,
            declensionEnding: ending,
            isDeclined: true,
            patternInfo: info,
          };
        }
      }
    }
  }

  return null;
};

const analyzeByContext = (word, context) => {
  if (!context.tokens || context.currentIndex === undefined) {
    return null;
  }

  const { tokens, currentIndex } = context;
  let confidence = 0.3;

  if (currentIndex > 0) {
    const prevToken = tokens[currentIndex - 1]?.toLowerCase();
    const articles = ["der", "die", "das", "ein", "eine", "einen", "einem", "einer", "eines"];
    if (articles.includes(prevToken)) {
      confidence += 0.2;
    }
  }

  // Sustantivo después
  if (currentIndex < tokens.length - 1) {
    const nextToken = tokens[currentIndex + 1];
    if (nextToken && /^[A-ZÄÖÜ]/.test(nextToken)) {
      confidence += 0.3;
    }
  }

  if (confidence > 0.6) {
    return {
      isAdjective: true,
      confidence,
      lemma: word,
      meta: { contextDerived: true },
      domains: ["unknown"],
      method: "context",
      isDeclined: false,
    };
  }

  return null;
};

export const analyzeText = (text, data) => {
  let processedText = text;
  for (const [original, replacement] of Object.entries(MULTI_WORD_MAP)) {
    processedText = processedText.replace(new RegExp(original, "gi"), replacement);
  }

  const tokens = processedText.split(/\s+/).filter((w) => w.length > 0);

  return tokens
    .map((word, index) => {
      const context = { tokens, currentIndex: index };
      const result = analyzeGermanAdjective(word, context, data);

      if (result.isAdjective && result.lemma && result.lemma.includes("_")) {
        result.displayLemma = result.lemma.replace(/_/g, " ");
        result.isMultiWord = true;
      }

      return {
        index,
        word: word.replace(/_/g, " "),
        ...result,
      };
    })
    .filter((result) => result.isAdjective);
};

const createDataObject = () => ({
  blocks: BLOCKS,
  adjectiveMeta: ADJ_META,
  declensions: DECLENSIONS,
  patterns: PATTERNS,
  constants: { KASE, GENUS, DET },
});

export const GermanAdjectives = {
  /**
   * Determina si una palabra es adjetivo
   * - Multi-palabras ("peinlich berührt")
   * - Compuestos de colores ("hellblau", "kupferfarben")
   * - Formas declinadas ("schönen", "schönste")
   * - Patrones productivos ("freundlich", "machbar")
   * - Análisis contextual (con contexto opcional)
   */
  isAdjective: (word, context = {}) => {
    return analyzeGermanAdjective(word, context, createDataObject()).isAdjective;
  },

  /**
   * Devuelve toda la información disponible sobre el adjetivo
   */
  analyze: (word, context = {}) => {
    return analyzeGermanAdjective(word, context, createDataObject());
  },

  /**
   * Encuentra todos los adjetivos en un texto
   */
  analyzeText: (text) => analyzeText(text, createDataObject()),
};
