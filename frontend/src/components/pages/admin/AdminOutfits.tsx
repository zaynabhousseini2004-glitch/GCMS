"use client";

import { useState, Fragment } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { AdminLayout } from "@/components/shared";
import { Plus, ImageIcon, Pencil, Trash2 } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  useAdminOutfits,
  useCreateOutfit,
  useUpdateOutfit,
  useDeleteOutfit,
  useAdminOutfitRentals,
  useApproveOutfitRental,
  useRejectOutfitRental,
  useMarkRentalReturned,
} from "@/hooks/mutations/useAdmin";
import { useUploadOutfitImage } from "@/hooks/mutations/useUpload";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { OutfitType, OutfitStatus, CeremonyType, RentalStatus } from "@/lib/enums";

const rentalBadge = (s: string) => {
  if (s === RentalStatus.APPROVED) return "bg-green-50 text-green-700 border-green-200";
  if (s === RentalStatus.RETURNED) return "bg-blue-50 text-blue-700 border-blue-200";
  if (s === RentalStatus.REJECTED) return "bg-red-50 text-red-700 border-red-200";
  if (s === "CANCELLED") return "bg-muted text-foreground border-border";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export function AdminOutfits() {
  const [activeTab, setActiveTab] = useState<"inventory" | "requests">("inventory");
  const [modalOpen, setModalOpen] = useState(false);
  const [imageModalOutfit, setImageModalOutfit] = useState<{ id: number; imageUrl?: string | null } | null>(null);
  const [form, setForm] = useState({
    outfitType: OutfitType.GOWN,
    size: "",
    color: "",
    ceremonyType: CeremonyType.BACHELOR,
    quantityAvailable: "",
    rentalPrice: "",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState<{ id: number } | null>(null);
  const [editForm, setEditForm] = useState({
    outfitType: OutfitType.GOWN as OutfitType,
    size: "",
    color: "",
    ceremonyType: CeremonyType.BACHELOR as CeremonyType,
    quantityAvailable: "",
    rentalPrice: "",
    status: OutfitStatus.AVAILABLE as OutfitStatus,
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: outfitData, isLoading: loadingOutfits } = useAdminOutfits();
  const { data: rentalData, isLoading: loadingRentals } = useAdminOutfitRentals();
  const createOutfit = useCreateOutfit();
  const updateOutfit = useUpdateOutfit();
  const deleteOutfit = useDeleteOutfit();
  const approveRental = useApproveOutfitRental();
  const rejectRental = useRejectOutfitRental();
  const markReturned = useMarkRentalReturned();
  const uploadOutfitImage = useUploadOutfitImage(imageModalOutfit?.id ?? 0);

  const openEditModal = (row: typeof outfits[number]) => {
    setEditingOutfit({ id: row.id });
    setEditForm({
      outfitType: row.outfitType as OutfitType,
      size: row.size ?? "",
      color: row.color ?? "",
      ceremonyType: (row.ceremonyType ?? CeremonyType.BACHELOR) as CeremonyType,
      quantityAvailable: String(row.quantityAvailable ?? ""),
      rentalPrice: String(row.rentalPrice ?? ""),
      status: (row.status ?? OutfitStatus.AVAILABLE) as OutfitStatus,
    });
    setEditModalOpen(true);
  };

  const handleEdit = () => {
    if (!editingOutfit) return;
    updateOutfit.mutate(
      {
        id: editingOutfit.id,
        body: {
          outfitType: editForm.outfitType,
          size: editForm.size || undefined,
          color: editForm.color || undefined,
          ceremonyType: editForm.ceremonyType,
          quantityAvailable: editForm.quantityAvailable !== "" ? Math.max(0, Number(editForm.quantityAvailable)) : undefined,
          rentalPrice: editForm.rentalPrice !== "" ? Math.max(0, Number(editForm.rentalPrice)) : undefined,
          status: editForm.status,
        },
      },
      { onSuccess: () => { setEditModalOpen(false); setEditingOutfit(null); } },
    );
  };

  const outfits = outfitData?.outfits ?? [];
  const rentals = rentalData?.rentals ?? [];

  const stockPriority = (qty: number) => {
    if (qty === 0) return 0;
    if (qty < 10) return 1;
    return 2;
  };
  const sortedOutfits = [...outfits].sort(
    (a, b) => stockPriority(a.quantityAvailable ?? 0) - stockPriority(b.quantityAvailable ?? 0),
  );

  const handleCreate = () => {
    createOutfit.mutate(
      {
        outfitType: form.outfitType,
        size: form.size || undefined,
        color: form.color || undefined,
        ceremonyType: form.ceremonyType,
        quantityAvailable: form.quantityAvailable ? Number(form.quantityAvailable) : undefined,
        rentalPrice: form.rentalPrice ? Number(form.rentalPrice) : undefined,
      },
      { onSuccess: () => setModalOpen(false) },
    );
  };

  return (
    <AdminLayout activeSidebarItem="Outfits">
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-semibold text-primary">Outfits</h3>

        <div className="flex items-center gap-6 border-b border-border">
          {(["inventory", "requests"] as const).map((tab) => (
            <button
              key={tab}
              className={`pb-3 text-sm font-medium border-b-2 capitalize transition-colors ${
                activeTab === tab
                  ? "border-accent text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "inventory" ? "Inventory" : "Rental Requests"}
            </button>
          ))}
        </div>

        {activeTab === "inventory" && (
          <Card className="shadow-sm">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Manage graduation apparel inventory and pricing.</p>
              <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={() => setModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Outfit
              </Button>
            </div>
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6">Image</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Ceremony</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingOutfits ? (
                  <TableRow><TableCell colSpan={11} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : outfits.length === 0 ? (
                  <TableRow><TableCell colSpan={11} className="text-center py-8 text-muted-foreground">No outfits found.</TableCell></TableRow>
                ) : sortedOutfits.map((row, i) => {
                  const activeRentals = row._count?.outfitRentals ?? 0;
                  const availableQty = row.quantityAvailable ?? 0;
                  const totalQty = availableQty + activeRentals;
                  return (
                    <Fragment key={row.id}>
                      <TableRow className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                        <TableCell className="px-6">
                          <button
                            type="button"
                            onClick={() => setImageModalOutfit({ id: row.id, imageUrl: (row as { imageUrl?: string | null }).imageUrl })}
                            className="relative w-10 h-10 rounded border overflow-hidden bg-muted flex items-center justify-center hover:opacity-80"
                            title="Upload outfit image"
                          >
                            {(row as { imageUrl?: string | null }).imageUrl ? (
                              <Image src={(row as { imageUrl?: string | null }).imageUrl!} alt={row.outfitType} fill className="object-cover" />
                            ) : (
                              <ImageIcon size={18} className="text-muted-foreground" />
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="font-medium">{row.outfitType}</TableCell>
                        <TableCell className="text-muted-foreground">{row.size ?? "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{row.color ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-muted text-foreground">{row.ceremonyType ?? "—"}</Badge>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{totalQty}</TableCell>
                        <TableCell>
                          {activeRentals > 0 ? (
                            <span className="font-medium text-amber-600">{activeRentals}</span>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {availableQty === 0 ? (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="font-bold text-red-600">0</span>
                              <span className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.5">Out of Stock</span>
                            </span>
                          ) : availableQty < 10 ? (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="font-bold text-amber-600">{availableQty}</span>
                              <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">Low Stock</span>
                            </span>
                          ) : (
                            <span className="font-medium text-primary">{availableQty}</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">${row.rentalPrice}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={row.status === "AVAILABLE" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}>
                            {row.status === "AVAILABLE" ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-6">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => openEditModal(row)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                              onClick={() => setDeleteConfirmId(row.id)}
                              title="Delete outfit">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {availableQty === 0 && (
                        <TableRow className="bg-red-50 hover:bg-red-50">
                          <TableCell colSpan={11} className="py-2 px-6 border-b border-red-100">
                            <p className="text-xs text-red-600 font-medium">
                              ⚠ No available stock for {row.outfitType}{row.size ? ` (${row.size})` : ""}
                              {row.color ? ` — ${row.color}` : ""}. Please restock using the Edit button.
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}

        {activeTab === "requests" && (
          <Card className="shadow-sm">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6">Student</TableHead>
                  <TableHead>Outfit Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Returned</TableHead>
                  <TableHead className="px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingRentals ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : rentals.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No rental requests.</TableCell></TableRow>
                ) : rentals.map((r, i) => (
                  <TableRow key={r.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                    <TableCell className="px-6 font-medium">{r.user?.fullName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{r.outfit?.outfitType ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{r.selectedSize}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={rentalBadge(r.rentalStatus)}>{r.rentalStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {r.returnDate ? new Date(r.returnDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      {r.rentalStatus === RentalStatus.PENDING && (() => {
                        const relatedOutfit = outfits.find((o) => o.id === r.outfit?.id);
                        const outfitAvailable = relatedOutfit?.quantityAvailable ?? 0;
                        const noStock = outfitAvailable === 0;
                        return (
                          <div className="flex flex-col items-end gap-1">
                            {noStock && (
                              <p className="text-xs text-red-600 font-medium text-right">
                                No available stock — restock to approve.
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => {
                                  approveRental.mutate(r.id, {
                                    onSuccess: () => {
                                      if (relatedOutfit && relatedOutfit.quantityAvailable === 1) {
                                        toast.warning("Outfit is now out of stock", {
                                          description: `${relatedOutfit.outfitType}${relatedOutfit.size ? ` (${relatedOutfit.size})` : ""} has 0 units left. Use the Edit button to restock it.`,
                                          duration: 6000,
                                        });
                                      }
                                    },
                                  });
                                }}
                                disabled={approveRental.isPending || noStock}
                                title={noStock ? "Cannot approve: outfit is out of stock" : undefined}>
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" className="h-7 text-xs"
                                onClick={() => rejectRental.mutate(r.id)}
                                disabled={rejectRental.isPending}>
                                Reject
                              </Button>
                            </div>
                            {approveRental.isError && (approveRental.variables as number) === r.id && (
                              <p className="text-xs text-red-600">
                                {(approveRental.error as Error).message}
                              </p>
                            )}
                          </div>
                        );
                      })()}
                      {r.rentalStatus === RentalStatus.APPROVED && !r.returnDate && (
                        <div className="flex flex-col items-end gap-1">
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white h-7 text-xs"
                            onClick={() => {
                              markReturned.mutate(r.id, {
                                onSuccess: () => {
                                  toast.success("Outfit returned", {
                                    description: "Stock has been restored.",
                                    duration: 4000,
                                  });
                                },
                              });
                            }}
                            disabled={markReturned.isPending}>
                            Mark Returned
                          </Button>
                          {markReturned.isError && (markReturned.variables as number) === r.id && (
                            <p className="text-xs text-red-600">{(markReturned.error as Error).message}</p>
                          )}
                        </div>
                      )}
                      {r.rentalStatus === RentalStatus.RETURNED && (
                        <span className="text-xs font-medium text-blue-600">Completed</span>
                      )}
                      {r.rentalStatus === RentalStatus.REJECTED && (
                        <span className="text-xs font-medium text-red-500">Rejected</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Add New Outfit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.outfitType} onValueChange={(v) => setForm({ ...form, outfitType: v as OutfitType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={OutfitType.GOWN}>Gown</SelectItem>
                  <SelectItem value={OutfitType.CAP}>Cap</SelectItem>
                  <SelectItem value={OutfitType.HOOD}>Hood</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Size</Label>
                <Input placeholder="e.g. M, L, XL" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input placeholder="e.g. Black" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ceremony Type</Label>
              <Select value={form.ceremonyType} onValueChange={(v) => setForm({ ...form, ceremonyType: v as CeremonyType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={CeremonyType.BACHELOR}>Bachelor</SelectItem>
                  <SelectItem value={CeremonyType.MASTER}>Master</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" placeholder="0" value={form.quantityAvailable} onChange={(e) => setForm({ ...form, quantityAvailable: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Rental Price ($)</Label>
                <Input type="number" placeholder="0.00" value={form.rentalPrice} onChange={(e) => setForm({ ...form, rentalPrice: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={handleCreate} disabled={createOutfit.isPending}>
              {createOutfit.isPending ? "Saving..." : "Save Outfit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Outfit dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Edit Outfit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={editForm.outfitType} onValueChange={(v) => setEditForm({ ...editForm, outfitType: v as OutfitType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={OutfitType.GOWN}>Gown</SelectItem>
                  <SelectItem value={OutfitType.CAP}>Cap</SelectItem>
                  <SelectItem value={OutfitType.HOOD}>Hood</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Size</Label>
                <Input placeholder="e.g. M, L, XL" value={editForm.size} onChange={(e) => setEditForm({ ...editForm, size: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <Input placeholder="e.g. Black" value={editForm.color} onChange={(e) => setEditForm({ ...editForm, color: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ceremony Type</Label>
              <Select value={editForm.ceremonyType} onValueChange={(v) => setEditForm({ ...editForm, ceremonyType: v as CeremonyType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={CeremonyType.BACHELOR}>Bachelor</SelectItem>
                  <SelectItem value={CeremonyType.MASTER}>Master</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="0" placeholder="0" value={editForm.quantityAvailable}
                  onChange={(e) => {
                    const qty = e.target.value;
                    setEditForm({
                      ...editForm,
                      quantityAvailable: qty,
                      ...(Number(qty) > 0 && editForm.status === OutfitStatus.UNAVAILABLE && {
                        status: OutfitStatus.AVAILABLE,
                      }),
                    });
                  }} />
              </div>
              <div className="space-y-2">
                <Label>Rental Price ($)</Label>
                <Input type="number" min="0" placeholder="0.00" value={editForm.rentalPrice}
                  onChange={(e) => setEditForm({ ...editForm, rentalPrice: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editForm.status} onValueChange={(v) => setEditForm({ ...editForm, status: v as OutfitStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={OutfitStatus.AVAILABLE}>Available</SelectItem>
                  <SelectItem value={OutfitStatus.UNAVAILABLE}>Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={handleEdit}
              disabled={updateOutfit.isPending}>
              {updateOutfit.isPending ? "Saving..." : "Save Outfit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteConfirmId !== null} onOpenChange={(open) => { if (!open) setDeleteConfirmId(null); }}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Delete Outfit</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete this outfit? This cannot be undone.
            Outfits with rental history cannot be deleted — set them to
            <strong> Unavailable</strong> instead to hide from students.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteOutfit.isPending}
              onClick={() => {
                if (deleteConfirmId === null) return;
                deleteOutfit.mutate(deleteConfirmId, {
                  onSuccess: () => {
                    toast.success("Outfit deleted.");
                    setDeleteConfirmId(null);
                  },
                  onError: (err: Error) => {
                    toast.error(err.message || "Failed to delete outfit.");
                    setDeleteConfirmId(null);
                  },
                });
              }}
            >
              {deleteOutfit.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image upload dialog */}
      <Dialog open={!!imageModalOutfit} onOpenChange={(open) => { if (!open) setImageModalOutfit(null); }}>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Outfit Image</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <ImageUpload
              currentUrl={imageModalOutfit?.imageUrl}
              isPending={uploadOutfitImage.isPending}
              label="Upload Image"
              onFileSelect={(file) => {
                uploadOutfitImage.mutate(file, {
                  onSuccess: () => setImageModalOutfit(null),
                });
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageModalOutfit(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
