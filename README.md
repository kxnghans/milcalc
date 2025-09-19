# unpack

your travel buddy that gets it out the groupchat

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [pnpm](https://pnpm.io/)

## 🚀 Get started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Run the app**

   This will start the web and mobile apps in parallel.

   ```bash
   pnpm dev
   ```

## 👀 Viewing the apps

After running `pnpm dev`, you will see output from both the web and mobile apps.

### Web

To view the web app, open the URL provided in the terminal. It will look something like this:

```
http://localhost:3000
```

### Mobile

To view the mobile app on your device, you can use the Expo Go app.

1. **Install the Expo Go app**

   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS](https://apps.apple.com/us/app/expo-go/id982107779)

2. **Connect to the same Wi-Fi network**

   Ensure your mobile device is connected to the same Wi-Fi network as your computer.

3. **Scan the QR code**

   When you run `pnpm dev`, a QR code will be displayed in the terminal. Scan this QR code with the Expo Go app to open the app on your device.

## 📂 Project Structure

This is a monorepo with the following structure:

- `apps/web`: Next.js app
- `apps/mobile`: Expo app
- `packages/ui`: Shared UI components
- `packages/utils`: Shared utility functions
- `packages/config`: Shared configuration (e.g. ESLint, TypeScript)

## File Structure

Here is a brief overview of the project's file structure:

```
.
├── apps
│   ├── mobile
│   │   ├── app
│   │   │   ├── index.tsx
│   │   │   ├── itinerary.tsx
│   │   │   ├── onboarding.tsx
│   │   │   └── packing.tsx
│   │   ├── assets
│   │   ├── App.tsx
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web
│       ├── app
│       │   ├── page.tsx
│       │   └── styles
│       ├── public
│       ├── package.json
│       └── tsconfig.json
├── packages
│   ├── config
│   │   ├── src
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ui
│   │   ├── src
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── utils
│       ├── src
│       │   ├── api.ts
│       │   ├── date.ts
│       │   ├── index.ts
│       │   └── packing.ts
│       ├── package.json
│       └── tsconfig.json
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
└── tsconfig.json
```

- **apps/**: Contains the source code for the applications.
  - **mobile/**: The Expo mobile application.
  - **web/**: The Next.js web application.
- **packages/**: Contains the shared packages used by the applications.
  - **config/**: Shared configuration files (ESLint, TypeScript, etc.).
  - **ui/**: Shared UI components.
  - **utils/**: Shared utility functions.
- **.gitignore**: Specifies which files and directories to ignore in version control.
- **package.json**: Contains the project's dependencies and scripts.
- **pnpm-lock.yaml**: The lockfile for pnpm, ensuring consistent dependency versions.
- **pnpm-workspace.yaml**: The configuration file for the pnpm workspace.
- **README.md**: This file.
- **tsconfig.json**: The root TypeScript configuration file.