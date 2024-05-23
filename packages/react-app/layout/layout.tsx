import { Buildings2, LogoutCurve, MoneyRecive, MoneySend } from "iconsax-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Layout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const { push } = useRouter();

  return (
    <div className="h-dvh flex flex-col">
      <div className="border-b border-t">
        <h2 className="text-center py-4 text-fig cursor-pointer up">
          {title}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
      <div className="grid grid-cols-4 border-2 border-t">
        <Link
          href="/dashboard"
          className="flex flex-col items-center justify-center py-4 border-r text-fig"
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
          className="flex flex-col items-center justify-center py-4 border text-danger border-y-transparent"
        >
          <LogoutCurve size="24" />
          <span className="text-xs">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Layout;
