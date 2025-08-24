import { LANGUAGE_PATTERNS, makeGermanStem, needsEst, getIrregularForms } from "./shared.js";

/**
 * Builder principal para adjetivos (SIMPLIFICADO)
 */
export class AdjectiveBuilder {
  constructor(languagePatterns = LANGUAGE_PATTERNS) {
    this.patterns = languagePatterns;
  }

  /**
   * Construye formas para un idioma específico
   */
  buildForLanguage(baseText, lang) {
    const pattern = this.patterns[lang];
    if (!pattern) return { comp: null, sup: null };

    return {
      comp: `${pattern.comp.prefix}${baseText}${pattern.comp.suffix}`,
      sup: `${pattern.sup.prefix}${baseText}${pattern.sup.suffix}`,
    };
  }

  /**
   * Construye formas alemanas (comp/sup)
   */
  buildGermanForms(baseDe, irregularities) {
    if (!baseDe) return { comp: null, sup: null };

    // 1. Intentar formas irregulares/supletivas
    const irregular = getIrregularForms(baseDe);
    if (irregular) {
      return {
        comp: irregular.comp || null,
        sup: irregular.sup || null,
      };
    }

    // 2. Formas regulares
    const stem = makeGermanStem(baseDe, irregularities);
    return {
      comp: `${stem}er`,
      sup: `${stem}${needsEst(baseDe) ? "est" : "st"}`,
    };
  }

  /**
   * Procesa una entrada completa
   */
  buildEntry(entry) {
    if (!entry?.base?.de) {
      throw new Error("Cada entrada necesita base.de");
    }

    const { irregularities, gradable } = entry;
    const base = { ...entry.base };
    const comp = { ...(entry.comp || {}) };
    const sup = { ...(entry.sup || {}) };

    if (gradable !== false) {
      // Construir formas alemanas
      if (!comp.de || !sup.de) {
        const germanForms = this.buildGermanForms(base.de, irregularities);
        comp.de = comp.de || germanForms.comp;
        sup.de = sup.de || germanForms.sup;
      }

      // Construir otros idiomas
      const targetLangs = Object.keys(base).filter((k) => k !== "de");
      for (const lang of targetLangs) {
        const baseText = base[lang];
        if (baseText) {
          const forms = this.buildForLanguage(baseText, lang);
          comp[lang] = comp[lang] || forms.comp;
          sup[lang] = sup[lang] || forms.sup;
        }
      }
    }

    return { ...entry, base, comp, sup };
  }

  /**
   * Procesa lista de entradas
   */
  buildForms(list) {
    if (!Array.isArray(list)) {
      throw new TypeError("buildForms: se esperaba un array");
    }
    return list.map((entry) => this.buildEntry(entry));
  }

  /**
   * Aplana bloques a formas individuales
   */
  flattenToForms(blocks) {
    if (!Array.isArray(blocks)) {
      throw new TypeError("flattenToForms: se esperaba un array");
    }

    const out = [];
    for (const { base, comp, sup, gradable } of blocks) {
      if (base?.de) {
        out.push({ ...base, form: "base", gradable });
      }

      if (gradable !== false) {
        if (comp?.de) {
          out.push({ ...comp, form: "comp", gradable });
        }
        if (sup?.de) {
          out.push({ ...sup, form: "sup", gradable });
        }
      }
    }
    return out;
  }

  /**
   * Pipeline completo: construir + aplanar
   */
  processAdjectives(list) {
    const completed = this.buildForms(list);
    return this.flattenToForms(completed);
  }
}

// === API PÚBLICA (TODO SYNC) ===

// Instancia singleton
const builder = new AdjectiveBuilder();

export const flatteAdj = (list) => {
  return builder.processAdjectives(list);
};

export const makeAdjectivesFromList = (list) => {
  return builder.buildForms(list);
};
