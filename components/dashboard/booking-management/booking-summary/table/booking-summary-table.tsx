"use client";

import { BookingSummary } from "@/app/(dashboard)/booking-management/booking-summary/types";
import {
  getCompanyOptions,
  getData,
} from "@/app/(dashboard)/booking-management/page";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableRowAction } from "@/types/data-table";
import React, { useTransition } from "react";
import CreateBookingSummaryDialog from "../dialog/create-booking-summary-dialog";
import { DeleteBookingSummaryDialog } from "../dialog/delete-booking-summary-dialog";
import { DetailBookingSummaryDialog } from "../dialog/detail-booking-summary-dialog";
import EditBookingSummaryDialog from "../dialog/edit-booking-summary-dialog";
import { getBookingSummaryTableColumns } from "./booking-summary-columns";

interface BookingSummaryTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getData>>,
      Awaited<ReturnType<typeof getCompanyOptions>>
    ]
  >;
}

const BookingSummaryTable = ({ promises }: BookingSummaryTableProps) => {
  const [isPending, startTransition] = useTransition();
  const [{ data, pageCount }, companyOptions] = React.use(promises);
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<BookingSummary> | null>(null);

  const columns = React.useMemo(
    () =>
      getBookingSummaryTableColumns({
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
            <CreateBookingSummaryDialog />
          </DataTableToolbar>
        </DataTable>
      </div>
      <DetailBookingSummaryDialog
        open={rowAction?.variant === "detail"}
        onOpenChange={() => setRowAction(null)}
        bookingSummary={rowAction?.row.original ? [rowAction.row.original] : []}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
      {rowAction?.variant === "update" && (
        <EditBookingSummaryDialog
          open={rowAction?.variant === "update"}
          onOpenChange={() => setRowAction(null)}
          booking={rowAction?.row.original ?? null}
        />
      )}
      <DeleteBookingSummaryDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        bookingSummary={rowAction?.row.original ? [rowAction.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
};

export default BookingSummaryTable;
