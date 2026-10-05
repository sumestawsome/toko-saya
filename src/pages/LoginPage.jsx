import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Jika sudah login sebagai admin, redirect langsung ke dashboard admin
    if (user && user.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg("");

        const result = login(email, password);
        if (result.success) {
            navigate("/admin/dashboard");
        } else {
            setErrorMsg(result.message || "Email atau password yang Anda masukkan salah.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-12 font-['Canva_Sans',sans-serif]">
            <div className="max-w-sm w-full mx-auto p-8 bg-white border border-slate-200 shadow-sm rounded-none">
                {/* Header Logo & Judul */}
                <div className="text-center mb-6">
                    <div className="w-10 h-10 bg-[#4F46E5] text-white flex items-center justify-center font-black text-xl rounded-none mx-auto mb-3 shadow-xs">
                        A
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Masuk Akun
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Gunakan akun administrator untuk mengakses panel kelola
                    </p>
                </div>

                {/* Banner Error jika kredensial salah */}
                {errorMsg && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-none mb-4 flex items-center gap-2">
                        <svg
                            className="w-4 h-4 shrink-0 text-rose-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                        </svg>
                        <span>{errorMsg}</span>
                    </div>
                )}

                {/* Form Login */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Email Administrator
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@gmail.com"
                            className="w-full bg-white border border-slate-300 rounded-none px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white border border-slate-300 rounded-none px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 transition rounded-none cursor-pointer"
                                aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                            >
                                {showPassword ? (
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-[#4F46E5] text-white py-2.5 rounded-none font-semibold w-full hover:bg-indigo-700 active:bg-indigo-800 transition cursor-pointer text-sm shadow-sm mt-2"
                    >
                        Masuk ke Sistem
                    </button>
                </form>

                {/* Keterangan Bantuan Kredensial Demo */}
                <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-none text-[11px] text-slate-500 leading-relaxed text-center">
                    <p className="font-semibold text-slate-700 mb-0.5">Kredensial Demo:</p>
                    <p className="font-mono text-slate-600">
                        Email: <strong className="text-slate-800">admin@gmail.com</strong>
                    </p>
                    <p className="font-mono text-slate-600">
                        Sandi: <strong className="text-slate-800">admin12345</strong>
                    </p>
                </div>

                {/* Tautan Kembali ke Beranda */}
                <div className="mt-4 text-center">
                    <Link
                        to="/"
                        className="text-xs text-slate-500 hover:text-indigo-600 font-medium transition inline-flex items-center gap-1"
                    >
                        <span>← Kembali ke Beranda</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
