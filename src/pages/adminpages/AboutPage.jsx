import { Link } from "react-router-dom";

export default function AboutPage() {
    return (
        <div className="space-y-6">
            {/* Header Halaman */}
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Tentang Aplikasi & Pengembang
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Informasi arsitektur modul, spesifikasi sistem, dan identitas proyek TokoSaya.
                </p>
            </div>

            {/* Kotak Putih Tegas Rincian Proyek */}
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-none shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center rounded-none font-black text-lg">
                        i
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Rincian Modul & Proyek
                        </h2>
                        <span className="text-xs text-slate-400">
                            Dokumentasi Arsitektur Bab II Praktikum Teknologi Web
                        </span>
                    </div>
                </div>

                {/* Tabel Informasi Proyek */}
                <div className="border border-slate-200 divide-y divide-slate-200 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-slate-50/50">
                        <span className="font-bold text-slate-700">Nama Aplikasi</span>
                        <span className="sm:col-span-2 text-slate-900 font-semibold">
                            TokoSaya E-Commerce
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                        <span className="font-bold text-slate-700">Modul Pembelajaran</span>
                        <span className="sm:col-span-2 text-slate-800">
                            Bab II Frontend Programming (React & Tailwind CSS)
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-slate-50/50">
                        <span className="font-bold text-slate-700">Desain Sistem</span>
                        <span className="sm:col-span-2 text-slate-800">
                            Neo-Minimalist Sharp Edges (No-Rounded), Canva Sans Typography
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                        <span className="font-bold text-slate-700">Arsitektur Tata Letak</span>
                        <span className="sm:col-span-2 text-slate-800">
                            Dual-Layout System: <code className="bg-slate-100 px-1.5 py-0.5 border border-slate-300 text-xs font-mono">MainLayout</code> (Frontpage) & <code className="bg-slate-100 px-1.5 py-0.5 border border-slate-300 text-xs font-mono">AdminLayout</code> (Backpage dengan Sidebar)
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-slate-50/50">
                        <span className="font-bold text-slate-700">Pengelolaan State</span>
                        <span className="sm:col-span-2 text-slate-800">
                            React Context API (<code className="bg-slate-100 px-1.5 py-0.5 border border-slate-300 text-xs font-mono">CartContext</code>) dengan persistensi sinkron
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-4">
                        <span className="font-bold text-slate-700">Versi Rilis</span>
                        <span className="sm:col-span-2 text-slate-800 font-mono text-xs font-semibold">
                            v1.0.0-bab2-release
                        </span>
                    </div>
                </div>

                {/* Tombol Aksi Navigasi */}
                <div className="pt-4 flex flex-wrap gap-3">
                    <Link
                        to="/admin/dashboard"
                        className="inline-flex items-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-none text-xs transition shadow-sm cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        <span>Kembali ke Dashboard Admin</span>
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-2.5 rounded-none text-xs border border-slate-300 transition cursor-pointer"
                    >
                        <span>Lihat Toko Publik</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
