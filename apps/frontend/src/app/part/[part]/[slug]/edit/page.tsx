import Part, { Products } from "@pc-builder/shared/part";
import { Roles } from "@pc-builder/shared/user";
import { notFound } from "next/navigation";

import { AuthRole } from "@/features/auth";
import PartEditDashboard from "@/features/part/components/PartEditDashboard";
import { getBackendUrl } from "@/utils/api";

const roles = [Roles.ADMIN];

export default async function PartDetailEditPage({
  params,
}: {
  params: Promise<{ part: Products; slug: string }>;
}) {
  const { part, slug } = await params;

  const response = await fetch(getBackendUrl(`/api/part/${part}/${slug}`));

  if (!response.ok) return notFound();

  const data = (await response.json()) as Part.Model;
  const SaveLink = `/api/part/${part}/${slug}`;

  return (
    <AuthRole roles={roles}>
      <PartEditDashboard part={part} id={data.id || slug} defaultValue={data} saveLink={SaveLink} />
    </AuthRole>
  );
}
