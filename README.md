# My Turborepo

This is a minimal Turborepo with a Next.js web app and a React Native mobile app.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

1.  Clone the repository.
2.  Install dependencies:

    ```bash
    npm install
    ```

### Running the applications

#### Web (Next.js)

To start the development server for the web app, run:

```bash
npm run dev -- --filter=web
```

The web app will be available at `http://localhost:3000`.

#### Mobile (React Native)

To run the mobile app, you need to have the React Native development environment set up.

1.  Navigate to the mobile app directory:

    ```bash
    cd packages/mobile
    ```

2.  Start the Metro bundler:

    ```bash
    npx react-native start
    ```

3.  In a separate terminal, run the app on your desired platform:

    -   For Android:

        ```bash
        npx react-native run-android
        ```

    -   For iOS:

        ```bash
        npx react-native run-ios
        ```
