import Part, { Infos } from "@/utils/part";
import { TableHTMLAttributes } from "react";
import { InfoComponent, InfoComponentObject } from "../utils/Table";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import PartPicture from "../Picture";
import { RedirectButton } from "@/components/utils/Button";

const Components: InfoComponentObject<
  Omit<Part.DTO, "id" | "part" | "name" | "url" | "image_url" | Infos>
> = {
  code_name: ({ defaultValue: value }) => value,
  brand: ({ defaultValue: value }) => value,
  series: ({ defaultValue: value }) => value,
  launch_date: ({ defaultValue: value }) =>
    new Date(value ?? new Date()).toISOString().slice(0, 10),
};

const PartInfo = InfoComponent(Components, Part.Label);

export function PartTable({
  defaultValue,
  ...rest
}: {
  defaultValue: Part.Model;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  let { id, part, url } = defaultValue;

  return (
    <ResponsiveWrapper className="w-full">
      <PartPicture
        className="w-full lg:w-1/3"
        part={part ?? "default"}
        src={defaultValue.image_url ?? undefined}
      />
      <ColumnWrapper className="w-full lg:w-2/3 px-5 justify-center">
        <h1 className="text-4xl font-bold mb-4">{defaultValue.name}</h1>
        <PartInfo defaultValue={defaultValue} />
        {url ? (
          <RedirectButton href={url} target="_blank">
            To brand page
          </RedirectButton>
        ) : undefined}
        <RedirectButton href={`/part/${part}/${id}/edit`} className="w-full">
          Edit
        </RedirectButton>
      </ColumnWrapper>
    </ResponsiveWrapper>
  );
}
