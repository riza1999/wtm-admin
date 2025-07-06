import TabsPageChanger from "@/components/tabs-page-changer";
import React from "react";

const tabItems = [
  {
    href: "/account/user-management/super-admin",
    label: "Super Admin",
  },
  {
    href: "/account/user-management/agent",
    label: "Agent",
  },
  {
    href: "/account/user-management/admin",
    label: "Admin",
  },
  {
    href: "/account/user-management/support",
    label: "Support",
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
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <TabsPageChanger tabItems={tabItems} defaultValue={tabItems[0].href} />

      <div className="w-full">{children}</div>
    </div>
  );
};

export default UserManagementLayout;
