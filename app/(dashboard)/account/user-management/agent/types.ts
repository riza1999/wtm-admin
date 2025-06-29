import { SearchParams } from "@/types";

export interface Agent {
  id: string;
  name: string;
  company: string;
  promo_group: string;
  email: string;
  kakao_id: string;
  phone: string;
  status: boolean;
}

export interface AgentTableResponse {
  success: boolean;
  data: Agent[];
  pageCount: number;
}

export interface AgentPageProps {
  searchParams: Promise<SearchParams>;
}
