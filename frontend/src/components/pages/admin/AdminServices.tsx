"use client";
import type { ServiceOffering } from "@/lib/api/types";

import { useState } from "react";
import { AdminLayout } from "@/components/shared";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Button, Switch, Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, Input, Label, Textarea, Select, SelectContent,
  SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui";
import Image from "next/image";
import { Trash2, Plus, ImageIcon } from "lucide-react";
import {
  useAdminCeremonies,
  useAdminServiceOfferings,
  useCreateServiceOffering,
  useDeleteServiceOffering,
  useUpdateServiceOffering,
} from "@/hooks/mutations/useAdmin";
import { useUploadServiceImage } from "@/hooks/mutations/useUpload";
import { ImageUpload } from "@/components/shared/ImageUpload";

export default function AdminServices() {
  const [selectedCeremonyId, setSelectedCeremonyId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageModalService, setImageModalService] = useState<{ id: number; imageUrl?: string | null } | null>(null);
  const [form, setForm] = useState({ title: "", description: "", price: "", quantity: "" });

  const { data: cerData } = useAdminCeremonies();
  const { data: svcData, isLoading } = useAdminServiceOfferings(selectedCeremonyId ?? 0);
  const createSvc = useCreateServiceOffering();
  const deleteSvc = useDeleteServiceOffering();
  const updateSvc = useUpdateServiceOffering();
  const uploadServiceImage = useUploadServiceImage(imageModalService?.id ?? 0);

  const today = new Date(new Date().toDateString());
  const ceremonies = (cerData?.ceremonies ?? []).filter(
    (c) => c.status === "UPCOMING" && new Date(c.ceremonyDate) >= today,
  );
  const services = svcData?.services ?? [];

  const handleCreate = () => {
    if (!selectedCeremonyId || !form.title || !form.price) return;
    createSvc.mutate(
      { ceremonyId: selectedCeremonyId, body: { title: form.title, description: form.description || undefined, price: Number(form.price), quantity: form.quantity ? Number(form.quantity) : undefined } },
      { onSuccess: () => { setModalOpen(false); setForm({ title: "", description: "", price: "", quantity: "" }); } },
    );
  };

  return (
    <AdminLayout activeSidebarItem="Ceremonies">
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-primary mb-4">Service Offerings</h3>
            <div className="w-64">
              <Select
                value={selectedCeremonyId ? String(selectedCeremonyId) : ""}
                onValueChange={(v) => setSelectedCeremonyId(Number(v))}
              >
                <SelectTrigger><SelectValue placeholder="Select Ceremony" /></SelectTrigger>
                <SelectContent>
                  {ceremonies.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!selectedCeremonyId} onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>

        {!selectedCeremonyId ? (
          <p className="text-muted-foreground text-center py-12">Select a ceremony to view services.</p>
        ) : (
          <div className="bg-background rounded-xl shadow-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : services.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No services found.</TableCell></TableRow>
                ) : services.map((s: ServiceOffering, i: number) => (
                  <TableRow key={s.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                    <TableCell className="px-6">
                      <button
                        type="button"
                        onClick={() => setImageModalService({ id: s.id, imageUrl: (s as { imageUrl?: string | null }).imageUrl })}
                        className="relative w-10 h-10 rounded border overflow-hidden bg-muted flex items-center justify-center hover:opacity-80"
                        title="Upload service image"
                      >
                        {(s as { imageUrl?: string | null }).imageUrl ? (
                          <Image src={(s as { imageUrl?: string | null }).imageUrl!} alt={s.title} fill className="object-cover" />
                        ) : (
                          <ImageIcon size={18} className="text-muted-foreground" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="px-6 font-medium">{s.title}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">{s.description ?? "—"}</TableCell>
                    <TableCell className="font-medium">${s.price}</TableCell>
                    <TableCell className="text-muted-foreground">{s.quantity}</TableCell>
                    <TableCell>
                      <Switch
                        checked={s.isActive}
                        onCheckedChange={(checked) => updateSvc.mutate({ serviceId: s.id, body: { isActive: checked }, ceremonyId: selectedCeremonyId! })}
                      />
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600"
                        onClick={() => deleteSvc.mutate({ serviceId: s.id, ceremonyId: selectedCeremonyId! })}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Add Service Offering</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input placeholder="e.g. Photography Package" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Brief description..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($) *</Label>
                <Input type="number" placeholder="0.00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" placeholder="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleCreate}
              disabled={createSvc.isPending || !form.title || !form.price}>
              {createSvc.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service image upload dialog */}
      <Dialog open={!!imageModalService} onOpenChange={(open) => { if (!open) setImageModalService(null); }}>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Service Image</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <ImageUpload
              currentUrl={imageModalService?.imageUrl}
              isPending={uploadServiceImage.isPending}
              label="Upload Image"
              onFileSelect={(file) => {
                uploadServiceImage.mutate(file, {
                  onSuccess: () => setImageModalService(null),
                });
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageModalService(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
