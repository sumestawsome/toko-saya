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

  // Fungsi Login yang langsung menembak API backend Laravel Sanctum
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

      // Jika berhasil login dan server mengembalikan token Sanctum
      if (res.ok && data.token) {
        const userData = {
          id: data.user?.id || 1,
          email: cleanEmail,
          role: "admin",
          name: data.user?.name || "Administrator",
          token: data.token,
        };

        setUser(userData);
        // Simpan token langsung ke localStorage sesuai standar API Client
        localStorage.setItem("token", data.token);
        localStorage.setItem("toko_user", JSON.stringify(userData));

        return { success: true, user: userData, token: data.token };
      }

      // Jika server mengembalikan pesan error (422 / 401)
      return {
        success: false,
        message:
          data.message ||
          data.errors?.email?.[0] ||
          "Email atau kata sandi tidak cocok di database.",
      };
    } catch (error) {
      console.error("Gagal terhubung ke server login:", error);

      return {
        success: false,
        message: `Tidak dapat menghubungi server API (${API_BASE_URL}). Pastikan server backend Laravel sedang aktif.`,
      };
    }
  };

  // Fungsi Logout
  const logout = async () => {
    const activeToken = localStorage.getItem("token") || user?.token;

    // Panggil endpoint logout backend jika token tersedia
    if (activeToken) {
      try {
        await fetch(`${API_BASE_URL}/api/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${activeToken}`,
            Accept: "application/json",
          },
        });
      } catch (err) {
        console.error("Gagal logout di server:", err);
      }
    }

    // Bersihkan seluruh data sesi lokal
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("toko_user");
      localStorage.removeItem("toko_auth_user");
    } catch (error) {
      console.error("Gagal menghapus sesi login:", error);
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
