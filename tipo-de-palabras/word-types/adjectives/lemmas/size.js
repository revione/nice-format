export const GENERAL = {
  groß: { comp: "größer", sup: "größt", irregularities: ["umlaut"] },
  klein: { comp: "kleiner", sup: "kleinst" },
  riesig: { comp: "riesiger", sup: "riesigst" },
  winzig: { comp: "winziger", sup: "winzigst" },
  enorm: { comp: "enormer", sup: "enormst" },
  gewaltig: { comp: "gewaltiger", sup: "gewaltigst" },
  mächtig: { comp: "mächtiger", sup: "mächtigst" },
  winzklein: { comp: "winzkleiner", sup: "winzkleinst" },
  übergroß: { comp: "übergroßer", sup: "übergroßt" },
};

export const HEIGHT_DEPTH = {
  hoch: { comp: "höher", sup: "höchst", irregularities: ["umlaut"] },
  tief: { comp: "tiefer", sup: "tiefst" },
  flach: { comp: "flacher", sup: "flachst" },
  steil: { comp: "steiler", sup: "steilst" },
  niedrig: { comp: "niedriger", sup: "niedrigst" },
  oberflächlich: { comp: "oberflächlicher", sup: "oberflächlichst" },
  bodennah: { comp: "bodennaher", sup: "bodennahst" },
};

export const WIDTH = {
  breit: { comp: "breiter", sup: "breitest" },
  schmal: { comp: "schmaler", sup: "schmalst" },
  eng: { comp: "enger", sup: "engst" },
  weit: { comp: "weiter", sup: "weitest" },
  ausgedehnt: { comp: "ausgedehnter", sup: "ausgedehntest" },
  schmächtig: { comp: "schmächtiger", sup: "schmächtigst" },
};

export const LENGTH = {
  lang: { comp: "länger", sup: "längst", irregularities: ["umlaut"] },
  kurz: { comp: "kürzer", sup: "kürzest", irregularities: ["umlaut"] },
  endlos: { comp: "endloser", sup: "endlosest" },
  kurzzeitig: { comp: "kurzzeitiger", sup: "kurzzeitigst" },
};

export const WEIGHT_VOLUME = {
  schwer: { comp: "schwerer", sup: "schwerst" },
  leicht: { comp: "leichter", sup: "leichtest" },
  dick: { comp: "dicker", sup: "dickst" },
  dünn: { comp: "dünner", sup: "dünnst" },
  massiv: { comp: "massiver", sup: "massivst" },
  voluminös: { comp: "voluminöser", sup: "voluminösest" },
  schwerfällig: { comp: "schwerfälliger", sup: "schwerfälligst" },
  federleicht: { comp: "federleichter", sup: "federleichtst" },
  dicht: { comp: "dichter", sup: "dichtest" },
  locker: { comp: "lockerer", sup: "lockerst" },
};

export const SHAPE = {
  rund: { comp: "runder", sup: "rundest" },
  oval: { comp: "ovaler", sup: "ovalst" },
  eckig: { comp: "eckiger", sup: "eckigst" },
  kantig: { comp: "kantiger", sup: "kantigst" },
  quadratisch: { comp: "quadratischer", sup: "quadratischst" },
  rechteckig: { comp: "rechteckiger", sup: "rechteckigst" },
  kugelförmig: { comp: "kugelförmiger", sup: "kugelförmigst" },
  zylindrisch: { comp: "zylindrischer", sup: "zylindrischst" },
  dreieckig: { comp: "dreieckiger", sup: "dreieckigst" },
  unregelmäßig: { comp: "unregelmäßiger", sup: "unregelmäßigst" },
};

export const SPACE = {
  weitläufig: { comp: "weitläufiger", sup: "weitläufigst" },
  geräumig: { comp: "geräumiger", sup: "geräumigst" },
  engräumig: { comp: "engräumiger", sup: "engräumigst" },
  offen: { comp: "offener", sup: "offenst" },
  begrenzt: { comp: "begrenzter", sup: "begrenztest" },
  weitreichend: { comp: "weitreichender", sup: "weitreichendst" },
};

export const ADJECTIVES_SIZE = {
  ...GENERAL,
  ...HEIGHT_DEPTH,
  ...WIDTH,
  ...LENGTH,
  ...WEIGHT_VOLUME,
  ...SHAPE,
  ...SPACE,
};
