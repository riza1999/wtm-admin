"use server";

export async function updateRoomAvailability(hotelId: string) {
  console.log("Room availability updated");
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Room availability updated` };
}
