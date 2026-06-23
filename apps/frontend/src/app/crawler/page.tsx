import { Roles } from "@pc-builder/shared/user";

import { AuthRole } from "@/features/auth";
import { CrawlerControl } from "@/features/crawler";

export default function CrawlerPage() {
  return (
    <AuthRole roles={[Roles.ADMIN]}>
      <CrawlerControl />
    </AuthRole>
  );
}
