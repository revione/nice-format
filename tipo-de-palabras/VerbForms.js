// VerbForms.js - Versión corregida con normalización consistente y mejoras

// =====================
// 1) LÉXICO IRREGULARES (normalizado consistentemente)
// =====================
import { IRREGULARS } from "./verbs/IrregularVerbs.js";
import { REGULARS } from "./verbs/RegularVerbs.js";

const AUX_BY_LEMMA = {
  bleiben: "sein",
  passieren: "sein",
  reisen: "sein",
  // añade aquí cualquier regular que deba llevar "sein"
};

// =====================
// 2) PREFIJOS SEPARABLES E INSEPARABLES
// =====================
const SEPARABLE_PREFIXES = [
  "ab",
  "an",
  "auf",
  "aus",
  "bei",
  "dar",
  "da",
  "ein",
  "empor",
  "entgegen",
  "entlang",
  "fort",
  "frei",
  "gegen",
  "heim",
  "her",
  "hin",
  "los",
  "mit",
  "nach",
  "nieder",
  "rück",
  "um",
  "unter",
  "vor",
  "weg",
  "weiter",
  "zu",
  "zurück",
  "zusammen",
  "zwischen",
];

const INSEPARABLE_PREFIXES = [
  "be",
  "emp",
  "ent",
  "er",
  "ge",
  "miss",
  "ver",
  "zer",
  "de",
  "dis",
  "in",
  "re",
];

// =====================
// 3) GENERADOR REGULARES MEJORADO
// =====================
function buildRegular(lemma) {
  // Solo -en o -n
  const m = lemma.match(/^(.*?)(en|n)$/);
  if (!m) return null;

  let stem = m[1];

  // Para stems que acaban en s/ß/x/z, la terminación de du es -t (no -st)
  const hasSibilant = /[sßxz]$/.test(stem);

  // Ortografía: -t/-d/-m/-n finales → inserta "e" antes de -st/-t
  const needsE = /[tdmn]$/.test(stem) && !hasSibilant;

  const praesens = {
    ich: stem + "e",
    du: hasSibilant ? stem + "t" : stem + (needsE ? "est" : "st"),
    "er/sie/es": stem + (needsE ? "et" : "t"),
    wir: lemma,
    ihr: stem + (needsE ? "et" : "t"),
    "sie/Sie": lemma,
  };

  const präteritum = {
    ich: stem + "te",
    du: stem + (needsE ? "etest" : "test"),
    "er/sie/es": stem + "te",
    wir: stem + "ten",
    ihr: stem + (needsE ? "etet" : "tet"),
    "sie/Sie": stem + "ten",
  };

  let partizip2;

  // Verificar si tiene prefijo inseparable
  const hasInseparablePrefix = INSEPARABLE_PREFIXES.some((p) =>
    lemma.startsWith(p)
  );

  if (hasInseparablePrefix) {
    partizip2 = stem + "t";
  } else {
    // Verificar prefijo separable
    const separablePrefix = SEPARABLE_PREFIXES.find((p) => lemma.startsWith(p));
    if (separablePrefix) {
      const baseStem = lemma.slice(separablePrefix.length);
      const baseMatch = baseStem.match(/^(.*?)(en|n)$/);
      if (baseMatch) {
        partizip2 = separablePrefix + "ge" + baseMatch[1] + "t";
      } else {
        partizip2 = "ge" + stem + "t"; // fallback
      }
    } else {
      partizip2 = "ge" + stem + "t";
    }
  }

  const aux = AUX_BY_LEMMA[lemma] || "haben";

  return {
    lemma,
    aux,
    praesens,
    präteritum,
    partizip2,
    imperativ: {
      du: stem + (needsE ? "e" : ""),
      ihr: stem + (needsE ? "et" : "t"),
      Sie: lemma + " Sie",
    },
    zuInfinitiv: "zu " + lemma,
  };
}

// =====================
// 4) FUNCIÓN DE NORMALIZACIÓN CONSISTENTE
// =====================

function normalize(word) {
  return word.toLowerCase();
}

// =====================
// 5) API PÚBLICA MEJORADA
// =====================

/**
 * Devuelve el paradigma de un verbo.
 * - Si es irregular conocido: del léxico.
 * - Si no: genera paradigma regular (cubre la mayoría de -en).
 */
export function getVerbParadigm(lemma) {
  const key = normalize(lemma);
  if (IRREGULARS[key]) return IRREGULARS[key];
  return buildRegular(lemma);
}

/**
 * Diccionario listo para tu estructura 'palabra': { ... }

 */
export function buildVerbMap(lemmas) {
  const out = {};
  for (const l of lemmas) {
    const normalized = normalize(l);
    const p = getVerbParadigm(l);
    if (p) out[normalized] = p;
  }
  return out;
}

/**
 * Genera todos los diccionarios de formas verbales normalizados
 */
export function generateVerbDictionaries(lemmas) {
  const finite = new Set();
  const participles = new Set();
  const imperatives = new Set();

  const auxiliaries = new Set(
    [
      "sein",
      "haben",
      "werden",
      "ist",
      "sind",
      "war",
      "waren",
      "hat",
      "haben",
      "hatte",
      "hatten",
      "wird",
      "werden",
      "wurde",
      "wurden",
      "bin",
      "bist",
      "werde",
      "wirst",
      "werdet",
    ].map(normalize)
  );

  const formToLemma = new Map();

  for (const lemma of lemmas) {
    const paradigm = getVerbParadigm(lemma);
    if (!paradigm) continue;

    const normalizedLemma = normalize(lemma);

    // Función auxiliar para registrar forma→lema
    const registerForm = (form, category) => {
      if (!form) return;
      const normalizedForm = normalize(form);

      // Añadir a diccionario correspondiente
      if (category === "finite") finite.add(normalizedForm);
      else if (category === "participle") participles.add(normalizedForm);
      else if (category === "imperative") imperatives.add(normalizedForm);

      // Registrar en mapa forma→lema
      if (!formToLemma.has(normalizedForm)) {
        formToLemma.set(normalizedForm, []);
      }
      if (!formToLemma.get(normalizedForm).includes(normalizedLemma)) {
        formToLemma.get(normalizedForm).push(normalizedLemma);
      }
    };

    // Formas finitas (presente y pretérito)
    Object.values(paradigm.praesens || {}).forEach((form) => {
      registerForm(form, "finite");
    });
    Object.values(paradigm.präteritum || {}).forEach((form) => {
      registerForm(form, "finite");
    });

    // Konjunktiv II si existe
    if (paradigm.konjunktiv2) {
      Object.values(paradigm.konjunktiv2).forEach((form) => {
        registerForm(form, "finite");
      });
    }

    // Participios
    if (paradigm.partizip2) {
      registerForm(paradigm.partizip2, "participle");
    }

    // Imperativos
    Object.values(paradigm.imperativ || {}).forEach((form) => {
      if (form && !form.includes(" ")) {
        // excluir "machen Sie" etc.
        registerForm(form, "imperative");
      }
    });

    // Auxiliares específicos del paradigma
    if (paradigm.aux === "sein" || paradigm.aux === "haben") {
      auxiliaries.add(normalize(paradigm.aux));
    }
  }

  return {
    finite,
    participles,
    imperatives,
    auxiliaries,
    formToLemma, // NUEVA: mapa para rendimiento
  };
}

/**
 * Exportar lista de irregulares para uso externo
 */
export function getIrregularVerbs() {
  return Object.keys(IRREGULARS);
}

/**
 * Verificar si un verbo es irregular
 */
export function isIrregularVerb(lemma) {
  return IRREGULARS.hasOwnProperty(normalize(lemma));
}

/**
 * Obtener información sobre prefijos
 */
export function getPrefixInfo(verb) {
  const normalized = normalize(verb);

  const separablePrefix = SEPARABLE_PREFIXES.find((p) =>
    normalized.startsWith(p)
  );
  const inseparablePrefix = INSEPARABLE_PREFIXES.find((p) =>
    normalized.startsWith(p)
  );

  return {
    separable: separablePrefix || null,
    inseparable: inseparablePrefix || null,
    hasSeparablePrefix: !!separablePrefix,
    hasInseparablePrefix: !!inseparablePrefix,
  };
}
