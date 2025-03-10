const fs = require("fs");
const path = require("path");

// Define the directory containing the documentation files
const docsDir = path.join(__dirname, "docs");
// Define the output file path for the generated index
const outputFilePath = path.join(docsDir, "index.json");

// Function to standardize file and folder names
function standardizeName(name) {
    return name
        .replace(/^\d+_/, "") // Remove numeric prefix
        .replace(/([A-Z])/g, " $1") // Add space before uppercase letters
        .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
        .trim();
}

// Function to extract numeric order from file and folder names
function extractOrder(name) {
    const match = name.match(/^(\d+)_/);
    return match ? parseInt(match[1], 10) : Infinity; // Default to Infinity if no number
}

// Function to generate the index recursively
function generateIndex(dir, relativePath = "") {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    // Sort items by order and then alphabetically
    const sortedItems = items
        .map((item) => {
            const itemPath = path.join(dir, item.name);
            const itemRelativePath = path.join(relativePath, item.name);
            return {
                item,
                itemPath,
                itemRelativePath,
                order: extractOrder(item.name),
                displayName: standardizeName(item.name.replace(".md", "")),
            };
        })
        .sort((a, b) => {
            // Sort by numeric prefix first
            if (a.order !== b.order) return a.order - b.order;
            // Then sort alphabetically
            return a.displayName.localeCompare(b.displayName);
        });

    return sortedItems
        .map(({ item, itemPath, itemRelativePath, displayName }) => {
            if (item.isDirectory()) {
                return {
                    name: displayName,
                    path: itemRelativePath,
                    type: "folder",
                    children: generateIndex(itemPath, ""),
                };
            } else if (item.isFile() && item.name.endsWith(".md")) {
                return {
                    name: displayName,
                    path: item.name,
                    type: "file",
                };
            }
        })
        .filter(Boolean);
}

// Generate the index and write it to the output file
const index = generateIndex(docsDir);
fs.writeFileSync(outputFilePath, JSON.stringify(index, null, 2));
console.log("index.json has been generated.");
