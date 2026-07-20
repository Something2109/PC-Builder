import { Products } from "@pc-builder/shared/part";
import { Roles } from "@pc-builder/shared/user";

import { AuthRole } from "@/features/auth";
import PartForm from "@/features/part/components/input/Part";
import { ColumnWrapper, ResponsiveWrapper } from "@/ui/Layout/FlexWrapper";

const roles = [Roles.ADMIN];

export default async function PartDetailNewPage({
  params,
}: {
  params: Promise<{ part: Products }>;
}) {
  const { part } = await params;

  const SaveLink = `/api/part/${part}`;

  return (
    <AuthRole roles={roles}>
      <PartForm path={SaveLink} part={part} />
      <ResponsiveWrapper className="w-full align-top">
        <ColumnWrapper className="basis-1/2">
          <h1 className="text-4xl font-bold">Raw</h1>
        </ColumnWrapper>
      </ResponsiveWrapper>
    </AuthRole>
  );
}
