// ===== utils/validation.js =====
/**
 * Utilidades de validación y normalización unificadas
 */

/**
 * Opciones de validación
 * @typedef {Object} ValidationOptions
 * @property {boolean} [allowEmpty=false] - Permitir cadenas vacías
 * @property {boolean} [toLowerCase=false] - Convertir a minúsculas
 * @property {boolean} [trim=true] - Eliminar espacios al inicio/final
 * @property {string} [emptyMessage="Entrada vacía"] - Mensaje para entradas vacías
 */

/**
 * Resultado de validación
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Si la entrada es válida
 * @property {string|null} value - Valor procesado (null si inválido)
 * @property {string|null} error - Mensaje de error (null si válido)
 */

/**
 * Valida y procesa entrada de texto
 * @param {any} input - Entrada a validar
 * @param {ValidationOptions} [options={}] - Opciones de validación
 * @returns {ValidationResult}
 */
export const validateInput = (input, options = {}) => {
  const { allowEmpty = false, toLowerCase = false, trim = true, emptyMessage = "Entrada vacía" } = options;

  let processed = String(input ?? "");
  if (trim) processed = processed.trim();
  if (toLowerCase) processed = processed.toLowerCase();

  if (!allowEmpty && !processed) {
    return { valid: false, value: null, error: emptyMessage };
  }

  return { valid: true, value: processed, error: null };
};

/**
 * Valida entrada específicamente para palabras alemanas
 * @param {any} input - Entrada a validar
 * @returns {ValidationResult}
 */
export const validateGermanWord = (input) => {
  const result = validateInput(input, {
    allowEmpty: false,
    toLowerCase: true,
    trim: true,
    emptyMessage: "Palabra alemana requerida",
  });

  if (!result.valid) return result;

  // Validaciones adicionales para alemán si son necesarias
  // Por ejemplo, caracteres válidos, longitud mínima, etc.

  return result;
};

/**
 * Wrapper simple para casos donde solo necesitas el valor o null
 * @param {any} input - Entrada a validar
 * @param {ValidationOptions} [options] - Opciones de validación
 * @returns {string|null} - Valor procesado o null si inválido
 */
export const normalizeInput = (input, options) => {
  const result = validateInput(input, options);
  return result.valid ? result.value : null;
};
