import { flatteAdj } from "./utils.js";

export const ADJECTIVES_TIME_FORMS = [
  { base: { de: "heutig", es: "de hoy" }, gradable: false },
  { base: { de: "früh", es: "temprano" }, comp: { de: "früher" }, sup: { de: "frühest" } },
  { base: { de: "spät", es: "tarde" }, comp: { de: "später" }, sup: { de: "spätest" } },
  { base: { de: "zeitig", es: "puntual, temprano" }, comp: { de: "zeitiger" }, sup: { de: "zeitigst" } },
];

export const ADJECTIVES_TIME = flatteAdj(ADJECTIVES_TIME_FORMS);
