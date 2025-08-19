// identifyWordType.js - Versión mejorada

import {
  articles,
  prepositions,
  pronouns,
  conjunctions,
  adverbs,
  commonNouns,
  infinitiveVerbs,
  basicAdjectives,
  declinedAdjectives,
  adjectivesEndingInT,
  adjectivesEndingInEn,
  specialCases,
} from "./WordTypes.js";

import { nonGermanWords } from "./nonGermanWords.js";

export const identifyWordType = (word) => {
  // Limpiar la palabra antes del análisis
  word = word.toLowerCase().trim();

  // Eliminar caracteres no alfabéticos al inicio y final
  word = word.replace(/^[^\w\säöüßáéíóúüñç]+|[^\w\säöüßáéíóúüñç]+$/g, "");

  // Si la palabra está vacía después de limpiar, retornar other
  if (!word || word.length < 1) return "other";

  if (nonGermanWords.includes(word.toLowerCase())) return "foreign";

  // 1. Verificar casos especiales PRIMERO
  if (specialCases[word]) return specialCases[word];

  // 2. Verificar listas específicas (orden de prioridad)
  if (articles.includes(word)) return "article";
  if (prepositions.includes(word)) return "preposition";
  if (pronouns.includes(word)) return "pronoun";
  if (conjunctions.includes(word)) return "conjunction";
  if (adverbs.includes(word)) return "adverb";
  if (commonNouns.includes(word)) return "noun";
  if (infinitiveVerbs.includes(word)) return "verb";
  if (basicAdjectives.includes(word)) return "adjective";
  if (declinedAdjectives.includes(word)) return "adjective";

  // 3. PATRONES PARA SUSTANTIVOS (verificar ANTES que adjetivos)
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
    /büschel$/, // haarbüschel, fellbüschel
    /ecke$/, // leseecke
    /zimmer$/, // wohnzimmer, esszimmer
    /ausdruck$/, // gesichtsausdruck, ausdruck
    /ausdrücke$/, // gesichtsausdrücke
    /finger$/, // zeigefinger
    /schuhe$/, // absatzschuhe
    /tasche$/, // umhängetasche
    /fläche$/, // farbfläche
    /grund$/, // untergrund, hintergrund
    /teil$/, // körperteil
    /winkel$/, // mundwinkel
    /symbol$/, // herzsymbol
    /foto$/, // originalfoto
    /werb$/, // wettbewerb
  ];

  // Verificar sustantivos por patrones
  for (let pattern of nounPatterns) {
    if (pattern.test(word)) return "noun";
  }

  // Si empieza con mayúscula, probablemente es sustantivo (pero no aplicar aquí porque ya viene en minúsculas)

  // 4. PATRONES PARA VERBOS CONJUGADOS
  const verbPatterns = [
    /ieren$/, // studieren, funktionieren
    /eln$/, // sammeln, wandeln
    /ern$/, // ändern, fördern
    /igen$/, // bestätigen, beschäftigen
    /ße$/, // genieße
    /ege$/, // zerleg-e (forma informal)
    /che$/, // mache, wasche, abwasche
    /ne$/, // zeichne, nenne, kenne
    /fe$/, // helfe
    /ue$/, // freue
  ];

  // Verificar verbos por patrones específicos
  for (let pattern of verbPatterns) {
    if (pattern.test(word)) return "verb";
  }

  // Formas verbales conjugadas (con exclusiones mejoradas)
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

  // 5. PATRONES PARA ADJETIVOS ALEMANES (DESPUÉS de verificar verbos)
  const adjectivePatterns = [
    /lich$/, // freundlich, höflich, ehrlich, gemütlich, heimelig
    /ig$/, // wichtig, richtig, ruhig, zottelig, wuschelig
    /isch$/, // typisch, praktisch, logisch
    /ell$/, // hell, schnell, aktuell, visuell, visuelles
    /sch$/, // frisch, falsch, deutsch
    /los$/, // arbeitslos, hilflos, sinnlos
    /voll$/, // hoffnungsvoll, sinnvoll, wertvoll, voller
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
    /end$/, // einladend (pero verificar que no sea participio)
    /elig$/, // zottelig, wuschelig
    /ige$/, // zottelige, wuschelige
    /iges$/, // zotteliges
    /icher$/, // bildhafter
    /ere$/, // dickere, kürzere
    /les$/, // visuelles, einfaches, soziales
    /rer$/, // besonderer, überraschter
    /che$/, // typische, positive, wilde (cuando no es verbo)
  ];

  // Verificar adjetivos por patrones
  for (let pattern of adjectivePatterns) {
    if (pattern.test(word)) {
      // Excepción especial para palabras que terminan en -che y podrían ser verbos
      if (word.endsWith("che")) {
        const verbsEndingInChe = [
          "mache",
          "wasche",
          "abwasche",
          "spreche",
          "breche",
        ];
        if (verbsEndingInChe.includes(word)) {
          return "verb";
        }
      }
      return "adjective";
    }
  }

  // 6. PATRONES ADICIONALES PARA CAPTURAR MÁS CASOS

  // Detectar números (dígitos)
  if (/^\d+$/.test(word)) {
    return "number";
  }

  // Detectar números ordinales alemanes
  if (word.endsWith("te") || word.endsWith("ter") || word.endsWith("tes")) {
    const base = word.replace(/(te|ter|tes)$/, "");
    if (
      base.length > 0 &&
      (base === "ers" || base === "zwei" || base === "drit" || /\d/.test(base))
    ) {
      return "number";
    }
  }

  // Sustantivos compuestos comunes
  if (
    word.includes("zimmer") ||
    word.includes("ecke") ||
    word.includes("büschel") ||
    word.includes("ausdruck") ||
    word.includes("finger") ||
    word.includes("schuhe") ||
    word.includes("tasche") ||
    word.includes("fläche") ||
    word.includes("grund") ||
    word.includes("teil") ||
    word.includes("winkel") ||
    word.includes("symbol") ||
    word.includes("foto") ||
    word.includes("werb")
  ) {
    return "noun";
  }

  // Adjetivos con prefijos comunes
  if (word.startsWith("un") && word.length > 3) {
    const baseWord = word.substring(2);
    if (
      basicAdjectives.includes(baseWord) ||
      declinedAdjectives.includes(baseWord)
    ) {
      return "adjective";
    }
  }

  // Si contiene características de adjetivos alemanes
  if (
    word.includes("sicht") || // unsichtbare
    word.includes("fach") || // einfache
    word.includes("techn") || // technische
    word.includes("visu") || // visuelle
    word.includes("eig") || // eigene
    word.includes("einz") || // einzelne
    word.includes("ganz") || // ganze (puede ser adjetivo o adverbio)
    word.includes("mitt") || // mittleres
    word.includes("sozi") || // soziales
    word.includes("pos") || // positive
    word.includes("typ") || // typische
    word.includes("wild") || // wilde
    word.includes("brech") || // zerbrechliches
    word.includes("fröh") || // fröhliches
    word.includes("täg") // tägliches
  ) {
    return "adjective";
  }

  // 7. CASOS ESPECIALES FINALES MEJORADOS

  // Palabras específicas que no están en las listas principales
  const additionalClassifications = {
    // Sustantivos específicos
    verb: "noun", // cuando se refiere al concepto gramatical
    gras: "noun", // hierba/césped
    bescheid: "noun", // aviso/información

    // Números en alemán
    fünf: "number",

    // Palabras compuestas o específicas del contexto
    hubsan: "noun", // marca/nombre propio
  };

  if (additionalClassifications[word]) {
    return additionalClassifications[word];
  }

  // Verificación final para palabras muy cortas que podrían ser abreviaciones de verbos
  if (word.length <= 4) {
    const shortVerbForms = {
      sag: "verb",
      geb: "verb",
      leg: "verb", // de zerlegen
      zeich: "verb", // de zeichnen (forma abreviada)
      sprich: "verb", // imperativo
    };

    if (shortVerbForms[word]) {
      return shortVerbForms[word];
    }
  }

  // Si llegamos aquí, clasificar como "other"
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
  NUMBER: { id: "number", color: "#17a2b8", emoji: "🔢", label: "número" },
  FOREIGN: {
    id: "foreign",
    color: "#ff6b6b",
    emoji: "🌍",
    label: "extranjero",
  },
  OTHER: { id: "other", color: "#95a5a6", emoji: "⚫", label: "otra" },
  AMBIGUOUS: {
    id: "ambiguous",
    color: "#ff6b35",
    emoji: "🔶",
    label: "ambigua",
  },
};
