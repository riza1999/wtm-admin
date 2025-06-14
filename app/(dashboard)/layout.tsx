import { HeroHeader } from "@/components/header/header";
import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden pt-19">{children}</main>
    </>
  );
};

export default DashboardLayout;
