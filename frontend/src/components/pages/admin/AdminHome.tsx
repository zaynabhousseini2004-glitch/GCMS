"use client";

import Image from "next/image";
import { AdminLayout } from "@/components/shared";
import { Users, BookOpen, Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui";
import {
  useAdminCeremonies,
  useAdminInstructions,
  useAdminDepartmentHeads,
} from "@/hooks/mutations/useAdmin";
import { CeremonyStatus } from "@/lib/enums";

function InstructionsSection({ ceremonyId }: { ceremonyId: number }) {
  const { data, isLoading } = useAdminInstructions(ceremonyId);
  const instructions = data?.instructions ?? [];

  if (isLoading) return <p className="text-muted-foreground text-sm">Loading instructions...</p>;
  if (instructions.length === 0) return <p className="text-muted-foreground text-sm">No instructions added yet.</p>;

  return (
    <ol className="space-y-4">
      {instructions.map((instr, idx) => (
        <li key={instr.id} className="flex gap-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
            {idx + 1}
          </span>
          <div>
            {instr.title && <p className="font-semibold text-foreground mb-0.5">{instr.title}</p>}
            <p className="text-muted-foreground text-sm">{instr.content}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function AdminHome() {
  const { data: cerData, isLoading: cerLoading } = useAdminCeremonies();
  const { data: headsData, isLoading: headsLoading } = useAdminDepartmentHeads();

  const ceremonies = cerData?.ceremonies ?? [];
  const upcomingCeremony = ceremonies.find((c) => c.status === CeremonyStatus.UPCOMING) ?? ceremonies[0];
  const heads = headsData?.departmentHeads ?? [];

  return (
    <AdminLayout activeSidebarItem="Home">
      <div className="flex flex-col gap-10">

        {/* Ceremony banner + info */}
        {cerLoading ? (
          <div className="h-48 rounded-2xl bg-muted animate-pulse" />
        ) : upcomingCeremony ? (
          <Card className="overflow-hidden border-0 shadow-md rounded-2xl">
            {upcomingCeremony.bannerUrl ? (
              <div className="relative w-full h-56 md:h-72">
                <Image
                  src={upcomingCeremony.bannerUrl}
                  alt={`${upcomingCeremony.title} banner`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">{upcomingCeremony.status}</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow">{upcomingCeremony.title}</h2>
                  <div className="flex gap-4 mt-2 text-white/80 text-sm">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(upcomingCeremony.ceremonyDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    {upcomingCeremony.venue && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{upcomingCeremony.venue}</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-primary/10 px-8 py-10 flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary/60 mb-1">{upcomingCeremony.status}</p>
                <h2 className="text-3xl font-bold text-primary">{upcomingCeremony.title}</h2>
                <div className="flex gap-4 mt-1 text-muted-foreground text-sm">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(upcomingCeremony.ceremonyDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                  {upcomingCeremony.venue && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{upcomingCeremony.venue}</span>}
                </div>
              </div>
            )}
          </Card>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No ceremonies found for your campus.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Instructions */}
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-primary">Ceremony Instructions</h3>
            </div>
            <div className="p-6">
              {!upcomingCeremony ? (
                <p className="text-muted-foreground text-sm">No ceremony selected.</p>
              ) : (
                <InstructionsSection ceremonyId={upcomingCeremony.id} />
              )}
            </div>
          </Card>

          {/* Department Heads */}
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border flex items-center gap-3">
              <Users className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-primary">Department Heads</h3>
            </div>
            <div className="p-6">
              {headsLoading ? (
                <p className="text-muted-foreground text-sm">Loading...</p>
              ) : heads.length === 0 ? (
                <p className="text-muted-foreground text-sm">No department heads added yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {heads.map((head) => (
                    <div key={head.id} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden bg-primary/10 flex-shrink-0 border-2 border-border">
                        {head.photoUrl ? (
                          <Image src={head.photoUrl} alt={head.fullName} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg">
                            {head.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">{head.fullName}</p>
                        <p className="text-accent text-xs font-medium uppercase tracking-wider truncate">{head.departmentTitle}</p>
                        {head.description && <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{head.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </AdminLayout>
  );
}

