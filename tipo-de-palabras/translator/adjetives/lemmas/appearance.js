import { flatteAdj } from "./utils.js";

export const APPEARANCE_GENERAL = [
  { base: { de: "schön", es: "hermoso/a, bonito/a" } },
  { base: { de: "hässlich", es: "feo/a" } },
  { base: { de: "attraktiv", es: "atractivo/a" } },
  { base: { de: "hübsch", es: "guapo/a, lindo/a" } },
  { base: { de: "gutaussehend", es: "bien parecido/a" } },
  { base: { de: "reizvoll", es: "atrayente, seductor/a" } },
  { base: { de: "ansehnlich", es: "presentable, atractivo/a" } },
  {
    base: { de: "unattraktiv", es: "poco atractivo/a" },
    comp: { de: "unattraktiver", es: "menos atractivo/a" },
    sup: { de: "unattraktivst", es: "el/la menos atractivo/a" },
  },
];

export const APPEARANCE_STYLE = [
  { base: { de: "modisch", es: "de moda, moderno/a" } },
  { base: { de: "altmodisch", es: "anticuado/a" } },
  { base: { de: "elegant", es: "elegante" } },
  { base: { de: "schick", es: "chic, elegante" } },
  { base: { de: "lässig", es: "informal, desenfadado/a" } },

  {
    base: { de: "geschmackvoll", es: "de buen gusto" },
    comp: { de: "geschmackvoller", es: "de mejor gusto" },
    sup: { de: "geschmackvollst", es: "del mejor gusto" },
  },
  {
    base: { de: "geschmacklos", es: "de mal gusto" },
    comp: { de: "geschmackloser", es: "de peor gusto" },
    sup: { de: "geschmacklosest", es: "de el peor gusto" },
  },
];

export const APPEARANCE_PHYSICAL = [
  { base: { de: "charmant", es: "encantador/a" } },
  { base: { de: "reizend", es: "encantador/a, agradable" } },

  {
    base: { de: "sexy", es: "sexy" },
    comp: { de: "sexier", es: "más sexy" },
    sup: { de: "sexiest", es: "el/la más sexy" },
  },

  { base: { de: "auffällig", es: "llamativo/a" } },
  { base: { de: "unscheinbar", es: "poco llamativo/a, discreto/a" } },
  { base: { de: "markant", es: "marcado/a, distintivo/a" } },
  { base: { de: "exotisch", es: "exótico/a" } },
];

export const APPEARANCE_IMPRESSION = [
  { base: { de: "edel", es: "noble, fino/a" } },
  { base: { de: "vornehm", es: "distinguido/a" } },
  { base: { de: "glamourös", es: "glamuroso/a" } },
  { base: { de: "prächtig", es: "magnífico/a, suntuoso/a" } },
  { base: { de: "herrlich", es: "espléndido/a" } },
];

export const APPEARANCE_BODY = [
  { base: { de: "stattlich", es: "imponente, corpulento/a" } },
  { base: { de: "kräftig", es: "fuerte, robusto/a" } },
  { base: { de: "athletisch", es: "atlético/a" } },
  { base: { de: "sportlich", es: "de aspecto deportivo" } },
  { base: { de: "zierlich", es: "delicado/a, menudo/a" } },
  { base: { de: "mager", es: "delgado/a, enjuto/a" } },
  { base: { de: "dicklich", es: "regordete/a" } },
];

export const APPEARANCE_CARE = [
  { base: { de: "gepflegt", es: "cuidado/a, bien arreglado/a" } },
  { base: { de: "ungepflegt", es: "descuidado/a" } },
  { base: { de: "ordentlich", es: "pulcro/a, ordenado/a" } },
  { base: { de: "unordentlich", es: "desaliñado/a, desordenado/a" } },
  { base: { de: "makellos", es: "impecable" } },
  { base: { de: "zerzaust", es: "despeinado/a, desgreñado/a" } },
  { base: { de: "verwahrlost", es: "abandonado/a, muy descuidado/a" } },
];

export const APPEARANCE_EXPRESSIVE = [
  { base: { de: "lebendig", es: "vivaz, expresivo/a" } },
  {
    base: { de: "ausdrucksstark", es: "muy expresivo/a" },
    comp: { de: "ausdrucksstärker", es: "aún más expresivo/a" },
    sup: { de: "ausdrucksstärkst", es: "el/la más expresivo/a" },
  },
  { base: { de: "geheimnisvoll", es: "misterioso/a" } },
];

export const APPEARANCE_COLOR_LIGHT = [
  { base: { de: "farbig", es: "colorido/a" } },
  { base: { de: "strahlend", es: "resplandeciente" } },
  { base: { de: "leuchtend", es: "brillante, luminoso/a" } },
  { base: { de: "glänzend", es: "reluciente, brillante" } },
  { base: { de: "düster", es: "lúgubre, sombrío/a" } },
  { base: { de: "fahl", es: "pálido/a (cetrino)" } },
  { base: { de: "blass", es: "pálido/a" } },
  { base: { de: "bleich", es: "muy pálido/a" } },
];

export const APPEARANCE_AGE = [{ base: { de: "jugendlich", es: "juvenil" } }, { base: { de: "alterslos", es: "atemporal, sin edad" } }, { base: { de: "greisenhaft", es: "de anciano/a, senil" } }];

export const APPEARANCE_DETAIL = [
  { base: { de: "gebräunt", es: "bronceado/a" } },
  { base: { de: "geschminkt", es: "maquillado/a" } },

  {
    base: { de: "tätowiert", es: "tatuado/a", en: "tattooed" },
    comp: { de: "tätowierter", es: "con más tatuajes", en: "more tattooed" },
    sup: { de: "tätowiertest", es: "con la mayor cantidad de tatuajes", en: "most tattooed" },
  },

  { base: { de: "unrasiert", es: "sin afeitar" } },
  { base: { de: "zerknittert", es: "arrugado/a" } },
];

export const APPEARANCE_NEGATIVE = [
  { base: { de: "plump", es: "basto/a, tosco/a" } },
  { base: { de: "ungehobelt", es: "grosero/a" } },
  { base: { de: "schäbig", es: "andrajoso/a, desaliñado/a" } },
  { base: { de: "lächerlich", es: "ridículo/a" } },
  { base: { de: "billig", es: "barato/a (de aspecto)" } },
];

export const ADJECTIVES_APPEARANCE = flatteAdj([
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
]);
