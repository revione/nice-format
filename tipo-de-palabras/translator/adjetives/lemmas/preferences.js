import { flatteAdj } from "../utils/builders.js";
export const PREFERENCE_FORMS = [
  {
    base: { de: "gern", es: "de buena gana, con gusto" },
    comp: { de: "lieber", es: "preferir, más bien" },
    sup: { de: "liebst", es: "preferir más, lo que más gusta" },
    irregularities: ["suppletive"],
  },
];

export const ADJECTIVES_PREFERENCES = flatteAdj(PREFERENCE_FORMS);
