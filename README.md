# MilCalc

A collection of tools for military personnel and travel enthusiasts.

## Features

- **Air Force PT Calculator**: Calculate your score for the US Air Force Physical Fitness Test.
- **Travel Buddy**: Plan your trips and get out of the group chat (formerly "unpack").

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

The PT Calculator is available at `/pt-calculator`.

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