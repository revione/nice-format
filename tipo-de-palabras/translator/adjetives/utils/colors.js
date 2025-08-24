import { COLORS_FORMS, COLOR_PREFIXES_FORMS } from "../lemmas/colors.js";

// Prepara sets de lookup
const COLOR_BASES = new Set(COLORS_FORMS.map((e) => e.base.de)); // rot, blau, grün, ...
const COLOR_PREFIXES = new Set(COLOR_PREFIXES_FORMS.map((e) => e.base.de)); // hell, dunkel, knall, ...

export const tryColorCompound = (token) => {
  // 1) quitar -e/-en/-er/-es/-em si vienen declinados
  const stripEnding = (w) => {
    for (const end of ["en", "er", "es", "em", "e"]) {
      if (w.toLowerCase().endsWith(end)) return w.slice(0, -end.length);
    }
    return w;
  };

  const core = stripEnding(token.toLowerCase()); // p. ej. "hellgrün"
  // 2) buscar un prefijo de color que coincida
  for (const pref of COLOR_PREFIXES) {
    if (core.startsWith(pref)) {
      const rest = core.slice(pref.length); // "grün"
      if (COLOR_BASES.has(rest)) {
        // Lo aceptamos como adjetivo de color compuesto
        return {
          isAdjective: true,
          base: core, // puedes decidir si la "base" es el compuesto o el color simple
          degree: "base",
          confidence: 0.7, // confianza razonable
          notes: ["Color compuesto detectado por prefijo"],
        };
      }
    }
  }
  return null;
};
