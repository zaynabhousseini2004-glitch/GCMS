import { RouteGuard } from "@/components/shared/RouteGuard";
import { UserRole } from "@/lib/enums";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRole={UserRole.STUDENT} redirectTo="/login" forbiddenRedirect="/">
      {children}
    </RouteGuard>
  );
}
