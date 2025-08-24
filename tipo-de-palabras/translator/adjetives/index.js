// translator/adjetives/adj_guess.js
import { DECLENSIONS } from "./declensions.js";
import { REVERSE_COMPARATIVES, REVERSE_SUPERLATIVES } from "./lemmas/superlatives.js";
import { ADJECTIVES } from "./lemmas/index.js";

/** Heurísticas de stems raros (comparativo/superlativo ya “pelados”) */
const REVERSE_STEM_FIXES = [
  [/^höh$/i, () => "hoch"], // höher → (−er) → höh → hoch
  [/^fitt$/i, () => "fit"], // fitter → (−er) → fitt → fit
];

export const applyReverseStemHeuristics = (stem) => {
  for (const [rx, toBase] of REVERSE_STEM_FIXES) if (rx.test(stem)) return toBase(stem);
  return null;
};

// ---------- utils ----------
const BASE_SET = new Set(ADJECTIVES.map((a) => a.de));

const stripDeclensionEnding = (form) => {
  const endings = ["en", "er", "es", "em", "e"];
  for (const end of endings)
    if (form.toLowerCase().endsWith(end)) {
      return { core: form.slice(0, -end.length), ending: end };
    }
  return { core: form, ending: "" };
};

const reverseUmlaut = (s) => s.replace(/[ÄÖÜäöü]/g, (m) => ({ ä: "a", ö: "o", ü: "u", Ä: "A", Ö: "O", Ü: "U" }[m] ?? m));
const peelComparative = (core) => (/er$/i.test(core) ? core.slice(0, -2) : null);
const peelSuperlative = (core) => (/est$/i.test(core) ? core.slice(0, -3) : /st$/i.test(core) ? core.slice(0, -2) : null);
const isBase = (s) => BASE_SET.has(s);

const tryResolveBaseFromStem = (stem) => {
  if (isBase(stem)) return stem;
  const fixed = applyReverseStemHeuristics(stem);
  if (fixed && isBase(fixed)) return fixed;
  const deU = reverseUmlaut(stem);
  if (isBase(deU)) return deU;
  return null;
};

// ---------- declension helpers (opt-in) ----------
const findDeclensionMatchesForEnding = (ending) => {
  const out = [];
  if (!ending) return out;
  for (const det of Object.keys(DECLENSIONS)) {
    const table = DECLENSIONS[det];
    for (const key of Object.keys(table)) {
      if (table[key] === ending) {
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

// ---------- núcleo (sin declinaciones por defecto) ----------
/**
 * Devuelve un análisis minimal:
 * { input, form:{core, ending}, degree:'base'|'comp'|'sup'|null, base:string|null, confidence:number, notes:string[] }
 */
export const analyzeAdjective = (inputRaw) => {
  const input = String(inputRaw || "").trim();
  const notes = [];
  if (!input) {
    return { input, form: { core: "", ending: "" }, degree: null, base: null, confidence: 0, notes: ["Entrada vacía"] };
  }

  const stripA = stripDeclensionEnding(input);

  const tryPath = (core, ending, tag) => {
    // 1) base exacta
    if (isBase(core)) {
      return { input, form: { core, ending }, degree: "base", base: core, confidence: 1 - (ending ? 0.05 : 0), notes: [...notes, `Base exacta [${tag}]`] };
    }
    // 2) supletivos/irregulares sin declinación
    if (REVERSE_COMPARATIVES[core]) {
      return { input, form: { core, ending }, degree: "comp", base: REVERSE_COMPARATIVES[core], confidence: 0.95, notes: [...notes, `Comparativo supletivo/irregular [${tag}]`] };
    }
    if (REVERSE_SUPERLATIVES[core]) {
      return { input, form: { core, ending }, degree: "sup", base: REVERSE_SUPERLATIVES[core], confidence: 0.95, notes: [...notes, `Superlativo supletivo/irregular [${tag}]`] };
    }
    // 3) comparativo regular
    const compStem = peelComparative(core);
    if (compStem) {
      let base = tryResolveBaseFromStem(compStem) || tryResolveBaseFromStem(reverseUmlaut(compStem)) || REVERSE_COMPARATIVES[core];
      if (base) return { input, form: { core, ending }, degree: "comp", base, confidence: 0.9, notes: [...notes, `Comparativo detectado [${tag}]`] };
    }
    // 4) superlativo regular
    const supStem = peelSuperlative(core);
    if (supStem) {
      let base = tryResolveBaseFromStem(supStem) || tryResolveBaseFromStem(reverseUmlaut(supStem)) || REVERSE_SUPERLATIVES[core];
      if (base) return { input, form: { core, ending }, degree: "sup", base, confidence: 0.88, notes: [...notes, `Superlativo detectado [${tag}]`] };
    }
    // 5) base tras revertir umlaut
    const maybeBase = reverseUmlaut(core);
    if (isBase(maybeBase)) {
      return { input, form: { core, ending }, degree: "base", base: maybeBase, confidence: 0.75, notes: [...notes, `Base tras revertir umlaut [${tag}]`] };
    }
    return null;
  };

  // estrategia principal: “declinación primero”
  let analysed = tryPath(stripA.core, stripA.ending, "decl→grado");

  // fallback: si ending era 'er' pero no reconocimos, quizá ese -er era comparativo
  if (!analysed && stripA.ending === "er") {
    analysed = tryPath(input, "", "grado→(sin decl)");
  }

  if (!analysed) {
    return { input, form: stripA, degree: null, base: null, confidence: 0.15, notes: [...notes, "No parece una forma adjetival conocida."] };
  }
  return analysed;
};

// ---------- API opt-in para declinaciones (cuando las necesites) ----------
/** Devuelve las posibles casillas (det/case/gender) para la terminación detectada en `word`. */
export const listDeclensionMatchesFor = (word) => {
  const { ending } = stripDeclensionEnding(String(word || "").trim());
  return findDeclensionMatchesForEnding(ending);
};

/** Igual que arriba, pero en frases legibles. */
export const prettyDeclensionMatchesFor = (word, { max = 10 } = {}) => {
  const matches = listDeclensionMatchesFor(word);
  const lines = matches.slice(0, max).map(explainDeclensionMatch);
  if (matches.length > max) lines.push(`(+${matches.length - max} más)`);
  return lines;
};

// ---------- helper de UI ----------
export const isAdjectiveLike = (token) => analyzeAdjective(token).confidence >= 0.5;

// ---------- pruebas rápidas ----------
(() => {
  const ejemplos = ["schöne", "stärkeren", "höchstem", "besten", "fitter"];
  for (const w of ejemplos) {
    const g = analyzeAdjective(w);
    // eslint-disable-next-line no-console
    console.log("ANALYZE:", g);
    // eslint-disable-next-line no-console
    console.log("DECL  :", prettyDeclensionMatchesFor(w).join(" | "));
  }
})();
