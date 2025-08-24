// test.js actualizado
import { analyzeAdjective } from "./detection.js";
import { tr, translateAdjective } from "./lookup.js";
import { ADJECTIVES_IMPORTED, ADJ_GRADABLE } from "./lemmas/index.js";

// const EXPECTS_00 = [
//   // sustantives pero no vamos a considerarlos
//   ["Deutsch", null, "Deutsch"],
//   ["Neue", null, "neu"],
//   ["Alten", null, "alt"],
// ];

const EXPECTS_1 = [
  ["schöne", "base", "schön"],
  ["freundlichen", "base", "freundlich"],
  ["stärkeren", "comp", "stark"],
  ["größere", "comp", "groß"],
  ["weißer", "comp", "weiß"],
  ["jüngere", "comp", "jung"],
  ["höchstem", "sup", "hoch"],
  ["nächstes", "sup", "nah"],
  ["schönste", "sup", "schön"],
  ["freundlichsten", "sup", "freundlich"],
  ["besten", "sup", "gut"],
  ["meisten", "sup", "viel"],
  ["fitter", "comp", "fit"],
  ["älteren", "comp", "alt"],
  ["kürzesten", "sup", "kurz"],
  ["besseren", "comp", "gut"],
  ["kleineren", "comp", "klein"],
  ["längstes", "sup", "lang"],
  ["Schöne", "base", "schön"],
  ["WEIßER", "comp", "weiß"],
];

const EXPECTS_2 = [
  ["dümmer", "comp", "dumm"],
  ["dümmsten", "sup", "dumm"],
  ["klüger", "comp", "klug"],
  ["klügsten", "sup", "klug"],
  ["ärmer", "comp", "arm"],
  ["ärmsten", "sup", "arm"],
  ["kälter", "comp", "kalt"],
  ["kältesten", "sup", "kalt"],
  ["heißester", "sup", "heiß"],
  ["spitzesten", "sup", "spitz"],
  ["fleißigsten", "sup", "fleißig"],
  ["nettester", "sup", "nett"],
  ["sattesten", "sup", "satt"],
  ["dicksten", "sup", "dick"],
  ["lieber", "comp", "gern"],
  ["liebsten", "sup", "gern"],
  ["blauer", "comp", "blau"],
  ["blaueste", "sup", "blau"],
  ["rosa", null, "rosa"],
  ["lila", null, "lila"],
  ["orangefarbenen", null, "orangefarben"],
  ["Große", "base", "groß"],
  ["Beste", "sup", "gut"],
  ["gelungen", null, "gelungen"],
  ["verheiratet", null, "verheiratet"],
];

const EXPECTS_3 = [
  ["gesünder", "comp", "gesund"],
  ["gesündesten", "sup", "gesund"],
  ["jüngst", "sup", "jung"],
  ["bekannt", null, "bekannt"],
  ["interessiert", null, "interessiert"],
  ["beige", null, "beige"],
  ["khakifarben", null, "khakifarben"],
  ["weniger", "comp", "wenig"],
  ["wenigsten", "sup", "wenig"],
  ["mehr", "comp", "viel"],
  ["meist", "sup", "viel"],
  ["heller", "comp", "hell"],
  ["hellsten", "sup", "hell"],
  ["hochmodern", null, "hochmodern"],
  ["Schön", "base", "schön"],
];

const EXPECTS_4 = [["leiser", "comp", "leise"]];

const EXPECTS_6 = [
  // ["gerade", "base", "gerade"],
  // ["egal", "base", "egal"],
  // ["komplett", "base", "komplett"],
  // ["ausgeschieden", "base", "ausgeschieden"],
  // ["fix", "base", "fix"],
  // ["gelbwürdig", "base", "gelbwürdig"],
  // ["nice", "base", "nice"],
  // ["ungefähr", "base", "ungefähr"],

  // ["abgeräumt", "base", "abgeräumt"],
  // ["verschätzt", "base", "verschätzt"],
  // ["überflutet", "base", "überflutet"],
  // ["geklappt", "base", "geklappt"],
  // ["non-stop", "base", "non-stop"],

  ["aufgemacht", "base", "aufgemacht"],
  ["gelandet", "base", "gelandet"],
  ["bedeutend", "base", "bedeutend"],
  ["stimmig", "base", "stimmig"],
];

const ALL_EXPECTS = [...EXPECTS_1, ...EXPECTS_2, ...EXPECTS_3, ...EXPECTS_4];

const runImprovedTest = () => {
  console.log("=== TESTING IMPROVED TRANSLATION ===\n");

  let analysisOK = 0;
  let translationOK = 0;
  let totalTests = 0;

  for (const [word, expectedDegree, expectedBase] of EXPECTS_6) {
    totalTests++;

    // Test analysis
    const analysis = analyzeAdjective(word);
    const analysisCorrect = analysis.degree === expectedDegree && analysis.base === expectedBase;

    // Test translation
    const translation = tr(word);
    const fullTranslation = translateAdjective(word);

    if (analysisCorrect) analysisOK++;
    if (translation) translationOK++;

    // Status indicators
    const analysisStatus = analysisCorrect ? "✅" : "❌";
    const translationStatus = translation ? "✅" : "❌";

    console.log(`${analysisStatus}${translationStatus} ${word.padEnd(15)} → ${analysis.degree || "null"} ${analysis.base || "null"}`);
    console.log(analysis);

    if (translation) {
      console.log(`     Translation: ${translation}`);
    } else {
      console.log(`     Translation: null`);
    }

    if (fullTranslation && !analysisCorrect) {
      console.log(`     Expected: ${expectedDegree} ${expectedBase}`);
    }

    // Debug específico para orangefarbenen
    if (word === "orangefarbenen" && !translation) {
      console.log("     🔍 DEBUG orangefarbenen:");
      console.log(`        Analysis confidence: ${analysis.confidence}`);
      console.log(`        Full analysis:`, analysis);
      console.log(`        Full translation result:`, fullTranslation);

      // Buscar en ADJECTIVES_IMPORTED
      const orangeEntries = ADJECTIVES_IMPORTED.filter((adj) => adj.de.toLowerCase().includes("orange"));
      console.log(`        Orange entries in data:`, orangeEntries);

      // Verificar gradabilidad
      console.log(`        Is gradable:`, ADJ_GRADABLE.get("orangefarben"));
    }

    console.log("");
  }

  console.log("=== SUMMARY ===");
  console.log(`Analysis success: ${analysisOK}/${totalTests} (${Math.round((100 * analysisOK) / totalTests)}%)`);
  console.log(`Translation success: ${translationOK}/${totalTests} (${Math.round((100 * translationOK) / totalTests)}%)`);

  if (analysisOK === totalTests && translationOK === totalTests) {
    console.log("\n🎉 All tests passed!");
  } else {
    console.log(`\n⚠️  ${totalTests - analysisOK} analysis failures, ${totalTests - translationOK} translation failures`);
  }
};

// Test some specific problematic cases
const testSpecificCases = () => {
  console.log("\n=== TESTING SPECIFIC CASES ===\n");

  const specificCases = [
    "besseren", // irregular comparative
    "besten", // irregular superlative
    "größere", // regular comparative with umlaut
    "höchstem", // irregular superlative
    "mehr", // suppletive comparative
    "schönste", // regular superlative
    "orangefarbenen", // the failing case
  ];

  for (const word of specificCases) {
    console.log(`Testing: ${word}`);

    const analysis = analyzeAdjective(word);
    const translation = translateAdjective(word, { lang: "all" });

    console.log(`  Analysis: degree=${analysis.degree}, base=${analysis.base}, confidence=${analysis.confidence}`);
    console.log(`  Translation:`, translation);
    console.log("");
  }
};

// Función de debug adicional para orangefarben
const debugOrangefarben = () => {
  console.log("\n=== DEBUG ORANGEFARBEN ESPECÍFICO ===\n");

  const word = "orangefarbenen";
  const base = "orangefarben";

  // 1. Verificar si la base está en los datos
  const baseEntries = ADJECTIVES_IMPORTED.filter((adj) => adj.de.toLowerCase() === base.toLowerCase());
  console.log("Base entries:", baseEntries);

  // 2. Verificar análisis paso a paso
  const analysis = analyzeAdjective(word);
  console.log("Analysis:", analysis);

  // 3. Verificar lookup paso a paso
  console.log("\nStep-by-step lookup:");
  console.log("1. Word:", word);
  console.log("2. Expected base:", base);
  console.log("3. Analysis degree:", analysis.degree);
  console.log("4. Analysis base:", analysis.base);
  console.log("5. Is gradable:", ADJ_GRADABLE.get(base));

  // 4. Intentar traducción
  const result = translateAdjective(word);
  console.log("6. Translation result:", result);
};

// Run all tests
runImprovedTest();
// testSpecificCases();
// debugOrangefarben();
