import Image from "next/image";
import { FaCertificate, FaShieldAlt, FaLeaf, FaCheckCircle } from "react-icons/fa";
export const CERTIFICATION_MAP: Record<string, { label: string; icon: any; color: string; logo: string; priority: number; logoWidth: number; logoHeight: number; widthClass: string; heightClass: string }> = {
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
    if (!config) return null;
    const useLarge = size === "large";
    const logoWidth = useLarge ? config.logoWidth : 32;
    const logoHeight = useLarge ? config.logoHeight : 32;
    const widthClass = useLarge ? config.widthClass : "w-8";
    const heightClass = useLarge ? config.heightClass : "h-8";
    // Render compact badge for small size (used in product pages) — full box, just smaller
    if (!useLarge) {
        return (
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-wider ${config.color} shadow-sm whitespace-nowrap bg-white/50 backdrop-blur-sm`}>
                <div className="relative w-5 h-5 flex items-center justify-center">
                    <Image
                        src={config.logo}
                        alt={config.label}
                        width={20}
                        height={20}
                        className="object-contain mix-blend-multiply"
                    />
                </div>
                {config.label}
            </div>
        );
    }
    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${config.color} shadow-sm whitespace-nowrap bg-white/50 backdrop-blur-sm group/badge transition-all hover:bg-white`}>
            <div className={`relative ${widthClass} ${heightClass} flex items-center justify-center`}>
                <Image
                    src={config.logo}
                    alt={config.label}
                    width={logoWidth}
                    height={logoHeight}
                    className="object-contain mix-blend-multiply transition-transform group-hover/badge:scale-110"
                />
            </div>
            {config.label}
        </div>
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
