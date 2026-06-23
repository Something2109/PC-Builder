import { Roles } from "@pc-builder/shared/user";

import { AuthRole } from "@/features/auth";
import AliasDashboard from "@/features/crawler/components/AliasDashboard";

export default function AliasesPage() {
  return (
    <AuthRole roles={[Roles.ADMIN]}>
      <AliasDashboard />
    </AuthRole>
  );
}
