"use client";

import { useState } from "react";
import { toast } from "sonner";
import { StudentLayout } from "@/components/shared";
import {
  Badge, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui";
import { Ticket, Plus, X } from "lucide-react";
import {
  useMyTickets,
  useReserveTickets,
  useCancelMyTicket,
  useStudentCeremonies,
} from "@/hooks/mutations/useStudent";
import { ReservationStatus } from "@/lib/enums";

const statusBadge = (s: string) => {
  if (s === ReservationStatus.CONFIRMED) return "bg-green-50 text-green-700 border-green-200";
  if (s === ReservationStatus.CANCELLED) return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export function StudentTickets() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ ceremonyId: "", numberOfTickets: "1" });

  const { data: ticketData, isLoading } = useMyTickets();
  const { data: cerData } = useStudentCeremonies();
  const reserveTickets = useReserveTickets();
  const cancelTicket = useCancelMyTicket();

  const tickets = ticketData?.reservations ?? [];
  const today = new Date(new Date().toDateString());
  // Only show UPCOMING ceremonies that have a ticket price set and haven't passed yet
  const ceremonies = (cerData?.ceremonies ?? []).filter(
    (c) => c.status === "UPCOMING" && new Date(c.ceremonyDate) >= today && c.ticketPrice != null,
  );

  const selectedCeremony = ceremonies.find((c) => String(c.id) === form.ceremonyId);
  const ceremonyPrice = selectedCeremony?.ticketPrice != null ? Number(selectedCeremony.ticketPrice) : null;
  const totalPrice = ceremonyPrice !== null ? ceremonyPrice * Number(form.numberOfTickets) : null;

  const handleReserve = () => {
    if (!form.ceremonyId) return;
    reserveTickets.mutate(
      { ceremonyId: Number(form.ceremonyId), numberOfTickets: Number(form.numberOfTickets) },
      {
        onSuccess: () => {
          setModalOpen(false);
          setForm({ ceremonyId: "", numberOfTickets: "1" });
          toast.success("Tickets reserved successfully!");
        },
        onError: (err: Error) => toast.error(err.message || "Failed to reserve tickets."),
      },
    );
  };

  return (
    <StudentLayout activeSidebarItem="Tickets">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-primary">My Tickets</h3>
          <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Reserve Tickets
          </Button>
        </div>

        <Card className="shadow-sm">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="px-6">Ceremony</TableHead>
                <TableHead># Tickets</TableHead>
                <TableHead>Price Each</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ceremony Date</TableHead>
                <TableHead>Reserved On</TableHead>
                <TableHead className="px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Ticket className="w-8 h-8 opacity-30" />
                      <p>No ticket reservations yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : tickets.map((t, i) => (
                <TableRow key={t.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                  <TableCell className="px-6 font-medium text-primary">{t.ceremony?.title ?? "—"}</TableCell>
                  <TableCell className="text-center">{t.numberOfTickets}</TableCell>
                  <TableCell className="text-muted-foreground">${t.pricePerTicket}</TableCell>
                  <TableCell className="font-medium">${t.totalPrice}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusBadge(t.reservationStatus)}>{t.reservationStatus}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {t.ceremony?.ceremonyDate ? new Date(t.ceremony.ceremonyDate).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">{new Date(t.reservedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="px-6 text-right">
                    {t.reservationStatus === ReservationStatus.PENDING && (
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => cancelTicket.mutate(t.id, {
                          onSuccess: () => toast.success("Reservation cancelled."),
                          onError: (err: Error) => toast.error(err.message || "Failed to cancel reservation."),
                        })}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Reserve Tickets</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {ceremonies.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                No upcoming ceremonies with ticket pricing available at this time.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Ceremony</Label>
                  <Select value={form.ceremonyId} onValueChange={(v) => setForm({ ...form, ceremonyId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select ceremony" /></SelectTrigger>
                    <SelectContent>
                      {ceremonies.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {form.ceremonyId && ceremonyPrice !== null && (
                  <div className="rounded-md border px-4 py-3 text-sm">
                    <div className="flex flex-col gap-1 text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Price per ticket</span>
                        <span className="font-medium text-foreground">${ceremonyPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number of tickets</span>
                        <span className="font-medium text-foreground">{form.numberOfTickets}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 mt-1">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-semibold text-primary">${totalPrice?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Number of Tickets</Label>
                  <Input type="number" min="1" max="10" value={form.numberOfTickets}
                    onChange={(e) => setForm({ ...form, numberOfTickets: e.target.value })} />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              type="button"
              className="bg-primary hover:bg-primary/85 text-primary-foreground"
              onClick={handleReserve}
              disabled={reserveTickets.isPending || !form.ceremonyId || ceremonies.length === 0}
            >
              {reserveTickets.isPending ? "Reserving..." : "Confirm Reservation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StudentLayout>
  );
}
