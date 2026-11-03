import React from "react";
import BrandLogo from "./BrandLogo";

/**
 * BrandLoader
 * Komponen indikator pemuatan resmi TokoSaya menggunakan logo resmi keranjang SVG TokoSaya.
 * Animasi: Denyut halus (pulse) kontinu dengan sudut kotak tegas khas TokoSaya (rounded-none).
 */
export default function BrandLoader({
  text = "",
  size = "md", // "xs" | "sm" | "md" | "lg" atau number
  variant,
  inverted = false,
  className = "",
}) {
  const sizeMap = {
    xs: 20,
    sm: 32,
    md: 44,
    lg: 56,
  };

  const pixelSize = typeof size === "number" ? size : (sizeMap[size] || 44);
  const logoVariant = variant || (inverted ? "white" : "indigo");

  return (
    <div
      className={`inline-flex flex-col items-center justify-center font-['Canva_Sans',sans-serif] ${className}`}
      role="status"
      aria-label={text || "Memuat..."}
    >
      {/* Logo Keranjang Resmi TokoSaya dengan Animasi Denyut Halus */}
      <div className="animate-pulse flex items-center justify-center">
        <BrandLogo
          variant={logoVariant}
          size={pixelSize}
          className="shadow-sm border border-slate-200"
        />
      </div>

      {/* Teks Penjelas Opsional di Bawah Logo */}
      {text && (
        <p className="text-xs text-slate-500 font-medium mt-3 tracking-tight text-center">
          {text}
        </p>
      )}
    </div>
  );
}
