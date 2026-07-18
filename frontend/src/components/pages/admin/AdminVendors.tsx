"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Check, X, Eye, Plus } from "lucide-react";
import { AdminLayout } from "@/components/shared";
import {
  useAdminVendors,
  useAdminVendorById,
  useApproveVendor,
  useRejectVendor,
  useAdminVendorRequests,
  useCreateVendorRequest,
  useAdminCeremonies,
} from "@/hooks/mutations/useAdmin";
import { VendorApprovalStatus, VendorRequestStatus } from "@/lib/enums";
import type { VendorRequest } from "@/lib/api/types";

const approvalBadge = (status: string | null | undefined) => {
  if (status === VendorApprovalStatus.APPROVED) return "bg-green-100 text-green-800 hover:bg-green-100";
  if (status === VendorApprovalStatus.REJECTED) return "bg-red-100 text-red-800 hover:bg-red-100";
  return "bg-amber-100 text-amber-800 hover:bg-amber-100";
};

const approvalLabel = (status: string | null | undefined) => {
  if (status === VendorApprovalStatus.APPROVED) return "Approved";
  if (status === VendorApprovalStatus.REJECTED) return "Rejected";
  return "Pending";
};

const requestBadge = (status: string) => {
  if (status === VendorRequestStatus.COMPLETED) return "bg-green-50 text-green-700 border-green-200";
  if (status === VendorRequestStatus.CANCELLED) return "bg-red-50 text-red-700 border-red-200";
  if (status === VendorRequestStatus.IN_PROGRESS) return "bg-blue-50 text-blue-700 border-blue-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export default function AdminVendors() {
  const [selectedVendorId, setSelectedVendorId] = useState<number | null>(null);
  const [requestModal, setRequestModal] = useState(false);
  const [form, setForm] = useState({ vendorId: "", ceremonyId: "", requestTitle: "", requestDescription: "" });

  const { data: vendorData, isLoading: loadingVendors } = useAdminVendors();
  const { data: detailData, isLoading: detailLoading } = useAdminVendorById(selectedVendorId ?? 0);
  const { data: requestData, isLoading: loadingRequests } = useAdminVendorRequests();
  const { data: ceremonyData } = useAdminCeremonies();
  const approveVendor = useApproveVendor();
  const rejectVendor = useRejectVendor();
  const createRequest = useCreateVendorRequest();

  const vendors = vendorData?.vendors ?? [];
  const requests = (requestData?.requests ?? []) as VendorRequest[];
  const today = new Date(new Date().toDateString());
  const ceremonies = (ceremonyData?.ceremonies ?? []).filter(
    (c) => c.status === "UPCOMING" && new Date(c.ceremonyDate) >= today,
  );
  const approvedVendors = vendors.filter((v) => v.vendorApprovalStatus === VendorApprovalStatus.APPROVED);
  const detail = detailData?.vendor;

  const handleCreateRequest = () => {
    if (!form.vendorId || !form.ceremonyId || !form.requestTitle.trim()) return;
    createRequest.mutate(
      {
        vendorId: Number(form.vendorId),
        ceremonyId: Number(form.ceremonyId),
        requestTitle: form.requestTitle.trim(),
        requestDescription: form.requestDescription.trim() || undefined,
      },
      {
        onSuccess: () => {
          setRequestModal(false);
          setForm({ vendorId: "", ceremonyId: "", requestTitle: "", requestDescription: "" });
        },
      }
    );
  };

  return (
    <AdminLayout activeSidebarItem="Vendors">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-primary">Vendors</h3>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Vendor List</TabsTrigger>
          <TabsTrigger value="requests">Vendor Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="bg-background rounded-lg shadow border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingVendors ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : vendors.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No vendors found.</TableCell></TableRow>
                ) : vendors.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.fullName}</TableCell>
                    <TableCell>{v.companyName ?? "—"}</TableCell>
                    <TableCell>{v.serviceType ?? "—"}</TableCell>
                    <TableCell>{v.email}</TableCell>
                    <TableCell>
                      <Badge className={approvalBadge(v.vendorApprovalStatus)} variant="secondary">
                        {approvalLabel(v.vendorApprovalStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedVendorId(v.id)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        {v.vendorApprovalStatus === VendorApprovalStatus.PENDING && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700"
                              onClick={() => approveVendor.mutate(v.id)}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700"
                              onClick={() => rejectVendor.mutate(v.id)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <div className="flex justify-end mb-3">
            <Button onClick={() => setRequestModal(true)} className="gap-2">
              <Plus className="w-4 h-4" /> New Request
            </Button>
          </div>
          <div className="bg-background rounded-lg shadow border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Request Title</TableHead>
                  <TableHead>Ceremony</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingRequests ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : requests.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No requests found.</TableCell></TableRow>
                ) : requests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.vendor?.fullName ?? "—"}</TableCell>
                    <TableCell>{r.requestTitle}</TableCell>
                    <TableCell className="text-muted-foreground">{r.ceremony?.title ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={requestBadge(r.requestStatus)}>{r.requestStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={!!selectedVendorId} onOpenChange={(o) => { if (!o) setSelectedVendorId(null); }}>
        <SheetContent className="w-[480px] sm:max-w-md overflow-y-auto">
          {detailLoading ? (
            <>
              <SheetHeader><SheetTitle>Loading…</SheetTitle></SheetHeader>
              <p className="text-muted-foreground text-center py-12">Loading vendor details…</p>
            </>
          ) : detail ? (
            <>
              <SheetHeader className="pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-14 w-14">
                    {detail.avatarUrl && (
                      <AvatarImage src={detail.avatarUrl} alt={detail.fullName} />
                    )}
                    <AvatarFallback>{detail.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{detail.fullName}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{detail.email}</p>
                    <Badge className={`mt-1 ${approvalBadge(detail.vendorApprovalStatus)}`} variant="secondary">
                      {approvalLabel(detail.vendorApprovalStatus)}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              <div className="py-4 flex flex-col gap-5">
                {/* Basic details */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Vendor Details</h4>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    {[
                      { label: "Company", value: detail.companyName ?? "—" },
                      { label: "Service Type", value: detail.serviceType ?? "—" },
                      { label: "Phone", value: detail.phone ?? "—" },
                      { label: "Account Status", value: detail.status },
                      { label: "Joined", value: new Date(detail.createdAt).toLocaleDateString() },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <span className="text-muted-foreground block mb-0.5 text-xs">{label}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned requests */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Assigned Requests ({detail.assignedVendorRequests.length})
                  </h4>
                  {detail.assignedVendorRequests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No requests assigned yet.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {detail.assignedVendorRequests.map((r) => (
                        <div key={r.id} className="flex items-start justify-between bg-muted/40 rounded-md px-3 py-2 text-sm">
                          <div>
                            <p className="font-medium">{r.requestTitle}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{r.ceremony.title}</p>
                          </div>
                          <div className="flex flex-col items-end gap-0.5 ml-2">
                            <Badge variant="outline" className={`text-xs ${requestBadge(r.requestStatus)}`}>
                              {r.requestStatus}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* New Vendor Request Dialog */}
      <Dialog open={requestModal} onOpenChange={setRequestModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Vendor Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Approved Vendor</Label>
              <Select value={form.vendorId} onValueChange={(v) => setForm((f) => ({ ...f, vendorId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select vendor..." /></SelectTrigger>
                <SelectContent>
                  {approvedVendors.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No approved vendors. Approve a vendor first.</div>
                  ) : (
                    approvedVendors.map((v) => (
                      <SelectItem key={v.id} value={String(v.id)}>
                        {v.fullName}{v.companyName ? ` — ${v.companyName}` : ""}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Ceremony</Label>
              <Select value={form.ceremonyId} onValueChange={(v) => setForm((f) => ({ ...f, ceremonyId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select ceremony..." /></SelectTrigger>
                <SelectContent>
                  {ceremonies.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Request Title</Label>
              <Input
                placeholder="e.g. Photography Services"
                value={form.requestTitle}
                onChange={(e) => setForm((f) => ({ ...f, requestTitle: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Input
                placeholder="Additional details..."
                value={form.requestDescription}
                onChange={(e) => setForm((f) => ({ ...f, requestDescription: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestModal(false)}>Cancel</Button>
            <Button
              onClick={handleCreateRequest}
              disabled={!form.vendorId || !form.ceremonyId || !form.requestTitle.trim() || createRequest.isPending}
            >
              {createRequest.isPending ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
