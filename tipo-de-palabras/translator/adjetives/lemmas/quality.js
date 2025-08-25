import { flatteAdj } from "../utils/builders.js";

// --- evaluation ---
export const EVALUATION_FORMS = [
  { base: { de: "gut", es: "bueno/a" }, comp: { de: "besser", es: "mejor" }, sup: { de: "best", es: "el/la mejor" }, irregularities: ["suppletive"] },
  { base: { de: "schlecht", es: "malo/a" } },
  { base: { de: "schön", es: "hermoso/a, bonito/a" } },
  { base: { de: "perfekt", es: "perfecto/a" } },
  { base: { de: "schlicht", es: "sencillo/a" } },
  { base: { de: "ausdrucksstark", es: "expresivo/a" }, irregularities: ["umlaut"] },
  { base: { de: "typisch", es: "típico/a" } },
  { base: { de: "klassisch", es: "clásico/a" } },
  { base: { de: "episch", es: "épico/a" } },
  { base: { de: "magisch", es: "mágico/a" } },
  { base: { de: "satirisch", es: "satírico/a" } },
  { base: { de: "authentisch", es: "auténtico/a" } },
  { base: { de: "normal", es: "normal" } },
  { base: { de: "prominent", es: "prominente, sobresaliente" } },
  { base: { de: "interessant", es: "interesante" } },
];

// --- age ---
export const AGE_FORMS = [
  { base: { de: "neu", es: "nuevo/a" } },
  { base: { de: "alt", es: "viejo/a" }, irregularities: ["umlaut"] },
  { base: { de: "jung", es: "joven" }, irregularities: ["umlaut"] },
];

// --- difficulty ---
export const DIFFICULTY_FORMS = [
  { base: { de: "leicht", es: "ligero/a, fácil" } },
  { base: { de: "schwer", es: "pesado/a, difícil" } },
  { base: { de: "einfach", es: "simple, fácil" } },
  { base: { de: "produktiv", es: "productivo/a" } },
  { base: { de: "direkt", es: "directo/a" } },
];

// --- brightness ---
export const BRIGHTNESS_FORMS = [{ base: { de: "hell", es: "claro/a, luminoso/a" } }, { base: { de: "dunkel", es: "oscuro/a" } }];

// --- temperature ---
export const TEMPERATURE_FORMS = [
  { base: { de: "warm", es: "cálido/a" }, irregularities: ["umlaut"] },
  { base: { de: "kalt", es: "frío/a" }, irregularities: ["umlaut"] },
  { base: { de: "heiß", es: "caliente" } },
];

// --- nature/tech ---
export const NATURE_TECH_FORMS = [{ base: { de: "natürlich", es: "natural" } }, { base: { de: "technisch", es: "técnico/a" } }, { base: { de: "automatisch", es: "automático/a" } }];

// --- visibility / clarity ---
export const VISIBILITY_FORMS = [
  { base: { de: "unsichtbar", es: "invisible" } },
  { base: { de: "visuell", es: "visual" } },
  { base: { de: "klar", es: "claro/a" } },
  { base: { de: "sauber", es: "limpio/a" } },
  { base: { de: "frisch", es: "fresco/a" } },
  { base: { de: "spitz", es: "puntiagudo/a" } },
  { base: { de: "konkret", es: "concreto/a" } },
];

// --- importance/modality ---
export const IMPORTANCE_MODALITY_FORMS = [{ base: { de: "wichtig", es: "importante" } }, { base: { de: "möglich", es: "posible" } }, { base: { de: "relevant", es: "relevante" } }];

// --- specificity ---
export const SPECIFICITY_FORMS = [
  { base: { de: "verschieden", es: "diferente, variado/a" } },
  { base: { de: "besonder", es: "especial" } },
  { base: { de: "eigen", es: "propio/a" } },
  { base: { de: "bestimmt", es: "cierto, determinado" } },
  { base: { de: "existent", es: "existente" } },
];

// --- condition / state ---
export const CONDITION_FORMS = [
  { base: { de: "gesund", es: "sano/a" }, irregularities: ["umlaut"] },
  { base: { de: "krank", es: "enfermo/a" }, irregularities: ["umlaut"] },
  { base: { de: "stark", es: "fuerte" }, irregularities: ["umlaut"] },
  { base: { de: "schwach", es: "débil" }, irregularities: ["umlaut"] },
  { base: { de: "unangenehm", es: "incómodo/a" } },
  { base: { de: "straflos", es: "impune" }, gradable: false },
  { base: { de: "folgenlos", es: "sin consecuencias" }, gradable: false },
];

// --- value ---
export const VALUE_FORMS = [
  { base: { de: "teuer", es: "caro/a" } },
  { base: { de: "billig", es: "barato/a" } },
  { base: { de: "preiswert", es: "económico/a" } },
  { base: { de: "wertvoll", es: "valioso/a" } },
  { base: { de: "nutzlos", es: "inútil" } },
  { base: { de: "empfehlenswert", es: "recomendable" } },
  { base: { de: "strafbar", es: "punible" }, gradable: false },
];

// --- speed/time ---
export const SPEED_TIME_FORMS = [
  { base: { de: "schnell", es: "rápido/a" } },
  { base: { de: "langsam", es: "lento/a" } },
  { base: { de: "früh", es: "temprano" } },
  { base: { de: "spät", es: "tarde" } },
];

// --- frequency/intensity ---
export const FREQUENCY_INTENSITY_FORMS = [
  { base: { de: "häufig", es: "frecuente" } },
  { base: { de: "selten", es: "raro/a, poco frecuente" } },
  { base: { de: "intensiv", es: "intenso/a" } },
  { base: { de: "mild", es: "suave" } },
  {
    base: { de: "viel", es: "mucho/a" },
    comp: { de: "mehr", es: "más" },
    sup: { de: "meist", es: "la mayoría, lo más" },
    irregularities: ["suppletive"],
  },
  {
    base: { de: "wenig", es: "poco/a" },
    comp: { de: "weniger", es: "menos" },
    sup: { de: "wenigst", es: "lo menos, mínimo" },
    irregularities: ["suppletive"],
  },
];

// --- character/attitude ---
export const CHARACTER_ATTITUDE_FORMS = [
  { base: { de: "freundlich", es: "amable" } },
  { base: { de: "unfreundlich", es: "antipático/a" } },
  { base: { de: "ernst", es: "serio/a" } },
  { base: { de: "lustig", es: "divertido/a" } },
  { base: { de: "brav", es: "bueno/a (portado)" } },
  { base: { de: "dumm", es: "tonto/a" }, irregularities: ["umlaut"] },
  { base: { de: "klug", es: "listo/a" }, irregularities: ["umlaut"] },
  { base: { de: "fleißig", es: "aplicado/a, trabajador/a" } },
  { base: { de: "nett", es: "agradable, majo/a" } },
  { base: { de: "arm", es: "pobre" }, irregularities: ["umlaut"] },
  { base: { de: "spontan", es: "espontáneo/a" } },
  { base: { de: "wild", es: "salvaje" } },
  { base: { de: "ulkig", es: "cómico/a, gracioso/a" } },
  { base: { de: "witzig", es: "gracioso/a, chistoso/a" } },
  { base: { de: "doof", es: "tonto/a" } },
  { base: { de: "blöd", es: "tonto/a" } },
];

// --- common/misc ---
export const COMMON_MISC_FORMS = [
  { base: { de: "richtig", es: "correcto/a" } },
  { base: { de: "falsch", es: "incorrecto/a" } },
  { base: { de: "nötig", es: "necesario/a" } },
  { base: { de: "gefährlich", es: "peligroso/a" } },
  { base: { de: "sicher", es: "seguro/a" } },
  { base: { de: "hochmodern", es: "ultramoderno/a" }, gradable: false },
  { base: { de: "gerade", es: "recto/a" } },
  { base: { de: "egal", es: "igual; da igual" }, gradable: false },
  { base: { de: "komplett", es: "completo/a" }, gradable: false },
  { base: { de: "fix", es: "fijo/a; rápido (col.)" } },
  { base: { de: "gelbwürdig", es: "merecedor/a de amarilla" }, gradable: false },
  { base: { de: "non-stop", es: "sin parar" }, gradable: false },
];

export const ABSTRACT_ADJECTIVES_FORMS = [
  // --- evaluation ---
  { base: { de: "schlimm", es: "grave, malo" } },
  { base: { de: "unangenehm", es: "desagradable" } },
  { base: { de: "überzogen", es: "exagerado/a" } }, // tb. part. adj., aquí como evaluación
  { base: { de: "halb-richtig", es: "medio correcto" } },

  // --- importance/modality ---
  { base: { de: "relevant", es: "relevante" } },
  { base: { de: "eventuell", es: "eventual, posible" }, gradable: false }, // también ADV, aquí como adj.
  { base: { de: "important", es: "importante" } }, // préstamo inglés

  // --- specificity ---
  { base: { de: "genau", es: "exacto/a" } },
  { base: { de: "gezielt", es: "dirigido/a, específico/a" } },
  { base: { de: "bestimmt", es: "determinado/a" } },
  { base: { de: "konkret", es: "concreto/a" } },
  { base: { de: "gemeinsame", es: "compartido/a, común" } },

  // --- value ---
  { base: { de: "knapp", es: "escaso/a, justo/a" } },

  // --- character/attitude ---
  { base: { de: "böse", es: "malo/a; enfadado/a" } },
  { base: { de: "doof", es: "tonto/a" } },
  { base: { de: "spontan", es: "espontáneo/a" } },
  { base: { de: "familiärer", es: "más familiar, cercano" } },

  // --- condition/state ---
  { base: { de: "garantiert", es: "garantizado" } },
  { base: { de: "gängige", es: "usual, común" } },
  { base: { de: "vertraulicher", es: "confidencial" } },
  { base: { de: "ganz", es: "entero/a" } },
  { base: { de: "live", es: "en vivo" }, gradable: false },
  { base: { de: "existent", es: "existente" } },
  { base: { de: "interaktiv", es: "interactivo/a" } },
  { base: { de: "empfehlenswert", es: "recomendable" } },
  { base: { de: "vertraut", es: "conocido/a, familiar" } },
  { base: { de: "last", es: "pesado/a" } },
  { base: { de: "leicht", es: "ligero/a" } },
  { base: { de: "letzter", es: "último" } },
  { base: { de: "nice", es: "guay" }, gradable: false },
  { base: { de: "ungefähr", es: "aproximado/a; aproximadamente" }, gradable: false },

  { base: { de: "bedeutend", es: "significativo/a, importante" } },
  { base: { de: "stimmig", es: "coherente, armónico" } },
];

// --- colección final ---
export const ADJECTIVES_QUALITY = flatteAdj([
  ...EVALUATION_FORMS,
  ...AGE_FORMS,
  ...DIFFICULTY_FORMS,
  ...BRIGHTNESS_FORMS,
  ...TEMPERATURE_FORMS,
  ...NATURE_TECH_FORMS,
  ...VISIBILITY_FORMS,
  ...IMPORTANCE_MODALITY_FORMS,
  ...SPECIFICITY_FORMS,
  ...CONDITION_FORMS,
  ...VALUE_FORMS,
  ...SPEED_TIME_FORMS,
  ...FREQUENCY_INTENSITY_FORMS,
  ...CHARACTER_ATTITUDE_FORMS,
  ...COMMON_MISC_FORMS,
  ...ABSTRACT_ADJECTIVES_FORMS,
]);
