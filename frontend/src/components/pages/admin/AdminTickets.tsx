"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { TicketReservation } from "@/lib/api/types";
import { AdminLayout } from "@/components/shared";
import { Search, CheckCircle2, CircleX, Eye } from "lucide-react";
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
  Input,
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
} from "@/components/ui";
import {
  useAdminTickets,
  useAdminTicketById,
  useConfirmTicket,
  useCancelTicket,
  useRestoreTicket,
} from "@/hooks/mutations/useAdmin";
import { ReservationStatus } from "@/lib/enums";

const statusBadge = (status: string) => {
  if (status === ReservationStatus.CONFIRMED) return "bg-green-50 text-green-700 border-green-200";
  if (status === ReservationStatus.CANCELLED) return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

const ticketStatusBadge = (status: string) => {
  if (status === "USED") return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === "CANCELLED") return "bg-red-50 text-red-700 border-red-200";
  return "bg-green-50 text-green-700 border-green-200";
};

export function AdminTickets() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [viewTicketId, setViewTicketId] = useState<number | null>(null);

  const { data, isLoading } = useAdminTickets();
  const confirmTicket = useConfirmTicket();
  const cancelTicket = useCancelTicket();
  const restoreTicket = useRestoreTicket();
  const { data: detailData, isLoading: loadingDetail } = useAdminTicketById(viewTicketId ?? 0);

  const reservations = (data?.reservations ?? []).filter((r: TicketReservation) => {
    const matchesSearch = search === "" || (r.user?.fullName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all-statuses" || r.reservationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const detail = detailData?.ticket;

  return (
    <AdminLayout activeSidebarItem="Tickets">
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-semibold text-primary">Ticket Reservations</h3>

        <Card className="shadow-sm">
          <div className="p-4 border-b border-border flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <Input placeholder="Search student name..." className="pl-9"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All Statuses</SelectItem>
                <SelectItem value={ReservationStatus.CONFIRMED}>Confirmed</SelectItem>
                <SelectItem value={ReservationStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={ReservationStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="px-6">Student Name</TableHead>
                <TableHead>Ceremony</TableHead>
                <TableHead>Ceremony Date</TableHead>
                <TableHead># Tickets</TableHead>
                <TableHead>Price/Ticket</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reserved Date</TableHead>
                <TableHead className="px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Loading tickets...
                  </TableCell>
                </TableRow>
              ) : reservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No ticket reservations found.
                  </TableCell>
                </TableRow>
              ) : (
                reservations.map((row: TicketReservation, i: number) => (
                  <TableRow key={row.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                    <TableCell className="px-6 font-medium text-primary">
                      {row.user?.fullName ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.ceremony?.title ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {row.ceremony?.ceremonyDate ? new Date(row.ceremony.ceremonyDate).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="font-medium text-center w-24">{row.numberOfTickets}</TableCell>
                    <TableCell className="text-muted-foreground">${row.pricePerTicket}</TableCell>
                    <TableCell className="font-medium">${row.totalPrice}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge(row.reservationStatus)}>
                        {row.reservationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(row.reservedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      {row.reservationStatus === ReservationStatus.PENDING && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                            title="Confirm this reservation"
                            onClick={() => confirmTicket.mutate(row.id, {
                              onSuccess: () => toast.success("Reservation confirmed."),
                              onError: (err: Error) => toast.error(err.message || "Failed to confirm reservation."),
                            })}
                            disabled={confirmTicket.isPending}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Confirm
                          </Button>
                          <Button
                            type="button"
                            size="sm" variant="destructive" className="h-7 text-xs"
                            title="Cancel this reservation"
                            onClick={() => cancelTicket.mutate(row.id, {
                              onSuccess: () => toast.success("Reservation cancelled."),
                              onError: (err: Error) => toast.error(err.message || "Failed to cancel reservation."),
                            })}
                            disabled={cancelTicket.isPending}
                          >
                            <CircleX className="w-3 h-3 mr-1" /> Cancel
                          </Button>
                        </div>
                      )}
                      {row.reservationStatus === ReservationStatus.CONFIRMED && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            size="sm" variant="outline" className="h-7 text-xs"
                            title="View ticket details and codes"
                            onClick={() => setViewTicketId(row.id)}
                          >
                            <Eye className="w-3 h-3 mr-1" /> View Details
                          </Button>
                          <Button
                            type="button"
                            size="sm" variant="destructive" className="h-7 text-xs"
                            title="Cancel this reservation"
                            onClick={() => cancelTicket.mutate(row.id, {
                              onSuccess: () => toast.success("Reservation cancelled."),
                              onError: (err: Error) => toast.error(err.message || "Failed to cancel reservation."),
                            })}
                            disabled={cancelTicket.isPending}
                          >
                            <CircleX className="w-3 h-3 mr-1" /> Cancel
                          </Button>
                        </div>
                      )}
                      {row.reservationStatus === ReservationStatus.CANCELLED && (
                        <Button
                          type="button"
                          size="sm"
                          className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                          title="Restore this reservation to pending"
                          onClick={() => restoreTicket.mutate(row.id, {
                            onSuccess: () => toast.success("Reservation restored to pending."),
                            onError: (err: Error) => toast.error(err.message || "Failed to restore reservation."),
                          })}
                          disabled={restoreTicket.isPending}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Restore
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* View Reservation Details dialog */}
      <Dialog open={viewTicketId !== null} onOpenChange={(open) => { if (!open) setViewTicketId(null); }}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Reservation Details</DialogTitle>
          </DialogHeader>

          {loadingDetail ? (
            <p className="text-center text-muted-foreground py-6">Loading...</p>
          ) : detail ? (
            <div className="space-y-4 py-1">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm rounded-md border bg-muted/30 p-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Student</p>
                  <p className="font-medium">{detail.user?.fullName ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <p className="font-medium text-xs break-all">{detail.user?.email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Ceremony</p>
                  <p className="font-medium">{detail.ceremony?.title ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Ceremony Date</p>
                  <p className="font-medium">
                    {detail.ceremony?.ceremonyDate
                      ? new Date(detail.ceremony.ceremonyDate).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Tickets Reserved</p>
                  <p className="font-medium">{detail.numberOfTickets}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Total Paid</p>
                  <p className="font-medium text-green-700">${detail.totalPrice}</p>
                </div>
              </div>

              {/* Ticket list */}
              {detail.tickets && detail.tickets.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Tickets ({detail.tickets.length})
                  </p>
                  <div className="rounded-md border divide-y max-h-52 overflow-y-auto">
                    {detail.tickets.map((t, idx) => (
                      <div key={t.id} className="flex items-start justify-between px-3 py-2.5 text-xs">
                        <div className="space-y-0.5">
                          <p className="text-muted-foreground font-medium">Ticket {idx + 1}</p>
                          <p className="font-mono font-semibold text-primary tracking-wide">{t.ticketCode}</p>
                          {t.guestName && (
                            <p className="text-muted-foreground">Guest: {t.guestName}</p>
                          )}
                          {t.seatNumber && (
                            <p className="text-muted-foreground">Seat: {t.seatNumber}</p>
                          )}
                        </div>
                        <Badge variant="outline" className={ticketStatusBadge(t.ticketStatus)}>
                          {t.ticketStatus}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setViewTicketId(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
