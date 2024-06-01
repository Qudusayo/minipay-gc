import { http, createConfig } from "@wagmi/core";
import { celoAlfajores, celo } from "@wagmi/core/chains";
import MGCArtifact from "@/assets/MGC.json";
import { createWalletClient, erc20Abi, custom, createPublicClient } from "viem";
import { celoAlfajores as vCeloAlfajores } from "viem/chains";

export const cards = [
  "heart",
  "marriage",
  "giftbox",
  "marriage",
  "heart",
] as const;

export const contractABI = MGCArtifact.abi;
export const MGCADDRESS = process.env
  .NEXT_PUBLIC_GIFT_CARD_ADDRESS as `0x${string}`;

export const walletClient = createWalletClient({
  chain: vCeloAlfajores,
  transport: custom(window.ethereum),
});

export const publicClient = createPublicClient({
  chain: vCeloAlfajores,
  transport: http(),
})

export const mgcContract = {
  address: MGCADDRESS,
  abi: contractABI,
} as const;

export const erc20Contract = {
  address: process.env.NEXT_PUBLIC_CUSD_CONTRACT_ADDRESS as `0x${string}`,
  abi: erc20Abi,
} as const;

export const config = createConfig({
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});
