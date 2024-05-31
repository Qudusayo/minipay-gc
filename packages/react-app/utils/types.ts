export interface iGiftCard {
  amount: bigint;
  isBurnt: boolean;
  isInitialized: boolean;
  isUnwrapped: boolean;
  message: string;
  mintedBy: string;
  signedBy: string;
  timestamp: bigint;
  tokenId: bigint;
}
