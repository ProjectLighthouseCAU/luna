# LUNA (Lighthouse Unified Net Application)

[![Build](https://github.com/ProjectLighthouseCAU/luna/actions/workflows/build.yml/badge.svg)](https://github.com/ProjectLighthouseCAU/luna/actions/workflows/build.yml)

The unified web frontend for Project Lighthouse.

## Getting Started

To get started developing, make sure to have Node.js and npm available and install the dependencies by running

```sh
npm install
```

To run the CORS proxy against the staging API, run

```sh
npm run cors-proxy:staging
```

To start the development server, run

```sh
npm start
```

> [!TIP]
> You can override the several configuration variables by prefixing the command e.g. with
> ```sh
> PORT=...                       # The port to run the dev server on
> REACT_APP_AUTH_TYPE=...        # The authentication type
> REACT_APP_AUTH_SERVER_URL=...  # The authentication server
> REACT_APP_MODEL_SERVER_URL=... # The model server (ws:// or wss://)
> ```
>
> If you want to persist the configuration, create a `.env.local` file with your desired configuration. For more details, see [this post](https://create-react-app.dev/docs/adding-custom-environment-variables).

To build the project for deployment, run

```sh
npm run build
```

> [!IMPORTANT]
> The environment variables will be baked into the build, so make sure not to include any sensitive data.

## Editors

If you use VSCode, you may wish to install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint). Additionally, it can be very convenient to automatically format on save. To do so, add

```json
{
  "eslint.format.enable": true,
  "[typescript][typescriptreact][javascript]": {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit"
    },
    "typescript.preferences.importModuleSpecifier": "non-relative"
  }
}
```

to your user or workspace settings (under `.vscode/settings.json`).

## Debugging

To debug LUNA with VSCode and Firefox, install the [Firefox debugger extension](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug) and add the following configuration to your `.vscode/launch.json`:

```json
{
  "type": "firefox",
  "request": "attach",
  "name": "Attach Firefox",
  "webRoot": "${workspaceFolder}/src",
  "url": "http://localhost:4000"
}
```

Now go to `about:config` in Firefox and set `devtools.debugger.remote-enabled` and `devtools.chrome.enabled` to true.

> For a more extensive description of these flags, see [the extension's README](https://github.com/firefox-devtools/vscode-firefox-debug#attach).

Finally, launch Firefox with the `-start-debugger-server` argument, make sure that the dev server is running (if not, launch it with `npm start`) and start the debug session.
