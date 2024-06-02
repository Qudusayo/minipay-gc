import Layout from "@/layout/layout";
import React, { useEffect, useState } from "react";
import { useReadContract, useAccount } from "wagmi";
import { config, mgcContract } from "@/utils/constants";
import { readContract } from "@wagmi/core";
import { Spinner } from "@nextui-org/react";
import GiftCard from "@/components/detail-gift-card";
import { iGiftCard } from "@/utils/types";

const Sent = () => {
  const { address } = useAccount();
  const [sentGifts, setSentGifts] = useState<iGiftCard[]>([]);
  const { data: balance, isLoading: fetchingGiftCardUnits } = useReadContract({
    ...mgcContract,
    functionName: "lengthOfSentGiftCards",
    account: address,
  });

  useEffect(() => {
    (async () => {
      const gifts = await Promise.all<iGiftCard>(
        Array(Number(balance) || 0)
          .fill(0)
          .map(async (_, i) => {
            let sentGifts = await readContract(config, {
              ...mgcContract,
              functionName: "getSentGiftCardByIndex",
              account: address,
              args: [i],
            });
            return sentGifts as iGiftCard;
          })
      );
      setSentGifts(gifts);
    })();
  }, [balance, address]);

  return (
    <Layout title="GIFTS YOU SENT">
      {fetchingGiftCardUnits ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          <Spinner
            label="Fetching your sent gifts..."
            classNames={{
              label: "text-fig",
              circle2: "border-fig",
              circle1: "border-b-fig",
            }}
          />
        </div>
      ) : sentGifts.length ? (
        <div className="grid grid-cols-2 gap-4 p-4">
          {sentGifts.map((sentGift, index) => (
            <GiftCard key={index} gift={sentGift} />
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <span className="text-fig text-center max-w-xs text-balance">
            You haven&apos;t sent any gifts yet. Send a gift to someone special!
          </span>
        </div>
      )}
    </Layout>
  );
};

export default Sent;
