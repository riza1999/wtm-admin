import { SearchParams } from "@/types";
import { RoomAvailabilityHotel, RoomAvailabilityTableResponse } from "./types";
import { format } from "date-fns/format";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<RoomAvailabilityTableResponse> => {
  // Parse the date from searchParams and format it as "MMM yyyy"
  let formattedDate = "";
  if (searchParams.period) {
    const [month, year] = (searchParams.period as string)
      .split("-")
      .map(Number);
    const date = new Date(year, month - 1);
    formattedDate = format(date, "MMMM yyyy");
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "Ibis Hotel & Convention",
      region: "Jakarta",
      period: formattedDate || "June 2025",
      rooms: [
        {
          id: "11",
          name: "Superior Room",
          availability: [
            true,
            false,
            true,
            true,
            false,
            true,
            true,
            true,
            false,
            true,
            true,
            false,
            true,
            true,
            true,
            false,
            true,
            true,
            false,
            true,
            true,
            true,
            false,
            true,
            true,
            false,
            true,
            true,
            true,
            true,
          ],
        },
        {
          id: "12",
          name: "Deluxe Room",
          availability: [
            true,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            true,
            false,
            true,
            false,
            true,
            false,
            false,
            false,
            false,
            true,
            true,
            true,
            false,
            true,
            true,
            false,
            true,
            false,
            false,
            false,
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Atria Hotel",
      region: "Denpasar",
      period: formattedDate || "June 2025",
      rooms: [
        {
          id: "11",
          name: "Superior Room",
          availability: [
            true,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            true,
            false,
            true,
            false,
            true,
            false,
            true,
            false,
          ],
        },
      ],
    },
  ] as RoomAvailabilityHotel[];

  return {
    success: true,
    data,
    pageCount: 2,
  };
};
