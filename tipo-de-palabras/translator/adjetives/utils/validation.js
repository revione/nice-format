/**
 * utils/validation.js - VALIDACIÓN UNIFICADA
 * Elimina todas las duplicaciones de core/validation.js y utils/validation.js
 */

/**
 * Validador base configurable
 */
export class Validator {
  constructor(options = {}) {
    this.options = {
      allowEmpty: false,
      toLowerCase: false,
      trim: true,
      emptyMessage: "Entrada vacía",
      ...options,
    };
  }

  validate(input) {
    const { allowEmpty, toLowerCase, trim, emptyMessage, pattern, patternMessage } = this.options;

    const original = input;
    let processed = String(input ?? "");

    if (trim) processed = processed.trim();
    if (toLowerCase) processed = processed.toLowerCase();

    if (!allowEmpty && !processed) {
      return { valid: false, value: null, error: emptyMessage, original };
    }

    if (pattern && processed && !pattern.test(processed)) {
      return { valid: false, value: null, error: patternMessage || "Formato inválido", original };
    }

    return { valid: true, value: processed, error: null, original };
  }

  normalize(input) {
    const result = this.validate(input);
    return result.valid ? result.value : null;
  }
}

// --- INSTANCIAS PRE-CONFIGURADAS (solo las que se usan) ---

/**
 * Para palabras alemanas en análisis morfológico
 */
export const germanWordValidator = new Validator({
  allowEmpty: false,
  toLowerCase: true,
  trim: true,
  emptyMessage: "Palabra alemana requerida",
  pattern: /^[a-zA-ZäöüÄÖÜß\s-]+$/,
  patternMessage: "Caracteres no válidos en entrada alemana",
});
