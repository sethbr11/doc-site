import { state, updateFontSize } from "./state.js";
import { loadMarkdown } from "./markdown.js";

export function initializeEventListeners() {
  const searchInput = document.getElementById("search-docs");
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebarPopout = document.getElementById("sidebar-popout");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const fontSizeIncrease = document.getElementById("font-size-increase");
  const fontSizeDecrease = document.getElementById("font-size-decrease");

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();

    if (!query) {
      // Reset search - show all items
      document.querySelectorAll(".nav-file").forEach((file) => {
        file.style.display = "";
      });
      document.querySelectorAll(".nav-folder").forEach((folder) => {
        folder.style.display = "";
      });
      return;
    }

    // Hide all folders first
    document.querySelectorAll(".nav-folder").forEach((folder) => {
      folder.style.display = "none";
    });

    // Show files that match the query and their parent folders
    document.querySelectorAll(".file-name").forEach((fileNameElement) => {
      const fileName = fileNameElement.textContent.toLowerCase();
      const fileItem = fileNameElement.closest(".nav-file");

      if (fileName.includes(query)) {
        fileItem.style.display = "";

        // Show parent folders
        let parent = fileItem.parentElement;
        while (parent) {
          if (parent.classList.contains("folder-children")) {
            const folderItem = parent.closest(".nav-folder");
            if (folderItem) {
              folderItem.style.display = "";
              folderItem.classList.add("expanded");
              const icon = folderItem.querySelector(".folder-icon");
              if (icon) {
                icon.classList.replace("fa-chevron-right", "fa-chevron-down");
              }
            }
          }
          parent = parent.parentElement;
        }
      } else {
        fileItem.style.display = "none";
      }
    });
  });

  // Navigation button events
  prevPageButton.addEventListener("click", () => {
    const prevPath = prevPageButton.dataset.path;
    if (prevPath) {
      loadMarkdown(prevPath);
    }
  });

  nextPageButton.addEventListener("click", () => {
    const nextPath = nextPageButton.dataset.path;
    if (nextPath) {
      loadMarkdown(nextPath);
    }
  });

  // Sidebar toggle event
  sidebarToggle.addEventListener("click", () => {
    document.body.classList.toggle("sidebar-collapsed");
    state.sidebarOpen = !state.sidebarOpen;
    sidebarPopout.style.display = state.sidebarOpen ? "none" : "block";
  });

  // Sidebar pop-out event
  sidebarPopout.addEventListener("click", () => {
    document.body.classList.remove("sidebar-collapsed");
    state.sidebarOpen = true;
    sidebarPopout.style.display = "none";
  });

  // Dark mode toggle
  darkModeToggle.addEventListener("click", () => {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle("dark-mode", state.darkMode);
    localStorage.setItem("darkMode", state.darkMode);

    // Update icon
    const icon = darkModeToggle.querySelector("i");
    if (state.darkMode) {
      icon.classList.replace("fa-moon", "fa-sun");
    } else {
      icon.classList.replace("fa-sun", "fa-moon");
    }
  });

  // Font size adjustment
  fontSizeIncrease.addEventListener("click", () => {
    if (state.fontSize < 24) {
      state.fontSize += 1;
      updateFontSize();
    }
  });

  fontSizeDecrease.addEventListener("click", () => {
    if (state.fontSize > 12) {
      state.fontSize -= 1;
      updateFontSize();
    }
  });

  // Initialize keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Arrow left/right for navigation
    if (e.altKey && e.key === "ArrowLeft" && !prevPageButton.disabled) {
      prevPageButton.click();
    } else if (e.altKey && e.key === "ArrowRight" && !nextPageButton.disabled) {
      nextPageButton.click();
    }

    // Toggle sidebar: Alt + B
    if (e.altKey && e.key === "b") {
      sidebarToggle.click();
    }

    // Focus search: Ctrl + K
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      searchInput.focus();
    }

    // Toggle dark mode: Alt + D
    if (e.altKey && e.key === "d") {
      darkModeToggle.click();
    }
  });
}
