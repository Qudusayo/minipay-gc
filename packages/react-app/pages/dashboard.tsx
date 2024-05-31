import Layout from "@/layout/layout";
import React, { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import GiftCard, { iconTypes } from "@/components/gift-card";
import { Button, Checkbox, Input, Switch, Textarea } from "@nextui-org/react";
import html2canvas from "html2canvas";
import { useFormik } from "formik";
import { cards, contractABI } from "@/utils/constants";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { uploadIpfs } from "@/utils/uploadIpfs";
import * as Yup from "yup";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { data: hash, isPending, writeContract } = useWriteContract();
  const [cardIndex, setCardIndex] = useState(0);
  const giftCardRef = useRef<HTMLDivElement>(null);

  const giftCard = useFormik({
    initialValues: {
      recipient: "",
      amount: "",
      name: "",
      message: "",
      showWatermark: true,
      additionalFee: false,
    },

    validationSchema: Yup.object({
      // Must be a valid Ethereum address
      recipient: Yup.string()
        .required("Recipient is required")
        .matches(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
      amount: Yup.number()
        .required("Amount is required")
        .min(0.1, "Amount must be at least 0.1 CELO"),

      additionalFee: Yup.boolean().oneOf([true]),
    }),

    onSubmit: async (values) => {
      try {
        if (giftCardRef.current) {
          const canvas = await html2canvas(giftCardRef.current, {
            backgroundColor: null,
            scale: 2,
          });
          const imageBase64 = canvas.toDataURL("image/png");

          let imageUploadToIPFS = uploadIpfs(imageBase64);
          toast.promise(imageUploadToIPFS, {
            loading: "Uploading image to IPFS...",
            success: "Image uploaded successfully!",
            error: "Failed to upload image to IPFS.",
          });
          let base64ImageURI = (await imageUploadToIPFS).toString();

          const msgName = values.name || iconTypes[cards[cardIndex]].name;
          const tokenMetadata = {
            name: msgName,
            description: values.message,
            image: `ipfs://${base64ImageURI}`,
          };

          let tokenMetadataUploadToIPFS = uploadIpfs(
            JSON.stringify(tokenMetadata)
          );
          toast.promise(imageUploadToIPFS, {
            loading: "Generating token metadata...",
            success: "Token metadata generated successfully!",
            error: "Error generating token metadata",
          });

          let tokenURI = `ipfs://${(
            await tokenMetadataUploadToIPFS
          ).toString()}`;

          writeContract(
            {
              abi: contractABI,
              address: process.env
                .NEXT_PUBLIC_GIFT_CARD_ADDRESS as `0x${string}`,
              functionName: "safeMint",
              args: [values.recipient, values.message, msgName, tokenURI],
              value: parseEther(values.amount.toString()),
            },
            {
              onError: (error) => toast.error(error.message.split("\n")[0]),
              onSuccess: () =>
                toast.success("Transaction submitted successfully!"),
            }
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Gift card sent successfully!");
      giftCard.resetForm();
    }
  }, [isConfirmed]);

  const formProps = (name: keyof typeof giftCard.values) => ({
    ...giftCard.getFieldProps(name),
    isInvalid: giftCard.touched[name] && !!giftCard.errors[name],
    classNames: {
      inputWrapper: "border-fig",
      input: "text-fig",
    },
    errorMessage: giftCard.errors[name],
    isClearable: true,
    onClear: () => giftCard.setFieldValue(name, ""),
    variant: "bordered" as const,
    isDisabled: isPending || isConfirming,
  });

  return (
    <Layout title="MINT A GIFTCARD">
      <form
        className="space-y-8 my-8 overflow-hidden"
        onSubmit={giftCard.handleSubmit}
      >
        <div>
          <Swiper
            effect={"cards"}
            grabCursor={true}
            modules={[EffectCards]}
            className="mySwiper"
            initialSlide={2}
            onActiveIndexChange={(swiper) => setCardIndex(swiper.activeIndex)}
          >
            {["heart", "marriage", "giftbox", "marriage", "heart"].map(
              (icon, index) => (
                <SwiperSlide key={index}>
                  <GiftCard
                    name={giftCard.values.name}
                    message={giftCard.values.message}
                    showWatermark={giftCard.values.showWatermark}
                    ref={cardIndex === index ? giftCardRef : undefined}
                    icon={icon as "heart" | "marriage" | "giftbox" | "santa"}
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
        <div className="space-y-4 w-11/12 mx-auto max-w-sm">
          <div className="flex items-center justify-between">
            <span>Show Watermark:</span>
            <Switch
              size="sm"
              classNames={{
                wrapper: "group-data-[selected]:bg-fig",
              }}
              defaultSelected
              aria-label="Show Watermark"
              onChange={(e) =>
                giftCard.setFieldValue("showWatermark", e.target.checked)
              }
            />
          </div>
          <Input
            {...formProps("recipient")}
            type="text"
            label="Recipient"
            placeholder="0x00000000..."
            description="The wallet of the person you are sending the gift card to."
          />
          <Input
            {...formProps("amount")}
            type="number"
            label="Amount"
            placeholder="0.00"
            description="This is the amount that will be stored in the gift card."
          />
          <Input
            {...formProps("name")}
            type="text"
            label="Name"
            placeholder="Happy Anniversary!"
            description="Enter a name for the gift card."
          />
          <Textarea
            classNames={{
              inputWrapper: "border-fig",
              input: "text-fig",
            }}
            label="Message"
            placeholder="Write a message..."
            variant="bordered"
            {...giftCard.getFieldProps("message")}
          />
          <Checkbox
            {...giftCard.getFieldProps("additionalFee")}
            isSelected={giftCard.values.additionalFee}
            isInvalid={
              giftCard.touched.additionalFee && !!giftCard.errors.additionalFee
            }
            classNames={{
              base: "flex items-start",
              label: "-top-1",
            }}
          >
            I agree to pay the additional fee (5% or 1 CELO whichever is lower)
          </Checkbox>
          <Button
            className="w-full bg-fig text-white"
            type="submit"
            isLoading={isPending || isConfirming}
          >
            Mint Gift Card
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default Dashboard;
