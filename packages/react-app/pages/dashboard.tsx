import Layout from "@/layout/layout";
import React, { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import GiftCard from "@/components/gift-card";
import { Button, Checkbox, Input, Switch, Textarea } from "@nextui-org/react";
import html2canvas from "html2canvas";
import { useFormik } from "formik";

const Dashboard = () => {
  const giftCardRef = useRef<HTMLDivElement>(null);
  const [cardIndex, setCardIndex] = useState(0);

  const giftCard = useFormik({
    initialValues: {
      recipient: "",
      amount: "",
      name: "",
      message: "",
      showWatermark: true,
    },

    onSubmit: async (values) => {
      try {
        console.log(values);
        if (giftCardRef.current) {
          const canvas = await html2canvas(giftCardRef.current, {
            backgroundColor: null,
            scale: 2,
          });
          const dataUrl = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = "gift-card.png";
          a.click();
        }
      } catch (error) {
        console.error(error);
      }
    },
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
            classNames={{
              inputWrapper: "border-fig",
              input: "text-fig",
            }}
            isClearable
            type="text"
            label="Recipient"
            variant="bordered"
            placeholder="0x00000000..."
            onClear={() => {}}
            description="The wallet of the person you are sending the gift card to."
          />
          <Input
            classNames={{
              inputWrapper: "border-fig",
              input: "text-fig",
            }}
            isClearable
            type="tel"
            label="Amount"
            variant="bordered"
            placeholder="0.00"
            defaultValue="1"
            onClear={() => {}}
            description="This is the amount that will be stored in the gift card."
          />
          <Input
            classNames={{
              inputWrapper: "border-fig",
              input: "text-fig",
            }}
            isClearable
            type="text"
            label="Name"
            variant="bordered"
            placeholder="Happy Anniversary!"
            onClear={() => {}}
            name="name"
            onChange={giftCard.handleChange}
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
            name="message"
            onChange={giftCard.handleChange}
          />
          <Checkbox
            classNames={{
              base: "flex items-start",
              label: "-top-1",
            }}
            name="additionalFee"
          >
            I agree to pay the additional fee (5% or 1 CELO whichever is lower)
          </Checkbox>
          <Button className="w-full bg-fig text-white" type="submit">
            Mint Gift Card
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default Dashboard;
