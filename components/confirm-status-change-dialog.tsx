import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader } from "lucide-react";

interface ConfirmStatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
  children?: React.ReactNode;
}

export function ConfirmStatusChangeDialog({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  isLoading,
  children,
}: ConfirmStatusChangeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false}>
        <div className="flex flex-col items-center text-center gap-1">
          <AlertTriangle
            className="mb-2 size-10 text-yellow-500"
            aria-hidden="true"
          />
          <DialogTitle>Change Approval Status</DialogTitle>
          <div className="my-2 w-full">
            <div className="border-t border-muted-foreground/20 w-full" />
          </div>
          <DialogDescription>
            You're about to update the approval status for this agent.
            <br />
            This change may affect their access in the system.
          </DialogDescription>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
