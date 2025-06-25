"use client";

import { Table } from "@tanstack/react-table";
import { CirclePlus, X } from "lucide-react";

import { DataTableViewOptions } from "@/components/data-table/view-option";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DataTableFacetedFilterCopy } from "@/components/data-table/faceted-filter";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  HelpCircle,
  Timer,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { debounce, parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { UserForm } from "./form";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export const agents = [
  {
    value: "esensi digital",
    label: "Esensi Digital",
    icon: HelpCircle,
  },
  {
    value: "quavo",
    label: "Quavo",
    icon: Circle,
  },
  {
    value: "vevo",
    label: "Vevo",
    icon: Timer,
  },
];

export const promo_groups = [
  {
    label: "Group A",
    value: "group_a",
    icon: ArrowDown,
  },
  {
    label: "Group B",
    value: "group_b",
    icon: ArrowRight,
  },
  {
    label: "Group C",
    value: "group_c",
    icon: ArrowUp,
  },
];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [query, setQuery] = useQueryState(
    "q",
    parseAsString
      .withDefault("")
      .withOptions({ shallow: false, limitUrlUpdates: debounce(500) })
  );

  const handleReset = () => {
    router.replace(pathname);
  };

  const isFiltered = searchParams.size > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Filter name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <DataTableFacetedFilterCopy
          title="Agent"
          options={agents}
          urlKey="agent"
        />
        <DataTableFacetedFilterCopy
          title="Promo Group"
          options={promo_groups}
          urlKey="promo_groups"
        />
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        <Button size={"sm"} onClick={() => setIsOpen(true)}>
          <CirclePlus /> Add
        </Button>
        <UserForm
          open={isOpen}
          onOpenChange={setIsOpen}
          onSuccess={() => {
            // The query will automatically refetch due to invalidation
          }}
        />
      </div>
    </div>
  );
}
