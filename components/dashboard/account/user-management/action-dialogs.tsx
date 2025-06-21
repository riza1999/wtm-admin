import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { toast } from "sonner";
import { useState } from "react";
import { UserForm } from "./user-form";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: boolean;
}

interface ActionDialogsProps {
  user: User;
  onEdit: (
    userId: number,
    data: { name: string; email: string; phone: string; status: boolean }
  ) => void;
  onDelete?: (userId: number) => void;
}

export function ActionDialogs({ user, onEdit, onDelete }: ActionDialogsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    if (onDelete) {
      setIsDeleting(true);
      try {
        // Simulate API call - replace with your actual API call
        console.log("Deleting user:", user.id);
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Simulate success response
        const success = Math.random() > 0.2; // 80% success rate for demo
        if (success) {
          onDelete(user.id);
          toast.success("User deleted successfully!");
          setIsDeleteDialogOpen(false); // Close dialog only on success
        } else {
          toast.error("Failed to delete user. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("An unexpected error occurred. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DialogTrigger asChild>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user profile. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            initialData={{
              name: user.name,
              email: user.email,
              phone: user.phone,
              status: user.status,
            }}
            onSubmit={async (data: {
              name: string;
              email: string;
              phone: string;
              status: boolean;
            }) => {
              try {
                // Simulate API call - replace with your actual API call
                console.log("Editing user:", data);

                // Simulate network delay
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Simulate success response
                const success = Math.random() > 0.2; // 80% success rate for demo

                if (success) {
                  // Call the onEdit callback if provided
                  onEdit(user.id, data);
                  return true;
                } else {
                  // Keep modal open on failure
                  return false;
                }
              } catch (error) {
                console.error("Error editing user:", error);
                return false;
              }
            }}
            onCancel={() => {}}
            submitButtonText="Save changes"
          />
        </DialogContent>
      </Dialog>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            type="submit"
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
