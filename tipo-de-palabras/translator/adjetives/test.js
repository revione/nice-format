import { analyzeAdjective } from "./index.js";

// ---------- pruebas rápidas ----------
// (() => {
//   const ejemplos = [
//     // base + declinación
//     "schöne", // base, declinado
//     "freundlichen", // base + declinación plural/dativo/akk

//     // comparativos regulares
//     "stärkeren", // comp + decl
//     "größere", // comp con ß
//     "weißer", // comp con ß
//     "jüngere", // comp con umlaut

//     // superlativos regulares
//     "höchstem", // sup irregular
//     "nächstes", // sup irregular (nah → nächst)
//     "schönste", // sup regular
//     "freundlichsten", // sup regular + decl

//     // supletivos
//     "besten", // gut → best
//     "meisten", // viel → meist

//     // irregular con tema raro
//     "fitter", // fit → fitt-

//     // otros frecuentes
//     "älteren", // alt → älter
//     "kürzesten", // kurz → kürzest
//     "besseren", // gut → besser
//     "kleineren", // klein → kleiner
//     "längstes", // lang → längst
//   ];

//   for (const w of ejemplos) {
//     const g = analyzeAdjective(w);
//     console.log(w, g);
//   }
// })();

const EXPECT = [
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
  // casos extra útiles:
  ["Schöne", "base", "schön"], // capitalizado
  ["WEIßER", "comp", "weiß"], // mayúsculas + ß
];

const RARE_CASES_EXPECT = [
  // umlaut irregulares
  ["dümmer", "comp", "dumm"],
  ["dümmsten", "sup", "dumm"],
  ["klüger", "comp", "klug"],
  ["klügsten", "sup", "klug"],
  ["ärmer", "comp", "arm"],
  ["ärmsten", "sup", "arm"],
  ["kälter", "comp", "kalt"],
  ["kältesten", "sup", "kalt"],

  // -est obligatorio
  ["heißester", "sup", "heiß"],
  ["spitzesten", "sup", "spitz"],
  ["fleißigsten", "sup", "fleißig"],

  // doblan consonante
  ["nettester", "sup", "nett"],
  ["sattesten", "sup", "satt"],
  ["dicksten", "sup", "dick"],

  // supletivos
  ["lieber", "comp", "gern"],
  ["liebsten", "sup", "gern"],

  // colores (normalmente gradables, pero los de préstamo no tanto)
  ["blauer", "comp", "blau"],
  ["blaueste", "sup", "blau"],

  // no gradables → mejor tratarlos como base/null
  ["rosa", null, "rosa"],
  ["lila", null, "lila"],
  ["orangefarbenen", null, "orangefarben"],

  // sustantivados
  ["Große", "base", "groß"],
  ["Beste", "sup", "gut"],

  // participiales (no comparan normalmente)
  ["gelungen", null, "gelungen"],
  ["verheiratet", null, "verheiratet"],
];

const runExpect = () => {
  let fails = 0;
  for (const [word, degree, base] of RARE_CASES_EXPECT) {
    const g = analyzeAdjective(word);
    const ok = g.degree === degree && g.base === base;
    console.log(word, g);
    if (!ok) {
      console.error("❌", word, "→", g.degree, g.base, " (expected:", degree, base, ")");
      fails++;
    } else {
      console.log("✅", word, "→", degree, base);
    }
  }

  if (fails) {
    console.error(`\n${fails} test(s) failed.`);
  } else {
    console.log("\nAll tests passed 🎉");
  }
};

runExpect();
