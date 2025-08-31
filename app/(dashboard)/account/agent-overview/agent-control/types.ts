import { SearchParams } from "@/types";

export interface AgentControl {
  id: string;
  name: string;
  company: string;
  email: string;
  phone_number: string;
  status: string;
}

export interface AgentControlTableResponse {
  success: boolean;
  data: AgentControl[];
  pageCount: number;
}

export interface AgentControlPageProps {
  searchParams: Promise<SearchParams>;
}
