import { http, createConfig } from "@wagmi/core";
import { celoAlfajores, celo } from "@wagmi/core/chains";
import MGCArtifact from "@/assets/MGC.json";

export const cards = [
  "heart",
  "marriage",
  "giftbox",
  "marriage",
  "heart",
] as const;

export const contractABI = MGCArtifact.abi;

export const mgcContract = {
  address: process.env.NEXT_PUBLIC_GIFT_CARD_ADDRESS as `0x${string}`,
  abi: contractABI,
} as const;

export const config = createConfig({
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
  },
});
