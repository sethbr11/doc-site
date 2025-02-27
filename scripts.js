document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");

    // Function to fetch and display markdown content
    function loadMarkdown(file) {
        fetch(file)
            .then((response) => response.text())
            .then((text) => {
                content.innerHTML = marked.parse(text);
            });
    }

    // Function to create a link element
    function createLink(name, path) {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = name;
        link.addEventListener("click", () => loadMarkdown(path));
        return link;
    }

    // Function to create a nested list of files and folders
    function createList(items, parentPath = "docs") {
        const ul = document.createElement("ul");
        items.forEach((item) => {
            const li = document.createElement("li");
            if (item.type === "file") {
                const filePath = `${parentPath}/${item.path}`;
                li.appendChild(createLink(item.name, filePath));
            } else if (item.type === "folder") {
                li.textContent = item.name;
                const folderPath = `${parentPath}/${item.path}`;
                li.appendChild(createList(item.children, folderPath));
            }
            ul.appendChild(li);
        });
        return ul;
    }

    // Function to load sidebar links
    function loadSidebar() {
        fetch("docs/index.json")
            .then((response) => response.json())
            .then((files) => {
                const list = createList(files);
                sidebar.appendChild(list);
            });
    }

    // Load the sidebar when the document is ready
    loadSidebar();

    // Load the default markdown file
    loadMarkdown("docs/00_introduction.md");
});
