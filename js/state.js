// State management for the app
export const state = {
  currentFile: "",
  navigationHistory: [],
  flattenedNavigation: [],
  darkMode: localStorage.getItem("darkMode") === "true",
  fontSize: parseInt(localStorage.getItem("fontSize")) || 16,
  sidebarOpen: true,
};

export function updateFontSize() {
  document.documentElement.style.setProperty(
    "--base-font-size",
    `${state.fontSize}px`
  );
  localStorage.setItem("fontSize", state.fontSize);
}
