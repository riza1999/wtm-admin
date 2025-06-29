import { SearchParams } from "@/types";

export interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: boolean;
}

export interface SuperAdminTableResponse {
  success: boolean;
  data: SuperAdmin[];
  pageCount: number;
}

export interface SuperAdminPageProps {
  searchParams: Promise<SearchParams>;
}
