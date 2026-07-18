"use client";

import { useState } from "react";
import Image from "next/image";
import { StudentLayout } from "@/components/shared";
import { Users, BookOpen, Calendar, MapPin, DollarSign, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui";
import {
  useStudentCeremonies,
  useStudentDepartmentHeads,
} from "@/hooks/mutations/useStudent";
import { CeremonyStatus } from "@/lib/enums";
import type { Ceremony } from "@/lib/api/types";

const INSTRUCTION_TABS = [
  { key: "STUDENT", label: "Student" },
  { key: "PARENT", label: "Parent" },
  { key: "GUEST", label: "Guest" },
] as const;

function CeremonyCard({ ceremony }: { ceremony: Ceremony }) {
  return (
    <Card className="overflow-hidden border-0 shadow-md rounded-2xl">
      {ceremony.bannerUrl ? (
        <div className="relative w-full h-48 md:h-64">
          <Image
            src={ceremony.bannerUrl}
            alt={`${ceremony.title} banner`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-5 left-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">{ceremony.status}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow">{ceremony.title}</h2>
            <div className="flex flex-wrap gap-4 mt-2 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(ceremony.ceremonyDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              {ceremony.venue && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{ceremony.venue}</span>}
              {ceremony.ticketPrice != null && (
                <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />Ticket: ${Number(ceremony.ticketPrice).toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-primary/10 px-6 py-8 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/60">{ceremony.status}</p>
          <h2 className="text-2xl font-bold text-primary">{ceremony.title}</h2>
          <div className="flex flex-wrap gap-4 mt-1 text-muted-foreground text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(ceremony.ceremonyDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
            {ceremony.venue && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{ceremony.venue}</span>}
            {ceremony.ticketPrice != null && (
              <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />Ticket: ${Number(ceremony.ticketPrice).toFixed(2)}</span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

function InstructionTabs({ ceremonies }: { ceremonies: Ceremony[] }) {
  const [activeTab, setActiveTab] = useState<"STUDENT" | "PARENT" | "GUEST">("STUDENT");

  const allInstructions = ceremonies.flatMap((c) =>
    (c.instructions ?? []).map((instr) => ({ ...instr, ceremonyTitle: c.title }))
  );
  const filtered = allInstructions.filter((i) => i.target === activeTab);

  return (
    <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-border flex items-center gap-3">
        <BookOpen className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-primary">Ceremony Instructions</h3>
      </div>
      <div className="flex border-b border-border">
        {INSTRUCTION_TABS.map((tab) => {
          const count = allInstructions.filter((i) => i.target === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="p-6">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm">No instructions for this audience yet.</p>
        ) : (
          <ol className="space-y-4">
            {filtered.map((instr, idx) => (
              <li key={instr.id} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <div>
                  {instr.title && <p className="font-semibold text-foreground mb-0.5">{instr.title}</p>}
                  <p className="text-muted-foreground text-sm">{instr.content}</p>
                  {ceremonies.length > 1 && (
                    <p className="text-xs text-accent mt-1 flex items-center gap-1">
                      <ChevronRight className="w-3 h-3" />{instr.ceremonyTitle}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Card>
  );
}

export function StudentHome() {
  const { data: cerData, isLoading: cerLoading } = useStudentCeremonies();
  const { data: headsData, isLoading: headsLoading } = useStudentDepartmentHeads();

  const allCeremonies = cerData?.ceremonies ?? [];
  const upcomingCeremonies = allCeremonies.filter((c) => c.status === CeremonyStatus.UPCOMING);
  const instructionSource = upcomingCeremonies.length > 0 ? upcomingCeremonies : allCeremonies;
  const heads = headsData?.departmentHeads ?? [];

  return (
    <StudentLayout activeSidebarItem="Home">
      <div className="flex flex-col gap-10">

        {/* All Upcoming Ceremonies */}
        <section>
          <h2 className="text-xl font-bold text-primary mb-4">Upcoming Ceremonies</h2>
          {cerLoading ? (
            <div className="h-48 rounded-2xl bg-muted animate-pulse" />
          ) : upcomingCeremonies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No upcoming ceremonies for your campus.
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {upcomingCeremonies.map((c) => (
                <CeremonyCard key={c.id} ceremony={c} />
              ))}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Instructions with tabs */}
          {cerLoading ? (
            <div className="h-48 rounded-2xl bg-muted animate-pulse" />
          ) : (
            <InstructionTabs ceremonies={instructionSource} />
          )}

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
                <p className="text-muted-foreground text-sm">No department heads listed yet.</p>
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
    </StudentLayout>
  );
}
