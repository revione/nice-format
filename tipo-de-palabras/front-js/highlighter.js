const render = (container, segments, activeTypes) => {
  let html = "";
  for (const seg of segments) {
    if (seg.isSpace) {
      html += seg.text.replace(/\n/g, "<br>");
      continue;
    }

    if (seg.text === "—" || seg.text === "–") {
      html += "&#8201;" + seg.text + "&#8201;";
      continue;
    }

    if (!activeTypes.includes(seg.type)) {
      html += seg.text;
      continue;
    }
    html += `<span class="word-colored word-${seg.type}" data-tooltip="${seg.tooltip}" data-word="${seg.dataWord}" data-type="${seg.type}">${seg.text}</span>`;
  }
  container.innerHTML = html;
};

const initHighlighter = () => {
  const coloredBox = document.getElementById("colored-text");
  const content = document.getElementById("colored-content");

  let lastSegments = [];
  let activeTypes = [];

  const doRender = () => {
    render(content, lastSegments, activeTypes);
    content.onmouseover = (e) => {
      if (e.target.classList.contains("word-colored")) {
        content.querySelectorAll(".word-active").forEach((n) => n.classList.remove("word-active"));
        e.target.classList.add("word-active");
      }
    };
    content.onmouseleave = () => {
      content.querySelectorAll(".word-active").forEach((n) => n.classList.remove("word-active"));
    };
    document.dispatchEvent(new CustomEvent("app:highlight-rendered"));
  };

  document.addEventListener("app:analysis-ready", (e) => {
    lastSegments = e.detail.segments || [];
    if (activeTypes.length) doRender();
  });

  document.addEventListener("app:filters-changed", (e) => {
    activeTypes = e.detail.activeTypes || [];
    doRender();
  });

  coloredBox.style.display = "block";
};

document.addEventListener("DOMContentLoaded", initHighlighter);
