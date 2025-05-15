import Part from "@/utils/interface/part";
import { API } from "@/utils/interface/api";
import { Infos, Products } from "@/utils/Enum";

type SearchOptions = {
  q?: string;
};

export const LIST_INTERFACE = "DatabaseListInterface";
export const CRUD_INTERFACE = "DatabaseCRUDInterface";

export type FilterAttributeMapping = {
  part: (typeof Part.BasicFilterAttributes)[number][];
} & { [key in Infos]?: string[] };

export interface DatabaseListInterface {
  list(
    options: Part.Filter & API.PageOptions & SearchOptions,
    attrs?: { [key in Infos]?: string[] }
  ): Promise<API.Payload<Part.Detail>>;

  filter(
    options: API.PageOptions,
    attrs: FilterAttributeMapping
  ): Promise<Part.Filter>;
}

export interface DatabaseCRUDInterface {
  get(id: string, infos?: readonly Infos[]): Promise<Part.Detail | null>;

  set(
    id: string,
    data: Part.Detail,
    infos?: readonly Infos[]
  ): Promise<Part.Detail | null>;

  create(
    data: Part.Detail,
    infos?: readonly Infos[]
  ): Promise<Part.Detail | null>;

  delete(id: string): Promise<Part.Detail | null>;
}
