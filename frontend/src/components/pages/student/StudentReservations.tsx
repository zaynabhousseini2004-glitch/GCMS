"use client";

import { useRouter } from "next/navigation";
import { StudentLayout } from "@/components/shared";
import { Badge, Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { useMyReservations } from "@/hooks/mutations/useStudent";
import { useCampusId } from "@/hooks/useCampusId";
import { studentRoutes } from "@/lib/routes";
import { ChevronRight } from "lucide-react";

const statusBadge = (s: string) => {
  if (["CONFIRMED", "APPROVED", "ACTIVE"].includes(s)) return "bg-green-50 text-green-700 border-green-200";
  if (["CANCELLED", "REJECTED", "USED"].includes(s)) return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export function StudentReservations() {
  const router = useRouter();
  const campusId = useCampusId();
  const { data, isLoading } = useMyReservations();
  const ticketReservations = data?.ticketReservations ?? [];
  const outfitRentals = data?.outfitRentals ?? [];
  const seatAssignments = data?.seatAssignments ?? [];

  if (isLoading) {
    return (
      <StudentLayout activeSidebarItem="Reservations">
        <p className="text-muted-foreground text-center py-16">Loading...</p>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout activeSidebarItem="Reservations">
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-semibold text-primary">My Reservations</h3>

        {/* Ticket Reservations */}
        <Card className="shadow-sm">
          <CardHeader className="px-6 py-4 border-b border-border">
            <CardTitle className="text-base font-semibold text-primary">Ticket Reservations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6">#</TableHead>
                  <TableHead>Ceremony</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {ticketReservations.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-6 text-muted-foreground">No ticket reservations.</TableCell></TableRow>
                ) : ticketReservations.map((r, i) => (
                  <TableRow
                    key={r.id}
                    className={`cursor-pointer hover:bg-muted/70 transition-colors ${i % 2 === 0 ? "bg-background" : "bg-muted/50"}`}
                    onClick={() => router.push(studentRoutes(campusId).reservationDetail(r.id))}
                  >
                    <TableCell className="px-6 text-muted-foreground">#{r.id}</TableCell>
                    <TableCell className="font-medium">{r.ceremony?.title ?? "—"}</TableCell>
                    <TableCell>{r.numberOfTickets}</TableCell>
                    <TableCell>{Number(r.totalPrice) === 0 ? "Free" : `$${r.totalPrice}`}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge(r.reservationStatus)}>{r.reservationStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(r.reservedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="pr-4">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Outfit Rentals */}
        <Card className="shadow-sm">
          <CardHeader className="px-6 py-4 border-b border-border">
            <CardTitle className="text-base font-semibold text-primary">Outfit Rentals</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6">#</TableHead>
                  <TableHead>Outfit</TableHead>
                  <TableHead>Ceremony</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outfitRentals.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No outfit rentals.</TableCell></TableRow>
                ) : outfitRentals.map((r, i) => (
                  <TableRow key={r.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                    <TableCell className="px-6 text-muted-foreground">#{r.id}</TableCell>
                    <TableCell className="font-medium">{r.outfit?.name ?? "—"}{r.outfit?.size ? ` (${r.outfit.size})` : ""}</TableCell>
                    <TableCell>{r.ceremony?.title ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge(r.rentalStatus)}>{r.rentalStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{new Date(r.rentedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Seat Assignments */}
        <Card className="shadow-sm">
          <CardHeader className="px-6 py-4 border-b border-border">
            <CardTitle className="text-base font-semibold text-primary">Seat Assignments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-6">Seat #</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Ceremony</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Assigned On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seatAssignments.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No seat assignments yet.</TableCell></TableRow>
                ) : seatAssignments.map((s, i) => (
                  <TableRow key={s.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                    <TableCell className="px-6 font-bold text-primary">{s.seat?.seatNumber ?? "—"}</TableCell>
                    <TableCell>{s.seat?.sectionName ?? "—"}</TableCell>
                    <TableCell>{s.ceremony?.title ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{s.ceremony?.venue ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{s.assignedAt ? new Date(s.assignedAt).toLocaleDateString() : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </StudentLayout>
  );
}
