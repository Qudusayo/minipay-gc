import Layout from "@/layout/layout";
import React, { useEffect, useState } from "react";
import { useReadContract, useAccount } from "wagmi";
import { config, mgcContract } from "@/utils/constants";
import { readContract } from "@wagmi/core";
import { Spinner } from "@nextui-org/react";
import GiftCard from "@/components/detail-gift-card";
import { iGiftCard } from "@/utils/types";

const Received = () => {
  const { address } = useAccount();
  const [receivedGifts, setReceivedGifts] = useState<iGiftCard[]>([]);
  const { data: balance, isLoading: fetchingGifts } = useReadContract({
    ...mgcContract,
    functionName: "balanceOf",
    args: [address],
  });

  const refetch = async () => {
    console.log("Refetching received gifts");
    const gifts = await Promise.all<iGiftCard>(
      Array(Number(balance) || 0)
        .fill(0)
        .map(async (_, i) => {
          let sentGifts = await readContract(config, {
            ...mgcContract,
            functionName: "getGiftCardByIndex",
            account: address,
            args: [i],
          });
          return sentGifts as iGiftCard;
        })
    );
    setReceivedGifts(gifts);
  };

  useEffect(() => {
    refetch();
  }, [balance, address]);

  return (
    <Layout title="MY GIFTS">
      {fetchingGifts ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          <Spinner
            label="Fetching your gifts..."
            classNames={{
              label: "text-fig",
              circle2: "border-fig",
              circle1: "border-b-fig",
            }}
          />
        </div>
      ) : !!receivedGifts.length ? (
        <div className="grid grid-cols-2 gap-4 p-4">
          {receivedGifts.map((receivedGift) => (
            <GiftCard
              key={receivedGift.timestamp}
              gift={receivedGift}
              isReceived
              refetch={refetch}
            />
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <span className="text-fig text-center max-w-xs text-balance">
            You have not received any gifts yet.
          </span>
        </div>
      )}
    </Layout>
  );
};

export default Received;
