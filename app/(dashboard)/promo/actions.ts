"use server";

import { CreatePromoSchema, EditPromoSchema } from "./types";

export async function updatePromoStatus(promoId: string, status: boolean) {
  console.log("Update Promo Status");
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Promo status updated to ${status}` };
}

export async function deletePromo(promoId: string) {
  console.log("Delete Promo");
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: `Promo deleted` };
}

export async function createPromo(input: CreatePromoSchema) {
  console.log("Create Promo:");
  console.log({
    name: input.name,
    type: input.type,
    discount_percentage: input.discount_percentage,
    price_discount: input.price_discount,
    room_upgrade_to: input.room_upgrade_to,
    benefits: input.benefits,
    code: input.code,
    description: input.description,
    start_date: input.start_date,
    end_date: input.end_date,
    hotel_name: input.hotel_name,
    room_type: input.room_type,
    bed_type: input.bed_type,
    nights: input.nights,
    status: input.status,
  });

  // Validate conditional fields based on type
  if (input.type === "discount" && !input.discount_percentage) {
    return {
      success: false,
      message: "Discount percentage is required for discount type",
    };
  }
  if (input.type === "fixed_price" && !input.price_discount) {
    return {
      success: false,
      message: "Price discount is required for fixed price type",
    };
  }
  if (input.type === "room_upgrade" && !input.room_upgrade_to) {
    return {
      success: false,
      message: "Room upgrade destination is required for room upgrade type",
    };
  }
  if (input.type === "benefits" && !input.benefits) {
    return {
      success: false,
      message: "Benefits description is required for benefits type",
    };
  }

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: "Promo created successfully" };
}

export async function editPromo(input: EditPromoSchema & { id: string }) {
  console.log("Edit Promo:");
  console.log({
    id: input.id,
    name: input.name,
    type: input.type,
    discount_percentage: input.discount_percentage,
    price_discount: input.price_discount,
    room_upgrade_to: input.room_upgrade_to,
    benefits: input.benefits,
    code: input.code,
    description: input.description,
    start_date: input.start_date,
    end_date: input.end_date,
    hotel_name: input.hotel_name,
    room_type: input.room_type,
    bed_type: input.bed_type,
    nights: input.nights,
    status: input.status,
  });

  // Validate conditional fields based on type
  if (input.type === "discount" && !input.discount_percentage) {
    return {
      success: false,
      message: "Discount percentage is required for discount type",
    };
  }
  if (input.type === "fixed_price" && !input.price_discount) {
    return {
      success: false,
      message: "Price discount is required for fixed price type",
    };
  }
  if (input.type === "room_upgrade" && !input.room_upgrade_to) {
    return {
      success: false,
      message: "Room upgrade destination is required for room upgrade type",
    };
  }
  if (input.type === "benefits" && !input.benefits) {
    return {
      success: false,
      message: "Benefits description is required for benefits type",
    };
  }

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate success response
  return { success: true, message: "Promo updated successfully" };
}
