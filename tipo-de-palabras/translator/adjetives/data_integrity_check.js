// data_integrity_check.js - Script para verificar la integridad de los datos
import { ADJECTIVES_IMPORTED } from "./lemmas/index.js";

console.log("=== VERIFICACIÓN DE INTEGRIDAD DE DATOS ===\n");

console.log(`Total de entradas: ${ADJECTIVES_IMPORTED.length}`);

// Verificar entradas malformadas
const badEntries = [];
const goodEntries = [];

for (let i = 0; i < ADJECTIVES_IMPORTED.length; i++) {
  const entry = ADJECTIVES_IMPORTED[i];

  if (!entry) {
    badEntries.push({ index: i, error: "Entry is null/undefined", entry });
  } else if (!entry.de) {
    badEntries.push({ index: i, error: "Missing .de property", entry });
  } else if (typeof entry.de !== "string") {
    badEntries.push({ index: i, error: "Invalid .de type", entry });
  } else if (!entry.es) {
    badEntries.push({ index: i, error: "Missing .es property", entry });
  } else if (!entry.form) {
    badEntries.push({ index: i, error: "Missing .form property", entry });
  } else {
    goodEntries.push(entry);
  }
}

console.log(`✅ Entradas válidas: ${goodEntries.length}`);
console.log(`❌ Entradas malformadas: ${badEntries.length}`);

if (badEntries.length > 0) {
  console.log("\n=== ENTRADAS MALFORMADAS ===");
  badEntries.slice(0, 10).forEach((bad) => {
    console.log(`Índice ${bad.index}: ${bad.error}`);
    console.log(`  Entrada:`, bad.entry);
  });

  if (badEntries.length > 10) {
    console.log(`... y ${badEntries.length - 10} más`);
  }
}

// Buscar específicamente entradas con 'orange'
console.log("\n=== ENTRADAS CON 'ORANGE' ===");
const orangeEntries = goodEntries.filter((entry) => entry.de && entry.de.toLowerCase().includes("orange"));
console.log("Entradas encontradas:", orangeEntries);

// Verificar formas por tipo
const formCounts = {};
goodEntries.forEach((entry) => {
  formCounts[entry.form] = (formCounts[entry.form] || 0) + 1;
});
console.log("\n=== DISTRIBUCIÓN POR FORMA ===");
Object.entries(formCounts).forEach(([form, count]) => {
  console.log(`${form}: ${count}`);
});

export { goodEntries, badEntries };
