import { HotelForm } from "@/components/dashboard/hotel-listing/form/hotel-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { fetchHotelDetail } from "./fetch";

const CreateHotelPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const hotel = await fetchHotelDetail();

  // Add the ID to the hotel object for edit mode
  const hotelWithId = { ...hotel, id };

  return (
    <div className="space-y-8">
      <Button variant={"ghost"} asChild>
        <Link href={"/hotel-listing"}>
          <ChevronLeft />
          Back
        </Link>
      </Button>

      <HotelForm hotel={hotelWithId} />
    </div>
  );
};

export default CreateHotelPage;
