import { RouteGuard } from "@/components/shared/RouteGuard";
import { UserRole } from "@/lib/enums";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard allowedRole={UserRole.VENDOR} redirectTo="/login" forbiddenRedirect="/">
      {children}
    </RouteGuard>
  );
}
