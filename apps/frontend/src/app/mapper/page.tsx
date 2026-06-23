import { Roles } from "@pc-builder/shared/user";

import { AuthRole } from "@/features/auth";
import MapperTest from "@/features/crawler/components/MapperTest";

export default function MapperPage() {
  return (
    <AuthRole roles={[Roles.ADMIN]}>
      <MapperTest />
    </AuthRole>
  );
}
