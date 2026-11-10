"use client";
import type { AdminUser } from "@/lib/api/types";

import { useState } from "react";
import { SuperadminLayout } from "@/components/shared";
import {
  Badge, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  Input, Label, Avatar, AvatarFallback,
} from "@/components/ui";
import { Plus, UserCheck, UserX, Eye, EyeOff, Pencil } from "lucide-react";
import {
  normalizePhoneInput,
  validatePhone,
  validatePassword,
  PASSWORD_LENGTH,
  PHONE_DIGITS,
} from "@/lib/validation";
import {
  useAdminUsers,
  useCreateAdmin,
  useUpdateAdmin,
  useDeactivateAdmin,
  useActivateAdmin,
  useCampuses,
} from "@/hooks/mutations/useSuperadmin";
import { UserStatus } from "@/lib/enums";

// ─── helpers ──────────────────────────────────────────────────────────────────

type CreateForm = { fullName: string; email: string; password: string; phone: string; campusId: string };
type EditForm   = { fullName: string; email: string; password: string; phone: string; campusId: string };

const emptyCreate = (): CreateForm => ({ fullName: "", email: "", password: "", phone: "", campusId: "" });
const emptyEdit   = (): EditForm   => ({ fullName: "", email: "", password: "", phone: "", campusId: "" });

// ─── component ────────────────────────────────────────────────────────────────

export function SAUsers() {
  // ── Create modal state ──────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>(emptyCreate());
  const [createShowPw, setCreateShowPw] = useState(false);
  const [createPhoneErr, setCreatePhoneErr] = useState("");
  const [createPwErr, setCreatePwErr] = useState("");
  const [createCampusErr, setCreateCampusErr] = useState("");

  // ── Edit modal state ────────────────────────────────────────────────────────
  const [editAdmin, setEditAdmin] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyEdit());
  const [editShowPw, setEditShowPw] = useState(false);
  const [editPhoneErr, setEditPhoneErr] = useState("");
  const [editPwErr, setEditPwErr] = useState("");

  // ── Queries / mutations ─────────────────────────────────────────────────────
  const { data, isLoading } = useAdminUsers();
  const { data: campusData } = useCampuses();
  const createAdmin = useCreateAdmin();
  const updateAdmin = useUpdateAdmin();
  const deactivate = useDeactivateAdmin();
  const activate = useActivateAdmin();

  const admins = data?.users ?? [];
  const campuses = campusData?.campuses ?? [];

  const campusName = (campusId?: number | null) => {
    if (!campusId) return "—";
    return campuses.find((c) => c.id === campusId)?.name ?? `Campus ${campusId}`;
  };

  // ── Create handlers ─────────────────────────────────────────────────────────

  const resetCreate = () => {
    setCreateForm(emptyCreate());
    setCreatePhoneErr(""); setCreatePwErr(""); setCreateCampusErr("");
    setCreateShowPw(false);
  };

  const handleCreate = () => {
    setCreatePwErr(""); setCreateCampusErr("");
    const phoneErr = validatePhone(createForm.phone);
    if (phoneErr) { setCreatePhoneErr(phoneErr); return; }
    const pwErr = validatePassword(createForm.password);
    if (pwErr) { setCreatePwErr(pwErr); return; }
    if (!createForm.campusId) { setCreateCampusErr("Please select a campus."); return; }

    createAdmin.mutate(
      {
        fullName: createForm.fullName,
        email: createForm.email,
        password: createForm.password,
        phone: createForm.phone || undefined,
        campusId: Number(createForm.campusId),
      },
      { onSuccess: () => { setCreateOpen(false); resetCreate(); } },
    );
  };

  // ── Edit handlers ───────────────────────────────────────────────────────────

  const openEdit = (admin: AdminUser) => {
    setEditAdmin(admin);
    setEditForm({
      fullName: admin.fullName,
      email: admin.email,
      password: "",
      phone: admin.phone ?? "",
      campusId: admin.campusId ? String(admin.campusId) : "",
    });
    setEditPhoneErr(""); setEditPwErr("");
    setEditShowPw(false);
  };

  const resetEdit = () => {
    setEditAdmin(null);
    setEditForm(emptyEdit());
    setEditPhoneErr(""); setEditPwErr("");
    setEditShowPw(false);
  };

  const handleEdit = () => {
    if (!editAdmin) return;
    setEditPwErr("");

    const phoneErr = validatePhone(editForm.phone);
    if (phoneErr) { setEditPhoneErr(phoneErr); return; }

    if (editForm.password) {
      const pwErr = validatePassword(editForm.password);
      if (pwErr) { setEditPwErr(pwErr); return; }
    }

    const body: {
      fullName?: string; email?: string; password?: string;
      phone?: string; campusId?: number | null;
    } = {
      fullName: editForm.fullName,
      email: editForm.email,
      phone: editForm.phone || undefined,
      // Only include campusId if one was selected; omitting it leaves the DB value unchanged.
      campusId: editForm.campusId ? Number(editForm.campusId) : undefined,
    };
    if (editForm.password) body.password = editForm.password;

    updateAdmin.mutate(
      { id: editAdmin.id, body },
      { onSuccess: () => resetEdit() },
    );
  };

  // ── Phone field helpers (reusable pattern) ──────────────────────────────────

  const phoneInputProps = (
    value: string,
    setValue: (v: string) => void,
    setErr: (e: string) => void,
    hasErr: boolean,
  ) => ({
    placeholder: "+961 XXXXXXXX",
    value,
    maxLength: 12,
    className: hasErr ? "border-red-400 focus-visible:ring-red-400" : "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const n = normalizePhoneInput(e.target.value);
      setValue(n);
      if (hasErr) setErr(validatePhone(n) ?? "");
    },
    onFocus: () => { if (!value) setValue("+961"); },
    onBlur: () => {
      const cur = value === "+961" ? "" : value;
      if (value === "+961") setValue("");
      setErr(validatePhone(cur) ?? "");
    },
  });

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <SuperadminLayout activeSidebarItem="Users">
      <div className="flex flex-col gap-6">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-primary">Admin Users</h3>
          <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Admin
          </Button>
        </div>

        {/* Table */}
        <Card className="shadow-sm">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="px-6">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Campus</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : admins.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No admins found.</TableCell></TableRow>
              ) : admins.map((admin: AdminUser, i: number) => (
                <TableRow key={admin.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                  <TableCell className="px-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{admin.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{admin.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                  <TableCell className="text-muted-foreground">{admin.phone ?? "—"}</TableCell>
                  <TableCell>
                    {admin.campusId
                      ? <span className="text-muted-foreground">{campusName(admin.campusId)}</span>
                      : <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Unassigned</Badge>
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      admin.status === UserStatus.ACTIVE
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }>
                      {admin.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/10 gap-1"
                        onClick={() => openEdit(admin)}>
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      {admin.status === UserStatus.ACTIVE ? (
                        <Button variant="ghost" size="sm" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
                          onClick={() => deactivate.mutate(admin.id)}>
                          <UserX className="w-4 h-4" />
                          Deactivate
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 gap-1"
                          onClick={() => activate.mutate(admin.id)}>
                          <UserCheck className="w-4 h-4" />
                          Activate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* ── Create Admin modal ─────────────────────────────────────────────────── */}
      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) resetCreate(); setCreateOpen(open); }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Create Admin</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Full name" value={createForm.fullName}
                onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })} />
            </div>
            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="admin@example.com" value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />
            </div>
            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={createShowPw ? "text" : "password"}
                  placeholder={`At least ${PASSWORD_LENGTH} characters`}
                  value={createForm.password}
                  className={`pr-10 ${createPwErr ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                  onChange={(e) => { setCreateForm({ ...createForm, password: e.target.value }); if (createPwErr) setCreatePwErr(""); }}
                />
                <button type="button" onClick={() => setCreateShowPw(!createShowPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground focus:outline-none">
                  {createShowPw ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              {createPwErr
                ? <p className="text-xs text-red-600">{createPwErr}</p>
                : <p className="text-xs text-muted-foreground">Must be at least {PASSWORD_LENGTH} characters</p>
              }
            </div>
            {/* Phone */}
            <div className="space-y-2">
              <Label>Phone <span className="text-muted-foreground font-normal text-xs">(optional)</span></Label>
              <Input {...phoneInputProps(
                createForm.phone,
                (v) => setCreateForm({ ...createForm, phone: v }),
                setCreatePhoneErr,
                !!createPhoneErr,
              )} />
              {createPhoneErr
                ? <p className="text-xs text-red-600">{createPhoneErr}</p>
                : <p className="text-xs text-muted-foreground">Format: +961 followed by {PHONE_DIGITS} digits</p>
              }
            </div>
            {/* Campus */}
            <div className="space-y-2">
              <Label>Campus <span className="text-destructive ml-0.5">*</span></Label>
              <select
                className={`w-full border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                  createCampusErr ? "border-red-400 focus:ring-red-400" : "border-input"
                }`}
                value={createForm.campusId}
                onChange={(e) => { setCreateForm({ ...createForm, campusId: e.target.value }); if (createCampusErr) setCreateCampusErr(""); }}
              >
                <option value="">— Select campus —</option>
                {campuses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {createCampusErr && <p className="text-xs text-red-600">{createCampusErr}</p>}
              {campuses.length === 0 && (
                <p className="text-xs text-amber-600">No campuses available. Create a campus first.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); resetCreate(); }}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={handleCreate}
              disabled={createAdmin.isPending || !createForm.fullName || !createForm.email || createForm.password.length < PASSWORD_LENGTH || !createForm.campusId}>
              {createAdmin.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Admin modal ───────────────────────────────────────────────────── */}
      <Dialog open={!!editAdmin} onOpenChange={(open) => { if (!open) resetEdit(); }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Edit Admin</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Full name" value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
            </div>
            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="admin@example.com" value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </div>
            {/* Password — optional on edit */}
            <div className="space-y-2">
              <Label>
                New Password
                <span className="text-muted-foreground font-normal text-xs ml-1">(leave blank to keep current)</span>
              </Label>
              <div className="relative">
                <Input
                  type={editShowPw ? "text" : "password"}
                  placeholder={`At least ${PASSWORD_LENGTH} characters`}
                  value={editForm.password}
                  className={`pr-10 ${editPwErr ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                  onChange={(e) => { setEditForm({ ...editForm, password: e.target.value }); if (editPwErr) setEditPwErr(""); }}
                />
                <button type="button" onClick={() => setEditShowPw(!editShowPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground focus:outline-none">
                  {editShowPw ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              {editPwErr
                ? <p className="text-xs text-red-600">{editPwErr}</p>
                : <p className="text-xs text-muted-foreground">Must be at least {PASSWORD_LENGTH} characters if changed</p>
              }
            </div>
            {/* Phone */}
            <div className="space-y-2">
              <Label>Phone <span className="text-muted-foreground font-normal text-xs">(optional)</span></Label>
              <Input {...phoneInputProps(
                editForm.phone,
                (v) => setEditForm({ ...editForm, phone: v }),
                setEditPhoneErr,
                !!editPhoneErr,
              )} />
              {editPhoneErr
                ? <p className="text-xs text-red-600">{editPhoneErr}</p>
                : <p className="text-xs text-muted-foreground">Format: +961 followed by {PHONE_DIGITS} digits</p>
              }
            </div>
            {/* Campus */}
            <div className="space-y-2">
              <Label>Campus <span className="text-muted-foreground font-normal text-xs ml-1">(optional)</span></Label>
              <select
                className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                value={editForm.campusId}
                onChange={(e) => setEditForm({ ...editForm, campusId: e.target.value })}
              >
                <option value="">— Leave unchanged —</option>
                {campuses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <p className="text-xs text-muted-foreground">
                Select a campus to assign or re-assign. Leave blank to keep the current value.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetEdit}>Cancel</Button>
            <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={handleEdit}
              disabled={updateAdmin.isPending || !editForm.fullName || !editForm.email}>
              {updateAdmin.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </SuperadminLayout>
  );
}
