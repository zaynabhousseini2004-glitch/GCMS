"use client";

import { VendorLayout } from "@/components/shared";
import { Badge, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button } from "@/components/ui";
import { useMyVendorRequests, useUpdateVendorRequestStatus } from "@/hooks/mutations/useVendor";
import { VendorRequestStatus } from "@/lib/enums";

const statusBadge = (s: string) => {
  if (s === VendorRequestStatus.COMPLETED) return "bg-green-50 text-green-700 border-green-200";
  if (s === VendorRequestStatus.CANCELLED) return "bg-red-50 text-red-700 border-red-200";
  if (s === VendorRequestStatus.IN_PROGRESS) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export function VendorRequests() {
  const { data, isLoading } = useMyVendorRequests();
  const updateStatus = useUpdateVendorRequestStatus();

  const requests = data?.requests ?? [];

  return (
    <VendorLayout activeSidebarItem="Requests">
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-semibold text-primary">My Requests</h3>

        <Card className="shadow-sm">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="px-6">Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : requests.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No requests found.</TableCell></TableRow>
              ) : requests.map((r, i) => (
                <TableRow key={r.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                  <TableCell className="px-6 font-medium text-primary">{r.requestTitle}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[250px] truncate">{r.requestDescription ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusBadge(r.requestStatus)}>{r.requestStatus}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="px-6 text-right">
                    {r.requestStatus === VendorRequestStatus.PENDING && (
                      <Button size="sm" variant="outline" className="h-7 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => updateStatus.mutate({ id: r.id, body: { requestStatus: VendorRequestStatus.IN_PROGRESS } })}>
                        Mark In Progress
                      </Button>
                    )}
                    {r.requestStatus === VendorRequestStatus.IN_PROGRESS && (
                      <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => updateStatus.mutate({ id: r.id, body: { requestStatus: VendorRequestStatus.COMPLETED } })}>
                        Mark Completed
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </VendorLayout>
  );
}
