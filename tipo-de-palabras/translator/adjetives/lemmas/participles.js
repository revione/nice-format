import { flatteAdj } from "./utils.js";

export const ADJECTIVES_PARTICIPLES_FORMS = [
  { base: { de: "ausgerichtet", es: "orientado/a" } }, // gradable (más orientado)
  { base: { de: "gekämmt", es: "peinado/a" }, gradable: false }, // no suele compararse
  { base: { de: "proportioniert", es: "proporcionado/a" } }, // gradable
  { base: { de: "ausgeprägt", es: "marcado/a" } }, // gradable (→ ausgeprägter/-test)
  { base: { de: "geöffnet", es: "abierto/a" } }, // debatible; lo dejamos gradable
  { base: { de: "geschlossen", es: "cerrado/a" }, gradable: false },
  { base: { de: "aufgenommen", es: "grabado" }, gradable: false },
  { base: { de: "geordnet", es: "ordenado/a" }, gradable: false },
];

export const ADJECTIVES_PARTICIPLES = flatteAdj(ADJECTIVES_PARTICIPLES_FORMS);
