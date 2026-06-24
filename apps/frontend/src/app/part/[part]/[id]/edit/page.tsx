import Part, { Products } from "@pc-builder/shared/part";
import { Roles } from "@pc-builder/shared/user";
import { notFound } from "next/navigation";

import { AuthRole } from "@/features/auth";
import PartEditDashboard from "@/features/part/components/PartEditDashboard";
import { getBackendUrl } from "@/utils/path";

const roles = [Roles.ADMIN];

export default async function PartDetailEditPage({
  params,
}: {
  params: Promise<{ part: Products; id: string }>;
}) {
  const { part, id } = await params;

  const response = await fetch(getBackendUrl(`/api/part/${part}/${id}`));

  if (!response.ok) return notFound();

  const data = (await response.json()) as Part.DTO;
  const SaveLink = `/api/part/${part}/${id}`;

  return (
    <AuthRole roles={roles}>
      <PartEditDashboard part={part} id={id} defaultValue={data} saveLink={SaveLink} />
    </AuthRole>
  );
}
