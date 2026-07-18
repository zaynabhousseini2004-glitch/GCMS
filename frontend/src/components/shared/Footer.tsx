"use client";

import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0d1e33] text-primary-foreground">
      {/* Top divider accent */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent to-transparent opacity-40" />

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">
          {/* Brand col */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/liulogo.png"
                alt="LIU Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <div className="w-px h-8 bg-primary-foreground/30" />
              <Image
                src="/GCMS_logo.png"
                alt="GCMS Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="font-bold text-2xl tracking-wider text-primary-foreground">GCMS</span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6 max-w-sm">
              The official Graduation Ceremony Management System of the Lebanese
              International University — streamlining every step from
              registration to the stage.
            </p>
            <a
              href="https://liu.edu.lb/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent text-sm font-semibold hover:gap-3 transition-all group"
            >
              Visit liu.edu.lb
              <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            </a>
          </div>

          {/* Quick links col */}
          <div className="md:col-span-3">
            <h4 className="text-accent font-semibold mb-6 uppercase text-xs tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Sign In", href: "/login" },
                { label: "Register", href: "/register" },
                {
                  label: "LIU Official Site",
                  href: "https://liu.edu.lb/",
                  external: true,
                },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-accent transition-colors group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact col */}
          <div className="md:col-span-4">
            <h4 className="text-accent font-semibold mb-6 uppercase text-xs tracking-widest">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/5 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm text-primary-foreground/60 leading-relaxed">
                  Lebanese International University
                  <br />
                  Beirut, Lebanon
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/5 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm text-primary-foreground/60">
                  +961 1 306 044
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/5 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm text-primary-foreground/60">
                  graduation@liu.edu.lb
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-primary-foreground/8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/35">
            &copy; {new Date().getFullYear()} GCMS &mdash; Lebanese
            International University. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-primary-foreground/35">
            <a
              href="#"
              className="hover:text-primary-foreground/70 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="w-px h-3 bg-primary-foreground/20" />
            <a
              href="#"
              className="hover:text-primary-foreground/70 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
