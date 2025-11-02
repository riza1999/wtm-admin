import { apiCall } from "@/lib/api";
import { ApiResponse } from "@/types";
import { EmailTemplate } from "./types";

export async function getEmailTemplate(): Promise<ApiResponse<EmailTemplate>> {
  const url = `/email/template`;
  const apiResponse = await apiCall<EmailTemplate>(url);

  return apiResponse;
}
