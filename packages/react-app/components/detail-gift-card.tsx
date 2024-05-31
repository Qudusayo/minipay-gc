import { mgcContract } from "@/utils/constants";
import React, { useEffect, useState } from "react";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import loader from "@/assets/loader.png";
import { iGiftCard } from "@/utils/types";
import ConfettiExplosion from "react-confetti-explosion";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
} from "@nextui-org/react";
import toast from "react-hot-toast";

const GiftCard = ({
  gift,
  isReceived,
  refetch,
}: {
  gift: iGiftCard;
  isReceived?: boolean;
  refetch?: () => void;
}) => {
  const [tokenImage, setTokenImage] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { data: tokenURI, isLoading: fetchingTokenMetadata } = useReadContract({
    ...mgcContract,
    functionName: "tokenURI",
    args: [Number(gift.tokenId)],
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      console.log("confirmed");
      refetch && refetch();
      toast.custom(
        <ConfettiExplosion
          style={{
            zIndex: 100,
          }}
        />,
        { duration: 5000 }
      );
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (!fetchingTokenMetadata && tokenURI) {
      (async () => {
        let tokenUri =
          "https://ipfs.io/ipfs/" + (tokenURI as string).split("ipfs://")[1];
        const res: Promise<{ image: string }> = await (
          await fetch(tokenUri)
        ).json();
        const image =
          "https://ipfs.io/ipfs/" +
          ((await res).image as string).split("ipfs://")[1];

        const imageBlob = await fetch(image);
        const imageBase64String = await imageBlob.text();
        setTokenImage(imageBase64String);
      })();
    }
  }, [tokenURI, fetchingTokenMetadata]);

  const claimGift = async () => {
    writeContract({
      ...mgcContract,
      functionName: "unwrapGiftCard",
      args: [gift.tokenId],
    });
  };

  const giftImage = (isUnwrapped: boolean, base?: boolean) => (
    <div className="relative">
      <img
        src={!!tokenImage ? tokenImage : loader.src}
        alt="gift-card"
        className="shadow-2xl"
        onClick={base ? onOpen : undefined}
      />
      <Chip
        size="sm"
        className="absolute top-2 left-2 text-white h-5"
        color={!isUnwrapped ? "success" : "danger"}
        variant={!base ? "solid" : "dot"}
        classNames={{
          content: base ? "hidden" : "uppercase",
          dot: "!ml-0",
        }}
      >
        {base ? "" : isUnwrapped ? "Claimed" : "Unclaimed"}
      </Chip>
    </div>
  );

  return (
    <>
      {giftImage(gift.isUnwrapped, true)}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        isKeyboardDismissDisabled={true}
        classNames={{
          body: "!bg-transparent",
          base: "bg-transparent shadow-none text-white",
        }}
        closeButton={<></>}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <div>{giftImage(gift.isUnwrapped)}</div>
                <div className="grid grid-cols-2">
                  {!gift.isUnwrapped && (
                    <p>
                      <strong>Amount:</strong>
                      <span className="block truncate">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 2,
                        }).format(Number(gift.amount) / 10 ** 18)}
                      </span>
                    </p>
                  )}
                  <p>
                    <strong>Date Created:</strong>
                    <span className="block truncate">
                      {new Date(Number(gift.timestamp) * 1000).toDateString()}
                    </span>
                  </p>
                </div>
                <p>
                  <strong>Sender:</strong>
                  <span className="block truncate">{gift.mintedBy}</span>
                </p>
                <p>
                  <strong>Message:</strong>
                  <span className="block">{gift.message}</span>
                </p>
                {!gift.isUnwrapped && isReceived && (
                  <Button
                    color="success"
                    className="text-white"
                    onPress={claimGift}
                    isLoading={isPending || isConfirming}
                  >
                    Redeem
                  </Button>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default GiftCard;
