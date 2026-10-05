import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../utils/AuthContext";

export default function AdminLayout() {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Proteksi Rute Admin (Route Guard)
    if (!user || user.role !== "admin") {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-slate-100 font-['Canva_Sans',sans-serif]">
            {/* Backdrop Mobile ketika Sidebar terbuka */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-900/40 z-40 md:hidden transition-opacity"
                    aria-hidden="true"
                />
            )}

            {/* SISI KIRI: Sidebar Navigasi Admin */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* SISI KANAN: Area Konten Fleksibel */}
            <div className="flex-1 flex flex-col min-h-screen bg-slate-100 overflow-x-hidden">
                {/* Topbar Mobile (Hanya tampil di bawah breakpoint md) */}
                <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-[#4F46E5] text-white flex items-center justify-center font-bold text-sm rounded-none">
                            A
                        </div>
                        <h1 className="font-bold text-slate-900 text-base">
                            Admin Panel
                        </h1>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-none cursor-pointer"
                        aria-label="Toggle Menu Sidebar"
                    >
                        {/* Ikon Hamburger SVG Murni */}
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-6 sm:p-8">
                    <Outlet />
                </main>

                {/* Footer Admin */}
                <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 font-medium">
                    © 2026 TokoSaya Admin Management — v1.0.0
                </footer>
            </div>
        </div>
    );
}
