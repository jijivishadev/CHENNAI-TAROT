// app/admin/login/page.tsx
"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { globalContent } from "@/src/content/global";

const ADMIN_AUTH_KEY = "mdc_admin_auth";
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "700"] });

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem(ADMIN_AUTH_KEY, "true");
        router.replace("/admin");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setDebugInfo("");
    setIsSubmitting(true);

    if (!email.trim()) {
      setError("Please enter your email address.");
      setIsSubmitting(false);
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      setIsSubmitting(false);
      return;
    }

    try {
      setDebugInfo(`Attempting login with: ${email}`);
      console.log("Login attempt for:", email);
      
      // Set persistence
      await setPersistence(auth, browserLocalPersistence);
      setDebugInfo("Persistence set, authenticating...");
      
      // Sign in
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      
      setDebugInfo(`✅ Login successful! User: ${user.email}`);
      console.log("Login successful:", user.email, user.uid);
      
      // Store auth state
      localStorage.setItem(ADMIN_AUTH_KEY, "true");

      router.replace("/admin");
      
    } catch (error: any) {
      console.error("Login error full details:", error);
      setDebugInfo(`❌ Error code: ${error.code}`);
      
      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email. Please check your email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later.");
          break;
        case "auth/network-request-failed":
          setError("Network error. Check your internet connection.");
          break;
        case "auth/invalid-api-key":
          setError("Firebase API key error. Please check configuration.");
          break;
        default:
          setError(`Login failed: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1A0B2E] px-6 py-12 text-[#F3ECFF]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(212,175,55,0.14),transparent_44%),radial-gradient(circle_at_82%_78%,rgba(75,46,131,0.34),transparent_46%)]" />
      
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md items-center justify-center">
        <section className="relative z-10 w-full rounded-3xl border border-[#D4AF37] bg-white/5 p-7 shadow-[0_24px_60px_rgba(10,3,18,0.45)] backdrop-blur-xl sm:p-9">
          <div className="text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#D4AF37]/40 bg-[#F3ECFF]/5">
              <Image
                src={globalContent.logoUrl}
                alt={globalContent.brandName}
                width={64}
                height={64}
                className="h-14 w-14 rounded-full object-cover"
                priority
              />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]/85">
              Chennai Tarot
            </p>
            <h1 className={`${playfair.className} mt-3 text-3xl font-bold text-[#D4AF37]`}>
              Command Center
            </h1>
            <p className="mt-2 text-sm text-[#F3ECFF]/70">
              Access your private admin workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="group relative block">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="peer w-full rounded-2xl border border-[#D4AF37]/35 bg-white/5 px-4 pb-3 pt-6 text-sm text-[#F3ECFF] outline-none transition-all duration-200 placeholder:text-transparent focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/60"
                placeholder="Admin Email"
              />
              <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-[0.1em] text-[#F3ECFF]/60 transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-3 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-[0.1em] peer-focus:text-[#D4AF37]">
                Admin Email
              </span>
            </label>

            <label className="group relative block">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="peer w-full rounded-2xl border border-[#D4AF37]/35 bg-white/5 px-4 pb-3 pt-6 text-sm text-[#F3ECFF] outline-none transition-all duration-200 placeholder:text-transparent focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/60"
                placeholder="Password"
              />
              <span className="pointer-events-none absolute left-4 top-3 text-xs uppercase tracking-[0.1em] text-[#F3ECFF]/60 transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-3 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-[0.1em] peer-focus:text-[#D4AF37]">
                Password
              </span>
            </label>

            {error && (
              <div className="rounded-2xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {debugInfo && (
              <div className="rounded-2xl border border-blue-500/50 bg-blue-500/10 px-4 py-2 text-xs text-blue-400">
                {debugInfo}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-14 w-full items-center justify-center rounded-none border border-[#D4AF37] bg-[#D4AF37] px-6 py-3 text-base font-bold uppercase tracking-[0.08em] text-[#1A0B2E] transition-colors duration-200 hover:bg-transparent hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging In...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>
          
          <div className="mt-4 text-center text-xs text-[#F3ECFF]/40">
            <p>Try: mohit@gmail.com, dev@gmail.com, or multi@milliondollarscoach.com</p>
          </div>
        </section>
      </div>
    </main>
  );
}