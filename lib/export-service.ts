import { formatDate } from "@/lib/format";
import { SearchParams } from "@/types";
import * as XLSX from "xlsx";
import {
  ExportColumn,
  ExportConfig,
  ExportFormat,
  ExportResult,
  FilterFunction,
} from "./export-types";

export class ExportService {
  /**
   * Main export function that handles data processing and file generation
   */
  static async exportData<T>(
    data: T[],
    columns: ExportColumn<T>[],
    config: ExportConfig = {},
    format: ExportFormat = "csv",
    filterFn?: FilterFunction<T>,
    searchParams?: SearchParams
  ): Promise<ExportResult> {
    try {
      // Validate input parameters
      if (!this.validateExportFormat(format)) {
        return {
          success: false,
          error: `Invalid export format: ${format}. Supported formats: csv, excel`,
        };
      }

      if (!data || data.length === 0) {
        return {
          success: false,
          error: "No data provided for export",
        };
      }

      if (!columns || columns.length === 0) {
        return {
          success: false,
          error: "No columns defined for export",
        };
      }

      // Apply filters if provided
      let filteredData = [...data];
      if (filterFn && searchParams) {
        filteredData = filterFn(data, searchParams);
      }

      // Validate that we have data after filtering
      if (filteredData.length === 0) {
        return {
          success: false,
          error: "No data found matching the specified filters",
        };
      }

      // Generate filename
      const filename = this.generateFilename(
        config.filenamePrefix || "export",
        format,
        config.includeTimestamp
      );

      // Process data based on format
      if (format === "excel") {
        return this.generateExcelFile(filteredData, columns, config, filename);
      } else {
        return this.generateCSVFile(filteredData, columns, config, filename);
      }
    } catch (error) {
      console.error("Error in ExportService.exportData:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to export data",
      };
    }
  }

  /**
   * Generate Excel file with styling and metadata
   */
  private static generateExcelFile<T>(
    data: T[],
    columns: ExportColumn<T>[],
    config: ExportConfig,
    filename: string
  ): ExportResult {
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Prepare headers and data
      const headers = columns.map((col) => col.header);
      const rows = data.map((item, index) => {
        try {
          return columns.map((col) => {
            const value = col.accessor(item);
            return col.formatter
              ? col.formatter(value)
              : this.formatValue(value);
          });
        } catch (err) {
          console.error(`Error processing row ${index}:`, item, err);
          return new Array(columns.length).fill("");
        }
      });

      // Combine headers and data
      const worksheetData = [headers, ...rows];

      // Create worksheet from data
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // Set column widths
      if (columns.some((col) => col.width)) {
        worksheet["!cols"] = columns.map((col) => ({ wch: col.width || 15 }));
      }

      // Style the header row
      const headerRange = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
        if (worksheet[headerCell]) {
          worksheet[headerCell].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "366092" } },
            alignment: { horizontal: "center", vertical: "center" },
          };
        }
      }

      // Add the worksheet to workbook
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        config.sheetName || "Data"
      );

      // Set workbook properties
      workbook.Props = {
        Title: config.title || "Data Export",
        Subject: config.subject || "Export",
        Author: config.author || "WTM Admin System",
        CreatedDate: new Date(),
      };

      // Generate Excel file as buffer
      const excelBuffer = XLSX.write(workbook, {
        type: "array",
        bookType: "xlsx",
        compression: true,
      });

      // Convert buffer to Uint8Array for better compatibility
      const uint8Array = new Uint8Array(excelBuffer);

      return {
        success: true,
        data: uint8Array,
        filename,
        totalRecords: data.length,
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
    } catch (error) {
      console.error("Error generating Excel format:", error);
      throw new Error("Failed to generate Excel format");
    }
  }

  /**
   * Generate CSV file with proper escaping
   */
  private static generateCSVFile<T>(
    data: T[],
    columns: ExportColumn<T>[],
    config: ExportConfig,
    filename: string
  ): ExportResult {
    try {
      const headers = columns.map((col) => col.header);
      const rows = data.map((item, index) => {
        try {
          return columns.map((col) => {
            const value = col.accessor(item);
            return col.formatter
              ? col.formatter(value)
              : this.formatValue(value);
          });
        } catch (err) {
          console.error(`Error processing row ${index}:`, item, err);
          return new Array(columns.length).fill("");
        }
      });

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map(this.escapeCsvCell).join(",")),
      ].join("\n");

      return {
        success: true,
        data: csvContent,
        filename,
        totalRecords: data.length,
        mimeType: "text/csv;charset=utf-8;",
      };
    } catch (error) {
      console.error("Error generating CSV format:", error);
      throw new Error("Failed to generate CSV format");
    }
  }

  /**
   * Common filtering functions
   */
  static createGlobalSearchFilter<T>(
    searchFields: (keyof T)[]
  ): FilterFunction<T> {
    return (data: T[], searchParams: SearchParams) => {
      if (!searchParams.search) return data;

      const searchTerm = Array.isArray(searchParams.search)
        ? searchParams.search[0]
        : searchParams.search;

      if (!searchTerm || typeof searchTerm !== "string") return data;

      const normalizedTerm = searchTerm.toLowerCase().trim();

      return data.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(normalizedTerm);
        })
      );
    };
  }

  static createMultiSelectFilter<T>(
    field: keyof T,
    paramKey: string
  ): FilterFunction<T> {
    return (data: T[], searchParams: SearchParams) => {
      const filterValues = searchParams[paramKey];
      if (!filterValues) return data;

      const values = Array.isArray(filterValues)
        ? filterValues
        : [filterValues];
      return data.filter((item) => values.includes(String(item[field])));
    };
  }

  static createDateRangeFilter<T>(
    field: keyof T,
    paramKey: string
  ): FilterFunction<T> {
    return (data: T[], searchParams: SearchParams) => {
      const dateParam = searchParams[paramKey];
      if (!dateParam) return data;

      const dateRange = this.parseDateRange(dateParam);
      return data.filter((item) => {
        const dateValue = item[field] as string;
        return this.isDateInRange(dateValue, dateRange);
      });
    };
  }

  static combineFilters<T>(...filters: FilterFunction<T>[]): FilterFunction<T> {
    return (data: T[], searchParams: SearchParams) => {
      return filters.reduce(
        (filteredData, filter) => filter(filteredData, searchParams),
        data
      );
    };
  }

  /**
   * Helper functions
   */
  private static validateExportFormat(format: ExportFormat): boolean {
    return ["csv", "excel"].includes(format);
  }

  private static generateFilename(
    prefix: string,
    format: ExportFormat,
    includeTimestamp = true
  ): string {
    const sanitizedPrefix = this.sanitizeFilename(prefix);

    if (!includeTimestamp) {
      return `${sanitizedPrefix}.${format === "excel" ? "xlsx" : "csv"}`;
    }

    const timestamp = new Date().toISOString().split("T")[0];
    const timeString = new Date()
      .toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(":", "");

    return `${sanitizedPrefix}-${timestamp}-${timeString}.${
      format === "excel" ? "xlsx" : "csv"
    }`;
  }

  private static sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-z0-9.-]/gi, "_");
  }

  private static formatValue(value: any): string {
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value instanceof Date)
      return formatDate(value.toISOString(), {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    return String(value);
  }

  private static escapeCsvCell(cell: string): string {
    if (typeof cell !== "string") {
      cell = String(cell || "");
    }

    // Check if escaping is needed
    if (
      cell.includes(",") ||
      cell.includes('"') ||
      cell.includes("\n") ||
      cell.includes("\r")
    ) {
      // Escape quotes by doubling them and wrap in quotes
      return `"${cell.replace(/"/g, '""')}"`;
    }

    return cell;
  }

  private static parseDateRange(dateParam: string | string[] | undefined): {
    start?: Date;
    end?: Date;
  } {
    if (!dateParam) return {};

    const dateStr = Array.isArray(dateParam) ? dateParam[0] : dateParam;

    try {
      if (dateStr.includes("to")) {
        const [start, end] = dateStr.split("to").map((d) => d.trim());
        return {
          start: start ? new Date(start) : undefined,
          end: end ? new Date(end) : undefined,
        };
      } else {
        const date = new Date(dateStr);
        return { start: date, end: date };
      }
    } catch {
      return {};
    }
  }

  private static isDateInRange(
    date: string,
    range: { start?: Date; end?: Date }
  ): boolean {
    if (!range.start && !range.end) return true;

    const checkDate = new Date(date);
    if (isNaN(checkDate.getTime())) return true;

    if (range.start && checkDate < range.start) return false;
    if (range.end && checkDate > range.end) return false;

    return true;
  }
}
