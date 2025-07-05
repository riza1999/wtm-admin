"use client";

import type { Row } from "@tanstack/react-table";
import { Loader } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { updateBookingStatus } from "@/app/(dashboard)/booking-management/actions";
import { BookingManagement } from "@/app/(dashboard)/booking-management/types";
import { ImageGrid } from "@/components/dashboard/account/agent-control/image-grid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DetailBookingManagementDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  bookingManagement: Row<BookingManagement>["original"][];
  onSuccess?: () => void;
}

export function DetailBookingManagementDialog({
  bookingManagement,
  onSuccess,
  ...props
}: DetailBookingManagementDialogProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition();
  const [variant, setVariant] = React.useState<"approved" | "rejected" | null>(
    null
  );

  // Sample image data - replace with actual data from bookingManagement
  const images = [
    { title: "Booking Selfie Photo" },
    { title: "Identity Card" },
    { title: "Certificate" },
    { title: "Name Card" },
    { title: "Others" },
  ];

  function onUpdate({ variant }: { variant: "approved" | "rejected" }) {
    setVariant(variant);

    startUpdateTransition(async () => {
      toast.promise(updateBookingStatus("1", variant), {
        loading: "Updating booking status...",
        success: (data) => data.message,
        error: "Failed to update booking status",
      });
      props.onOpenChange?.(false);
      onSuccess?.();
      setVariant(null);
    });
  }

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="sr-only">
            Detail Booking Management
          </DialogTitle>
        </DialogHeader>
        <ImageGrid images={images} />
        <DialogFooter className="gap-2 sm:space-x-0 sm:justify-center">
          <Button
            aria-label="Approve Booking"
            onClick={() => onUpdate({ variant: "approved" })}
            disabled={isUpdatePending}
          >
            {variant === "approved" && isUpdatePending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Approve
          </Button>
          <Button
            aria-label="Reject Booking"
            variant="destructive"
            onClick={() => onUpdate({ variant: "rejected" })}
            disabled={isUpdatePending}
          >
            {variant === "rejected" && isUpdatePending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
