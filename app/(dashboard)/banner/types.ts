import { SearchParams } from "@/types";
import z from "zod";

export interface Banner {
  description: string;
  id: string;
  image_url: string;
  is_active: boolean;
  order: number;
  title: string;
}

export interface BannerPageProps {
  searchParams: Promise<SearchParams>;
}

export const createBannerSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title must be less than 50 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  image: z.instanceof(File),
});

export type CreateBannerSchema = z.infer<typeof createBannerSchema>;

export const updateBannerSchema = z.object({
  title: z.string().max(50, "Title must be less than 50 characters").optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  image: z.instanceof(File).optional(),
});

export type UpdateBannerSchema = z.infer<typeof updateBannerSchema>;
