"use client";

import { editReport } from "@/app/(dashboard)/report/actions";
import { ReportSummary } from "@/app/(dashboard)/report/types";
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
import { ReportForm } from "../form/report-form";

export const editReportSchema = z.object({
  name: z.string().optional(),
  company: z.string().optional(),
  email: z.string().optional(),
  hotel_name: z.string().optional(),
});

export type EditReportSchema = z.infer<typeof editReportSchema>;

interface EditReportDialogProps
  extends React.ComponentPropsWithRef<typeof Dialog> {
  report: ReportSummary | null;
}

const EditReportDialog = ({ report, ...props }: EditReportDialogProps) => {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<EditReportSchema>({
    resolver: zodResolver(editReportSchema),
    defaultValues: {},
  });

  function onSubmit(input: EditReportSchema) {
    startTransition(async () => {
      if (!report) return;

      const { success } = await editReport({
        id: "1",
        ...input,
      });

      if (!success) {
        toast.error("Failed to edit report");
        return;
      }

      form.reset(input);
      props.onOpenChange?.(false);
      toast.success("Report edited");
    });
  }

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Report</DialogTitle>
          <DialogDescription>
            Edit details below and save the changes
          </DialogDescription>
        </DialogHeader>
        <ReportForm<EditReportSchema> form={form} onSubmit={onSubmit}>
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
        </ReportForm>
      </DialogContent>
    </Dialog>
  );
};

export default EditReportDialog;
