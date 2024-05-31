import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { http, WagmiProvider, createConfig } from "wagmi";
import "../styles/globals.css";
import "./../styles/swiper.css";
import { celo, celoAlfajores } from "wagmi/chains";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextUIProvider } from "@nextui-org/react";
import { Work_Sans } from "@next/font/google";
import ToasterProvider from "@/components/ToasterProvider";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [injectedWallet],
    },
  ],
  {
    appName: "Celo Composer",
    projectId: "044601f65212332475a09bc14ceb3c34",
  }
);

const config = createConfig({
  connectors,
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});

const queryClient = new QueryClient();

const work_sans = Work_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <NextUIProvider>
            <main className={work_sans.className}>
              <Component {...pageProps} />
              <ToasterProvider />
            </main>
          </NextUIProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
