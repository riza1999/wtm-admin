import z from "zod";

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  agent: z.string(),
  promo_group: z.string(),
  email: z.string(),
  phone: z.string(),
});
