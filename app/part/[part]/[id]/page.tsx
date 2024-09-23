import PartPicture from "@/components/part/Picture";
import { RedirectButton } from "@/components/utils/Button";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { ObjectTable } from "@/components/utils/ObjectTable";
import { Database } from "@/models/Database";
import { Products } from "@/utils/Enum";
import { notFound } from "next/navigation";

export default async function PartDetailPage({
  params: { part, id },
}: {
  params: { part: string; id: string };
}) {
  const partInfo = await Database.parts.get(part as Products, id);
  const raw = await Database.parts.raw(part as Products, id);

  if (!partInfo) {
    return notFound();
  }
  const { name, image_url, url, ...rest } = partInfo;

  return (
    <>
      <ResponsiveWrapper className="w-full">
        <PartPicture className="w-full lg:w-1/3" part={partInfo} />

        <ColumnWrapper className="w-full lg:w-2/3 p-5">
          <h1 className="text-4xl font-bold">{name}</h1>
          <ObjectTable object={rest} />
          {url ? (
            <RedirectButton href={url} target="_blank">
              To brand page
            </RedirectButton>
          ) : undefined}
        </ColumnWrapper>
      </ResponsiveWrapper>
      <ResponsiveWrapper className="w-full align-top">
        <ColumnWrapper className="basis-1/2">
          <h1 className="text-4xl font-bold">Raw</h1>
          <ObjectTable object={raw ? JSON.parse(raw) : undefined} />
        </ColumnWrapper>
        <ColumnWrapper className="basis-1/2">
          <h1 className="text-4xl font-bold">Details</h1>
          <ObjectTable object={rest} />
        </ColumnWrapper>
      </ResponsiveWrapper>
    </>
  );
}
