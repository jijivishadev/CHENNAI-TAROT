"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Mail, Phone, Megaphone, X } from "lucide-react";
import { globalContent } from "@/src/content/global";
import { getPromotionalEvent } from "@/lib/firebaseServices";
import type { PromotionalEvent } from "@/types";

const SESSION_STORAGE_KEY = "mdc_promotional_event_banner";

function getEventSignature(event: PromotionalEvent): string {
	return [event.id, event.updatedAt ?? 0, event.bannerImageUrl, event.redirectLink].join("|");
}

export default function FloatingActions() {
	const [showGoToTop, setShowGoToTop] = useState(false);
	const [showContactPopup, setShowContactPopup] = useState(false);
	const [event, setEvent] = useState<PromotionalEvent | null>(null);
	const [isEventOpen, setIsEventOpen] = useState(false);
	const [eventLoading, setEventLoading] = useState(true);

	const contactInfo = useMemo(() => {
		const emails = [globalContent.email, globalContent.footerEmail].filter(Boolean);
		const phones = [globalContent.phone, globalContent.footerPhone].filter(Boolean);

		return {
			emails: Array.from(new Set(emails)),
			phones: Array.from(new Set(phones)),
		};
	}, []);

	// Load promotional event
	useEffect(() => {
		if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
			setEventLoading(false);
			return;
		}

		const loadEvent = async () => {
			try {
				const record = await getPromotionalEvent();
				if (record && record.isActive && record.bannerImageUrl && record.redirectLink) {
					setEvent(record);
				}
			} catch (error) {
				console.error("[FloatingActions] Failed to load event:", error);
			} finally {
				setEventLoading(false);
			}
		};

		loadEvent();
	}, []);

	// Handle event visibility
	useEffect(() => {
		if (!event) {
			setIsEventOpen(false);
			return;
		}

		if (typeof window === "undefined") {
			setIsEventOpen(false);
			return;
		}

		const eventSignature = getEventSignature(event);
		const minimizedSignature = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
		setIsEventOpen(minimizedSignature !== eventSignature);
	}, [event]);

	// Handle scroll for Go to Top button
	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const onScroll = () => {
			setShowGoToTop(window.scrollY > 300);
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const scrollToTop = () => {
		if (typeof window === "undefined") {
			return;
		}

		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleEventClose = () => {
		if (!event) return;
		if (typeof window === "undefined") return;
		const eventSignature = getEventSignature(event);
		window.sessionStorage.setItem(SESSION_STORAGE_KEY, eventSignature);
		setIsEventOpen(false);
	};

	const handleEventReopen = () => {
		if (!event) return;
		if (typeof window === "undefined") return;
		window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
		setIsEventOpen(true);
	};

	return (
		<>
			{/* Unified Floating Actions Stack */}
			<div
				className="fixed z-[9999] flex w-12 flex-col items-center gap-3 sm:w-14 sm:gap-4"
				style={{ right: "var(--floating-right)", bottom: "var(--floating-bottom)" }}
			>
				<AnimatePresence mode="wait">
					{/* Position 1: Go to Top Button (Top-most) */}
					{showGoToTop && (
						<motion.button
							key="go-to-top"
							type="button"
							initial={{ opacity: 0, scale: 0.9, y: 8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 8 }}
							transition={{ duration: 0.2 }}
							whileHover={{ scale: 1.06 }}
							whileTap={{ scale: 0.95 }}
							onClick={scrollToTop}
							aria-label="Go to top"
							title="Go to top"
							className="group z-[10004] flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37] shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all hover:bg-[#4B2E83] hover:shadow-[0_0_0_2px_rgba(75,46,131,0.45),0_10px_26px_rgba(0,0,0,0.4)] sm:h-14 sm:w-14"
						>
							<ArrowUp size={20} strokeWidth={3} className="h-5 w-5 text-[#4B2E83] transition-colors group-hover:text-[#D4AF37] sm:h-6 sm:w-6" />
						</motion.button>
					)}

					{/* Position 2: Announcement/Event Button */}
					{!eventLoading && event && !isEventOpen && (
						<motion.button
							key="announcement"
							type="button"
							initial={{ opacity: 0, scale: 0.88, y: 12 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.88, y: 12 }}
							transition={{ duration: 0.2 }}
							whileHover={{ scale: 1.04 }}
							whileTap={{ scale: 0.96 }}
							onClick={handleEventReopen}
							aria-label="Reopen promotional event banner"
							title="Reopen promotional event banner"
							className="group z-[10003] flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37] text-[#4B2E83] shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition-colors hover:bg-[#4B2E83] hover:text-[#D4AF37] sm:h-14 sm:w-14"
						>
							<Megaphone className="h-5 w-5 sm:h-6 sm:w-6" />
						</motion.button>
					)}
				</AnimatePresence>

				{/* Position 3: Call Button */}
				<div className="relative z-[10002] flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14">
					<AnimatePresence>
						{showContactPopup && (
							<motion.div
								initial={{ opacity: 0, scale: 0.9, x: 12, y: 12 }}
								animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
								exit={{ opacity: 0, scale: 0.9, x: 12, y: 12 }}
								transition={{ duration: 0.2 }}
								className="absolute bottom-full right-full mb-2 mr-2 w-[min(16rem,calc(100vw-2rem))] rounded-2xl border border-[#D4AF37]/50 bg-[#001F3F] px-4 py-3 text-[#F3ECFF] shadow-2xl sm:mr-3 sm:min-w-64 sm:w-auto"
							>
								{contactInfo.phones.length > 0 ? (
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#D4AF37]">Call</p>
										<div className="mt-2 space-y-2">
											{contactInfo.phones.map((phone) => (
												<a
													key={phone}
													href={`tel:${phone.replace(/\s/g, '')}`}
													className="flex items-center gap-2 text-sm text-[#F3ECFF] hover:text-[#D4AF37] transition-colors"
												>
													<Phone size={14} className="text-[#D4AF37]" />
													{phone}
												</a>
											))}
										</div>
									</div>
								) : null}

								{contactInfo.phones.length > 0 && contactInfo.emails.length > 0 ? (
									<div className="my-3 border-t border-[#D4AF37]/25" />
								) : null}

								{contactInfo.emails.length > 0 ? (
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#D4AF37]">Email</p>
										<div className="mt-2 space-y-2">
											{contactInfo.emails.map((email) => (
												<a
													key={email}
													href={`mailto:${email}`}
													className="flex items-center gap-2 break-all text-sm text-[#F3ECFF] hover:text-[#D4AF37] transition-colors"
												>
													<Mail size={14} className="text-[#D4AF37]" />
													{email}
												</a>
											))}
										</div>
									</div>
								) : null}
							</motion.div>
						)}
					</AnimatePresence>

					<motion.button
						type="button"
						whileHover={{ scale: 1.06 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setShowContactPopup((prev) => !prev)}
						aria-label="Contact details"
						title="Contact details"
						className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37] shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all hover:bg-[#4B2E83] hover:shadow-[0_0_0_2px_rgba(75,46,131,0.45),0_10px_26px_rgba(0,0,0,0.4)] sm:h-14 sm:w-14"
					>
						<Phone size={20} className="h-5 w-5 text-[#4B2E83] transition-colors group-hover:text-[#D4AF37] sm:h-6 sm:w-6" />
					</motion.button>
				</div>

				{/* Position 4: Zoho/Chat Slot (Reserved for future use) */}
				<div className="z-[10001] h-12 w-12 sm:h-14 sm:w-14" aria-hidden="true" />
			</div>

			{/* Promotional Event Modal - Triggered by announcement button */}
			<AnimatePresence mode="wait">
				{isEventOpen && event && (
					<motion.div
						key="promotional-event-modal"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.94, y: 18 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.94, y: 18 }}
							transition={{ duration: 0.22, ease: "easeOut" }}
							className="relative w-[min(94vw,58rem)] overflow-hidden rounded-[2rem] border border-[#D4AF37]/40 bg-[#1A0B2E] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
						>
							<button
								type="button"
								onClick={handleEventClose}
								aria-label="Close promotional event banner"
								className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#F3ECFF]/95 text-[#4B2E83] shadow-[0_8px_22px_rgba(0,0,0,0.2)] transition-colors hover:bg-[#D4AF37] hover:text-[#1A0B2E]"
							>
								<X className="h-5 w-5" />
							</button>

							<a
								href={event.redirectLink}
								target="_blank"
								rel="noopener noreferrer"
								className="block"
								aria-label="Open promotional event link in a new tab"
							>
								<div className="relative aspect-[16/10] w-full bg-black sm:aspect-[16/9]">
									<Image
										src={event.bannerImageUrl}
										alt="Promotional event banner"
										fill
										sizes="(max-width: 768px) 94vw, 58rem"
										className="object-cover"
									/>
								</div>
							</a>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
