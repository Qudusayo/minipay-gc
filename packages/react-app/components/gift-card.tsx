import giftbox from "assets/giftbox.png";
import santa from "assets/santa.png";
import heart from "assets/heart.png";
import marriage from "assets/marriage.png";
import { forwardRef } from "react";

const iconTypes = {
  giftbox: {
    icon: giftbox.src,
    color: "#1E002B",
    name: "HAPPY BIRTHDAY",
  },
  heart: {
    icon: heart.src,
    color: "#000000",
    name: "I LOVE YOU",
  },
  marriage: {
    icon: marriage.src,
    color: "#476520",
    name: "HAPPY MARRIED LIFE",
  },
  santa: {
    icon: santa.src,
    color: "#116cc1",
    name: "MERRY CHRISTMAS",
  },
};

export default forwardRef(function GiftCard(
  props: {
    icon: "giftbox" | "heart" | "marriage" | "santa";
    name?: string;
    message?: string;
    showWatermark?: boolean;
  },
  ref
) {
  const { name, message, showWatermark, icon } = props;

  return (
    <div
      className="h-[320px] w-[240px] p-4 relative rounded-md"
      style={{ backgroundColor: iconTypes[icon].color }}
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      <img
        src={iconTypes[icon].icon}
        alt="icon"
        className="w-32 h-32 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
      <div className="text-center">
        {showWatermark && (
          <h1 className="text-2xl font-normal text-white">{"MGC"}</h1>
        )}
        <p className="text-xs font-light text-white absolute bottom-11 left-1/2 -translate-x-1/2 w-full">
          {name ? name : iconTypes[icon].name}
        </p>
        <div className="text-[10px] absolute bottom-7 left-1/2 text-gray-300 -translate-x-1/2 w-11/12 font-light overflow-hidden truncate py-1">
          {message && message}
        </div>
        <p className="text-[8px] text-gray-400 font-light absolute bottom-5 left-1/2 -translate-x-1/2">
          0x874945fB93B64E670E1db7e159fB7f85b065871b
        </p>
      </div>
    </div>
  );
});
