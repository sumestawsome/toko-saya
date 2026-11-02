import axios from "axios";

// ============================================================================
// PILIHAN KONEKSI API BACKEND:
// 1. Mode Hosting / Production (Aktif):
//    baseURL: "https://api.sumestawsome.xyz/api"
// 2. Mode Komputer Lokal / Laragon (Gunakan jika sedang uji coba di laptop):
//    baseURL: "http://127.0.0.1:8000/api"
// ============================================================================
const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "https://api.sumestawsome.xyz/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Selalu membaca token terbaru secara dinamis dari localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
