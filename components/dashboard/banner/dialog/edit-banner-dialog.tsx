"use client";

import { updateBanner } from "@/app/(dashboard)/banner/actions";
import {
  Banner,
  UpdateBannerSchema,
  updateBannerSchema,
} from "@/app/(dashboard)/banner/types";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditBannerDialogProps {
  banner: Banner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditBannerDialog = ({
  banner,
  open,
  onOpenChange,
}: EditBannerDialogProps) => {
  const [isPending, startTransition] = React.useTransition();
  const [imagePreview, setImagePreview] = React.useState<string | null>(
    banner?.image_url || null
  );

  const form = useForm<UpdateBannerSchema>({
    resolver: zodResolver(updateBannerSchema),
    defaultValues: {
      title: banner?.title || "",
      description: banner?.description || "",
      image: undefined,
    },
  });

  // Update form when banner changes
  React.useEffect(() => {
    if (banner) {
      form.reset({
        title: banner.title,
        description: banner.description || "",
        image: undefined,
      });
      setImagePreview(banner.image_url);
    }
  }, [banner, form]);

  function onSubmit(input: UpdateBannerSchema) {
    if (!banner) return;

    startTransition(async () => {
      const formData = new FormData();

      if (input.title) {
        formData.append("title", input.title);
      }
      if (input.description) {
        formData.append("description", input.description);
      }
      if (input.image) {
        formData.append("image", input.image);
      }

      const { success, message } = await updateBanner(
        String(banner.id),
        formData
      );

      if (!success) {
        toast.error(message || "Failed to update banner");
        return;
      }

      onOpenChange(false);
      toast.success(message || "Banner updated successfully");
    });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!banner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Banner</DialogTitle>
          <DialogDescription>Update the banner details below</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter banner title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter banner description"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>
                    Image (Optional - leave empty to keep current)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {imagePreview && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {form.watch("image")
                    ? "New Image Preview:"
                    : "Current Image:"}
                </p>
                <div className="relative h-48 w-full overflow-hidden rounded-md border">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 pt-2 sm:space-x-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader className="animate-spin" />}
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBannerDialog;
