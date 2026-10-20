/**
 * Konfigurasi Base URL API TokoSaya
 * Menggunakan environment variable VITE_API_URL jika tersedia,
 * atau default ke live backend hosting: http://api.sumestawsome.xyz
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://api.sumestawsome.xyz";

/**
 * Normalisasi URL gambar dari backend Laravel:
 * - Mengalihkan URL gambar lama yang tersimpan dengan localhost/127.0.0.1:8000 ke domain hosting
 * - Menangani path relatif seperti /storage/products/...
 * - Memberikan placeholder berkualitas tinggi jika URL kosong/null
 */
export function formatImageUrl(url) {
  if (!url || typeof url !== "string") {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80";
  }

  const trimmed = url.trim();

  // Arahkan domain localhost / 127.0.0.1:8000 ke API_BASE_URL hosting live
  if (
    trimmed.startsWith("http://localhost:8000") ||
    trimmed.startsWith("http://127.0.0.1:8000")
  ) {
    return trimmed
      .replace("http://localhost:8000", API_BASE_URL)
      .replace("http://127.0.0.1:8000", API_BASE_URL);
  }

  // Tangani path relatif storage publik Laravel
  if (trimmed.startsWith("/storage/")) {
    return `${API_BASE_URL}${trimmed}`;
  }

  return trimmed;
}
