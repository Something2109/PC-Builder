import { AuthRole } from "@/features/auth";
import AliasDashboard from "@/features/crawler/components/AliasDashboard";
import { Roles } from "@pc-builder/shared/user";

export default function AliasesPage() {
  return (
    <AuthRole roles={[Roles.ADMIN]}>
      <AliasDashboard />
    </AuthRole>
  );
}
