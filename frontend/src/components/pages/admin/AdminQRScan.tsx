"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/shared";
import { Button, Input, Badge, Card, CardContent } from "@/components/ui";
import {
  Camera,
  CheckCircle2,
  ScanLine,
  Keyboard,
  XCircle,
  AlertCircle,
  CalendarDays,
  MapPin,
  User,
  Shirt,
  Hash,
  Armchair,
} from "lucide-react";
import { useScanQrCode } from "@/hooks/mutations/useAdmin";
import { ScanStatus } from "@/lib/enums";

export default function AdminQRScan() {
  const [qrCode, setQrCode] = useState("");
  const scanMutation = useScanQrCode();

  const result = scanMutation.data;
  const hasResult = scanMutation.isSuccess || scanMutation.isError;

  const statusStyle = {
    [ScanStatus.VALID]: {
      bg: "bg-green-50 border-green-200",
      icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      iconBg: "bg-green-100",
      header: "ACCESS GRANTED",
      sub: "Ticket verified successfully",
      headerText: "text-green-700",
      badge: "bg-green-100 text-green-800 border-green-200",
      badgeLabel: "VALID TICKET",
    },
    [ScanStatus.ALREADY_USED]: {
      bg: "bg-amber-50 border-amber-200",
      icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
      iconBg: "bg-amber-100",
      header: "ALREADY USED",
      sub: "This ticket has already been scanned",
      headerText: "text-amber-700",
      badge: "bg-amber-100 text-amber-800 border-amber-200",
      badgeLabel: "USED TICKET",
    },
    [ScanStatus.INVALID]: {
      bg: "bg-red-50 border-red-200",
      icon: <XCircle className="h-5 w-5 text-red-600" />,
      iconBg: "bg-red-100",
      header: "ACCESS DENIED",
      sub: "Invalid or unrecognized ticket",
      headerText: "text-red-700",
      badge: "bg-red-100 text-red-800 border-red-200",
      badgeLabel: "INVALID TICKET",
    },
  } as const;

  const scanStatus = (result?.status ?? ScanStatus.INVALID) as ScanStatus;
  const style = statusStyle[scanStatus] ?? statusStyle[ScanStatus.INVALID];
  const d = result?.data;

  const handleVerify = () => {
    const code = qrCode.trim();
    if (code) scanMutation.mutate({ qrCode: code });
  };

  return (
    <AdminLayout activeSidebarItem="QR Scan">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-primary">
            QR Code Scanner
          </h2>
          <p className="text-muted-foreground text-sm">
            Scan student or guest tickets at the entrance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column — Scanner & Manual Entry */}
          <Card className="lg:col-span-2 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {/* Camera Area */}
              <div className="relative aspect-[4/3] bg-foreground/5 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-background/80 backdrop-blur flex items-center justify-center shadow-lg">
                    <Camera className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    Camera preview
                  </p>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent rounded-br-lg" />
                </div>
                <div className="absolute left-[15%] right-[15%] h-0.5 bg-accent/80 shadow-[0_0_12px_hsl(var(--accent))] animate-[scan_2s_ease-in-out_infinite]" />
              </div>

              <div className="flex items-center gap-3 px-5 py-3">
                <div className="h-px bg-border flex-grow" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  or enter manually
                </span>
                <div className="h-px bg-border flex-grow" />
              </div>

              <div className="px-5 pb-5">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      className="pl-9 bg-muted/50"
                      placeholder="Enter ticket QR code (e.g. GCMS:TKT-…)"
                      value={qrCode}
                      onChange={(e) => setQrCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    />
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-5"
                    onClick={handleVerify}
                    disabled={scanMutation.isPending || !qrCode.trim()}
                  >
                    <ScanLine className="h-4 w-4" />
                    <span className="hidden sm:inline">Verify</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column — Scan Result */}
          <Card className="lg:col-span-3 shadow-sm overflow-hidden self-start">
            <CardContent className="p-0">
              {!hasResult ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <ScanLine className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-sm">
                    Scan or enter a ticket code to see results
                  </p>
                </div>
              ) : (
                <>
                  {/* Status Header */}
                  <div className={`${style.bg} border-b px-6 py-5`}>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${style.iconBg} flex items-center justify-center`}
                        >
                          {style.icon}
                        </div>
                        <div>
                          <h3
                            className={`text-lg font-bold ${style.headerText}`}
                          >
                            {style.header}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {style.sub}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`${style.badge} px-3 py-1 text-xs font-bold border hover:opacity-90`}
                      >
                        {style.badgeLabel}
                      </Badge>
                    </div>
                  </div>

                  {d ? (
                    <div className="p-6 space-y-4">
                      {/* Ceremony info */}
                      <div className="rounded-lg bg-muted/40 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-primary">
                            {d.ceremony.title}
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              d.ceremony.isUpcoming
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {d.ceremony.isUpcoming
                              ? "Upcoming"
                              : d.ceremony.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-3.5 h-3.5" />
                            {new Date(
                              d.ceremony.ceremonyDate,
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                          {d.ceremony.venue && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {d.ceremony.venue}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Ticket Details */}
                      <div className="space-y-0 divide-y divide-border">
                        <div className="flex justify-between items-center py-3">
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" /> Name
                          </span>
                          <span className="text-sm font-semibold">
                            {d.guestName ?? d.student?.fullName ?? "—"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Hash className="w-4 h-4" /> Ticket Code
                          </span>
                          <span className="text-sm font-mono font-semibold">
                            {d.ticketCode}
                          </span>
                        </div>
                        {d.seatNumber && (
                          <div className="flex justify-between items-center py-3">
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Armchair className="w-4 h-4" /> Seat
                            </span>
                            <span className="text-lg font-bold text-primary">
                              {d.seatNumber}
                            </span>
                          </div>
                        )}
                        {d.outfitRentals.length > 0 && (
                          <div className="flex justify-between items-center py-3">
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Shirt className="w-4 h-4" /> Outfit
                            </span>
                            <span className="text-sm font-semibold">
                              {d.outfitRentals
                                .map(
                                  (o) =>
                                    `${o.outfitType ?? "Outfit"}${o.size ? ` (${o.size})` : ""} — ${o.status}`,
                                )
                                .join(", ")}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center py-3">
                          <span className="text-sm text-muted-foreground">
                            Reservation Status
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              d.reservation.status === "CONFIRMED"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : d.reservation.status === "CANCELLED"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                            }
                          >
                            {d.reservation.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-muted-foreground text-sm">
                      No ticket information available.
                    </div>
                  )}

                  <div className="px-6 pb-6">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                      onClick={() => {
                        setQrCode("");
                        scanMutation.reset();
                      }}
                    >
                      <ScanLine className="h-4 w-4 mr-2" />
                      Scan Next Ticket
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </AdminLayout>
  );
}
