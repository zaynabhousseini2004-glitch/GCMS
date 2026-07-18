"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/shared";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  Textarea,
} from "@/components/ui";
import { Trash2, Plus, Pencil } from "lucide-react";
import {
  useAdminCeremonies,
  useAdminInstructions,
  useCreateInstruction,
  useUpdateInstruction,
  useDeleteInstruction,
} from "@/hooks/mutations/useAdmin";
import type { Instruction } from "@/lib/api/types";

export default function AdminInstructions() {
  const [selectedCeremonyId, setSelectedCeremonyId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", target: "STUDENT", order: "1" });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingInstr, setEditingInstr] = useState<{ id: number } | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", target: "STUDENT" });

  const { data: cerData } = useAdminCeremonies();
  const { data: instrData, isLoading } = useAdminInstructions(selectedCeremonyId ?? 0);
  const createInstr = useCreateInstruction();
  const updateInstr = useUpdateInstruction();
  const deleteInstr = useDeleteInstruction();

  const today = new Date(new Date().toDateString());
  const ceremonies = (cerData?.ceremonies ?? []).filter(
    (c) => c.status === "UPCOMING" && new Date(c.ceremonyDate) >= today,
  );
  const instructions = instrData?.instructions ?? [];

  const handleCreate = () => {
    if (!selectedCeremonyId || !form.content) return;
    createInstr.mutate(
      {
        content: form.content,
        title: form.title || undefined,
        ceremonyId: selectedCeremonyId,
        target: form.target || undefined,
      },
      { onSuccess: () => { setModalOpen(false); setForm({ title: "", content: "", target: "STUDENT", order: "1" }); } },
    );
  };

  const openEditModal = (instr: Instruction) => {
    setEditingInstr({ id: instr.id });
    setEditForm({
      title: instr.title ?? "",
      content: instr.content,
      target: instr.target ?? "STUDENT",
    });
    setEditModalOpen(true);
  };

  const handleEdit = () => {
    if (!editingInstr || !selectedCeremonyId || !editForm.content) return;
    updateInstr.mutate(
      {
        id: editingInstr.id,
        ceremonyId: selectedCeremonyId,
        body: {
          title: editForm.title || undefined,
          content: editForm.content,
          target: editForm.target || undefined,
        },
      },
      { onSuccess: () => { setEditModalOpen(false); setEditingInstr(null); } },
    );
  };

  return (
    <AdminLayout activeSidebarItem="Instructions">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-primary mb-4">Ceremony Instructions</h3>
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
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={!selectedCeremonyId}
          onClick={() => setModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Instruction
        </Button>
      </div>

      {!selectedCeremonyId ? (
        <p className="text-muted-foreground text-center py-12">Select a ceremony to view instructions.</p>
      ) : isLoading ? (
        <p className="text-muted-foreground text-center py-12">Loading...</p>
      ) : instructions.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No instructions found for this ceremony.</p>
      ) : (
        <div className="space-y-4">
          {instructions.map((instr) => (
            <div key={instr.id} className="bg-background border border-border rounded-xl p-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground mb-1">{instr.title ?? `Instruction #${instr.id}`}</p>
                <p className="text-sm text-muted-foreground">{instr.content}</p>
                {instr.target && (
                  <span className="text-xs text-accent mt-2 inline-block">Target: {instr.target}</span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => openEditModal(instr)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600"
                  onClick={() => deleteInstr.mutate({ id: instr.id, ceremonyId: selectedCeremonyId! })}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add Instruction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select value={form.target} onValueChange={(v) => setForm({ ...form, target: v })}>
                <SelectTrigger><SelectValue placeholder="Select target" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Students</SelectItem>
                  <SelectItem value="PARENT">Parents</SelectItem>
                  <SelectItem value="GUEST">Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="e.g. Arrival Time" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                placeholder="Write the instruction content..."
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleCreate}
              disabled={createInstr.isPending || !form.content}>
              {createInstr.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Instruction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select value={editForm.target} onValueChange={(v) => setEditForm({ ...editForm, target: v })}>
                <SelectTrigger><SelectValue placeholder="Select target" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Students</SelectItem>
                  <SelectItem value="PARENT">Parents</SelectItem>
                  <SelectItem value="GUEST">Guests</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="e.g. Arrival Time" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                placeholder="Write the instruction content..."
                rows={4}
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleEdit}
              disabled={updateInstr.isPending || !editForm.content}>
              {updateInstr.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
