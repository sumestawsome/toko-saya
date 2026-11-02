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
 * Normalisasi URL gambar dari backend Laravel:
 * - Menangani URL localhost/127.0.0.1:8000 dan mengalihkan ke domain API aktif
 * - Menangani path relatif seperti /storage/products/...
 * - Memberikan placeholder jika URL kosong/null
 */
export function formatImageUrl(url) {
  if (!url || typeof url !== "string") {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80";
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
