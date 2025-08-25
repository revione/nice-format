import { state } from "./state.js";

export function applyFilters() {
  const statusFilter = document.getElementById("statusFilter")?.value || "all";
  const sortBy = document.getElementById("sortBy")?.value || "german";
  const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
  const contextFilter = document.getElementById("contextFilter")?.value || "all";

  state.filteredWords = Object.values(state.words).filter((word) => {
    let statusMatch = true;
    switch (statusFilter) {
      case "practiced":
        statusMatch = (word.totalPracticed || 0) > 0;
        break;
      case "unpracticed":
        statusMatch = (word.totalPracticed || 0) === 0;
        break;
      case "mastered":
        statusMatch = word.mastered === true;
        break;
      case "not-mastered":
      case "active":
        statusMatch = !word.mastered;
        break;
    }
    const searchMatch = !searchTerm || word.german.toLowerCase().includes(searchTerm) || word.spanish.toLowerCase().includes(searchTerm) || word.english.toLowerCase().includes(searchTerm);
    const contextMatch = contextFilter === "all" || word.contextId === contextFilter;
    return statusMatch && searchMatch && contextMatch;
  });

  state.filteredWords.sort((a, b) => {
    switch (sortBy) {
      case "german":
        return a.german.localeCompare(b.german);
      case "german-desc":
        return b.german.localeCompare(a.german);
      case "dateCreated":
        return new Date(b.dateCreated) - new Date(a.dateCreated);
      case "dateCreated-asc":
        return new Date(a.dateCreated) - new Date(b.dateCreated);
      case "lastStudied":
        if (!a.lastStudied && !b.lastStudied) return 0;
        if (!a.lastStudied) return 1;
        if (!b.lastStudied) return -1;
        return new Date(b.lastStudied) - new Date(a.lastStudied);
      case "lastStudied-asc":
        if (!a.lastStudied && !b.lastStudied) return 0;
        if (!a.lastStudied) return -1;
        if (!b.lastStudied) return 1;
        return new Date(a.lastStudied) - new Date(b.lastStudied);
      case "totalPracticed":
        return (b.totalPracticed || 0) - (a.totalPracticed || 0);
      case "totalPracticed-asc":
        return (a.totalPracticed || 0) - (b.totalPracticed || 0);
      default:
        return 0;
    }
  });
}
