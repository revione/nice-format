// ==========================================
// Sustantivos en alemán — esquema y bloques (extendido)
// ==========================================

// Géneros
export const GENDER = { M: "der", F: "die", N: "das", PL: "die" };

// ==========================================
// SUFIJOS NOMINALES ALEMANES
// ==========================================

// Sufijos derivacionales (forman sustantivos de otras palabras)
export const NOUN_SUFFIX_DERIVATIONAL = [
  // Abstractos femeninos
  "ung", // Bildung, Lösung, Erfahrung
  "heit", // Schönheit, Wahrheit, Gesundheit
  "keit", // Möglichkeit, Schwierigkeit, Freundlichkeit
  "schaft", // Freundschaft, Wissenschaft, Gesellschaft
  "tät", // Qualität, Universität, Aktivität
  "tion", // Information, Station, Nation
  "ität", // Realität, Identität, Popularität
  "anz", // Eleganz, Distanz, Toleranz
  "enz", // Existenz, Tendenz, Präsenz
  "ik", // Musik, Politik, Technik
  "ur", // Kultur, Natur, Struktur

  // Abstractos masculinos
  "ismus", // Kapitalismus, Tourismus, Realismus
  "ist", // Tourist, Journalist, Spezialist
  "ling", // Frühling, Schmetterling, Liebling
  "tum", // Christentum, Eigentum, Wachstum
  "nis", // Ergebnis, Verständnis, Erlebnis (meist neutro, algunos masc.)

  // Diminutivos (neutros)
  "lein", // Häuslein, Kätzlein, Kindlein
  "chen", // Häuschen, Kätzchen, Kindchen

  // Otros
  "ment", // Instrument, Element, Dokument (neutro)
  "eur", // Friseur, Ingenieur, Chauffeur (masculino)
  "ion", // Region, Million, Union (femenino)
];

// Sufijos compositivos (forman sustantivos compuestos)
export const NOUN_SUFFIX_COMPOSITIONAL = [
  // Partes del cuerpo/objetos
  "finger", // Zeigefinger, Ringfinger
  "schuhe", // Hausschuhe, Sportschuhe
  "tasche", // Handtasche, Schultasche

  // Espacios/lugares
  "zimmer", // Wohnzimmer, Schlafzimmer, Arbeitszimmer
  "ecke", // Leseecke, Spielecke, Straßenecke
  "fläche", // Oberfläche, Grundfläche, Wohnfläche
  "grund", // Hintergrund, Spielgrund, Baugrund
  "winkel", // Dachwinkel, Straßenwinkel

  // Objetos/conceptos
  "teil", // Körperteil, Einzelteil, Bestandteil
  "symbol", // Herzsymbol, Friedenssymbol
  "foto", // Passfoto, Familienfoto
  "ausdruck", // Gesichtsausdruck, Kunstausdruck
  "werbung", // Fernsehwerbung, Radiowerbung
  "büschel", // Haarbüschel, Blütenbüschel
];

export const NOUN_SUFFIXES = [...NOUN_SUFFIX_DERIVATIONAL, ...NOUN_SUFFIX_COMPOSITIONAL];

// ==========================================
// FUNCIÓN PARA DETECTAR SUSTANTIVOS POR SUFIJO
// ==========================================

/**
 * Detecta si una palabra parece sustantivo por su sufijo
 * @param {string} word - palabra a analizar
 * @returns {Object} información sobre el sufijo encontrado
 */
export function detectNounBySuffix(word) {
  const normalized = word.toLowerCase();

  // Buscar sufijos derivacionales (más confiables)
  for (const suffix of NOUN_SUFFIX_DERIVATIONAL) {
    if (normalized.endsWith(suffix)) {
      let predictedGender = null;

      // Predecir género basado en sufijo
      if (["ung", "heit", "keit", "schaft", "tät", "tion", "ität", "anz", "enz", "ik", "ur", "ion"].includes(suffix)) {
        predictedGender = GENDER.F;
      } else if (["ismus", "ist", "ling"].includes(suffix)) {
        predictedGender = GENDER.M;
      } else if (["lein", "chen", "ment"].includes(suffix)) {
        predictedGender = GENDER.N;
      } else if (suffix === "nis") {
        predictedGender = GENDER.N; // Mayormente neutro, algunos masculinos
      } else if (suffix === "eur") {
        predictedGender = GENDER.M;
      }

      return {
        isNoun: true,
        type: "derivational",
        suffix,
        predictedGender,
        confidence: 0.9,
      };
    }
  }

  // Buscar sufijos compositivos (menos confiables, depende del contexto)
  for (const suffix of NOUN_SUFFIX_COMPOSITIONAL) {
    if (normalized.endsWith(suffix)) {
      return {
        isNoun: true,
        type: "compositional",
        suffix,
        predictedGender: null, // Depende del primer elemento del compuesto
        confidence: 0.7,
      };
    }
  }

  return {
    isNoun: false,
    type: null,
    suffix: null,
    predictedGender: null,
    confidence: 0,
  };
}

// Helper actualizado
function noun({ lemma, gender, plural, domains = [], notes = [], aliases = [] }) {
  const lem = String(lemma).toLowerCase();
  const normPlural =
    plural == null
      ? null
      : Array.isArray(plural)
      ? plural
      : String(plural).includes("/")
      ? String(plural)
          .split("/")
          .map((s) => s.trim())
      : plural;

  return {
    lemma: lem,
    display: lem ? lem[0].toUpperCase() + lem.slice(1) : "",
    gender,
    plural: normPlural,
    domains,
    notes,
    aliases,
  };
}

// ==========================================
// ENTRADAS (llenadas con tu lista; principales)
// ==========================================
export const NOUNS = [
  // --- Personas / Familia / Animales / Cuerpo ---
  noun({ lemma: "frau", gender: GENDER.F, plural: "frauen", domains: ["people"] }),
  noun({ lemma: "mann", gender: GENDER.M, plural: "männer", domains: ["people"] }),
  noun({ lemma: "mensch", gender: GENDER.M, plural: "menschen", domains: ["people"], notes: ["Nomen schwach (débil)"] }),
  noun({ lemma: "person", gender: GENDER.F, plural: "personen", domains: ["people"] }),
  noun({ lemma: "leute", gender: GENDER.PL, plural: null, domains: ["people"], notes: ["pluralia tantum"] }),
  noun({ lemma: "familie", gender: GENDER.F, plural: "familien", domains: ["people"] }),
  noun({ lemma: "kind", gender: GENDER.N, plural: "kinder", domains: ["people"] }),
  noun({ lemma: "hund", gender: GENDER.M, plural: "hunde", domains: ["animals"] }),
  noun({ lemma: "katze", gender: GENDER.F, plural: "katzen", domains: ["animals"] }),

  noun({ lemma: "kopf", gender: GENDER.M, plural: "köpfe", domains: ["body"] }),
  noun({ lemma: "ohr", gender: GENDER.N, plural: "ohren", domains: ["body"] }),
  noun({ lemma: "mund", gender: GENDER.M, plural: "münder", domains: ["body"] }),
  noun({ lemma: "hand", gender: GENDER.F, plural: "hände", domains: ["body"] }),
  noun({ lemma: "haar", gender: GENDER.N, plural: "haare", domains: ["body"] }),
  noun({ lemma: "schulter", gender: GENDER.F, plural: "schultern", domains: ["body"] }),
  noun({ lemma: "zahn", gender: GENDER.M, plural: "zähne", domains: ["body"] }),
  noun({ lemma: "blick", gender: GENDER.M, plural: "blicke", domains: ["body", "perception"] }),
  noun({ lemma: "richtung", gender: GENDER.F, plural: "richtungen", domains: ["abstract"] }),
  noun({ lemma: "körper", gender: GENDER.M, plural: "körper", domains: ["body"] }),
  noun({ lemma: "körperteil", gender: GENDER.M, plural: "körperteile", domains: ["body"] }),
  noun({ lemma: "mundwinkel", gender: GENDER.M, plural: "mundwinkel", domains: ["body"] }),
  noun({ lemma: "mimik", gender: GENDER.F, plural: null, domains: ["body", "abstract"], notes: ["no plural usual"] }),
  noun({ lemma: "gesichtsausdruck", gender: GENDER.M, plural: "gesichtsausdrücke", domains: ["body", "perception"], aliases: ["gesichtsausdrücke"] }),
  noun({ lemma: "lippe", gender: GENDER.F, plural: "lippen", domains: ["body"] }),
  noun({ lemma: "lächeln", gender: GENDER.N, plural: "lächeln", domains: ["body", "abstract"] }),
  noun({ lemma: "selbstvertrauen", gender: GENDER.N, plural: null, domains: ["abstract"], notes: ["no plural"] }),
  noun({ lemma: "stirn", gender: GENDER.F, plural: "stirnen", domains: ["body"] }),
  noun({ lemma: "oberkörper", gender: GENDER.M, plural: "oberkörper", domains: ["body"] }),

  // --- Casa / Lugares / Objetos ---
  noun({ lemma: "haus", gender: GENDER.N, plural: "häuser", domains: ["home", "place"] }),
  noun({ lemma: "wohnung", gender: GENDER.F, plural: "wohnungen", domains: ["home", "place"] }),
  noun({ lemma: "zimmer", gender: GENDER.N, plural: "zimmer", domains: ["home", "place"] }),
  noun({ lemma: "küche", gender: GENDER.F, plural: "küchen", domains: ["home"] }),
  noun({ lemma: "bad", gender: GENDER.N, plural: "bäder", domains: ["home"] }),
  noun({ lemma: "garten", gender: GENDER.M, plural: "gärten", domains: ["place"] }),
  noun({ lemma: "straße", gender: GENDER.F, plural: "straßen", domains: ["place"] }),
  noun({ lemma: "stadt", gender: GENDER.F, plural: "städte", domains: ["place"] }),
  noun({ lemma: "land", gender: GENDER.N, plural: "länder", domains: ["place", "geo"] }),
  noun({ lemma: "welt", gender: GENDER.F, plural: "welten", domains: ["place", "abstract"] }),

  noun({ lemma: "tisch", gender: GENDER.M, plural: "tische", domains: ["object"] }),
  noun({ lemma: "stuhl", gender: GENDER.M, plural: "stühle", domains: ["object"] }),
  noun({ lemma: "bett", gender: GENDER.N, plural: "betten", domains: ["object"] }),
  noun({ lemma: "schrank", gender: GENDER.M, plural: "schränke", domains: ["object"] }),
  noun({ lemma: "fenster", gender: GENDER.N, plural: "fenster", domains: ["object"] }),
  noun({ lemma: "tür", gender: GENDER.F, plural: "türen", domains: ["object"] }),
  noun({ lemma: "wand", gender: GENDER.F, plural: "wände", domains: ["object"] }),
  noun({ lemma: "decke", gender: GENDER.F, plural: "decken", domains: ["object"] }),
  noun({ lemma: "boden", gender: GENDER.M, plural: "böden", domains: ["object"] }),
  noun({ lemma: "sofa", gender: GENDER.N, plural: "sofas", domains: ["object"] }),
  noun({ lemma: "sessel", gender: GENDER.M, plural: "sessel", domains: ["object"] }),
  noun({ lemma: "wohnzimmer", gender: GENDER.N, plural: "wohnzimmer", domains: ["home"] }),
  noun({ lemma: "leseecke", gender: GENDER.F, plural: "leseecken", domains: ["home"] }),
  noun({ lemma: "esszimmer", gender: GENDER.N, plural: "esszimmer", domains: ["home"] }),

  // --- Tiempo ---
  noun({ lemma: "zeit", gender: GENDER.F, plural: "zeiten", domains: ["time"] }),
  noun({ lemma: "jahr", gender: GENDER.N, plural: "jahre", domains: ["time"] }),
  noun({ lemma: "monat", gender: GENDER.M, plural: "monate", domains: ["time"] }),
  noun({ lemma: "woche", gender: GENDER.F, plural: "wochen", domains: ["time"] }),
  noun({ lemma: "tag", gender: GENDER.M, plural: "tage", domains: ["time"] }),
  noun({ lemma: "stunde", gender: GENDER.F, plural: "stunden", domains: ["time"] }),
  noun({ lemma: "minute", gender: GENDER.F, plural: "minuten", domains: ["time"] }),
  noun({ lemma: "sekunde", gender: GENDER.F, plural: "sekunden", domains: ["time"] }),

  // --- Abstractos ---
  noun({ lemma: "leben", gender: GENDER.N, plural: "leben", domains: ["abstract"] }),
  noun({ lemma: "möglichkeit", gender: GENDER.F, plural: "möglichkeiten", domains: ["abstract"] }),
  noun({ lemma: "freundschaft", gender: GENDER.F, plural: "freundschaften", domains: ["abstract"] }),
  noun({ lemma: "bildung", gender: GENDER.F, plural: "bildungen", domains: ["abstract"] }),
  noun({ lemma: "entwicklung", gender: GENDER.F, plural: "entwicklungen", domains: ["abstract"] }),
  noun({ lemma: "veränderung", gender: GENDER.F, plural: "veränderungen", domains: ["abstract"] }),

  // --- Tecnología / Informática ---
  noun({ lemma: "datei", gender: GENDER.F, plural: "dateien", domains: ["technology"] }),
  noun({ lemma: "mb", gender: GENDER.N, plural: "mb", domains: ["technology"], notes: ["megabyte - unidad"] }),
  noun({ lemma: "kb", gender: GENDER.N, plural: "kb", domains: ["technology"], notes: ["kilobyte - unidad"] }),
  noun({ lemma: "gb", gender: GENDER.N, plural: "gb", domains: ["technology"], notes: ["gigabyte - unidad"] }),
  noun({ lemma: "computer", gender: GENDER.M, plural: "computer", domains: ["technology"] }),
  noun({ lemma: "rechner", gender: GENDER.M, plural: "rechner", domains: ["technology"] }),
  noun({ lemma: "drucker", gender: GENDER.M, plural: "drucker", domains: ["technology"] }),
  noun({ lemma: "kamera", gender: GENDER.F, plural: "kameras", domains: ["technology"] }),
  noun({ lemma: "foto", gender: GENDER.N, plural: "fotos", domains: ["technology", "object"] }),
  noun({ lemma: "bild", gender: GENDER.N, plural: "bilder", domains: ["object", "abstract"] }),
  noun({ lemma: "aufnahme", gender: GENDER.F, plural: "aufnahmen", domains: ["technology", "abstract"] }),
  noun({ lemma: "serie", gender: GENDER.F, plural: "serien", domains: ["abstract"] }),
  noun({ lemma: "mailbox", gender: GENDER.F, plural: "mailboxes", domains: ["technology"] }),
  noun({ lemma: "email", gender: GENDER.F, plural: "emails", domains: ["technology"], aliases: ["e-mail", "mail"] }),
  noun({ lemma: "betreff", gender: GENDER.M, plural: "betreffs", domains: ["technology"] }),
  noun({ lemma: "album", gender: GENDER.N, plural: "alben", domains: ["object"] }),

  // --- Lugares específicos ---
  noun({ lemma: "arbeitszimmer", gender: GENDER.N, plural: "arbeitszimmer", domains: ["home", "place"] }),
  noun({ lemma: "keller", gender: GENDER.M, plural: "keller", domains: ["home", "place"] }),
  noun({ lemma: "schuppen", gender: GENDER.M, plural: "schuppen", domains: ["place", "object"] }),
  noun({ lemma: "ordner", gender: GENDER.M, plural: "ordner", domains: ["object"] }),
  noun({ lemma: "mappe", gender: GENDER.F, plural: "mappen", domains: ["object"] }),

  // --- Objetos del hogar ---
  noun({ lemma: "kleidungsstück", gender: GENDER.N, plural: "kleidungsstücke", domains: ["object"] }),
  noun({ lemma: "umhängetasche", gender: GENDER.F, plural: "umhängetaschen", domains: ["object"] }),
  noun({ lemma: "plakat", gender: GENDER.N, plural: "plakate", domains: ["object"] }),
  noun({ lemma: "herzsymbol", gender: GENDER.N, plural: "herzsymbole", domains: ["object"] }),
  noun({ lemma: "grünfläche", gender: GENDER.F, plural: "grünflächen", domains: ["place"] }),
  noun({ lemma: "vegetation", gender: GENDER.F, plural: null, domains: ["nature"], notes: ["no plural usual"] }),
  noun({ lemma: "gartentor", gender: GENDER.N, plural: "gartentore", domains: ["object", "place"] }),

  // --- Tiempo específico ---
  noun({ lemma: "nachmittag", gender: GENDER.M, plural: "nachmittage", domains: ["time"] }),
  noun({ lemma: "morgen", gender: GENDER.M, plural: "morgen", domains: ["time"], aliases: ["vormittag"] }),
  noun({ lemma: "vortag", gender: GENDER.M, plural: "vortage", domains: ["time"] }),

  // --- Abstractos ---
  noun({ lemma: "übersicht", gender: GENDER.F, plural: "übersichten", domains: ["abstract"] }),
  noun({ lemma: "ordnung", gender: GENDER.F, plural: "ordnungen", domains: ["abstract"] }),
  noun({ lemma: "aufgabe", gender: GENDER.F, plural: "aufgaben", domains: ["abstract"] }),
  noun({ lemma: "schritt", gender: GENDER.M, plural: "schritte", domains: ["abstract"] }),
  noun({ lemma: "problem", gender: GENDER.N, plural: "probleme", domains: ["abstract"] }),
  noun({ lemma: "plan", gender: GENDER.M, plural: "pläne", domains: ["abstract"] }),
  noun({ lemma: "ergebnis", gender: GENDER.N, plural: "ergebnisse", domains: ["abstract"] }),
  noun({ lemma: "änderung", gender: GENDER.F, plural: "änderungen", domains: ["abstract"] }),
  noun({ lemma: "einstellung", gender: GENDER.F, plural: "einstellungen", domains: ["abstract"] }),
  noun({ lemma: "lizenz", gender: GENDER.F, plural: "lizenzen", domains: ["abstract"] }),
  noun({ lemma: "hilfe", gender: GENDER.F, plural: "hilfen", domains: ["abstract"] }),
  noun({ lemma: "entscheidung", gender: GENDER.F, plural: "entscheidungen", domains: ["abstract"] }),
  noun({ lemma: "beschreibung", gender: GENDER.F, plural: "beschreibungen", domains: ["abstract"] }),
  noun({ lemma: "freundlichkeit", gender: GENDER.F, plural: null, domains: ["abstract"], notes: ["no plural usual"] }),
  noun({ lemma: "notiz", gender: GENDER.F, plural: "notizen", domains: ["object", "abstract"] }),
  noun({ lemma: "randbemerkung", gender: GENDER.F, plural: "randbemerkungen", domains: ["abstract"] }),
  noun({ lemma: "liste", gender: GENDER.F, plural: "listen", domains: ["abstract", "object"] }),
  noun({ lemma: "paket", gender: GENDER.N, plural: "pakete", domains: ["object"] }),

  // --- Colores y características ---
  noun({ lemma: "farbton", gender: GENDER.M, plural: "farbtöne", domains: ["abstract"] }),
  noun({ lemma: "farbe", gender: GENDER.F, plural: "farben", domains: ["abstract"] }),
  noun({ lemma: "form", gender: GENDER.F, plural: "formen", domains: ["abstract"] }),
  noun({ lemma: "gesicht", gender: GENDER.N, plural: "gesichter", domains: ["body"] }),
  noun({ lemma: "wangenknochen", gender: GENDER.M, plural: "wangenknochen", domains: ["body"] }),

  // --- Otros ---
  noun({ lemma: "wetter", gender: GENDER.N, plural: null, domains: ["nature"], notes: ["no plural usual"] }),
  noun({ lemma: "luft", gender: GENDER.F, plural: null, domains: ["nature"], notes: ["no plural usual"] }),
  noun({ lemma: "licht", gender: GENDER.N, plural: "lichter", domains: ["abstract", "nature"] }),
  noun({ lemma: "störung", gender: GENDER.F, plural: "störungen", domains: ["abstract"] }),
  noun({ lemma: "besucher", gender: GENDER.M, plural: "besucher", domains: ["people"] }),
  noun({ lemma: "gerät", gender: GENDER.N, plural: "geräte", domains: ["object"] }),
  noun({ lemma: "dokument", gender: GENDER.N, plural: "dokumente", domains: ["object"] }),
  noun({ lemma: "testseite", gender: GENDER.F, plural: "testseiten", domains: ["object"] }),

  // --- Familia ---
  noun({ lemma: "bruder", gender: GENDER.M, plural: "brüder", domains: ["people", "family"] }),
  noun({ lemma: "schwester", gender: GENDER.F, plural: "schwestern", domains: ["people", "family"] }),

  // --- Marcas/productos específicos ---
  noun({ lemma: "hubsan", gender: GENDER.F, plural: "hubsans", domains: ["technology"], notes: ["marca de drones"] }),
  noun({ lemma: "drohne", gender: GENDER.F, plural: "drohnen", domains: ["technology"] }),

  // --- Cuantificadores / Medidas léxicas ---
  noun({ lemma: "paar", gender: GENDER.N, plural: "paare", domains: ["quantity"], notes: ["como cuantificador: ein paar = unos pocos"] }),

  noun({ lemma: "bescheid", gender: GENDER.M, plural: "bescheide", domains: ["abstract", "time"], notes: ["como cuantificador: ein paar = unos pocos"] }),
];

const byDomain = (domain) => NOUNS.filter((n) => n.domains.includes(domain)).map((n) => n.lemma);

export const BLOCKS_NOUNS = {
  PEOPLE: byDomain("people"),
  FAMILY: byDomain("family"),
  ANIMALS: byDomain("animals"),
  BODY: byDomain("body"),
  HOME: byDomain("home"),
  PLACE: byDomain("place"),
  OBJECT: byDomain("object"),
  ABSTRACT: byDomain("abstract"),
  TIME: byDomain("time"),
  QUANTITY: byDomain("quantity"),
};

export const NOUN_ALIAS_INDEX = Object.fromEntries(NOUNS.flatMap((n) => (n.aliases || []).map((a) => [a.toLowerCase(), n.lemma])));
export const NOUN_INDEX = Object.fromEntries(NOUNS.map((n) => [n.lemma, n]));
export const NOUN_LEMMAS = Array.from(new Set(NOUNS.map((n) => n.lemma)));

export const PRONOUNS = {
  deren: {
    pos: "pronoun",
    features: { case: "gen", number: "pl|sg-fem", source: "die(pl)/sie(fem)" },
    notes: ["genitivo relativo/posesivo de 'die' (plural) o 'sie' (femenino)"],
  },
};
