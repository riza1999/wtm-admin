"use client";

import { getData } from "@/app/(dashboard)/hotel-listing/room-availability/page";
import { RoomAvailabilityHotel } from "@/app/(dashboard)/hotel-listing/room-availability/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { MonthPicker } from "@/components/ui/monthpicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDataTable } from "@/hooks/use-data-table";
import { cn } from "@/lib/utils";
import type { DataTableRowAction } from "@/types/data-table";
import { format } from "date-fns/format";
import { CalendarIcon } from "lucide-react";
import React, { useTransition } from "react";
import { getRoomAvailabilityTableColumns } from "./room-availability-columns";
import { UpdateRoomAvailabilityDrawer } from "../drawer/update-room-availability-drawer";
import { createParser, useQueryState } from "nuqs";

interface RoomAvailabilityTableProps {
  promises: Promise<[Awaited<ReturnType<typeof getData>>]>;
}

// Create a custom parser for the "mm-yyyy" format
const monthYearParser = createParser({
  parse: (value) => {
    const [month, year] = value.split("-").map(Number);
    // Note: JS Date months are 0-indexed (0-11)
    return new Date(year, month - 1);
  },
  serialize: (value) => {
    const month = (value.getMonth() + 1).toString().padStart(2, "0");
    const year = value.getFullYear();
    return `${month}-${year}`;
  },
});

const RoomAvailabilityTable = ({ promises }: RoomAvailabilityTableProps) => {
  const [isPending, startTransition] = useTransition();
  const [{ data, pageCount }] = React.use(promises);
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<RoomAvailabilityHotel> | null>(null);

  const [date, setDate] = useQueryState(
    "period",
    monthYearParser.withDefault(new Date())
  );

  const columns = React.useMemo(
    () =>
      getRoomAvailabilityTableColumns({
        setRowAction,
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
    <div className="relative">
      <DataTable table={table} isPending={isPending}>
        <DataTableToolbar table={table} isPending={isPending}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMM yyyy") : <span>Select Period</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <MonthPicker onMonthSelect={setDate} selectedMonth={date} />
            </PopoverContent>
          </Popover>
        </DataTableToolbar>
      </DataTable>

      <UpdateRoomAvailabilityDrawer
        open={rowAction?.variant === "update"}
        roomAvailabilityHotel={rowAction?.row.original ?? null}
        onOpenChange={() => setRowAction(null)}
      />
    </div>
  );
};

export default RoomAvailabilityTable;
