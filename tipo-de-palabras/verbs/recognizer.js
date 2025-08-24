// recognizer.js
import { IRREGULARS } from "./lemmas/IrregularVerbs.js";
import { REGULARS } from "./lemmas/RegularVerbs.js";
import { INSEPARABLE_PREFIXES, SEPARABLE_PREFIXES } from "./lemmas/prefixes.js";
import { AUX_BY_LEMMA } from "./lemmas/aux_by_lemma.js";
import { INSEPARABLES, AMBIGUOUS } from "./lemmas/inseparables.js";
import { AUXILIARIES } from "./lemmas/auxiliares.js";

const normalize = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFC")
    .replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, "");

const canonicalizeVerbish = (token = "") => {
  let s = normalize(token).replace(/[’]/g, "'");

  //  si hay guion, prueba con el primer segmento (kennen-Vibe -> kennen)
  if (s.includes("-")) s = s.split("-")[0];

  // 1) contracciones 's
  if (s.endsWith("'s")) s = s.slice(0, -2);

  // 2) coloquial sin apóstrofo
  const dropSEnds = /^(wird|geht|gibt|kann|sag|hab|hätt|bleibt|ist|hat)$/;
  if (s.endsWith("s")) {
    const base = s.slice(0, -1);
    if (dropSEnds.test(base)) s = base;
  }

  // 3) “geb” -> “gebe”
  if (s === "geb") s = "gebe";

  // 4) mapa coloquial
  const colloquialMap = { hätt: "hätte", hab: "habe", sag: "sage" };
  if (colloquialMap[s]) s = colloquialMap[s];

  return s;
};

let verbDictionaries = null;

/**
 * Si el lemma comienza con un prefijo separable, lo parte en {prefix, base}.
 * Devuelve null si no aplica.
 */
function splitSeparable(lemma) {
  // 1. Casos siempre inseparables
  if (INSEPARABLES.has(lemma)) return null;

  // 2. Casos ambiguos - por ahora, default a inseparable (significado más común)
  if (AMBIGUOUS.has(lemma)) {
    // TODO: En el futuro, analizar contexto para decidir
    // Por ahora, asumimos el significado más común (generalmente inseparable)
    return null;
  }

  // 3. Find potential separable prefix
  const pref = SEPARABLE_PREFIXES.filter((p) => lemma.startsWith(p)).sort((a, b) => b.length - a.length)[0];

  if (!pref) return null;

  const base = lemma.slice(pref.length);
  if (!base || !/^(.*?)(en|n)$/.test(base)) return null;

  // 4. Heuristics adicionales (mantenemos por seguridad)
  if (base.length < 4) return null;

  return { prefix: pref, base };
}

/**
 * Compone un paradigma separable a partir del paradigma del verbo base (regular o irregular).
 * - Finito (Präsens/Präteritum/Konjunktiv II): <formaBase> + ' ' + <prefijo>
 * - Partizip II: <prefijo> + <PartizipII(base)>
 * - Imperativ: <imperativoBase> + ' ' + <prefijo>  (p.ej. "nimm auf", "stell auf")
 * - zu-Infinitiv: <prefijo> + 'zu' + <base>  (p.ej. "abzuholen", "zurückzugehen")
 */
function buildSeparableCompoundFromBasePar(lemma, basePar, prefix, base) {
  const mapWithPrefixAtEnd = (obj = {}) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v + " " + prefix]));

  const mapWithPrefixAtStart = (obj = {}) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, prefix + v]));

  // Finito (posición V2/imperativo): base + ' ' + prefijo
  const praesens = mapWithPrefixAtEnd(basePar.praesens);
  const präteritum = mapWithPrefixAtEnd(basePar.präteritum);
  let konjunktiv2 = undefined;
  if (basePar.konjunktiv2) {
    konjunktiv2 = mapWithPrefixAtEnd(basePar.konjunktiv2);
  }

  // NUEVO — Finito en subordinadas (prefijo delante, pegado)
  const praesensSub = mapWithPrefixAtStart(basePar.praesens);
  const praeteritumSub = mapWithPrefixAtStart(basePar.präteritum);
  let konjunktiv2Sub = undefined;
  if (basePar.konjunktiv2) {
    konjunktiv2Sub = mapWithPrefixAtStart(basePar.konjunktiv2);
  }

  // Partizip II del separable: prefijo + partizip del base (pegado)
  let partizip2;
  if (typeof basePar.partizip2 === "string") {
    partizip2 = prefix + basePar.partizip2;
  } else if (basePar.partizip2 && typeof basePar.partizip2 === "object") {
    partizip2 = {};
    if (basePar.partizip2.aktiv) partizip2.aktiv = prefix + basePar.partizip2.aktiv;
    if (basePar.partizip2.passiv) partizip2.passiv = prefix + basePar.partizip2.passiv;
  }

  // Imperativ: base + ' ' + prefijo
  const imperativ = basePar.imperativ ? Object.fromEntries(Object.entries(basePar.imperativ).map(([k, v]) => [k, v + " " + prefix])) : {};

  // zu-Infinitiv correcto para separables:
  const zuInfinitiv = `${prefix}zu${base}`;

  const aux = AUX_BY_LEMMA[lemma] || AUX_BY_LEMMA[base] || basePar.aux || "haben";

  return {
    lemma,
    aux,
    praesens,
    präteritum,
    konjunktiv2,
    praesensSub,
    praeteritumSub,
    konjunktiv2Sub,
    partizip2,
    imperativ,
    zuInfinitiv,
  };
}

const buildRegular = (lemma) => {
  // Solo -en o -n
  const m = lemma.match(/^(.*?)(en|n)$/);
  if (!m) return null;

  // Si es separable, delegamos a la lógica compuesta usando el base regular
  const split = splitSeparable(lemma);
  if (split) {
    // construir paradigma del base (regular o irregular si existiera)
    const baseKey = normalize(split.base);
    const basePar = IRREGULARS[baseKey] || buildRegular(split.base);
    if (!basePar) return null;
    return buildSeparableCompoundFromBasePar(lemma, basePar, split.prefix, split.base);
  }

  let stem = m[1];

  // Para stems que acaban en s/ß/x/z, la terminación de du es -t (no -st)
  const hasSibilant = /[sßxz]$/.test(stem);

  let needsE = false;

  if (/[td]$/.test(stem)) {
    // Termina en t/d: siempre necesita -e-
    needsE = true;
  } else if (stem.endsWith("tm") || stem.endsWith("chn")) {
    // Casos específicos que necesitan -e-
    needsE = true;
  } else if (/[^aeiouäöüy][mn]$/.test(stem)) {
    // Consonante + m/n: verificar casos especiales
    // NO necesita -e- si es: mm, nn, hn, gn, etc.
    const endsInSafe = /mm$|nn$|hn$|gn$/.test(stem);
    needsE = !endsInSafe;
  }

  // Excepción: si tiene sibilante, no necesita -e- (anula las reglas anteriores)
  if (hasSibilant) {
    needsE = false;
  }

  const praesens = {
    ich: stem + "e",
    du: hasSibilant ? stem + "t" : stem + (needsE ? "est" : "st"),
    "er/sie/es": stem + (needsE ? "et" : "t"),
    wir: lemma,
    ihr: stem + (needsE ? "et" : "t"),
    "sie/Sie": lemma,
  };

  const präteritum = {
    ich: stem + (needsE ? "ete" : "te"),
    du: stem + (needsE ? "etest" : "test"),
    "er/sie/es": stem + (needsE ? "ete" : "te"),
    wir: stem + (needsE ? "eten" : "ten"),
    ihr: stem + (needsE ? "etet" : "tet"),
    "sie/Sie": stem + (needsE ? "eten" : "ten"),
  };

  let partizip2;

  const hasInseparablePrefix = INSEPARABLE_PREFIXES.some((p) => lemma.startsWith(p));

  if (hasInseparablePrefix) {
    partizip2 = stem + (needsE ? "et" : "t");
  } else {
    partizip2 = "ge" + stem + (needsE ? "et" : "t");
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
};

// =====================
// SELECCIÓN DE PARADIGMA
// =====================

export function getVerbParadigm(lemma) {
  const key = normalize(lemma);
  // 1) Irregular listado tal cual
  if (IRREGULARS[key]) return IRREGULARS[key];

  // 2) Separable (base irregular o regular) → construir compuesto
  const split = splitSeparable(lemma);
  if (split) {
    const baseKey = normalize(split.base);
    const basePar = IRREGULARS[baseKey] || buildRegular(split.base);
    if (basePar) {
      return buildSeparableCompoundFromBasePar(lemma, basePar, split.prefix, split.base);
    }
  }

  // 3) Regular "normal"
  return buildRegular(lemma);
}

// =====================
// DICCIONARIOS DE FORMAS
// =====================

export function generateVerbDictionaries(lemmas) {
  const finite = new Set();
  const participles = new Set();
  const imperatives = new Set();
  const infinitives = new Set();

  const formToLemma = new Map();

  const registerForm = (form, category, lemmaKey) => {
    if (!form) return;
    const normalizedForm = normalize(form);

    if (category === "finite") finite.add(normalizedForm);
    else if (category === "participle") participles.add(normalizedForm);
    else if (category === "imperative") imperatives.add(normalizedForm);
    else if (category === "infinitive") infinitives.add(normalizedForm);

    if (!formToLemma.has(normalizedForm)) {
      formToLemma.set(normalizedForm, []);
    }
    const arr = formToLemma.get(normalizedForm);
    if (!arr.includes(lemmaKey)) {
      arr.push(lemmaKey);
    }
  };

  // Helper para recorrer objetos de formas donde los valores pueden ser string o array
  const forEachForm = (obj, cb) => {
    if (!obj) return;
    Object.values(obj).forEach((val) => {
      if (Array.isArray(val)) val.forEach((v) => cb(v));
      else cb(val);
    });
  };

  for (const lemma of lemmas) {
    const paradigm = getVerbParadigm(lemma);
    if (!paradigm) continue;

    const lemmaKey = normalize(lemma);

    // Helpers locales que también registran la variante "pegada" si viene como bigrama
    const registerFinite = (form) => {
      if (!form) return;
      registerForm(form, "finite", lemmaKey);
      // Si es separable: "VERBO PREF" -> añadir "PREFVERBO"
      if (/\s/.test(form)) {
        const [v, pref] = form.split(/\s+/);
        if (SEPARABLE_PREFIXES.includes(pref)) {
          registerForm(pref + v, "finite", lemmaKey); // ej. "ein" + "steige" => "einsteige"
        }
      }
    };
    const registerImperative = (form) => {
      if (!form) return;
      registerForm(form, "imperative", lemmaKey);
      if (/\s/.test(form)) {
        const [v, pref] = form.split(/\s+/);
        if (SEPARABLE_PREFIXES.includes(pref)) {
          registerForm(pref + v, "imperative", lemmaKey);
        }
      }
    };

    // Finite (Präsens / Präteritum / Konjunktiv II)
    forEachForm(paradigm.praesens, registerFinite);
    forEachForm(paradigm.präteritum, registerFinite);
    forEachForm(paradigm.konjunktiv2, registerFinite);

    // soportar formas de subordinada pegadas (prefijo+verbo)
    forEachForm(paradigm.praesensSub, registerFinite);
    forEachForm(paradigm.praeteritumSub, registerFinite);
    forEachForm(paradigm.konjunktiv2Sub, registerFinite);

    // Participios (string o {aktiv, passiv})
    if (paradigm.partizip2) {
      if (typeof paradigm.partizip2 === "string") {
        registerForm(paradigm.partizip2, "participle", lemmaKey);
      } else {
        forEachForm(paradigm.partizip2, (p) => registerForm(p, "participle", lemmaKey));
      }
    }

    // Imperativos (omitimos “… Sie” para no introducir trigramas)
    if (paradigm.imperativ) {
      Object.entries(paradigm.imperativ).forEach(([person, form]) => {
        if (!form) return;
        if (/\bSie\b/i.test(form)) return;
        registerImperative(form);
      });
    }

    // Infinitivos: lemma y "zu-Infinitiv" sin espacios (p.ej. "abzuschließen")
    registerForm(paradigm.lemma, "infinitive", lemmaKey);
    if (paradigm.zuInfinitiv) {
      registerForm(paradigm.zuInfinitiv.replace(/\s+/g, ""), "infinitive", lemmaKey);
    }

    // Registrar auxiliar del paradigma para heurística de contexto
    if (paradigm.aux === "sein" || paradigm.aux === "haben") {
      AUXILIARIES.add(normalize(paradigm.aux));
    }
  }

  return {
    finite,
    participles,
    imperatives,
    infinitives,
    auxiliaries: AUXILIARIES,
    formToLemma,
  };
}

/**
 * Genera y cachea los diccionarios de verbos
 * @returns {Object} Diccionarios de formas verbales
 */
export const getVerbDictionaries = () => {
  if (!verbDictionaries) {
    const allVerbLemmas = Array.from(
      new Set([
        ...Object.keys(IRREGULARS),
        ...REGULARS,
        ...Object.keys(AUX_BY_LEMMA), // incluye lemas presentes solo en aux_by_lemma
      ])
    );
    verbDictionaries = generateVerbDictionaries(allVerbLemmas);
  }
  return verbDictionaries;
};

// =====================
// ANÁLISIS DE CONTEXTO VERBAL
// =====================

const analyzeVerbContext = (word, context = {}) => {
  const { tokens = [], currentIndex = 0, atSentenceStart = false } = context;

  const contextInfo = {
    hasAuxiliaryBefore: false,
    hasSubjectBefore: false,
    hasParticleBefore: false, // reservado por si luego detectas partículas antes
    isLikelyFinite: false,
    isLikelyParticiple: false,
    likelyRole: "unknown", // finite, participle, imperative, infinitive
    position: "unknown",
  };

  // Verificar auxiliar antes (para participios)
  if (currentIndex > 0) {
    const prevTokens = tokens.slice(Math.max(0, currentIndex - 3), currentIndex);
    for (const token of prevTokens) {
      const normalizedToken = canonicalizeVerbish(token);
      if (getVerbDictionaries().auxiliaries.has(normalizedToken)) {
        contextInfo.hasAuxiliaryBefore = true;
        break;
      }
    }
  }

  // Verificar sujeto antes (para verbos finitos)
  if (currentIndex > 0) {
    const prevToken = normalize(tokens[currentIndex - 1] || "");
    const pronouns = ["ich", "du", "er", "sie", "es", "wir", "ihr"];
    if (pronouns.includes(prevToken)) {
      contextInfo.hasSubjectBefore = true;
    }
  }

  // Determinar posición
  if (atSentenceStart) {
    contextInfo.position = "sentence_start";
    contextInfo.isLikelyFinite = true; // En alemán, los verbos al inicio suelen ser finitos
  } else if (currentIndex === tokens.length - 1) {
    contextInfo.position = "sentence_end";
  } else {
    contextInfo.position = "middle";
  }

  if (contextInfo.hasAuxiliaryBefore) {
    contextInfo.likelyRole = "participle";
    contextInfo.isLikelyParticiple = true;
  } else if (contextInfo.hasSubjectBefore || atSentenceStart) {
    contextInfo.likelyRole = "finite";
    contextInfo.isLikelyFinite = true;
  } else {
    if (word.startsWith("ge") && word.length > 4) {
      contextInfo.likelyRole = "participle";
      contextInfo.isLikelyParticiple = true;
    } else {
      contextInfo.likelyRole = "finite";
      contextInfo.isLikelyFinite = true;
    }
  }

  return contextInfo;
};

// =====================
// DETECTOR PRINCIPAL
// =====================

export const isVerb = (word, context = {}) => {
  const normalized = canonicalizeVerbish(word);
  const dictionaries = getVerbDictionaries();

  const result = {
    isVerb: false,
    confidence: 0,
    verbInfo: null,
    context: null,
    readings: [],
  };

  // Analizar contexto
  const contextInfo = analyzeVerbContext(word, context);

  // Lookup directo (formas de 1 palabra)
  let found = false;
  let possibleLemmas = [];

  if (dictionaries.finite.has(normalized)) {
    found = true;
    possibleLemmas = dictionaries.formToLemma.get(normalized) || possibleLemmas;
    result.readings.push({
      form: "finite",
      confidence: contextInfo.isLikelyFinite ? 0.9 : 0.7,
    });
  }

  if (dictionaries.participles.has(normalized)) {
    found = true;
    if (!possibleLemmas.length) {
      possibleLemmas = dictionaries.formToLemma.get(normalized) || [];
    }
    result.readings.push({
      form: "participle",
      confidence: contextInfo.isLikelyParticiple ? 0.9 : 0.6,
    });
  }

  if (dictionaries.imperatives.has(normalized)) {
    found = true;
    if (!possibleLemmas.length) {
      possibleLemmas = dictionaries.formToLemma.get(normalized) || [];
    }
    result.readings.push({
      form: "imperative",
      confidence: contextInfo.position === "sentence_start" ? 0.8 : 0.5,
    });
  }

  if (dictionaries.infinitives.has(normalized)) {
    found = true;
    if (!possibleLemmas.length) {
      possibleLemmas = dictionaries.formToLemma.get(normalized) || [];
    }
    result.readings.push({
      form: "infinitive",
      confidence: 0.7,
    });
  }

  // Bigrama: verbos separables finitos/imperativos (p.ej. "stelle auf", "ging zurück", "nimm auf", "schließ ab")
  if (context?.tokens && Number.isInteger(context.currentIndex)) {
    const next = context.tokens[context.currentIndex + 1];
    if (next) {
      const bigram = normalize(word + " " + next);
      if (dictionaries.finite.has(bigram)) {
        found = true;
        const lemmasBigram = dictionaries.formToLemma.get(bigram) || [];
        if (lemmasBigram.length) possibleLemmas = lemmasBigram;
        result.readings.push({
          form: "finite",
          confidence: 0.9,
        });
      }
      if (dictionaries.imperatives.has(bigram)) {
        found = true;
        const lemmasBigram = dictionaries.formToLemma.get(bigram) || [];
        if (lemmasBigram.length) possibleLemmas = lemmasBigram;
        result.readings.push({
          form: "imperative",
          confidence: 0.85,
        });
      }
    }
  }

  if (!found) {
    return result;
  }

  // Calcular confianza total
  let totalConfidence = 0;
  if (result.readings.length > 0) {
    totalConfidence = Math.max(...result.readings.map((r) => r.confidence));
  }

  // Bonificaciones contextuales
  if (contextInfo.hasAuxiliaryBefore && result.readings.some((r) => r.form === "participle")) {
    totalConfidence = Math.min(1.0, totalConfidence + 0.1);
  }

  if (contextInfo.hasSubjectBefore && result.readings.some((r) => r.form === "finite")) {
    totalConfidence = Math.min(1.0, totalConfidence + 0.1);
  }

  result.isVerb = true;
  result.confidence = totalConfidence;
  result.context = contextInfo;

  if (possibleLemmas.length > 0) {
    result.verbInfo = {
      lemma: possibleLemmas[0],
      allLemmas: possibleLemmas,
      readings: result.readings,
    };
  }

  return result;
};
