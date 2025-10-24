import { SearchParams } from "@/types";

export interface Agent {
  id: number;
  name: string;
  agent_company_name: string;
  promo_group_id: number;
  email: string;
  kakao_id: string;
  phone_number: string;
  status: string;
}

export interface AgentTableResponse {
  success: boolean;
  data: Agent[];
  pageCount: number;
}

export interface AgentPageProps {
  searchParams: Promise<SearchParams>;
}
