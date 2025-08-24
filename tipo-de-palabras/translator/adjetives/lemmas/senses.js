import { flatteAdj } from "./utils.js";

// --- TOUCH ---
export const TOUCH_SOFTNESS_FORMS = [
  { base: { de: "weich", es: "blando/a, suave" } },
  { base: { de: "hart", es: "duro/a" }, irregularities: ["umlaut"] },
  { base: { de: "rau", es: "áspero/a" } },
  { base: { de: "glatt", es: "liso/a" } },
  { base: { de: "grob", es: "tosco/a" }, irregularities: ["umlaut"] },
  { base: { de: "fein", es: "fino/a, delicado/a" } },
  { base: { de: "sanft", es: "suave, tierno/a" } },
];

export const TOUCH_SURFACE_FORMS = [
  { base: { de: "klebrig", es: "pegajoso/a" } },
  { base: { de: "schmierig", es: "grasiento/a, pringoso/a" } },
  { base: { de: "ölig", es: "aceitoso/a" } },
  { base: { de: "rutschig", es: "resbaladizo/a" } },
  { base: { de: "glitschig", es: "baboso/a, resbaladizo/a" } },
  { base: { de: "glibberig", es: "viscoso/a" } },
];

export const TOUCH_CONSISTENCY_FORMS = [
  { base: { de: "fest", es: "firme, sólido/a" } },
  { base: { de: "locker", es: "flojo/a, suelto/a" } },
  { base: { de: "porös", es: "poroso/a" } },
  { base: { de: "elastisch", es: "elástico/a" } },
  { base: { de: "biegsam", es: "flexible" } },
  { base: { de: "spröde", es: "quebradizo/a" } },
  { base: { de: "massiv", es: "macizo/a, sólido/a" } },
];

export const ADJECTIVES_TOUCH = flatteAdj([...TOUCH_SOFTNESS_FORMS, ...TOUCH_SURFACE_FORMS, ...TOUCH_CONSISTENCY_FORMS]);

// --- SMELL ---
export const SMELL_PLEASANT_FORMS = [
  { base: { de: "gutriechend", es: "que huele bien" } },
  { base: { de: "wohlriechend", es: "aromático/a" } },
  { base: { de: "duftend", es: "perfumado/a" } },
  { base: { de: "aromatisch", es: "aromático/a" } },
];

export const SMELL_UNPLEASANT_FORMS = [{ base: { de: "stinkend", es: "apestoso/a" } }, { base: { de: "übelriechend", es: "maloliente" } }, { base: { de: "muffig", es: "rancio/a" } }];

export const ADJECTIVES_SMELL = flatteAdj([...SMELL_PLEASANT_FORMS, ...SMELL_UNPLEASANT_FORMS]);

// --- TASTE ---
export const TASTE_BASIC_FORMS = [
  { base: { de: "süß", es: "dulce" } },
  { base: { de: "sauer", es: "ácido/a" } },
  { base: { de: "bitter", es: "amargo/a" } },
  { base: { de: "salzig", es: "salado/a" } },
];

export const TASTE_QUALITY_FORMS = [
  { base: { de: "würzig", es: "condimentado/a, especiado/a" } },
  { base: { de: "scharf", es: "picante" }, irregularities: ["umlaut"] },
  { base: { de: "fade", es: "soso/a, insípido/a" } },
  { base: { de: "lecker", es: "rico/a, sabroso/a" } },
  { base: { de: "köstlich", es: "delicioso/a" } },
  { base: { de: "ungenießbar", es: "incomible" } },
];

export const ADJECTIVES_TASTE = flatteAdj([...TASTE_BASIC_FORMS, ...TASTE_QUALITY_FORMS]);

// --- SOUND ---
export const SOUND_VOLUME_FORMS = [{ base: { de: "laut", es: "fuerte (volumen)" } }, { base: { de: "leise", es: "bajo/a, silencioso/a" } }, { base: { de: "lärmend", es: "ruidoso/a" } }];

export const SOUND_TONE_FORMS = [
  { base: { de: "hell", es: "agudo/a (sonido)" } },
  { base: { de: "tief", es: "grave" } },
  { base: { de: "dumpf", es: "sordo/a, apagado/a" } },
  { base: { de: "schrill", es: "estridente" } },
  { base: { de: "melodisch", es: "melódico/a" } },
  { base: { de: "harmonisch", es: "armónico/a" } },
  { base: { de: "dissonant", es: "disonante" } },
];

export const SOUND_SENSITIVITY_FORMS = [{ base: { de: "hellhörig", es: "sensible al ruido" } }];

export const ADJECTIVES_SOUND = flatteAdj([...SOUND_VOLUME_FORMS, ...SOUND_TONE_FORMS, ...SOUND_SENSITIVITY_FORMS]);

// --- VISION ---
export const VISION_LIGHT_FORMS = [
  { base: { de: "hell", es: "claro/a, luminoso/a" } },
  { base: { de: "dunkel", es: "oscuro/a" } },
  { base: { de: "strahlend", es: "radiante" } },
  { base: { de: "leuchtend", es: "brillante, luminoso/a" } },
  { base: { de: "glänzend", es: "reluciente, brillante" } },
  { base: { de: "düster", es: "tenebroso/a" } },
  { base: { de: "fahl", es: "pálido/a" } },
];

export const VISION_CLARITY_COLOR_FORMS = [
  { base: { de: "klar", es: "claro/a" } },
  { base: { de: "trüb", es: "turbio/a" } },
  { base: { de: "durchsichtig", es: "transparente" } },
  { base: { de: "blickdicht", es: "opaco/a" } },
  { base: { de: "farbenfroh", es: "colorido/a" } },
  { base: { de: "eintönig", es: "monótono/a" } },
  { base: { de: "unscharf", es: "borroso/a" }, irregularities: ["umlaut"] },
];

export const ADJECTIVES_VISION = flatteAdj([...VISION_LIGHT_FORMS, ...VISION_CLARITY_COLOR_FORMS]);

// --- ALL senses together ---
export const ADJECTIVES_SENSES = [...ADJECTIVES_TOUCH, ...ADJECTIVES_SMELL, ...ADJECTIVES_TASTE, ...ADJECTIVES_SOUND, ...ADJECTIVES_VISION];
