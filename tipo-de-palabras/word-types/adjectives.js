// ==============================
// Adjetivos en alemán — Sistema optimizado
// ==============================

// [... mantener toda la parte de KASE, GENUS, DET, adj(), ENDINGS, ADJECTIVES igual ...]
// Casos / género / número / determinante
export const KASE = { NOM: "nom", AKK: "akk", DAT: "dat", GEN: "gen" };
export const GENUS = { M: "m", F: "f", N: "n", PL: "pl" };
export const DET = { DEF: "def", INDEF: "indef", NONE: "none" }; // der/die/das | ein | sin determinante (fuerte)

// Helper de adjetivo
function adj({ lemma, comp = null, sup = null, indeclinable = false, domains = [], notes = [] }) {
  return {
    lemma: String(lemma).toLowerCase(),
    display: lemma[0].toUpperCase() + lemma.slice(1),
    comp,
    sup,
    indeclinable,
    domains,
    notes,
  };
}

// Tabla de terminaciones (attributive adjectives)
const ENDINGS = {
  [DET.DEF]: {
    // débil después de der/die/das
    [`${KASE.NOM}|${GENUS.M}`]: "e",
    [`${KASE.NOM}|${GENUS.F}`]: "e",
    [`${KASE.NOM}|${GENUS.N}`]: "e",
    [`${KASE.NOM}|${GENUS.PL}`]: "en",
    [`${KASE.AKK}|${GENUS.M}`]: "en",
    [`${KASE.AKK}|${GENUS.F}`]: "e",
    [`${KASE.AKK}|${GENUS.N}`]: "e",
    [`${KASE.AKK}|${GENUS.PL}`]: "en",
    [`${KASE.DAT}|${GENUS.M}`]: "en",
    [`${KASE.DAT}|${GENUS.F}`]: "en",
    [`${KASE.DAT}|${GENUS.N}`]: "en",
    [`${KASE.DAT}|${GENUS.PL}`]: "en",
    [`${KASE.GEN}|${GENUS.M}`]: "en",
    [`${KASE.GEN}|${GENUS.F}`]: "en",
    [`${KASE.GEN}|${GENUS.N}`]: "en",
    [`${KASE.GEN}|${GENUS.PL}`]: "en",
  },
  [DET.INDEF]: {
    // mixta después de ein/kein/mein…
    [`${KASE.NOM}|${GENUS.M}`]: "er",
    [`${KASE.NOM}|${GENUS.F}`]: "e",
    [`${KASE.NOM}|${GENUS.N}`]: "es",
    [`${KASE.NOM}|${GENUS.PL}`]: "en",
    [`${KASE.AKK}|${GENUS.M}`]: "en",
    [`${KASE.AKK}|${GENUS.F}`]: "e",
    [`${KASE.AKK}|${GENUS.N}`]: "es",
    [`${KASE.AKK}|${GENUS.PL}`]: "en",
    [`${KASE.DAT}|${GENUS.M}`]: "en",
    [`${KASE.DAT}|${GENUS.F}`]: "en",
    [`${KASE.DAT}|${GENUS.N}`]: "en",
    [`${KASE.DAT}|${GENUS.PL}`]: "en",
    [`${KASE.GEN}|${GENUS.M}`]: "en",
    [`${KASE.GEN}|${GENUS.F}`]: "en",
    [`${KASE.GEN}|${GENUS.N}`]: "en",
    [`${KASE.GEN}|${GENUS.PL}`]: "en",
  },
  [DET.NONE]: {
    // fuerte sin determinante
    [`${KASE.NOM}|${GENUS.M}`]: "er",
    [`${KASE.NOM}|${GENUS.F}`]: "e",
    [`${KASE.NOM}|${GENUS.N}`]: "es",
    [`${KASE.NOM}|${GENUS.PL}`]: "e",
    [`${KASE.AKK}|${GENUS.M}`]: "en",
    [`${KASE.AKK}|${GENUS.F}`]: "e",
    [`${KASE.AKK}|${GENUS.N}`]: "es",
    [`${KASE.AKK}|${GENUS.PL}`]: "e",
    [`${KASE.DAT}|${GENUS.M}`]: "em",
    [`${KASE.DAT}|${GENUS.F}`]: "er",
    [`${KASE.DAT}|${GENUS.N}`]: "em",
    [`${KASE.DAT}|${GENUS.PL}`]: "en",
    [`${KASE.GEN}|${GENUS.M}`]: "en",
    [`${KASE.GEN}|${GENUS.F}`]: "er",
    [`${KASE.GEN}|${GENUS.N}`]: "en",
    [`${KASE.GEN}|${GENUS.PL}`]: "er",
  },
};

// ==============================
// LEMAS
// ==============================
export const ADJECTIVES = [
  // Colores
  adj({ lemma: "rot", domains: ["color"] }),
  adj({ lemma: "blau", domains: ["color"] }),
  adj({ lemma: "grün", domains: ["color"] }),
  adj({ lemma: "gelb", domains: ["color"] }),
  adj({ lemma: "schwarz", domains: ["color"] }),
  adj({ lemma: "weiß", domains: ["color"] }),
  adj({ lemma: "braun", domains: ["color"] }),
  adj({ lemma: "grau", domains: ["color"] }),
  adj({ lemma: "rosa", indeclinable: true, domains: ["color"], notes: ["frecuentemente indeclinable"] }),
  adj({ lemma: "lila", indeclinable: true, domains: ["color"], notes: ["frecuentemente indeclinable"] }),
  adj({ lemma: "orange", indeclinable: true, domains: ["color"], notes: ["frecuentemente indeclinable"] }),
  adj({ lemma: "violett", domains: ["color"] }),
  adj({ lemma: "hellgrün", domains: ["color"], notes: ["compuesto de color"] }),
  adj({ lemma: "dunkelblau", domains: ["color"], notes: ["compuesto de color"] }),

  // Tamaño / forma / medidas
  adj({ lemma: "groß", comp: "größer", sup: "am größten", domains: ["size"] }),
  adj({ lemma: "klein", comp: "kleiner", sup: "am kleinsten", domains: ["size"] }),
  adj({ lemma: "lang", comp: "länger", sup: "am längsten", domains: ["size", "length"] }),
  adj({ lemma: "kurz", comp: "kürzer", sup: "am kürzesten", domains: ["size", "length"] }),
  adj({ lemma: "hoch", comp: "höher", sup: "am höchsten", domains: ["size", "height"], notes: ["irregular (umlaut)"] }),
  adj({ lemma: "niedrig", comp: "niedriger", sup: "am niedrigsten", domains: ["size", "height"] }),
  adj({ lemma: "breit", comp: "breiter", sup: "am breitesten", domains: ["size", "width"] }),
  adj({ lemma: "schmal", comp: "schmaler", sup: "am schmalsten", domains: ["size", "width"] }),
  adj({ lemma: "dick", comp: "dicker", sup: "am dicksten", domains: ["size", "thickness"] }),
  adj({ lemma: "dünn", comp: "dünner", sup: "am dünnsten", domains: ["size", "thickness"] }),
  adj({ lemma: "oval", domains: ["shape"] }),
  adj({ lemma: "schief", domains: ["shape", "quality"] }),
  adj({ lemma: "weitläufig", comp: "weitläufiger", sup: "am weitläufigsten", domains: ["size", "space"] }),

  // Cualidades generales
  adj({ lemma: "gut", comp: "besser", sup: "am besten", domains: ["quality"], notes: ["irregular"] }),
  adj({ lemma: "schlecht", comp: "schlechter", sup: "am schlechtesten", domains: ["quality"] }),
  adj({ lemma: "neu", comp: "neuer", sup: "am neuesten", domains: ["time", "quality"] }),
  adj({ lemma: "alt", comp: "älter", sup: "am ältesten", domains: ["time", "quality"] }),
  adj({ lemma: "jung", comp: "jünger", sup: "am jüngsten", domains: ["time", "quality"] }),
  adj({ lemma: "leicht", comp: "leichter", sup: "am leichtesten", domains: ["weight", "difficulty"] }),
  adj({ lemma: "schwer", comp: "schwerer", sup: "am schwersten", domains: ["weight", "difficulty"] }),
  adj({ lemma: "hell", comp: "heller", sup: "am hellsten", domains: ["light"] }),
  adj({ lemma: "dunkel", comp: "dunkler", sup: "am dunkelsten", domains: ["light"] }),
  adj({ lemma: "schön", comp: "schöner", sup: "am schönsten", domains: ["aesthetics"] }),
  adj({ lemma: "einfach", comp: "einfacher", sup: "am einfachsten", domains: ["difficulty"] }),
  adj({ lemma: "perfekt", comp: "perfekter", sup: "am perfektesten", domains: ["quality"] }),
  adj({ lemma: "schlicht", comp: "schlichter", sup: "am schlichtesten", domains: ["aesthetics"] }),
  adj({ lemma: "warm", comp: "wärmer", sup: "am wärmsten", domains: ["temperature"], notes: ["umlaut"] }),
  adj({ lemma: "kalt", comp: "kälter", sup: "am kältesten", domains: ["temperature"], notes: ["umlaut"] }),
  adj({ lemma: "sanft", comp: "sanfter", sup: "am sanftesten", domains: ["touch", "mood"] }),
  adj({ lemma: "natürlich", comp: "natürlicher", sup: "am natürlichsten", domains: ["quality"] }),
  adj({ lemma: "technisch", comp: "technischer", sup: "am technischsten", domains: ["technical"] }),
  adj({ lemma: "unsichtbar", comp: "unsichtbarer", sup: "am unsichtbarsten", domains: ["visibility"] }),
  adj({ lemma: "visuell", comp: "visueller", sup: "am visuellsten", domains: ["visual"] }),
  adj({ lemma: "wichtig", comp: "wichtiger", sup: "am wichtigsten", domains: ["quality"] }),
  adj({ lemma: "möglich", comp: "möglicher", sup: "am möglichsten", domains: ["quality"] }),
  adj({ lemma: "verschieden", comp: "verschiedener", sup: "am verschiedensten", domains: ["quality"] }),
  adj({ lemma: "besonder", comp: "besonderer", sup: "am besondersten", domains: ["quality"], notes: ["stem 'besonder' + endings"] }),
  adj({ lemma: "eigen", comp: "eigener", sup: "am eigensten", domains: ["quality"] }),
  adj({ lemma: "sauber", comp: "sauberer", sup: "am saubersten", domains: ["quality"] }),
  adj({ lemma: "klar", comp: "klarer", sup: "am klarsten", domains: ["quality", "visual"] }),
  adj({ lemma: "ausdrucksstark", comp: "ausdrucksstärker", sup: "am ausdrucksstärksten", domains: ["quality", "aesthetics"] }),
  adj({ lemma: "produktiv", comp: "produktiver", sup: "am produktivsten", domains: ["quality"] }),
  adj({ lemma: "direkt", comp: "direkter", sup: "am direktesten", domains: ["manner"] }),

  // Estados / emociones
  adj({ lemma: "müde", comp: "müder", sup: "am müdesten", domains: ["state"] }),
  adj({ lemma: "wach", comp: "wacher", sup: "am wachsten", domains: ["state"] }),
  adj({ lemma: "hungrig", comp: "hungriger", sup: "am hungrigsten", domains: ["state"] }),
  adj({ lemma: "satt", comp: "satter", sup: "am sattesten", domains: ["state"] }),
  adj({ lemma: "durstig", comp: "durstiger", sup: "am durstigsten", domains: ["state"] }),
  adj({ lemma: "glücklich", comp: "glücklicher", sup: "am glücklichsten", domains: ["emotion"] }),
  adj({ lemma: "traurig", comp: "trauriger", sup: "am traurigsten", domains: ["emotion"] }),
  adj({ lemma: "fröhlich", comp: "fröhlicher", sup: "am fröhlichsten", domains: ["emotion"] }),
  adj({ lemma: "ernst", comp: "ernster", sup: "am ernstesten", domains: ["emotion"] }),
  adj({ lemma: "ruhig", comp: "ruhiger", sup: "am ruhigsten", domains: ["emotion"] }),
  adj({ lemma: "nervös", comp: "nervöser", sup: "am nervösesten", domains: ["emotion"] }),
  adj({ lemma: "ängstlich", comp: "ängstlicher", sup: "am ängstlichsten", domains: ["emotion"] }),
  adj({ lemma: "mutig", comp: "mutiger", sup: "am mutigsten", domains: ["emotion"] }),
  adj({ lemma: "sicher", comp: "sicherer", sup: "am sichersten", domains: ["emotion", "quality"] }),
  adj({ lemma: "unsicher", comp: "unsicherer", sup: "am unsichersten", domains: ["emotion", "quality"] }),
  adj({ lemma: "freundlich", comp: "freundlicher", sup: "am freundlichsten", domains: ["emotion", "social"] }),
  adj({ lemma: "entspannt", comp: "entspannter", sup: "am entspanntesten", domains: ["emotion", "state"], notes: ["Part. II als Adj."] }),

  // Tiempo
  adj({ lemma: "heutig", domains: ["time"], notes: ["'de hoy', 'actual'"] }),
  adj({ lemma: "nächst", domains: ["time"], notes: ["superlative stem de 'nah'; significado lexicalizado 'próximo/siguiente'"] }),

  // Posición
  adj({ lemma: "ober", domains: ["position"], notes: ["upper, used in compounds"] }),
  adj({ lemma: "unter", domains: ["position"], notes: ["under, used in compounds"] }),
  adj({ lemma: "mittler", comp: "mittlerer", sup: "am mittlersten", domains: ["position"], notes: ["stem 'mittler' + endings"] }),

  // Participios usados como adjetivos
  adj({ lemma: "ausgerichtet", domains: ["layout"], notes: ["Part. II als Adj."] }),
  adj({ lemma: "gekämmt", domains: ["appearance"], notes: ["Part. II als Adj."] }),
  adj({ lemma: "proportioniert", domains: ["appearance"], notes: ["Part. II als Adj."] }),
  adj({ lemma: "ausgeprägt", comp: "ausgeprägter", sup: "am ausgeprägtesten", domains: ["quality"], notes: ["Part. II als Adj."] }),
  adj({ lemma: "geöffnet", domains: ["state"], notes: ["Part. II als Adj."] }),
  adj({ lemma: "geschlossen", domains: ["state"], notes: ["Part. II als Adj."] }),

  // Otros
  adj({ lemma: "unscharf", comp: "unschärfer", sup: "am unschärfsten", domains: ["visual"] }),

  // Comparatives/superlatives como lemas separados
  adj({ lemma: "besser", domains: ["quality"], notes: ["comparative of gut"] }),
  adj({ lemma: "größer", domains: ["size"], notes: ["comparative of groß"] }),
  adj({ lemma: "kleinst", domains: ["size"], notes: ["superlative stem"] }),
  adj({ lemma: "leiser", domains: ["sound"], notes: ["comparative of leise"] }),
  adj({ lemma: "lauter", domains: ["sound"], notes: ["comparative of laut"] }),

  // Calidad
  adj({ lemma: "frisch", comp: "frischer", sup: "am frischesten", domains: ["quality"] }),
  adj({ lemma: "best", domains: ["quality"], notes: ["superlative stem de 'gut' (attributivo: beste/besten)"] }),

  // Idiomas / gentilicios
  adj({ lemma: "englisch", domains: ["language"] }),

  // Ordinales (números → adjetivos)
  adj({ lemma: "erst", domains: ["number"], notes: ["ordinal stem 'primero' + terminaciones"] }),
  adj({ lemma: "zweit", domains: ["number"], notes: ["ordinal stem 'segundo' + terminaciones"] }),
  adj({ lemma: "hundertst", domains: ["number"], notes: ["ordinal stem 'centésimo' + terminaciones"] }),

  // Participios como adjetivos
  adj({ lemma: "aufgenommen", domains: ["state"], notes: ["Part. II als Adj. ('grabado')"] }),
];

// ==============================
// BLOQUES POR DOMINIO
// ==============================
function byDomain(domain) {
  return ADJECTIVES.filter((a) => a.domains.includes(domain)).map((a) => a.lemma);
}

export const BLOCKS_ADJ = {
  COLOR: byDomain("color"),
  SIZE: byDomain("size"),
  LENGTH: byDomain("length"),
  HEIGHT: byDomain("height"),
  WIDTH: byDomain("width"),
  THICKNESS: byDomain("thickness"),
  SHAPE: byDomain("shape"),
  QUALITY: byDomain("quality"),
  DIFFICULTY: byDomain("difficulty"),
  LIGHT: byDomain("light"),
  TEMPERATURE: byDomain("temperature"),
  AESTHETICS: byDomain("aesthetics"),
  TECHNICAL: byDomain("technical"),
  VISUAL: byDomain("visual"),
  STATE: byDomain("state"),
  EMOTION: byDomain("emotion"),
  LAYOUT: byDomain("layout"),
  APPEARANCE: byDomain("appearance"),
  TOUCH: byDomain("touch"),
  VISIBILITY: byDomain("visibility"),
  TIME: byDomain("time"),
  SOCIAL: byDomain("social"),
  MANNER: byDomain("manner"),
  POSITION: byDomain("position"),
  SPACE: byDomain("space"),
  SOUND: byDomain("sound"),
  LANGUAGE: byDomain("language"),
  NUMBER: byDomain("number"),
};

// ==============================
// FUNCIONES UTILITARIAS CORE
// ==============================
const normalize = (word) => (word ? word.toLowerCase() : "");

// Índice principal
export const ADJ_INDEX = Object.fromEntries(ADJECTIVES.map((a) => [a.lemma, a]));

// declinador básico (attributive)
export function declineAdj(lemma, { det = DET.NONE, kase = KASE.NOM, genus = GENUS.M } = {}) {
  const a = ADJ_INDEX[lemma] || ADJ_INDEX[normalize(lemma)];
  if (!a) return null;
  if (a.indeclinable) return a.lemma;
  const key = `${kase}|${genus}`;
  const end = ENDINGS[det]?.[key];
  return end != null ? a.lemma + end : a.lemma;
}

// ==============================
// SISTEMA DE DETECCIÓN - SOLO FUNCIONES NECESARIAS
// ==============================

// Generar todas las formas declinadas de un adjetivo
function generateAllDeclinedForms(lemma) {
  const forms = new Set();
  const adjective = ADJ_INDEX[normalize(lemma)];

  if (!adjective) return forms;

  if (adjective.indeclinable) {
    forms.add(adjective.lemma);
    return forms;
  }

  for (const det of Object.values(DET)) {
    for (const kase of Object.values(KASE)) {
      for (const genus of Object.values(GENUS)) {
        const declined = declineAdj(lemma, { det, kase, genus });
        if (declined && declined !== lemma) {
          forms.add(declined);
        }
      }
    }
  }

  forms.add(adjective.lemma);
  return forms;
}

// Construir diccionario de formas → lemas
function buildAdjectiveFormsDictionary() {
  const formToLemma = new Map();
  const allForms = new Set();

  for (const adj of ADJECTIVES) {
    const lemma = adj.lemma;
    const forms = generateAllDeclinedForms(lemma);

    for (const form of forms) {
      const normalizedForm = normalize(form);
      allForms.add(normalizedForm);

      if (!formToLemma.has(normalizedForm)) {
        formToLemma.set(normalizedForm, []);
      }
      if (!formToLemma.get(normalizedForm).includes(lemma)) {
        formToLemma.get(normalizedForm).push(lemma);
      }
    }
  }

  return { formToLemma, allForms };
}

// Cache del diccionario
let adjectiveDictionary = null;

function getAdjectiveDictionary() {
  if (!adjectiveDictionary) {
    adjectiveDictionary = buildAdjectiveFormsDictionary();
  }
  return adjectiveDictionary;
}

// Análisis de contexto básico
function analyzeAdjectiveContext(word, context) {
  const { tokens = [], currentIndex = 0, atSentenceStart = false } = context;

  const contextInfo = {
    hasArticleBefore: false,
    hasNounAfter: false,
    isAttributive: false,
    isPredicate: false,
    position: "unknown",
  };

  // Detectar artículo antes
  if (currentIndex > 0) {
    const prevToken = normalize(tokens[currentIndex - 1] || "");
    const articleIndicators = ["der", "die", "das", "ein", "eine", "einen", "einem", "einer", "eines"];
    contextInfo.hasArticleBefore = articleIndicators.includes(prevToken);
  }

  // Detectar sustantivo después
  if (currentIndex < tokens.length - 1) {
    const nextToken = tokens[currentIndex + 1] || "";
    contextInfo.hasNounAfter = /^[A-ZÄÖÜ]/.test(nextToken);
  }

  // Determinar uso
  if (contextInfo.hasArticleBefore || contextInfo.hasNounAfter) {
    contextInfo.isAttributive = true;
  } else {
    // Buscar verbo copulativo antes
    for (let i = Math.max(0, currentIndex - 3); i < currentIndex; i++) {
      const token = normalize(tokens[i] || "");
      if (["ist", "sind", "war", "waren", "wird", "werden", "bleibt", "bleiben"].includes(token)) {
        contextInfo.isPredicate = true;
        break;
      }
    }
  }

  // Posición en la oración
  if (atSentenceStart) {
    contextInfo.position = "sentence_start";
  } else if (currentIndex === tokens.length - 1) {
    contextInfo.position = "sentence_end";
  } else {
    contextInfo.position = "middle";
  }

  return contextInfo;
}

// ==============================
// FUNCIONES PRINCIPALES DE DETECCIÓN
// ==============================

function analyzeDeclension(form, lemma) {
  const adjective = ADJ_INDEX[lemma];
  if (!adjective || adjective.indeclinable) return null;

  for (const det of Object.values(DET)) {
    for (const kase of Object.values(KASE)) {
      for (const genus of Object.values(GENUS)) {
        const declined = declineAdj(lemma, { det, kase, genus });
        if (normalize(declined) === normalize(form)) {
          return {
            determinant: det,
            case: kase,
            gender: genus,
            form: declined,
          };
        }
      }
    }
  }

  return null;
}

export function isAdjective(word, context = {}) {
  const normalized = normalize(word);
  const dict = getAdjectiveDictionary();

  const result = {
    isAdjective: false,
    lemma: null,
    forms: [],
    confidence: 0,
    context: null,
    domains: [],
    isDeclined: false,
    declensionInfo: null,
  };

  if (!dict.allForms.has(normalized)) {
    return result;
  }

  const possibleLemmas = dict.formToLemma.get(normalized) || [];
  if (possibleLemmas.length === 0) {
    return result;
  }

  const lemma = possibleLemmas[0];
  const adjective = ADJ_INDEX[lemma];
  if (!adjective) {
    return result;
  }

  const contextInfo = analyzeAdjectiveContext(word, context);
  const isDeclined = normalized !== lemma;

  let confidence = 0.8;
  if (contextInfo.hasNounAfter) confidence += 0.1;
  if (contextInfo.hasArticleBefore) confidence += 0.05;
  if (contextInfo.isAttributive) confidence += 0.05;

  result.isAdjective = true;
  result.lemma = lemma;
  result.forms = Array.from(generateAllDeclinedForms(lemma));
  result.confidence = Math.min(1.0, confidence);
  result.context = contextInfo;
  result.domains = adjective.domains || [];
  result.isDeclined = isDeclined;

  return result;
}

export function enhancedAdjectiveDetection(word, context = {}) {
  // Primero usar el sistema robusto
  const result = isAdjective(word, context);

  if (result.isAdjective) {
    return {
      isAdjective: true,
      confidence: result.confidence,
      lemma: result.lemma,
      info: result,
    };
  }

  // Fallback heurístico
  const normalized = normalize(word);
  const adjectiveSuffixes = ["lich", "ig", "isch", "los", "voll", "reich", "arm", "frei", "bar", "sam", "haft", "weise"];

  for (const suffix of adjectiveSuffixes) {
    if (normalized.endsWith(suffix)) {
      return {
        isAdjective: true,
        confidence: 0.6,
        lemma: normalized,
        info: { isHeuristic: true, suffix },
      };
    }
  }

  return {
    isAdjective: false,
    confidence: 0,
    lemma: null,
    info: null,
  };
}

export function isLikelyDeclinedAdjective(word) {
  const w = normalize(word);
  const endings = ["e", "en", "em", "er", "es"];

  if (!endings.some((end) => w.endsWith(end))) {
    return false;
  }

  for (const ending of endings) {
    if (w.endsWith(ending)) {
      const stem = w.slice(0, -ending.length);
      if (ADJ_INDEX[stem]) {
        return true;
      }
      // Verificar si parece adjetivo por sufijo
      const suffixes = ["lich", "ig", "isch", "los", "voll", "reich", "arm", "frei", "bar", "sam", "haft", "weise"];
      if (suffixes.some((suffix) => stem.endsWith(suffix))) {
        return true;
      }
    }
  }

  return false;
}

// ==============================
// FUNCIONES UTILITARIAS ADICIONALES (opcionales, para compatibilidad)
// ==============================

export function getAdjectivesByDomain(domain) {
  return ADJECTIVES.filter((adj) => adj.domains.includes(domain)).map((adj) => adj.lemma);
}

export function getAllFormsOf(lemma) {
  return Array.from(generateAllDeclinedForms(lemma));
}

// Esta función es usada en identifyWordType.js línea 502
export function getAdjectiveInfo(word, context = {}) {
  const result = isAdjective(word, context);

  if (!result.isAdjective) {
    return {
      word,
      isAdjective: false,
      reason: "No adjective found",
    };
  }

  const adjective = ADJ_INDEX[result.lemma];

  return {
    word,
    isAdjective: true,
    lemma: result.lemma,
    display: adjective.display,
    comparative: adjective.comp,
    superlative: adjective.sup,
    indeclinable: adjective.indeclinable,
    domains: adjective.domains,
    notes: adjective.notes,
    allForms: result.forms,
    isDeclined: result.isDeclined,
    declensionInfo: result.declensionInfo,
    contextAnalysis: result.context,
    confidence: result.confidence,
  };
}

export const ALL_ADJECTIVES = Array.from(new Set(ADJECTIVES.flatMap((a) => [a.lemma, ...(a.comp ? [a.comp] : []), ...(a.sup ? [a.sup] : [])])));
