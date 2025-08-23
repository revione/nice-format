window.copyFormatterText = () => {
  const formatter = document.getElementById("formatter");
  const textToCopy = formatter.value;
  navigator.clipboard.writeText(textToCopy);
};

window.adjustFormatterFontSize = () => {
  const fontSize = document.getElementById("fontSizeRange").value;
  document.getElementById("fontSizeValue").textContent = fontSize + "px";
  const formatter = document.getElementById("formatter");
  formatter.style.fontSize = fontSize + "px";

  const coloredText = document.getElementById("colored-text");
  if (coloredText) {
    coloredText.style.fontSize = fontSize + "px";
  }
};

const broadcastFilters = () => {
  const activeTypes = Array.from(document.querySelectorAll('.filter-checkboxes input[type="checkbox"]:checked')).map((cb) => cb.dataset.type);
  document.dispatchEvent(new CustomEvent("app:filters-changed", { detail: { activeTypes } }));
};

window.selectAllFilters = () => {
  const checkboxes = document.querySelectorAll('.filter-checkboxes input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });
  broadcastFilters();
};

window.clearAllFilters = () => {
  const checkboxes = document.querySelectorAll('.filter-checkboxes input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  broadcastFilters();
};
