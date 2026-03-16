<div align="center">

# AuraW

**A modern, self-custodial EVM wallet built with React Native.**

Your keys. Your crypto. No servers. No compromises.

[![License](https://img.shields.io/badge/License-Apache%202.0-white.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-black.svg)](#installation)
[![Built with Expo](https://img.shields.io/badge/Built%20with-Expo-000.svg)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-black.svg)](https://www.typescriptlang.org/)

<!-- 
  TODO: Add app screenshots here once the UI is ready
  <img src="assets/screenshots/welcome.png" width="200" />
  <img src="assets/screenshots/portfolio.png" width="200" />
  <img src="assets/screenshots/send.png" width="200" />
-->

</div>

---

## What is AuraW?

AuraW is a **self-custodial Ethereum wallet** that puts you in full control of your crypto. No accounts. No sign-ups. No servers holding your keys. Just you, your device, and the blockchain.

Built with a focus on **security** and **simplicity** — AuraW makes managing your digital assets feel as natural as using any modern app, while keeping your private keys encrypted and stored only on your device.

## Why AuraW?

Most wallets force you to choose between **security** and **usability**. AuraW gives you both.

- 🔐 **Truly self-custodial** — Your private keys never leave your device. Ever.
- 🧬 **Biometric-first** — Unlock with Face ID or fingerprint. No passwords to remember.
- 🎨 **Minimal & clean** — Monochrome glassmorphic design. No clutter, no noise.
- ⚡ **Fast** — Built with React Native and native modules. No web views.
- 🌐 **Open source** — Every line of code is auditable. Trust through transparency.

## Features

### Core
- ✅ Create a new wallet with a 12-word recovery phrase
- ✅ Import existing wallet via recovery phrase or private key
- ✅ Biometric authentication (Face ID / Fingerprint)
- ✅ PIN fallback for devices without biometric hardware
- ✅ View ETH, USDT, and USDC balances
- ✅ Live USD price conversion
- ✅ Send and receive tokens
- ✅ Transaction history
- ✅ QR code for receiving funds
- ✅ Encrypted key storage (iOS Keychain / Android Keystore)

### Security
- 🔒 Private keys encrypted at the OS level via Secure Enclave
- 🔒 Biometric required for every transaction signature
- 🔒 Auto-lock on app background
- 🔒 PIN brute-force protection (5 attempts + lockout)
- 🔒 Clipboard auto-clear after copying sensitive data
- 🔒 No analytics. No tracking. No telemetry.

### Coming Soon
- 🔜 Multi-chain support (Polygon, Arbitrum, Base)
- 🔜 Token swap integration
- 🔜 WalletConnect v2 (connect to DApps)
- 🔜 Google Drive encrypted backup
- 🔜 NFT display
- 🔜 Multiple accounts from a single seed

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Expo](https://expo.dev) + [React Native](https://reactnative.dev) |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based) |
| Language | TypeScript (strict) |
| Crypto | [ethers.js](https://docs.ethers.org/v6/) v6 |
| Key Storage | [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) (Keychain / Keystore) |
| Biometrics | [expo-local-authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/) |
| Animations | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) v4 |
| UI Effects | [expo-blur](https://docs.expo.dev/versions/latest/sdk/blur-view/) (glassmorphism) |

## Architecture

```
┌─────────────────────────────────────────┐
│              UI Layer                    │
│  Expo Router screens + Reanimated       │
├─────────────────────────────────────────┤
│           State Layer                    │
│  React Context (Wallet + Auth)          │
├─────────────────────────────────────────┤
│          Service Layer                   │
│  wallet.ts │ blockchain.ts │ auth.ts    │
├─────────────────────────────────────────┤
│          Storage Layer                   │
│  SecureStore (keys) │ AsyncStorage      │
├─────────────────────────────────────────┤
│         Network Layer                    │
│  ethers.js RPC │ CoinGecko │ Etherscan  │
└─────────────────────────────────────────┘
```

**Key principle:** Private keys exist in memory **only** during transaction signing and are cleared immediately after. All signing happens on-device. Nothing sensitive ever touches a server.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (macOS) or Android Emulator, or a physical device with [Expo Go](https://expo.dev/go)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/AuraW.git
cd AuraW

# Install dependencies
npm install

# Start the development server
npx expo start
```

Then scan the QR code with Expo Go (Android) or use the Camera app (iOS).

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Project Structure

```
AuraW/
├── app/                    # Screens (file-based routing)
│   ├── index.tsx           # Welcome screen
│   ├── lock.tsx            # Biometric lock screen
│   ├── create-wallet.tsx   # Create wallet intro
│   ├── create/             # Wallet creation flow
│   ├── import-wallet.tsx   # Import existing wallet
│   ├── send.tsx            # Send tokens
│   ├── receive.tsx         # Receive (QR + address)
│   ├── confirm-tx.tsx      # Transaction confirmation
│   └── (tabs)/             # Main app tabs
│       ├── index.tsx       # Portfolio / Dashboard
│       ├── activity.tsx    # Transaction history
│       └── settings.tsx    # Settings & security
│
├── components/             # Reusable UI components
├── services/               # Core business logic
│   ├── wallet.ts           # Key generation & derivation
│   ├── blockchain.ts       # RPC calls & transactions
│   ├── secure-storage.ts   # Encrypted key storage
│   ├── auth.ts             # Biometric & PIN auth
│   └── price.ts            # Token price fetching
│
├── context/                # React Context providers
├── utils/                  # Helpers & constants
├── types/                  # TypeScript interfaces
└── assets/                 # Images, fonts, videos
```

## Security Model

AuraW follows a **zero-trust architecture** — we assume no server, network, or third party should ever have access to your keys.

```
┌──────────────────────────────────┐
│          Your Device             │
│                                  │
│  ┌────────────────────────────┐  │
│  │   Secure Enclave / Keystore│  │
│  │   Encrypted mnemonic       │  │
│  │   (biometric-gated)        │  │
│  └────────────────────────────┘  │
│                                  │
│  App memory (runtime only)       │
│  └── Private key during signing  │
│      └── Cleared immediately     │
└──────────────────────────────────┘
         │ HTTPS only
         ▼
┌──────────────────────────────────┐
│   Public RPC nodes               │
│   Only signed transactions sent  │
│   No private keys transmitted    │
└──────────────────────────────────┘
```

### What AuraW **never** does:
- ❌ Send your private key or mnemonic to any server
- ❌ Store keys unencrypted
- ❌ Log sensitive data (even in debug mode)
- ❌ Track your activity or collect analytics
- ❌ Require an account or email

## Contributing

Contributions are welcome! Whether it's a bug fix, feature, or documentation improvement — all help is appreciated.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

Please read the codebase and follow the existing patterns (glassmorphic UI, monochrome palette, TypeScript strict mode).

### Reporting Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/YOUR_USERNAME/AuraW/issues) with as much detail as possible.

## Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| **Phase 1** | 🚧 In Progress | Core wallet — create, import, biometric lock, view balances, receive |
| **Phase 2** | ⏳ Planned | Transactions — send ETH & tokens, tx history, gas estimation |
| **Phase 3** | ⏳ Planned | Settings & polish — recovery phrase export, PIN change, auto-lock |
| **Phase 4** | 💭 Future | Multi-chain, swaps, WalletConnect, NFTs, DApp browser |

## License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this software. You must include the license and state any changes made. The license also provides an express grant of patent rights from contributors.

## Disclaimer

AuraW is a self-custodial wallet. **You are solely responsible for your private keys and recovery phrase.** If you lose your recovery phrase and your device, your funds cannot be recovered by anyone — including the developers of this app.

This software is provided as-is, without warranty. Always back up your recovery phrase in a secure location.

---

<div align="center">

**Built with ❤️ for the decentralized future.**

</div>
