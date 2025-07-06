"use server";

import { CreateHotelSchema } from "@/components/dashboard/hotel-listing/dialog/create-hotel-dialog";
import { EditHotelSchema } from "@/components/dashboard/hotel-listing/dialog/edit-hotel-dialog";

export async function deleteHotel(hotelId: string) {
  console.log("Delete Hotel");
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Hotel deleted` };
}

export async function createHotel(input: CreateHotelSchema) {
  console.log("Create Hotel:");
  console.log({ input });

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Hotel created` };
}

export async function editHotel(input: EditHotelSchema & { id: string }) {
  console.log("Edit Hotel:");
  console.log({ input });

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Hotel edited` };
}
