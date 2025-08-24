// test_improved.js
import { analyzeAdjective } from "./detection.js";
import { tr, translateAdjective } from "./lookup.js"; // using enhanced version

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

const ALL_EXPECTS = [...EXPECTS_1, ...EXPECTS_2, ...EXPECTS_3];

const runImprovedTest = () => {
  console.log("=== TESTING IMPROVED TRANSLATION ===\n");

  let analysisOK = 0;
  let translationOK = 0;
  let totalTests = 0;

  for (const [word, expectedDegree, expectedBase] of ALL_EXPECTS) {
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

    if (translation) {
      console.log(`     Translation: ${translation}`);
    } else {
      console.log(`     Translation: null`);
    }

    if (fullTranslation && !analysisCorrect) {
      console.log(`     Expected: ${expectedDegree} ${expectedBase}`);
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
  ];

  for (const word of specificCases) {
    console.log(`Testing: ${word}`);

    const analysis = analyzeAdjective(word);
    const translation = translateAdjective(word, { lang: "all" });

    console.log(`  Analysis: degree=${analysis.degree}, base=${analysis.base}`);
    console.log(`  Translation:`, translation);
    console.log("");
  }
};

// Run tests
runImprovedTest();
testSpecificCases();
