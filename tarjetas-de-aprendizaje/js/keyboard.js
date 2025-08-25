import { revealContent, previousCard, nextCard, markAsPracticed, toggleMastery, endReview } from "./view_study.js";

export function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (event) => {
    if (document.getElementById("studyView").style.display === "none") return;
    switch (event.key) {
      case "ArrowLeft":
      case "a":
      case "A":
        event.preventDefault();
        previousCard();
        break;
      case "ArrowRight":
      case "d":
      case "D":
        event.preventDefault();
        nextCard();
        break;
      case " ":
      case "r":
      case "R":
        event.preventDefault();
        revealContent();
        break;
      case "Enter":
      case "p":
      case "P":
        event.preventDefault();
        markAsPracticed();
        break;
      case "m":
      case "M":
        event.preventDefault();
        toggleMastery();
        break;
      case "Escape":
        event.preventDefault();
        endReview();
        break;
      // ayuda 'h' si quieres
    }
  });
}
