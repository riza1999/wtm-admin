"use server";

import { ExportConfigs } from "@/lib/export-client";
import { ExportService } from "@/lib/export-service";
import {
  ExportColumn,
  ExportFormat,
  ExportResult,
  FilterFunction,
} from "@/lib/export-types";
import { formatDate } from "@/lib/format";
import { SearchParams } from "@/types";
import { HistoryBookingLog } from "./types";

// Define columns for export
const exportColumns: ExportColumn<HistoryBookingLog>[] = [
  {
    key: "booking_id",
    header: "Booking ID",
    accessor: (item) => item.booking_code,
    width: 12,
  },
  {
    key: "confirm_date",
    header: "Confirm Date",
    accessor: (item) => item.confirm_date,
    formatter: (value) =>
      formatDate(value, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    width: 15,
  },
  {
    key: "agent_name",
    header: "Agent Name",
    accessor: (item) => item.agent_name,
    width: 20,
  },
  {
    key: "booking_status",
    header: "Booking Status",
    accessor: (item) => item.booking_status,
    width: 15,
  },
  {
    key: "payment_status",
    header: "Payment Status",
    accessor: (item) => item.payment_status,
    width: 15,
  },
  {
    key: "date_in",
    header: "Check-in Date",
    accessor: (item) => item.check_in_date,
    formatter: (value) =>
      formatDate(value, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    width: 15,
  },
  {
    key: "date_out",
    header: "Check-out Date",
    accessor: (item) => item.check_out_date,
    formatter: (value) =>
      formatDate(value, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    width: 15,
  },
  {
    key: "hotel_name",
    header: "Hotel Name",
    accessor: (item) => item.hotel_name,
    width: 25,
  },
  {
    key: "room_type",
    header: "Room Type",
    accessor: (item) => item.room_type_name,
    width: 20,
  },
  {
    key: "room_night",
    header: "Room Nights",
    accessor: (item) => item.room_nights,
    width: 12,
  },
  {
    key: "capacity",
    header: "Capacity",
    accessor: (item) => item.capacity,
    width: 15,
  },
];

// Create filtering function
const createBookingLogFilter = (): FilterFunction<HistoryBookingLog> => {
  return ExportService.combineFilters(
    // Global search filter
    ExportService.createGlobalSearchFilter<HistoryBookingLog>([
      "booking_code",
      "agent_name",
      "hotel_name",
      "room_type_name",
    ]),
    // Status filters
    ExportService.createMultiSelectFilter<HistoryBookingLog>(
      "booking_status",
      "booking_status"
    ),
    ExportService.createMultiSelectFilter<HistoryBookingLog>(
      "payment_status",
      "payment_status"
    ),
    // Date filters
    ExportService.createDateRangeFilter<HistoryBookingLog>(
      "confirm_date",
      "confirm_date"
    ),
    ExportService.createDateRangeFilter<HistoryBookingLog>(
      "check_in_date",
      "check_in_date"
    ),
    ExportService.createDateRangeFilter<HistoryBookingLog>(
      "check_out_date",
      "check_out_date"
    )
  );
};

// Get sample data (in real implementation, this would fetch from database)
function getSampleData(): HistoryBookingLog[] {
  return [
    {
      booking_code: "BK-001",
      confirm_date: "2024-01-15T10:30:00Z",
      agent_name: "Agent Smith",
      booking_status: "confirmed",
      payment_status: "paid",
      check_in_date: "2024-02-01T14:00:00Z",
      check_out_date: "2024-02-03T12:00:00Z",
      hotel_name: "Grand Hotel Jakarta",
      room_type_name: "Deluxe Room",
      room_nights: 2,
      capacity: "2 Adults",
    },
    {
      booking_code: "BK-002",
      confirm_date: "2024-01-16T09:15:00Z",
      agent_name: "Agent Jane",
      booking_status: "in review",
      payment_status: "unpaid",
      check_in_date: "2024-02-05T15:00:00Z",
      check_out_date: "2024-02-07T11:00:00Z",
      hotel_name: "Mercure Hotel Bandung",
      room_type_name: "Superior Room",
      room_nights: 2,
      capacity: "1 Adult, 1 Child",
    },
    {
      booking_code: "BK-003",
      confirm_date: "2024-01-17T14:45:00Z",
      agent_name: "Agent Mike",
      booking_status: "rejected",
      payment_status: "unpaid",
      check_in_date: "2024-02-10T16:00:00Z",
      check_out_date: "2024-02-12T10:00:00Z",
      hotel_name: "Novotel Surabaya",
      room_type_name: "Executive Suite",
      room_nights: 2,
      capacity: "2 Adults, 1 Child",
    },
    {
      booking_code: "BK-004",
      confirm_date: "2024-01-18T11:20:00Z",
      agent_name: "Agent Sarah",
      booking_status: "confirmed",
      payment_status: "paid",
      check_in_date: "2024-02-15T14:00:00Z",
      check_out_date: "2024-02-17T12:00:00Z",
      hotel_name: "Hilton Bali Resort",
      room_type_name: "Ocean View Suite",
      room_nights: 2,
      capacity: "2 Adults",
    },
    {
      booking_code: "BK-005",
      confirm_date: "2024-01-19T16:30:00Z",
      agent_name: "Agent David",
      booking_status: "confirmed",
      payment_status: "paid",
      check_in_date: "2024-02-20T15:00:00Z",
      check_out_date: "2024-02-22T11:00:00Z",
      hotel_name: "Sheraton Yogyakarta",
      room_type_name: "Premium Room",
      room_nights: 2,
      capacity: "1 Adult",
    },
  ];
}

export async function exportHistoryBookingLog(
  searchParams: SearchParams,
  format: ExportFormat = "csv"
): Promise<ExportResult> {
  try {
    // Log export attempt for debugging
    console.log("Export request:", { searchParams, format });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get data (in real implementation, this would fetch from database)
    const data = getSampleData();

    // Create filter function
    const filterFn = createBookingLogFilter();

    // Use the reusable export service
    return await ExportService.exportData(
      data,
      exportColumns,
      ExportConfigs.bookingLog,
      format,
      filterFn,
      searchParams
    );
  } catch (error) {
    console.error("Error exporting history booking log:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to export data",
    };
  }
}
