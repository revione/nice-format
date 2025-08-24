import { DECLENSIONS } from "./declensions.js";
import { REVERSE_COMPARATIVES, REVERSE_SUPERLATIVES } from "./lemmas/superlatives.js";
import { ADJECTIVES, ADJ_GRADABLE } from "./lemmas/index.js";
import { generateGermanVariants, generateStemVariants, transformUmlaut } from "./utils/variants.js";
import { validateInput } from "./utils/validation.js";

/** Heurísticas de stems raros */
const REVERSE_STEM_FIXES = [
  [/^höh$/i, () => "hoch"],
  [/^fitt$/i, () => "fit"],
];

export const applyReverseStemHeuristics = (stem) => {
  for (const [rx, toBase] of REVERSE_STEM_FIXES) {
    if (rx.test(stem)) return toBase(stem);
  }
  return null;
};

// --- Utilidades ---
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

/**
 * Intenta resolver una base desde un stem usando todas las variantes
 * VERSIÓN SIMPLIFICADA usando generateStemVariants
 */
const tryResolveBaseFromStem = (stem) => {
  if (!stem) return null;

  // 1. Probar todas las variantes del stem
  for (const variant of generateStemVariants(stem)) {
    if (isBase(variant)) return variant;
  }

  // 2. Heurísticas específicas
  const fixed = applyReverseStemHeuristics(stem);
  if (fixed) {
    for (const variant of generateGermanVariants(fixed)) {
      if (isBase(variant)) return variant;
    }
  }

  // 3. Revertir umlaut y probar
  const deU = transformUmlaut.reverseUmlaut(stem);
  if (deU && deU !== stem) {
    for (const variant of generateGermanVariants(deU)) {
      if (isBase(variant)) return variant;
    }

    // También heurísticas del deU
    const fixedDeU = applyReverseStemHeuristics(deU);
    if (fixedDeU) {
      for (const variant of generateGermanVariants(fixedDeU)) {
        if (isBase(variant)) return variant;
      }
    }
  }

  return null;
};

/**
 * Helper para crear resultados de análisis consistentes
 */
const createAnalysisResult = (input, form, base, rawDegree, baseConfidence, message, notes = []) => {
  const degree = base && isGradable(base) ? rawDegree : null;
  const confidence = degree ? baseConfidence : Math.max(baseConfidence - 0.15, 0.1);
  const finalMessage = degree ? message : `${message} (no gradable → grado nulo)`;

  return {
    input,
    form,
    degree,
    base,
    confidence,
    notes: [...notes, finalMessage],
  };
};

// --- Declension helpers ---
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
const CASE_LABEL = { nom: "nominativo", akk: "acusativo", dat: "dativo", gen: "genitivo" };
const GENDER_LABEL = { m: "masculino", f: "femenino", n: "neutro", pl: "plural" };

export const explainDeclensionMatch = ({ det, case: kase, gender }) => `${DET_LABEL[det]} — ${CASE_LABEL[kase]} ${GENDER_LABEL[gender]}`;

// --- Núcleo del análisis ---
/**
 * Analiza una forma adjetival alemana
 * VERSIÓN SIMPLIFICADA con menos repetición
 */
export const analyzeAdjective = (inputRaw) => {
  // Validar entrada
  const validation = validateInput(inputRaw, { allowEmpty: false, toLowerCase: true, trim: true });
  if (!validation.valid) {
    return {
      input: String(inputRaw ?? "").trim(),
      form: { core: "", ending: "" },
      degree: null,
      base: null,
      confidence: 0,
      notes: [validation.error],
    };
  }

  const input = String(inputRaw ?? "").trim();
  const norm = validation.value;
  const stripA = stripDeclensionEnding(norm);

  /**
   * Función unificada para probar un path de análisis
   */
  const tryPath = (core, ending, tag) => {
    // 1. Supletivos/irregulares exactos
    if (REVERSE_COMPARATIVES[core]) {
      return createAnalysisResult(input, { core, ending }, REVERSE_COMPARATIVES[core], "comp", 0.95, `Comparativo supletivo/irregular [${tag}]`);
    }
    if (REVERSE_SUPERLATIVES[core]) {
      return createAnalysisResult(input, { core, ending }, REVERSE_SUPERLATIVES[core], "sup", 0.95, `Superlativo supletivo/irregular [${tag}]`);
    }

    // 2. Comparativo regular
    const compStem = peelComparative(core);
    if (compStem) {
      const base = tryResolveBaseFromStem(compStem) || REVERSE_COMPARATIVES[core];
      if (base) {
        return createAnalysisResult(input, { core, ending }, base, "comp", 0.9, `Comparativo detectado [${tag}]`);
      }
    }

    // 3. Superlativo regular
    const supStem = peelSuperlative(core);
    if (supStem) {
      const base = tryResolveBaseFromStem(supStem) || REVERSE_SUPERLATIVES[core];
      if (base) {
        return createAnalysisResult(input, { core, ending }, base, "sup", 0.88, `Superlativo detectado [${tag}]`);
      }
    }

    // 4. Base exacta
    if (isBase(core)) {
      return createAnalysisResult(input, { core, ending }, core, "base", 1 - (ending ? 0.05 : 0), `Base exacta [${tag}]`);
    }

    // 5. Base tras transformaciones
    for (const variant of generateGermanVariants(core)) {
      if (isBase(variant)) {
        return createAnalysisResult(input, { core, ending }, variant, "base", 0.75, `Base tras variantes ortográficas [${tag}]`);
      }
    }

    return null;
  };

  // Estrategia principal: declinación primero
  let result = tryPath(stripA.core, stripA.ending, "decl→grado");

  // Ambigüedad "-er": preferir comparativo
  if (stripA.ending === "er") {
    const asDegree = tryPath(norm, "", "grado→(sin decl)");
    if (asDegree?.degree === "comp" && (!result || result.degree !== "comp")) {
      asDegree.confidence = Math.max(asDegree.confidence, 0.92);
      asDegree.notes.push("Ambigüedad -er: preferido como comparativo");
      result = asDegree;
    }
  }

  // Fallback: sin pelar terminación
  if (!result) {
    result = tryPath(norm, "", "grado→(sin decl)");
  }

  return (
    result || {
      input,
      form: stripA,
      degree: null,
      base: null,
      confidence: 0.15,
      notes: ["No parece una forma adjetival conocida"],
    }
  );
};

// --- API para declinaciones ---
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
