import { DECLENSIONS } from "./declensions.js";
import { ADJECTIVES } from "./lemmas/index.js";

/** Arreglos de tema tras quitar -er/-st cuando hasLemma no conoce el tema raro. */
const REVERSE_STEM_FIXES = [
  // [regex del pseudo-tema, función(base) -> candidato]
  [/^höh$/i, () => "hoch"], // höher → (quitando -er) höh → hoch
  [/^fitt$/i, () => "fit"], // fitter → fitt → fit (duplicación de consonante)
];

/** Expone la heurística para que el detector (adj_guess) la use. */
export const applyReverseStemHeuristics = (stem) => {
  for (const [rx, toBase] of REVERSE_STEM_FIXES) {
    if (rx.test(stem)) return toBase(stem);
  }
  return null;
};

// logica esta en ADJETIVES
// la palabra termina en DECLENSIONS?
//
// ... logica de deteccion de adj
// ... logica de deteccion de caso de la inclinacion del adj

// ejemplos
