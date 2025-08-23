import { identifier } from "../indentifier/index.js";
import { WORD_TYPES } from "../word-types/types.js";

const getTypeStyle = (id) => Object.values(WORD_TYPES).find((t) => t.id === id) || WORD_TYPES.OTHER;
const cleanWord = (w) => {
  const s = w.replace(/[^\p{L}\p{N}\s-]/gu, "");
  return s === "-" ? "" : s;
};

function analyzeText(text) {
  const parts = text.split(/(\s+|[–—])/);
  const nonSpace = parts
    .filter((p) => !/^\s+$/.test(p) && !/^[–—]$/.test(p))
    .map(cleanWord)
    .filter(Boolean);

  const segments = [];
  const counts = {};
  let i = 0,
    j = 0;

  while (i < parts.length) {
    const piece = parts[i];

    if (/^\s+$/.test(piece)) {
      segments.push({ text: piece, isSpace: true });
      i++;
      continue;
    }

    const original = piece;
    const cleaned = cleanWord(original);
    if (!cleaned) {
      segments.push({ text: original, isSpace: false });
      i++;
      continue;
    }

    const res = identifier({
      word: original,
      words: nonSpace,
      index: j,
      atSentenceStart: j === 0,
      sentence: text,
    });

    let spanInner = original;
    let advParts = 1,
      advNon = 1;

    if (res?.multiWordInfo?.isMultiWord && res.multiWordInfo.length > 1) {
      const need = res.multiWordInfo.length;
      let collected = 1,
        k = i + 1;
      while (k < parts.length && collected < need) {
        spanInner += parts[k];
        // solo contamos tokens que no sean espacio ni en/em-dash
        if (!/^\s+$/.test(parts[k]) && !/^[–—]$/.test(parts[k])) {
          collected++;
        }
        k++;
      }
      advParts = k - i;
      advNon = need;
    }

    const type = res.type || "other";
    const lemma = res?.multiWordInfo?.lemma || res?.numberInfo?.lemma || cleaned;
    const style = getTypeStyle(type);

    segments.push({
      text: spanInner,
      isSpace: false,
      type,
      tooltip: `${style.label}: ${lemma}`,
      dataWord: lemma,
    });

    counts[lemma] ??= { count: 0, type };
    counts[lemma].count++;

    i += advParts;
    j += advNon;
  }

  return { segments, counts };
}

function updateTotals(counts) {
  const totalWords = Object.values(counts).reduce((s, it) => s + it.count, 0);
  const uniqueWords = Object.keys(counts).length;
  const totalSpan = document.getElementById("total-words");
  if (totalSpan) totalSpan.textContent = `${totalWords} palabras totales, ${uniqueWords} únicas`;
}

function initAnalyzer() {
  const formatter = document.getElementById("formatter");
  const coloredBox = document.getElementById("colored-text");
  const wordCountBox = document.getElementById("word-count");

  const run = () => {
    const text = formatter.value || "";
    const empty = !text.trim();
    const { segments, counts } = empty ? { segments: [], counts: {} } : analyzeText(text);
    updateTotals(counts);

    coloredBox.style.display = empty ? "none" : "block";
    wordCountBox.style.display = empty ? "none" : "block";

    document.dispatchEvent(
      new CustomEvent("app:analysis-ready", {
        detail: { text, segments, counts, empty },
      })
    );
  };

  ["input", "keyup", "focus", "blur"].forEach((ev) => formatter.addEventListener(ev, run));
  formatter.addEventListener("paste", () => setTimeout(run, 100));

  setTimeout(run, 250);
}

document.addEventListener("DOMContentLoaded", initAnalyzer);
