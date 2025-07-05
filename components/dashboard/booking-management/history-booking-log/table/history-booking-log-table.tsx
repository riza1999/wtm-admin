"use client";

import { HistoryBookingLog } from "@/app/(dashboard)/booking-management/history-booking-log/types";

import {
  getCompanyOptions,
  getData,
} from "@/app/(dashboard)/booking-management/history-booking-log/page";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableRowAction } from "@/types/data-table";
import React, { useTransition } from "react";
import { getHistoryBookingLogTableColumns } from "./history-booking-log-columns";

interface HistoryBookingLogTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getData>>,
      Awaited<ReturnType<typeof getCompanyOptions>>
    ]
  >;
}

const HistoryBookingLogTable = ({ promises }: HistoryBookingLogTableProps) => {
  const [isPending, startTransition] = useTransition();
  const [{ data, pageCount }, companyOptions] = React.use(promises);
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<HistoryBookingLog> | null>(null);

  const columns = React.useMemo(
    () =>
      getHistoryBookingLogTableColumns({
        setRowAction,
        companyOptions,
      }),
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    getRowId: (originalRow) => originalRow.booking_id,
    shallow: false,
    clearOnDefault: true,
    startTransition,
  });

  return (
    <>
      <div className="relative">
        <DataTable table={table} isPending={isPending}>
          <DataTableToolbar table={table} isPending={isPending} />
        </DataTable>
      </div>
    </>
  );
};

export default HistoryBookingLogTable;
