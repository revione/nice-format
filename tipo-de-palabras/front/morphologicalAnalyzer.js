import { identifyWord } from "../identifyWord.js";
import { WORD_TYPES } from "../word-types/types.js";

const MorphologicalAnalyzer = () => {
  let wordsToLearn = new Set();
  let currentActiveWord = null;

  const getTypeStyle = (typeId) => {
    const typeObj = Object.values(WORD_TYPES).find((t) => t.id === typeId);
    return typeObj || WORD_TYPES.OTHER;
  };

  const createWordKey = (word, type) => `${word}|${type}`;

  const createWordElement = (word, typeId, count = null) => {
    const typeStyle = getTypeStyle(typeId);
    const wordElement = document.createElement("div");

    const countHtml = count ? `<span class="word-count-number" style="background-color: ${typeStyle.color}">${count}</span>` : "";

    const wordEmoji = `<span style="margin-right: ${count ? "5px" : "8px"};" title="${typeStyle.label}">${typeStyle.emoji}</span>`;
    const wordText = `<span class="word-text">${wordEmoji} ${word}</span>`;
    // const learnWordType = `<span class="learn-word-type">${typeStyle.label}</span>`;
    const countHtmlDiv = count ? `<div>${countHtml}</div>` : "";

    // wordElement.innerHTML = ` ${wordText} ${learnWordType} ${countHtmlDiv}`;
    wordElement.innerHTML = ` ${wordText} ${countHtmlDiv}`;

    return wordElement;
  };

  const displayLearnWords = () => {
    const learnWordsDiv = document.getElementById("learn-words");
    const learnWordListDiv = document.getElementById("learn-word-list");
    const learnCountSpan = document.getElementById("learn-count");

    if (wordsToLearn.size === 0) {
      learnWordsDiv.style.display = "none";
      return;
    }

    learnCountSpan.textContent = `(${wordsToLearn.size} palabras)`;
    learnWordListDiv.innerHTML = "";

    const wordsArray = Array.from(wordsToLearn).sort();

    wordsArray.forEach((wordKey) => {
      const [word, type] = wordKey.split("|");
      const wordItem = createWordElement(word, type);
      wordItem.className = "learn-word-item";
      learnWordListDiv.appendChild(wordItem);
    });

    learnWordsDiv.style.display = "block";
  };

  const updateWordHighlights = () => {
    const coloredWords = document.querySelectorAll(".word-colored");
    coloredWords.forEach((span) => {
      const word = span.textContent.toLowerCase();
      const type = span.className.match(/word-(\w+)/)?.[1];
      const wordKey = createWordKey(word, type);

      span.classList.toggle("word-learning", wordsToLearn.has(wordKey));
    });
  };

  const addWordToLearn = (word, type) => {
    const wordKey = createWordKey(word, type);
    wordsToLearn.add(wordKey);
    displayLearnWords();
    updateWordHighlights();
  };

  window.removeWordToLearn = (word, type) => {
    const wordKey = createWordKey(word, type);
    wordsToLearn.delete(wordKey);
    displayLearnWords();
    updateWordHighlights();
  };

  const preprocessText = (text) => text.replace(/\r?\n/g, " ").replace(/\r/g, " ").replace(/\s+/g, " ").trim();
  const cleanWord = (word) => word.replace(/[^\p{L}\p{N}\s-]/gu, "");

  const handleKeyPress = (event) => {
    if (!currentActiveWord) return;

    const word = currentActiveWord.textContent.toLowerCase();
    const type = currentActiveWord.dataset.type || currentActiveWord.className.match(/word-(\w+)/)?.[1];

    if (!word || !type) return;

    if (event.key.toLowerCase() === "d") {
      event.preventDefault();
      addWordToLearn(word, type);
    } else if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      window.removeWordToLearn(word, type);
    }
  };

  window.updateWordCount = () => {
    const formatter = document.getElementById("formatter");
    const text = formatter.value || "";
    const wordCount = countWords(text);
    displayWordCount(wordCount, text);
  };

  const countWords = (text) => {
    if (!text.trim()) return {};

    const cleanText = preprocessText(text);
    const sentences = cleanText.split(/[.!?]+/);
    const wordCount = {};

    sentences.forEach((sentence) => {
      if (!sentence.trim()) return;

      const rawWords = sentence.trim().replace(/[–—]/g, " ").split(/\s+/);
      const wordsInASentence = rawWords.map(cleanWord).filter((w) => w.length >= 1);

      let index = 0;

      rawWords.forEach((originalWord) => {
        const word = cleanWord(originalWord);
        if (word.length >= 1) {
          const atSentenceStart = index === 0;
          const type = identifyWord(word, {
            atSentenceStart,
            wordsInASentence,
            index,
            sentence,
          }).type;

          if (!wordCount[word]) {
            wordCount[word] = { count: 0, type };
          }
          wordCount[word].count++;
          index++;
        }
      });
    });

    return wordCount;
  };

  const getActiveFilters = () => {
    const checkboxes = document.querySelectorAll('.filter-checkboxes input[type="checkbox"]:checked');
    return Array.from(checkboxes).map((cb) => cb.dataset.type);
  };

  const createColoredText = (text) => {
    const coloredTextDiv = document.getElementById("colored-text");
    const coloredContentDiv = document.getElementById("colored-content");

    if (!text.trim()) {
      coloredTextDiv.style.display = "none";
      return;
    }

    const activeFilters = getActiveFilters();
    const sentences = text.split(/([.!?]+)/);
    let coloredHTML = "";

    sentences.forEach((sentence) => {
      if (/[.!?]+/.test(sentence)) {
        coloredHTML += sentence;
        return;
      }

      const words = sentence.split(/(\s+)/);
      const wordsInASentence = words
        .filter((w) => w.trim())
        .map(cleanWord)
        .filter((w) => w.length >= 1);

      let index = 0;

      words.forEach((word) => {
        if (word.trim()) {
          const cleanedWord = cleanWord(word);
          if (cleanedWord.length >= 1) {
            const atSentenceStart = index === 0;
            const type = identifyWord(cleanedWord, {
              atSentenceStart,
              wordsInASentence,
              index,
              sentence,
            }).type;

            index++;

            const typeStyle = getTypeStyle(type);

            if (activeFilters.includes(type)) {
              coloredHTML += `<span class="word-colored word-${type}" data-tooltip="${typeStyle.label}: ${cleanedWord}" data-word="${cleanedWord}" data-type="${type}">${word}</span>`;
            } else {
              coloredHTML += word;
            }
          } else {
            coloredHTML += word;
          }
        } else {
          coloredHTML += word;
        }
      });
    });

    coloredContentDiv.innerHTML = coloredHTML;
    updateWordHighlights();
    coloredTextDiv.style.display = "block";
  };

  const updateFilterCounts = (wordCount) => {
    const typeCounts = Object.values(WORD_TYPES).reduce((acc, type) => {
      acc[type.id] = 0;
      return acc;
    }, {});

    Object.values(wordCount).forEach((data) => {
      if (typeCounts.hasOwnProperty(data.type)) {
        typeCounts[data.type]++;
      }
    });

    Object.keys(typeCounts).forEach((type) => {
      const label = document.getElementById(`label-${type}`);
      if (label) {
        const typeStyle = getTypeStyle(type);
        label.textContent = `${typeStyle.emoji} ${typeStyle.label} (${typeCounts[type]})`;
      }
    });

    const activeFilters = getActiveFilters();
    const totalFilteredUniqueWords = Object.entries(wordCount).filter(([_word, data]) => activeFilters.includes(data.type)).length;

    const statusElement = document.getElementById("filter-status");
    statusElement.textContent = `Mostrando: ${totalFilteredUniqueWords} palabras únicas (${activeFilters.length} tipos seleccionados)`;
  };

  const displayWordCount = (wordCount, text = "") => {
    const wordCountDiv = document.getElementById("word-count");
    const wordListDiv = document.getElementById("word-list");
    const totalWordsSpan = document.getElementById("total-words");

    const totalWords = Object.values(wordCount).reduce((sum, item) => sum + item.count, 0);
    const uniqueWords = Object.keys(wordCount).length;

    if (uniqueWords === 0) {
      wordCountDiv.style.display = "none";
      return;
    }

    totalWordsSpan.textContent = `${totalWords} palabras totales, ${uniqueWords} únicas`;

    updateFilterCounts(wordCount);
    createColoredText(text);

    const activeFilters = getActiveFilters();
    const sortedWords = Object.entries(wordCount)
      .filter(([_word, data]) => activeFilters.includes(data.type))
      .sort(([, a], [, b]) => b.count - a.count);

    wordListDiv.innerHTML = "";

    sortedWords.forEach(([word, data]) => {
      const wordItem = createWordElement(word, data.type, data.count);
      wordItem.className = "word-item";
      wordListDiv.appendChild(wordItem);
    });

    wordCountDiv.style.display = "block";
  };

  const setupEventListeners = () => {
    const formatter = document.getElementById("formatter");
    const coloredContentDiv = document.getElementById("colored-content");

    const textareaEvents = ["input", "keyup", "focus", "blur"];
    textareaEvents.forEach((event) => {
      formatter.addEventListener(event, window.updateWordCount);
    });

    formatter.addEventListener("paste", () => {
      setTimeout(window.updateWordCount, 100);
    });

    const filterCheckboxes = document.querySelectorAll('.filter-checkboxes input[type="checkbox"]');
    filterCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const text = formatter.value || "";
        const wordCount = countWords(text);
        displayWordCount(wordCount, text);
      });
    });

    coloredContentDiv.addEventListener(
      "mouseenter",
      (e) => {
        if (e.target.classList.contains("word-colored")) {
          currentActiveWord = e.target;
          e.target.classList.add("word-active");
        }
      },
      true
    );

    coloredContentDiv.addEventListener(
      "mouseleave",
      (e) => {
        if (e.target.classList.contains("word-colored")) {
          currentActiveWord = null;
          e.target.classList.remove("word-active");
        }
      },
      true
    );

    document.addEventListener("keydown", handleKeyPress);
  };

  setupEventListeners();
  window.updateWordCount();
};

document.addEventListener("DOMContentLoaded", MorphologicalAnalyzer);
