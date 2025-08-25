import { flatteAdj } from "../utils/builders.js";
// --- GENERAL ---
export const GENERAL_FORMS = [
  {
    base: { de: "groß", es: "grande" },
    comp: { de: "größer", es: "más grande" },
    // forma "surface" sin -e- epentética; la declinación añadirá la -e si procede
    sup: { de: "größt", es: "el/la más grande" },
    irregularities: ["umlaut"],
  },
  { base: { de: "klein", es: "pequeño/a" } },
  { base: { de: "riesig", es: "enorme, gigantesco/a" } },

  // locución enfática → no gradable
  { base: { de: "winzig klein", es: "minúsculo (muy pequeño)" }, gradable: false },

  { base: { de: "enorm", es: "enorme" } },
  { base: { de: "gewaltig", es: "descomunal, enorme" } },
  { base: { de: "mächtig", es: "imponente, muy grande" } },

  // opción coloquial; si no la quieres, bórrala
  { base: { de: "winzklein", es: "minúsculo (col.)" }, gradable: false },

  { base: { de: "übergroß", es: "sobredimensionado/a" } },
];

// --- HEIGHT / DEPTH ---
export const HEIGHT_DEPTH_FORMS = [
  { base: { de: "hoch", es: "alto/a" }, irregularities: ["umlaut"] },
  { base: { de: "tief", es: "profundo/a" } },
  { base: { de: "flach", es: "plano/a" } },
  { base: { de: "steil", es: "empinado/a" } },
  { base: { de: "niedrig", es: "bajo/a (altura)" } },
  { base: { de: "oberflächlich", es: "superficial" } },
  { base: { de: "bodennah", es: "a ras de suelo" } },
];

// --- WIDTH ---
export const WIDTH_FORMS = [
  { base: { de: "breit", es: "ancho/a" } }, // sup DE escrito: breitest (UI puede mostrar "breitst" como stem)
  { base: { de: "schmal", es: "estrecho/a" } },
  { base: { de: "eng", es: "angosto/a" } },
  { base: { de: "weit", es: "amplio/a" } },
  { base: { de: "ausgedehnt", es: "extenso/a" } },
  { base: { de: "schmächtig", es: "escuálido/a, enclenque" } },
];

// --- LENGTH ---
export const LENGTH_FORMS = [
  { base: { de: "lang", es: "largo/a" }, irregularities: ["umlaut"] },
  { base: { de: "kurz", es: "corto/a" }, irregularities: ["umlaut"] },
  { base: { de: "endlos", es: "interminable" } },
  { base: { de: "kurzzeitig", es: "de corta duración" } },
  { base: { de: "mittellang", es: "de longitud media" }, gradable: false },
];

// --- WEIGHT / VOLUME ---
export const WEIGHT_VOLUME_FORMS = [
  { base: { de: "schwer", es: "pesado/a" } },
  { base: { de: "leicht", es: "ligero/a" } },
  { base: { de: "dick", es: "grueso/a" } },
  { base: { de: "dünn", es: "fino/a, delgado/a" } },
  { base: { de: "massiv", es: "macizo/a" } },
  { base: { de: "voluminös", es: "voluminoso/a" } },
  { base: { de: "schwerfällig", es: "pesado/a, torpe" } },
  { base: { de: "federleicht", es: "ligerísimo/a" } },
  { base: { de: "dicht", es: "denso/a" } },
  { base: { de: "locker", es: "suelto/a" } },
  { base: { de: "halbdünn", es: "medio delgado/a" } },
];

// --- SHAPE ---
export const SHAPE_FORMS = [
  { base: { de: "rund", es: "redondo/a" } },
  { base: { de: "oval", es: "ovalado/a" } },
  { base: { de: "eckig", es: "anguloso/a" } },
  { base: { de: "kantig", es: "de cantos, anguloso/a" } },
  { base: { de: "quadratisch", es: "cuadrado/a" } },
  { base: { de: "rechteckig", es: "rectangular" } },
  { base: { de: "kugelförmig", es: "esférico/a" } },
  { base: { de: "zylindrisch", es: "cilíndrico/a" } },
  { base: { de: "dreieckig", es: "triangular" } },
  { base: { de: "unregelmäßig", es: "irregular" } },
];

// --- SPACE ---
export const SPACE_FORMS = [
  { base: { de: "weitläufig", es: "amplio, extenso" } },
  { base: { de: "geräumig", es: "espacioso/a" } },
  { base: { de: "engräumig", es: "reducido/a, estrecho/a" } },
  { base: { de: "offen", es: "abierto/a" } },
  { base: { de: "begrenzt", es: "limitado/a" } },
  { base: { de: "weitreichend", es: "de gran alcance, extenso" } },
];

// --- Unión y aplanado ---
export const ADJECTIVES_SIZE = flatteAdj([...GENERAL_FORMS, ...HEIGHT_DEPTH_FORMS, ...WIDTH_FORMS, ...LENGTH_FORMS, ...WEIGHT_VOLUME_FORMS, ...SHAPE_FORMS, ...SPACE_FORMS]);
