import { Roles } from "@pc-builder/shared/user";

import { AuthRole } from "@/features/auth";
import MapperTest from "@/features/mapper";

export default function MapperPage() {
  return (
    <AuthRole roles={[Roles.ADMIN]}>
      <MapperTest />
    </AuthRole>
  );
}
