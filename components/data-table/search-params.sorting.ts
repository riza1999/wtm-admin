import { SortingState, Updater } from "@tanstack/react-table";
import { parseAsString, useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

/**
 * Custom hook to manage sorting state via search params.
 * Returns [sorting, setSorting], where sorting is a string like "column.asc" or "column.desc".
 */
export function useSortingSearchParams(options?: { shallow?: boolean }) {
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault("").withOptions(options || {})
  );

  const [column, order] = sort?.split(".") ?? [];

  const sorting: SortingState = useMemo(
    () => (sort ? [{ id: column || "", desc: order === "desc" }] : []),
    [sort, column, order]
  );

  // Handle sorting changes
  const handleSortingChange = useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      const newSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue;

      if (newSorting.length > 0) {
        setSort(`${newSorting[0].id}.${newSorting[0].desc ? "desc" : "asc"}`);
      } else {
        setSort("");
      }
    },
    [setSort, sorting]
  );

  return [sorting, handleSortingChange] as const;
}
