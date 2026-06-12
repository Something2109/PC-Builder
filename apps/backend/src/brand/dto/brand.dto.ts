import { z } from "zod";

export const CreateBrandDto = z.object({
  name: z.string().min(1, "Name is required"),
  logo_url: z.string().url("Invalid logo URL").nullable().optional(),
});

export type CreateBrandDto = z.infer<typeof CreateBrandDto>;

export const UpdateBrandDto = CreateBrandDto.partial();

export type UpdateBrandDto = z.infer<typeof UpdateBrandDto>;
