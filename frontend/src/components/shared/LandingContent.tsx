"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  TicketCheck,
  Shirt,
  Armchair,
  Bell,
  Store,
  MessageSquare,
  ClipboardList,
  UserCheck,
  ShieldCheck,
  Users,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Building2,
  MapPin,
  GraduationCap,
} from "lucide-react";
import {
  FadeUp,
  SlideInLeft,
  SlideInRight,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
} from "./motion";
import { motion } from "framer-motion";
import { getCampuses } from "@/lib/api/public";

export function LandingContent() {
  const [campusCount, setCampusCount] = useState<number | null>(null);

  useEffect(() => {
    getCampuses()
      .then(({ campuses }) => setCampusCount(campuses.length))
      .catch(() => setCampusCount(null));
  }, []);

  return (
    <main className="flex-1">
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-30 bg-[url('/cover.png')] bg-cover bg-center" />
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary-foreground/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center px-6 w-full max-w-5xl mx-auto flex flex-col items-center py-24">
          <FadeUp delay={0.05}>
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-8">
              <Building2 className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-semibold tracking-widest uppercase">
                Lebanese International University
              </span>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 tracking-tight leading-[1.1]">
              Graduation Ceremony
              <span className="block text-accent mt-1">Management System</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p className="text-lg md:text-xl text-primary-foreground/75 mb-10 max-w-2xl leading-relaxed">
              The all-in-one platform that connects students, vendors, and
              campus administrators to deliver seamless, memorable graduation
              experiences.
            </p>
          </FadeUp>

          <FadeUp delay={0.35}>
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-semibold px-8 py-3.5 rounded-full hover:bg-accent/90 transition-all shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://liu.edu.lb/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground font-semibold px-8 py-3.5 rounded-full border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all"
              >
                Visit LIU <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </FadeUp>

          <FadeUp delay={0.45}>
            <div className="w-full max-w-xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/15 rounded-2xl p-1 shadow-2xl">
              <div className="grid grid-cols-2 divide-x divide-primary-foreground/10">
                {[
                  {
                    icon: MapPin,
                    value: campusCount !== null ? String(campusCount) : "—",
                    label: "LIU Campuses",
                    color: "text-accent",
                  },
                  {
                    icon: ShieldCheck,
                    value: "100%",
                    label: "Secure & Managed",
                    color: "text-accent",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center py-6 px-8 gap-1"
                  >
                    <stat.icon className={`w-5 h-5 mb-1 ${stat.color}`} />
                    <span className="text-2xl md:text-3xl font-bold text-primary-foreground">
                      {stat.value}
                    </span>
                    <span className="text-xs text-primary-foreground/60 uppercase tracking-wider font-medium text-center">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── ABOUT THE SYSTEM ─────────────────────────────────────── */}
      <section className="py-28 px-6 bg-background overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <SlideInLeft inView>
            <div>
              <div className="inline-flex items-center gap-2 text-accent font-semibold tracking-wider uppercase text-sm mb-5">
                <span className="w-8 h-px bg-accent" />
                <span>About the System</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
                Built for LIU&apos;s
                <span className="text-accent block">Graduation Experience</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                The GCMS is a purpose-built platform developed for the Lebanese
                International University to manage every step of the graduation
                ceremony lifecycle — from student eligibility and outfit rental
                to seating assignments and vendor coordination.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Campus-specific ceremony management",
                  "Student self-service portal with real-time updates",
                  "Integrated vendor coordination and chat",
                  "QR-based ticket scanning on ceremony day",
                ].map((point, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-muted-foreground"
                  >
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://liu.edu.lb/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all group"
              >
                Visit LIU&apos;s Official Website
                <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </SlideInLeft>

          <SlideInRight inView>
            <div className="relative flex items-center justify-center">
              <div className="absolute top-4 right-4 w-full aspect-[4/3] rounded-2xl bg-accent/20 rotate-3" />
              <div className="relative w-full aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-4 p-8 bg-[linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)),url('/graduation.png')] bg-cover bg-center">
                {" "}
              </div>
              <div className="absolute -bottom-4 -left-4 bg-background border border-border rounded-2xl shadow-xl p-5 flex items-center gap-4 max-w-[260px]">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-primary text-sm">End-to-End</p>
                  <p className="text-muted-foreground text-xs">
                    From registration to ceremony day
                  </p>
                </div>
              </div>
            </div>
          </SlideInRight>
        </div>
      </section>

      {/* ── FOR STUDENTS ─────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-muted relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <FadeUp inView>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-accent font-semibold tracking-wider uppercase text-sm mb-4">
                  <span className="w-8 h-px bg-accent" />
                  <span>For Students</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
                  Everything You Need
                  <span className="block">in One Place</span>
                </h2>
              </div>
              <p className="text-muted-foreground text-lg max-w-sm md:text-right">
                From the moment you&apos;re eligible to the moment you walk the
                stage.
              </p>
            </div>
          </FadeUp>

          <StaggerContainer
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            inView
          >
            {[
              {
                icon: GraduationCap,
                title: "Ceremony Registration",
                desc: "Browse upcoming graduation ceremonies at your campus and register once your eligibility is confirmed.",
              },
              {
                icon: TicketCheck,
                title: "Guest Ticket Reservations",
                desc: "Reserve guest passes for your family and friends, and track each reservation in real time.",
              },
              {
                icon: Shirt,
                title: "Outfit Rental",
                desc: "Choose your graduation gown size and manage your rental from selection to pickup.",
              },
              {
                icon: Armchair,
                title: "Seat Assignments",
                desc: "View your assigned seat and access a clear seating map so you know exactly where to be.",
              },
              {
                icon: Bell,
                title: "Notifications",
                desc: "Receive real-time updates about ceremony dates, eligibility status, and important deadlines.",
              },
              {
                icon: UserCheck,
                title: "Profile & Academic Info",
                desc: "Keep your university ID, faculty, department, and graduation semester up to date.",
              },
            ].map((feature, i) => (
              <StaggerItem key={i}>
                <div className="group relative rounded-2xl p-8 border border-primary/20 bg-primary transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-5">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-primary-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-primary-foreground/70">
                    {feature.desc}
                  </p>
                  <ArrowRight className="w-4 h-4 mt-4 text-accent transition-transform group-hover:translate-x-1" />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── FOR VENDORS ──────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <FadeUp inView>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-accent font-semibold tracking-wider uppercase text-sm mb-4 justify-center">
                <span className="w-8 h-px bg-accent" />
                <span>For Vendors</span>
                <span className="w-8 h-px bg-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Partner with LIU&apos;s Graduation
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Offer photography, catering, decor, and more — directly to
                campus administrators through a dedicated vendor portal.
              </p>
            </div>
          </FadeUp>

          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            inView
          >
            {[
              {
                step: "01",
                icon: Store,
                title: "Register & Get Approved",
                desc: "Create a vendor account, submit your company details and service type, and await approval from the campus administration team.",
              },
              {
                step: "02",
                icon: ClipboardList,
                title: "Publish Service Offerings",
                desc: "List the services you provide so administrators can discover and select you for upcoming ceremony requests.",
              },
              {
                step: "03",
                icon: MessageSquare,
                title: "Real-Time Chat with Admin",
                desc: "Communicate directly with campus administrators through the integrated chat system — no back-and-forth emails needed.",
              },
              {
                step: "04",
                icon: Users,
                title: "Manage Requests & Profile",
                desc: "Track all assigned vendor requests, view ceremony details, update your company profile, and upload your logo anytime.",
              },
            ].map((feature, i) => (
              <StaggerItem key={i}>
                <div className="relative flex gap-5 bg-card border border-border rounded-2xl p-7 hover:shadow-lg hover:-translate-y-0.5 transition-all group h-full">
                  <div className="shrink-0 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-accent">
                      {feature.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute top-0 left-0 w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto relative">
          <FadeUp inView>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 text-accent font-semibold tracking-wider uppercase text-sm mb-4 justify-center">
                <span className="w-8 h-px bg-accent" />
                <span>The Journey</span>
                <span className="w-8 h-px bg-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                How It Works
              </h2>
              <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
                Your path from enrollment to graduation day — simplified into
                four clear steps.
              </p>
            </div>
          </FadeUp>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-0">
            <div className="hidden md:block absolute top-[52px] left-[15%] right-[15%] h-px border-t-2 border-dashed border-primary-foreground/20 z-0" />
            {[
              {
                step: "01",
                title: "Register",
                desc: "Create your student account and complete your academic profile on GCMS.",
              },
              {
                step: "02",
                title: "Get Eligible",
                desc: "Your campus admin reviews and confirms your graduation eligibility.",
              },
              {
                step: "03",
                title: "Reserve & Rent",
                desc: "Book guest tickets and rent your graduation outfit through the portal.",
              },
              {
                step: "04",
                title: "Celebrate",
                desc: "Walk the stage, collect your degree, and celebrate your achievement.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="relative flex flex-col items-center text-center px-4 z-10"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="w-[104px] h-[104px] rounded-full bg-primary border-4 border-primary-foreground/10 shadow-2xl flex items-center justify-center mb-6 relative">
                  <span className="text-3xl font-bold text-accent">
                    {item.step}
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-foreground/5 to-transparent" />
                </div>
                <h3 className="text-xl font-bold text-primary-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-primary-foreground/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIU BANNER ───────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <ScaleIn inView>
            <div className="bg-gradient-to-br from-primary to-primary/90 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-primary-foreground/5 blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-8">
                  <Building2 className="w-4 h-4 text-accent" />
                  <span className="text-accent text-sm font-semibold tracking-widest uppercase">
                    Powered by Excellence
                  </span>
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
                  Lebanese International University
                </h2>
                <p className="text-primary-foreground/75 text-lg leading-relaxed mb-3 max-w-2xl mx-auto">
                  LIU is one of Lebanon&apos;s leading private universities,
                  with multiple campuses across the country and a commitment to
                  academic excellence, student success, and community
                  development.
                </p>
                <p className="text-primary-foreground/60 text-base leading-relaxed mb-10 max-w-2xl mx-auto">
                  This Graduation Ceremony Management System was built to honor
                  LIU&apos;s graduates and ensure that every ceremony is
                  organized, accessible, and unforgettable.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-semibold px-8 py-3.5 rounded-full hover:bg-accent/90 transition-all shadow-xl hover:-translate-y-0.5"
                  >
                    Access the Portal <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href="https://liu.edu.lb/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-primary-foreground/10 text-primary-foreground font-semibold px-8 py-3.5 rounded-full border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all"
                  >
                    Visit liu.edu.lb <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </ScaleIn>
        </div>
      </section>
    </main>
  );
}
{
  /* Background layers */
}
