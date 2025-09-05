"use server";

import { formatDate } from "@/lib/format";
import { SearchParams } from "@/types";
import { HistoryBookingLog } from "./types";

type ExportFormat = "csv" | "excel";

interface ExportResult {
  success: boolean;
  data?: string;
  filename?: string;
  totalRecords?: number;
  mimeType?: string;
  error?: string;
}

// Helper function to parse date ranges from search parameters
function parseDateRange(dateParam: string | string[] | undefined): {
  start?: Date;
  end?: Date;
} {
  if (!dateParam) return {};

  const dateStr = Array.isArray(dateParam) ? dateParam[0] : dateParam;

  try {
    // Handle different date range formats
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

// Helper function to check if a date is within a range
function isDateInRange(
  date: string,
  range: { start?: Date; end?: Date }
): boolean {
  if (!range.start && !range.end) return true;

  const checkDate = new Date(date);
  if (isNaN(checkDate.getTime())) return true; // Invalid date, include it

  if (range.start && checkDate < range.start) return false;
  if (range.end && checkDate > range.end) return false;

  return true;
}

// Helper function to escape XML content
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Helper function to validate export format
function validateExportFormat(format: ExportFormat): boolean {
  return ["csv", "excel"].includes(format);
}

// Helper function to sanitize filename
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9.-]/gi, "_");
}

export async function exportHistoryBookingLog(
  searchParams: SearchParams,
  format: ExportFormat = "csv"
): Promise<ExportResult> {
  try {
    // Validate input parameters
    if (!validateExportFormat(format)) {
      return {
        success: false,
        error: `Invalid export format: ${format}. Supported formats: csv, excel`,
      };
    }

    // Log export attempt for debugging
    console.log("Export request:", { searchParams, format });

    // Simulate API call with applied filters
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get all data (in real implementation, this would apply all filters from searchParams)
    const allData = [
      {
        booking_id: "BK-001",
        confirm_date: "2024-01-15T10:30:00Z",
        agent_name: "Agent Smith",
        booking_status: "confirmed",
        payment_status: "paid",
        date_in: "2024-02-01T14:00:00Z",
        date_out: "2024-02-03T12:00:00Z",
        hotel_name: "Grand Hotel Jakarta",
        room_type: "Deluxe Room",
        room_night: 2,
        capacity: "2 Adults",
      },
      {
        booking_id: "BK-002",
        confirm_date: "2024-01-16T09:15:00Z",
        agent_name: "Agent Jane",
        booking_status: "in review",
        payment_status: "unpaid",
        date_in: "2024-02-05T15:00:00Z",
        date_out: "2024-02-07T11:00:00Z",
        hotel_name: "Mercure Hotel Bandung",
        room_type: "Superior Room",
        room_night: 2,
        capacity: "1 Adult, 1 Child",
      },
      {
        booking_id: "BK-003",
        confirm_date: "2024-01-17T14:45:00Z",
        agent_name: "Agent Mike",
        booking_status: "rejected",
        payment_status: "unpaid",
        date_in: "2024-02-10T16:00:00Z",
        date_out: "2024-02-12T10:00:00Z",
        hotel_name: "Novotel Surabaya",
        room_type: "Executive Suite",
        room_night: 2,
        capacity: "2 Adults, 1 Child",
      },
      // Add more sample data for export demonstration
      {
        booking_id: "BK-004",
        confirm_date: "2024-01-18T11:20:00Z",
        agent_name: "Agent Sarah",
        booking_status: "confirmed",
        payment_status: "paid",
        date_in: "2024-02-15T14:00:00Z",
        date_out: "2024-02-17T12:00:00Z",
        hotel_name: "Hilton Bali Resort",
        room_type: "Ocean View Suite",
        room_night: 2,
        capacity: "2 Adults",
      },
      {
        booking_id: "BK-005",
        confirm_date: "2024-01-19T16:30:00Z",
        agent_name: "Agent David",
        booking_status: "confirmed",
        payment_status: "paid",
        date_in: "2024-02-20T15:00:00Z",
        date_out: "2024-02-22T11:00:00Z",
        hotel_name: "Sheraton Yogyakarta",
        room_type: "Premium Room",
        room_night: 2,
        capacity: "1 Adult",
      },
    ] as HistoryBookingLog[];

    // Apply filters based on searchParams
    let filteredData = [...allData]; // Create a copy to avoid mutation

    // Filter by booking_id (global search)
    if (searchParams.booking_id || searchParams.search) {
      const searchTerm = searchParams.booking_id || searchParams.search;
      const term = Array.isArray(searchTerm) ? searchTerm[0] : searchTerm;

      if (term && typeof term === "string") {
        const normalizedTerm = term.toLowerCase().trim();
        filteredData = filteredData.filter(
          (item) =>
            item.booking_id.toLowerCase().includes(normalizedTerm) ||
            item.agent_name.toLowerCase().includes(normalizedTerm) ||
            item.hotel_name.toLowerCase().includes(normalizedTerm) ||
            item.room_type.toLowerCase().includes(normalizedTerm)
        );
      }
    }

    // Filter by booking_status
    if (searchParams.booking_status) {
      const statuses = Array.isArray(searchParams.booking_status)
        ? searchParams.booking_status
        : [searchParams.booking_status];
      filteredData = filteredData.filter((item) =>
        statuses.includes(item.booking_status)
      );
    }

    // Filter by payment_status
    if (searchParams.payment_status) {
      const statuses = Array.isArray(searchParams.payment_status)
        ? searchParams.payment_status
        : [searchParams.payment_status];
      filteredData = filteredData.filter((item) =>
        statuses.includes(item.payment_status)
      );
    }

    // Filter by date ranges with proper implementation
    if (searchParams.confirm_date) {
      const dateRange = parseDateRange(searchParams.confirm_date);
      filteredData = filteredData.filter((item) =>
        isDateInRange(item.confirm_date, dateRange)
      );
    }

    if (searchParams.date_in) {
      const dateRange = parseDateRange(searchParams.date_in);
      filteredData = filteredData.filter((item) =>
        isDateInRange(item.date_in, dateRange)
      );
    }

    if (searchParams.date_out) {
      const dateRange = parseDateRange(searchParams.date_out);
      filteredData = filteredData.filter((item) =>
        isDateInRange(item.date_out, dateRange)
      );
    }

    // Validate that we have data to export
    if (filteredData.length === 0) {
      return {
        success: false,
        error: "No data found matching the specified filters",
      };
    }

    // Log filtering results
    console.log(
      `Filtered ${allData.length} records down to ${filteredData.length}`
    );

    // Generate timestamp for filename
    const timestamp = new Date().toISOString().split("T")[0];
    const timeString = new Date()
      .toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(":", "");

    // Convert data to the requested format
    if (format === "excel") {
      try {
        // Create Excel-compatible XML format for better compatibility
        const excelHeaders = [
          "Booking ID",
          "Confirm Date",
          "Agent Name",
          "Booking Status",
          "Payment Status",
          "Check-in Date",
          "Check-out Date",
          "Hotel Name",
          "Room Type",
          "Room Nights",
          "Capacity",
        ];

        const excelRows = filteredData.map((item) => {
          try {
            return [
              escapeXml(item.booking_id || ""),
              escapeXml(
                formatDate(item.confirm_date, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }) || ""
              ),
              escapeXml(item.agent_name || ""),
              escapeXml(item.booking_status || ""),
              escapeXml(item.payment_status || ""),
              escapeXml(
                formatDate(item.date_in, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }) || ""
              ),
              escapeXml(
                formatDate(item.date_out, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }) || ""
              ),
              escapeXml(item.hotel_name || ""),
              escapeXml(item.room_type || ""),
              escapeXml(item.room_night?.toString() || "0"),
              escapeXml(item.capacity || ""),
            ];
          } catch (err) {
            console.error("Error processing row:", item, err);
            // Return empty row if processing fails
            return new Array(excelHeaders.length).fill("");
          }
        });

        // Create Excel XML format with better structure
        const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" 
          xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" 
          xmlns:html="http://www.w3.org/TR/REC-html40">
<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>History Booking Log Export</Title>
  <Created>${new Date().toISOString()}</Created>
</DocumentProperties>
<Styles>
  <Style ss:ID="Header">
    <Font ss:Bold="1"/>
    <Interior ss:Color="#CCCCCC" ss:Pattern="Solid"/>
  </Style>
</Styles>
<Worksheet ss:Name="History Booking Log">
<Table ss:ExpandedColumnCount="${excelHeaders.length}" ss:ExpandedRowCount="${
          filteredData.length + 1
        }">`;

        const xmlHeaderRow = `<Row><Cell ss:StyleID="Header"><Data ss:Type="String">${excelHeaders.join(
          '</Data></Cell><Cell ss:StyleID="Header"><Data ss:Type="String">'
        )}</Data></Cell></Row>`;

        const xmlDataRows = excelRows
          .map(
            (row) =>
              `<Row><Cell><Data ss:Type="String">${row.join(
                '</Data></Cell><Cell><Data ss:Type="String">'
              )}</Data></Cell></Row>`
          )
          .join("");

        const xmlFooter = `</Table>
</Worksheet>
</Workbook>`;

        const excelContent = xmlHeader + xmlHeaderRow + xmlDataRows + xmlFooter;

        return {
          success: true,
          data: excelContent,
          filename: `history-booking-log-${timestamp}-${timeString}.xls`,
          totalRecords: filteredData.length,
          mimeType: "application/vnd.ms-excel",
        };
      } catch (excelError) {
        console.error("Error generating Excel format:", excelError);
        throw new Error("Failed to generate Excel format");
      }
    }
    // Default CSV format with enhanced error handling
    try {
      const csvHeaders = [
        "Booking ID",
        "Confirm Date",
        "Agent Name",
        "Booking Status",
        "Payment Status",
        "Check-in Date",
        "Check-out Date",
        "Hotel Name",
        "Room Type",
        "Room Nights",
        "Capacity",
      ];

      const csvRows = filteredData.map((item, index) => {
        try {
          return [
            item.booking_id || "",
            formatDate(item.confirm_date, {
              year: "numeric",
              month: "short",
              day: "numeric",
            }) || "",
            item.agent_name || "",
            item.booking_status || "",
            item.payment_status || "",
            formatDate(item.date_in, {
              year: "numeric",
              month: "short",
              day: "numeric",
            }) || "",
            formatDate(item.date_out, {
              year: "numeric",
              month: "short",
              day: "numeric",
            }) || "",
            item.hotel_name || "",
            item.room_type || "",
            item.room_night?.toString() || "0",
            item.capacity || "",
          ];
        } catch (err) {
          console.error(`Error processing row ${index}:`, item, err);
          // Return empty row if processing fails
          return new Array(csvHeaders.length).fill("");
        }
      });

      // Enhanced CSV escaping function
      const escapeCsvCell = (cell: string): string => {
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
      };

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.map(escapeCsvCell).join(",")),
      ].join("\n");

      return {
        success: true,
        data: csvContent,
        filename: `history-booking-log-${timestamp}-${timeString}.csv`,
        totalRecords: filteredData.length,
        mimeType: "text/csv;charset=utf-8;",
      };
    } catch (csvError) {
      console.error("Error generating CSV format:", csvError);
      throw new Error("Failed to generate CSV format");
    }
  } catch (error) {
    console.error("Error exporting history booking log:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to export data";

    if (error instanceof Error) {
      if (error.message.includes("format")) {
        errorMessage = `Export format error: ${error.message}`;
      } else if (error.message.includes("filter")) {
        errorMessage = `Filter processing error: ${error.message}`;
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
