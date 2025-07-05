"use client";

import { editBooking } from "@/app/(dashboard)/booking-management/actions";
import { BookingManagement } from "@/app/(dashboard)/booking-management/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { BookingManagementForm } from "../form/booking-management-form";

export const editBookingManagementSchema = z.object({
  guest_name: z.string().optional(),
  agent_name: z.string().optional(),
  agent_company: z.string().optional(),
  group_promo: z.string().optional(),
  booking_id: z.string().optional(),
  booking_status: z.enum(["confirmed", "rejected", "in review"]).optional(),
  payment_status: z.enum(["paid", "unpaid"]).optional(),
  promo_id: z.string().optional(),
});

export type EditBookingManagementSchema = z.infer<
  typeof editBookingManagementSchema
>;

interface EditBookingManagementDialogProps
  extends React.ComponentPropsWithRef<typeof Dialog> {
  booking: BookingManagement | null;
}

const EditBookingManagementDialog = ({
  booking,
  ...props
}: EditBookingManagementDialogProps) => {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<EditBookingManagementSchema>({
    resolver: zodResolver(editBookingManagementSchema),
    defaultValues: {
      guest_name: booking?.guest_name ?? "",
      agent_name: booking?.agent_name ?? "",
      agent_company: booking?.agent_company ?? "",
      group_promo: booking?.group_promo ?? "",
      booking_id: booking?.booking_id ?? "",
      booking_status: booking?.booking_status ?? "confirmed",
      payment_status: booking?.payment_status ?? "paid",
      promo_id: booking?.promo_id ?? "",
    },
  });

  function onSubmit(input: EditBookingManagementSchema) {
    startTransition(async () => {
      if (!booking) return;

      const { success } = await editBooking({
        id: booking.id,
        ...input,
      });

      if (!success) {
        toast.error("Failed to edit booking");
        return;
      }

      form.reset(input);
      props.onOpenChange?.(false);
      toast.success("Booking edited");
    });
  }

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogDescription>
            Edit details below and save the changes
          </DialogDescription>
        </DialogHeader>
        <BookingManagementForm<EditBookingManagementSchema>
          form={form}
          onSubmit={onSubmit}
        >
          <DialogFooter className="gap-2 pt-2 sm:space-x-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending}>
              {isPending && <Loader className="animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </BookingManagementForm>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingManagementDialog;
