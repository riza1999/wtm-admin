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
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export const UpdateRoomAvailabilityDrawer = ({
  roomAvailabilityHotel,
  onSuccess,
  ...props
}: UpdateRoomAvailabilityDrawerProps) => {
  const [isUpdatePending, startUpdateTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  function onUpdate() {
    startUpdateTransition(async () => {
      const hotelId = String(roomAvailabilityHotel?.id);

      toast.promise(updateRoomAvailability(hotelId), {
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
    roomAvailabilityHotel?.rooms?.length &&
    roomAvailabilityHotel?.rooms[0]?.availability
      ? Array.from(
          { length: roomAvailabilityHotel?.rooms[0].availability.length },
          (_, i) => String(i + 1).padStart(2, "0")
        )
      : [];

  return (
    <Drawer {...props}>
      <DrawerHeader>
        <DrawerTitle className="sr-only">Update Room Availability</DrawerTitle>
      </DrawerHeader>
      <DrawerContent>
        <div className="px-12 pt-10 pb-12 space-y-8">
          <h3 className="text-2xl font-semibold text-center">
            {roomAvailabilityHotel?.name}
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
                      {roomAvailabilityHotel?.period}
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
                  {roomAvailabilityHotel?.rooms.map((roomType, roomIndex) => (
                    <TableRow key={roomIndex} className="border-b">
                      <TableCell className="p-4 font-medium">
                        {roomType.name}
                      </TableCell>
                      {roomType.availability.map((isAvailable, dayIndex) => (
                        <TableCell key={dayIndex} className="p-1">
                          <div
                            className={`h-8 w-full rounded cursor-pointer transition-colors hover:opacity-80 ${
                              isAvailable ? "bg-green-500" : "bg-red-500"
                            }`}
                            // onClick={() => toggleAvailability(roomIndex, dayIndex)}
                            title={`Click to toggle availability for ${
                              roomType.name
                            } on day ${dayIndex + 1}`}
                          />
                        </TableCell>
                      ))}
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
              <DialogContent>
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
