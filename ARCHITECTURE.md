# Architecture

This document contains a high-level overview of the Lighthouse frontend's, i.e. LUNA's, architecture and code structure. Thus the document may be especially of interest to new contributors or anyone else who's curious about the implementation.

## Tech Stack

Conceptually LUNA is a [single-page application](https://en.m.wikipedia.org/wiki/Single-page_application) that uses the component-based [React](https://react.dev) and [HeroUI (formely NextUI)](https://www.heroui.com) frameworks to for its UI. Routing is managed client-side using [react-router](https://reactrouter.com).

LUNA is packaged as a [Create React App](https://create-react-app.dev/docs/getting-started/) application that uses [Craco](https://craco.js.org) to customize the [Webpack](https://webpack.js.org) configuration. [ESLint](https://eslint.org) and [Prettier](https://prettier.io) are used as linters to enforce a consistent code style.

Finally, LUNA is deployed using a [containerized](https://www.docker.com) [Nginx](https://nginx.org) instance that effectively just serves up the Webpack-bundled/built LUNA as a [static page](https://en.m.wikipedia.org/wiki/Static_web_page).

## Code Structure

The top-level [`App.tsx`](https://github.com/ProjectLighthouseCAU/luna/blob/main/src/App.tsx) hosts the root component for the app. This mainly wraps a number of [context](https://react.dev/learn/passing-data-deeply-with-context) providers for all state that is managed globally (e.g. the color scheme, auth/model server clients, persisted UI state like user pins etc.). Peeling away these wrappers, we get the "actual" root component, namely `<RouterProvider>`. This presents a view based on the path in the URL. These views are called "screens" in our terminology and are discussed in detail below.

## Folder Structure

The basic folder structure is based on the ["grouping by file type"](https://legacy.reactjs.org/docs/faq-structure.html#grouping-by-file-type) convention and contains the following top-level folders:

| Name | Description |
| ---- | ----------- |
| `/components` | Reusable, isolated components that usually don't depend on contexts or similar |
| `/constants` | Enums and other constants that are used globally |
| `/contexts` | Custom [React contexts](https://react.dev/learn/passing-data-deeply-with-context) for global state. Examples include `AuthContext` and `ModelContext`, which manage connections to the auth API and the model server, respectively. UI state (e.g. the color scheme, user pins etc.) is also managed through a context, usually either because it is persisted to the user's [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) (e.g. user pins) or because it's global (e.g. display search). |
| `/hooks` | Custom [React hooks](https://react.dev/reference/react/hooks), i.e. simple functions that abstract over other hooks. These are used for a wide variety of things that _refer_ to something stateful (anything that can be expressed in terms of the built-in hooks like `useState`, `useContext`, ...). Convenient examples include `useStream`, which automatically creates/manages a stream to some model server resource. |
| `/modals` | Modal components (i.e. popups) |
| `/routes` | Constants declaring the route tree with its components. Add new routes here. |
| `/screens` | Screen components, i.e. generally non-reusable top-level views |
| `/utils` | Reusable utility functionality that generally doesn't depend on React |
