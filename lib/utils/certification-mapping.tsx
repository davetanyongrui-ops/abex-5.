"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FaCertificate, FaShieldAlt, FaLeaf, FaCheckCircle } from "react-icons/fa";
import type { IconType } from "react-icons";

export const CERTIFICATION_MAP: Record<string, { label: string; icon: IconType; color: string; logo: string; priority: number; logoWidth: number; logoHeight: number; widthClass: string; heightClass: string }> = {
    "ISO 9001": {
        label: "ISO 9001",
        icon: FaCertificate,
        color: "text-blue-600 bg-blue-50 border-blue-100",
        logo: "/assets/certs/iso logo 9001 new 3.png",
        priority: 1,
        logoWidth: 91,
        logoHeight: 32,
        widthClass: "w-[91px]",
        heightClass: "h-8"
    },
    "Singapore Green Building Council": {
        label: "SGBC",
        icon: FaLeaf,
        color: "text-green-600 bg-green-50 border-green-100",
        logo: "/images/cert-sgbc.png",
        priority: 2,
        logoWidth: 32,
        logoHeight: 32,
        widthClass: "w-8",
        heightClass: "h-8"
    },
    "Setsco": {
        label: "Setsco",
        icon: FaShieldAlt,
        color: "text-slate-600 bg-slate-50 border-slate-200",
        logo: "/images/cert-setsco.png",
        priority: 3,
        logoWidth: 32,
        logoHeight: 32,
        widthClass: "w-8",
        heightClass: "h-8"
    },
    "bizSAFE Level 3": {
        label: "bizSAFE 3",
        icon: FaCheckCircle,
        color: "text-orange-600 bg-orange-50 border-orange-100",
        logo: "/images/bizsafe3_logo.png",
        priority: 4,
        logoWidth: 58,
        logoHeight: 32,
        widthClass: "w-[58px]",
        heightClass: "h-8"
    }
};

export function CertificationBadge({ cert, size = "large" }: { cert: string; size?: "small" | "large" }) {
    const config = CERTIFICATION_MAP[cert];
    const [isLogoOpen, setIsLogoOpen] = useState(false);
    const [hasOpenedLogo, setHasOpenedLogo] = useState(false);
    const titleId = useId();

    useEffect(() => {
        if (!isLogoOpen) return;

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsLogoOpen(false);
        };

        window.addEventListener("keydown", closeOnEscape);
        return () => {
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [isLogoOpen]);

    if (!config) return null;

    const useLarge = size === "large";
    const logoWidth = useLarge ? config.logoWidth : 32;
    const logoHeight = useLarge ? config.logoHeight : 32;
    const widthClass = useLarge ? config.widthClass : "w-8";
    const heightClass = useLarge ? config.heightClass : "h-8";
    const needsWhiteBackground = config.label === "Setsco";
    const openLogo = () => {
        setHasOpenedLogo(true);
        setIsLogoOpen(true);
    };
    const logoImage = (
        <span className={needsWhiteBackground ? "inline-flex rounded bg-white p-0.5" : undefined}>
            <Image
                src={config.logo}
                alt={config.label}
                width={useLarge ? logoWidth : 20}
                height={useLarge ? logoHeight : 20}
                className={`object-contain mix-blend-multiply ${useLarge ? "transition-transform group-hover/badge:scale-110" : ""}`}
            />
        </span>
    );

    const logoDialog = hasOpenedLogo ? createPortal((
        <AnimatePresence>
            {isLogoOpen ? (
                <div className="fixed left-1/2 top-1/2 z-[100] -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        className="relative"
                        role="dialog"
                        aria-labelledby={titleId}
                        initial={{ opacity: 0, scale: 0.88, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88, y: 8 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                    >
                        <h2 id={titleId} className="sr-only">{config.label}</h2>
                        <button
                            type="button"
                            onClick={() => setIsLogoOpen(false)}
                            className="absolute -right-8 -top-8 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xl font-light leading-none text-slate-700 shadow-md transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                            aria-label="Close enlarged certificate logo"
                        >
                            &times;
                        </button>
                        <span className={`inline-flex overflow-hidden rounded-md shadow-[0_10px_25px_rgba(15,23,42,0.3)] ${needsWhiteBackground ? "bg-white p-2.5" : ""}`}>
                            <Image
                                src={config.logo}
                                alt={`${config.label} certificate logo enlarged`}
                                width={needsWhiteBackground ? 120 : 300}
                                height={needsWhiteBackground ? 120 : 210}
                                className={needsWhiteBackground
                                    ? "max-h-[min(22vh,112px)] max-w-[min(38vw,120px)] object-contain"
                                    : "max-h-[min(22vh,112px)] max-w-[min(52vw,300px)] object-contain"}
                            />
                        </span>
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>
    ), document.body) : null;

    // Render compact badge for small size (used in product pages) — full box, just smaller
    if (!useLarge) {
        return (
            <>
                <button
                    type="button"
                    onClick={openLogo}
                    className={`inline-flex cursor-zoom-in items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-wider ${config.color} shadow-sm whitespace-nowrap bg-white/50 backdrop-blur-sm transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`}
                    aria-label={`View enlarged ${config.label} certificate logo`}
                    aria-haspopup="dialog"
                >
                    <div className="relative w-5 h-5 flex items-center justify-center">
                        {logoImage}
                    </div>
                    {config.label}
                </button>
                {logoDialog}
            </>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={openLogo}
                className={`inline-flex cursor-zoom-in items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${config.color} shadow-sm whitespace-nowrap bg-white/50 backdrop-blur-sm group/badge transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`}
                aria-label={`View enlarged ${config.label} certificate logo`}
                aria-haspopup="dialog"
            >
                <div className={`relative ${widthClass} ${heightClass} flex items-center justify-center`}>
                    {logoImage}
                </div>
                {config.label}
            </button>
            {logoDialog}
        </>
    );
}

export function CertificationsList({ certifications, badgeSize }: { certifications?: string[]; badgeSize?: "small" | "large" }) {
    if (!certifications || certifications.length === 0) return null;

    const sortedCerts = [...certifications].sort((a, b) => {
        const priorityA = CERTIFICATION_MAP[a]?.priority || 99;
        const priorityB = CERTIFICATION_MAP[b]?.priority || 99;
        return priorityA - priorityB;
    });

    return (
        <div className="flex flex-wrap gap-3">
            {sortedCerts.map((cert) => (
                <CertificationBadge key={cert} cert={cert} size={badgeSize ?? "large"} />
            ))}
        </div>
    );
}
