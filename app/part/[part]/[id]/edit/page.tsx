import { InfoForm } from "@/components/part/Form";
import PartForm from "@/components/part/input/Part";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { ObjectTable } from "@/components/utils/ObjectTable";
import { Products } from "@/utils/Enum";
import { DetailInfo, ProductInfo } from "@/utils/interface";
import { notFound } from "next/navigation";

export default async function PartDetailEditPage({
  params,
}: {
  params: Promise<{ part: Products; id: string }>;
}) {
  const { part, id } = await params;

  const response = await fetch(
    `${process.env.BACKEND_HOST}/api/part/${part}/${id}`
  );

  if (!response.ok) return notFound();

  const data = (await response.json()) as DetailInfo;
  const SaveLink = `/api/part/${part}/${id}`;

  return (
    <>
      <PartForm path={SaveLink} part={part} defaultValue={data} />
      <ResponsiveWrapper className="w-full align-top">
        <ColumnWrapper className="basis-1/2">
          <h1 className="text-4xl font-bold">Raw</h1>
          <ObjectTable
            className="border-2"
            object={data?.raw ? JSON.parse(data.raw) : undefined}
          />
        </ColumnWrapper>
        <ColumnWrapper className="basis-1/2">
          {ProductInfo[part].map((info) => (
            <InfoForm
              key={info}
              path={SaveLink}
              info={info}
              defaultValue={data[info]}
            />
          ))}
        </ColumnWrapper>
      </ResponsiveWrapper>
    </>
  );
}
