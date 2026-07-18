"use client";

import Image from "next/image";
import { StudentLayout } from "@/components/shared";
import {
  Badge, Card, Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui";
import { MapPin, Calendar, Users, Ticket, BookOpen } from "lucide-react";
import { useStudentCeremonies } from "@/hooks/mutations/useStudent";
import { CeremonyStatus } from "@/lib/enums";

const statusStyle = (status: string) => {
  if (status === CeremonyStatus.UPCOMING) return "bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] border-0";
  if (status === CeremonyStatus.COMPLETED) return "bg-muted text-foreground hover:bg-muted border-0";
  return "bg-red-100 text-red-800 hover:bg-red-100 border-0";
};

export function StudentCeremony() {
  const { data, isLoading } = useStudentCeremonies();
  const ceremonies = data?.ceremonies ?? [];

  if (isLoading) {
    return (
      <StudentLayout activeSidebarItem="Ceremony">
        <p className="text-muted-foreground text-center py-12">Loading ceremonies...</p>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout activeSidebarItem="Ceremony">
      <div className="flex flex-col gap-6">
        <h3 className="text-2xl font-semibold text-primary">Ceremonies</h3>

        {ceremonies.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No ceremonies available for your campus.</p>
        ) : (
          <div className="flex flex-col gap-8">
            {ceremonies.map((ceremony) => (
              <Card key={ceremony.id} className="bg-background shadow-md rounded-[12px] overflow-hidden border-0">
                {/* Banner */}
                {ceremony.bannerUrl ? (
                  <div className="relative w-full h-56 md:h-72 overflow-hidden">
                    <Image
                      src={ceremony.bannerUrl}
                      alt={`${ceremony.title} banner`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                      <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow">{ceremony.title}</h2>
                      <div className="flex gap-2 flex-wrap justify-end">
                        <Badge className="bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE] border-0 rounded-md">
                          {ceremony.ceremonyType}
                        </Badge>
                        <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-0 rounded-md">
                          {ceremony.semester}
                        </Badge>
                        <Badge className={`rounded-md ${statusStyle(ceremony.status)}`}>
                          {ceremony.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-8 pt-8 pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-3xl font-bold text-primary">{ceremony.title}</h2>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className="bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE] border-0 rounded-md">
                          {ceremony.ceremonyType}
                        </Badge>
                        <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-0 rounded-md">
                          {ceremony.semester}
                        </Badge>
                        <Badge className={`rounded-md ${statusStyle(ceremony.status)}`}>
                          {ceremony.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6 md:p-8">
                  {/* Info row */}
                  <div className="flex flex-wrap gap-5 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span>{new Date(ceremony.ceremonyDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    {ceremony.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>{ceremony.venue}</span>
                      </div>
                    )}
                    {ceremony.capacity && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-accent" />
                        <span>Capacity: {ceremony.capacity.toLocaleString()}</span>
                      </div>
                    )}
                    {ceremony.ticketPrice != null && (
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-accent" />
                        <span>Ticket: <span className="font-semibold text-foreground">${Number(ceremony.ticketPrice).toFixed(2)}</span></span>
                      </div>
                    )}
                  </div>

                  {ceremony.description && (
                    <p className="text-muted-foreground text-sm mb-6">{ceremony.description}</p>
                  )}

                  {/* Instructions accordion — available if ceremony has instructions loaded */}
                  {Array.isArray(ceremony.instructions) && ceremony.instructions.length > 0 && (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="instructions" className="border border-border rounded-lg overflow-hidden">
                        <AccordionTrigger className="px-4 py-3 font-semibold text-sm text-foreground hover:no-underline">
                          <span className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-accent" />
                            Instructions ({ceremony.instructions.length})
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <ol className="space-y-3">
                            {ceremony.instructions.map((instr, idx) => (
                              <li key={instr.id} className="flex gap-3 text-sm">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                                  {idx + 1}
                                </span>
                                <div>
                                  {instr.title && <p className="font-semibold text-foreground mb-0.5">{instr.title}</p>}
                                  <p className="text-muted-foreground">{instr.content}</p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

