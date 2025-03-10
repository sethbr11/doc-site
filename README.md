# Documentation Site

This project is a simple documentation site that dynamically generates an index of markdown files and displays their content. The site includes a sidebar for navigation and a main content area for displaying the markdown content. An example of this can be viewed at [docsite.brockefni.com](https://docsite.brockefni.com).

## Features

- Automatically generates an index of markdown files in the `docs` directory.
- Displays markdown content in the main content area.
- Supports nested folders and files.
- Simple and clean design with a sidebar for navigation.

## Project Structure

```
/doc-site
├── docs
│   ├── index.json
│   └── ... (your markdown files and folders)
├── css
│   └── main.css
├── js
│   ├── eventListeners.js
│   ├── main.js
│   ├── markdown.js
│   ├── state.js
│   └── utils.js
├── vendor
│   ├── markdown.js
│   └── highlight.js
├── generateIndex.js
├── index.html
├── LICENSE
└── README.md
```

## Vendors

This project uses the following third-party libraries:

- **markdown.js**: Used for parsing and rendering markdown content.
- **highlight.js**: Used for syntax highlighting of code blocks within the markdown content.

We have included these libraries in the `vendor` folder to keep the project as self-contained and self-hosted as possible, reducing dependencies on external CDNs and ensuring the site works offline.

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended) (Optional)

### Installation

Clone or fork the repository:

```sh
git clone https://github.com/sethbr11/doc-site
cd doc-site
```

### Usage

1. Generate the `index.json` file, which helps the page load the HTML files and maintains the order and look of the sidebar:

   ```sh
   node generateIndex.js
   ```

   Alternatively, you can manually define your doc structure if you are not using node.

2. Open `index.html` in your web browser to view the documentation site.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

## Planned Future Implementations

We plan to add the following features in the future:

- **On This Page**: Ability to toggle the ON THIS PAGE sidebar.
- **Edit This Page**: Ability to edit a markdown file from the site.
- **Better Breadcrumbs**: Have breadcrumbs show folders and subfolder and not just the document name.
- **Emojis**: Support for rendering emojis in markdown.
- **Footnotes**: Ability to add footnotes in markdown content.
- **Mathematical Expressions**: Support for LaTeX expressions.
- **Diagrams**: Integration with Mermaid for creating diagrams.
- **Direct Links**: Ability to create direct links to individual documentation pages.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

I acknowledge the role of GitHub Copilot and Claude.ai in assisting with the development of the site, including helping to craft the CSS styles and implement the JavaScript functions.
