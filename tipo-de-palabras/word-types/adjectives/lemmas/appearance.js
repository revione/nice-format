export const APPEARANCE_GENERAL = {
  schön: { comp: "schöner", sup: "schönst" },
  hässlich: { comp: "hässlicher", sup: "hässlichst" },
  attraktiv: { comp: "attraktiver", sup: "attraktivst" },
  hübsch: { comp: "hübscher", sup: "hübschst" },
  gutaussehend: { comp: "gutaussehender", sup: "gutaussehendst" },
  reizvoll: { comp: "reizvoller", sup: "reizvollst" },
  ansehnlich: { comp: "ansehnlicher", sup: "ansehnlichst" },
  unattraktiv: { comp: "unattraktiver", sup: "unattraktivst" },
};

export const APPEARANCE_STYLE = {
  modisch: { comp: "modischer", sup: "modischst" },
  altmodisch: { comp: "altmodischer", sup: "altmodischst" },
  elegant: { comp: "eleganter", sup: "elegantest" },
  schick: { comp: "schicker", sup: "schickst" },
  lässig: { comp: "lässiger", sup: "lässigst" },
  geschmackvoll: { comp: "geschmackvoller", sup: "geschmackvollst" },
  geschmacklos: { comp: "geschmackloser", sup: "geschmacklosest" },
};

export const APPEARANCE_PHYSICAL = {
  charmant: { comp: "charmanter", sup: "charmantest" },
  reizend: { comp: "reizender", sup: "reizendst" },
  sexy: { comp: "sexier", sup: "sexiest" },
  auffällig: { comp: "auffälliger", sup: "auffälligst" },
  unscheinbar: { comp: "unscheinbarer", sup: "unscheinbarst" },
  markant: { comp: "markanter", sup: "markantest" },
  exotisch: { comp: "exotischer", sup: "exotischst" },
};

export const APPEARANCE_IMPRESSION = {
  edel: { comp: "edler", sup: "edelst" },
  vornehm: { comp: "vornehmer", sup: "vornehmst" },
  glamourös: { comp: "glamouröser", sup: "glamourösest" },
  prächtig: { comp: "prächtiger", sup: "prächtigst" },
  herrlich: { comp: "herrlicher", sup: "herrlichst" },
};

export const APPEARANCE_BODY = {
  stattlich: { comp: "stattlicher", sup: "stattlichst" },
  kräftig: { comp: "kräftiger", sup: "kräftigst" },
  athletisch: { comp: "athletischer", sup: "athletischst" },
  sportlich: { comp: "sportlicher", sup: "sportlichst" },
  zierlich: { comp: "zierlicher", sup: "zierlichst" },
  mager: { comp: "magerer", sup: "magerst" },
  dicklich: { comp: "dicklicher", sup: "dicklichst" },
};

export const APPEARANCE_CARE = {
  gepflegt: { comp: "gepflegter", sup: "gepflegtest" },
  ungepflegt: { comp: "ungepflegter", sup: "ungepflegtest" },
  ordentlich: { comp: "ordentlicher", sup: "ordentlichst" },
  unordentlich: { comp: "unordentlicher", sup: "unordentlichst" },
  makellos: { comp: "makelloser", sup: "makellosest" },
  zerzaust: { comp: "zerzauster", sup: "zerzaustest" },
  verwahrlost: { comp: "verwahrloster", sup: "verwahrlostest" },
};

export const APPEARANCE_EXPRESSIVE = {
  lebendig: { comp: "lebendiger", sup: "lebendigst" },
  ausdrucksstark: { comp: "ausdrucksstärker", sup: "ausdrucksstärkst" },
  geheimnisvoll: { comp: "geheimnisvoller", sup: "geheimnisvollst" },
};

export const APPEARANCE_COLOR_LIGHT = {
  farbig: { comp: "farbiger", sup: "farbigst" },
  strahlend: { comp: "strahlender", sup: "strahlendst" },
  leuchtend: { comp: "leuchtender", sup: "leuchtendst" },
  glänzend: { comp: "glänzender", sup: "glänzendst" },
  düster: { comp: "düsterer", sup: "düsterst" },
  fahl: { comp: "fahler", sup: "fahlst" },
  blass: { comp: "blasser", sup: "blassest" },
  bleich: { comp: "bleicher", sup: "bleichst" },
};

export const APPEARANCE_AGE = {
  jugendlich: { comp: "jugendlicher", sup: "jugendlichst" },
  alterslos: { comp: "altersloser", sup: "alterslosest" },
  greisenhaft: { comp: "greisenhafter", sup: "greisenhaftest" },
};

export const APPEARANCE_DETAIL = {
  gebräunt: { comp: "gebräunter", sup: "gebräuntest" },
  geschminkt: { comp: "geschminkter", sup: "geschminktest" },
  tätowiert: { comp: "tätowierter", sup: "tätowiertest" },
  unrasiert: { comp: "unrasierter", sup: "unrasiertest" },
  zerknittert: { comp: "zerknitterter", sup: "zerknittertest" },
};

export const APPEARANCE_NEGATIVE = {
  plump: { comp: "plumper", sup: "plumpst" },
  ungehobelt: { comp: "ungehobelter", sup: "ungehobeltest" },
  schäbig: { comp: "schäbiger", sup: "schäbigst" },
  lächerlich: { comp: "lächerlicher", sup: "lächerlichst" },
  billig: { comp: "billiger", sup: "billigst" },
};

export const ADJECTIVES_APPEARANCE = {
  ...APPEARANCE_GENERAL,
  ...APPEARANCE_STYLE,
  ...APPEARANCE_PHYSICAL,
  ...APPEARANCE_IMPRESSION,
  ...APPEARANCE_BODY,
  ...APPEARANCE_CARE,
  ...APPEARANCE_EXPRESSIVE,
  ...APPEARANCE_COLOR_LIGHT,
  ...APPEARANCE_AGE,
  ...APPEARANCE_DETAIL,
  ...APPEARANCE_NEGATIVE,
};
