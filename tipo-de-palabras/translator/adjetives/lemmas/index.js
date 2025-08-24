// lemmas/index.js
import { ADJECTIVES_STATES } from "./emotions.js";
import { ADJECTIVES_LANGUAGE } from "./language.js";
import { ADJECTIVES_PARTICIPLES } from "./participles.js";
import { ADJECTIVES_POSITION } from "./position.js";
import { ADJECTIVES_SENSES } from "./senses.js";
import { ADJECTIVES_SIZE } from "./size.js";
import { ADJECTIVES_SOCIAL } from "./social.js";
import { ADJECTIVES_SPACE } from "./space.js";
import { ADJECTIVES_TIME } from "./time.js";
import { ADJECTIVES_APPEARANCE } from "./appearance.js";
import { COLORS } from "./colors.js";
import { ADJECTIVES_QUALITY } from "./quality.js";
import { ADJECTIVES_PREFERENCES } from "./preferences.js";

export const ADJECTIVES_IMPORTED = [
  ...ADJECTIVES_STATES,
  ...ADJECTIVES_LANGUAGE,
  ...ADJECTIVES_PARTICIPLES,
  ...ADJECTIVES_POSITION,
  ...ADJECTIVES_SENSES,
  ...ADJECTIVES_SIZE,
  ...ADJECTIVES_SOCIAL,
  ...ADJECTIVES_SPACE,
  ...ADJECTIVES_TIME,
  ...ADJECTIVES_APPEARANCE,
  ...COLORS,
  ...ADJECTIVES_QUALITY,
  ...ADJECTIVES_PREFERENCES,
].sort((a, b) => (a.de < b.de ? -1 : 1));

const byDe = new Map();
for (const a of ADJECTIVES_IMPORTED) if (!byDe.has(a.de)) byDe.set(a.de, a);
export const ADJECTIVES = [...byDe.values()].sort((a, b) => (a.de < b.de ? -1 : 1));

// Si una entrada no trae `gradable`, asumimos que SÍ es gradable (comportamiento previo)
export const ADJ_GRADABLE = new Map([...byDe.values()].map((a) => [a.de, a.gradable !== false]));
