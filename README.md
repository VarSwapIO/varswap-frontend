# VarSwap Frontend

VarSwap Frontend is a decentralized exchange (DEX) web application for the Vara Network, built with Next.js and React. This project allows users to swap tokens, provide liquidity, participate in farming, and view analytics, all with a modern, responsive UI.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Running the Development Server](#running-the-development-server)
    - [Building for Production](#building-for-production)
    - [Linting & Formatting](#linting--formatting)
5. [Customization](#customization)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

- **Token Swap:**  
  Swap between supported tokens instantly with real-time price calculation and slippage control.
- **Liquidity Pools:**  
  Add, remove, and manage liquidity in pools. View your share and pool statistics.
- **Farming:**  
  Stake LP tokens to earn rewards. View your staked amount, pending rewards, and claim them.
- **Leaderboard:**  
  Track top users by volume, rewards, or other metrics.
- **Analytics:**  
  View detailed stats for tokens, pools, and the overall platform, including charts and historical data.
- **Wallet Integration:**  
  Connect with Polkadot.js, Talisman, SubWallet, Enkrypt, and more. Seamless wallet connection and account management.
- **Responsive UI:**  
  Fully optimized for both desktop and mobile devices.
- **Security:**  
  No private keys are stored. All transactions are signed client-side.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), custom Satoshi font
- **State Management:** React Context, custom hooks
- **Wallet Integration:** Polkadot.js, Talisman, SubWallet, Enkrypt
- **Charting:** Custom chart components (using SVG/Canvas)
- **API:** Custom services for data fetching and interaction with Vara Network
- **TypeScript:** For type safety and better developer experience

---

## Project Structure

```
varswap-frontend/
│
├── public/                   # Static assets (images, fonts, icons)
│
├── src/
│   ├── app/                  # Next.js app directory (routing, pages)
│   ├── components/           # Reusable UI components (buttons, modals, etc.)
│   ├── containers/           # Feature modules (Swap, Farms, Pools, etc.)
│   ├── config/               # Configuration files (tokens, assets, env, wallet)
│   ├── context/              # React context providers and hooks
│   ├── helpers/              # Utility functions (formatting, calculations, etc.)
│   ├── layout/               # Layout components (Header, Footer, etc.)
│   ├── libraries/            # External libraries integration
│   ├── mockData/             # Mock data for development/testing
│   ├── services/             # API service functions
│   ├── stores/               # State management stores
│   ├── types/                # TypeScript types and interfaces
│   └── wallet-provider/      # Wallet connection logic and modals
│
├── package.json              # Project metadata and dependencies
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

### Key Files and Folders

- `src/app/`: Contains all Next.js pages and routing logic.
- `src/components/`: Contains reusable UI components (buttons, modals, tables, etc.).
- `src/containers/`: Contains feature-specific modules (Swap, Farms, Pools, etc.).
- `src/config/`: Contains configuration files for tokens, wallets, environment, etc.
- `src/context/`: Contains React context and custom hooks for state management.
- `src/helpers/`: Contains utility functions for formatting, calculations, etc.
- `src/layout/`: Contains layout components like Header, Footer, Navigation.
- `src/services/`: Contains API service functions for data fetching.
- `src/wallet-provider/`: Contains logic for wallet connection and modals.

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or above recommended)
- **Yarn** or **npm** (Yarn is preferred for consistency)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/varswap-frontend.git
   cd varswap-frontend
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```

### Environment Variables

- Create a `.env.local` file in the root directory.
- Add the required environment variables. Example:
  ```
  NEXT_PUBLIC_API_URL=https://api.varswap.com
  NEXT_PUBLIC_CHAIN_ID=...
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=...
  ```
- Refer to `src/config/env.ts` for all required variables and their usage.
- **Note:** Never commit your `.env.local` file or sensitive keys to version control.

### Running the Development Server

```bash
yarn dev
# or
npm run dev
```
- The app will be available at [http://localhost:3000](http://localhost:3000).
- Hot-reloading is enabled for rapid development.

### Building for Production

```bash
yarn build
yarn start
# or
npm run build
npm start
```
- The app will be built and served in production mode.

### Linting & Formatting

- To check for lint errors:
  ```bash
  yarn lint
  # or
  npm run lint
  ```
- To fix lint errors automatically:
  ```bash
  yarn lint --fix
  ```
- The project uses ESLint and Prettier for code quality and formatting.

---

## Customization

### Adding New Tokens

- Edit `src/config/tokens.tsx` to add or update supported tokens.
- Each token should have properties like address, symbol, decimals, logo, etc.

### Adding/Updating Wallets

- Edit `src/config/wallet.tsx` and `src/wallet-provider/` to add new wallet integrations or update existing ones.

### Styling

- Global styles are in `src/app/globals.css`.
- Tailwind configuration is in `tailwind.config.ts`.
- Custom fonts are in `public/fonts/` and referenced in CSS.

### Modifying Navigation

- Edit `src/layout/Header/` and `src/layout/navigation.tsx` to update navigation links and structure.

---

## Deployment

### Vercel

1. Push your code to GitHub.
2. Connect your repository to [Vercel](https://vercel.com/).
3. Set environment variables in the Vercel dashboard.
4. Deploy!

### Other Platforms

- The app can be deployed to any platform that supports Node.js (Netlify, AWS, DigitalOcean, etc.).
- Make sure to set all required environment variables in your deployment environment.

---

## Troubleshooting

### Common Issues

- **Wallet Not Connecting:**  
  - Ensure your browser wallet extension is installed and supports Vara Network.
  - Refresh the page after connecting your wallet.
  - Check for errors in the browser console.

- **API/Data Not Loading:**  
  - Verify your `NEXT_PUBLIC_API_URL` and other environment variables.
  - Check network tab for failed requests.

- **Build Fails:**  
  - Ensure Node.js version is compatible.
  - Delete `node_modules` and reinstall dependencies.

- **UI Issues:**  
  - Clear browser cache.
  - Ensure you are using a supported browser (latest Chrome, Firefox, Edge).

### Getting Help

- Check open and closed issues on the repository.
- Open a new issue with detailed information if your problem persists.

---

## Contributing

We welcome contributions!

1. **Fork** the repository.
2. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit** your changes:
   ```bash
   git commit -am 'Add new feature'
   ```
4. **Push** to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. **Create a Pull Request** on GitHub.

### Code Style

- Follow the existing code style and structure.
- Write clear, concise commit messages.
- Add comments and documentation where necessary.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

- For questions, suggestions, or support, please open an issue or contact the maintainers via GitHub.
