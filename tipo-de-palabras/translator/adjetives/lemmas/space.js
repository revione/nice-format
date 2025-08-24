import { flatteAdj } from "./utils.js";

export const ADJECTIVES_SPACE_FORMS = [
  { base: { de: "nah" }, irregularities: ["umlaut", "irregular superlative"] }, // → näher / nächst
  { base: { de: "fern" } }, // → ferner / fernst
  { base: { de: "weit" } }, // → weiter / weitest
  { base: { de: "dicht" } }, // → dichter / dichtest
];

export const ADJECTIVES_SPACE = flatteAdj(ADJECTIVES_SPACE_FORMS);
