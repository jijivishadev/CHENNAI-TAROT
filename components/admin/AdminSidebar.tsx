"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ImageIcon,
  ScrollText,
  Sparkles,
  ShoppingBag,
  Boxes,
  Award,
  Contact,
  HelpCircle,
  FileText,
} from "lucide-react";
import { auth } from "@/lib/firebase";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  // { label: "Hero Editor", href: "/admin/hero-editor", icon: Sparkles },
  { label: "Image Manager", href: "/admin/image-manager", icon: ImageIcon },
  { label: "About Content", href: "/admin/about-content", icon: ScrollText },
  { label: "Manage Offers", href: "/admin/offers", icon: ShoppingBag },
  { label: "Pathways", href: "/admin/pathways", icon: Boxes },
  { label: "Testimonials", href: "/admin/testimonials", icon: Award },
  { label: "Contact Hub", href: "/admin/contact-hub", icon: Contact },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Survey", href: "/admin/survey", icon: FileText },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 1024);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <aside className={`fixed left-0 top-0 z-[150] h-screen w-72 bg-[#1A0B2E] border-r border-[#D4AF37]/20 p-4 transition-transform ${isOpen || isDesktop ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="bg-white/5 p-4 rounded-xl mb-6 border border-[#D4AF37]/20">
        <h2 className="text-[#D4AF37] font-bold tracking-widest text-xs uppercase">Admin Panel</h2>
        <p className="text-white font-bold">Chennai Tarot</p>
      </div>
      <nav className="space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} onClick={onClose} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${active ? "bg-[#D4AF37] text-black font-bold" : "text-white/70 hover:bg-white/10"}`}>
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}