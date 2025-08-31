import { SearchParams } from "@/types";
import { AgentTableResponse } from "./types";

export const getAgentData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<AgentTableResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      id: "1",
      name: "Riza",
      company: "WTM Digital",
      promo_group: "promo_a",
      email: "riza@wtmdigital.com",
      kakao_id: "riza_kakao",
      phone: "081234567801",
      status: true,
    },
    {
      id: "2",
      name: "Andi",
      company: "WTM Digital",
      promo_group: "promo_b",
      email: "andi@wtmdigital.com",
      kakao_id: "andi_kakao",
      phone: "081234567802",
      status: false,
    },
  ];

  return {
    success: true,
    data,
    pageCount: 2,
  };
};
