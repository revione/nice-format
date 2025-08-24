// social.js corregido
import { flatteAdj } from "./utils.js";

export const ADJECTIVES_SOCIAL_FORMS = [
  { base: { de: "sozial", es: "social" } },
  { base: { de: "asozial", es: "antisocial" } },
  { base: { de: "beliebt", es: "popular, querido/a" } },
  { base: { de: "unbeliebt", es: "impopular, mal visto/a" } },
];

export const ADJECTIVES_SOCIAL = flatteAdj(ADJECTIVES_SOCIAL_FORMS);
