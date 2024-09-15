import PartPicture from "@/components/part/Picture";
import { ColumnWrapper, RowWrapper } from "@/components/utils/FlexWrapper";
import { Database } from "@/models/Database";
import { Products } from "@/utils/Enum";
import { notFound } from "next/navigation";

export default async function PartDetailPage({
  params: { part, id },
}: {
  params: { part: string; id: string };
}) {
  const partInfo = await Database.parts.get(part as Products, id);
  if (!partInfo) {
    return notFound();
  }
  const { name, image_url, url, ...rest } = partInfo;

  return (
    <RowWrapper className="w-full">
      <PartPicture className="w-1/3" part={partInfo} />

      <ColumnWrapper className="w-2/3 p-5">
        <h1 className="text-4xl font-bold">{name}</h1>
        <table className="flex flex-col">
          <tbody>
            {Object.entries(rest).map(([key, value]) => {
              if (value) {
                return (
                  <tr>
                    <td>{key}</td>
                    <td>{value ? value.toLocaleString() : ""}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </ColumnWrapper>
    </RowWrapper>
  );
}
