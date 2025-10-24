"use client";

import { editPromo } from "@/app/(dashboard)/promo/actions";
import { Promo } from "@/app/(dashboard)/promo/types";
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
import { PromoForm } from "../form/promo-form";

export const editPromoSchema = z
  .object({
    name: z.string().min(1, "Promo name is required"),
    type: z.enum(["discount", "fixed_price", "room_upgrade", "benefits"]),
    // Conditional fields based on type
    discount_percentage: z.number().min(0).max(100).optional(),
    price_discount: z.number().min(0).optional(),
    room_upgrade_to: z.string().optional(),
    benefits: z.string().optional(),
    code: z.string().min(1, "Promo code is required"),
    description: z.string().min(1, "Description is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    hotel_name: z.string().min(1, "Hotel name is required"),
    room_type: z.string().min(1, "Room type is required"),
    bed_type: z.string().min(1, "Bed type is required"),
    nights: z.number().min(1, "Nights must be at least 1"),
    status: z.boolean(),
  })
  .refine(
    (data) => {
      // Conditional validation based on type
      if (data.type === "discount") {
        return (
          data.discount_percentage !== undefined && data.discount_percentage > 0
        );
      }
      if (data.type === "fixed_price") {
        return data.price_discount !== undefined && data.price_discount > 0;
      }
      if (data.type === "room_upgrade") {
        return (
          data.room_upgrade_to !== undefined && data.room_upgrade_to.length > 0
        );
      }
      if (data.type === "benefits") {
        return data.benefits !== undefined && data.benefits.length > 0;
      }
      return true;
    },
    {
      message: "Required field for selected promo type is missing",
      path: ["type"],
    }
  );

export type EditPromoSchema = z.infer<typeof editPromoSchema>;

interface EditPromoDialogProps {
  promo: Promo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditPromoDialog = ({
  promo,
  open,
  onOpenChange,
}: EditPromoDialogProps) => {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<EditPromoSchema>({
    resolver: zodResolver(editPromoSchema),
    defaultValues: {
      name: promo?.promo_name || "",
      type: (promo?.promo_type as EditPromoSchema["type"]) || "discount",
      // discount_percentage: promo?.discount_percentage || 0,
      // price_discount: promo?.price_discount || 0,
      // room_upgrade_to: promo?.room_upgrade_to || "",
      // benefits: promo?.benefits || "",
      // code: promo?.code || "",
      // description: promo?.description || "",
      // start_date: promo?.start_date || "",
      // end_date: promo?.end_date || "",
      // hotel_name: promo?.hotel_name || "",
      // room_type: promo?.room_type || "",
      // bed_type: promo?.bed_type || "",
      // nights: promo?.nights || 1,
      // status: promo?.status || true,
    },
  });

  // Update form values when promo changes
  React.useEffect(() => {
    if (promo) {
      form.reset({
        // name: promo.name,
        // type: promo.type,
        // discount_percentage: promo.discount_percentage || 0,
        // price_discount: promo.price_discount || 0,
        // room_upgrade_to: promo.room_upgrade_to || "",
        // benefits: promo.benefits || "",
        // code: promo.code,
        // description: promo.description,
        // start_date: promo.start_date,
        // end_date: promo.end_date,
        // hotel_name: promo.hotel_name,
        // room_type: promo.room_type,
        // bed_type: promo.bed_type,
        // nights: promo.nights,
        // status: promo.status,
      });
    }
  }, [promo, form]);

  function onSubmit(input: EditPromoSchema) {
    if (!promo) return;

    startTransition(async () => {
      // const { success } = await editPromo({ ...input, id: promo.id });

      const success = true;

      if (!success) {
        toast.error("Failed to update promo");
        return;
      }

      form.reset();
      onOpenChange(false);
      toast.success("Promo updated successfully");
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Promo</DialogTitle>
          <DialogDescription>
            Update the details below to modify the promo
          </DialogDescription>
        </DialogHeader>
        <PromoForm form={form} onSubmit={onSubmit}>
          <DialogFooter className="gap-2 pt-2 sm:space-x-0">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={isPending}>
              {isPending && <Loader className="animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </PromoForm>
      </DialogContent>
    </Dialog>
  );
};

export default EditPromoDialog;
