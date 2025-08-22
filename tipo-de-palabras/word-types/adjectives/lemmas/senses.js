export const TOUCH_SOFTNESS = {
  weich: { comp: "weicher", sup: "weichst" },
  hart: { comp: "härter", sup: "härtest", irregularities: ["umlaut"] },
  rau: { comp: "rauer", sup: "rauest" },
  glatt: { comp: "glatter", sup: "glattest" },
  grob: { comp: "gröber", sup: "gröbst", irregularities: ["umlaut"] },
  fein: { comp: "feiner", sup: "feinst" },
};

export const TOUCH_SURFACE = {
  klebrig: { comp: "klebriger", sup: "klebrigst" },
  schmierig: { comp: "schmieriger", sup: "schmierigst" },
  ölig: { comp: "öliger", sup: "öligst" },
  rutschig: { comp: "rutschiger", sup: "rutschigst" },
  glitschig: { comp: "glitschiger", sup: "glitschigst" },
  glibberig: { comp: "glibberiger", sup: "glibberigst" },
};

export const TOUCH_CONSISTENCY = {
  fest: { comp: "fester", sup: "festest" },
  locker: { comp: "lockerer", sup: "lockerst" },
  porös: { comp: "poröser", sup: "porösest" },
  elastisch: { comp: "elastischer", sup: "elastischst" },
  biegsam: { comp: "biegsamer", sup: "biegsamst" },
  spröde: { comp: "spröder", sup: "sprödest" },
  massiv: { comp: "massiver", sup: "massivst" },
};

export const ADJECTIVES_TOUCH = {
  ...TOUCH_SOFTNESS,
  ...TOUCH_SURFACE,
  ...TOUCH_CONSISTENCY,
};

export const SMELL_PLEASANT = {
  gutriechend: { comp: "gutriechender", sup: "gutriechendst" },
  wohlriechend: { comp: "wohlriechender", sup: "wohlriechendst" },
  duftend: { comp: "duftender", sup: "duftendst" },
  aromatisch: { comp: "aromatischer", sup: "aromatischst" },
};

export const SMELL_UNPLEASANT = {
  stinkend: { comp: "stinkender", sup: "stinkendst" },
  übelriechend: { comp: "übelriechender", sup: "übelriechendst" },
  muffig: { comp: "muffiger", sup: "muffigst" },
};

export const ADJECTIVES_SMELL = {
  ...SMELL_PLEASANT,
  ...SMELL_UNPLEASANT,
};

export const TASTE_BASIC = {
  süß: { comp: "süßer", sup: "süßest" },
  sauer: { comp: "saurer", sup: "sauerst" },
  bitter: { comp: "bitterer", sup: "bitterst" },
  salzig: { comp: "salziger", sup: "salzigst" },
};

export const TASTE_QUALITY = {
  würzig: { comp: "würziger", sup: "würzigst" },
  scharf: { comp: "schärfer", sup: "schärfst", irregularities: ["umlaut"] },
  fade: { comp: "fader", sup: "fadest" },
  lecker: { comp: "leckerer", sup: "leckerst" },
  köstlich: { comp: "köstlicher", sup: "köstlichst" },
  ungenießbar: { comp: "ungenießbarer", sup: "ungenießbarst" },
};

export const ADJECTIVES_TASTE = {
  ...TASTE_BASIC,
  ...TASTE_QUALITY,
};

export const SOUND_VOLUME = {
  laut: { comp: "lauter", sup: "lautest" },
  leise: { comp: "leiser", sup: "leisest" },
  lärmend: { comp: "lärmender", sup: "lärmendst" },
};

export const SOUND_TONE = {
  hell: { comp: "heller", sup: "hellst" },
  tief: { comp: "tiefer", sup: "tiefst" },
  dumpf: { comp: "dumpfer", sup: "dumpfst" },
  schrill: { comp: "schriller", sup: "schrillst" },
  melodisch: { comp: "melodischer", sup: "melodischst" },
  harmonisch: { comp: "harmonischer", sup: "harmonischst" },
  dissonant: { comp: "dissonanter", sup: "dissonantest" },
};

export const SOUND_SENSITIVITY = {
  hellhörig: { comp: "hellhöriger", sup: "hellhörigst" },
};

export const ADJECTIVES_SOUND = {
  ...SOUND_VOLUME,
  ...SOUND_TONE,
  ...SOUND_SENSITIVITY,
};

export const VISION_LIGHT = {
  hell: { comp: "heller", sup: "hellst" },
  dunkel: { comp: "dunkler", sup: "dunkelst" },
  strahlend: { comp: "strahlender", sup: "strahlendst" },
  leuchtend: { comp: "leuchtender", sup: "leuchtendst" },
  glänzend: { comp: "glänzender", sup: "glänzendst" },
  düster: { comp: "düsterer", sup: "düsterst" },
  fahl: { comp: "fahler", sup: "fahlst" },
};

export const VISION_CLARITY_COLOR = {
  klar: { comp: "klarer", sup: "klarst" },
  trüb: { comp: "trüber", sup: "trübst" },
  durchsichtig: { comp: "durchsichtiger", sup: "durchsichtigst" },
  blickdicht: { comp: "blickdichter", sup: "blickdichtest" },
  farbenfroh: { comp: "farbenfroher", sup: "farbenfrohst" },
  eintönig: { comp: "eintöniger", sup: "eintönigst" },
  unscharf: { comp: "unschärfer", sup: "unschärfst" },
};

export const ADJECTIVES_VISION = {
  ...VISION_LIGHT,
  ...VISION_CLARITY_COLOR,
};

export const ADJECTIVES_SENSES = {
  ...ADJECTIVES_TOUCH,
  ...ADJECTIVES_SMELL,
  ...ADJECTIVES_TASTE,
  ...ADJECTIVES_SOUND,
  ...ADJECTIVES_VISION,
};
