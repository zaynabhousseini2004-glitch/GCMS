"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/shared";
import { Plus, MapPin, UserCheck, UserX } from "lucide-react";
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
} from "@/components/ui";
import {
  useAdminCeremonies,
  useAdminSeats,
  useCreateSeats,
  useAssignSeat,
  useRemoveSeatAssignment,
  useAdminStudents,
} from "@/hooks/mutations/useAdmin";

const seatStatusBadge = (status: string) => {
  if (status === "RESERVED" || status === "ASSIGNED")
    return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === "OCCUPIED")
    return "bg-green-50 text-green-700 border-green-200";
  return "bg-muted text-foreground border-border";
};

export function AdminSeating() {
  const [generateOpen, setGenerateOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedCeremonyId, setSelectedCeremonyId] = useState<number | null>(
    null,
  );
  const [form, setForm] = useState({ count: "", section: "" });
  const [assignTarget, setAssignTarget] = useState<{
    seatId: number;
    seatNumber: string;
  } | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [studentSearch, setStudentSearch] = useState("");
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("__all__");
  const [selectedStatus, setSelectedStatus] = useState<string>("__all__");

  const { data: cerData } = useAdminCeremonies();
  const { data: seatData, isLoading } = useAdminSeats(selectedCeremonyId ?? 0);
  const { data: studentsData } = useAdminStudents();
  const createSeats = useCreateSeats();
  const assignSeat = useAssignSeat();
  const removeSeatAssignment = useRemoveSeatAssignment();

  const today = new Date(new Date().toDateString());
  const ceremonies = (cerData?.ceremonies ?? []).filter(
    (c) => c.status === "UPCOMING" && new Date(c.ceremonyDate) >= today,
  );
  const allSeats = seatData?.seats ?? [];
  const ticketReservations = seatData?.ticketReservations ?? [];
  const allStudents = studentsData?.students ?? [];

  // Natural sort: split seatNumber into text/numeric chunks and compare
  const naturalSort = (a: string, b: string) => {
    const re = /(\d+|\D+)/g;
    const aParts = a.match(re) ?? [a];
    const bParts = b.match(re) ?? [b];
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const ap = aParts[i] ?? "";
      const bp = bParts[i] ?? "";
      const an = Number(ap),
        bn = Number(bp);
      if (!isNaN(an) && !isNaN(bn)) {
        if (an !== bn) return an - bn;
      } else {
        const cmp = ap.localeCompare(bp);
        if (cmp !== 0) return cmp;
      }
    }
    return 0;
  };

  // Unique sections from all seats
  const sections = Array.from(
    new Set(allSeats.map((s) => s.sectionName ?? "").filter(Boolean)),
  ).sort();

  // Filter by section + status then natural-sort by seatNumber
  const seats = allSeats
    .filter(
      (s) =>
        (selectedSection === "__all__" || s.sectionName === selectedSection) &&
        (selectedStatus === "__all__" || s.seatStatus === selectedStatus),
    )
    .sort((a, b) => naturalSort(a.seatNumber, b.seatNumber));

  // Count how many seats each student already has in this ceremony (from all seats, not filtered)
  const studentSeatCounts = allSeats.reduce<Record<number, number>>(
    (acc, seat) => {
      const assignment = seat.assignments?.[0];
      if (assignment?.user) {
        acc[assignment.user.id] = (acc[assignment.user.id] ?? 0) + 1;
      }
      return acc;
    },
    {},
  );

  // Map userId → numberOfTickets purchased
  const studentTicketCounts = ticketReservations.reduce<Record<number, number>>(
    (acc, tr) => {
      acc[tr.userId] = tr.numberOfTickets;
      return acc;
    },
    {},
  );

  // Remaining = tickets purchased - seats already assigned
  const getRemaining = (userId: number) =>
    (studentTicketCounts[userId] ?? 0) - (studentSeatCounts[userId] ?? 0);

  // Only show students who have tickets AND remaining capacity
  const eligibleStudents = allStudents.filter(
    (s: { id: number }) => getRemaining(s.id) > 0,
  );

  const filteredStudents = studentSearch
    ? eligibleStudents.filter(
        (s: { id: number; fullName: string; email: string }) =>
          s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.email.toLowerCase().includes(studentSearch.toLowerCase()),
      )
    : eligibleStudents;

  const selectedStudentSeatCount = selectedStudentId
    ? (studentSeatCounts[Number(selectedStudentId)] ?? 0)
    : 0;

  const selectedStudentRemaining = selectedStudentId
    ? getRemaining(Number(selectedStudentId))
    : 0;

  const handleGenerate = () => {
    if (!selectedCeremonyId || !form.count) return;
    const count = Number(form.count);
    const newSeats = Array.from({ length: count }, (_, i) => ({
      seatNumber: `${form.section ? form.section + "-" : ""}${i + 1}`,
      sectionName: form.section || undefined,
    }));
    createSeats.mutate(
      { ceremonyId: selectedCeremonyId, body: { seats: newSeats } },
      {
        onSuccess: () => {
          setGenerateOpen(false);
          setForm({ count: "", section: "" });
        },
      },
    );
  };

  const openAssignDialog = (seatId: number, seatNumber: string) => {
    setAssignTarget({ seatId, seatNumber });
    setSelectedStudentId("");
    setStudentSearch("");
    setIsGuestMode(false);
    setGuestName("");
    setAssignOpen(true);
  };

  const handleAssign = () => {
    if (!selectedCeremonyId || !assignTarget) return;
    if (isGuestMode) {
      if (!guestName.trim()) return;
      assignSeat.mutate(
        {
          ceremonyId: selectedCeremonyId,
          body: { seatId: assignTarget.seatId, guestName: guestName.trim() },
        },
        {
          onSuccess: () => {
            setAssignOpen(false);
            setAssignTarget(null);
          },
        },
      );
    } else {
      if (!selectedStudentId) return;
      assignSeat.mutate(
        {
          ceremonyId: selectedCeremonyId,
          body: {
            seatId: assignTarget.seatId,
            userId: Number(selectedStudentId),
          },
        },
        {
          onSuccess: () => {
            setAssignOpen(false);
            setAssignTarget(null);
          },
        },
      );
    }
  };

  const handleUnassign = (ceremonyId: number, assignmentId: number) => {
    removeSeatAssignment.mutate({ ceremonyId, id: assignmentId });
  };

  return (
    <AdminLayout activeSidebarItem="Seating">
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-primary mb-4">
              Seating Management
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-64">
                <Select
                  value={selectedCeremonyId ? String(selectedCeremonyId) : ""}
                  onValueChange={(v) => {
                    setSelectedCeremonyId(Number(v));
                    setSelectedSection("__all__");
                    setSelectedStatus("__all__");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ceremony" />
                  </SelectTrigger>
                  <SelectContent>
                    {ceremonies.map((c: { id: number; title: string }) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {sections.length > 0 && (
                <div className="w-48">
                  <Select
                    value={selectedSection}
                    onValueChange={setSelectedSection}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Sections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">All Sections</SelectItem>
                      {sections.map((sec) => (
                        <SelectItem key={sec} value={sec}>
                          {sec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="w-40">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Status</SelectItem>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="RESERVED">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!selectedCeremonyId}
            onClick={() => setGenerateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Seats
          </Button>
        </div>

        {!selectedCeremonyId ? (
          <p className="text-muted-foreground text-center py-12">
            Select a ceremony to manage seating.
          </p>
        ) : (
          <Card className="shadow-sm">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6">Seat #</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : seats.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No seats generated yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  seats.map((s, i) => {
                    const assignment = s.assignments?.[0] ?? null;
                    return (
                      <TableRow
                        key={s.id}
                        className={
                          i % 2 === 0 ? "bg-background" : "bg-muted/50"
                        }
                      >
                        <TableCell className="px-6 font-medium">
                          <span className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                            {s.seatNumber}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {s.sectionName ?? "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={seatStatusBadge(s.seatStatus)}
                          >
                            {s.seatStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {assignment ? (
                            <span className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {assignment.guestName ??
                                  assignment.user?.fullName ??
                                  "—"}
                              </span>
                              {assignment.guestName ? (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                                >
                                  Special Guest
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  {studentSeatCounts[
                                    assignment.user?.id ?? 0
                                  ] ?? 1}{" "}
                                  seat
                                  {(studentSeatCounts[
                                    assignment.user?.id ?? 0
                                  ] ?? 1) > 1
                                    ? "s"
                                    : ""}
                                </Badge>
                              )}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          {assignment ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                              onClick={() =>
                                handleUnassign(
                                  selectedCeremonyId!,
                                  assignment.id,
                                )
                              }
                              disabled={removeSeatAssignment.isPending}
                            >
                              <UserX className="w-3.5 h-3.5 mr-1" />
                              Unassign
                            </Button>
                          ) : s.seatStatus === "AVAILABLE" ? (
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              onClick={() =>
                                openAssignDialog(s.id, s.seatNumber)
                              }
                            >
                              <UserCheck className="w-3.5 h-3.5 mr-1" />
                              Assign
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* Generate Seats Dialog */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Generate Seats</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Number of Seats *</Label>
              <Input
                type="number"
                placeholder="e.g. 100"
                value={form.count}
                onChange={(e) => setForm({ ...form, count: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Section Name</Label>
              <Input
                placeholder="e.g. Section A"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleGenerate}
              disabled={createSeats.isPending || !form.count}
            >
              {createSeats.isPending ? "Generating..." : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Assign Seat {assignTarget?.seatNumber}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Mode toggle */}
            <div className="flex p-1 bg-muted rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setIsGuestMode(false);
                  setGuestName("");
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isGuestMode ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Registered Student
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsGuestMode(true);
                  setSelectedStudentId("");
                  setStudentSearch("");
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isGuestMode ? "bg-amber-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                Special Guest
              </button>
            </div>

            {isGuestMode ? (
              <div className="space-y-2">
                <Label>Guest Name *</Label>
                <Input
                  placeholder="Enter guest full name..."
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Select Student *</Label>
                  <Select
                    value={selectedStudentId}
                    onValueChange={setSelectedStudentId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStudents.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          No eligible students found
                        </div>
                      ) : (
                        filteredStudents.map(
                          (st: {
                            id: number;
                            fullName: string;
                            email: string;
                          }) => (
                            <SelectItem key={st.id} value={String(st.id)}>
                              {st.fullName}
                              {` (${getRemaining(st.id)} seat${getRemaining(st.id) !== 1 ? "s" : ""} remaining)`}
                            </SelectItem>
                          ),
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {selectedStudentId && (
                  <div className="rounded-md bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800">
                    <span className="font-semibold">
                      {selectedStudentRemaining}
                    </span>{" "}
                    seat{selectedStudentRemaining !== 1 ? "s" : ""} remaining (
                    {studentTicketCounts[Number(selectedStudentId)] ?? 0}{" "}
                    purchased, {selectedStudentSeatCount} already assigned)
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleAssign}
              disabled={
                assignSeat.isPending ||
                (isGuestMode ? !guestName.trim() : !selectedStudentId)
              }
            >
              {assignSeat.isPending ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
