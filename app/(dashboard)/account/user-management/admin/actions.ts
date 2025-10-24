"use server";

import { CreateAdminSchema } from "@/components/dashboard/account/user-management/admin/dialog/create-admin-dialog";
import { EditAdminSchema } from "@/components/dashboard/account/user-management/admin/dialog/edit-admin-dialog";
import { apiCall } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createAdmin(input: CreateAdminSchema) {
  try {
    const body = {
      ...input,
      role: "admin",
    };

    const response = await apiCall("users", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to create admin",
      };
    }

    revalidatePath("/account/user-management", "layout");

    return {
      success: true,
      message: response.message ?? `Admin created`,
    };
  } catch (error) {
    console.error("Error creating admin:", error);

    // Handle API error responses with specific messages
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create admin",
    };
  }
}

export async function editAdmin(input: EditAdminSchema & { id: string }) {
  try {
    const body = {
      ...input,
      user_id: input.id,
    };

    const response = await apiCall("users", {
      method: "PUT",
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to update admin",
      };
    }

    revalidatePath("/account/user-management", "layout");

    return {
      success: true,
      message: response.message ?? `Admin updated`,
    };
  } catch (error) {
    console.error("Error updating admin:", error);

    // Handle API error responses with specific messages
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update admin",
    };
  }
}
