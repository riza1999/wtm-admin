"use client";

import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { ExportFormat, ExportHookResult, ExportResult } from "./export-types";

export class ExportUtils {
  /**
   * Convert URLSearchParams to plain object for server actions
   */
  static searchParamsToObject(
    searchParams: URLSearchParams
  ): Record<string, string | string[]> {
    const params: Record<string, string | string[]> = {};

    searchParams.forEach((value, key) => {
      if (params[key]) {
        // If key already exists, convert to array or add to existing array
        if (Array.isArray(params[key])) {
          (params[key] as string[]).push(value);
        } else {
          params[key] = [params[key] as string, value];
        }
      } else {
        params[key] = value;
      }
    });

    return params;
  }

  /**
   * Validate export result and show appropriate error messages
   */
  static validateExportResult(result: ExportResult): boolean {
    if (!result.success) {
      toast.error(result.error || "Failed to export data");
      return false;
    }

    if (!result.data) {
      toast.error("No data received from export");
      return false;
    }

    return true;
  }
}

/**
 * Download file utility function
 */
export function downloadFile(
  data: string | Uint8Array,
  filename: string,
  mimeType: string
): void {
  let blob: Blob;

  // Handle different data types (string for CSV, Uint8Array for Excel)
  if (typeof data === "string") {
    blob = new Blob([data], { type: mimeType });
  } else {
    blob = new Blob([data], { type: mimeType });
  }

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * React hook for handling exports with loading states and error handling
 */
export function useExport(
  exportFunction: (
    params: Record<string, string | string[]>,
    format: ExportFormat
  ) => Promise<ExportResult>
): ExportHookResult {
  const [isExporting, startExportTransition] = useTransition();
  const searchParams = useSearchParams();

  const handleDownload = (format: ExportFormat) => {
    startExportTransition(async () => {
      try {
        // Convert search params to object
        const params = ExportUtils.searchParamsToObject(searchParams);

        // Call export function
        const result = await exportFunction(params, format);

        // Validate result
        if (!ExportUtils.validateExportResult(result)) {
          return;
        }

        // Download file
        downloadFile(
          result.data!,
          result.filename || `export.${format === "excel" ? "xlsx" : "csv"}`,
          result.mimeType ||
            (format === "excel"
              ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              : "text/csv;charset=utf-8;")
        );

        // Show success message
        toast.success(
          `Successfully exported ${
            result.totalRecords || 0
          } records to ${format.toUpperCase()}`
        );
      } catch (error) {
        console.error("Export error:", error);
        toast.error("An error occurred while exporting data");
      }
    });
  };

  return {
    isExporting,
    handleDownload,
  };
}

/**
 * Export configurations for common use cases
 */
export const ExportConfigs = {
  bookingLog: {
    title: "History Booking Log Export",
    subject: "Booking Management Export",
    sheetName: "History Booking Log",
    filenamePrefix: "history-booking-log",
  },

  agentList: {
    title: "Agent List Export",
    subject: "Agent Management Export",
    sheetName: "Agent List",
    filenamePrefix: "agent-list",
  },

  userManagement: {
    title: "User Management Export",
    subject: "User Management Export",
    sheetName: "Users",
    filenamePrefix: "user-list",
  },

  promoList: {
    title: "Promotion List Export",
    subject: "Marketing Export",
    sheetName: "Promotions",
    filenamePrefix: "promo-list",
  },
};
