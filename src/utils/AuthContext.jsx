import { createContext, useContext, useState } from "react";
import { API_BASE_URL } from "../config/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Membaca status login yang tersimpan di browser
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("toko_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Fungsi Login yang langsung bertanya ke server Laravel
  const login = async (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = (password || "").trim();

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      const data = await res.json();

      // Jika email & password cocok di database Laravel
      if (res.ok && data.token) {
        const userData = {
          email: cleanEmail,
          role: "admin",
          name: data.user?.name || "Administrator",
          token: data.token, // Menyimpan tiket token Sanctum
        };

        setUser(userData);
        localStorage.setItem("toko_user", JSON.stringify(userData));
        return { success: true, user: userData };
      }

      // Jika server menolak (misal password salah)
      return {
        success: false,
        message:
          data.message || "Email atau kata sandi tidak cocok di database.",
      };
    } catch (error) {
      console.error("Gagal terhubung ke server login:", error);

      // Jalur darurat lokal (jika sewaktu-waktu server Laravel belum dinyalakan)
      if (cleanEmail === "admin@gmail.com" && cleanPassword === "admin12345") {
        const fallbackUser = {
          email: "admin@gmail.com",
          role: "admin",
          name: "Administrator (Mode Offline)",
        };
        setUser(fallbackUser);
        localStorage.setItem("toko_user", JSON.stringify(fallbackUser));
        return { success: true, user: fallbackUser };
      }

      return {
        success: false,
        message:
          `Tidak dapat menghubungi server API (${API_BASE_URL}). Pastikan server backend sedang aktif.`,
      };
    }
  };

  // Fungsi Logout
  const logout = async () => {
    // Hapus token di backend jika ada koneksi
    if (user?.token) {
      try {
        await fetch(`${API_BASE_URL}/api/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            Accept: "application/json",
          },
        });
      } catch (err) {
        console.error("Gagal logout di server:", err);
      }
    }

    try {
      localStorage.removeItem("toko_user");
    } catch (error) {
      console.error("Gagal menghapus sesi login:", error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
