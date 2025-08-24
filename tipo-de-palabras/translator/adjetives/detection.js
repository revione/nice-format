import { DECLENSIONS } from "./declensions.js";
import { ADJECTIVES, ADJ_GRADABLE } from "./lemmas/index.js";
import { tryIrregularLookup } from "./utils/shared.js";
import { generateGermanVariants, generateStemVariants, transformUmlaut } from "./utils/variants.js";
import { germanWordValidator } from "./utils/validation.js";

const BASE_SET = new Set(ADJECTIVES.filter((a) => a.form === "base").map((a) => a.de));

const stripDeclensionEnding = (form) => {
  const endings = ["en", "er", "es", "em", "e"];
  for (const end of endings) {
    if (form.toLowerCase().endsWith(end)) {
      return { core: form.slice(0, -end.length), ending: end };
    }
  }
  return { core: form, ending: "" };
};

const peelComparative = (core) => (/er$/i.test(core) ? core.slice(0, -2) : null);

const peelSuperlative = (core) => {
  if (/est$/i.test(core)) return core.slice(0, -3);
  if (/ßt$/i.test(core)) return core.slice(0, -1);
  if (/st$/i.test(core)) return core.slice(0, -2);
  return null;
};

const isBase = (s) => BASE_SET.has(s);
const isGradable = (s) => ADJ_GRADABLE.get(String(s).toLowerCase()) !== false;

// === RESOLUCIÓN DE STEMS ===

/**
 * Resuelve base desde stem usando variantes
 */
const tryResolveBaseFromStem = (stem) => {
  if (!stem) return null;

  // 1. Variantes directas del stem
  for (const variant of generateStemVariants(stem)) {
    if (isBase(variant)) return variant;
  }

  // 2. Casos especiales conocidos
  if (stem === "höh" && isBase("hoch")) return "hoch";
  if (stem === "fitt" && isBase("fit")) return "fit";

  // 3. Revertir umlaut y probar
  const deUmlaut = transformUmlaut.reverseUmlaut(stem);
  if (deUmlaut !== stem) {
    for (const variant of generateGermanVariants(deUmlaut)) {
      if (isBase(variant)) return variant;
    }
  }

  return null;
};

// === CONSTRUCCIÓN DE RESULTADOS ===

/**
 * Crea resultado de análisis
 */
const createAnalysisResult = (input, form, base, rawDegree, baseConfidence, message) => {
  const degree = base && isGradable(base) ? rawDegree : null;
  const confidence = degree ? baseConfidence : Math.max(baseConfidence - 0.15, 0.1);
  const finalMessage = degree ? message : `${message} (no gradable → grado nulo)`;

  return {
    input: String(input || "").trim(),
    form: {
      core: String(form.core || form || ""),
      ending: String(form.ending || ""),
    },
    degree,
    base,
    confidence,
    notes: [finalMessage],
  };
};

/**
 * Resultado de error
 */
const createErrorResult = (input, error, confidence = 0) => ({
  input: String(input || "").trim(),
  form: { core: "", ending: "" },
  degree: null,
  base: null,
  confidence,
  notes: [error],
});

// === ANÁLISIS PRINCIPAL ===

/**
 * Analiza una forma adjetival alemana
 */
export const analyzeAdjective = (inputRaw) => {
  // Validación
  const validation = germanWordValidator.validate(inputRaw);
  if (!validation.valid) {
    return createErrorResult(inputRaw, validation.error);
  }

  const input = String(inputRaw ?? "").trim();
  const norm = validation.value;
  const stripA = stripDeclensionEnding(norm);

  /**
   * Intenta analizar core/ending
   */
  const tryAnalyze = (core, ending, tag) => {
    // 1. Irregulares exactos
    const irregular = tryIrregularLookup(core);
    if (irregular) {
      const message = `${irregular.degree === "comp" ? "Comparativo" : "Superlativo"} ${irregular.type} [${tag}]`;
      return createAnalysisResult(input, { core, ending }, irregular.base, irregular.degree, irregular.confidence, message);
    }

    // 2. Comparativo regular
    const compStem = peelComparative(core);
    if (compStem) {
      const base = tryResolveBaseFromStem(compStem);
      if (base) {
        return createAnalysisResult(input, { core, ending }, base, "comp", 0.9, `Comparativo regular [${tag}]`);
      }
    }

    // 3. Superlativo regular
    const supStem = peelSuperlative(core);
    if (supStem) {
      const base = tryResolveBaseFromStem(supStem);
      if (base) {
        return createAnalysisResult(input, { core, ending }, base, "sup", 0.88, `Superlativo regular [${tag}]`);
      }
    }

    // 4. Base exacta
    if (isBase(core)) {
      return createAnalysisResult(input, { core, ending }, core, "base", 1 - (ending ? 0.05 : 0), `Base exacta [${tag}]`);
    }

    // 5. Base tras variantes
    for (const variant of generateGermanVariants(core)) {
      if (isBase(variant)) {
        return createAnalysisResult(input, { core, ending }, variant, "base", 0.75, `Base tras variantes [${tag}]`);
      }
    }

    return null;
  };

  // Estrategia principal: declinación primero
  let result = tryAnalyze(stripA.core, stripA.ending, "decl→grado");

  // Ambigüedad "-er": preferir comparativo
  if (stripA.ending === "er") {
    const asDegree = tryAnalyze(norm, "", "grado→(sin decl)");
    if (asDegree?.degree === "comp" && (!result || result.degree !== "comp")) {
      asDegree.confidence = Math.max(asDegree.confidence, 0.92);
      asDegree.notes.push("Ambigüedad -er: preferido como comparativo");
      result = asDegree;
    }
  }

  // Fallback: sin pelar terminación
  if (!result) {
    result = tryAnalyze(norm, "", "grado→(sin decl)");
  }

  // Resultado por defecto
  return result || createErrorResult(input, "No parece una forma adjetival conocida", 0.15);
};

// === API PARA DECLINACIONES (sin cambios) ===

const findDeclensionMatchesForEnding = (ending) => {
  const out = [];
  if (!ending) return out;

  for (const [det, table] of Object.entries(DECLENSIONS)) {
    for (const [key, value] of Object.entries(table)) {
      if (value === ending) {
        const [caso, genero] = key.split("|");
        out.push({ det, case: caso, gender: genero });
      }
    }
  }
  return out;
};

const DET_LABEL = {
  def: "con artículo definido (der/die/das)",
  indef: "con artículo indefinido (ein/kein)",
  none: "sin artículo",
};

const CASE_LABEL = {
  nom: "nominativo",
  akk: "acusativo",
  dat: "dativo",
  gen: "genitivo",
};

const GENDER_LABEL = {
  m: "masculino",
  f: "femenino",
  n: "neutro",
  pl: "plural",
};

export const explainDeclensionMatch = ({ det, case: kase, gender }) => `${DET_LABEL[det]} — ${CASE_LABEL[kase]} ${GENDER_LABEL[gender]}`;

export const listDeclensionMatchesFor = (word) => {
  const { ending } = stripDeclensionEnding(String(word || "").trim());
  return findDeclensionMatchesForEnding(ending);
};

export const prettyDeclensionMatchesFor = (word, { max = 10 } = {}) => {
  const matches = listDeclensionMatchesFor(word);
  const lines = matches.slice(0, max).map(explainDeclensionMatch);
  if (matches.length > max) lines.push(`(+${matches.length - max} más)`);
  return lines;
};

export const isAdjectiveLike = (token) => analyzeAdjective(token).confidence >= 0.5;
