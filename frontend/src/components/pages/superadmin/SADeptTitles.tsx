"use client";

import { useState } from "react";
import { SuperadminLayout } from "@/components/shared";
import {
  Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Input, Label,
} from "@/components/ui";
import { Plus, Trash2, Pencil } from "lucide-react";
import {
  useDepartmentTitles,
  useCreateDepartmentTitle,
  useUpdateDepartmentTitle,
  useDeleteDepartmentTitle,
} from "@/hooks/mutations/useSuperadmin";
import type { DepartmentTitle } from "@/lib/api/types";

export function SADeptTitles() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<DepartmentTitle | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const { data, isLoading } = useDepartmentTitles();
  const createTitle = useCreateDepartmentTitle();
  const updateTitle = useUpdateDepartmentTitle();
  const deleteTitle = useDeleteDepartmentTitle();

  const titles = data?.departmentTitles ?? [];

  const handleCreate = () => {
    createTitle.mutate({ title: newTitle }, { onSuccess: () => { setCreateOpen(false); setNewTitle(""); } });
  };

  const handleEdit = () => {
    if (!editItem) return;
    updateTitle.mutate({ id: editItem.id, body: { title: editTitle } }, { onSuccess: () => setEditItem(null) });
  };

  return (
    <SuperadminLayout activeSidebarItem="Dept Titles">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-primary">Department Titles</h3>
          <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Title
          </Button>
        </div>

        <Card className="shadow-sm">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="px-6">Title</TableHead>
                <TableHead>Department Heads</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : titles.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No department titles found.</TableCell></TableRow>
              ) : titles.map((t: DepartmentTitle, i: number) => (
                <TableRow key={t.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                  <TableCell className="px-6 font-medium">{t.title}</TableCell>
                  <TableCell className="text-muted-foreground">{t._count?.heads ?? 0}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => { setEditItem(t); setEditTitle(t.title); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-600"
                        onClick={() => deleteTitle.mutate(t.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader><DialogTitle>Add Department Title</DialogTitle></DialogHeader>
          <div className="py-4 space-y-2">
            <Label>Title *</Label>
            <Input placeholder="e.g. Head of Engineering" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={handleCreate}
              disabled={createTitle.isPending || !newTitle}>
              {createTitle.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader><DialogTitle>Edit Department Title</DialogTitle></DialogHeader>
          <div className="py-4 space-y-2">
            <Label>Title *</Label>
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={handleEdit}
              disabled={updateTitle.isPending || !editTitle}>
              {updateTitle.isPending ? "Saving..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperadminLayout>
  );
}
