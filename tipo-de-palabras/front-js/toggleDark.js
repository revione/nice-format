const toggleDark = () => {
  document.addEventListener("keydown", (event) => {
    if (event.key === "1" && event.metaKey) {
      event.preventDefault();
      document.body.classList.toggle("dark");
    }
  });
};

document.addEventListener("DOMContentLoaded", toggleDark);
