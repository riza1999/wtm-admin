import { SearchParams } from "@/types";

export interface Agent {
  id: number;
  name: string;
  agent_company_name: string;
  promo_group_id: number;
  promo_group_name: string;
  email: string;
  kakao_talk_id: string;
  phone_number: string;
  status: string;
  certificate: string;
  id_card: string;
  name_card: string;
  photo: string;
}

export interface AgentTableResponse {
  success: boolean;
  data: Agent[];
  pageCount: number;
}

export interface AgentPageProps {
  searchParams: Promise<SearchParams>;
}
