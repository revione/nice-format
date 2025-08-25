import { state } from "./state.js";
import { saveData } from "./storage.js";
import { updateMainView } from "./view_main/shared.js";

export function startReview() {
  if (state.selectedWords.size === 0) {
    alert("Selecciona al menos una palabra para repasar.");
    return;
  }
  const wordsToStudy = [...state.selectedWords].map((g) => state.words[g]);
  initializeStudySession(wordsToStudy);
}

function initializeStudySession(arr) {
  state.currentStudySession = [...arr].sort(() => Math.random() - 0.5);
  state.currentCardIndex = 0;
  state.sessionStats = { practiced: 0, mastered: 0 };
  state.sessionCompletedWords.clear();

  document.getElementById("mainView").style.display = "none";
  document.getElementById("studyView").style.display = "block";

  updateSessionIndicators();
  showCurrentCard();
}

function updateSessionIndicators() {
  const container = document.getElementById("sessionIndicators");
  const practicedInThis = [...state.sessionCompletedWords].filter((g) => {
    const w = state.currentStudySession.find((x) => x.german === g);
    return w && !w.mastered;
  }).length;
  const masterCount = state.sessionStats.mastered;
  container.innerHTML = `
    ${practicedInThis > 0 ? `<div class="session-indicator practiced">✅ ${practicedInThis} Practicadas</div>` : ""}
    ${masterCount > 0 ? `<div class="session-indicator mastered">🏆 ${masterCount} Dominadas</div>` : ""}
  `;
}

function showCurrentCard() {
  if (state.currentCardIndex >= state.currentStudySession.length) return endStudySession();
  const w = state.currentStudySession[state.currentCardIndex];

  const progress = ((state.currentCardIndex + 1) / state.currentStudySession.length) * 100;
  document.getElementById("progressInfo").textContent = `Palabra ${state.currentCardIndex + 1} de ${state.currentStudySession.length}`;
  document.getElementById("progressFill").style.width = `${progress}%`;
  document.getElementById("wordGerman").textContent = w.german;

  resetCardView();
  updateCardTranslations(w);
  updateCardExamples(w);
  updateCardStatus(w);
  updateNavigationButtons();
}

function resetCardView() {
  const t = document.getElementById("cardTranslations");
  const e = document.getElementById("cardExamples");
  const revealBtn = document.getElementById("revealBtn");
  const card = document.getElementById("studyCard");

  t.classList.remove("show");
  e.classList.remove("show");
  revealBtn.classList.remove("active");
  revealBtn.innerHTML = '<span id="eyeIcon">👁️</span> Ver Traducción';
  card.classList.remove("session-completed");
}

export function revealContent() {
  const t = document.getElementById("cardTranslations");
  const e = document.getElementById("cardExamples");
  const btn = document.getElementById("revealBtn");
  const visible = t.classList.contains("show");
  t.classList.toggle("show", !visible);
  e.classList.toggle("show", !visible);
  btn.classList.toggle("active", !visible);
  btn.innerHTML = visible ? '<span id="eyeIcon">👁️</span> Ver Traducción' : '<span id="eyeIcon">👁️‍🗨️</span> Ocultar Traducción';
}

function updateCardTranslations(w) {
  const c = document.getElementById("cardTranslations");
  const chunks = [];
  if (state.studyLanguages.includes("es") && w.spanish) {
    chunks.push(`<div class="card-translation spanish">🇪🇸 ${w.spanish}</div>`);
  }
  if (state.studyLanguages.includes("en") && w.english) {
    chunks.push(`<div class="card-translation english">🇬🇧 ${w.english}</div>`);
  }
  c.innerHTML = chunks.join("");
}

function updateCardExamples(w) {
  const c = document.getElementById("cardExamples");
  if (!w.examples.length) {
    c.innerHTML = '<p style="color:#666; text-align:center; padding:20px;">No hay ejemplos disponibles</p>';
    return;
  }
  const ex = w.examples
    .map(
      (ex) => `
    <div class="card-example">
      <strong>🇩🇪:</strong> ${ex.de}<br>
      ${state.studyLanguages.includes("es") && ex.es ? `<strong>🇪🇸:</strong> ${ex.es}<br>` : ""}
      ${state.studyLanguages.includes("en") && ex.en ? `<strong>🇬🇧:</strong> ${ex.en}` : ""}
    </div>
  `
    )
    .join("");
  c.innerHTML = `<strong style="display:block; text-align:center; margin-bottom:15px; color:#4facfe;">📚 Ejemplos de uso:</strong>${ex}`;
}

export function markAsPracticed() {
  const w = state.currentStudySession[state.currentCardIndex];
  if (!state.sessionCompletedWords.has(w.german) && !w.mastered) {
    state.sessionCompletedWords.add(w.german);
    state.sessionStats.practiced++;
    w.totalPracticed = (w.totalPracticed || 0) + 1;
    w.lastStudied = new Date().toISOString();
    saveData();
    updateCardStatus(w);
    updateSessionIndicators();
  }
}

export function toggleMastery() {
  const w = state.currentStudySession[state.currentCardIndex];
  w.mastered = !w.mastered;
  if (w.mastered) {
    w.masteryDate = new Date().toISOString();
    state.sessionStats.mastered++;
    state.sessionCompletedWords.add(w.german);
  } else {
    w.masteryDate = null;
    if (state.sessionStats.mastered > 0) state.sessionStats.mastered--;
  }
  saveData();
  updateCardStatus(w);
  updateSessionIndicators();
}

export function previousCard() {
  if (state.currentCardIndex > 0) {
    state.currentCardIndex--;
    showCurrentCard();
  }
}
export function nextCard() {
  if (state.currentCardIndex < state.currentStudySession.length - 1) {
    state.currentCardIndex++;
    showCurrentCard();
  }
}

function updateNavigationButtons() {
  document.getElementById("prevBtn").disabled = state.currentCardIndex === 0;
  document.getElementById("nextBtn").disabled = state.currentStudySession.length - 1 === state.currentCardIndex;
}

function updateCardStatus(w) {
  const content = document.querySelector(".card-content");
  const card = document.getElementById("studyCard");
  const practiceBtn = document.getElementById("practiceBtn");
  const masterBtn = document.getElementById("masterBtn");

  // limpiar indicadores previos
  content.querySelectorAll(".practiced-indicator, .mastered-indicator").forEach((n) => n.remove());

  card.classList.toggle("session-completed", state.sessionCompletedWords.has(w.german));

  if (state.sessionCompletedWords.has(w.german) && !w.mastered) {
    const ind = document.createElement("div");
    ind.className = "practiced-indicator";
    ind.textContent = "✅ Practicada en esta sesión";
    content.appendChild(ind);
    practiceBtn.classList.add("practiced");
    practiceBtn.innerHTML = "✅ Ya Practicada";
  } else if (!w.mastered) {
    practiceBtn.classList.remove("practiced");
    practiceBtn.innerHTML = "✅ Practicado";
  }

  if (w.mastered) {
    const ind = document.createElement("div");
    ind.className = "mastered-indicator";
    ind.textContent = "🏆 Palabra Dominada - Ya no necesita práctica regular";
    content.appendChild(ind);
    practiceBtn.style.display = "none";
    masterBtn.classList.add("mastered");
    masterBtn.innerHTML = "↩️ Reactivar";
  } else {
    practiceBtn.style.display = "inline-flex";
    masterBtn.classList.remove("mastered");
    masterBtn.innerHTML = "🏆 Dominar";
  }
}

function endStudySession() {
  document.getElementById("studyCard").style.display = "none";
  document.getElementById("sessionComplete").style.display = "block";

  const totalWords = state.currentStudySession.length;
  const p = state.sessionStats.practiced;
  const m = state.sessionStats.mastered;
  const completed = p + m;
  const rate = Math.round((completed / totalWords) * 100);

  document.getElementById("sessionResults").innerHTML = `
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:20px; margin:30px 0;">
      <div class="stat-item"><div class="stat-number" style="color:#4facfe;">${totalWords}</div><div class="stat-label">📚 Palabras Revisadas</div></div>
      <div class="stat-item"><div class="stat-number" style="color:#00b894;">${p}</div><div class="stat-label">✅ Practicadas</div></div>
      <div class="stat-item"><div class="stat-number" style="color:#10b981;">${m}</div><div class="stat-label">🏆 Dominadas</div></div>
      <div class="stat-item"><div class="stat-number" style="color:#fdcb6e;">${rate}%</div><div class="stat-label">🎯 Progreso</div></div>
    </div>
    <div style="margin:20px 0; padding:20px; background:#f8f9fa; border-radius:15px; line-height:1.6;">
      <h3 style="color:#4facfe; margin-bottom:15px;">📊 Resumen de la Sesión:</h3>
      <p><strong>✅ Palabras practicadas:</strong> ${p}</p>
      <p><strong>🏆 Palabras dominadas:</strong> ${m}</p>
      <p><strong>📈 Progreso total:</strong> ${completed} de ${totalWords} (${rate}%)</p>
      <div style="padding:15px; background:${rate === 100 ? "#ecfdf5" : "#fef7ff"}; border-radius:10px; border-left:4px solid ${rate === 100 ? "#10b981" : "#8b5cf6"};">
        ${rate === 100 ? "🎉 ¡Sesión perfecta! Has completado todas las palabras." : `💪 ¡Buen trabajo! Continúa con las ${totalWords - completed} restantes.`}
      </div>
    </div>
  `;
}

export function endReview() {
  document.getElementById("studyView").style.display = "none";
  document.getElementById("mainView").style.display = "block";
  document.getElementById("sessionComplete").style.display = "none";
  document.getElementById("studyCard").style.display = "block";
  updateMainView();
}
