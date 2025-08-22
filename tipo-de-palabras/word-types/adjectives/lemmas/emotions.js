export const PHYS_ENERGY = {
  müde: { comp: "müder", sup: "müdest" },
  schläfrig: { comp: "schläfriger", sup: "schläfrigst" },
  wach: { comp: "wacher", sup: "wachst" },
  erschöpft: { comp: "erschöpfter", sup: "erschöpftest" },
  schlapp: { comp: "schlapper", sup: "schlapptest" },
  munter: { comp: "munterer", sup: "munterst" },
};

export const PHYS_APPETITE = {
  hungrig: { comp: "hungriger", sup: "hungrigst" },
  satt: { comp: "satter", sup: "sattest" },
  durstig: { comp: "durstiger", sup: "durstigst" },
};

export const PHYS_HEALTH = {
  krank: { comp: "kränker", sup: "kränkst", irregularities: ["umlaut"] },
  kränklich: { comp: "kränklicher", sup: "kränklichst" },
  gesund: { comp: "gesünder", sup: "gesündest", irregularities: ["umlaut"] },
  stark: { comp: "stärker", sup: "stärkst", irregularities: ["umlaut"] },
  fit: { comp: "fitter", sup: "fittest" },
  erholt: { comp: "erholter", sup: "erholtest" },
  schwach: { comp: "schwächer", sup: "schwächst", irregularities: ["umlaut"] },
  kraftlos: { comp: "kraftloser", sup: "kraftlosest" },
  lebendig: { comp: "lebendiger", sup: "lebendigst" },
  beweglich: { comp: "beweglicher", sup: "beweglichst" },
};

export const PHYS_SENSATIONS = {
  benommen: { comp: "benommener", sup: "benommenst" },
  schwindlig: { comp: "schwindliger", sup: "schwindligst" },
  verletzt: { comp: "verletzter", sup: "verletztest" },
  frierend: { comp: "frierender", sup: "frierendst" },
  schwitzend: { comp: "schwitzender", sup: "schwitzendst" },
};

export const STATES_PHYSICAL = {
  ...PHYS_ENERGY,
  ...PHYS_APPETITE,
  ...PHYS_HEALTH,
  ...PHYS_SENSATIONS,
};

export const POS_JOY = {
  glücklich: { comp: "glücklicher", sup: "glücklichst" },
  fröhlich: { comp: "fröhlicher", sup: "fröhlichst" },
  ausgelassen: { comp: "ausgelassener", sup: "ausgelassenst" },
  heiter: { comp: "heiterer", sup: "heiterst" },
  begeistert: { comp: "begeisterter", sup: "begeistertst" },
  euphorisch: { comp: "euphorischer", sup: "euphorischst" },
};

export const POS_SERENITY = {
  zufrieden: { comp: "zufriedener", sup: "zufriedenst" },
  erleichtert: { comp: "erleichterter", sup: "erleichtertst" },
  geborgen: { comp: "geborgener", sup: "geborgenst" },
  freundlich: { comp: "freundlicher", sup: "freundlichst" },
};

export const POS_CONFIDENCE = {
  stolz: { comp: "stolzer", sup: "stolzest" },
  mutig: { comp: "mutiger", sup: "mutigst" },
  optimistisch: { comp: "optimistischer", sup: "optimistischst" },
  zuversichtlich: { comp: "zuversichtlicher", sup: "zuversichtlichst" },
  verliebt: { comp: "verliebter", sup: "verliebtest" },
  hoffnungsvoll: { comp: "hoffnungsvoller", sup: "hoffnungsvollst" },
  dankbar: { comp: "dankbarer", sup: "dankbarst" },
};

export const EMOTIONS_POSITIVE = {
  ...POS_JOY,
  ...POS_SERENITY,
  ...POS_CONFIDENCE,
};

export const NEG_SADNESS = {
  traurig: { comp: "trauriger", sup: "traurigst" },
  verzweifelt: { comp: "verzweifelter", sup: "verzweifeltst" },
  deprimiert: { comp: "deprimierter", sup: "deprimiertest" },
  hoffnungslos: { comp: "hoffnungsloser", sup: "hoffnungslosest" },
  melancholisch: { comp: "melancholischer", sup: "melancholischst" },
  einsam: { comp: "einsamer", sup: "einsamst" },
  verlassen: { comp: "verlassener", sup: "verlassenst" },
};

export const NEG_ANGER = {
  wütend: { comp: "wütender", sup: "wütendst" },
  zornig: { comp: "zorniger", sup: "zornigst" },
  verärgert: { comp: "verärgerter", sup: "verärgertst" },
  genervt: { comp: "genervter", sup: "genervtest" },
};

export const NEG_FEAR = {
  ängstlich: { comp: "ängstlicher", sup: "ängstlichst" },
  nervös: { comp: "nervöser", sup: "nervösest" },
  besorgt: { comp: "besorgter", sup: "besorgtest" },
  unsicher: { comp: "unsicherer", sup: "unsicherst" },
  verunsichert: { comp: "verunsicherter", sup: "verunsichertst" },
  schuldig: { comp: "schuldiger", sup: "schuldigst" },
};

export const NEG_SHAME = {
  beschämt: { comp: "beschämter", sup: "beschämtest" },
  "peinlich berührt": { comp: "peinlich berührter", sup: "peinlich berührtest" },
  verlegen: { comp: "verlegener", sup: "verlegenst" },
  schüchtern: { comp: "schüchterner", sup: "schüchternst" },
};

export const NEG_CONFUSION = {
  schockiert: { comp: "schockierter", sup: "schockiertest" },
  entsetzt: { comp: "entsetzter", sup: "entsetztest" },
  fassungslos: { comp: "fassungsloser", sup: "fassungslosest" },
  erschrocken: { comp: "erschrockener", sup: "erschrockenst" },
  verwirrt: { comp: "verwirrter", sup: "verwirrtest" },
  ratlos: { comp: "ratloser", sup: "ratlosest" },
  verbittert: { comp: "verbitterter", sup: "verbittertest" },
  neidisch: { comp: "neidischer", sup: "neidischst" },
  eifersüchtig: { comp: "eifersüchtiger", sup: "eifersüchtigst" },
  pessimistisch: { comp: "pessimistischer", sup: "pessimistischst" },
  hilflos: { comp: "hilfloser", sup: "hilflosest" },
};

export const EMOTIONS_NEGATIVE = {
  ...NEG_SADNESS,
  ...NEG_ANGER,
  ...NEG_FEAR,
  ...NEG_SHAME,
  ...NEG_CONFUSION,
};

export const STATES_CALM = {
  ruhig: { comp: "ruhiger", sup: "ruhigst" },
  entspannt: { comp: "entspannter", sup: "entspanntest" },
  gelassen: { comp: "gelassener", sup: "gelassenst" },
  sorglos: { comp: "sorgloser", sup: "sorglosest" },
  unbesorgt: { comp: "unbesorgter", sup: "unbesorgtest" },
  sicher: { comp: "sicherer", sup: "sicherst" },
  erleichtert: { comp: "erleichterter", sup: "erleichtertst" },
  gelöst: { comp: "gelöster", sup: "gelöstest" },
};

export const STATES_STRESS = {
  angespannt: { comp: "angespannter", sup: "angespanntest" },
  gestresst: { comp: "gestresster", sup: "gestresstest" },
  unruhig: { comp: "unruhiger", sup: "unruhigst" },
  gespannt: { comp: "gespannter", sup: "gespanntest" },
  panisch: { comp: "panischer", sup: "panischst" },
  hysterisch: { comp: "hysterischer", sup: "hysterischst" },
  gelähmt: { comp: "gelähmter", sup: "gelähmtest" },
  überfordert: { comp: "überforderter", sup: "überfordertst" },
  überreizt: { comp: "überreizter", sup: "überreiztest" },
};

export const ATTITUDE_COGNITIVE = {
  ernst: { comp: "ernster", sup: "ernstest" },
  neugierig: { comp: "neugieriger", sup: "neugierigst" },
  aufmerksam: { comp: "aufmerksamer", sup: "aufmerksamst" },
  gelangweilt: { comp: "gelangweilter", sup: "gelangweiltest" },
  skeptisch: { comp: "skeptischer", sup: "skeptischst" },
  kritisch: { comp: "kritischer", sup: "kritischst" },
  nachdenklich: { comp: "nachdenklicher", sup: "nachdenklichst" },
  verträumt: { comp: "verträumter", sup: "verträumtest" },
};

export const ATTITUDE_SOCIAL = {
  tolerant: { comp: "toleranter", sup: "tolerantest" },
  intolerant: { comp: "intoleranter", sup: "intolerantest" },
  hilfsbereit: { comp: "hilfsbereiter", sup: "hilfsbereitst" },
  arrogant: { comp: "arroganter", sup: "arrogantest" },
  respektvoll: { comp: "respektvoller", sup: "respektvollst" },
  respektlos: { comp: "respektloser", sup: "respektlosest" },
  zuverlässig: { comp: "zuverlässiger", sup: "zuverlässigst" },
  offen: { comp: "offener", sup: "offenst" },
  verschlossen: { comp: "verschlossener", sup: "verschlossenst" },
  selbstbewusst: { comp: "selbstbewusster", sup: "selbstbewusstest" },
};

export const ADJECTIVES_STATES = {
  ...STATES_PHYSICAL,
  ...EMOTIONS_POSITIVE,
  ...EMOTIONS_NEGATIVE,
  ...STATES_CALM,
  ...STATES_STRESS,
  ...ATTITUDE_COGNITIVE,
  ...ATTITUDE_SOCIAL,
};
