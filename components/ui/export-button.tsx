"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportButtonProps } from "@/lib/export-types";
import { cn } from "@/lib/utils";
import { IconChevronDown, IconCloudDownload } from "@tabler/icons-react";

export function ExportButton({
  isExporting,
  onDownload,
  size = "sm",
  variant = "outline",
  className,
  disabled = false,
}: ExportButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={cn("bg-white border-primary", className)}
          disabled={isExporting || disabled}
        >
          <IconCloudDownload />
          {isExporting ? "Exporting..." : "Download"}
          <IconChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onDownload("csv")}>
          Download as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload("excel")}>
          Download as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
