import { state } from "./state.js";
import { addSmoothScrolling } from "./utils.js";

export function loadMarkdown(file) {
  const content = document.getElementById("content");
  const breadcrumbCurrentPage = document.getElementById("current-page");

  // Show loading state
  content.innerHTML = `
    <div class="content-loader">
      <div class="skeleton-loader">
        <div class="skeleton-title"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-subtitle"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    </div>
  `;

  state.currentFile = file;
  updateActiveLink();

  fetch(file)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load document");
      }
      return response.text();
    })
    .then((text) => {
      // Apply custom renderer for enhanced markdown display
      const renderer = new marked.Renderer();

      // Enhanced heading rendering with anchor links
      renderer.heading = function (text, level) {
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
        return `
          <h${level} id="${escapedText}">
            <a class="header-anchor" href="#${escapedText}">
              <i class="fas fa-link"></i>
            </a>
            ${text}
          </h${level}>
        `;
      };

      // Enhanced code block rendering with syntax highlighting and copy button
      renderer.code = function (code, language) {
        return `
          <div class="code-block-wrapper">
            <div class="code-block-header">
              <span class="code-language">${language || "text"}</span>
              <button class="copy-code-button" onclick="navigator.clipboard.writeText(\`${code.replace(
                /`/g,
                "\\`"
              )}\`)">
                <i class="fas fa-copy"></i>
              </button>
            </div>
            <pre><code class="language-${
              language || "text"
            }">${code}</code></pre>
          </div>
        `;
      };

      // Enhanced table rendering with responsive wrapper
      renderer.table = function (header, body) {
        return `
          <div class="table-responsive">
            <table>
              <thead>${header}</thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        `;
      };

      marked.setOptions({
        renderer: renderer,
        gfm: true,
        breaks: true,
        smartLists: true,
        smartypants: true,
        sanitize: false,
        escape: true,
      });

      // Parse markdown into HTML
      const parsedContent = marked.parse(text);

      // Create a container for the content
      const contentElement = document.createElement("div");
      contentElement.className = "markdown-content";
      contentElement.innerHTML = parsedContent;

      // Create a table of contents from headings
      const toc = document.createElement("div");
      toc.className = "table-of-contents";
      toc.innerHTML = "<h3>On this page</h3><ul></ul>";

      const tocList = toc.querySelector("ul");
      const headings = contentElement.querySelectorAll("h2, h3");

      headings.forEach((heading) => {
        const id = heading.id;
        const text = heading.textContent.replace(/¶/g, "");
        const item = document.createElement("li");
        item.className = `toc-level-${heading.tagName.toLowerCase()}`;
        item.innerHTML = `<a href="#${id}">${text}</a>`;
        tocList.appendChild(item);
      });

      // Only add TOC if we have headings
      const contentWrapper = document.createElement("div");
      contentWrapper.className = "content-with-toc";

      if (headings.length > 0) {
        contentWrapper.appendChild(toc);
      }

      contentWrapper.appendChild(contentElement);

      // Clear the content area and add our new content
      content.innerHTML = "";
      content.appendChild(contentWrapper);

      // Ensure the table-of-contents element is present
      if (headings.length > 0) {
        document.querySelector(".table-of-contents").classList.remove("hidden");
      }

      // Extract title for breadcrumb
      const firstHeading = contentElement.querySelector("h1");
      if (firstHeading) {
        breadcrumbCurrentPage.textContent = firstHeading.textContent;
      } else {
        // Try to derive page name from filename
        const filename = file.split("/").pop().replace(".md", "");
        breadcrumbCurrentPage.textContent =
          filename
            .split("_")
            .slice(1)
            .join(" ")
            .replace(/\b\w/g, (c) => c.toUpperCase()) || "Documentation";
      }

      // Update navigation buttons
      updateNavigationButtons();

      // Highlight code blocks
      hljs.highlightAll();

      // Add link behavior to make navigation smoother
      addSmoothScrolling();
    })
    .catch((error) => {
      content.innerHTML = `
        <div class="error-container">
          <i class="fas fa-exclamation-triangle"></i>
          <h2>Failed to load document</h2>
          <p>${error.message}</p>
          <button onclick="loadMarkdown('docs/00_introduction.md')">
            Return to Introduction
          </button>
        </div>
      `;
    });
}

export function loadSidebar() {
  const sidebar = document.getElementById("sidebar");

  // Clear the flattened navigation
  state.flattenedNavigation = [];

  // Show loading state
  sidebar.innerHTML = `
    <div class="skeleton-loader">
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
      <div class="skeleton-item"></div>
    </div>
  `;

  fetch("docs/index.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load sidebar navigation");
      }
      return response.json();
    })
    .then((files) => {
      sidebar.innerHTML = "";
      const list = createList(files);
      sidebar.appendChild(list);

      // Update the active link after sidebar is loaded
      updateActiveLink();

      // Update navigation buttons
      updateNavigationButtons();
    })
    .catch((error) => {
      sidebar.innerHTML = `
        <div class="error-container">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load navigation</p>
        </div>
      `;
      console.error("Error loading sidebar:", error);
    });
}

export function updateActiveLink() {
  // Remove active class from all links
  document.querySelectorAll(".file-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Add active class to current file link
  const activeLink = document.querySelector(
    `.file-link[data-path="${state.currentFile}"]`
  );
  if (activeLink) {
    activeLink.classList.add("active");

    // Expand parent folders
    let parent = activeLink.closest(".folder-children");
    while (parent) {
      const folderItem = parent.closest(".nav-folder");
      if (folderItem) {
        folderItem.classList.add("expanded");
        const icon = folderItem.querySelector(".folder-icon");
        if (icon) {
          icon.classList.replace("fa-chevron-right", "fa-chevron-down");
        }
        parent = folderItem.parentElement.closest(".folder-children");
      } else {
        break;
      }
    }

    // Scroll active link into view
    activeLink.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}

export function updateNavigationButtons() {
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");

  const currentIndex = state.flattenedNavigation.findIndex(
    (item) => item.path === state.currentFile
  );

  if (currentIndex > 0) {
    const prevFile = state.flattenedNavigation[currentIndex - 1];
    prevPageButton.removeAttribute("disabled");
    prevPageButton.dataset.path = prevFile.path;
  } else {
    prevPageButton.setAttribute("disabled", "true");
    prevPageButton.dataset.path = "";
  }

  if (currentIndex < state.flattenedNavigation.length - 1) {
    const nextFile = state.flattenedNavigation[currentIndex + 1];
    nextPageButton.removeAttribute("disabled");
    nextPageButton.dataset.path = nextFile.path;
  } else {
    nextPageButton.setAttribute("disabled", "true");
    nextPageButton.dataset.path = "";
  }
}

function createFolderItem(folder, parentPath = "docs") {
  const li = document.createElement("li");
  li.className = "nav-folder";

  const folderToggle = document.createElement("button");
  folderToggle.className = "folder-toggle";
  folderToggle.innerHTML = `
    <i class="fas fa-chevron-right folder-icon"></i>
    <span class="folder-name">${folder.name}</span>
  `;

  folderToggle.addEventListener("click", () => {
    li.classList.toggle("expanded");

    const icon = folderToggle.querySelector(".folder-icon");
    if (li.classList.contains("expanded")) {
      icon.classList.replace("fa-chevron-right", "fa-chevron-down");
    } else {
      icon.classList.replace("fa-chevron-down", "fa-chevron-right");
    }
  });

  li.appendChild(folderToggle);

  // Create folder contents
  const folderPath = `${parentPath}/${folder.path}`;
  const childrenList = createList(folder.children, folderPath);
  childrenList.className = "folder-children";
  li.appendChild(childrenList);

  return li;
}

function createFileItem(file, parentPath = "docs") {
  const li = document.createElement("li");
  li.className = "nav-file";

  const filePath = `${parentPath}/${file.path}`;
  const link = document.createElement("a");
  link.href = "#";
  link.className = "file-link";
  link.dataset.path = filePath;

  // Extract and format the display name
  // Convert names like "01_getting_started.md" to "Getting Started"
  let displayName = file.name.replace(/^\d+_/, "").replace(".md", "");
  displayName = displayName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  link.innerHTML = `
    <i class="fas fa-file-alt file-icon"></i>
    <span class="file-name">${displayName}</span>
  `;

  link.addEventListener("click", (e) => {
    e.preventDefault();
    loadMarkdown(filePath);
  });

  li.appendChild(link);
  return li;
}

function createList(items, parentPath = "docs") {
  const ul = document.createElement("ul");
  ul.className = "nav-list";

  // Map for collecting the flattened navigation
  items.forEach((item) => {
    if (item.type === "file") {
      const fileItem = createFileItem(item, parentPath);
      ul.appendChild(fileItem);

      // Add to flattened navigation for prev/next navigation
      state.flattenedNavigation.push({
        path: `${parentPath}/${item.path}`,
        name: item.name,
      });
    } else if (item.type === "folder") {
      const folderItem = createFolderItem(item, parentPath);
      ul.appendChild(folderItem);
    }
  });

  return ul;
}
