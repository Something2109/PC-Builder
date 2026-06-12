import { z } from "zod";

export const CreateSeriesDto = z.object({
  name: z.string().min(1, "Name is required"),
  brandId: z.number().int().positive("Invalid brand ID"),
});

export type CreateSeriesDto = z.infer<typeof CreateSeriesDto>;

export const UpdateSeriesDto = CreateSeriesDto.partial();

export type UpdateSeriesDto = z.infer<typeof UpdateSeriesDto>;
