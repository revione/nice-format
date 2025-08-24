import { flatteAdj } from "./utils.js";

export const BASIC_COLORS_FORMS = [
  // básicos: sí gradables
  { base: { de: "rot", es: "rojo" }, irregularities: ["umlaut"] }, // röter, rötesten
  { base: { de: "blau", es: "azul" } },
  { base: { de: "grün", es: "verde" } },
  { base: { de: "gelb", es: "amarillo" } },
  { base: { de: "schwarz", es: "negro" }, irregularities: ["umlaut"] }, // schwärzer
  { base: { de: "weiß", es: "blanco" } },
  { base: { de: "braun", es: "marrón" } },
  { base: { de: "grau", es: "gris" } },
  { base: { de: "violett", es: "violeta" } },
  { base: { de: "türkis", es: "turquesa" } },
  { base: { de: "blond", es: "rubio" } },

  // préstamos/tonalidades: no gradables
  { base: { de: "pink", es: "rosa fuerte" }, gradable: false },
  { base: { de: "magenta", es: "magenta" }, gradable: false },
  { base: { de: "cyan", es: "cian" }, gradable: false },
  { base: { de: "indigo", es: "índigo" }, gradable: false },
  { base: { de: "ocker", es: "ocre" }, gradable: false },

  // compuestos / -farben: no gradables
  { base: { de: "karmesinrot", es: "carmesí" }, gradable: false },
  { base: { de: "purpurrot", es: "púrpura" }, gradable: false },
  { base: { de: "veilchenblau", es: "azul violeta" }, gradable: false },
  { base: { de: "graphitgrau", es: "gris grafito" }, gradable: false },
  { base: { de: "elfenbeinfarben", es: "color marfil" }, gradable: false },

  // también habituales pero no gradables
  { base: { de: "orange", es: "naranja" }, gradable: false },
  { base: { de: "beige", es: "beige" }, gradable: false },
];

export const METAL_COLORS_FORMS = [
  { base: { de: "silbern", es: "plateado" }, gradable: false },
  { base: { de: "golden", es: "dorado" }, gradable: false },
  { base: { de: "goldfarben", es: "color oro" }, gradable: false },
  { base: { de: "kupferfarben", es: "color cobre" }, gradable: false },
  { base: { de: "bronzen", es: "bronce" }, gradable: false },
  { base: { de: "kupfern", es: "cobrizo" }, gradable: false },
  { base: { de: "silberfarben", es: "color plata" }, gradable: false },
  { base: { de: "stahlblau", es: "azul acero" }, gradable: false },
  { base: { de: "perlmuttfarben", es: "nácar" }, gradable: false },
  { base: { de: "platinfarben", es: "color platino" }, gradable: false },
  { base: { de: "messingfarben", es: "color latón" }, gradable: false },
  { base: { de: "chromfarben", es: "color cromo" }, gradable: false },
  { base: { de: "zinnfarben", es: "color estaño" }, gradable: false },
  { base: { de: "aluminiumfarben", es: "color aluminio" }, gradable: false },
  { base: { de: "eisenfarben", es: "color hierro" }, gradable: false },
];

export const NATURE_COLORS_FORMS = [
  { base: { de: "oliv", es: "oliva" }, gradable: false },
  { base: { de: "olivgrün", es: "verde oliva" }, gradable: false },
  { base: { de: "maigrün", es: "verde mayo" }, gradable: false },
  { base: { de: "grasgrün", es: "verde hierba" }, gradable: false },
  { base: { de: "tannengrün", es: "verde abeto" }, gradable: false },
  { base: { de: "himmelblau", es: "azul cielo" }, gradable: false },
  { base: { de: "meeresblau", es: "azul marino" }, gradable: false },
  { base: { de: "aschengrau", es: "gris ceniza" }, gradable: false },
  { base: { de: "steingrau", es: "gris piedra" }, gradable: false },
  { base: { de: "sandfarben", es: "color arena" }, gradable: false },
  { base: { de: "hautfarben", es: "color piel" }, gradable: false },
  { base: { de: "smaragdgrün", es: "verde esmeralda" }, gradable: false },
  { base: { de: "saphirblau", es: "azul zafiro" }, gradable: false },
  { base: { de: "kirschrot", es: "rojo cereza" }, gradable: false },
  { base: { de: "weinrot", es: "rojo vino" }, gradable: false },
  { base: { de: "honiggelb", es: "amarillo miel" }, gradable: false },
  { base: { de: "zitronengelb", es: "amarillo limón" }, gradable: false },
  { base: { de: "himbeerrot", es: "rojo frambuesa" }, gradable: false },
  { base: { de: "aprikosenfarben", es: "color albaricoque" }, gradable: false },
  { base: { de: "moosgrün", es: "verde musgo" }, gradable: false },
  { base: { de: "laubgrün", es: "verde follaje" }, gradable: false },
  { base: { de: "kieselgrau", es: "gris guijarro" }, gradable: false },
  { base: { de: "elfenbein", es: "marfil" }, gradable: false },
  { base: { de: "korallenrot", es: "rojo coral" }, gradable: false },
  { base: { de: "bernsteinfarben", es: "ámbar" }, gradable: false },
  { base: { de: "perlgrau", es: "gris perla" }, gradable: false },
  { base: { de: "lavendelblau", es: "azul lavanda" }, gradable: false },
];

export const INDECLINABLE_COLORS_FORMS = [
  { base: { de: "rosa", es: "rosa" }, gradable: false },
  { base: { de: "lila", es: "lila" }, gradable: false },
  { base: { de: "bordeaux", es: "burdeos" }, gradable: false },
  { base: { de: "creme", es: "crema" }, gradable: false },
  { base: { de: "marine", es: "marino" }, gradable: false },
  { base: { de: "khaki", es: "caqui" }, gradable: false },
  { base: { de: "aubergine", es: "berenjena" }, gradable: false },
  { base: { de: "petrol", es: "petróleo" }, gradable: false },
  { base: { de: "fuchsia", es: "fucsia" }, gradable: false },
  { base: { de: "mauve", es: "malva" }, gradable: false },
  { base: { de: "navy", es: "azul marino" }, gradable: false },
  { base: { de: "cremeweiß", es: "blanco crema" }, gradable: false },
  { base: { de: "taupe", es: "topo" }, gradable: false },
  { base: { de: "salbei", es: "salvia" }, gradable: false },
  { base: { de: "mint", es: "menta" }, gradable: false },
  { base: { de: "vanille", es: "vainilla" }, gradable: false },
  { base: { de: "lavendel", es: "lavanda" }, gradable: false },
  { base: { de: "olivbeige", es: "beige oliva" }, gradable: false },
  { base: { de: "taupegrau", es: "gris topo" }, gradable: false },
  { base: { de: "minttürkis", es: "turquesa menta" }, gradable: false },
  { base: { de: "camel", es: "camel" }, gradable: false },
  { base: { de: "sand", es: "arena" }, gradable: false },
  { base: { de: "chili", es: "chile" }, gradable: false },
  { base: { de: "jeans", es: "vaquero / denim" }, gradable: false },
];

export const COLOR_PREFIXES_FORMS = [
  // Como prefijos, no generamos comp/sup
  { base: { de: "hell", es: "claro" }, gradable: false },
  { base: { de: "dunkel", es: "oscuro" }, gradable: false },
  { base: { de: "knall", es: "chillón" }, gradable: false },
  { base: { de: "pastell", es: "pastel" }, gradable: false },
  { base: { de: "neon", es: "neón" }, gradable: false },
  { base: { de: "stahl", es: "metálico" }, gradable: false },
  { base: { de: "blut", es: "sangre / muy intenso" }, gradable: false },
  { base: { de: "mai", es: "mayo" }, gradable: false },
  { base: { de: "gras", es: "hierba" }, gradable: false },
  { base: { de: "tannen", es: "abeto" }, gradable: false },
  { base: { de: "smaragd", es: "esmeralda" }, gradable: false },
  { base: { de: "saphir", es: "zafiro" }, gradable: false },
  { base: { de: "zart", es: "delicado / suave" }, gradable: false },
  { base: { de: "milch", es: "lechoso" }, gradable: false },
  { base: { de: "feuer", es: "fuego" }, gradable: false },
  { base: { de: "nacht", es: "noche" }, gradable: false },
  { base: { de: "kupfer", es: "cobre" }, gradable: false },
  { base: { de: "blüten", es: "flor" }, gradable: false },
  { base: { de: "maulbeer", es: "mora" }, gradable: false },
  { base: { de: "erd", es: "tierra" }, gradable: false },
  { base: { de: "asphalt", es: "asfalto" }, gradable: false },
];

export const COLOR_SUFFIXES_FORMS = [
  { base: { de: "farben", es: "color de" }, gradable: false },
  { base: { de: "artig", es: "de aspecto" }, gradable: false },
  { base: { de: "stichig", es: "con tinte" }, gradable: false },
  { base: { de: "lastig", es: "con predominio de" }, gradable: false },
  { base: { de: "ähnlich", es: "similar a" }, gradable: false },
  { base: { de: "ton", es: "tono" }, gradable: false },
  { base: { de: "schimmernd", es: "brillante" }, gradable: false },
  { base: { de: "glänzend", es: "reluciente" }, gradable: false },
];

export const COLORS_FORMS = [...BASIC_COLORS_FORMS, ...METAL_COLORS_FORMS, ...NATURE_COLORS_FORMS, ...INDECLINABLE_COLORS_FORMS];

export const COLORS = flatteAdj([...COLORS_FORMS, ...COLOR_PREFIXES_FORMS, ...COLOR_SUFFIXES_FORMS]);
