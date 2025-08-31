"use server";

import { CreateAgentSchema } from "@/components/dashboard/account/agent-overview/agent-management/dialog/create-agent-dialog";
import { EditAgentSchema } from "@/components/dashboard/account/agent-overview/agent-management/dialog/edit-agent-dialog";

export async function updatePromoGroup(agentId: string, promo_group: string) {
  console.log("Update Agent Promo Group");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    success: true,
    message: `Agent Promo Group updated to ${promo_group}`,
  };
}

export async function deleteAgent(agentId: string) {
  console.log("Delete Agent");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true, message: `Agent deleted` };
}

export async function createAgent(input: CreateAgentSchema) {
  console.log("Create Agent:");
  console.log({ input });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true, message: `Agent created` };
}

export async function editAgent(input: EditAgentSchema & { id: string }) {
  console.log("Edit Agent:");
  console.log({ input });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true, message: `Agent edited` };
}
