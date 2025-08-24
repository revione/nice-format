// === translator-hybrid.js ===
import { WORD_TYPES } from "../word-types/types.js";

const TRANSLATION_CACHE = new Map();
const TRANSLATION_QUEUE = new Map(); // Para evitar requests duplicados
const STORAGE_KEY = "german_translations_learned";
const API_KEY_STORAGE = "google_translate_api_key";

let API_KEY = null; // Se carga dinámicamente

const getTypeStyle = (id) => Object.values(WORD_TYPES).find((t) => t.id === id) || WORD_TYPES.OTHER;

// ===== GESTIÓN DE API KEY =====

/**
 * Carga la API key desde localStorage
 */
function loadApiKey() {
  try {
    const stored = localStorage.getItem(API_KEY_STORAGE);
    if (stored) {
      const data = JSON.parse(stored);
      API_KEY = data.key;
      console.log(`🔑 API key cargada (guardada el ${new Date(data.dateSaved).toLocaleString()})`);
      return API_KEY;
    }
  } catch (error) {
    console.error("Error cargando API key:", error);
  }
  return null;
}

/**
 * Valida que la API key funcione
 */
async function validateApiKey(key) {
  if (!key || key.length < 10) {
    throw new Error("API key inválida (muy corta)");
  }

  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: "test",
        target: "es",
        source: "en",
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.translations) {
        return true;
      }
    }

    // Analizar errores específicos
    const errorText = await response.text();
    if (response.status === 400) {
      throw new Error("API key inválida o mal formateada");
    } else if (response.status === 403) {
      throw new Error("API key sin permisos para Google Translate API");
    } else if (response.status === 429) {
      throw new Error("Límite de cuota excedido");
    } else {
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Error de conexión - verifica tu internet");
    }
    throw error;
  }
}

/**
 * Guarda la API key en localStorage después de validarla
 */
async function saveApiKey(key) {
  try {
    console.log("🔍 Validando API key...");
    await validateApiKey(key);

    const data = {
      key: key,
      dateSaved: new Date().toISOString(),
      validated: true,
    };

    localStorage.setItem(API_KEY_STORAGE, JSON.stringify(data));
    API_KEY = key;

    console.log("✅ API key validada y guardada correctamente");
    console.log("🌐 Google Translate está listo para usar");
    return true;
  } catch (error) {
    console.error("❌ Error validando API key:", error.message);
    // No guardar si hay error
    return false;
  }
}

/**
 * Configura la API key desde consola
 */
async function setApiKey(key) {
  if (!key) {
    console.log('📝 Uso: setApiKey("tu-api-key-aqui")');
    console.log("🔗 Obtén tu API key en: https://console.cloud.google.com/apis/credentials");
    console.log("💡 Necesitas habilitar Google Translate API en tu proyecto");
    return false;
  }

  return await saveApiKey(key);
}

/**
 * Elimina la API key guardada
 */
function clearApiKey() {
  try {
    localStorage.removeItem(API_KEY_STORAGE);
    API_KEY = null;
    console.log("🗑️  API key eliminada");
    console.log("⚠️  Las traducciones nuevas no funcionarán hasta configurar una nueva API key");
    return true;
  } catch (error) {
    console.error("Error eliminando API key:", error);
    return false;
  }
}

/**
 * Muestra información sobre la API key actual
 */
function getApiKeyInfo() {
  try {
    const stored = localStorage.getItem(API_KEY_STORAGE);
    if (!stored) {
      console.log("❌ No hay API key configurada");
      console.log('💡 Usa: setApiKey("tu-key") para configurar');
      return null;
    }

    const data = JSON.parse(stored);
    const info = {
      configured: true,
      dateSaved: new Date(data.dateSaved).toLocaleString(),
      keyPreview: `${data.key.substring(0, 8)}...${data.key.substring(data.key.length - 4)}`,
      status: API_KEY ? "✅ Activa" : "⚠️  Cargada pero no validada",
    };

    console.log("🔑 Información de API key:");
    console.table(info);
    return info;
  } catch (error) {
    console.error("Error obteniendo info de API key:", error);
    return null;
  }
}
// Aquí puedes agregar todas las traducciones que ya conoces
const LOCAL_DICTIONARY = {
  // Sustantivos comunes
  angehörigen: "familiares, parientes",
  befunden: "encontrado, hallado",
  beleidigung: "insulto, ofensa",
  bereich: "ámbito, área, zona",
  gewahrsein: "conciencia, conocimiento",
  leiche: "cadáver",
  störung: "perturbación, alteración",
  totenruhe: "descanso de los muertos",
  umfug: "desmán, acto indebido",
  zugunsten: "en favor de",
  zumeist: "en la mayoría de los casos",

  // Verbos comunes
  lassen: "dejar, permitir",
  verschwinden: "desaparecer",
  aufräumen: "ordenar, limpiar",
  bemerken: "notar, darse cuenta",
  aufnehmen: "tomar, grabar",
  auswählen: "elegir, seleccionar",
  arbeiten: "trabajar",
  warten: "esperar",
  helfen: "ayudar",
  erreichen: "alcanzar, lograr",

  // Adjetivos comunes
  beschimpfender: "insultante, injurioso",
  geschützter: "protegido",
  straflos: "impune, no punible",
  vertraulicher: "confidencial",
  freundliches: "amigable",
  hellgrünes: "verde claro",
  pünktlich: "puntual",
  ruhig: "tranquilo, silencioso",
  warm: "caliente, cálido",
  natürlich: "natural",
  ausdrucksstark: "expresivo",
  weitläufig: "extenso, amplio",

  // Artículos y pronombres
  der: "el",
  die: "la",
  das: "lo, el",
  den: "el (acusativo)",
  des: "del",
  dem: "al",
  ein: "un",
  eine: "una",
  einen: "un (acusativo)",
  einer: "de una",
  einem: "a un",
  sie: "ella, ellos",
  er: "él",
  es: "ello",
  wir: "nosotros",
  ihr: "vosotros",
  ich: "yo",
  du: "tú",
  man: "uno, se",
  sich: "se",

  // Preposiciones
  in: "en",
  auf: "sobre, en",
  zu: "a, hacia",
  mit: "con",
  von: "de, desde",
  bei: "en, junto a",
  nach: "después, hacia",
  vor: "antes, delante",
  über: "sobre, acerca de",
  unter: "bajo, debajo",
  durch: "a través de",
  für: "para",
  gegen: "contra",
  ohne: "sin",
  um: "alrededor, a las",
  während: "durante",
  wegen: "por causa de",
  trotz: "a pesar de",
  innerhalb: "dentro de",
  außerhalb: "fuera de",
  unterm: "bajo el",
  vorm: "delante del",
  hinein: "hacia adentro",
  hinaus: "hacia afuera",
  hinauf: "hacia arriba",
  hinunter: "hacia abajo",
  hinüber: "hacia allá",
  heraus: "hacia fuera",
  herüber: "hacia acá",

  // Conjunciones y conectores
  und: "y",
  oder: "o",
  aber: "pero",
  denn: "pues, porque",
  sondern: "sino",
  sowie: "así como",
  sowohl: "tanto",
  als: "como, cuando",
  auch: "también",
  entweder: "o bien",
  weder: "ni",
  noch: "aún, todavía",
  nicht: "no",
  nur: "solo, solamente",
  schon: "ya",
  erst: "primero, solo",
  dann: "entonces",
  danach: "después",
  später: "más tarde",
  gleich: "enseguida, igual",
  bereits: "ya",
  wieder: "otra vez",
  neben: "junto a",
  nämlich: "es decir, a saber",
  obwohl: "aunque",
  trotz: "a pesar de",
  statt: "en lugar de",
  doch: "sin embargo, pero",

  // Adverbios comunes
  heute: "hoy",
  morgen: "mañana",
  gestern: "ayer",
  jetzt: "ahora",
  hier: "aquí",
  dort: "allí",
  da: "ahí, allí",
  wo: "donde",
  wie: "como",
  warum: "por qué",
  wann: "cuándo",
  sehr: "muy",
  ziemlich: "bastante",
  ganz: "muy, completamente",
  etwas: "algo",
  nichts: "nada",
  alles: "todo",
  immer: "siempre",
  nie: "nunca",
  manchmal: "a veces",
  oft: "a menudo",
  selten: "raramente",
  vielleicht: "quizás",
  wirklich: "realmente",
  eigentlich: "en realidad",
  natürlich: "naturalmente",
  sicher: "seguro",
  genau: "exacto",
  besonders: "especialmente",
  zusammen: "juntos",
  allein: "solo",

  // Tiempo y números
  uhr: "hora",
  morgen: "mañana (tiempo)",
  früh: "temprano",
  spät: "tarde",
  mittag: "mediodía",
  abend: "tarde/noche",
  nacht: "noche",
  woche: "semana",
  monat: "mes",
  jahr: "año",
  tag: "día",
  stunde: "hora",
  minute: "minuto",
  zweimal: "dos veces",
  einmal: "una vez",
  dreimal: "tres veces",
  hundertste: "centésima",
  erste: "primera",
  zweite: "segunda",
  dritte: "tercera",
  letzte: "última",

  // Familia y personas
  bruder: "hermano",
  schwester: "hermana",
  mutter: "madre",
  vater: "padre",
  eltern: "padres",
  kind: "niño",
  kinder: "niños",
  frau: "mujer, señora",
  mann: "hombre, señor",
  person: "persona",
  menschen: "personas, gente",
  leute: "gente",
  besucher: "visitante",

  // Casa y lugares
  haus: "casa",
  wohnzimmer: "sala de estar",
  zimmer: "habitación",
  küche: "cocina",
  keller: "sótano",
  garten: "jardín",
  fenster: "ventana",
  tür: "puerta",
  tor: "portón",
  schuppen: "cobertizo",
  arbeitszimmer: "oficina",
  leseecke: "rincón de lectura",
  lesesessel: "sillón de lectura",
  tisch: "mesa",
  stuhl: "silla",
  ordner: "carpeta",
  mappe: "carpeta",
  computer: "computadora",
  rechner: "computadora",
  drucker: "impresora",
  kamera: "cámara",

  // Objetos y tecnología
  foto: "foto",
  bild: "imagen, cuadro",
  album: "álbum",
  aufnahme: "grabación, foto",
  aufnahmen: "grabaciones, fotos",
  datei: "archivo",
  serie: "serie",
  farben: "colores",
  farbtöne: "tonos de color",
  licht: "luz",
  werbung: "publicidad",
  radio: "radio",
  musik: "música",
  kaffee: "café",
  frühstück: "desayuno",
  kleidungsstück: "prenda de vestir",
  umhängetasche: "bolso",
  plakat: "cartel",
  herzsymbol: "símbolo de corazón",
  drohne: "dron",
  drohnen: "drones",
  hubsan: "Hubsan (marca)",
  mailbox: "buzón de correo",
  email: "email",
  "e-mail": "email",
  betreff: "asunto",
  notiz: "nota",
  randbemerkung: "nota al margen",
  testseite: "página de prueba",
  lizenz: "licencia",
  plan: "plan",
  problem: "problema",
  schritte: "pasos",
  einstellungen: "configuraciones",
  ergebnis: "resultado",
  paket: "paquete",

  // Otros sustantivos importantes
  ordnung: "orden",
  übersicht: "resumen, vista general",
  hilfe: "ayuda",
  zeit: "tiempo",
  möglichkeit: "posibilidad",
  freundlichkeit: "amabilidad",
  entscheidung: "decisión",
  beschreibung: "descripción",
  wetter: "clima",
  grünfläche: "zona verde",
  vegetation: "vegetación",
  winkel: "ángulo",
  form: "forma",
  gesicht: "cara",
  wangenknochen: "pómulos",
  lächeln: "sonrisa",
  zähne: "dientes",
  hintergrund: "fondo",
  zustand: "estado",
  vorgang: "proceso",

  // Expresiones y frases
  okay: "okay",
  finish: "terminar",
  later: "más tarde",
  english: "inglés",
  deutsch: "alemán",

  // Partículas y palabras funcionales
  zu: "demasiado, muy",
  so: "así, tan",
  ja: "sí",
  nein: "no",
  bitte: "por favor",
  danke: "gracias",
  entschuldigung: "perdón",
  hallo: "hola",
  tschüss: "adiós",
  bis: "hasta",
  seit: "desde",
  ab: "desde",
  an: "en, a",
  aus: "de, desde",
  außer: "excepto",
  bei: "en casa de",
  gegenüber: "frente a",
  längs: "a lo largo de",
  nahe: "cerca de",
  nebst: "junto con",
  samt: "junto con",
  "vis-à-vis": "frente a",
  zwischen: "entre",
};

// ===== SISTEMA DE APRENDIZAJE AUTOMÁTICO =====

/**
 * Carga las traducciones aprendidas desde localStorage
 */
function loadLearnedTranslations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const learned = JSON.parse(stored);
      console.log(`📖 Cargadas ${Object.keys(learned).length} traducciones aprendidas desde localStorage`);
      return learned;
    }
  } catch (error) {
    console.error("Error cargando traducciones aprendidas:", error);
  }
  return {};
}

/**
 * Guarda una nueva traducción aprendida en localStorage
 */
function saveLearnedTranslation(word, translation, source = "google") {
  try {
    const learned = loadLearnedTranslations();
    const normalized = normalizeWord(word);

    // Agregar metadata útil
    learned[normalized] = {
      translation,
      source,
      dateAdded: new Date().toISOString(),
      timesUsed: (learned[normalized]?.timesUsed || 0) + 1,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(learned, null, 2));
    console.log(`💾 Guardada traducción: ${word} → ${translation} (${source})`);
    return true;
  } catch (error) {
    console.error("Error guardando traducción aprendida:", error);
    return false;
  }
}

/**
 * Busca en traducciones aprendidas
 */
function findLearnedTranslation(word) {
  const learned = loadLearnedTranslations();
  const normalized = normalizeWord(word);

  if (learned[normalized]) {
    // Incrementar contador de uso
    learned[normalized].timesUsed++;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(learned, null, 2));

    return {
      translation: learned[normalized].translation,
      source: "learned",
      metadata: learned[normalized],
    };
  }

  return null;
}

/**
 * Obtiene estadísticas de traducciones aprendidas
 */
function getLearnedStats() {
  const learned = loadLearnedTranslations();
  const entries = Object.entries(learned);

  return {
    total: entries.length,
    bySource: entries.reduce((acc, [word, data]) => {
      acc[data.source] = (acc[data.source] || 0) + 1;
      return acc;
    }, {}),
    mostUsed: entries
      .sort(([, a], [, b]) => (b.timesUsed || 0) - (a.timesUsed || 0))
      .slice(0, 10)
      .map(([word, data]) => ({ word, uses: data.timesUsed, translation: data.translation })),
    oldestEntries: entries
      .sort(([, a], [, b]) => new Date(a.dateAdded) - new Date(b.dateAdded))
      .slice(0, 10)
      .map(([word, data]) => ({ word, date: data.dateAdded, translation: data.translation })),
  };
}

/**
 * Exporta todas las traducciones aprendidas en formato código
 */
function exportLearnedTranslations() {
  const learned = loadLearnedTranslations();
  const sorted = Object.keys(learned).sort();

  let output = "// Traducciones aprendidas automáticamente:\n";
  output += "// Generado el: " + new Date().toLocaleString() + "\n\n";

  for (const word of sorted) {
    const data = learned[word];
    output += `"${word}": "${data.translation}", // ${data.source} - usado ${data.timesUsed} veces\n`;
  }

  return output;
}

/**
 * Limpia traducciones aprendidas (con confirmación)
 */
function clearLearnedTranslations(confirm = false) {
  if (!confirm) {
    console.log("⚠️  Para limpiar las traducciones aprendidas, usa: clearLearnedTranslations(true)");
    return false;
  }

  try {
    const count = Object.keys(loadLearnedTranslations()).length;
    localStorage.removeItem(STORAGE_KEY);
    console.log(`🗑️  Se eliminaron ${count} traducciones aprendidas`);
    return true;
  } catch (error) {
    console.error("Error limpiando traducciones:", error);
    return false;
  }
}

// Normaliza palabras para búsqueda (quita acentos, convierte a minúsculas, etc.)
function normalizeWord(word) {
  return word
    .toLowerCase()
    .replace(/[äöüß]/g, (match) => {
      const replacements = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };
      return replacements[match] || match;
    })
    .trim();
}

// Busca en el diccionario completo (local + aprendido) con variantes
function findLocalTranslation(word) {
  const normalized = normalizeWord(word);

  // PASO 1: Buscar en traducciones aprendidas (prioridad más alta)
  const learned = findLearnedTranslation(word);
  if (learned) {
    return {
      translation: learned.translation,
      source: "learned",
      metadata: learned.metadata,
    };
  }

  // PASO 2: Buscar directamente en diccionario base
  if (LOCAL_DICTIONARY[normalized]) {
    return {
      translation: LOCAL_DICTIONARY[normalized],
      source: "local",
    };
  }

  // PASO 3: Buscar sin artículos comunes
  const withoutArticles = normalized.replace(/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+/, "");
  if (withoutArticles !== normalized && LOCAL_DICTIONARY[withoutArticles]) {
    return {
      translation: LOCAL_DICTIONARY[withoutArticles],
      source: "local",
    };
  }

  // PASO 4: Buscar versiones sin terminaciones comunes
  const withoutEndings = normalized.replace(/(en|er|es|e|n|s|t)$/, "");
  if (withoutEndings !== normalized && LOCAL_DICTIONARY[withoutEndings]) {
    return {
      translation: LOCAL_DICTIONARY[withoutEndings],
      source: "local",
    };
  }

  // PASO 5: Buscar en claves que contengan la palabra
  for (const [key, value] of Object.entries(LOCAL_DICTIONARY)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return {
        translation: value,
        source: "local",
      };
    }
  }

  return null;
}

/**
 * Traduce una palabra usando diccionario local primero, luego Google API
 * @param {string} word - Palabra a traducir
 * @param {string} sourceLanguage - Idioma origen (por defecto 'de' para alemán)
 * @param {string} targetLanguage - Idioma destino (por defecto 'es' para español)
 * @returns {Promise<{translation: string, source: 'local'|'google'|null}>}
 */
async function translateWord(word, sourceLanguage = "de", targetLanguage = "es") {
  const cacheKey = `${word.toLowerCase()}|${sourceLanguage}|${targetLanguage}`;

  // Verificar cache
  if (TRANSLATION_CACHE.has(cacheKey)) return TRANSLATION_CACHE.get(cacheKey);

  // Verificar si ya está en proceso
  if (TRANSLATION_QUEUE.has(cacheKey)) return await TRANSLATION_QUEUE.get(cacheKey);

  // Crear nueva traducción
  const translationPromise = performHybridTranslation(word, sourceLanguage, targetLanguage);
  TRANSLATION_QUEUE.set(cacheKey, translationPromise);

  try {
    const result = await translationPromise;
    TRANSLATION_CACHE.set(cacheKey, result);
    TRANSLATION_QUEUE.delete(cacheKey);
    return result;
  } catch (error) {
    console.error(`Error traduciendo "${word}":`, error);
    TRANSLATION_QUEUE.delete(cacheKey);
    return { translation: null, source: null };
  }
}

async function performHybridTranslation(word, sourceLanguage, targetLanguage) {
  // PASO 1: Buscar en diccionarios locales (base + aprendido)
  const localResult = findLocalTranslation(word);
  if (localResult) {
    const sourceIcon = localResult.source === "learned" ? "📖" : "📚";
    console.log(`${sourceIcon} Traducción ${localResult.source}: ${word} → ${localResult.translation}`);
    return localResult;
  }

  // PASO 2: Si no está en local, verificar si tenemos API key válida
  if (!API_KEY) {
    console.log(`⚠️ "${word}" no encontrada en diccionario local y no hay API key configurada`);
    return { translation: null, source: null };
  }

  console.log(`🌐 Buscando en Google Translate: ${word}`);

  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: word,
        target: targetLanguage,
        source: sourceLanguage,
        format: "text",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.data && data.data.translations && data.data.translations.length > 0) {
      const googleTranslation = data.data.translations[0].translatedText;

      // 🎯 GUARDAR AUTOMÁTICAMENTE LA TRADUCCIÓN APRENDIDA
      const saved = saveLearnedTranslation(word, googleTranslation, "google");
      if (saved) {
        console.log(`💡 Nueva palabra aprendida: ${word} → ${googleTranslation}`);
      }

      console.log(`🔍 Traducción Google: ${word} → ${googleTranslation}`);
      return {
        translation: googleTranslation,
        source: "google",
      };
    }

    return { translation: null, source: null };
  } catch (error) {
    console.error(`❌ Error con Google Translate para "${word}":`, error.message);
    return { translation: null, source: null };
  }
}

/**
 * Mejora el tooltip con traducción y fuente
 */
async function enhanceTooltipWithTranslation(originalTooltip, word, type) {
  const result = await translateWord(word);

  if (result.translation && result.translation.toLowerCase() !== word.toLowerCase()) {
    const style = getTypeStyle(type);
    let sourceIcon = "📚"; // local por defecto

    if (result.source === "learned") sourceIcon = "📖"; // aprendido
    else if (result.source === "google") sourceIcon = "🌐"; // google nuevo

    return `${sourceIcon} ${style.label}: ${word} → ${result.translation}`;
  }

  return originalTooltip;
}

/**
 * Renderiza la lista de palabras para aprender con traducciones híbridas
 */
async function renderLearningListWithTranslations(container, counter, store) {
  if (!container || !counter) return;
  const entries = store.list();

  if (entries.length === 0) {
    container.parentElement.style.display = "none";
    counter.textContent = "(0 palabras)";
    container.innerHTML = "";
    return;
  }

  container.parentElement.style.display = "block";
  counter.textContent = `(${entries.length} palabras)`;
  container.innerHTML = "";

  let localCount = 0;
  let learnedCount = 0;
  let googleCount = 0;

  // Procesar cada entrada con traducción híbrida
  for (const { word, type } of entries) {
    const style = getTypeStyle(type);
    const row = document.createElement("div");
    row.className = "learn-word-item";

    // Crear estructura inicial
    row.innerHTML = `
      <div class="learn-word-content">
        <span class="learn-word-text">
          <span title="${style.label}">${style.emoji}</span> ${word}
        </span>
        <span class="learn-word-translation">Buscando...</span>
        <span class="learn-word-type">${style.label}</span>
      </div>
      <button class="remove-word-btn" title="Quitar de lista" onclick="removeLearningWord('${word}', '${type}')">×</button>
    `;

    container.appendChild(row);

    // Obtener traducción de forma asíncrona
    try {
      const result = await translateWord(word);
      const translationSpan = row.querySelector(".learn-word-translation");

      if (result.translation && result.translation.toLowerCase() !== word.toLowerCase()) {
        let sourceIcon = "📚";
        let tooltipText = "Traducción del diccionario base";

        if (result.source === "learned") {
          sourceIcon = "📖";
          tooltipText = `Aprendida automáticamente el ${new Date(result.metadata?.dateAdded).toLocaleDateString()} (usada ${result.metadata?.timesUsed} veces)`;
          learnedCount++;
        } else if (result.source === "local") {
          localCount++;
        } else if (result.source === "google") {
          sourceIcon = "🌐";
          tooltipText = "Traducción nueva de Google Translate";
          googleCount++;
        }

        translationSpan.innerHTML = `${sourceIcon} → ${result.translation}`;
        translationSpan.classList.add("translation-success");
        translationSpan.title = tooltipText;
      } else {
        translationSpan.textContent = "(sin traducción)";
        translationSpan.classList.add("translation-none");
      }
    } catch (error) {
      const translationSpan = row.querySelector(".learn-word-translation");
      translationSpan.textContent = "(error traducción)";
      translationSpan.classList.add("translation-error");
      console.error(`Error traduciendo "${word}":`, error);
    }
  }

  // Agregar estadísticas de traducción
  const existingStats = container.parentElement.querySelector(".translation-stats");
  if (existingStats) existingStats.remove();

  if (localCount > 0 || learnedCount > 0 || googleCount > 0) {
    const statsDiv = document.createElement("div");
    statsDiv.className = "translation-stats";

    let statsText = "📊 Traducciones: ";
    const parts = [];
    if (localCount > 0) parts.push(`${localCount} base 📚`);
    if (learnedCount > 0) parts.push(`${learnedCount} aprendidas 📖`);
    if (googleCount > 0) parts.push(`${googleCount} nuevas 🌐`);

    statsDiv.innerHTML = statsText + parts.join(" | ");
    container.parentElement.appendChild(statsDiv);
  }
}

/**
 * Actualiza tooltips con traducciones híbridas en tiempo real
 */
function updateTooltipsWithTranslations() {
  const coloredWords = document.querySelectorAll(".word-colored[data-tooltip]");

  coloredWords.forEach(async (element) => {
    const originalTooltip = element.dataset.tooltip;
    const word = element.dataset.word || element.textContent.trim();
    const type = element.dataset.type || "other";

    // Solo traducir si no tiene traducción ya
    if (!originalTooltip.includes("→")) {
      try {
        const enhancedTooltip = await enhanceTooltipWithTranslation(originalTooltip, word, type);
        element.dataset.tooltip = enhancedTooltip;

        // Agregar indicador visual de que tiene traducción
        if (enhancedTooltip.includes("→")) {
          element.classList.add("word-translated");
        }
      } catch (error) {
        console.error(`Error mejorando tooltip para "${word}":`, error);
      }
    }
  });
}

/**
 * Función para agregar palabras al diccionario local dinámicamente
 */
function addToLocalDictionary(word, translation) {
  const normalized = normalizeWord(word);
  LOCAL_DICTIONARY[normalized] = translation;
  console.log(`✅ Agregado al diccionario local: ${word} → ${translation}`);
}

/**
 * Función para obtener estadísticas del diccionario completo
 */
function getDictionaryStats() {
  const learnedStats = getLearnedStats();

  return {
    baseEntries: Object.keys(LOCAL_DICTIONARY).length,
    learnedEntries: learnedStats.total,
    totalEntries: Object.keys(LOCAL_DICTIONARY).length + learnedStats.total,
    cacheSize: TRANSLATION_CACHE.size,
    learned: learnedStats,
  };
}

/**
 * Inicializa el sistema de traducción híbrido con aprendizaje
 */
function initTranslator() {
  // Cargar API key al inicio
  loadApiKey();

  const stats = getDictionaryStats();

  console.log(`🚀 Traductor híbrido con aprendizaje inicializado:`);
  console.log(`📚 Diccionario base: ${stats.baseEntries} entradas`);
  console.log(`📖 Traducciones aprendidas: ${stats.learnedEntries} entradas`);
  console.log(`📊 Total disponible: ${stats.totalEntries} traducciones`);

  if (API_KEY) {
    console.log(`🌐 Google Translate API: ✅ Configurada y lista`);
  } else {
    console.log(`🌐 Google Translate API: ❌ No configurada`);
    console.log(`💡 Para habilitar traducciones nuevas: window.setApiKey("tu-api-key")`);
    console.log(`ℹ️  La aplicación funcionará solo con el diccionario local y palabras aprendidas`);
  }

  // Mostrar algunas palabras aprendidas más usadas
  if (stats.learned.mostUsed.length > 0) {
    console.log(`⭐ Palabras más usadas:`, stats.learned.mostUsed.slice(0, 5));
  }

  // Registrar funciones globales en window
  window.setApiKey = setApiKey;
  window.clearApiKey = clearApiKey;
  window.getApiKeyInfo = getApiKeyInfo;
  window.getDictionaryStats = getDictionaryStats;
  window.addToLocalDictionary = addToLocalDictionary;
  window.getLearnedStats = getLearnedStats;
  window.exportLearnedTranslations = exportLearnedTranslations;
  window.clearLearnedTranslations = clearLearnedTranslations;

  // Mostrar ayuda de funciones disponibles
  console.log(`🛠️  Funciones disponibles en consola:`);
  console.log(`   window.setApiKey("key") - Configurar API key`);
  console.log(`   window.getApiKeyInfo() - Ver info de API key`);
  console.log(`   window.clearApiKey() - Eliminar API key`);
  console.log(`   window.getDictionaryStats() - Ver estadísticas`);
  console.log(`   window.exportLearnedTranslations() - Exportar palabras aprendidas`);

  // Escuchar cuando se renderizan los highlights para agregar traducciones
  document.addEventListener("app:highlight-rendered", () => {
    setTimeout(updateTooltipsWithTranslations, 100);
  });

  // Intercepción del sistema de learning para agregar traducciones
  const originalDispatchEvent = document.dispatchEvent;
  document.dispatchEvent = function (event) {
    if (event.type === "app:learning-updated") {
      setTimeout(() => {
        const container = document.getElementById("learn-word-list");
        const counter = document.getElementById("learn-count");
        const store = event.detail?.store;

        if (container && counter && store) {
          renderLearningListWithTranslations(container, counter, store);
        }
      }, 50);
    }

    return originalDispatchEvent.call(this, event);
  };
}

// Función global para remover palabras (accesible desde HTML)
window.removeLearningWord = function (word, type) {
  const event = new CustomEvent("app:remove-learning-word", {
    detail: { word, type },
  });
  document.dispatchEvent(event);
};

// Funciones globales registradas en window por initTranslator()

// Exportar funciones para uso externo
export {
  translateWord,
  enhanceTooltipWithTranslation,
  renderLearningListWithTranslations,
  findLocalTranslation,
  addToLocalDictionary,
  getDictionaryStats,
  getLearnedStats,
  exportLearnedTranslations,
  clearLearnedTranslations,
  setApiKey,
  clearApiKey,
  getApiKeyInfo,
  initTranslator,
};

document.addEventListener("DOMContentLoaded", initTranslator);
