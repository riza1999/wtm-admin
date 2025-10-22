"use server";

import { RoomAvailabilityHotel } from "./types";

export async function updateRoomAvailability(
  hotelId: string,
  period: string,
  data: RoomAvailabilityHotel[]
) {
  console.log("Room availability updated", hotelId, period, data);

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Room availability updated` };
}
