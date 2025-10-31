import { SearchParams } from "@/types";
import { EmailLog, EmailLogTableResponse } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<EmailLogTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      date: "2024-06-01T10:00:00Z",
      hotel_name: "Grand Hotel Jakarta",
      status: "success",
      notes: "Email sent successfully.",
    },
    {
      date: "2024-06-02T11:30:00Z",
      hotel_name: "Mercure Hotel Bandung",
      status: "failed",
      notes: "SMTP error.",
    },
    {
      date: "2024-06-03T09:15:00Z",
      hotel_name: "Novotel Surabaya",
      status: "success",
      notes: "",
    },
  ] as EmailLog[];

  return {
    success: true,
    data,
    page_count: 3,
  };
};
