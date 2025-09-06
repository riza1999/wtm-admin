"use client";

import { createPromo } from "@/app/(dashboard)/promo/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { PromoForm } from "../form/promo-form";

export const createPromoSchema = z
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

export type CreatePromoSchema = z.infer<typeof createPromoSchema>;

const CreatePromoDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<CreatePromoSchema>({
    resolver: zodResolver(createPromoSchema),
    defaultValues: {
      name: "",
      type: "discount",
      discount_percentage: 0,
      price_discount: 0,
      room_upgrade_to: "",
      benefits: "",
      code: "",
      description: "",
      start_date: "",
      end_date: "",
      hotel_name: "",
      room_type: "",
      bed_type: "",
      nights: 1,
      status: true,
    },
  });

  function onSubmit(input: CreatePromoSchema) {
    startTransition(async () => {
      const { success } = await createPromo(input);

      if (!success) {
        toast.error("Failed to create promo");
        return;
      }

      form.reset();
      setOpen(false);
      toast.success("Promo created successfully");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          Create Promo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create Promo</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new promo
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
              Create
            </Button>
          </DialogFooter>
        </PromoForm>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePromoDialog;
