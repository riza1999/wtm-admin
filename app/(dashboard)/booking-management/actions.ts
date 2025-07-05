"use server";

import { CreateBookingManagementSchema } from "@/components/dashboard/booking-management/dialog/create-booking-management-dialog";
import { EditBookingManagementSchema } from "@/components/dashboard/booking-management/dialog/edit-booking-management-dialog";

export async function updateBookingStatus(bookingId: string, status: string) {
  console.log("Update Booking Status");
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Booking status updated to ${status}` };
}

export async function deleteBooking(bookingId: string) {
  console.log("Delete Booking");
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Booking deleted` };
}

export async function createBooking(input: CreateBookingManagementSchema) {
  console.log("Create Booking:");
  console.log({ input });

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Booking created` };
}

export async function editBooking(
  input: EditBookingManagementSchema & { id: string }
) {
  console.log("Edit Booking:");
  console.log({ input });

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Booking edited` };
}
