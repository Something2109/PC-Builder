import { AuthRole } from "@/features/auth";
import MapperTest from "@/features/crawler/components/MapperTest";
import { Roles } from "@pc-builder/shared/user";

export default function MapperPage() {
  return (
    <AuthRole roles={[Roles.ADMIN]}>
      <MapperTest />
    </AuthRole>
  );
}
