import { AuthRole } from "@/components/auth";
import { ServerAuthRole } from "@/components/auth-server";
import PartForm from "@/components/part/input/Part";
import {
  ColumnWrapper,
  ResponsiveWrapper,
} from "@/components/utils/FlexWrapper";
import { Products } from "@/utils/part";
import { Roles } from "@/utils/user";

const roles = [Roles.ADMIN];

export default async function PartDetailNewPage({
  params,
}: {
  params: Promise<{ part: Products }>;
}) {
  const { part } = await params;

  const SaveLink = `/api/part/${part}`;

  return (
    <ServerAuthRole roles={roles} redirect={`/part/${part}/new`}>
      <AuthRole roles={roles}>
        <PartForm path={SaveLink} part={part} />
        <ResponsiveWrapper className="w-full align-top">
          <ColumnWrapper className="basis-1/2">
            <h1 className="text-4xl font-bold">Raw</h1>
          </ColumnWrapper>
        </ResponsiveWrapper>
      </AuthRole>
    </ServerAuthRole>
  );
}
