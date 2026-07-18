"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  TicketCheck,
  Award,
  BookOpen,
  GraduationCap,
} from "lucide-react";

export function HomeContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner */}
      <Card className="shadow-sm border-none bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
        <CardContent className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <span className="inline-block py-1 px-3 rounded-full bg-white/15 border border-white/20 text-accent text-xs font-semibold tracking-widest mb-3 uppercase">
                Class of 2026
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Spring Graduation Ceremony
              </h2>
              <p className="text-primary-foreground/70 text-lg">
                Celebrating academic excellence and new beginnings
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="secondary"
                className="bg-white/15 hover:bg-white/25 text-primary-foreground border-white/20 border"
              >
                View Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Countdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Days", value: "45" },
          { label: "Hours", value: "12" },
          { label: "Minutes", value: "30" },
          { label: "Seconds", value: "00" },
        ].map((t) => (
          <Card key={t.label} className="shadow-sm border-none text-center">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-primary">{t.value}</p>
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium mt-1">
                {t.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Event Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm border-none">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Date</p>
              <p className="text-sm text-muted-foreground">June 15, 2026</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Time</p>
              <p className="text-sm text-muted-foreground">9:00 AM – 1:00 PM</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Venue</p>
              <p className="text-sm text-muted-foreground">King Fahd Stadium</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* About & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm border-none lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-primary">
              About the Ceremony
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-muted-foreground leading-relaxed mb-4">
              The Graduation Ceremony is a momentous occasion that marks the
              culmination of years of hard work, dedication, and academic
              pursuit. It is a time for graduates to celebrate their
              achievements with family, friends, and the university community.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Join us as we honor the Class of 2026 in a spectacular event
              featuring keynote speakers, degree conferrals, and celebrations
              across our campuses.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-primary">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            {[
              { icon: Users, label: "Expected Attendees", value: "15,000+" },
              { icon: GraduationCap, label: "Graduates", value: "3,200+" },
              { icon: Award, label: "Honor Students", value: "450" },
              { icon: BookOpen, label: "Departments", value: "28" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <s.icon className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-semibold text-foreground">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Key Features */}
      <Card className="shadow-sm border-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-primary">
            Ceremony Highlights
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Calendar,
                title: "Live Ceremony",
                desc: "Watch the ceremony broadcast live from the main stage",
              },
              {
                icon: TicketCheck,
                title: "Digital Tickets",
                desc: "Access your tickets and manage guest invitations",
              },
              {
                icon: Award,
                title: "Achievements",
                desc: "View honors, awards, and special recognitions",
              },
              {
                icon: BookOpen,
                title: "Event Guide",
                desc: "Ceremony schedule, dress code, and instructions",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">
                  {f.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
