import { state } from "./state.js";
import { initializeEventListeners } from "./eventListeners.js";
import { loadMarkdown, loadSidebar } from "./markdown.js";

document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  // Initialize dark mode
  if (state.darkMode) {
    document.body.classList.add("dark-mode");
    darkModeToggle.querySelector("i").classList.replace("fa-moon", "fa-sun");
  }

  // Initialize font size
  document.documentElement.style.setProperty(
    "--base-font-size",
    `${state.fontSize}px`
  );

  // Initialize event listeners
  initializeEventListeners();

  // Load the sidebar when the document is ready
  loadSidebar();

  // Load the default markdown file
  loadMarkdown("docs/00_introduction.md");
});
