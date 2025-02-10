import { InfoForm } from "@/components/part/Form";
import PartForm from "@/components/part/input/Part";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { Products } from "@/utils/Enum";
import { Product } from "@/utils/interface/product";

export default async function PartDetailNewPage({
  params,
}: {
  params: Promise<{ part: Products }>;
}) {
  const { part } = await params;

  const SaveLink = `/api/part/${part}`;

  return (
    <>
      <PartForm path={SaveLink} part={part} />
      <ResponsiveWrapper className="w-full align-top">
        <ColumnWrapper className="basis-1/2">
          <h1 className="text-4xl font-bold">Raw</h1>
        </ColumnWrapper>
        <ColumnWrapper className="basis-1/2">
          {Product.Info[part].map((info) => (
            <InfoForm key={info} path={SaveLink} info={info} />
          ))}
        </ColumnWrapper>
      </ResponsiveWrapper>
    </>
  );
}
