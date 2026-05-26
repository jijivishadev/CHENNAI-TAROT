// app/(admin)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { globalContent } from "@/src/content/global";
import { auth } from "@/lib/firebase";

const ADMIN_AUTH_KEY = "mdc_admin_auth";

const MobileHeader = ({ onMenuClick, isSidebarOpen }: { onMenuClick: () => void, isSidebarOpen: boolean }) => (
  <header className="sticky top-0 left-0 right-0 z-30 flex h-20 items-center justify-between border-b border-[#1A0B2E]/20 bg-[#D4AF37] px-4 backdrop-blur-md lg:hidden">
    <div className="flex items-center">
      <Image
        src={globalContent.logoUrl}
        alt="Logo"
        width={48}
        height={48}
        className="h-10 w-auto rounded-full"
      />
    </div>
    <motion.button
      key="menu-button"
      onClick={onMenuClick}
      className="flex h-12 w-12 items-center justify-center rounded-full"
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle navigation"
    >
      <AnimatePresence mode="wait">
        {isSidebarOpen ? (
          <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
            <X className="h-7 w-7 text-[#1A0B2E]" />
          </motion.div>
        ) : (
          <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
            <Menu className="h-7 w-7 text-[#1A0B2E]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  </header>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isLoginRoute = pathname === "/admin/login" || pathname?.startsWith("/admin/login/");

  // Auth check using Firebase onAuthStateChanged
  useEffect(() => {
    setMounted(true);

    // Firebase user is the source of truth; localStorage is only a mirrored hint.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem(ADMIN_AUTH_KEY, "true");
        setIsAuthed(true);
      } else {
        localStorage.removeItem(ADMIN_AUTH_KEY);
        setIsAuthed(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthed && !isLoginRoute) {
      router.replace("/admin/login");
    }
  }, [isAuthed, isLoading, isLoginRoute, router]);

  // Close drawer on route change
  useEffect(() => {
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  }, [pathname]);

  // Show loading state
  if (isLoginRoute) {
    return <main>{children}</main>;
  }

  // Show loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#F8F9FA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  // If not authenticated, don't render admin content
  if (!isAuthed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A0B2E]">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={() => setIsDrawerOpen(!isDrawerOpen)} isSidebarOpen={isDrawerOpen} />

      {/* Sidebar Drawer */}
      <AdminSidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Main Content */}
      <main className="min-h-screen flex flex-col pt-20 lg:pt-0">
        <div className="flex-1 transition-all duration-300 lg:ml-72">
          {children}
        </div>
      </main>
    </div>
  );
}