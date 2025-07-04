import { updateRoomAvailability } from "@/app/(dashboard)/hotel-listing/room-availability/actions";
import { RoomAvailabilityHotel } from "@/app/(dashboard)/hotel-listing/room-availability/types";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface UpdateRoomAvailabilityDrawerProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  roomAvailabilityHotel: RoomAvailabilityHotel | null;
  period: string | null;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export const UpdateRoomAvailabilityDrawer = ({
  roomAvailabilityHotel,
  period,
  onSuccess,
  ...props
}: UpdateRoomAvailabilityDrawerProps) => {
  const [isUpdatePending, startUpdateTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);
  const [localHotel, setLocalHotel] =
    React.useState<RoomAvailabilityHotel | null>(null);

  React.useEffect(() => {
    setLocalHotel(
      roomAvailabilityHotel
        ? JSON.parse(JSON.stringify(roomAvailabilityHotel))
        : null
    );
  }, [roomAvailabilityHotel]);

  function onUpdate() {
    if (!period) {
      toast.error("Please select a period");
      return;
    }

    if (!localHotel) {
      toast.error("Please select a hotel");
      return;
    }

    startUpdateTransition(async () => {
      const hotelId = String(localHotel?.id);

      toast.promise(updateRoomAvailability(hotelId, period, localHotel), {
        // loading: "Deleting hotel...",
        success: (data) => data.message,
        error: "Failed to update room availability",
      });

      setOpen(false);
      props.onOpenChange?.(false);
      onSuccess?.();
    });
  }

  const days =
    localHotel?.rooms?.length && localHotel?.rooms[0]?.availability
      ? Array.from(
          { length: localHotel?.rooms[0].availability.length },
          (_, i) => String(i + 1).padStart(2, "0")
        )
      : [];

  return (
    <Drawer {...props}>
      <DrawerHeader>
        <DrawerTitle className="sr-only">Update Room Availability</DrawerTitle>
      </DrawerHeader>
      <DrawerContent aria-describedby="update-room-availability-drawer">
        <div className="px-12 pt-10 pb-12 space-y-8">
          <h3 className="text-2xl font-semibold text-center">
            {localHotel?.name}
          </h3>
          {/* Availability Calendar */}
          <div className="rounded-lg border  overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead
                      className="text-left p-4 font-semibold min-w-[200px] border-r"
                      rowSpan={2}
                    >
                      Room Type
                    </TableHead>
                    <TableHead
                      className="text-center p-2 font-semibold"
                      colSpan={days.length}
                    >
                      {localHotel?.period}
                    </TableHead>
                  </TableRow>
                  <TableRow className="border-b">
                    {days.map((day) => (
                      <TableHead
                        key={day}
                        className="text-center p-2 font-semibold min-w-[40px]"
                      >
                        {day}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localHotel?.rooms.map((roomType, roomIndex) => (
                    <TableRow key={roomIndex} className="border-b">
                      <TableCell className="p-4 font-medium">
                        {roomType.name}
                      </TableCell>
                      {roomType.availability.map((isAvailable, dayIndex) => {
                        // Determine if this cell has been edited
                        const original =
                          roomAvailabilityHotel?.rooms?.[roomIndex]
                            ?.availability?.[dayIndex];
                        const isEdited =
                          original !== undefined && isAvailable !== original;
                        return (
                          <TableCell key={dayIndex} className="p-1">
                            <div
                              className={`h-8 w-full rounded cursor-pointer transition-colors hover:opacity-80
                                ${isAvailable ? "bg-green-500" : "bg-red-500"}
                                ${
                                  isEdited
                                    ? "bg-amber-300 border-2 border-amber-400"
                                    : ""
                                }
                              `}
                              onClick={() => {
                                // Only update local state, do not call updateRoomAvailability
                                const updatedHotel = JSON.parse(
                                  JSON.stringify(localHotel)
                                );
                                updatedHotel.rooms[roomIndex].availability[
                                  dayIndex
                                ] = !isAvailable;
                                setLocalHotel(updatedHotel);
                              }}
                              title={`Click to toggle availability for ${
                                roomType.name
                              } on day ${dayIndex + 1}`}
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Legend and Save Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
                <span className="">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-500 rounded"></div>
                <span className="">Not Available</span>
              </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">Save Changes</Button>
              </DialogTrigger>
              <DialogContent aria-describedby="update-room-availability-dialog">
                <DialogHeader>
                  <DialogTitle>Confirm Changes</DialogTitle>
                  <DialogDescription>
                    Are you absolutely sure to save the changes?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:space-x-0">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    aria-label="Delete selected rows"
                    onClick={onUpdate}
                    disabled={isUpdatePending}
                  >
                    {isUpdatePending && (
                      <Loader
                        className="mr-2 size-4 animate-spin"
                        aria-hidden="true"
                      />
                    )}
                    Apply Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
