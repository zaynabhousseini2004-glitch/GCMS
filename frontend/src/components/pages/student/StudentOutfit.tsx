"use client";
import type { Outfit, OutfitRental } from "@/lib/api/types";

import { useState } from "react";
import Image from "next/image";
import { StudentLayout } from "@/components/shared";
import {
  Badge, Card, CardContent, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui";
import { toast } from "sonner";
import { X, ShoppingBag, Shirt, CheckCircle2 } from "lucide-react";
import {
  useMyOutfitRentals,
  useRentOutfit,
  useRentMultipleOutfits,
  useCancelOutfitRental,
  useStudentCeremonies,
  useStudentOutfits,
} from "@/hooks/mutations/useStudent";
import { RentalStatus } from "@/lib/enums";

const rentalBadge = (s: string) => {
  if (s === RentalStatus.APPROVED) return "bg-green-50 text-green-700 border-green-200";
  if (s === RentalStatus.REJECTED) return "bg-red-50 text-red-700 border-red-200";
  if (s === "CANCELLED") return "bg-muted text-foreground border-border";
  return "bg-amber-50 text-amber-700 border-amber-200";
};

export function StudentOutfit() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [ceremonyId, setCeremonyId] = useState("");
  const [selectedOutfits, setSelectedOutfits] = useState<Map<number, Outfit>>(new Map());

  const { data: outfitData, isLoading, refetch: refetchRentals } = useMyOutfitRentals();
  const { data: cerData } = useStudentCeremonies();
  const { data: availableData, refetch: refetchAvailable } = useStudentOutfits();
  const rentOutfit = useRentOutfit();
  const rentMultipleOutfits = useRentMultipleOutfits();
  const cancelRental = useCancelOutfitRental();

  const rentals = outfitData?.rentals ?? [];
  const today = new Date(new Date().toDateString());
  const ceremonies = (cerData?.ceremonies ?? []).filter(
    (c) => c.status === "UPCOMING" && new Date(c.ceremonyDate) >= today,
  );
  const availableOutfits = (availableData?.outfits ?? []) as Outfit[];

  // Outfit IDs the student currently has a PENDING or APPROVED rental for.
  // Used to disable those cards in the modal so students don't hit a 409.
  const alreadyRentedIds = new Set<number>(
    rentals
      .filter((r) => r.rentalStatus === RentalStatus.PENDING || r.rentalStatus === RentalStatus.APPROVED)
      .map((r) => r.outfit?.id)
      .filter((id): id is number => id !== undefined),
  );

  const handleToggleOutfit = (outfit: Outfit) => {
    const newSelected = new Map(selectedOutfits);
    if (newSelected.has(outfit.id)) {
      newSelected.delete(outfit.id);
    } else {
      newSelected.set(outfit.id, outfit);
    }
    setSelectedOutfits(newSelected);
  };

  const handleRent = () => {
    if (!ceremonyId || selectedOutfits.size === 0) return;
    
    const outfits = Array.from(selectedOutfits.values()).map((outfit) => ({
      outfitId: outfit.id,
      selectedSize: outfit.size ?? "",
    }));

    // If only one outfit, use single rent endpoint; otherwise use batch
    const onSuccess = () => {
      setModalOpen(false);
      setCeremonyId("");
      setSelectedOutfits(new Map());
      toast.success("Outfit rented successfully!");
    };
    const onError = (err: Error) => toast.error(err.message || "Failed to rent outfit.");

    if (outfits.length === 1) {
      rentOutfit.mutate(
        { ceremonyId: Number(ceremonyId), ...outfits[0] },
        { onSuccess, onError },
      );
    } else {
      rentMultipleOutfits.mutate(
        { ceremonyId: Number(ceremonyId), outfits },
        { onSuccess, onError },
      );
    }
  };

  const handleOpenModal = async () => {
    setModalLoading(true);
    setModalOpen(true);
    await Promise.all([refetchRentals(), refetchAvailable()]);
    setModalLoading(false);
  };

  const handleClose = () => {
    setModalOpen(false);
    setModalLoading(false);
    setCeremonyId("");
    setSelectedOutfits(new Map());
  };

  return (
    <StudentLayout activeSidebarItem="Outfit">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-primary">Outfit Rental</h3>
          <Button className="bg-primary hover:bg-primary/85 text-primary-foreground" onClick={handleOpenModal} disabled={modalLoading}>
            <ShoppingBag className="w-4 h-4 mr-2" />
            {modalLoading ? "Loading..." : "Rent Outfit"}
          </Button>
        </div>

        <Card className="shadow-sm">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="px-6">Outfit Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rented At</TableHead>
                <TableHead className="px-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : rentals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingBag className="w-8 h-8 opacity-30" />
                      <p>No outfit rentals yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : rentals.map((r: OutfitRental, i: number) => (
                <TableRow key={r.id} className={i % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                  <TableCell className="px-6 font-medium">{r.outfit?.outfitType ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{r.selectedSize}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={rentalBadge(r.rentalStatus)}>{r.rentalStatus}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(r.rentedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="px-6 text-right">
                    {r.rentalStatus === RentalStatus.PENDING && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => cancelRental.mutate(r.id)}
                        title="Cancel request">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    {r.rentalStatus === RentalStatus.APPROVED && (
                      <span className="text-xs text-muted-foreground" title="Approved by admin — contact admin to cancel">Locked</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={modalOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">Rent Outfit(s)</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
            {/* Ceremony selector */}
            <div className="space-y-1.5">
              <Label>Ceremony</Label>
              <Select value={ceremonyId} onValueChange={setCeremonyId}>
                <SelectTrigger><SelectValue placeholder="Select ceremony" /></SelectTrigger>
                <SelectContent>
                  {ceremonies.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            {/* Outfit cards - allow multiple selection */}
            <div className="space-y-1.5">
              <Label>Select Outfit(s) - Choose one or more</Label>
              {modalLoading ? (
                <p className="text-sm text-muted-foreground text-center py-6">Loading available outfits...</p>
              ) : availableOutfits.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No outfits available.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableOutfits.map((outfit) => {
                    const isSelected = selectedOutfits.has(outfit.id);
                    const isAlreadyRented = alreadyRentedIds.has(outfit.id);
                    return (
                      <Card
                        key={outfit.id}
                        onClick={() => !isAlreadyRented && handleToggleOutfit(outfit)}
                        className={`transition-all border-2 shadow-sm ${
                          isAlreadyRented
                            ? "opacity-50 cursor-not-allowed border-transparent"
                            : isSelected
                              ? "cursor-pointer border-primary"
                              : "cursor-pointer border-transparent hover:border-primary/40 hover:shadow-md"
                        }`}
                      >
                        <CardContent className="p-0">
                          {/* Image area */}
                          <div className="relative w-full aspect-[3/4] bg-muted rounded-t-lg overflow-hidden">
                            {outfit.imageUrl ? (
                              <Image
                                src={outfit.imageUrl}
                                alt={outfit.outfitType}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Shirt className="w-12 h-12 text-muted-foreground/40" />
                              </div>
                            )}
                            {isSelected && !isAlreadyRented && (
                              <div className="absolute top-2 right-2 bg-primary rounded-full p-0.5">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              </div>
                            )}
                            {isAlreadyRented && (
                              <div className="absolute inset-0 flex items-end justify-center pb-2">
                                <span className="text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 rounded px-2 py-0.5">
                                  Already Rented
                                </span>
                              </div>
                            )}
                          </div>
                          {/* Info */}
                          <div className="p-2.5 space-y-0.5">
                            <p className="font-semibold text-sm text-primary truncate">{outfit.outfitType}</p>
                            {outfit.size && (
                              <p className="text-xs text-muted-foreground">Size: {outfit.size}</p>
                            )}
                            {outfit.color && (
                              <p className="text-xs text-muted-foreground">Color: {outfit.color}</p>
                            )}
                            <p className="text-xs font-medium text-primary">
                              {Number(outfit.rentalPrice) === 0 ? "Free" : `$${outfit.rentalPrice}`}
                            </p>
                            <p className="text-xs text-muted-foreground">{outfit.quantityAvailable} left</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected summary */}
            {selectedOutfits.size > 0 && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <Shirt className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-primary">
                    Selected: {selectedOutfits.size} outfit{selectedOutfits.size !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="text-xs text-primary/80 space-y-1">
                  {Array.from(selectedOutfits.values()).map((outfit) => (
                    <div key={outfit.id} className="flex items-center gap-2">
                      <span>•</span>
                      <span>
                        {outfit.outfitType}
                        {outfit.size ? ` — Size ${outfit.size}` : ""}
                        {outfit.color ? `, ${outfit.color}` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-2 border-t border-border mt-2">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button
              className="bg-primary hover:bg-primary/85 text-primary-foreground"
              onClick={handleRent}
              disabled={rentOutfit.isPending || rentMultipleOutfits.isPending || !ceremonyId || selectedOutfits.size === 0}
            >
              {rentOutfit.isPending || rentMultipleOutfits.isPending ? "Renting..." : `Confirm Rental (${selectedOutfits.size})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StudentLayout>
  );
}
