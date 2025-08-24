import { flatteAdj } from "../utils/builders.js";
export const ADJECTIVES_SPACE_FORMS = [
  {
    base: { de: "nah", es: "cercano/a" },
    comp: { de: "näher", es: "más cerca" },
    sup: { de: "nächst", es: "más cercano/a" },
    irregularities: ["umlaut", "irregular superlative"],
  },
  { base: { de: "fern", es: "lejano/a" } },
  { base: { de: "weit", es: "amplio/a, lejano/a" } },
  { base: { de: "dicht", es: "denso/a, cerca" } },
];

export const ADJECTIVES_SPACE = flatteAdj(ADJECTIVES_SPACE_FORMS);
