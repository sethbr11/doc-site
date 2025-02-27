# Documentation Site

This project is a simple documentation site that dynamically generates an index of markdown files and displays their content. The site includes a sidebar for navigation and a main content area for displaying the markdown content.

## Features

- Automatically generates an index of markdown files in the `docs` directory.
- Displays markdown content in the main content area.
- Supports nested folders and files.
- Simple and clean design with a sidebar for navigation.

## Project Structure

```
/Users/sethbrock/Workspace/plunj-docs-2
├── docs
│   └── ... (your markdown files and folders)
├── .github
│   └── workflows
│       └── generate-index.yaml
├── generateIndex.js
├── index.html
├── scripts.js
├── styles.css
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)

### Installation

Clone the repository:

   ```sh
   git clone https://github.com/yourusername/plunj-docs-2.git
   cd plunj-docs-2
   ```

### Usage

1. Generate the `index.json` file:

   ```sh
   node generateIndex.js
   ```

2. Open `index.html` in your web browser to view the documentation site.

### GitHub Actions

This project includes a GitHub Actions workflow that automatically generates the `index.json` file on every push to the `main` branch.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
