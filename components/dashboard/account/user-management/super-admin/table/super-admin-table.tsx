"use client";

import { getSuperAdminData } from "@/app/(dashboard)/account/user-management/page";
import { SuperAdmin } from "@/app/(dashboard)/account/user-management/super-admin/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableRowAction } from "@/types/data-table";
import React, { useTransition } from "react";
import CreateSuperAdminDialog from "../dialog/create-super-admin-dialog";
import { DeleteSuperAdminDialog } from "../dialog/delete-super-admin-dialog";
import EditSuperAdminDialog from "../dialog/edit-super-admin-dialog";
import { getSuperAdminTableColumns } from "./super-admin-columns";

interface SuperAdminTableProps {
  promises: Promise<[Awaited<ReturnType<typeof getSuperAdminData>>]>;
}

const SuperAdminTable = ({ promises }: SuperAdminTableProps) => {
  const [isPending, startTransition] = useTransition();
  const [{ data, pageCount }] = React.use(promises);

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<SuperAdmin> | null>(null);

  const columns = React.useMemo(
    () => getSuperAdminTableColumns({ setRowAction }),
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    startTransition,
  });

  return (
    <>
      <div className="relative">
        <DataTable table={table} isPending={isPending}>
          <DataTableToolbar table={table} isPending={isPending}>
            <CreateSuperAdminDialog />
          </DataTableToolbar>
        </DataTable>
      </div>
      {rowAction?.variant === "update" && (
        <EditSuperAdminDialog
          open={rowAction?.variant === "update"}
          onOpenChange={() => setRowAction(null)}
          superAdmin={rowAction?.row.original ?? null}
        />
      )}
      <DeleteSuperAdminDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        superAdmin={rowAction?.row.original ? [rowAction.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
};

export default SuperAdminTable;
