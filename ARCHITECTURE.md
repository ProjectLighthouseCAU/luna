# Architecture

## Stack

LUNA is a [Create React App](https://create-react-app.dev/docs/getting-started/) application, which uses [Craco](https://craco.js.org) to customize the [Webpack](https://webpack.js.org) configuration. [ESLint](https://eslint.org) and [Prettier](https://prettier.io) are used as linters to enforce a consistent code style.

## High-Level Overview

The top-level [`App.tsx`](https://github.com/ProjectLighthouseCAU/luna/blob/main/src/App.tsx) hosts the root component for the app. This mainly wraps a number of [context](https://react.dev/learn/passing-data-deeply-with-context) providers for all state that is managed globally (e.g. the color scheme, auth/model server connections, persisted UI state like user pins etc.). Peeling away these wrappers, we get the "actual" root component, namely `<RouterProvider>`.

## File Structure

The file structure is based on the ["grouping by file type"](https://legacy.reactjs.org/docs/faq-structure.html#grouping-by-file-type) convention.

<!-- TODO: Detailed discussion of folders -->

