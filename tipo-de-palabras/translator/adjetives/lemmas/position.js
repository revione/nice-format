import { flatteAdj } from "../utils/builders.js";
export const ADJECTIVES_POSITION_FORMS = [
  { base: { de: "ober", es: "superior" }, gradable: false }, // funciona más como prefijo
  { base: { de: "unter", es: "inferior" }, gradable: false }, // ídem
  { base: { de: "mittler", es: "medio, intermedio" } }, // gradable: mittlerer, mittlerst
  { base: { de: "schief", es: "torcido/a, inclinado/a" } }, // gradable
  { base: { de: "zweite", es: "segundo/a" }, gradable: false }, // ordinal, no gradable
  { base: { de: "recht", es: "derecho/a" } }, // p. ej. rechte Hand/Seite
  { base: { de: "link", es: "izquierdo/a" } }, // p. ej. linke Hand/Seite
];

export const ADJECTIVES_POSITION = flatteAdj(ADJECTIVES_POSITION_FORMS);
