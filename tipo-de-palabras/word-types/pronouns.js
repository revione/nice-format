// =====================
// Pronombres en alemán
// =====================

export const PRON_PERSONAL = {
  nominativ: ["ich", "du", "er", "sie", "es", "wir", "ihr", "sie", "Sie"],
  akkusativ: ["mich", "dich", "ihn", "sie", "es", "uns", "euch", "sie", "Sie"],
  dativ: ["mir", "dir", "ihm", "ihr", "ihm", "uns", "euch", "ihnen", "Ihnen"],
  genitiv: ["meiner", "deiner", "seiner", "ihrer", "seiner", "unser", "euer", "ihrer", "Ihrer"],
};

export const PRON_REFLEXIVE = ["sich"];

export const PRON_POSESSIVE = [
  "mein",
  "dein",
  "sein",
  "ihr",
  "unser",
  "euer",
  "Ihr",
  "meine",
  "meinen",
  "meinem",
  "meiner",
  "meines",
  "deine",
  "deinen",
  "deinem",
  "deiner",
  "deines",
  "seine",
  "seinen",
  "seinem",
  "seiner",
  "seines",
  "ihre",
  "ihren",
  "ihrem",
  "ihrer",
  "ihres",
  "unsere",
  "unseren",
  "unserem",
  "unserer",
  "unseres",
  "eure",
  "euren",
  "eurem",
  "eurer",
  "eures",
];

export const PRON_DEMONSTRATIVE = [
  "dieser",
  "diese",
  "dieses",
  "diesen",
  "diesem",
  "jener",
  "jene",
  "jenes",
  "jenen",
  "jenem",
  "derselbe",
  "derselben",
  "derselben",
  "dasselbe",
  "derjenige",
  "diejenige",
  "dasjenige",
  "deren", // genitivo de "die" (plural) o "sie"
  "dessen", // genitivo de "der/das"
];

export const PRON_INTERROGATIVE = [
  "wer",
  "was",
  "welcher",
  "welche",
  "welches",
  "wessen",
  "wasfür", // "was für ein"
];

export const PRON_INDEFINITE = [
  "man",
  "jemand",
  "niemand",
  "etwas",
  "nichts",
  "alles",
  "einer",
  "keiner",
  "irgendein",
  "irgendetwas",
  "irgendwer",
  "andere",
  "verschiedene",
  "einige",
  "mehrere",
  "mancher",
  "manche",
  "manches",
  "paar", // "ein paar" - cantidad indefinida pequeña
];

export const PRON_QUANTIFIERS = ["alle", "viele", "wenige", "viel", "wenig", "sämtliche", "etliche", "zahlreiche"];

export const PRON_ADVERBIAL = ["dabei", "wo", "worauf", "woraus", "womit", "davon", "darauf"];

export const PRONOUNS = Array.from(
  new Set([...Object.values(PRON_PERSONAL).flat(), ...PRON_REFLEXIVE, ...PRON_POSESSIVE, ...PRON_DEMONSTRATIVE, ...PRON_INTERROGATIVE, ...PRON_INDEFINITE, ...PRON_QUANTIFIERS, ...PRON_ADVERBIAL])
);
