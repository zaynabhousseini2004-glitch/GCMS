"use client";

import { VendorLayout } from "@/components/shared";
import { Badge, Card, Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMyVendorRequestById } from "@/hooks/mutations/useVendor";
import { VendorRequestStatus } from "@/lib/enums";

const statusBadge = (s: string) => {
  if (s === VendorRequestStatus.COMPLETED) return "bg-green-50 text-green-700 border-green-200";
  if (s === VendorRequestStatus.CANCELLED) return "bg-red-50 text-red-700 border-red-200";
  if (s === VendorRequestStatus.IN_PROGRESS) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

interface Props { requestId: number; }

export function VendorRequestDetail({ requestId }: Props) {
  const router = useRouter();
  const { data, isLoading } = useMyVendorRequestById(requestId);
  const request = data?.request;

  return (
    <VendorLayout activeSidebarItem="Requests">
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h3 className="text-2xl font-semibold text-primary">Request Details</h3>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground text-center py-12">Loading...</p>
        ) : !request ? (
          <p className="text-muted-foreground text-center py-12">Request not found.</p>
        ) : (
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <h4 className="text-xl font-bold text-foreground">{request.requestTitle}</h4>
              <Badge variant="outline" className={statusBadge(request.requestStatus)}>{request.requestStatus}</Badge>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Description</p>
                <p className="text-foreground">{request.requestDescription ?? "—"}</p>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-muted-foreground mb-1">Created</p>
                  <p className="font-medium">{new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Updated</p>
                  <p className="font-medium">{new Date(request.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </VendorLayout>
  );
}
