// quick_test_orange.js
import { analyzeAdjective } from "./detection.js";
import { translateAdjective, tr } from "./lookup.js";

console.log("=== TEST RÁPIDO PARA ORANGEFARBENEN ===\n");

const word = "orangefarbenen";

// 1. Análisis
const analysis = analyzeAdjective(word);
console.log("1. Análisis:");
console.log(`   Input: ${word}`);
console.log(`   Degree: ${analysis.degree}`);
console.log(`   Base: ${analysis.base}`);
console.log(`   Confidence: ${analysis.confidence}`);

// 2. Traducción
const translation = translateAdjective(word);
console.log("\n2. Traducción completa:");
console.log(translation);

// 3. Traducción simple
const simpleTranslation = tr(word);
console.log("\n3. Traducción simple:");
console.log(`tr("${word}") = "${simpleTranslation}"`);

// 4. Verificación manual de la base
const baseTranslation = tr("orangefarben");
console.log("\n4. Traducción de la base:");
console.log(`tr("orangefarben") = "${baseTranslation}"`);

// 5. Estado esperado
const expected = analysis.degree === null && analysis.base === "orangefarben" && simpleTranslation === "color naranja";
console.log("\n5. ¿Funciona correctamente?");
console.log(expected ? "✅ SÍ" : "❌ NO");

if (!expected) {
  console.log("\nDetalles del problema:");
  console.log(`   Expected degree: null, got: ${analysis.degree}`);
  console.log(`   Expected base: orangefarben, got: ${analysis.base}`);
  console.log(`   Expected translation: color naranja, got: ${simpleTranslation}`);
}
