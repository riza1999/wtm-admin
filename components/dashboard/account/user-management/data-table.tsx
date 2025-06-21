"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import Link from "next/link";
import z from "zod";
import { schema } from "./schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import React from "react";
import { Tab } from "@/types/tabs";
import AddSuperAdmin from "./modal-add";
import { ActionDialogs } from "./action-dialogs";

const TableContent = ({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) => {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleEditUser = (
    userId: number,
    updatedData: { name: string; email: string; phone: string; status: boolean }
  ) => {
    setData((prevData) =>
      prevData.map((user) =>
        user.id === userId
          ? {
              ...user,
              name: updatedData.name,
              email: updatedData.email,
              phone: updatedData.phone,
            }
          : user
      )
    );
  };

  const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Agent Name",
      cell: ({ row }) => {
        return row.original.name;
      },
      enableHiding: false,
    },
    {
      accessorKey: "agent",
      header: "Agent Company",
      cell: ({ row }) => {
        return row.original.agent;
      },
    },
    {
      accessorKey: "promo_group",
      header: "Promo Group",
      cell: ({ row }) => {
        return (
          <>
            <Label
              htmlFor={`${row.original.id}-promo-group`}
              className="sr-only"
            >
              Promo Group
            </Label>
            <Select defaultValue={row.original.promo_group}>
              <SelectTrigger
                className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                size="sm"
                id={`${row.original.id}-promo-group`}
              >
                <SelectValue placeholder="Assign promo group" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="group_a">Promo Group A</SelectItem>
                <SelectItem value="group_b">Promo Group B</SelectItem>
                <SelectItem value="group_c">Promo Group C</SelectItem>
                <SelectSeparator />
                <SelectItemLink href={"/dummy"}>
                  Create New Group
                </SelectItemLink>
              </SelectContent>
            </Select>
          </>
        );
      },
    },
    {
      accessorKey: "email",
      header: "E-mail",
      cell: ({ row }) => {
        return row.original.email;
      },
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
      cell: ({ row }) => {
        return row.original.phone;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <ActionDialogs
          user={{
            id: row.original.id,
            name: row.original.name,
            email: row.original.email,
            phone: row.original.phone,
            status: true,
          }}
          onEdit={handleEditUser}
          onDelete={(userId) => {
            // Handle delete logic here
            console.log("Deleting user:", userId);
            setData((prevData) =>
              prevData.filter((user) => user.id !== userId)
            );
          }}
        />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

const DataTable = ({
  data: initialData,
  tabs,
}: {
  data: z.infer<typeof schema>[];
  tabs: Tab[];
}) => {
  return (
    <Tabs
      defaultValue="super_admin"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="Role-selector" className="sr-only">
          Role
        </Label>
        <Select defaultValue="super_admin">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="role-selector"
          >
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab) => (
              <SelectItem value={tab.key} key={tab.key}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          {tabs.map((tab) => (
            <TabsTrigger value={tab.key} key={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="flex justify-between gap-2">
        <div className="flex w-full items-center gap-2 max-w-sm">
          <Input type="search" placeholder="Search Agent Name Here..." />
          <Button type="submit" variant={"secondary"}>
            <Search /> Search
          </Button>
        </div>

        <AddSuperAdmin />
      </div>

      <TabsContent
        value="super_admin"
        className="relative flex flex-col gap-4 overflow-auto "
      >
        <TableContent data={initialData} />
      </TabsContent>
      <TabsContent value="agent" className="flex flex-col ">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed justify-center flex items-center text-xl">
          agent
        </div>
      </TabsContent>
      <TabsContent value="admin" className="flex flex-col ">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed justify-center flex items-center text-xl">
          admin
        </div>
      </TabsContent>
      <TabsContent value="support" className="flex flex-col ">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed justify-center flex items-center text-xl">
          support
        </div>
      </TabsContent>
    </Tabs>
  );
};

const SelectItemLink = ({
  href,
  children,
  className,
}: React.ComponentProps<typeof Link>) => {
  return (
    <Link
      href={href}
      className={cn(
        "hover:bg-accent hover:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default DataTable;
