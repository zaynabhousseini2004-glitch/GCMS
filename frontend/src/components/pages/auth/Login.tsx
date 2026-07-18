"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Eye, EyeOff, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button, Input, Label } from "@/components/ui";
import { useLogin } from "@/hooks/mutations/useAuth";
import { UserRole } from "@/lib/enums";
import { ROUTES, adminRoutes, studentRoutes, vendorRoutes } from "@/lib/routes";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInactive = searchParams.get("reason") === "inactive";
  const isNoCampus = searchParams.get("reason") === "no-campus";
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          const { role, campusId, vendorApprovalStatus } = data.user;
          if (role === UserRole.SUPERADMIN) {
            router.push(ROUTES.superadmin.home);
          } else if (campusId) {
            // User already has a campus — go straight to their portal.
            // Never send them back to campus-selection or they can accidentally
            // overwrite their assignment by clicking a different campus card.
            if (role === UserRole.ADMIN) {
              router.push(adminRoutes(campusId).home);
            } else if (role === UserRole.STUDENT) {
              router.push(studentRoutes(campusId).home);
            } else if (role === UserRole.VENDOR) {
              router.push(
                vendorApprovalStatus === "APPROVED"
                  ? vendorRoutes(campusId).dashboard
                  : vendorRoutes(campusId).pending,
              );
            }
          } else {
            // No campus yet — first-time setup.
            router.push(ROUTES.campusSelection);
          }
        },
      },
    );
  };

  return (
    <div className="min-h-screen w-full flex font-inter bg-background">
      {/* LEFT PANEL */}
      <motion.div
        className="hidden lg:flex flex-col w-1/2 bg-primary text-primary-foreground p-12 relative overflow-hidden"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Background graduation image */}
        <div className="absolute inset-0 bg-[url('/graduation.png')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-primary/60" />

        <div className="relative z-10 flex items-center gap-3 mb-auto">
          <Image src="/liulogo.png" alt="LIU Logo" width={40} height={40} className="object-contain" />
          <div className="w-px h-8 bg-primary-foreground/30" />
          <Image src="/GCMS_logo.png" alt="GCMS Logo" width={40} height={40} className="object-contain" />
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full max-w-md mx-auto">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Your gateway to graduation.
          </h1>
          <p className="text-xl text-primary-foreground/70 leading-relaxed">
            Access your personalized portal to manage ceremony details, secure
            guest tickets, and prepare for your big day.
          </p>
        </div>

        <div className="relative z-10 mt-auto text-sm text-primary-foreground/40">
          &copy; {new Date().getFullYear()} University Graduation Management
          System
        </div>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        className="flex-1 flex flex-col relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      >
        <div className="absolute top-6 right-8 text-sm font-medium">
          <span className="text-muted-foreground mr-2">Don&apos;t have an account?</span>
          <Link
            href={ROUTES.register}
            className="text-primary hover:text-accent transition-colors font-semibold"
          >
            Register
          </Link>
        </div>

        <motion.div
          className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-full max-w-[400px]">
            <div className="mb-10 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 lg:hidden">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            {isInactive && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Your account has been deactivated. Please contact the Super Admin.</span>
              </div>
            )}

            {isNoCampus && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>You no longer have admin access to this campus. Please contact the Super Admin.</span>
              </div>
            )}

            {loginMutation.isError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Invalid email or password. Please try again.</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  className="h-12 border-border focus:border-primary focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 border-border focus:border-primary focus:ring-primary pr-10"
                    value={password}
                    maxLength={8}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground focus:outline-none"
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full h-12 bg-primary hover:bg-primary/85 text-primary-foreground font-medium text-base rounded-lg shadow-lg shadow-primary/20 transition-all"
                  type="submit"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            </form>

            <div className="mt-8 lg:hidden text-center text-sm font-medium">
              <span className="text-muted-foreground mr-2">Don&apos;t have an account?</span>
              <Link
                href={ROUTES.register}
                className="text-primary hover:text-accent transition-colors font-semibold"
              >
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
