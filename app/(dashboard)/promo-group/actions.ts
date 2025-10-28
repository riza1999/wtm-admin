"use server";

import { apiCall } from "@/lib/api";
import { revalidatePath } from "next/cache";
import {
  CreatePromoGroupSchema,
  EditPromoGroupSchema,
  PromoGroupMembers,
  PromoGroupPromos,
} from "./types";

// Define a standard response type
interface ActionResponse {
  success: boolean;
  message: string;
}

export async function deletePromoGroup(
  promoId: string
): Promise<ActionResponse> {
  console.log("Delete Promo");
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Promo deleted` };
}

export async function createPromoGroup(
  input: CreatePromoGroupSchema
): Promise<ActionResponse> {
  try {
    const body = {
      ...input,
    };

    const response = await apiCall("promo-groups", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to create promo group",
      };
    }

    revalidatePath("/promo-group", "layout");

    return {
      success: true,
      message: response.message || "Promo group created",
    };
  } catch (error) {
    console.error("Error creating promo group:", error);

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
        error instanceof Error ? error.message : "Failed to create promo group",
    };
  }
}

export async function editPromoGroup(
  input: EditPromoGroupSchema & { id: string }
): Promise<ActionResponse> {
  console.log("Edit Promo:");
  console.log({ input });

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Promo edited` };
}

export async function editPromoGroupMembers(
  id: string,
  members: PromoGroupMembers[]
): Promise<ActionResponse> {
  console.log("Edit Promo Members:");
  console.log({ id, members });

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Members has been edited` };
}

export async function editPromoGroupPromos(
  id: string,
  promos: PromoGroupPromos[]
): Promise<ActionResponse> {
  console.log("Edit Promo Group Promos:");
  console.log({ id, promos });

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Promos has been updated` };
}
