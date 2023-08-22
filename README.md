# LUNA (Lighthouse Unified Net Application)

[![Build](https://github.com/ProjectLighthouseCAU/luna/actions/workflows/build.yml/badge.svg)](https://github.com/ProjectLighthouseCAU/luna/actions/workflows/build.yml)

The unified web frontend for Project Lighthouse.

## Getting Started

To get started developing, make sure to have Node.js and npm available and install the dependencies by running

```sh
npm install
```

To run the CORS proxy against the legacy frontend, run

```sh
npm run cors-proxy
```

To start the development server, run

```sh
npm start
```

To build the project for deployment, run

```sh
npm run build
```

## Editors

If you use VSCode, you may wish to install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint). Additionally, it can be very convenient to automatically format on save. To do so, add

```json
{
  "[typescript][typescriptreact][javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true,
    "typescript.preferences.importModuleSpecifier": "non-relative"
  }
}
```

to your user or workspace settings (under `.vscode/settings.json`).
