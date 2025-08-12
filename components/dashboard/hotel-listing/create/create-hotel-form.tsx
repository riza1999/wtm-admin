"use client";

import {
  HotelDetail,
  ImageFile,
  Room,
} from "@/app/(dashboard)/hotel-listing/create/types";
import { ImageUpload } from "@/components/dashboard/hotel-listing/create/image-upload";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { HotelInfoUpload } from "./info-upload";
import { RoomCardInput } from "./room-card-input";

interface CreateHotelFormProps {
  hotel: HotelDetail;
}

export function CreateHotelForm({ hotel }: CreateHotelFormProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [rooms, setRooms] = useState<Room[]>(hotel.rooms);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImagesChange = useCallback((newImages: ImageFile[]) => {
    setImages(newImages);
  }, []);

  const addNewRoom = useCallback(() => {
    const newRoom: Room = {
      id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      images: [],
      features: [],
      options: [
        {
          label: "Without Breakfast",
          price: 0,
        },
        {
          label: "With Breakfast",
          price: 0,
        },
      ],
    };
    setRooms((prevRooms) => [...prevRooms, newRoom]);
  }, []);

  const removeRoom = useCallback((id: string) => {
    setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
  }, []);

  const updateRoom = useCallback((id: string, updatedRoom: Room) => {
    setRooms((prevRooms) => {
      const newRooms = [...prevRooms];
      const index = newRooms.findIndex((room) => room.id === id);
      if (index !== -1) {
        newRooms[index] = { ...updatedRoom, id };
      }
      return newRooms;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    if (rooms.length === 0) {
      alert("Please add at least one room");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Add images
      images.forEach((image, index) => {
        formData.append(`images`, image.file);
        if (image.isMain) {
          formData.append("mainImageIndex", index.toString());
        }
      });

      // Add rooms data
      formData.append("rooms", JSON.stringify(rooms));

      // Add other form data here when you implement the other sections
      // formData.append('name', hotelName);
      // formData.append('description', description);
      // etc.

      // Simulate API call
      console.log("Submitting form with:", {
        images: images.map((img) => ({
          name: img.file.name,
          isMain: img.isMain,
        })),
        rooms: rooms,
        formData: Object.fromEntries(formData.entries()),
      });

      // TODO: Replace with actual API call
      // const response = await fetch('/api/hotels', {
      //   method: 'POST',
      //   body: formData
      // });

      alert("Hotel created successfully!");
    } catch (error) {
      console.error("Error creating hotel:", error);
      alert("Error creating hotel. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Upload Image Section */}
      <section className="space-y-6">
        <ImageUpload
          onImagesChange={handleImagesChange}
          maxImages={10}
          maxSizeMB={5}
        />
      </section>

      {/* Info Section */}
      <section>
        <HotelInfoUpload
          name={hotel.name}
          location={hotel.location}
          rating={hotel.rating}
          isPromoted={hotel.isPromoted}
          promoText={hotel.promoText}
          price={hotel.price}
          description={hotel.description}
          facilities={hotel.facilities}
          nearby={hotel.nearby}
        />
      </section>

      {/* Room Card Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Room Configuration</h2>
          <Button
            type="button"
            onClick={addNewRoom}
            className="inline-flex items-center gap-2"
          >
            <PlusCircle className="size-4" />
            Add New Room
          </Button>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-4">No rooms added yet</p>
            <Button
              type="button"
              onClick={addNewRoom}
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <PlusCircle className="size-4" />
              Add Your First Room
            </Button>
          </div>
        ) : (
          rooms.map((room, i) => (
            <div key={room.id}>
              <RoomCardInput
                {...room}
                onUpdate={(updatedRoom) => updateRoom(room.id, updatedRoom)}
                onRemove={removeRoom}
              />
            </div>
          ))
        )}
      </section>

      {/* Submit Button */}
      <section className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || images.length === 0 || rooms.length === 0}
        >
          {isSubmitting ? "Creating..." : "Create Hotel"}
        </Button>
      </section>
    </form>
  );
}
