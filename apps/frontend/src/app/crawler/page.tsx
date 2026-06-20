import { AuthRole } from "@/features/auth";
import { CrawlerControl } from "@/features/crawler";
import { Roles } from "@pc-builder/shared/user";

export default function CrawlerPage() {
  return (
    <AuthRole roles={[Roles.ADMIN]}>
      <CrawlerControl />
    </AuthRole>
  );
}
