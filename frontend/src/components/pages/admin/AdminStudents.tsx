"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/shared";
import { Search, Eye, Filter } from "lucide-react";
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Avatar,
  AvatarFallback,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
} from "@/components/ui";
import { useAdminStudents, useAdminStudentById, useUpdateStudentEligibility } from "@/hooks/mutations/useAdmin";
import { EligibilityStatus } from "@/lib/enums";
import type { Student } from "@/lib/api/types";

const eligibilityBadge = (status: string) => {
  if (status === EligibilityStatus.ELIGIBLE) return "bg-green-50 text-green-700 border-green-200";
  if (status === EligibilityStatus.NOT_ELIGIBLE) return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export function AdminStudents() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [eligFilter, setEligFilter] = useState("all");

  const { data, isLoading } = useAdminStudents();
  const { data: detailData, isLoading: detailLoading } = useAdminStudentById(selectedStudentId ?? 0);
  const updateEligibility = useUpdateStudentEligibility();
  const detail = detailData?.student;

  const students = (data?.students ?? []).filter((s) => {
    const matchSearch =
      !search ||
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      eligFilter === "all" || s.eligibilityStatus === eligFilter;
    return matchSearch && matchFilter;
  });

  const openDrawer = (s: Student) => {
    setSelectedStudentId(s.id);
    setDrawerOpen(true);
  };

  const handleEligibilityChange = (id: number, value: string) => {
    updateEligibility.mutate({ id, body: { eligibilityStatus: value } });
  };

  return (
    <AdminLayout activeSidebarItem="Students">
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-semibold text-primary">Student Management</h3>

        <Card className="shadow-sm">
          <div className="p-4 border-b border-border flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Select value={eligFilter} onValueChange={setEligFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Eligibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={EligibilityStatus.ELIGIBLE}>Eligible</SelectItem>
                  <SelectItem value={EligibilityStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={EligibilityStatus.NOT_ELIGIBLE}>Not Eligible</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="px-6">Name</TableHead>
                <TableHead>University ID</TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead>Grad Year</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Eligibility</TableHead>
                <TableHead className="px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading students...
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((row, i) => (
                  <TableRow key={row.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                    <TableCell className="px-6 font-medium">
                      <div className="flex flex-col">
                        <span>{row.fullName}</span>
                        <span className="text-xs text-muted-foreground font-normal">{row.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.universityId ?? "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{row.faculty ?? "—"}</span>
                        <span className="text-xs text-muted-foreground">{row.department ?? ""}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.graduationYear ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{row.graduationSemester ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={eligibilityBadge(row.eligibilityStatus)}>
                        {row.eligibilityStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => openDrawer(row)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select
                          defaultValue={row.eligibilityStatus}
                          onValueChange={(v) => handleEligibilityChange(row.id, v)}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={EligibilityStatus.ELIGIBLE}>Eligible</SelectItem>
                            <SelectItem value={EligibilityStatus.PENDING}>Pending</SelectItem>
                            <SelectItem value={EligibilityStatus.NOT_ELIGIBLE}>Not Eligible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="p-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Showing {students.length} of {data?.students?.length ?? 0} students
            </span>
          </div>
        </Card>
      </div>

      <Sheet open={drawerOpen} onOpenChange={(o) => { setDrawerOpen(o); if (!o) setSelectedStudentId(null); }}>
        <SheetContent className="w-[500px] sm:max-w-lg overflow-y-auto">
          {detailLoading ? (
            <>
              <SheetHeader><SheetTitle>Loading…</SheetTitle></SheetHeader>
              <p className="text-muted-foreground text-center py-12">Loading student details…</p>
            </>
          ) : detail ? (
            <>
              <SheetHeader className="pb-6 border-b border-border">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    {detail.avatarUrl ? (
                      <div className="relative w-16 h-16 rounded-full overflow-hidden">
                        <Image src={detail.avatarUrl} alt={detail.fullName} fill className="object-cover" />
                      </div>
                    ) : (
                      <AvatarFallback>
                        {detail.fullName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <SheetTitle className="text-xl text-primary">
                      {detail.fullName}
                    </SheetTitle>
                    <SheetDescription className="text-sm text-muted-foreground mb-2">
                      {detail.email}
                    </SheetDescription>
                    <Badge className={eligibilityBadge(detail.eligibilityStatus)}>
                      {detail.eligibilityStatus}
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              <div className="py-6 flex flex-col gap-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                    Personal &amp; Academic Info
                  </h4>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    {[
                      { label: "University ID", value: detail.universityId ?? "—" },
                      { label: "Phone", value: detail.phone ?? "—" },
                      { label: "Faculty", value: detail.faculty ?? "—" },
                      { label: "Department", value: detail.department ?? "—" },
                      { label: "Graduation Year", value: detail.graduationYear ?? "—" },
                      { label: "Semester", value: detail.graduationSemester ?? "—" },
                      { label: "Status", value: detail.status },
                      { label: "Joined", value: new Date(detail.createdAt).toLocaleDateString() },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <span className="text-muted-foreground block mb-1">{label}</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ceremony Registrations */}
                {detail.registrations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                      Ceremony Registrations
                    </h4>
                    <div className="flex flex-col gap-2">
                      {detail.registrations.map((r) => (
                        <div key={r.id} className="flex items-center justify-between bg-muted/40 rounded-md px-3 py-2 text-sm">
                          <span className="font-medium">{r.ceremony.title}</span>
                          <div className="flex flex-col items-end gap-0.5">
                            <Badge variant="outline" className="text-xs">{r.registrationStatus}</Badge>
                            <span className="text-xs text-muted-foreground">{new Date(r.ceremony.ceremonyDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ticket Reservations */}
                {detail.ticketReservations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                      Ticket Reservations
                    </h4>
                    <div className="flex flex-col gap-2">
                      {detail.ticketReservations.map((t) => (
                        <div key={t.id} className="flex items-center justify-between bg-muted/40 rounded-md px-3 py-2 text-sm">
                          <span>{t.numberOfTickets} ticket{t.numberOfTickets !== 1 ? "s" : ""}</span>
                          <div className="flex flex-col items-end gap-0.5">
                            <Badge variant="outline" className="text-xs">{t.reservationStatus}</Badge>
                            <span className="text-xs text-muted-foreground">{new Date(t.reservedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outfit Rentals */}
                {detail.outfitRentals.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
                      Outfit Rentals
                    </h4>
                    <div className="flex flex-col gap-2">
                      {detail.outfitRentals.map((o) => (
                        <div key={o.id} className="flex items-center justify-between bg-muted/40 rounded-md px-3 py-2 text-sm">
                          <span>Size: {o.selectedSize}</span>
                          <div className="flex flex-col items-end gap-0.5">
                            <Badge variant="outline" className="text-xs">{o.rentalStatus}</Badge>
                            <span className="text-xs text-muted-foreground">{new Date(o.rentedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
