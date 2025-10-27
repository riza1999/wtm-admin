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

export const editPromoSchema = z.object({
  description: z.string().min(1, "Description is required"),
  detail: z.union([z.string(), z.number()]),
  promo_name: z.string().min(1, "Promo name is required"),
  promo_code: z.string().min(1, "Promo code is required"),
  promo_type: z.string().min(1, "Promo type is required"),
  room_type_id: z.coerce.number().min(1, "Room type is required"),
  total_night: z.number().min(1, "Total night is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  is_active: z.boolean(),
});

export type EditPromoSchema = z.infer<typeof editPromoSchema>;

interface EditPromoDialogProps {
  promo: Promo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const promoTypeConversion = (promoType: string | undefined) => {
  if (!promoType) return "1";

  switch (promoType.toLowerCase()) {
    case "discount":
      return "1";
    case "fixed price":
      return "2";
    case "room upgrade":
      return "3";
    case "benefits":
      return "4";
    default:
      return "1";
  }
};

const promoDetailConversion = (promoType: string, promoDetail: any) => {
  if (!promoType) return "";

  switch (promoType) {
    case "1":
      return promoDetail.discount_percentage;
    case "2":
      return promoDetail.fixed_price;
    case "3":
      return promoDetail.upgraded_to_id;
    case "4":
      return promoDetail.benefit_note;
    default:
      return "";
  }
};

const EditPromoDialog = ({
  promo,
  open,
  onOpenChange,
}: EditPromoDialogProps) => {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<EditPromoSchema>({
    resolver: zodResolver(editPromoSchema),
    defaultValues: {
      description: promo?.promo_description || "",
      detail:
        promoDetailConversion(
          promoTypeConversion(promo?.promo_type),
          promo?.promo_detail
        ) || "",
      promo_name: promo?.promo_name || "",
      promo_code: promo?.promo_code || "",
      promo_type: promoTypeConversion(promo?.promo_type) || "1",
      total_night: 0,
      start_date: promo?.promo_start_date || "",
      end_date: promo?.promo_end_date || "",
      is_active: promo?.is_active || true,
    },
  });

  function onSubmit(input: EditPromoSchema) {
    if (!promo) return;

    startTransition(async () => {
      const { success } = await editPromo({ ...input, id: String(promo.id) });

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
