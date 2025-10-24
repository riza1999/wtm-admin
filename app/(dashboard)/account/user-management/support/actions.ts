"use server";

import { CreateSupportSchema } from "@/components/dashboard/account/user-management/support/dialog/create-support-dialog";
import { EditSupportSchema } from "@/components/dashboard/account/user-management/support/dialog/edit-support-dialog";
import { apiCall } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createSupport(input: CreateSupportSchema) {
  try {
    const body = {
      ...input,
      role: "support",
    };

    const response = await apiCall("users", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to create support",
      };
    }

    revalidatePath("/account/user-management", "layout");

    return {
      success: true,
      message: response.message ?? `Support created`,
    };
  } catch (error) {
    console.error("Error creating support:", error);

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
        error instanceof Error ? error.message : "Failed to create support",
    };
  }
}

export async function editSupport(input: EditSupportSchema & { id: string }) {
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
        message: response.message || "Failed to update support",
      };
    }

    revalidatePath("/account/user-management", "layout");

    return {
      success: true,
      message: response.message ?? `Support updated`,
    };
  } catch (error) {
    console.error("Error updating support:", error);

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
        error instanceof Error ? error.message : "Failed to update support",
    };
  }
}
