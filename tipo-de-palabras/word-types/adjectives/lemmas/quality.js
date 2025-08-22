export const EVALUATION = {
  gut: { comp: "besser", sup: "best", irregularities: ["suppletive"] },
  schlecht: { comp: "schlechter", sup: "schlechtest" },
  schön: { comp: "schöner", sup: "schönst" },
  perfekt: { comp: "perfekter", sup: "perfektest" },
  schlicht: { comp: "schlichter", sup: "schlichtest" },
  ausdrucksstark: { comp: "ausdrucksstärker", sup: "ausdrucksstärkst" },
};

export const AGE = {
  neu: { comp: "neuer", sup: "neuest" },
  alt: { comp: "älter", sup: "ältest", irregularities: ["umlaut"] },
  jung: { comp: "jünger", sup: "jüngst", irregularities: ["umlaut"] },
};

export const DIFFICULTY = {
  leicht: { comp: "leichter", sup: "leichtest" },
  schwer: { comp: "schwerer", sup: "schwerst" },
  einfach: { comp: "einfacher", sup: "einfachst" },
  produktiv: { comp: "produktiver", sup: "produktivst" },
  direkt: { comp: "direkter", sup: "direktest" },
};

export const BRIGHTNESS = {
  hell: { comp: "heller", sup: "hellst" },
  dunkel: { comp: "dunkler", sup: "dunkelst" },
};

export const TEMPERATURE = {
  warm: { comp: "wärmer", sup: "wärmst", irregularities: ["umlaut"] },
  kalt: { comp: "kälter", sup: "kältest", irregularities: ["umlaut"] },
};

export const NATURE_TECH = {
  natürlich: { comp: "natürlicher", sup: "natürlichst" },
  technisch: { comp: "technischer", sup: "technischst" },
};

export const VISIBILITY = {
  unsichtbar: { comp: "unsichtbarer", sup: "unsichtbarst" },
  visuell: { comp: "visueller", sup: "visuellst" },
  klar: { comp: "klarer", sup: "klarst" },
  sauber: { comp: "sauberer", sup: "sauberst" },
  frisch: { comp: "frischer", sup: "frischest" },
};

export const IMPORTANCE_MODALITY = {
  wichtig: { comp: "wichtiger", sup: "wichtigst" },
  möglich: { comp: "möglicher", sup: "möglichst" },
};

export const SPECIFICITY = {
  verschieden: { comp: "verschiedener", sup: "verschiedenst" },
  besonder: { comp: "besonderer", sup: "besonderst" },
  eigen: { comp: "eigener", sup: "eigenst" },
};

export const CONDITION = {
  gesund: { comp: "gesünder", sup: "gesündest", irregularities: ["umlaut"] },
  krank: { comp: "kränker", sup: "kränkst", irregularities: ["umlaut"] },
  stark: { comp: "stärker", sup: "stärkst", irregularities: ["umlaut"] },
  schwach: { comp: "schwächer", sup: "schwächst", irregularities: ["umlaut"] },
};

export const VALUE = {
  teuer: { comp: "teurer", sup: "teuerst" },
  billig: { comp: "billiger", sup: "billigst" },
  preiswert: { comp: "preiswerter", sup: "preiswertest" },
  wertvoll: { comp: "wertvoller", sup: "wertvollst" },
  nutzlos: { comp: "nutzloser", sup: "nutzlosest" },
};

export const SPEED_TIME = {
  schnell: { comp: "schneller", sup: "schnellst" },
  langsam: { comp: "langsamer", sup: "langsamst" },
  früh: { comp: "früher", sup: "frühest" },
  spät: { comp: "später", sup: "spätest" },
};

export const FREQUENCY_INTENSITY = {
  häufig: { comp: "häufiger", sup: "häufigst" },
  selten: { comp: "seltener", sup: "seltenst" },
  intensiv: { comp: "intensiver", sup: "intensivst" },
  mild: { comp: "milder", sup: "mildest" },
};

export const CHARACTER_ATTITUDE = {
  freundlich: { comp: "freundlicher", sup: "freundlichst" },
  unfreundlich: { comp: "unfreundlicher", sup: "unfreundlichst" },
  ernst: { comp: "ernster", sup: "ernstest" },
  lustig: { comp: "lustiger", sup: "lustigst" },
  brav: { comp: "braver", sup: "bravst" },
};

export const COMMON_MISC = {
  richtig: { comp: "richtiger", sup: "richtigst" },
  falsch: { comp: "falscher", sup: "falschst" },
  nötig: { comp: "nötiger", sup: "nötigst" },
  gefährlich: { comp: "gefährlicher", sup: "gefährlichst" },
  sicher: { comp: "sicherer", sup: "sicherst" },
};

export const ADJECTIVES_QUALITY = {
  ...EVALUATION,
  ...AGE,
  ...DIFFICULTY,
  ...BRIGHTNESS,
  ...TEMPERATURE,
  ...NATURE_TECH,
  ...VISIBILITY,
  ...IMPORTANCE_MODALITY,
  ...SPECIFICITY,
  ...CONDITION,
  ...VALUE,
  ...SPEED_TIME,
  ...FREQUENCY_INTENSITY,
  ...CHARACTER_ATTITUDE,
  ...COMMON_MISC,
};
