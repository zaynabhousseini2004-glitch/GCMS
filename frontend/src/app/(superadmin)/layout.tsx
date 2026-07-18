import { RouteGuard } from "@/components/shared/RouteGuard";
import { UserRole } from "@/lib/enums";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard
      allowedRole={UserRole.SUPERADMIN}
      redirectTo="/login"
      forbiddenRedirect="/"
    >
      {children}
    </RouteGuard>
  );
}
