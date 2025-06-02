import { InfoForm } from "@/components/part/Form";
import PartForm from "@/components/part/input/Part";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { ObjectTable } from "@/components/utils/ObjectTable";
import Part, { Mapping } from "@/utils/interface/part";
import { Products, Roles } from "@/utils/Enum";
import { notFound } from "next/navigation";
import { AuthRole } from "@/components/auth";
import { ServerAuthRole } from "@/components/auth-server";

const roles = [Roles.ADMIN];

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

  const data = (await response.json()) as Part.Detail;
  const SaveLink = `/api/part/${part}/${id}`;

  return (
    <ServerAuthRole roles={roles} redirect={`/part/${part}/${id}/edit`}>
      <AuthRole roles={roles}>
        <PartForm path={SaveLink} part={part} defaultValue={data} />
        <ResponsiveWrapper className="w-full align-top flex-wrap">
          {Mapping.Info[part].map((info) => (
            <InfoForm
              key={info}
              path={SaveLink}
              info={info}
              defaultValue={data}
            />
          ))}
        </ResponsiveWrapper>
      </AuthRole>
    </ServerAuthRole>
  );
}
