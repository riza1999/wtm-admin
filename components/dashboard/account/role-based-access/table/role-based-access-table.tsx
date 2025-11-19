"use client";

import { updateRBA } from "@/app/(dashboard)/account/role-based-access/actions";
import { getRoleBasedAccessData } from "@/app/(dashboard)/account/role-based-access/fetch";
import {
  Action,
  RoleBasedAccessPageData,
} from "@/app/(dashboard)/account/role-based-access/types";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { useDataTable } from "@/hooks/use-data-table";
import { CheckCircle, XCircle } from "lucide-react";
import React, { useTransition } from "react";
import { toast } from "sonner";
import { getRoleBasedAccessTableColumns } from "./role-based-access-columns";

interface RoleBasedAccessTableProps {
  promise: Promise<Awaited<ReturnType<typeof getRoleBasedAccessData>>>;
}

const RoleBasedAccessTable = ({ promise }: RoleBasedAccessTableProps) => {
  const [isPending, startTransition] = useTransition();
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const [selectValueMap, setSelectValueMap] = React.useState<
    Record<string, string>
  >({});
  const { data } = React.use(promise);
  const columns = React.useMemo(() => getRoleBasedAccessTableColumns(), []);

  const { table } = useDataTable({
    data: data || [],
    columns,
    pageCount: 1,
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
    startTransition,
  });

  const handleChangePermission = ({
    action,
    page,
    role,
    allowed,
  }: {
    action: Action;
    page: string;
    role: string;
    allowed: boolean;
  }) => {
    const selectKey = `${role}-${page}-${action}`;
    const previousValue = selectValueMap[selectKey];

    // Update the select value immediately for optimistic UI
    setSelectValueMap((prev) => ({
      ...prev,
      [selectKey]: String(allowed),
    }));

    startUpdateTransition(async () => {
      const result = await updateRBA({ action, page, role, allowed });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        // Revert the select value to previous state
        setSelectValueMap((prev) => ({
          ...prev,
          [selectKey]: previousValue || String(!allowed),
        }));
      }
    });
  };

  return (
    <div className="relative">
      <DataTable
        table={table}
        isPending={isPending}
        renderSubRow={(page: RoleBasedAccessPageData) => (
          <>
            {page.actions.map((action, index) => {
              return (
                <TableRow key={`action-${index}`}>
                  <TableCell />
                  <TableCell>{action.action}</TableCell>
                  {Object.entries(action.permissions).map(([role, allowed]) => {
                    const selectKey = `${role}-${page.id}-${action.action}`;
                    const currentValue =
                      selectValueMap[selectKey] ?? String(allowed);

                    return (
                      <TableCell key={role}>
                        <Select
                          disabled={isUpdatePending}
                          value={currentValue}
                          onValueChange={(value) =>
                            handleChangePermission({
                              action: action.action.toLowerCase() as Action,
                              page: page.id.toLowerCase(),
                              role: role.toLowerCase(),
                              allowed: value === "true",
                            })
                          }
                        >
                          <SelectTrigger
                            className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
                            size="sm"
                            id={`${role}-permission`}
                          >
                            <SelectValue placeholder="Assign permission" />
                          </SelectTrigger>
                          <SelectContent align="end">
                            <SelectItem value="true">
                              <span className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Allow
                              </span>
                            </SelectItem>
                            <SelectItem value="false">
                              <span className="flex items-center gap-2">
                                <XCircle className="w-4 h-4 text-red-500" />
                                Deny
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </>
        )}
      >
        <DataTableToolbar table={table} isPending={isPending}>
          {/* Add create dialog or actions here if needed */}
        </DataTableToolbar>
      </DataTable>
    </div>
  );
};

export default RoleBasedAccessTable;
