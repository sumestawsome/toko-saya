import React from "react";
import logoIndigo from "../assets/logo-toko-saya.svg";
import logoWhite from "../assets/logo-toko-saya-putih.svg";
import logoFull from "../assets/logo-per-website.svg";

/**
 * BrandLogo
 * Komponen logo terpusat resmi TokoSaya bertema Flat Neo-Minimalist Sharp Edges (rounded-none).
 *
 * Props:
 * - variant: 'indigo' (default, ikon keranjang latar putih/indigo)
 *            | 'white' (ikon keranjang latar ungu indigo)
 *            | 'full' (logo lengkap keranjang + teks TokoSaya)
 * - size: ukuran tinggi/lebar dalam piksel (number atau string, misal 24, 32, 40)
 * - className: kelas Tailwind tambahan
 * - alt: teks alternatif aksesibilitas
 */
export default function BrandLogo({
  variant = "indigo",
  size = 32,
  className = "",
  alt = "TokoSaya Logo",
}) {
  let logoSrc = logoIndigo;
  if (variant === "white") {
    logoSrc = logoWhite;
  } else if (variant === "full") {
    logoSrc = logoFull;
  }

  // Jika varian "full", rasio aspeknya lebar horizontal (~4.4:1)
  const isFull = variant === "full";
  const sizeStyle = isFull
    ? { height: `${size}px`, width: "auto" }
    : { width: `${size}px`, height: `${size}px` };

  return (
    <img
      src={logoSrc}
      alt={alt}
      style={sizeStyle}
      className={`rounded-none object-contain select-none shrink-0 ${className}`}
    />
  );
}
