// identifyWordType.js

import {
  articles,
  prepositions,
  pronouns,
  conjunctions,
  coordinatingConjunctions,
  subordinatingConjunctions,
  adverbs,
  commonNouns,
  infinitiveVerbs,
  declinedAdjectives,
  adjectivesEndingInT,
  adjectivesEndingInEn,
  specialCases,
  ambiguousWords,
} from "./WordTypes.js";

export const identifyWordType = (word) => {
  // Verificar listas específicas PRIMERO (orden de prioridad)
  if (articles.includes(word)) return "article";
  if (prepositions.includes(word)) return "preposition";
  if (pronouns.includes(word)) return "pronoun";
  if (conjunctions.includes(word)) return "conjunction";
  if (coordinatingConjunctions.includes(word)) return "conjunction";
  if (subordinatingConjunctions.includes(word)) return "conjunction";
  if (adverbs.includes(word)) return "adverb";
  if (commonNouns.includes(word)) return "noun";
  if (infinitiveVerbs.includes(word)) return "verb";
  if (declinedAdjectives.includes(word)) return "adjective";

  // === PATRONES PARA TIPOS DE PALABRAS ===

  // Patrones para sustantivos alemanes (verificar ANTES que adjetivos)
  const nounPatterns = [
    /ung$/, // Zeichnung, Erklärung
    /heit$/, // Freiheit, Schönheit
    /keit$/, // Möglichkeit, Schwierigkeit
    /schaft$/, // Freundschaft, Wissenschaft
    /chen$/, // diminutivos: Mädchen, Häuschen
    /lein$/, // diminutivos: Fräulein
    /tion$/, // Information, Situation
    /ität$/, // Universität, Qualität
    /ismus$/, // Kapitalismus, Tourismus
    /ling$/, // Lehrling, Schmetterling
    /nis$/, // Erlebnis, Geheimnis
    /tum$/, // Christentum, Eigentum
    /in$/, // Lehrerin, Ärztin (femenino)
  ];

  // Verificar sustantivos por patrones
  for (let pattern of nounPatterns) {
    if (pattern.test(word)) return "noun";
  }

  // Si empieza con mayúscula, probablemente es sustantivo
  if (word[0] === word[0].toUpperCase() && word.length > 1) {
    return "noun";
  }

  // Patrones específicos para verbos conjugados
  const verbPatterns = [
    /ieren$/, // studieren, funktionieren
    /eln$/, // sammeln, wandeln
    /ern$/, // ändern, fördern
    /igen$/, // bestätigen, beschäftigen
  ];

  // Verificar verbos por patrones específicos
  for (let pattern of verbPatterns) {
    if (pattern.test(word)) return "verb";
  }

  // Patrones para formas verbales conjugadas (con exclusiones)
  if (word.endsWith("t") && word.length > 2) {
    // Excluir adjetivos comunes que terminan en -t

    if (!adjectivesEndingInT.includes(word)) {
      return "verb";
    }
  }

  if (word.endsWith("st") && word.length > 3) {
    return "verb"; // 2da persona singular: machst, gehst
  }

  if (word.endsWith("en") && word.length > 3) {
    // Verificar si no es un adjetivo declinado común

    if (!adjectivesEndingInEn.includes(word)) {
      return "verb";
    }
  }

  if (word.endsWith("te") && word.length > 3) {
    return "verb"; // pretérito: machte, ging
  }

  if (word.endsWith("et") && word.length > 3) {
    return "verb"; // participio: gemacht, gelernt
  }

  // Patrones para adjetivos alemanes (DESPUÉS de verificar verbos)
  const adjectivePatterns = [
    /lich$/, // freundlich, höflich, ehrlich
    /ig$/, // wichtig, richtig, ruhig
    /isch$/, // typisch, praktisch, logisch
    /ell$/, // hell, schnell, aktuell
    /sch$/, // frisch, falsch, deutsch
    /los$/, // arbeitslos, hilflos, sinnlos
    /voll$/, // hoffnungsvoll, sinnvoll, wertvoll
    /frei$/, // fehlerfrei, sorgenfrei, kostenfrei
    /reich$/, // erfolgreich, hilfreich, abwechslungsreich
    /arm$/, // ideenarm, phantasiearm, vitaminarm
    /müde$/, // lebensmüde, kriegsmüde
    /bereit$/, // hilfsbereit, einsatzbereit
    /würdig$/, // vertrauenswürdig, sehenswürdig
    /fähig$/, // arbeitsfähig, lernfähig
    /bar$/, // sichtbar, hörbar, essbar
    /sam$/, // aufmerksam, langsam, sparsam
    /haft$/, // ernsthaft, dauerhaft, fehlerhaft
  ];

  // Verificar adjetivos por patrones
  for (let pattern of adjectivePatterns) {
    if (pattern.test(word)) return "adjective";
  }

  if (specialCases[word]) {
    return specialCases[word];
  }

  return "other";
};

export const WORD_TYPES = {
  VERB: { id: "verb", color: "#e74c3c", emoji: "🔴", label: "verbo" },
  NOUN: { id: "noun", color: "#3498db", emoji: "🔵", label: "sustantivo" },
  ARTICLE: { id: "article", color: "#f39c12", emoji: "🟡", label: "artículo" },
  ADJECTIVE: {
    id: "adjective",
    color: "#ff9500",
    emoji: "🟠",
    label: "adjetivo",
  },
  PRONOUN: { id: "pronoun", color: "#00d084", emoji: "🟢", label: "pronombre" },
  PREPOSITION: {
    id: "preposition",
    color: "#9b59b6",
    emoji: "🟣",
    label: "preposición",
  },
  CONJUNCTION: {
    id: "conjunction",
    color: "#8b4513",
    emoji: "🟤",
    label: "conjunción",
  },
  ADVERB: { id: "adverb", color: "#8a2be2", emoji: "🟪", label: "adverbio" },
  OTHER: { id: "other", color: "#95a5a6", emoji: "⚫", label: "otra" },
  AMBIGUOUS: {
    id: "ambiguous",
    color: "#ff6b35",
    emoji: "🔶",
    label: "ambigua",
  },
};
