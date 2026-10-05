import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Inisialisasi state user dari localStorage
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("toko_user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    // Fungsi login dengan validasi kredensial administrator
    const login = (email, password) => {
        const cleanEmail = (email || "").trim().toLowerCase();
        const cleanPassword = (password || "").trim();

        if (cleanEmail === "admin@gmail.com" && cleanPassword === "admin12345") {
            const userData = {
                email: "admin@gmail.com",
                role: "admin",
                name: "Administrator",
            };
            setUser(userData);
            try {
                localStorage.setItem("toko_user", JSON.stringify(userData));
            } catch (error) {
                console.error("Gagal menyimpan sesi user ke localStorage:", error);
            }
            return { success: true, user: userData };
        }

        return {
            success: false,
            message: "Email atau password yang Anda masukkan salah.",
        };
    };

    // Fungsi logout untuk menghapus sesi pengguna
    const logout = () => {
        try {
            localStorage.removeItem("toko_user");
        } catch (error) {
            console.error("Gagal menghapus sesi user dari localStorage:", error);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook helper untuk mempermudah konsumsi context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
