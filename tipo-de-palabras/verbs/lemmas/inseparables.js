// === Verbos siempre INSEPARABLES, agrupados por prefijo ===
export const INSEPARABLES_GROUPED = {
  an: [
    "antworten", // responder (≠ an|worten)
  ],

  unter: [
    "unterhalten", // entretener / conversar
    "unterscheiden", // distinguir
    "unterbrechen", // interrumpir
    "unternehmen", // emprender
    "unterstützen", // apoyar
    "unterrichten", // enseñar
    "untersuchen", // investigar / examinar
  ],

  ueber: [
    "überzeugen", // convencer
    "übertreiben", // exagerar
    "überprüfen", // verificar / comprobar
    "überleben", // sobrevivir
    "übersehen", // pasar por alto
    "überfallen", // asaltar / atacar
    "überqueren", // cruzar
  ],

  um: [
    "umarmen", // abrazar
    "umringen", // rodear
    "umfassen", // abarcar / comprender
  ],

  durch: [
    "durchsuchen", // registrar / cachear
    "durchleben", // atravesar / pasar por (experiencia)
    "durchdenken", // pensar algo a fondo
  ],

  hinter: [
    "hinterfragen", // cuestionar críticamente
  ],

  ver: ["verschwinden"],

  be: ["behalten", "bedeuten", "begehen"],

  er: ["erschaffen"],
};

// === Verbos AMBIGUOS (pueden ser separables o inseparables) ===
export const AMBIGUOUS_GROUPED = {
  unter: [
    "unterlaufen", // INSEP: sufrir error / SEP: correr por debajo
    "untertauchen", // SEP: sumergirse / INSEP: desaparecer (uso semántico)
  ],

  ueber: [
    "übersetzen", // INSEP: traducir / SEP: trasladar en barca
    "überlaufen", // SEP: desertar / INSEP: desbordar
    "übertreten", // INSEP: transgredir / SEP: pasarse (confesión, grupo)
  ],

  um: [
    "umgehen", // INSEP: manejar/evitar / SEP: rodear
    "umschreiben", // INSEP: parafrasear / SEP: reescribir
    "umstellen", // INSEP: rodear (policía) / SEP: reubicar
  ],

  durch: [
    "durchfahren", // INSEP: atravesar sin parar / SEP: recorrer por completo
  ],
};

export const INSEPARABLES = new Set(Object.values(INSEPARABLES_GROUPED).flat());
export const AMBIGUOUS = new Set(Object.values(AMBIGUOUS_GROUPED).flat());
