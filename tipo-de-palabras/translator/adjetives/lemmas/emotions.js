import { flatteAdj } from "../utils/builders.js";
export const PHYS_ENERGY = [
  { base: { de: "müde", es: "cansado/a" } },
  { base: { de: "schläfrig", es: "somnoliento/a" } },
  { base: { de: "wach", es: "despierto/a" } },
  { base: { de: "erschöpft", es: "agotado/a" } },
  { base: { de: "schlapp", es: "débil, flojo/a" } },
  { base: { de: "munter", es: "animado/a, despierto/a" } },
];

export const PHYS_APPETITE = [{ base: { de: "hungrig", es: "hambriento/a" } }, { base: { de: "satt", es: "lleno/a, satisfecho/a" } }, { base: { de: "durstig", es: "sediento/a" } }];

export const PHYS_HEALTH = [
  { base: { de: "krank", es: "enfermo/a" }, irregularities: ["umlaut"] },
  { base: { de: "kränklich", es: "enfermizo/a" } },
  { base: { de: "gesund", es: "sano/a" }, irregularities: ["umlaut"] },
  { base: { de: "stark", es: "fuerte" }, irregularities: ["umlaut"] },
  { base: { de: "fit", es: "en forma" } },
  { base: { de: "erholt", es: "recuperado/a" } },
  { base: { de: "schwach", es: "débil" }, irregularities: ["umlaut"] },
  { base: { de: "kraftlos", es: "falto/a de fuerzas" } },
  { base: { de: "lebendig", es: "lleno/a de vida, animado/a" } },
  { base: { de: "beweglich", es: "ágil, flexible" } },
];

export const PHYS_SENSATIONS = [
  { base: { de: "benommen", es: "aturdido/a" } },
  { base: { de: "schwindlig", es: "mareado/a" } },
  { base: { de: "verletzt", es: "herido/a" } },
  { base: { de: "frierend", es: "con frío, helado/a" } },
  { base: { de: "schwitzend", es: "sudando, acalorado/a" } },
];

export const STATES_PHYSICAL = [...PHYS_ENERGY, ...PHYS_APPETITE, ...PHYS_HEALTH, ...PHYS_SENSATIONS];

export const POS_JOY = [
  { base: { de: "glücklich", es: "feliz" } },
  { base: { de: "fröhlich", es: "alegre" } },
  { base: { de: "ausgelassen", es: "alborozado/a, desenfadado/a" } },
  { base: { de: "heiter", es: "jovial, animado/a" } },
  { base: { de: "begeistert", es: "entusiasmado/a" } },
  { base: { de: "euphorisch", es: "eufórico/a" } },
];

export const POS_SERENITY = [
  { base: { de: "zufrieden", es: "contento/a, satisfecho/a" } },
  { base: { de: "erleichtert", es: "aliviado/a" } }, // sup DE se formará con -est (regla de terminación en -t)
  { base: { de: "geborgen", es: "seguro/a, protegido/a" } },
  { base: { de: "freundlich", es: "amable" } },
];

export const POS_CONFIDENCE = [
  { base: { de: "stolz", es: "orgulloso/a" } },
  { base: { de: "mutig", es: "valiente" } },
  { base: { de: "optimistisch", es: "optimista" } },
  { base: { de: "zuversichtlich", es: "seguro/a, confiado/a" } },
  { base: { de: "verliebt", es: "enamorado/a" } }, // sup DE con -est por terminar en -t
  { base: { de: "hoffnungsvoll", es: "esperanzado/a" } },
  { base: { de: "dankbar", es: "agradecido/a" } },
];

export const EMOTIONS_POSITIVE = [...POS_JOY, ...POS_SERENITY, ...POS_CONFIDENCE];
export const NEG_SADNESS = [
  { base: { de: "traurig", es: "triste" } },
  { base: { de: "verzweifelt", es: "desesperado/a" } },
  { base: { de: "deprimiert", es: "deprimido/a" } },
  { base: { de: "hoffnungslos", es: "sin esperanza, desesperanzado/a" } },
  { base: { de: "melancholisch", es: "melancólico/a" } },
  { base: { de: "einsam", es: "solo/a" } },
  { base: { de: "verlassen", es: "abandonado/a" } },
];

export const NEG_ANGER = [
  { base: { de: "wütend", es: "enojado/a, furioso/a" } },
  { base: { de: "zornig", es: "colérico/a, iracundo/a" } },
  { base: { de: "verärgert", es: "molesto/a, disgustado/a" } },
  { base: { de: "genervt", es: "fastidiado/a" } },
];

export const NEG_FEAR = [
  { base: { de: "ängstlich", es: "miedoso/a, temeroso/a" } },
  { base: { de: "nervös", es: "nervioso/a" } },
  { base: { de: "besorgt", es: "preocupado/a" } },
  { base: { de: "unsicher", es: "inseguro/a" } },
  { base: { de: "verunsichert", es: "desconcertado/a, inseguro/a" } },
  { base: { de: "schuldig", es: "culpable" } },
  { base: { de: "aufgeregt", es: "nervioso/a, excitado/a" } },
];

export const NEG_SHAME = [
  { base: { de: "beschämt", es: "avergonzado/a" } },
  { base: { de: "peinlich berührt", es: "incómodo/a, apenado/a" } },
  { base: { de: "verlegen", es: "cortado/a, incómodo/a" } },
  { base: { de: "schüchtern", es: "tímido/a" } },
];

export const NEG_CONFUSION = [
  { base: { de: "schockiert", es: "impactado/a" } },
  { base: { de: "entsetzt", es: "horrorizado/a" } },
  { base: { de: "fassungslos", es: "estupefacto/a, perplejo/a" } },
  { base: { de: "erschrocken", es: "asustado/a, sobresaltado/a" } },
  { base: { de: "verwirrt", es: "confundido/a" } },
  { base: { de: "ratlos", es: "desconcertado/a, perdido/a" } },
  { base: { de: "verbittert", es: "amargado/a" } },
  { base: { de: "neidisch", es: "envidioso/a" } },
  { base: { de: "eifersüchtig", es: "celoso/a" } },
  { base: { de: "pessimistisch", es: "pesimista" } },
  { base: { de: "hilflos", es: "indefenso/a, desamparado/a" } },
];

export const EMOTIONS_NEGATIVE = [...NEG_SADNESS, ...NEG_ANGER, ...NEG_FEAR, ...NEG_SHAME, ...NEG_CONFUSION];

export const STATES_CALM = [
  { base: { de: "ruhig", es: "tranquilo/a, calmado/a" } },
  { base: { de: "entspannt", es: "relajado/a" } },
  { base: { de: "gelassen", es: "sereno/a" } },
  { base: { de: "sorglos", es: "despreocupado/a" } },
  { base: { de: "unbesorgt", es: "sin preocupaciones" } },
  { base: { de: "sicher", es: "seguro/a" } },
  { base: { de: "erleichtert", es: "aliviado/a" } },
  { base: { de: "gelöst", es: "distendido/a, relajado/a" } },
];

export const STATES_STRESS = [
  { base: { de: "angespannt", es: "tenso/a" } },
  { base: { de: "gestresst", es: "estresado/a" } },
  { base: { de: "unruhig", es: "inquieto/a" } },
  { base: { de: "gespannt", es: "expectante, tenso/a" } },
  { base: { de: "panisch", es: "con pánico" } },
  { base: { de: "hysterisch", es: "histérico/a" } },
  { base: { de: "gelähmt", es: "paralizado/a" } },
  { base: { de: "überfordert", es: "sobrecargado/a, abrumado/a" } },
  { base: { de: "überreizt", es: "sobreexcitado/a, nervioso/a" } },
];

export const ATTITUDE_COGNITIVE = [
  { base: { de: "ernst", es: "serio/a" } },
  { base: { de: "neugierig", es: "curioso/a" } },
  { base: { de: "aufmerksam", es: "atento/a" } },
  { base: { de: "gelangweilt", es: "aburrido/a" } },
  { base: { de: "skeptisch", es: "escéptico/a" } },
  { base: { de: "kritisch", es: "crítico/a" } },
  { base: { de: "nachdenklich", es: "pensativo/a" } },
  { base: { de: "verträumt", es: "soñador/a" } },
];

export const ATTITUDE_SOCIAL = [
  { base: { de: "tolerant", es: "tolerante" } },
  { base: { de: "intolerant", es: "intolerante" } },
  { base: { de: "hilfsbereit", es: "servicial, dispuesto/a a ayudar" } },
  { base: { de: "arrogant", es: "arrogante" } },
  { base: { de: "respektvoll", es: "respetuoso/a" } },
  { base: { de: "respektlos", es: "irrespetuoso/a" } },
  { base: { de: "zuverlässig", es: "fiable, confiable" } },
  { base: { de: "offen", es: "abierto/a" } },
  { base: { de: "verschlossen", es: "cerrado/a, reservado/a" } },
  { base: { de: "selbstbewusst", es: "seguro/a de sí mismo/a" } },
];

export const ADJECTIVES_STATES = flatteAdj([...STATES_PHYSICAL, ...EMOTIONS_POSITIVE, ...EMOTIONS_NEGATIVE, ...STATES_CALM, ...STATES_STRESS, ...ATTITUDE_COGNITIVE, ...ATTITUDE_SOCIAL]);
