"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button, Input, Label } from "@/components/ui";
import { useRegister } from "@/hooks/mutations/useAuth";
import { UserRole } from "@/lib/enums";
import { ROUTES } from "@/lib/routes";
import { motion } from "framer-motion";
import {
  normalizePhoneInput,
  validatePhone,
  validatePassword,
  PASSWORD_LENGTH,
  PHONE_DIGITS,
} from "@/lib/validation";

export default function Register() {
  const router = useRouter();
  const registerMutation = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState<"student" | "vendor">("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePhoneChange = (raw: string) => {
    const normalized = normalizePhoneInput(raw);
    setPhone(normalized);
    if (phoneError) setPhoneError(validatePhone(normalized) ?? "");
  };

  const handlePhoneFocus = () => {
    if (!phone) setPhone("+961");
  };

  const handlePhoneBlur = () => {
    const current = phone === "+961" ? "" : phone;
    if (phone === "+961") setPhone("");
    setPhoneError(validatePhone(current) ?? "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const phoneErr = validatePhone(phone);
    if (phoneErr) { setPhoneError(phoneErr); return; }

    const pwErr = validatePassword(password);
    if (pwErr) { setPasswordError(pwErr); return; }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordError("");
    setPhoneError("");

    const fullName = `${firstName} ${lastName}`.trim();
    registerMutation.mutate(
      {
        fullName,
        email,
        password,
        phone: phone || undefined,
        role: accountType === "vendor" ? UserRole.VENDOR : UserRole.STUDENT,
      },
      {
        onSuccess: () => {
          router.push(ROUTES.campusSelection);
        },
      },
    );
  };

  return (
    <div className="min-h-screen w-full flex font-inter bg-background">
      {/* LEFT PANEL */}
      <motion.div
        className="hidden lg:flex flex-col w-1/2 shrink-0 bg-primary text-primary-foreground p-12 overflow-hidden sticky top-0 h-screen"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 bg-[url('/graduation.png')] bg-cover bg-center opacity-80" />
        <div className="absolute inset-0 bg-primary/60" />

        <div className="relative z-10 flex items-center gap-3 mb-auto">
          <Image src="/liulogo.png" alt="LIU Logo" width={40} height={40} className="object-contain" />
          <div className="w-px h-8 bg-primary-foreground/30" />
          <Image src="/GCMS_logo.png" alt="GCMS Logo" width={40} height={40} className="object-contain" />
        </div>

        <div className="relative z-10 flex flex-col justify-center h-full max-w-md mx-auto">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Join the celebration.
          </h1>
          <p className="text-xl text-primary-foreground/70 leading-relaxed mb-8">
            Create your account to prepare for the upcoming graduation ceremony.
            Stay updated on deadlines and important information.
          </p>
          <div className="space-y-4">
            {[
              "Manage your guest tickets",
              "Order graduation attire",
              "Access event schedules",
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-3 text-primary-foreground/80">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div
        className="flex-1 flex flex-col relative min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      >
        <div className="absolute top-6 right-8 text-sm font-medium z-10">
          <span className="text-muted-foreground mr-2">Already have an account?</span>
          <Link href={ROUTES.login} className="text-primary hover:text-accent transition-colors font-semibold">
            Sign In
          </Link>
        </div>

        <div className="flex-1 flex flex-col pt-28 pb-16 px-8 sm:px-12 items-center">
          <div className="w-full max-w-[480px]">
            <div className="mb-8 flex flex-col items-center lg:items-start">
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6 lg:hidden">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-primary mb-2">Create Account</h2>
              <p className="text-muted-foreground">Fill in your details to get started</p>
            </div>

            {/* Account type tabs */}
            <div className="flex p-1 bg-muted rounded-lg mb-8">
              <button
                type="button"
                onClick={() => setAccountType("student")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                  accountType === "student"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setAccountType("vendor")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                  accountType === "vendor"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Vendor
              </button>
            </div>

            {registerMutation.isError && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Registration failed. Please check your details and try again.</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Ahmed"
                    className="h-11 bg-muted/50"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Al-Faisal"
                    className="h-11 bg-muted/50"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@university.edu"
                  className="h-11 bg-muted/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Phone Number <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="+961 XXXXXXXX"
                  className={`h-11 bg-muted/50 ${phoneError ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                  value={phone}
                  maxLength={12}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onFocus={handlePhoneFocus}
                  onBlur={handlePhoneBlur}
                />
                {phoneError && <p className="text-xs text-red-600">{phoneError}</p>}
                {!phoneError && (
                  <p className="text-xs text-muted-foreground">
                    Format: +961 followed by {PHONE_DIGITS} digits
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={`At least ${PASSWORD_LENGTH} characters`}
                    className={`h-11 bg-muted/50 pr-10 ${passwordError ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(validatePassword(e.target.value) ?? "");
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground focus:outline-none"
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least {PASSWORD_LENGTH} characters
                </p>
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat your password"
                    className={`h-11 bg-muted/50 pr-10 ${passwordError ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground focus:outline-none"
                  >
                    {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-600">{passwordError}</p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  className="w-full h-12 bg-primary hover:bg-primary/85 text-primary-foreground font-medium text-base rounded-lg shadow-lg shadow-primary/20 transition-all"
                  type="submit"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Creating account..." : "Create Account"}
                </Button>
              </div>
            </form>

            <div className="mt-8 lg:hidden text-center text-sm font-medium">
              <span className="text-muted-foreground mr-2">Already have an account?</span>
              <Link href={ROUTES.login} className="text-primary hover:text-accent transition-colors font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
