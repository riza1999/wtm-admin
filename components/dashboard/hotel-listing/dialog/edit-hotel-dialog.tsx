"use client";

import { editHotel } from "@/app/(dashboard)/hotel-listing/actions";
import { Hotel } from "@/app/(dashboard)/hotel-listing/types";
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
import { HotelForm } from "../form/hotel-form";

export const editHotelSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
});

export type EditHotelSchema = z.infer<typeof editHotelSchema>;

interface EditHotelDialogProps
  extends React.ComponentPropsWithRef<typeof Dialog> {
  hotel: Hotel | null;
}

const EditHotelDialog = ({ hotel, ...props }: EditHotelDialogProps) => {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<EditHotelSchema>({
    resolver: zodResolver(editHotelSchema),
    defaultValues: {
      name: hotel?.name ?? "",
      email: hotel?.email,
    },
  });

  function onSubmit(input: EditHotelSchema) {
    startTransition(async () => {
      if (!hotel) return;

      const { success } = await editHotel({
        id: hotel.id,
        ...input,
      });

      if (!success) {
        toast.error("Failed to edit hotel");
        return;
      }

      form.reset(input);
      props.onOpenChange?.(false);
      toast.success("Hotel edited");
    });
  }

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Hotel</DialogTitle>
          <DialogDescription>
            Edit details below and save the changes
          </DialogDescription>
        </DialogHeader>
        <HotelForm<EditHotelSchema> form={form} onSubmit={onSubmit}>
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
        </HotelForm>
      </DialogContent>
    </Dialog>
  );
};

export default EditHotelDialog;
