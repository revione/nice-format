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

window.selectAllFilters = () => {
  const checkboxes = document.querySelectorAll('.filter-checkboxes input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });

  if (window.updateWordCount) {
    window.updateWordCount();
  }
};

window.clearAllFilters = () => {
  const checkboxes = document.querySelectorAll('.filter-checkboxes input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  if (window.updateWordCount) {
    window.updateWordCount();
  }
};

window.removeWordToLearn = (word, type) => {
  console.log("removeWordToLearn not yet initialized");
};
