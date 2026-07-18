import { RouteGuard } from "@/components/shared/RouteGuard";
import { UserRole } from "@/lib/enums";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRole={UserRole.ADMIN} redirectTo="/login" forbiddenRedirect="/">
      {children}
    </RouteGuard>
  );
}
