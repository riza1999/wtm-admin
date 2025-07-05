import TabsPageChanger from "@/components/tabs-page-changer";
import React from "react";

const tabItems = [
  {
    href: "/booking-management/booking-summary",
    label: "Booking Summary",
  },
  {
    href: "/booking-management/history-booking-log",
    label: "History Booking Log",
  },
];

const BookingManagementLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Booking Management</h1>
      </div>

      <TabsPageChanger
        tabItems={tabItems}
        defaultValue="/booking-management/booking-summary"
      />

      <div className="w-full">{children}</div>
    </div>
  );
};

export default BookingManagementLayout;
