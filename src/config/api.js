/**
 * Konfigurasi Base URL API TokoSaya
 * Default ke backend Laravel lokal http://127.0.0.1:8000 untuk pengujian tugas praktikum,
 * atau override melalui environment variable VITE_API_URL.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/**
 * Normalisasi URL gambar dari backend Laravel:
 * - Menangani URL localhost/127.0.0.1:8000
 * - Menangani path relatif seperti /storage/products/...
 * - Memberikan placeholder jika URL kosong/null
 */
export function formatImageUrl(url) {
  if (!url || typeof url !== "string") {
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80";
  }

  const trimmed = url.trim();

  // Tangani path relatif storage publik Laravel
  if (trimmed.startsWith("/storage/")) {
    return `${API_BASE_URL}${trimmed}`;
  }

  if (trimmed.startsWith("storage/")) {
    return `${API_BASE_URL}/${trimmed}`;
  }

  return trimmed;
}
