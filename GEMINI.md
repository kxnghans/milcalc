# GEMINI.md

## Project Overview

This is a monorepo project managed with pnpm workspaces and Turborepo. It contains a web application and a mobile application.

*   **Web Application (`packages/web`):** A [Next.js](https://nextjs.org/) application.
*   **Mobile Application (`packages/mobile`):** A [React Native](https://reactnative.dev/) application, bootstrapped with Expo.

The project is configured with TypeScript, ESLint for linting, and Prettier for code formatting.

## Building and Running

### Installation

The project uses `pnpm` as the package manager. To install all dependencies, run the following command from the root of the project:

```bash
pnpm install
```

### Running the Applications

#### Web (Next.js)

To start the development server for the web app, run:

```bash
pnpm dev --filter=web
```

The web app will be available at `http://localhost:3000`.

#### Mobile (React Native)

To run the mobile app, you can use the scripts in `packages/mobile/package.json`.

1.  Navigate to the mobile app directory:

    ```bash
    cd packages/mobile
    ```

2.  Start the Metro bundler:

    ```bash
    pnpm start
    ```

3.  In a separate terminal, run the app on your desired platform:

    *   For Android:

        ```bash
        pnpm android
        ```

    *   For iOS:

        ```bash
        pnpm ios
        ```

### Development Scripts

The following scripts are available at the root level and can be run with `pnpm`:

*   `pnpm build`: Builds both the web and mobile applications.
*   `pnpm dev`: Starts the development servers for both applications.
*   `pnpm lint`: Lints the codebase of both applications.
*   `pnpm format`: Formats the codebase with Prettier.

## Development Conventions

*   **Package Management:** Use `pnpm` for all dependency management.
*   **Code Style:** The project uses ESLint and Prettier to enforce a consistent code style. It is recommended to set up your editor to format on save.
*   **Monorepo Management:** Turborepo is used to manage the monorepo. Use `turbo` commands for running tasks across the workspace (e.g., `turbo dev`).
