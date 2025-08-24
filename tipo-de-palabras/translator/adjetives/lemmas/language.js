import { flatteAdj } from "../utils/builders.js";
export const ADJECTIVES_LANGUAGE_FORMS = [
  { base: { de: "englisch", es: "inglés" }, gradable: false },
  { base: { de: "deutsch", es: "alemán" }, gradable: false },
  { base: { de: "spanisch", es: "español" }, gradable: false },
  { base: { de: "französisch", es: "francés" }, gradable: false },
  { base: { de: "italienisch", es: "italiano" }, gradable: false },
  { base: { de: "portugiesisch", es: "portugués" }, gradable: false },
  { base: { de: "niederländisch", es: "neerlandés" }, gradable: false }, // (también “holandés”, pero “neerlandés” es más preciso)
  { base: { de: "schwedisch", es: "sueco" }, gradable: false },
  { base: { de: "dänisch", es: "danés" }, gradable: false },
  { base: { de: "norwegisch", es: "noruego" }, gradable: false },
  { base: { de: "russisch", es: "ruso" }, gradable: false },
  { base: { de: "polnisch", es: "polaco" }, gradable: false },
  { base: { de: "tschechisch", es: "checo" }, gradable: false },
  { base: { de: "griechisch", es: "griego" }, gradable: false },
  { base: { de: "ungarisch", es: "húngaro" }, gradable: false },
  { base: { de: "rumänisch", es: "rumano" }, gradable: false },
  { base: { de: "bulgarisch", es: "búlgaro" }, gradable: false },
  { base: { de: "slowenisch", es: "esloveno" }, gradable: false },
  { base: { de: "kroatisch", es: "croata" }, gradable: false },
  { base: { de: "serbisch", es: "serbio" }, gradable: false },
  { base: { de: "finnisch", es: "finés" }, gradable: false }, // también se usa “finlandés” para nacionalidad
  { base: { de: "estnisch", es: "estonio" }, gradable: false },
  { base: { de: "lettisch", es: "letón" }, gradable: false },
  { base: { de: "litauisch", es: "lituano" }, gradable: false },
];

export const ADJECTIVES_LANGUAGE = flatteAdj(ADJECTIVES_LANGUAGE_FORMS);
