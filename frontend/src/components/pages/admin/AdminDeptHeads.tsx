"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/shared";
import {
  Button, Avatar, AvatarFallback, Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter, Input, Label, Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui";
import { Trash2, Plus, Pencil } from "lucide-react";
import {
  useAdminDepartmentHeads,
  useCreateDepartmentHead,
  useUpdateDepartmentHead,
  useDeleteDepartmentHead,
  useAdminDepartmentTitles,
} from "@/hooks/mutations/useAdmin";
import { useUploadDepartmentHeadPhoto } from "@/hooks/mutations/useUpload";
import { ImageUpload } from "@/components/shared/ImageUpload";
import type { DepartmentHead, DepartmentTitle } from "@/lib/api/types";

export default function AdminDeptHeads() {
  const [modalOpen, setModalOpen] = useState(false);
  const [photoModalHead, setPhotoModalHead] = useState<{ id: number; photoUrl?: string | null } | null>(null);
  const [form, setForm] = useState({ fullName: "", departmentTitleId: "" });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingHead, setEditingHead] = useState<{ id: number } | null>(null);
  const [editForm, setEditForm] = useState({ fullName: "", departmentTitleId: "" });

  const { data, isLoading } = useAdminDepartmentHeads();
  const { data: titlesData } = useAdminDepartmentTitles();
  const createHead = useCreateDepartmentHead();
  const updateHead = useUpdateDepartmentHead();
  const deleteHead = useDeleteDepartmentHead();
  const uploadPhoto = useUploadDepartmentHeadPhoto(photoModalHead?.id ?? 0);

  const heads = data?.departmentHeads ?? [];
  const titles = titlesData?.departmentTitles ?? [];

  const handleCreate = () => {
    if (!form.fullName || !form.departmentTitleId) return;
    createHead.mutate(
      { fullName: form.fullName, departmentTitleId: Number(form.departmentTitleId) },
      { onSuccess: () => { setModalOpen(false); setForm({ fullName: "", departmentTitleId: "" }); } },
    );
  };

  const openEditModal = (head: DepartmentHead) => {
    setEditingHead({ id: head.id });
    setEditForm({
      fullName: head.fullName,
      departmentTitleId: String(head.departmentTitleId),
    });
    setEditModalOpen(true);
  };

  const handleEdit = () => {
    if (!editingHead || !editForm.fullName || !editForm.departmentTitleId) return;
    updateHead.mutate(
      {
        id: editingHead.id,
        body: {
          fullName: editForm.fullName,
          departmentTitleId: Number(editForm.departmentTitleId),
        },
      },
      { onSuccess: () => { setEditModalOpen(false); setEditingHead(null); } },
    );
  };

  return (
    <AdminLayout activeSidebarItem="Dept Heads">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-primary">Department Heads</h3>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Department Head
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-center py-8">Loading...</p>
      ) : heads.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No department heads found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {heads.map((head) => (
            <div key={head.id} className="bg-background rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-border hover:shadow-lg transition-shadow">
              <button
                type="button"
                className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-border shadow-sm mb-4 bg-primary/10 group"
                onClick={() => setPhotoModalHead({ id: head.id, photoUrl: (head as { photoUrl?: string | null }).photoUrl })}
                title="Upload photo"
              >
                {(head as { photoUrl?: string | null }).photoUrl ? (
                  <Image
                    src={(head as { photoUrl?: string | null }).photoUrl!}
                    alt={head.fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Avatar className="h-24 w-24 bg-primary text-primary-foreground text-2xl font-semibold">
                    <AvatarFallback>{head.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <span className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs rounded-full">
                  Photo
                </span>
              </button>
              <h4 className="text-lg font-bold text-foreground mb-1">{head.fullName}</h4>
              <p className="text-sm font-medium text-accent mb-3">{head.departmentTitle}</p>
              <div className="flex gap-2 w-full justify-center pt-4 border-t border-border mt-auto">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary"
                  onClick={() => openEditModal(head)}>
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-600"
                  onClick={() => deleteHead.mutate(head.id)}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Add Department Head</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Dr. Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Department Title</Label>
              <Select value={form.departmentTitleId} onValueChange={(v) => setForm({ ...form, departmentTitleId: v })}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {titles.map((t: DepartmentTitle) => (
                    <SelectItem key={t.id} value={String(t.id)}>{t.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={handleCreate}
              disabled={createHead.isPending || !form.fullName || !form.departmentTitleId}>
              {createHead.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Edit Department Head</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Dr. Full Name" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Department Title</Label>
              <Select value={editForm.departmentTitleId} onValueChange={(v) => setEditForm({ ...editForm, departmentTitleId: v })}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {titles.map((t: DepartmentTitle) => (
                    <SelectItem key={t.id} value={String(t.id)}>{t.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={handleEdit}
              disabled={updateHead.isPending || !editForm.fullName || !editForm.departmentTitleId}>
              {updateHead.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Photo upload dialog */}
      <Dialog open={!!photoModalHead} onOpenChange={(open) => { if (!open) setPhotoModalHead(null); }}>
        <DialogContent className="sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Department Head Photo</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <ImageUpload
              currentUrl={photoModalHead?.photoUrl}
              isPending={uploadPhoto.isPending}
              label="Upload Photo"
              onFileSelect={(file) => {
                uploadPhoto.mutate(file, {
                  onSuccess: () => setPhotoModalHead(null),
                });
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhotoModalHead(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
