/**
 * BrandLoader
 * Komponen pemuatan (loading) resmi TokoSaya bertema Neo-Minimalist Sharp Edges.
 * Desain: Kotak tegas tanpa lengkungan (rounded-none), berlatar solid Indigo TokoSaya (#4F46E5),
 * dengan huruf "T" tebal berwarna putih di tengahnya (identik dengan logo di Navbar).
 * Animasi: Denyut lembut (soft breathing / pulse) kontinu tanpa rotasi pada porosnya.
 */
export default function BrandLoader({
  text = "",
  size = "md", // "xs" | "sm" | "md" | "lg"
  inverted = false,
  className = "",
}) {
  const sizeClasses = {
    xs: "w-4 h-4 text-[10px]",
    sm: "w-8 h-8 text-base",
    md: "w-12 h-12 text-2xl",
    lg: "w-16 h-16 text-3xl",
  };

  const boxSize = sizeClasses[size] || sizeClasses.md;

  const colorClasses = inverted
    ? "bg-white text-[#4F46E5] shadow-xs"
    : "bg-[#4F46E5] text-white shadow-sm";

  return (
    <div
      className={`inline-flex flex-col items-center justify-center font-['Canva_Sans',sans-serif] ${className}`}
      role="status"
      aria-label={text || "Memuat..."}
    >
      <style>
        {`
          @keyframes brandSoftPulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.35;
            }
          }
          .animate-brand-pulse {
            animation: brandSoftPulse 1.6s ease-in-out infinite;
          }
        `}
      </style>

      {/* Kotak Logo Tegas Neo-Minimalist (Denyut Lembut Tanpa Rotasi) */}
      <div
        className={`${boxSize} ${colorClasses} rounded-none font-black flex items-center justify-center select-none shrink-0 animate-brand-pulse tracking-tighter`}
      >
        T
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
