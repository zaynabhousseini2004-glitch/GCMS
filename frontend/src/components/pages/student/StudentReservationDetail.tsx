"use client";

import { useParams, useRouter } from "next/navigation";
import { StudentLayout } from "@/components/shared";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useMyTicketById, useMyReservations } from "@/hooks/mutations/useStudent";
import { useCampusId } from "@/hooks/useCampusId";
import { studentRoutes } from "@/lib/routes";
import { useAuth } from "@/providers/AuthProvider";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Ticket,
  Shirt,
  Armchair,
  Download,
  DollarSign,
  Clock,
} from "lucide-react";

const statusBadge = (s: string) => {
  if (["CONFIRMED", "APPROVED", "ACTIVE", "USED"].includes(s))
    return "bg-green-50 text-green-700 border-green-200";
  if (["CANCELLED", "REJECTED"].includes(s))
    return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

function downloadQr(ticketId: number, ticketCode: string) {
  const svg = document.getElementById(`qr-dl-${ticketId}`);
  if (!svg) return;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const svgData = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);
    const link = document.createElement("a");
    link.download = `ticket-${ticketCode}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };
  img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
}

export function StudentReservationDetail() {
  const params = useParams<{ id: string }>();
  const campusId = useCampusId();
  const router = useRouter();
  const { user } = useAuth();
  const reservationId = Number(params.id);

  const { data: ticketData, isLoading: ticketLoading } = useMyTicketById(reservationId);
  const { data: allData } = useMyReservations();

  const reservation = ticketData?.reservation;
  const ceremonyId = reservation?.ceremony?.id;

  const outfitRentals = (allData?.outfitRentals ?? []).filter(
    (r) => r.ceremony?.id === ceremonyId,
  );
  const seatAssignments = (allData?.seatAssignments ?? []).filter(
    (s) => s.ceremony?.id === ceremonyId,
  );

  if (ticketLoading) {
    return (
      <StudentLayout activeSidebarItem="Reservations">
        <p className="text-muted-foreground text-center py-20">Loading reservation…</p>
      </StudentLayout>
    );
  }

  if (!reservation) {
    return (
      <StudentLayout activeSidebarItem="Reservations">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-muted-foreground">Reservation not found.</p>
          <Button variant="outline" onClick={() => router.push(studentRoutes(campusId).reservations)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Reservations
          </Button>
        </div>
      </StudentLayout>
    );
  }

  const ceremony = reservation.ceremony;
  const tickets = reservation.tickets ?? [];
  const studentName = user?.fullName ?? user?.email ?? "Student";

  return (
    <StudentLayout activeSidebarItem="Reservations">
      <div className="flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
            onClick={() => router.push(studentRoutes(campusId).reservations)}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <h3 className="text-2xl font-semibold text-primary">Reservation #{reservation.id}</h3>
          <Badge variant="outline" className={statusBadge(reservation.reservationStatus)}>
            {reservation.reservationStatus}
          </Badge>
        </div>

        {/* Top info row — 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Ceremony Details */}
          <Card className="shadow-sm">
            <CardHeader className="px-5 py-3 border-b">
              <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Ceremony Details
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4 flex flex-col gap-3">
              <p className="font-bold text-foreground text-base leading-snug">{ceremony?.title ?? "—"}</p>
              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                {ceremony?.ceremonyDate && (
                  <span className="flex items-center gap-2">
                    <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
                    {new Date(ceremony.ceremonyDate).toLocaleDateString("en-US", {
                      weekday: "short", year: "numeric", month: "short", day: "numeric",
                    })}
                  </span>
                )}
                {ceremony?.venue && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {ceremony.venue}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-xs">
                <div>
                  <p className="text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Tickets</p>
                  <p className="font-bold text-primary flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5" /> {reservation.numberOfTickets}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Total</p>
                  <p className="font-bold text-accent flex items-center gap-0.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    {Number(reservation.totalPrice) === 0 ? "Free" : reservation.totalPrice}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Reserved</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {new Date(reservation.reservedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outfit Rental */}
          <Card className="shadow-sm">
            <CardHeader className="px-5 py-3 border-b">
              <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
                <Shirt className="w-4 h-4" /> Outfit Rental
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4">
              {outfitRentals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No outfit rental.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {outfitRentals.map((r) => (
                    <div key={r.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {/* @ts-expect-error outfit fields not typed */}
                        {r.outfit?.outfitType ?? "Outfit"}{r.outfit?.size ? ` — ${r.outfit.size}` : ""}
                      </span>
                      <Badge variant="outline" className={statusBadge(r.rentalStatus)}>
                        {r.rentalStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seat Assignment */}
          <Card className="shadow-sm">
            <CardHeader className="px-5 py-3 border-b">
              <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
                <Armchair className="w-4 h-4" /> Seat Assignment
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-4">
              {seatAssignments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No seat assigned yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {seatAssignments.map((s) => (
                    <div key={s.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary">{s.seat?.seatNumber ?? "—"}</span>
                        {s.seat?.sectionName && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                            {s.seat.sectionName}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {s.assignedAt ? new Date(s.assignedAt).toLocaleDateString() : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tickets grid — 5 per row */}
        <div>
          <h4 className="text-lg font-semibold text-primary mb-4">
            Your Tickets
            <span className="ml-2 text-sm font-normal text-muted-foreground">({tickets.length})</span>
          </h4>

          {tickets.length === 0 ? (
            <Card className="shadow-sm">
              <CardContent className="py-12 text-center text-muted-foreground text-sm">
                No individual tickets found.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {tickets.map((ticket, idx) => (
                <Card key={ticket.id} className="shadow-sm overflow-hidden flex flex-col">
                  {/* QR */}
                  <div className="flex items-center justify-center p-4 bg-muted/30 border-b border-border">
                    {ticket.qrCode ? (
                      <div className="bg-white p-2 rounded-lg shadow-sm border border-border">
                        <QRCodeSVG value={ticket.qrCode} size={150} level="M" fgColor="#002147" />
                      </div>
                    ) : (
                      <div className="w-[150px] h-[150px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground/30 text-xs">
                        No QR
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <CardContent className="px-4 py-3 flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary uppercase tracking-wide">
                        Ticket {idx + 1}
                      </span>
                      <Badge variant="outline" className={`${statusBadge(ticket.ticketStatus)} text-[10px] px-1.5 py-0`}>
                        {ticket.ticketStatus}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-foreground truncate">{studentName}</p>
                    <p className="text-[11px] font-mono text-muted-foreground truncate">{ticket.ticketCode}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-7 text-xs gap-1.5 mt-auto"
                      onClick={() => downloadQr(ticket.id, ticket.ticketCode)}
                    >
                      <Download className="w-3 h-3" /> Save QR
                    </Button>
                  </CardContent>

                  {/* Hidden high-res QR for download */}
                  {ticket.qrCode && (
                    <div className="hidden">
                      <QRCodeSVG
                        id={`qr-dl-${ticket.id}`}
                        value={ticket.qrCode}
                        size={400}
                        level="M"
                        fgColor="#002147"
                      />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

      </div>
    </StudentLayout>
  );
}
