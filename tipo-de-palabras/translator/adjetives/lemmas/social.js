import { flatteAdj } from "./utils.js";

export const ADJECTIVES_SOCIAL_FORMS = [
  { base: { de: "sozial" } },
  { base: { de: "asozial" } },
  { base: { de: "beliebt" } }, // termina en -t → sup con -est
  { base: { de: "unbeliebt" } }, // idem
];

export const ADJECTIVES_SOCIAL = flatteAdj(ADJECTIVES_SOCIAL_FORMS);
