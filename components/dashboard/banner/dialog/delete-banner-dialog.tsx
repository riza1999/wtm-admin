"use client";

import { deleteBanner } from "@/app/(dashboard)/banner/actions";
import { Banner } from "@/app/(dashboard)/banner/types";
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
import { Loader } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface DeleteBannerDialogProps {
  banners: Banner[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  showTrigger?: boolean;
}

const DeleteBannerDialog = ({
  banners,
  open,
  onOpenChange,
  onSuccess,
  showTrigger = true,
}: DeleteBannerDialogProps) => {
  const [isPending, startTransition] = React.useTransition();

  const handleDelete = () => {
    if (banners.length === 0) return;

    startTransition(async () => {
      const deletePromises = banners.map((banner) =>
        deleteBanner(String(banner.id))
      );
      const results = await Promise.all(deletePromises);

      const hasError = results.some((result) => !result.success);

      if (hasError) {
        toast.error("Failed to delete some banners");
        return;
      }

      toast.success(
        banners.length === 1
          ? "Banner deleted successfully"
          : `${banners.length} banners deleted successfully`
      );

      onOpenChange(false);
      onSuccess?.();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Delete Banner{banners.length > 1 ? "s" : ""}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            {banners.length === 1 ? (
              <>
                <strong>{banners[0]?.title}</strong>?
              </>
            ) : (
              <>
                <strong>{banners.length} banners</strong>?
              </>
            )}{" "}
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 pt-2 sm:space-x-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending && <Loader className="animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBannerDialog;
