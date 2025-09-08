import { SearchParams } from "@/types";

export type ExportFormat = "csv" | "excel";

export interface ExportResult {
  success: boolean;
  data?: string | Uint8Array;
  filename?: string;
  totalRecords?: number;
  mimeType?: string;
  error?: string;
}

export interface ExportColumn<T = any> {
  key: string;
  header: string;
  accessor: (item: T) => any;
  formatter?: (value: any) => string;
  width?: number;
}

export interface ExportConfig {
  title?: string;
  subject?: string;
  author?: string;
  sheetName?: string;
  includeTimestamp?: boolean;
  filenamePrefix?: string;
}

export interface FilterFunction<T = any> {
  (data: T[], searchParams: SearchParams): T[];
}

export interface ExportHookResult {
  isExporting: boolean;
  handleDownload: (format: ExportFormat) => void;
}

export interface ExportButtonProps {
  isExporting: boolean;
  onDownload: (format: ExportFormat) => void;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  className?: string;
  disabled?: boolean;
}

// Re-export from service and client for convenience
export { downloadFile, ExportUtils, useExport } from "./export-client";
export { ExportService } from "./export-service";
