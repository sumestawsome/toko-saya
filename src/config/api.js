// ============================================================================
// PILIHAN KONEKSI API BACKEND:
// 1. Mode Hosting / Production (Aktif):
//    baseURL: "https://api.sumestawsome.xyz"
// 2. Mode Komputer Lokal / Laragon (Gunakan jika sedang uji coba di laptop):
//    baseURL: "http://127.0.0.1:8000"
// ============================================================================
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.sumestawsome.xyz";

/**
 * Placeholder SVG netral elegan khas TokoSaya:
 * - Format Data URI (100% offline, instan tanpa network request)
 * - Rasio fleksibel dengan estetika sudut tegas (rounded-none)
 */
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <rect width="400" height="400" fill="#F8FAFC" />
  <rect x="2" y="2" width="396" height="396" fill="none" stroke="#E2E8F0" stroke-width="4" />
  <g fill="none" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter">
    <rect x="135" y="135" width="130" height="130" />
    <polygon points="145,245 185,190 215,225 235,200 255,245" fill="#E2E8F0" stroke="none" />
    <circle cx="175" cy="175" r="14" fill="#CBD5E1" stroke="none" />
  </g>
  <text x="200" y="305" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#64748B" text-anchor="middle" letter-spacing="1.5">TOKOSAYA</text>
</svg>`
  );

/**
 * Normalisasi URL gambar dari backend Laravel:
 * - Menangani URL localhost/127.0.0.1:8000 dan mengalihkan ke domain API aktif
 * - Menangani path relatif seperti /storage/products/...
 * - Memberikan placeholder jika URL kosong/null
 */
export function formatImageUrl(url) {
  if (!url || typeof url !== "string") {
    return PLACEHOLDER_IMAGE;
  }

  let trimmed = url.trim();

  // Jika URL gambar tersimpan dengan domain localhost / 127.0.0.1 dari database lokal,
  // alihkan ke host API yang sedang aktif (misal production hosting)
  if (
    trimmed.startsWith("http://127.0.0.1:8000") ||
    trimmed.startsWith("http://localhost:8000")
  ) {
    trimmed = trimmed.replace(
      /^https?:\/\/(127\.0\.0\.1|localhost):8000/,
      API_BASE_URL
    );
  }

  // Tangani path relatif storage publik Laravel
  if (trimmed.startsWith("/storage/")) {
    return `${API_BASE_URL}${trimmed}`;
  }

  if (trimmed.startsWith("storage/")) {
    return `${API_BASE_URL}/${trimmed}`;
  }

  return trimmed;
}
