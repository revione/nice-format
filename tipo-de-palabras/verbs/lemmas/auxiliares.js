export const AUXILIARIES_FULL = {
  sein: {
    lemma: "sein",
    aux: "sein",
    praesens: {
      ich: "bin",
      du: "bist",
      "er/sie/es": "ist",
      wir: "sind",
      ihr: "seid",
      "sie/Sie": "sind",
    },
    praeteritum: {
      ich: "war",
      du: "warst",
      "er/sie/es": "war",
      wir: "waren",
      ihr: "wart",
      "sie/Sie": "waren",
    },
    konjunktiv1: {
      ich: "sei",
      du: "seiest",
      "er/sie/es": "sei",
      wir: "seien",
      ihr: "seiet",
      "sie/Sie": "seien",
    },
    konjunktiv2: {
      ich: "wäre",
      // guardar variantes como array
      du: ["wärst", "wärest"],
      "er/sie/es": "wäre",
      wir: "wären",
      ihr: ["wärt", "wäret"],
      "sie/Sie": "wären",
    },
    partizip2: "gewesen",
    imperativ: { du: "sei", ihr: "seid", Sie: "seien Sie" },
    zuInfinitiv: "zu sein",
  },

  haben: {
    lemma: "haben",
    aux: "haben",
    praesens: {
      ich: "habe",
      du: "hast",
      "er/sie/es": "hat",
      wir: "haben",
      ihr: "habt",
      "sie/Sie": "haben",
    },
    praeteritum: {
      ich: "hatte",
      du: "hattest",
      "er/sie/es": "hatte",
      wir: "hatten",
      ihr: "hattet",
      "sie/Sie": "hatten",
    },
    konjunktiv1: {
      ich: "habe",
      du: "habest",
      "er/sie/es": "habe",
      wir: "haben",
      ihr: "habet",
      "sie/Sie": "haben",
    },
    konjunktiv2: {
      ich: "hätte",
      du: "hättest",
      "er/sie/es": "hätte",
      wir: "hätten",
      ihr: "hättet",
      "sie/Sie": "hätten",
    },
    partizip2: "gehabt",
    // Imperativo de "haben" es raro, normalmente se usa "hab!" / "habt!" en coloquial
    imperativ: { du: "hab", ihr: "habt", Sie: "haben Sie" },
    zuInfinitiv: "zu haben",
  },

  werden: {
    lemma: "werden",
    aux: "werden",
    praesens: {
      ich: "werde",
      du: "wirst",
      "er/sie/es": "wird",
      wir: "werden",
      ihr: "werdet",
      "sie/Sie": "werden",
    },
    praeteritum: {
      ich: "wurde",
      du: "wurdest",
      "er/sie/es": "wurde",
      wir: "wurden",
      ihr: "wurdet",
      "sie/Sie": "wurden",
    },
    konjunktiv1: {
      ich: "werde",
      du: "werdest",
      "er/sie/es": "werde",
      wir: "werden",
      ihr: "werdet",
      "sie/Sie": "werden",
    },
    konjunktiv2: {
      ich: "würde",
      du: "würdest",
      "er/sie/es": "würde",
      wir: "würden",
      ihr: "würdet",
      "sie/Sie": "würden",
    },
    partizip2: "geworden", // (en combinaciones pasivas a veces "worden")
    imperativ: { du: "werde", ihr: "werdet", Sie: "werden Sie" },
    zuInfinitiv: "zu werden",
  },
};

// Set plano
export const AUXILIARIES = new Set(
  Object.values(AUXILIARIES_FULL).flatMap((aux) =>
    [
      aux.lemma,
      aux.aux,
      aux.partizip2,
      aux.zuInfinitiv,
      ...Object.values(aux.praesens),
      ...Object.values(aux.praeteritum),
      ...Object.values(aux.konjunktiv1),
      ...Object.values(aux.konjunktiv2).flat(), // por si hay arrays (wärst/wärest)
      ...Object.values(aux.imperativ),
    ].flat()
  )
);
