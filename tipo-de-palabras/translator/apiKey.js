// ===== GESTIÓN DE API KEY =====
const API_KEY_STORAGE = "google_translate_api_key";

/** Carga la API key desde localStorage */
export const loadApiKey = () => {
  try {
    const stored = localStorage.getItem(API_KEY_STORAGE);
    if (stored) {
      const data = JSON.parse(stored);
      console.log(`🔑 API key cargada (guardada el ${new Date(data.dateSaved).toLocaleString()})`);
      return data.key; // <- DEVUELVE la key; NO toca variables globales
    }
  } catch (error) {
    console.error("Error cargando API key:", error);
  }
  return null;
};

/** Valida que la API key funcione */
export const validateApiKey = async (key) => {
  if (!key || key.length < 10) throw new Error("API key inválida (muy corta)");
  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: "test", target: "es", source: "en" }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.data && data.data.translations) return true;
    }

    const errorText = await response.text();
    if (response.status === 400) throw new Error("API key inválida o mal formateada");
    if (response.status === 403) throw new Error("API key sin permisos para Google Translate API");
    if (response.status === 429) throw new Error("Límite de cuota excedido");
    throw new Error(`Error HTTP ${response.status}: ${errorText}`);
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error("Error de conexión - verifica tu internet");
    }
    throw error;
  }
};

/** Guarda la API key en localStorage después de validarla */
export const saveApiKey = async (key) => {
  try {
    console.log("🔍 Validando API key...");
    await validateApiKey(key);
    const data = { key, dateSaved: new Date().toISOString(), validated: true };
    localStorage.setItem(API_KEY_STORAGE, JSON.stringify(data));
    console.log("✅ API key validada y guardada correctamente");
    console.log("🌐 Google Translate está listo para usar");
    return true;
  } catch (error) {
    console.error("❌ Error validando API key:", error.message);
    return false;
  }
};

/** Configura la API key (persistencia) */
export const setApiKey = async (key) => {
  if (!key) {
    console.log('📝 Uso: setApiKey("tu-api-key-aqui")');
    console.log("🔗 Obtén tu API key en: https://console.cloud.google.com/apis/credentials");
    console.log("💡 Necesitas habilitar Google Translate API en tu proyecto");
    return false;
  }
  return await saveApiKey(key);
};

/** Elimina la API key guardada (solo storage) */
export const clearApiKey = () => {
  try {
    localStorage.removeItem(API_KEY_STORAGE);
    console.log("🗑️  API key eliminada");
    console.log("⚠️  Las traducciones nuevas no funcionarán hasta configurar una nueva API key");
    return true;
  } catch (error) {
    console.error("Error eliminando API key:", error);
    return false;
  }
};

/** Info de la API key almacenada */
export const getApiKeyInfo = () => {
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
    };
    console.log("🔑 Información de API key:");
    console.table(info);
    return info;
  } catch (error) {
    console.error("Error obteniendo info de API key:", error);
    return null;
  }
};
