"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Playfair_Display } from "next/font/google";
import { Menu, X } from "lucide-react";
import Button from "@/components/shared/Button";

import { useScroll } from "@/hooks/useScroll";
import { globalContent } from "@/src/content/global";

const navLinks = globalContent.headerNavLinks;
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700"] });
const mobileDrawerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Resources", href: "#home-discovery" },
  { label: "FAQs", href: "/faqs" },
  { label: "Survey", href: "/survey" },
  { label: "Contact", href: "#site-footer" },
] as const;

function GlobalHeader() {
  const isScrolled = useScroll(100);
  const isMobileScrolled = useScroll(50);
  const hasScrolled = useScroll(1);
  const pathname = usePathname();
  const router = useRouter();
  const [showLogo, setShowLogo] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setShowLogo(isScrolled);
  }, [isScrolled]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const normalizePath = (value: string): string => {
    const trimmed = value.replace(/\/+$/, "");
    return trimmed || "/";
  };

  const scrollToFooter = () => {
    const footer = document.getElementById("site-footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", "#site-footer");
    }
  };

  const scrollToDiscovery = () => {
    const discovery = document.getElementById("home-discovery");
    if (discovery) {
      discovery.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", "#home-discovery");
      return;
    }
    router.push("/#home-discovery");
  };

  const isDesktopActive = (href: string): boolean => {
    if (href.startsWith("#") || href === "/#") return false;
    const currentPath = normalizePath(pathname || "/");
    const targetPath = normalizePath(href);
    if (targetPath === "/") return currentPath === "/";
    return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
  };

  const desktopNavButtonClassName =
    "whitespace-nowrap rounded-lg px-3 py-1.5 text-[0.78rem] lg:px-3.5 lg:py-2 lg:text-[0.85rem] xl:px-4 xl:py-2.5 xl:text-[0.95rem] 2xl:px-5 2xl:py-3 2xl:text-[1rem]";

  const desktopNavButtonStyle: React.CSSProperties = {
    fontSize: "clamp(0.7rem, 0.62rem + 0.14vw, 0.98rem)",
    paddingInline: "clamp(0.7rem, 0.52rem + 0.34vw, 1.2rem)",
    paddingBlock: "clamp(0.42rem, 0.34rem + 0.16vw, 0.72rem)",
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-8 z-50 border-b font-sans transition-all duration-300 sm:top-9 ${
          isOpen
            ? "border-transparent bg-transparent"
            : hasScrolled
              ? "border-[#4B2E83]/20 bg-[#F3ECFF]/95 backdrop-blur-md shadow-sm"
              : "border-[#4B2E83]/15 bg-[#F3ECFF]/90 backdrop-blur-md"
        }`}
      >
        <nav className="flex w-full items-center justify-between gap-2 px-4 py-4 sm:px-6 sm:py-5 lg:px-6 xl:px-8">
          <Link href="/" className="relative flex items-center gap-3">
            <div className="relative flex w-full items-center justify-center lg:justify-start">
              <Image
                src={globalContent.logoUrl}
                alt={globalContent.brandName}
                width={40}
                height={40}
                className="absolute left-0 top-7 h-10 w-10 -translate-y-1/2 rounded-full object-cover lg:hidden"
                style={{
                  opacity: isMobileScrolled ? 1 : 0,
                  transform: `translateY(-50%) scale(${isMobileScrolled ? 1 : 0.92})`,
                  transition: "opacity 400ms ease, transform 400ms ease",
                }}
              />
              <span
                className={`${playfair.className} block w-full text-center text-xl font-bold tracking-wide text-[#4B2E83] lg:hidden`}
                style={{
                  opacity: isMobileScrolled ? 0 : 1,
                  transition: "opacity 220ms ease",
                  whiteSpace: "nowrap",
                }}
              >
                {globalContent.brandName}
              </span>
            </div>

            <span
              className={`${playfair.className} hidden text-2xl font-bold tracking-wide text-[#4B2E83] lg:block`}
              style={{
                opacity: showLogo ? 0 : 1,
                transition: "opacity 220ms ease",
                whiteSpace: "nowrap",
              }}
            >
              {globalContent.brandName}
            </span>
            <Image
              src={globalContent.logoUrl}
              alt={globalContent.brandName}
              width={220}
              height={64}
              className="hidden h-12 w-auto rounded-lg object-contain sm:h-14 lg:block"
              style={{
                opacity: showLogo ? 1 : 0,
                transition: "opacity 220ms ease",
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center bg-transparent text-[#4B2E83] transition-all duration-300 hover:bg-[#D4AF37]/20 lg:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hidden min-w-0 flex-1 justify-end lg:flex">
            <ul className="flex max-w-full flex-wrap items-center justify-end gap-1.5 xl:gap-2 2xl:gap-3">
              {navLinks.map((link) => {
                const isActive = isDesktopActive(link.href);
                return (
                  <li key={link.label}>
                    {link.href === "#site-footer" || link.href === "#home-discovery" ? (
                      <Button
                        type="button"
                        onClick={link.href === "#site-footer" ? scrollToFooter : scrollToDiscovery}
                        showArrow={false}
                        compact
                        className={desktopNavButtonClassName}
                        style={desktopNavButtonStyle}
                        aria-label={link.label}
                      >
                        {link.label}
                      </Button>
                    ) : (
                      <Link href={link.href}>
                        <Button
                          compact
                          className={`border-[#4B2E83]/15 ${desktopNavButtonClassName} ${
                            isActive
                              ? "!border-[#D4AF37] !bg-[#4B2E83] !text-[#D4AF37] hover:!bg-[#4B2E83] hover:!text-[#D4AF37]"
                              : ""
                          }`}
                          style={desktopNavButtonStyle}
                          active={false}
                          showArrow={false}
                          aria-label={link.label}
                        >
                          {link.label}
                        </Button>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden">
          <div className="flex h-full w-full justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu backdrop"
              className="h-full w-[20%] border-0 bg-black/60 p-0 backdrop-blur-sm"
            />
            <aside className="flex h-full w-[80%] flex-col border-l-2 border-[#4B2E83]/10 bg-[#F3ECFF] shadow-[-12px_0_30px_rgba(18,8,32,0.22)]">
              <div className="flex items-center justify-between px-8 py-7">
                <p className={`${playfair.className} text-lg font-bold tracking-wide text-[#4B2E83]`}>
                  {globalContent.brandName}
                </p>
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  showArrow={false}
                  className="flex h-12 w-12 items-center justify-center text-lg"
                >
                  <X size={28} strokeWidth={1.8} />
                </Button>
              </div>
              <div className="border-b border-[#4B2E83]/15" />
              <nav className="min-h-0 flex flex-1 items-center justify-center overflow-y-auto px-8 pb-16 pt-12">
                <ul className="w-full max-w-[270px] space-y-5">
                  {mobileDrawerLinks.map((link) => {
                    const isActive = isDesktopActive(link.href);
                    return (
                      <li key={link.label} className="w-full">
                        {link.href === "#site-footer" || link.href === "#home-discovery" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsOpen(false);
                              setTimeout(() => {
                                if (link.href === "#site-footer") {
                                  scrollToFooter();
                                } else {
                                  scrollToDiscovery();
                                }
                              }, 100);
                            }}
                            className="mb-2 flex w-full items-center justify-center rounded-md border border-[1.5px] border-[#4B2E83]/30 bg-[#F3ECFF] px-8 py-3 text-lg font-semibold leading-none text-[#4B2E83] shadow-sm transition-colors duration-200 active:bg-[#4B2E83] active:text-[#D4AF37]"
                          >
                            {link.label}
                          </button>
                        ) : (
                          <Link
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`mb-2 flex w-full items-center justify-center rounded-md border border-[1.5px] px-8 py-3 text-lg font-semibold leading-none shadow-sm transition-colors duration-200 ${
                              isActive
                                ? "border-[#4B2E83] bg-[#4B2E83] text-[#D4AF37]"
                                : "border-[#4B2E83]/30 bg-[#F3ECFF] text-[#4B2E83] active:bg-[#4B2E83] active:text-[#D4AF37]"
                            }`}
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(GlobalHeader);