import { Updater } from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export function usePaginationSearchParams(options?: { shallow?: boolean }) {
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions(options || {})
  );
  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(10).withOptions(options || {})
  );

  // Pagination state
  const pagination = useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize,
    }),
    [page, pageSize]
  );

  // Handle pagination changes
  const handlePaginationChange = useCallback(
    (updaterOrValue: Updater<typeof pagination>) => {
      const newPagination =
        typeof updaterOrValue === "function"
          ? updaterOrValue(pagination)
          : updaterOrValue;

      setPage(newPagination.pageIndex + 1);
      setPageSize(newPagination.pageSize);
    },
    [setPage, setPageSize, pagination]
  );

  return [pagination, handlePaginationChange] as const;
}
