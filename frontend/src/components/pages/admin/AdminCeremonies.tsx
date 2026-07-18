"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { AdminLayout } from "@/components/shared";
import {
  Plus,
  Ban,
  Pencil,
  RotateCcw,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  ImageIcon,
  DollarSign,
} from "lucide-react";
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  useAdminCeremonies,
  useCreateCeremony,
  useUpdateCeremony,
  useCancelCeremony,
  useRestoreCeremony,
} from "@/hooks/mutations/useAdmin";
import { useUploadCeremonyBanner } from "@/hooks/mutations/useUpload";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { CeremonyStatus, CeremonyType, CeremonySemester } from "@/lib/enums";
import type { Ceremony } from "@/lib/api/types";

const statusBadge = (status: string) => {
  if (status === CeremonyStatus.UPCOMING) return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === CeremonyStatus.PASSED) return "bg-amber-50 text-amber-700 border-amber-200";
  if (status === CeremonyStatus.COMPLETED) return "bg-muted text-foreground border-border";
  return "bg-red-50 text-red-700 border-red-200";
};

const typeBadge = (type: string) =>
  type === CeremonyType.BACHELOR
    ? "bg-blue-50 text-blue-700 border-blue-200"
    : "bg-purple-50 text-purple-700 border-purple-200";

const emptyForm = {
  title: "",
  description: "",
  ceremonyDate: "",
  venue: "",
  capacity: "",
  ceremonyType: CeremonyType.BACHELOR as CeremonyType,
  semester: CeremonySemester.SPRING as CeremonySemester,
};

const emptyEditForm = {
  ...emptyForm,
  ticketPrice: "",
};

export function AdminCeremonies() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(emptyEditForm);

  const [cancelConfirm, setCancelConfirm] = useState<{ id: number; title: string } | null>(null);
  const [restoreConfirm, setRestoreConfirm] = useState<{ id: number; title: string } | null>(null);
  const [bannerCeremonyId, setBannerCeremonyId] = useState<number | null>(null);
  const [bannerCurrentUrl, setBannerCurrentUrl] = useState<string | null | undefined>(null);

  const { data, isLoading } = useAdminCeremonies();
  const createCeremony = useCreateCeremony();
  const updateCeremony = useUpdateCeremony();
  const cancelCeremony = useCancelCeremony();
  const restoreCeremony = useRestoreCeremony();
  const uploadBanner = useUploadCeremonyBanner(bannerCeremonyId ?? 0);

  const ceremonies = data?.ceremonies ?? [];

  const handleCreate = () => {
    createCeremony.mutate(
      {
        title: form.title,
        description: form.description || undefined,
        ceremonyDate: form.ceremonyDate,
        venue: form.venue || undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
        ceremonyType: form.ceremonyType,
        semester: form.semester,
      },
      {
        onSuccess: () => {
          setModalOpen(false);
          setForm(emptyForm);
          toast.success("Ceremony created successfully.");
        },
        onError: (err: Error) => toast.error(err.message || "Failed to create ceremony."),
      },
    );
  };

  const openEditModal = (row: Ceremony) => {
    setEditingId(row.id);
    setEditForm({
      title: row.title,
      description: row.description ?? "",
      ceremonyDate: new Date(row.ceremonyDate).toISOString().split("T")[0],
      venue: row.venue ?? "",
      capacity: row.capacity != null ? String(row.capacity) : "",
      ceremonyType: row.ceremonyType as CeremonyType,
      semester: row.semester as CeremonySemester,
      ticketPrice: row.ticketPrice != null ? String(Number(row.ticketPrice).toFixed(2)) : "",
    });
    setEditModalOpen(true);
  };

  const handleEdit = () => {
    if (!editingId) return;
    updateCeremony.mutate(
      {
        id: editingId,
        body: {
          title: editForm.title,
          description: editForm.description || undefined,
          ceremonyDate: editForm.ceremonyDate,
          venue: editForm.venue || undefined,
          capacity: editForm.capacity ? Number(editForm.capacity) : undefined,
          ceremonyType: editForm.ceremonyType,
          semester: editForm.semester,
          ticketPrice: editForm.ticketPrice !== "" ? Math.max(0, Number(editForm.ticketPrice)) : undefined,
        },
      },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          setEditingId(null);
          toast.success("Ceremony updated.");
        },
        onError: (err: Error) => toast.error(err.message || "Failed to update ceremony."),
      },
    );
  };

  const openBannerModal = (row: Ceremony) => {
    setBannerCeremonyId(row.id);
    setBannerCurrentUrl((row as Ceremony & { bannerUrl?: string | null }).bannerUrl);
  };

  const closeBannerModal = () => {
    setBannerCeremonyId(null);
    setBannerCurrentUrl(null);
  };

  return (
    <AdminLayout activeSidebarItem="Ceremonies">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-primary">Ceremonies</h3>
          <Button
            type="button"
            className="bg-primary hover:bg-primary/85 text-primary-foreground"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Ceremony
          </Button>
        </div>

        <Card className="shadow-sm">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="px-6">Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Ticket Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Loading ceremonies...
                  </TableCell>
                </TableRow>
              ) : ceremonies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No ceremonies found.
                  </TableCell>
                </TableRow>
              ) : (
                ceremonies.map((row, i) => {
                  const booked = row.ticketsBooked ?? 0;
                  const cap = row.capacity ?? null;
                  const isFull = cap !== null && booked >= cap;
                  const isNearFull = cap !== null && !isFull && booked / cap >= 0.8;
                  const isCancelled = row.status === CeremonyStatus.CANCELLED;
                  const isPassed = row.status === CeremonyStatus.PASSED;
                  const hasReservations = (row.ticketsBooked ?? 0) > 0;
                  const cancelDisabled = hasReservations && !isPassed;

                  return (
                    <TableRow key={row.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                      <TableCell className="px-6 font-medium text-primary">{row.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={typeBadge(row.ceremonyType)}>
                          {row.ceremonyType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.semester}</TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {new Date(row.ceremonyDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.venue ?? "—"}</TableCell>

                      <TableCell>
                        {cap !== null ? (
                          <div className="space-y-0.5">
                            <p className={`text-sm font-medium ${isFull ? "text-red-600" : isNearFull ? "text-amber-600" : "text-foreground"}`}>
                              {booked} / {cap}
                            </p>
                            {isFull && (
                              <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.5">Full</span>
                            )}
                            {isNearFull && (
                              <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">Near full</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell>
                        {row.ticketPrice != null ? (
                          <span className="font-medium text-green-700">${Number(row.ticketPrice).toFixed(2)}</span>
                        ) : (
                          <span className="text-amber-600 text-xs font-medium">Not set</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className={statusBadge(row.status)}>
                          {row.status}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-6">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {!isCancelled && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              title="Edit ceremony details"
                              onClick={() => openEditModal(row)}
                            >
                              <Pencil className="w-3 h-3 mr-1" /> Edit
                            </Button>
                          )}

                          {/* Banner — always visible */}
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            title="Upload or change ceremony banner"
                            onClick={() => openBannerModal(row)}
                          >
                            <ImageIcon className="w-3 h-3 mr-1" /> Banner
                          </Button>

                          {/* Cancel — only if not already cancelled */}
                          {!isCancelled && (
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              className="h-7 text-xs"
                              title={cancelDisabled ? "Cannot cancel: students have reserved tickets" : "Cancel this ceremony"}
                              disabled={cancelDisabled}
                              onClick={() => setCancelConfirm({ id: row.id, title: row.title })}
                            >
                              <Ban className="w-3 h-3 mr-1" /> Cancel
                            </Button>
                          )}

                          {/* Restore — only if cancelled */}
                          {isCancelled && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs text-green-700 border-green-300 hover:bg-green-50"
                              title="Restore this ceremony to upcoming"
                              onClick={() => setRestoreConfirm({ id: row.id, title: row.title })}
                            >
                              <RotateCcw className="w-3 h-3 mr-1" /> Restore
                            </Button>
                          )}

                          {row.status === CeremonyStatus.COMPLETED && (
                            <span className="text-xs text-muted-foreground italic">Completed</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* ── Create Ceremony dialog ─────────────────────────────────────── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Create New Ceremony</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Ceremony Title</Label>
              <Input id="title" placeholder="e.g. Spring Graduation 2026"
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" placeholder="Brief description..." className="resize-none h-20"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input type="date" className="pl-9 text-sm" value={form.ceremonyDate}
                    onChange={(e) => setForm({ ...form, ceremonyDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Venue</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input placeholder="Location name" className="pl-9" value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Capacity</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input type="number" placeholder="2500" className="pl-9" value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.ceremonyType} onValueChange={(v) => setForm({ ...form, ceremonyType: v as CeremonyType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CeremonyType.BACHELOR}>Bachelor</SelectItem>
                    <SelectItem value={CeremonyType.MASTER}>Master</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={form.semester} onValueChange={(v) => setForm({ ...form, semester: v as CeremonySemester })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CeremonySemester.FALL}>Fall</SelectItem>
                    <SelectItem value={CeremonySemester.SPRING}>Spring</SelectItem>
                    <SelectItem value={CeremonySemester.SUMMER}>Summer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="button" className="bg-primary hover:bg-primary/85 text-primary-foreground"
              onClick={handleCreate} disabled={createCeremony.isPending || !form.title || !form.ceremonyDate}>
              {createCeremony.isPending ? "Saving..." : "Save Ceremony"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Ceremony dialog ───────────────────────────────────────── */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Edit Ceremony</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label>Ceremony Title</Label>
              <Input placeholder="e.g. Spring Graduation 2026" value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Brief description..." className="resize-none h-20"
                value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input type="date" className="pl-9 text-sm" value={editForm.ceremonyDate}
                    onChange={(e) => setEditForm({ ...editForm, ceremonyDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Venue</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input placeholder="Location name" className="pl-9" value={editForm.venue}
                    onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Capacity</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                  <Input type="number" placeholder="2500" className="pl-9" value={editForm.capacity}
                    onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={editForm.ceremonyType} onValueChange={(v) => setEditForm({ ...editForm, ceremonyType: v as CeremonyType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CeremonyType.BACHELOR}>Bachelor</SelectItem>
                    <SelectItem value={CeremonyType.MASTER}>Master</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={editForm.semester} onValueChange={(v) => setEditForm({ ...editForm, semester: v as CeremonySemester })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CeremonySemester.FALL}>Fall</SelectItem>
                    <SelectItem value={CeremonySemester.SPRING}>Spring</SelectItem>
                    <SelectItem value={CeremonySemester.SUMMER}>Summer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ticket Price (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 25.00 — leave blank to keep current"
                  className="pl-9"
                  value={editForm.ticketPrice}
                  onChange={(e) => setEditForm({ ...editForm, ticketPrice: e.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Students cannot reserve tickets until a price is set.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button type="button" className="bg-primary hover:bg-primary/85 text-primary-foreground"
              onClick={handleEdit}
              disabled={updateCeremony.isPending || !editForm.title || !editForm.ceremonyDate}>
              {updateCeremony.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Cancel confirmation dialog ─────────────────────────────────── */}
      <Dialog open={!!cancelConfirm} onOpenChange={(open) => { if (!open) setCancelConfirm(null); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-700">Cancel Ceremony</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-1">
            Are you sure you want to cancel{" "}
            <strong className="text-foreground">"{cancelConfirm?.title}"</strong>?
            You can restore it later if needed.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCancelConfirm(null)}>Keep It</Button>
            <Button
              type="button"
              variant="destructive"
              disabled={cancelCeremony.isPending}
              onClick={() => {
                if (!cancelConfirm) return;
                cancelCeremony.mutate(cancelConfirm.id, {
                  onSuccess: () => {
                    setCancelConfirm(null);
                    toast.success("Ceremony cancelled.");
                  },
                  onError: (err: Error) => toast.error(err.message || "Failed to cancel ceremony."),
                });
              }}
            >
              {cancelCeremony.isPending ? "Cancelling..." : "Yes, Cancel Ceremony"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Restore confirmation dialog ────────────────────────────────── */}
      <Dialog open={!!restoreConfirm} onOpenChange={(open) => { if (!open) setRestoreConfirm(null); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-green-700">Restore Ceremony</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-1">
            Restore{" "}
            <strong className="text-foreground">"{restoreConfirm?.title}"</strong>{" "}
            back to upcoming status?
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRestoreConfirm(null)}>Cancel</Button>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={restoreCeremony.isPending}
              onClick={() => {
                if (!restoreConfirm) return;
                restoreCeremony.mutate(restoreConfirm.id, {
                  onSuccess: () => {
                    setRestoreConfirm(null);
                    toast.success("Ceremony restored to upcoming.");
                  },
                  onError: (err: Error) => toast.error(err.message || "Failed to restore ceremony."),
                });
              }}
            >
              {restoreCeremony.isPending ? "Restoring..." : "Yes, Restore Ceremony"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Banner upload dialog ───────────────────────────────────────── */}
      <Dialog open={bannerCeremonyId !== null} onOpenChange={(open) => { if (!open) closeBannerModal(); }}>
        <DialogContent className="sm:max-w-[340px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Ceremony Banner</DialogTitle>
          </DialogHeader>
          {bannerCurrentUrl && (
            <div className="relative w-full h-36 rounded-lg overflow-hidden border">
              <Image src={bannerCurrentUrl} alt="Current banner" fill className="object-cover" />
            </div>
          )}
          <div className="flex justify-center py-2">
            <ImageUpload
              currentUrl={bannerCurrentUrl}
              isPending={uploadBanner.isPending}
              label="Upload Banner"
              onFileSelect={(file) => {
                uploadBanner.mutate(file, {
                  onSuccess: () => {
                    closeBannerModal();
                    toast.success("Banner uploaded successfully.");
                  },
                  onError: (err: Error) => toast.error(err.message || "Failed to upload banner."),
                });
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeBannerModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
