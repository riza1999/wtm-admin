import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import { UserForm } from "./user-form";
import { useState } from "react";

function AddSuperAdmin() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (data: {
    name: string;
    email: string;
    phone: string;
    status: boolean;
  }): Promise<boolean> => {
    try {
      // Simulate API call - replace with your actual API call
      console.log("Adding user:", data);

      // Example API call:
      // const response = await fetch('/api/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate success response
      const success = Math.random() > 0.3; // 70% success rate for demo

      if (success) {
        // Close modal on success
        setIsOpen(false);
        return true;
      } else {
        // Keep modal open on failure
        return false;
      }
    } catch (error) {
      console.error("Error adding user:", error);
      return false;
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <CirclePlus /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitButtonText="Add User"
        />
      </DialogContent>
    </Dialog>
  );
}

export default AddSuperAdmin;
