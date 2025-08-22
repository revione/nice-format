// Casos especiales finales
export const specialCases = {
  // Números
  null: "number",
  eins: "number",
  zwei: "number",
  drei: "number",
  vier: "number",
  fünf: "number",
  sechs: "number",
  sieben: "number",
  acht: "number",
  neun: "number",
  zehn: "number",
  elf: "number",
  zwölf: "number",
  dreizehn: "number",
  vierzehn: "number",
  fünfzehn: "number",
  sechzehn: "number",
  siebzehn: "number",
  achtzehn: "number",
  neunzehn: "number",
  zwanzig: "number",
  dreißig: "number",
  vierzig: "number",
  fünfzig: "number",
  sechzig: "number",
  siebzig: "number",
  achtzig: "number",
  neunzig: "number",
  hundert: "number",
  tausend: "number",
  million: "number",
  milliarde: "number",
  erste: "number",
  zweite: "number",
  dritte: "number",

  // Verbos conjugados específicos
  ist: "verb",
  sind: "verb",
  war: "verb",
  waren: "verb",
  bin: "verb",
  bist: "verb",
  hat: "verb",
  haben: "verb",
  hatte: "verb",
  hatten: "verb",
  wird: "verb",
  werden: "verb",
  wurde: "verb",
  wurden: "verb",
  worden: "verb",
  kann: "verb",
  können: "verb",
  konnte: "verb",
  konnten: "verb",
  will: "verb",
  wollen: "verb",
  wollte: "verb",
  wollten: "verb",
  soll: "verb",
  sollen: "verb",
  sollte: "verb",
  sollten: "verb",
  muss: "verb",
  müssen: "verb",
  musste: "verb",
  mussten: "verb",
  darf: "verb",
  dürfen: "verb",
  durfte: "verb",
  durften: "verb",
  mag: "verb",
  mögen: "verb",
  mochte: "verb",
  mochten: "verb",
  möchte: "verb",
  möchten: "verb",

  // Palabras especiales alemanas
  wäre: "verb", // sería (subjuntivo de sein)
  lass: "verb", // deja (imperativo de lassen)
  hab: "verb", // tengo (coloquial de haben)
  gab: "verb", // había/hubo (pretérito de geben)
  würde: "verb", // haría (subjuntivo de werden)
  gebe: "verb", // doy (1ra persona de geben)
  wasche: "verb", // lavo (1ra persona de waschen)
  gucke: "verb", // miro (1ra persona de gucken)
  schaue: "verb", // miro (1ra persona de schauen)
  zeichne: "verb", // dibujo (1ra persona de zeichnen)
  habe: "verb", // tengo (1ra persona de haben)
  kenne: "verb", // conozco (1ra persona de kennen)
  helfe: "verb", // ayudo (1ra persona de helfen)
  abwasche: "verb", // lavo platos (1ra persona de abwaschen)
  mache: "verb", // hago (1ra persona de machen)
  nenne: "verb", // nombro (1ra persona de nennen)
  freue: "verb", // me alegro (1ra persona de freuen)
  zerleg: "verb", // descompongo (forma coloquial)
  zeich: "verb", // dibujo (forma abreviada)
  sprich: "verb", // hablo (imperativo de sprechen)
  geb: "verb", // doy (forma coloquial)
  sag: "verb", // digo (imperativo de sagen)

  // Partículas y otras
  bitte: "other",
  danke: "adverb",
  bescheid: "noun", // "Bescheid" es sustantivo, como en "Bescheid geben/sagen"
  zeihhan: "foreign", // error de transcripción
  zeihanon: "foreign", // error de transcripción
  any: "foreign", // palabra inglesa

  ersten: "adjective", // primer/primera
  verleiht: "verb", // otorga (3ª persona)
};

export const ambiguousWords = {
  wolle: {
    type: "ambiguous",
    meanings: "lana (sustantivo) / quería (verbo)",
    primary: "noun",
  },
};
