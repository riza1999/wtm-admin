"use server";

import { CreateBookingSummarySchema } from "@/components/dashboard/booking-management/booking-summary/dialog/create-booking-summary-dialog";
import { EditBookingSummarySchema } from "@/components/dashboard/booking-management/booking-summary/dialog/edit-booking-summary-dialog";
import { apiCall } from "@/lib/api";
import { cleanBody } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(input: {
  booking_id?: string;
  sub_booking_id?: string;
  status_id: string;
  reason?: string;
}) {
  try {
    const body = {
      ...input,
      booking_id: input.booking_id ? input.booking_id : undefined,
      sub_booking_id: input.sub_booking_id ? input.sub_booking_id : undefined,
      status_id: Number(input.status_id),
    };

    console.log({ body });

    const response = await apiCall(`bookings/status`, {
      method: "POST",
      body: JSON.stringify(cleanBody(body)),
    });

    console.log({ response });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to update booking status",
      };
    }

    revalidatePath("/booking-management/booking-summary", "layout");

    return {
      success: true,
      message: response.message || "Booking status updated successfully",
    };
  } catch (error) {
    console.error("Error editing promo:", error);

    // Handle API error responses with specific messages
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update booking status",
    };
  }
}

export async function updatePaymentStatus(input: {
  booking_id?: string;
  sub_booking_id?: string;
  payment_status_id: string;
}) {
  try {
    const body = {
      booking_id: input.booking_id ? input.booking_id : undefined,
      sub_booking_id: input.sub_booking_id ? input.sub_booking_id : undefined,
      status_id: Number(input.payment_status_id),
    };

    console.log({ body });

    const response = await apiCall(`bookings/status`, {
      method: "POST",
      body: JSON.stringify(cleanBody(body)),
    });

    console.log({ response });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to update payment status",
      };
    }

    revalidatePath("/booking-management/booking-summary", "layout");

    return {
      success: true,
      message: response.message || "Payment status updated successfully",
    };
  } catch (error) {
    console.error("Error updating payment status:", error);

    // Handle API error responses with specific messages
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update payment status",
    };
  }
}

export async function deleteBooking(bookingId: string) {
  console.log("Delete Booking");
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Booking deleted` };
}

export async function createBooking(input: CreateBookingSummarySchema) {
  console.log("Create Booking:");
  console.log({ input });

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Booking created` };
}

export async function editBooking(
  input: EditBookingSummarySchema & { id: string }
) {
  console.log("Edit Booking:");
  console.log({ input });

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Booking edited` };
}

export async function uploadReceipt(formData: FormData) {
  try {
    const receipt = formData.get("receipt") as File | null;
    const bookingId = formData.get("booking_id") as string | null;
    const subBookingId = formData.get("sub_booking_id") as string | null;

    if (!receipt) {
      return {
        success: false,
        message: "No file provided",
      };
    }

    // Log for debugging purposes
    console.log("Upload Receipt:");
    console.log({
      formData,
    });

    const response = await apiCall("bookings/receipt", {
      method: "POST",
      body: formData,
    });

    console.log({ response });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to upload receipt",
      };
    }

    revalidatePath("/booking-management/booking-summary", "layout");

    // For now, just return success without actual processing
    return {
      success: true,
      message: response.message || "Receipt uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading receipt:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upload receipt",
    };
  }
}
