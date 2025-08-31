import TabsPageChanger from "@/components/tabs-page-changer";
import React from "react";

const tabItems = [
  {
    href: "/account/agent-overview/agent-control",
    label: "Agent Control",
  },
  {
    href: "/account/agent-overview/agent-management",
    label: "Agent Management",
  },
];

const UserManagementLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Agent Overview</h1>
      </div>

      <TabsPageChanger tabItems={tabItems} defaultValue={tabItems[0].href} />

      <div className="w-full">{children}</div>
    </div>
  );
};

export default UserManagementLayout;
