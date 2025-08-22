import { ADJECTIVES_APPEARANCE } from "./appearance.js";
import { DECLINABLE_COLORS, INDECLINABLE_COLORS } from "./colors.js";
import { ADJECTIVES_STATES } from "./emotions.js";
import { ADJECTIVES_LANGUAGE } from "./language.js";
import { ADJECTIVES_PARTICIPLES } from "./participles.js";
import { ADJECTIVES_POSITION } from "./position.js";
import { ADJECTIVES_QUALITY } from "./quality.js";
import { ADJECTIVES_SENSES } from "./senses.js";
import { ADJECTIVES_SIZE } from "./size.js";
import { ADJECTIVES_SOCIAL } from "./social.js";
import { ADJECTIVES_SPACE } from "./space.js";
import { ADJECTIVES_TIME } from "./time.js";

const extractLemmas = (metaObject) => Object.keys(metaObject);

export const BLOCKS = {
  color: [...DECLINABLE_COLORS, ...INDECLINABLE_COLORS],

  appearance: extractLemmas(ADJECTIVES_APPEARANCE),
  states: extractLemmas(ADJECTIVES_STATES),
  language: extractLemmas(ADJECTIVES_LANGUAGE),
  participles: extractLemmas(ADJECTIVES_PARTICIPLES),
  position: extractLemmas(ADJECTIVES_POSITION),
  quality: extractLemmas(ADJECTIVES_QUALITY),
  senses: extractLemmas(ADJECTIVES_SENSES),
  size: extractLemmas(ADJECTIVES_SIZE),
  social: extractLemmas(ADJECTIVES_SOCIAL),
  space: extractLemmas(ADJECTIVES_SPACE),
  time: extractLemmas(ADJECTIVES_TIME),
};

export const ADJ_META = {
  ...Object.fromEntries(INDECLINABLE_COLORS.map((color) => [color, { indeclinable: true }])),

  ...ADJECTIVES_APPEARANCE,
  ...ADJECTIVES_STATES,
  ...ADJECTIVES_LANGUAGE,
  ...ADJECTIVES_PARTICIPLES,
  ...ADJECTIVES_POSITION,
  ...ADJECTIVES_QUALITY,
  ...ADJECTIVES_SENSES,
  ...ADJECTIVES_SIZE,
  ...ADJECTIVES_SOCIAL,
  ...ADJECTIVES_SPACE,
  ...ADJECTIVES_TIME,
};

export const PATTERNS = {
  productive: {
    // Sufijos altamente productivos
    lich: { confidence: 0.95, type: "adverbial", examples: ["freundlich", "natürlich"] },
    ig: { confidence: 0.9, type: "qualitative", examples: ["wichtig", "ruhig"] },
    isch: { confidence: 0.85, type: "origin", examples: ["technisch", "englisch"] },
    bar: { confidence: 0.9, type: "ability", examples: ["sichtbar", "machbar"] },
    sam: { confidence: 0.85, type: "manner", examples: ["sparsam", "langsam"] },
    los: { confidence: 0.9, type: "absence", examples: ["arbeitslos", "hilflos"] },
    voll: { confidence: 0.85, type: "abundance", examples: ["wertvoll", "sinnvoll"] },
    reich: { confidence: 0.8, type: "abundance", examples: ["erfolgreich"] },
    arm: { confidence: 0.75, type: "deficiency", examples: ["fantasiearm"] },
    frei: { confidence: 0.85, type: "freedom", examples: ["steuerfrei"] },
    haft: { confidence: 0.8, type: "characteristic", examples: ["fehlerhaft"] },
    weise: { confidence: 0.4, type: "adverbial", examples: ["teilweise"], note: "Usually adverbial, not adjectival" },

    // Sufijos adicionales
    mäßig: { confidence: 0.8, type: "measure", examples: ["regelmäßig"] },
    würdig: { confidence: 0.8, type: "worth", examples: ["vertrauenswürdig"] },
    fähig: { confidence: 0.85, type: "capability", examples: ["lernfähig"] },
    artig: { confidence: 0.7, type: "similar", examples: ["glasartig"] },
    förmig: { confidence: 0.75, type: "shape", examples: ["kugelförmig"] },
  },

  declension: ["e", "en", "em", "er", "es"],
  prefixes: ["un", "ur", "über", "unter", "aus", "an", "auf", "ab", "miss", "halb"],
};

// ==============================
// VALIDACIÓN Y ESTADÍSTICAS
// ==============================

export function validateData() {
  const issues = [];
  const allLemmas = new Set();
  const duplicates = [];
  const domainMap = new Map();

  for (const [domain, lemmas] of Object.entries(BLOCKS)) {
    for (const lemma of lemmas) {
      if (!domainMap.has(lemma)) {
        domainMap.set(lemma, []);
      }
      domainMap.get(lemma).push(domain);

      if (allLemmas.has(lemma)) {
        const existingDupe = duplicates.find((d) => d.lemma === lemma);
        if (existingDupe) {
          existingDupe.domains.push(domain);
        } else {
          duplicates.push({
            lemma,
            domains: domainMap.get(lemma),
          });
        }
      }
      allLemmas.add(lemma);
    }
  }

  const lemmasInBlocks = new Set(Object.values(BLOCKS).flat());
  const lemmasInMeta = new Set(Object.keys(ADJ_META));

  const missingMeta = [...lemmasInBlocks].filter((lemma) => !lemmasInMeta.has(lemma));
  const orphanMeta = [...lemmasInMeta].filter((lemma) => !lemmasInBlocks.has(lemma));

  return {
    duplicates,
    missingMeta,
    orphanMeta,
    totalLemmas: allLemmas.size,
    totalDomains: Object.keys(BLOCKS).length,
    isConsistent: missingMeta.length === 0 && orphanMeta.length === 0,
    hasDuplicates: duplicates.length > 0,
  };
}

function findDomainsForLemma(lemma) {
  return Object.entries(BLOCKS)
    .filter(([domain, lemmas]) => lemmas.includes(lemma))
    .map(([domain]) => domain);
}
