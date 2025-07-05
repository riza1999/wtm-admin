"use client";

import {
  getCompanyOptions,
  getData,
} from "@/app/(dashboard)/booking-management/page";
import { BookingManagement } from "@/app/(dashboard)/booking-management/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableRowAction } from "@/types/data-table";
import React, { useTransition } from "react";
import CreateBookingManagementDialog from "../dialog/create-booking-management-dialog";
import { DeleteBookingManagementDialog } from "../dialog/delete-booking-management-dialog";
import { DetailBookingManagementDialog } from "../dialog/detail-booking-management-dialog";
import EditBookingManagementDialog from "../dialog/edit-booking-management-dialog";
import { getBookingManagementTableColumns } from "./booking-management-columns";

interface BookingManagementTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getData>>,
      Awaited<ReturnType<typeof getCompanyOptions>>
    ]
  >;
}

const BookingManagementTable = ({ promises }: BookingManagementTableProps) => {
  const [isPending, startTransition] = useTransition();
  const [{ data, pageCount }, companyOptions] = React.use(promises);
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<BookingManagement> | null>(null);

  const columns = React.useMemo(
    () =>
      getBookingManagementTableColumns({
        setRowAction,
        companyOptions,
      }),
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
            <CreateBookingManagementDialog />
          </DataTableToolbar>
        </DataTable>
      </div>
      <DetailBookingManagementDialog
        open={rowAction?.variant === "detail"}
        onOpenChange={() => setRowAction(null)}
        bookingManagement={
          rowAction?.row.original ? [rowAction.row.original] : []
        }
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
      {rowAction?.variant === "update" && (
        <EditBookingManagementDialog
          open={rowAction?.variant === "update"}
          onOpenChange={() => setRowAction(null)}
          booking={rowAction?.row.original ?? null}
        />
      )}
      <DeleteBookingManagementDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        bookingManagement={
          rowAction?.row.original ? [rowAction.row.original] : []
        }
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
};

export default BookingManagementTable;
