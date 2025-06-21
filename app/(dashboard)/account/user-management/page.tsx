import React from "react";

import DataTable from "@/components/dashboard/account/user-management/data-table";
import data from "./data.json";
import tabs from "./tabs.json";

const UserManagement = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">User Management</h1>
      <DataTable data={data} tabs={tabs} />
    </div>
  );
};

export default UserManagement;
