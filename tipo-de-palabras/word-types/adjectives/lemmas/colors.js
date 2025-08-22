export const BASIC_COLORS = [
  "rot",
  "blau",
  "grün",
  "gelb",
  "schwarz",
  "weiß",
  "braun",
  "grau",
  "violett",
  "türkis",
  "pink",
  "magenta",
  "cyan",
  "indigo",
  "ocker",
  "blond",
  "karmesinrot",
  "purpurrot",
  "veilchenblau",
  "graphitgrau",
  "elfenbeinfarben",
  "orange",
  "beige",
];

export const METAL_COLORS = [
  "silbern",
  "golden",
  "goldfarben",
  "kupferfarben",
  "bronzen",
  "kupfern",
  "silberfarben",
  "stahlblau",
  "perlmuttfarben",
  "platinfarben",
  "messingfarben",
  "chromfarben",
  "zinnfarben",
  "aluminiumfarben",
  "eisenfarben",
];

export const NATURE_COLORS = [
  "oliv",
  "olivgrün",
  "maigrün",
  "grasgrün",
  "tannengrün",
  "himmelblau",
  "meeresblau",
  "aschengrau",
  "steingrau",
  "sandfarben",
  "hautfarben",
  "smaragdgrün",
  "saphirblau",
  "kirschrot",
  "weinrot",
  "honiggelb",
  "zitronengelb",
  "himbeerrot",
  "aprikosenfarben",
  "moosgrün",
  "laubgrün",
  "kieselgrau",
  "elfenbein",
  "korallenrot",
  "bernsteinfarben",
  "perlgrau",
  "lavendelblau",
];

export const INDECLINABLE_COLORS = [
  "rosa",
  "lila",
  // "orange",
  // "beige",
  "bordeaux",
  "creme",
  "marine",
  "khaki",
  "aubergine",
  "petrol",
  "fuchsia",
  "mauve",
  "navy",
  "cremeweiß",
  "taupe",
  "salbei",
  "mint",
  "vanille",
  "lavendel",
  "olivbeige",
  "taupegrau",
  "minttürkis",
  "camel",
  "sand",
  "chili",
  "jeans",
];

export const DECLINABLE_COLORS = [...BASIC_COLORS, ...METAL_COLORS, ...NATURE_COLORS];

export const COLOR_PREFIXES = [
  "hell", // claro → hellblau
  "dunkel", // oscuro → dunkelrot
  "knall", // chillón → knallrot
  "pastell", // pastel → pastellrosa
  "neon", // neón → neongrün
  "stahl", // metálico → stahlblau
  "blut", // muy intenso → blutrot
  "mai", // verde mayo → maigrün
  "gras", // verde hierba → grasgrün
  "tannen", // verde abeto → tannengrün
  "smaragd", // verde esmeralda → smaragdgrün
  "saphir", // azul zafiro → saphirblau
  "zart", // delicado/suave → zartrosa
  "milch", // lechoso → milchweiß
  "feuer", // fuego → feuerrot
  "nacht", // noche → nachtblau
  "kupfer", // cobre → kupferrot
  "blüten", // flor → blütenweiß
  "maulbeer", // mora → maulbeerrot
  "erd", // tierra → erdrot, erdfarben
  "asphalt", // asfalto → asphaltgrau
];

export const COLOR_SUFFIXES = [
  "farben", // color de → kupferfarben, hautfarben
  "artig", // de aspecto → steinartig
  "stichig", // con tinte → grünstichig
  "lastig", // con predominio de → rotlastig
  "ähnlich", // similar a → blauähnlich
  "ton", // tono → beigeton, grauton
  "schimmernd", // brillante → silberschimmernd
  "glänzend", // reluciente → goldglänzend
];
