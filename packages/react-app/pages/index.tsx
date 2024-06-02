import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import GiftCard from "@/components/gift-card";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useConnect, useAccount } from "wagmi";
import { injected } from "wagmi/connectors";

export default function Home() {
  const { push } = useRouter();
  const { connect } = useConnect();
  const { isConnected } = useAccount();

  const login = async () => {
    if (isConnected) {
      push("/dashboard");
    } else {
      connect(
        { connector: injected() },
        { onSuccess: () => push("/dashboard") }
      );
    }
  };

  return (
    <div className="h-dvh w-screen max-w-md mx-auto border-x">
      <h1 className="text-2xl font-normal text-balance text-center text-gray-800 pt-10">
        Send tokens to your <pre className="inline text-red-600">l❤️ved</pre> ones as{" "}
        <span className=" text-red-600">NFT Gift Cards</span>
      </h1>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards]}
          className="mySwiper"
          initialSlide={2}
        >
          {["heart", "marriage", "giftbox", "marriage", "heart"].map(
            (icon, index) => (
              <SwiperSlide key={index}>
                <GiftCard
                  icon={icon as "heart" | "marriage" | "giftbox" | "santa"}
                />
              </SwiperSlide>
            )
          )}
        </Swiper>
      </div>
      <div>
        <Button
          variant="solid"
          className="absolute bg-fig text-white bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[300px]"
          onClick={login}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
