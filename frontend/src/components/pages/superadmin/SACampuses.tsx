"use client";

import { useState } from "react";
import Image from "next/image";
import { SuperadminLayout } from "@/components/shared";
import {
  Card,
  Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Input, Label,
} from "@/components/ui";
import { Plus, Trash2, MapPin, Building2, Pencil } from "lucide-react";
import { useCampuses, useCreateCampus, useDeleteCampus, useUpdateCampus } from "@/hooks/mutations/useSuperadmin";
import { useUploadCampusImage } from "@/hooks/mutations/useUpload";
import { ImageUpload } from "@/components/shared/ImageUpload";

export function SACampuses() {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageModalCampus, setImageModalCampus] = useState<{ id: number; imageUrl?: string | null } | null>(null);
  const [form, setForm] = useState({ name: "", location: "" });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCampus, setEditingCampus] = useState<{ id: number } | null>(null);
  const [editForm, setEditForm] = useState({ name: "", location: "" });

  const { data, isLoading } = useCampuses();
  const createCampus = useCreateCampus();
  const deleteCampus = useDeleteCampus();
  const updateCampus = useUpdateCampus();
  const uploadCampusImage = useUploadCampusImage(imageModalCampus?.id ?? 0);

  const openEditModal = (campus: { id: number; name: string; location?: string | null }) => {
    setEditingCampus({ id: campus.id });
    setEditForm({ name: campus.name, location: campus.location ?? "" });
    setEditModalOpen(true);
  };

  const handleEdit = () => {
    if (!editingCampus) return;
    updateCampus.mutate(
      { id: editingCampus.id, body: { name: editForm.name, location: editForm.location || undefined } },
      { onSuccess: () => { setEditModalOpen(false); setEditingCampus(null); } },
    );
  };

  const campuses = data?.campuses ?? [];

  const handleCreate = () => {
    createCampus.mutate(
      { name: form.name, location: form.location || undefined },
      { onSuccess: () => { setModalOpen(false); setForm({ name: "", location: "" }); } },
    );
  };

  return (
    <SuperadminLayout activeSidebarItem="Campuses">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-primary">Campuses</h3>
          <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Campus
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p className="text-muted-foreground col-span-3 text-center py-8">Loading...</p>
          ) : campuses.length === 0 ? (
            <p className="text-muted-foreground col-span-3 text-center py-8">No campuses found.</p>
          ) : campuses.map((campus) => (
            <Card key={campus.id} className="p-5 shadow-sm">
              {/* Campus image */}
              <button
                type="button"
                className="group relative w-full h-28 rounded-lg overflow-hidden border bg-muted flex items-center justify-center mb-3"
                onClick={() => setImageModalCampus({ id: campus.id, imageUrl: campus.imageUrl })}
                title={campus.imageUrl ? "Change campus image" : "Upload campus image"}
              >
                {campus.imageUrl ? (
                  <>
                    <Image src={campus.imageUrl} alt={campus.name} fill className="object-cover transition-opacity group-hover:opacity-80" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-white">
                        <Pencil className="w-3.5 h-3.5" />
                        Change image
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="relative w-full h-full flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-primary/10 to-primary/5 text-muted-foreground transition-colors group-hover:from-primary/15 group-hover:to-primary/10">
                    <Building2 size={26} className="text-primary/40" />
                    <span className="text-xs font-medium">No image yet — click to add</span>
                  </span>
                )}
              </button>

              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-foreground">{campus.name}</h4>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => openEditModal({ id: campus.id, name: campus.name, location: campus.location })}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600"
                    onClick={() => deleteCampus.mutate(campus.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {campus.location && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{campus.location}</span>
                </div>
              )}
              <div className="flex gap-4 text-sm border-t border-border pt-3 mt-3">
                <div>
                  <span className="text-muted-foreground">Users: </span>
                  <span className="font-medium">{campus._count?.users ?? 0}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Ceremonies: </span>
                  <span className="font-medium">{campus._count?.ceremonies ?? 0}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Add Campus</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Campus Name *</Label>
              <Input placeholder="e.g. Main Campus" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input placeholder="City, Country" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={handleCreate}
              disabled={createCampus.isPending || !form.name}>
              {createCampus.isPending ? "Creating..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campus dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Edit Campus</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Campus Name *</Label>
              <Input placeholder="e.g. Main Campus" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input placeholder="City, Country" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={handleEdit}
              disabled={updateCampus.isPending || !editForm.name}>
              {updateCampus.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campus image upload dialog */}
      <Dialog open={!!imageModalCampus} onOpenChange={(open) => { if (!open) setImageModalCampus(null); }}>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Campus Image</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <ImageUpload
              currentUrl={imageModalCampus?.imageUrl}
              isPending={uploadCampusImage.isPending}
              label="Upload Image"
              onFileSelect={(file) => {
                uploadCampusImage.mutate(file, {
                  onSuccess: () => setImageModalCampus(null),
                });
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageModalCampus(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperadminLayout>
  );
}

