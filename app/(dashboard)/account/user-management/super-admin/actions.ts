"use server";

import { CreateSuperAdminSchema } from "@/components/dashboard/account/user-management/super-admin/dialog/create-super-admin-dialog";
import { EditSuperAdminSchema } from "@/components/dashboard/account/user-management/super-admin/dialog/edit-super-admin-dialog";

export async function updateSuperAdminStatus(
  superAdminId: string,
  status: boolean
) {
  console.log("Update Super Admin Status");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    success: true,
    message: `Super Admin status updated to ${status ? "Active" : "Inactive"}`,
  };
}

export async function deleteSuperAdmin(superAdminId: string) {
  console.log("Delete Super Admin");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true, message: `Super Admin deleted` };
}

export async function createSuperAdmin(input: CreateSuperAdminSchema) {
  console.log("Create Super Admin:");
  console.log({ input });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true, message: `Super Admin created` };
}

export async function editSuperAdmin(
  input: EditSuperAdminSchema & { id: string }
) {
  console.log("Edit Super Admin:");
  console.log({ input });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true, message: `Super Admin edited` };
}
