"use client";

import { editAgent } from "@/app/(dashboard)/account/user-management/agent/actions";
import { Agent } from "@/app/(dashboard)/account/user-management/agent/types";
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
import { AgentForm } from "../form/agent-form";

export const editAgentSchema = z.object({
  name: z.string().optional(),
  company: z.string().optional(),
  promo_group: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.boolean().optional(),
});

export type EditAgentSchema = z.infer<typeof editAgentSchema>;

interface EditAgentDialogProps
  extends React.ComponentPropsWithRef<typeof Dialog> {
  agent: Agent | null;
}

const EditAgentDialog = ({ agent, ...props }: EditAgentDialogProps) => {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<EditAgentSchema>({
    resolver: zodResolver(editAgentSchema),
    defaultValues: {
      name: agent?.name ?? "",
      company: agent?.company,
      promo_group: agent?.promo_group,
      email: agent?.email,
      phone: agent?.phone,
      status: agent?.status,
    },
  });

  function onSubmit(input: EditAgentSchema) {
    startTransition(async () => {
      if (!agent) return;
      const { success, message } = await editAgent({
        id: agent.id,
        ...input,
      });
      if (!success) {
        toast.error("Failed to edit agent");
        return;
      }
      form.reset(input);
      props.onOpenChange?.(false);
      toast.success(message || "Agent edited");
    });
  }

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Agent</DialogTitle>
          <DialogDescription>
            Edit details below and save the changes
          </DialogDescription>
        </DialogHeader>
        <AgentForm<EditAgentSchema> form={form} onSubmit={onSubmit}>
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
        </AgentForm>
      </DialogContent>
    </Dialog>
  );
};

export default EditAgentDialog;
