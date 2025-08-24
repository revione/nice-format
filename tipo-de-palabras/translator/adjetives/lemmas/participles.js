import { flatteAdj } from "./utils.js";

export const ADJECTIVES_PARTICIPLES_FORMS = [
  { base: { de: "ausgerichtet", es: "orientado/a" } },
  { base: { de: "gekämmt", es: "peinado/a" }, gradable: false },
  { base: { de: "proportioniert", es: "proporcionado/a" } },
  { base: { de: "ausgeprägt", es: "marcado/a" } },
  { base: { de: "geöffnet", es: "abierto/a" } },
  { base: { de: "geschlossen", es: "cerrado/a" }, gradable: false },
  { base: { de: "aufgenommen", es: "grabado" }, gradable: false },
  { base: { de: "geordnet", es: "ordenado/a" }, gradable: false },
  { base: { de: "gelungen", es: "logrado" }, gradable: false },
  { base: { de: "verheiratet", es: "casado/a" }, gradable: false },
];

export const ADJECTIVES_PARTICIPLES = flatteAdj(ADJECTIVES_PARTICIPLES_FORMS);
