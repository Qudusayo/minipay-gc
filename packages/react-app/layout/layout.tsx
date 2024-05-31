import React, { useEffect, useState } from "react";
import Blockies from "react-blockies";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { Buildings2, LogoutCurve, MoneyRecive, MoneySend } from "iconsax-react";
import clsx from "clsx";

const shortenAddress = (address: string) =>
  `${address.slice(0, 2)}...${address.slice(-4)}`;

const Layout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const { route } = useRouter();
  const [userAddress, setUserAddress] = useState("");
  const { address } = useAccount();

  useEffect(() => {
    setUserAddress(address || "");
  }, [address]);

  return (
    <div className="h-dvh flex flex-col max-w-md mx-auto border">
      <div className="border-b border-t flex items-center justify-between px-4">
        <h2 className="text-center py-4 text-fig cursor-pointer up">{title}</h2>
        <div className="flex items-center cursor-pointer gap-2">
          <div className="flex flex-col items-center">
            <span>
              {userAddress ? shortenAddress(userAddress) : "Connect Wallet"}
            </span>
            <span className="text-xs text-forest">Connected</span>
          </div>
          <Blockies
            seed="BWC"
            size={10}
            scale={3}
            color="#E7E3D4"
            bgColor="#476520"
            spotColor="#E7E3D4"
            className="rounded-full"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
      <div className="grid grid-cols-4 border-t relative">
        <div
          className={clsx(
            "w-1/4 h-1 transition ease-linear bg-fig absolute -top-[0.5px] duration-300",
            route === "/dashboard" && "left-0",
            route === "/sent" && "left-1/4",
            route === "/received" && "left-2/4"
          )}
        ></div>
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center py-4 text-fig"
        >
          <Buildings2 size="24" />
          <span className="text-xs">Mint</span>
        </Link>
        <Link
          href="/sent"
          className="flex flex-col items-center justify-center py-4 border text-fig border-y-transparent"
        >
          <MoneySend size="24" />
          <span className="text-xs">Sent</span>
        </Link>
        <Link
          href="/received"
          className="flex flex-col items-center justify-center py-4 text-fig"
        >
          <MoneyRecive size="24" />
          <span className="text-xs">Received</span>
        </Link>
        <Link
          href={"/"}
          className="flex flex-col items-center justify-center py-4 border border-r-transparent text-danger border-y-transparent"
        >
          <LogoutCurve size="24" />
          <span className="text-xs">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Layout;
