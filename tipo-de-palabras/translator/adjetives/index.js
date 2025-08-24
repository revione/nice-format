// translator/adjetives/adj_guess.js
import { DECLENSIONS } from "./declensions.js";
import { REVERSE_COMPARATIVES, REVERSE_SUPERLATIVES } from "./lemmas/superlatives.js";
import { ADJECTIVES, ADJ_GRADABLE } from "./lemmas/index.js";

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
const BASE_SET = new Set(ADJECTIVES.filter((a) => a.form === "base").map((a) => a.de));

// ae/oe/ue <-> ä/ö/ü helpers
const TO_UMLAUT = (s) => s.replace(/ae/g, "ä").replace(/oe/g, "ö").replace(/ue/g, "ü").replace(/Ae/g, "Ä").replace(/Oe/g, "Ö").replace(/Ue/g, "Ü");
const FROM_UMLAUT = (s) => s.replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/Ä/g, "Ae").replace(/Ö/g, "Oe").replace(/Ü/g, "Ue");

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
const peelSuperlative = (core) => {
  if (/est$/i.test(core)) return core.slice(0, -3);
  if (/ßt$/i.test(core)) return core.slice(0, -1); // deja 'größ' (no elimina la ß)
  if (/st$/i.test(core)) return core.slice(0, -2);
  return null;
};
const isBase = (s) => BASE_SET.has(s);
const isGradable = (s) => ADJ_GRADABLE.get(String(s).toLowerCase()) !== false;

const ssEszettVariants = (s) => {
  const withSS = s.replace(/ß/g, "ss");
  const withEszett = s.replace(/ss/g, "ß");
  return new Set([s, withSS, withEszett]);
};

const tryResolveBaseFromStem = (stem) => {
  if (!stem) return null;

  // 1) Directo + variantes ß↔ss
  for (const cand of ssEszettVariants(stem)) {
    if (isBase(cand)) return cand;
  }

  // 1.1) Probar con grafías ae/oe/ue → ä/ö/ü
  {
    const uml = TO_UMLAUT(stem);
    if (uml !== stem) {
      for (const cand of ssEszettVariants(uml)) {
        if (isBase(cand)) return cand;
      }
    }
  }

  // 1.2) También probar ae/oe/ue → a/o/u (útil cuando la BASE no lleva umlaut: groß)
  {
    const deDigraph = stem.replace(/ae/g, "a").replace(/oe/g, "o").replace(/ue/g, "u").replace(/Ae/g, "A").replace(/Oe/g, "O").replace(/Ue/g, "U");
    if (deDigraph !== stem) {
      for (const cand of ssEszettVariants(deDigraph)) {
        if (isBase(cand)) return cand; // p.ej., gross → groß
      }
    }
  }

  // 2) Heurísticas (p. ej., höh→hoch, fitt→fit) + variantes
  const fixed = applyReverseStemHeuristics(stem);
  if (fixed) {
    for (const cand of ssEszettVariants(fixed)) {
      if (isBase(cand)) return cand;
    }
  }

  // 3) Revertir umlaut (größ → gross) + variantes (→ groß)
  const deU = reverseUmlaut(stem);
  if (deU && deU !== stem) {
    for (const cand of ssEszettVariants(deU)) {
      if (isBase(cand)) return cand;
    }
  }

  // 4) Heurísticas después de revertir umlaut (por si aplica)
  const fixedDeU = applyReverseStemHeuristics(deU);
  if (fixedDeU) {
    for (const cand of ssEszettVariants(fixedDeU)) {
      if (isBase(cand)) return cand;
    }
  }

  // 5) Adjs en -el / -er que pierden la -e en el tema del comp/sup:
  //    dunkel → dunkler (stem "dunkl"), teuer → teurer (stem "teur")
  {
    // inserta 'e' antes de la última consonante
    const plusE = stem.replace(/([bcdfghjklmnpqrstvwxyz])$/i, "e$1");
    for (const cand of [plusE, TO_UMLAUT(plusE)]) {
      for (const v of ssEszettVariants(cand)) {
        if (isBase(v)) return v;
      }
    }
  }

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
  const input = String(inputRaw ?? "").trim();
  const notes = [];
  if (!input) {
    return {
      input,
      form: { core: "", ending: "" },
      degree: null,
      base: null,
      confidence: 0,
      notes: ["Entrada vacía"],
    };
  }

  // Trabajamos en minúsculas para el matching, pero preservamos `input` para reportar.
  const norm = input.toLowerCase();
  const stripA = stripDeclensionEnding(norm);

  const tryPath = (core, ending, tag) => {
    // 1) supletivos/irregulares (forma exacta del comparativo/superlativo)
    if (REVERSE_COMPARATIVES[core]) {
      const base = REVERSE_COMPARATIVES[core];
      const deg = isGradable(base) ? "comp" : null;
      return {
        input,
        form: { core, ending },
        degree: deg,
        base,
        confidence: deg ? 0.95 : 0.8,
        notes: [...notes, deg ? `Comparativo supletivo/irregular [${tag}]` : `Comparativo supletivo/irregular de adjetivo no gradable → normalizado a grado nulo [${tag}]`],
      };
    }
    if (REVERSE_SUPERLATIVES[core]) {
      const base = REVERSE_SUPERLATIVES[core];
      const deg = isGradable(base) ? "sup" : null;
      return {
        input,
        form: { core, ending },
        degree: deg,
        base,
        confidence: deg ? 0.95 : 0.8,
        notes: [...notes, deg ? `Superlativo supletivo/irregular [${tag}]` : `Superlativo supletivo/irregular de adjetivo no gradable → normalizado a grado nulo [${tag}]`],
      };
    }

    // 2) comparativo regular (−er)
    const compStem = peelComparative(core);
    if (compStem) {
      const base = tryResolveBaseFromStem(compStem) || tryResolveBaseFromStem(reverseUmlaut(compStem)) || REVERSE_COMPARATIVES[core];
      if (base) {
        const deg = isGradable(base) ? "comp" : null;
        return {
          input,
          form: { core, ending },
          degree: deg,
          base,
          confidence: deg ? 0.9 : 0.8,
          notes: [...notes, deg ? `Comparativo detectado [${tag}]` : `Comparativo de adjetivo no gradable → normalizado a grado nulo [${tag}]`],
        };
      }
    }

    // 3) superlativo regular (−st / −est)
    const supStem = peelSuperlative(core);
    if (supStem) {
      const base = tryResolveBaseFromStem(supStem) || tryResolveBaseFromStem(reverseUmlaut(supStem)) || REVERSE_SUPERLATIVES[core];
      if (base) {
        const deg = isGradable(base) ? "sup" : null;
        return {
          input,
          form: { core, ending },
          degree: deg,
          base,
          confidence: deg ? 0.88 : 0.8,
          notes: [...notes, deg ? `Superlativo detectado [${tag}]` : `Superlativo de adjetivo no gradable → normalizado a grado nulo [${tag}]`],
        };
      }
    }

    // 4) base exacta
    if (isBase(core)) {
      const deg = isGradable(core) ? "base" : null;
      return {
        input,
        form: { core, ending },
        degree: deg,
        base: core,
        confidence: deg ? 1 - (ending ? 0.05 : 0) : 0.8,
        notes: [...notes, deg ? `Base exacta [${tag}]` : `Base exacta de adjetivo no gradable → normalizado a grado nulo [${tag}]`],
      };
    }

    // 5) base tras revertir umlaut (+ variantes ß/ss)
    const maybeBase = reverseUmlaut(core);
    for (const cand of ssEszettVariants(maybeBase)) {
      if (isBase(cand)) {
        const deg = isGradable(cand) ? "base" : null;
        return {
          input,
          form: { core, ending },
          degree: deg,
          base: cand,
          confidence: deg ? 0.75 : 0.7,
          notes: [...notes, deg ? `Base tras revertir umlaut [${tag}]` : `Base tras revertir umlaut (no gradable) → grado nulo [${tag}]`],
        };
      }
    }

    return null;
  };

  // estrategia principal: “declinación primero”
  let analysed = tryPath(stripA.core, stripA.ending, "decl→grado");

  // --- Ambigüedad "-er": si puede ser comparativo, preferimos comparativo ---
  if (stripA.ending === "er") {
    const asDegree = tryPath(norm, "", "grado→(sin decl)");
    if (asDegree && asDegree.degree === "comp" && (!analysed || analysed.degree !== "comp")) {
      asDegree.confidence = Math.max(asDegree.confidence ?? 0, 0.92);
      asDegree.notes = [...(asDegree.notes ?? []), "Ambigüedad -er: preferido como comparativo"];
      analysed = asDegree;
    }
  }

  // fallbacks:
  // 1) si no hubo análisis y era 'er', ya reintentamos arriba
  // 2) reintento GENERAL sin pelar la terminación (útil p. ej. para participios base en -en: 'gelungen')
  if (!analysed) {
    analysed = tryPath(norm, "", "grado→(sin decl)");
  }

  if (!analysed) {
    return {
      input,
      form: stripA,
      degree: null,
      base: null,
      confidence: 0.15,
      notes: [...notes, "No parece una forma adjetival conocida."],
    };
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
