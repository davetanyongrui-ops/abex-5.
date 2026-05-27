"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
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
    const titleId = useId();

    useEffect(() => {
        if (!isLogoOpen) return;

        const priorOverflow = document.body.style.overflow;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsLogoOpen(false);
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", closeOnEscape);
        return () => {
            document.body.style.overflow = priorOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [isLogoOpen]);

    if (!config) return null;

    const useLarge = size === "large";
    const logoWidth = useLarge ? config.logoWidth : 32;
    const logoHeight = useLarge ? config.logoHeight : 32;
    const widthClass = useLarge ? config.widthClass : "w-8";
    const heightClass = useLarge ? config.heightClass : "h-8";
    const logoTrigger = (
        <button
            type="button"
            onClick={() => setIsLogoOpen(true)}
            className="rounded-md cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            aria-label={`Enlarge ${config.label} certificate logo`}
            aria-haspopup="dialog"
        >
            <Image
                src={config.logo}
                alt={config.label}
                width={useLarge ? logoWidth : 20}
                height={useLarge ? logoHeight : 20}
                className={`object-contain mix-blend-multiply ${useLarge ? "transition-transform group-hover/badge:scale-110" : ""}`}
            />
        </button>
    );

    const logoDialog = isLogoOpen ? createPortal((
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
        >
            <button
                type="button"
                className="absolute inset-0 cursor-zoom-out"
                onClick={() => setIsLogoOpen(false)}
                aria-label="Close enlarged certificate logo"
            />
            <div className="relative z-10 flex w-full max-w-3xl flex-col items-center rounded-2xl bg-white p-6 shadow-2xl sm:p-10">
                <button
                    type="button"
                    onClick={() => setIsLogoOpen(false)}
                    className="absolute right-4 top-4 rounded-md px-3 py-2 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                    Close
                </button>
                <h2 id={titleId} className="mb-6 pr-16 text-center text-lg font-bold text-slate-900">
                    {config.label}
                </h2>
                <div className="flex min-h-56 w-full items-center justify-center rounded-xl bg-slate-50 p-8 sm:min-h-80">
                    <Image
                        src={config.logo}
                        alt={`${config.label} certificate logo enlarged`}
                        width={1000}
                        height={700}
                        className="max-h-[65vh] max-w-full object-contain mix-blend-multiply"
                    />
                </div>
            </div>
        </div>
    ), document.body) : null;

    // Render compact badge for small size (used in product pages) — full box, just smaller
    if (!useLarge) {
        return (
            <>
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-wider ${config.color} shadow-sm whitespace-nowrap bg-white/50 backdrop-blur-sm`}>
                    <div className="relative w-5 h-5 flex items-center justify-center">
                        {logoTrigger}
                    </div>
                    {config.label}
                </div>
                {logoDialog}
            </>
        );
    }

    return (
        <>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${config.color} shadow-sm whitespace-nowrap bg-white/50 backdrop-blur-sm group/badge transition-all hover:bg-white`}>
                <div className={`relative ${widthClass} ${heightClass} flex items-center justify-center`}>
                    {logoTrigger}
                </div>
                {config.label}
            </div>
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
