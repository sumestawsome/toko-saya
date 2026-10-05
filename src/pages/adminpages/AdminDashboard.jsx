import { Link } from "react-router-dom";

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            {/* Header Halaman */}
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Dashboard Manajemen Toko
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Ringkasan performa katalog produk, transaksi pesanan, dan status operasional sistem TokoSaya.
                </p>
            </div>

            {/* Baris Kartu Metrik Ringkasan (Grid 3 Kolom Kotak Tegas) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Kartu 1: Total Produk */}
                <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Total Produk Katalog
                            </span>
                            <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center rounded-none">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-3">
                            16 Produk
                        </div>
                    </div>
                    {/* Badge Kategori */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                        <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-none">
                            Sepatu: 4
                        </span>
                        <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-none">
                            Aksesori: 4
                        </span>
                        <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-none">
                            Tas: 4
                        </span>
                        <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-none">
                            Pakaian: 4
                        </span>
                    </div>
                </div>

                {/* Kartu 2: Pesanan Masuk */}
                <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Pesanan Masuk
                            </span>
                            <div className="w-8 h-8 bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center rounded-none">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-3">
                            12 Transaksi Berhasil
                        </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Tingkat Penyelesaian:</span>
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-none">
                            100% Terpenuhi
                        </span>
                    </div>
                </div>

                {/* Kartu 3: Estimasi Pendapatan */}
                <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Estimasi Pendapatan
                            </span>
                            <div className="w-8 h-8 bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center rounded-none">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v.375c0 .621.504 1.125 1.125 1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900 mb-3">
                            Rp 8.450.000
                        </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Pertumbuhan Bulanan:</span>
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 border border-indigo-200 rounded-none">
                            +14.2%
                        </span>
                    </div>
                </div>
            </div>

            {/* Kotak Informasi Cepat & Status Operasional */}
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-none shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            Status Server & Lingkungan Lokal
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Informasi status konektivitas runtime dan tautan cepat ke antarmuka toko.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-xs font-semibold rounded-none">
                            <span className="w-2 h-2 bg-emerald-500 rounded-none animate-pulse"></span>
                            Server Lokal Aktif
                        </span>
                        <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1.5 text-xs font-mono rounded-none">
                            Port: 5173
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                        <p>
                            Sistem administrasi TokoSaya terhubung secara langsung dengan katalog frontpage,
                            keranjang belanja (*CartContext*), dan alur checkout pesanan.
                        </p>
                        <p className="text-xs text-slate-500">
                            Gunakan tombol di samping untuk meninjau langsung tampilan etalase produk dari sudut pandang pembeli.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-none text-xs transition shadow-sm cursor-pointer"
                        >
                            <span>Tinjau Etalase Publik</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                        <Link
                            to="/admin/about"
                            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-3 rounded-none text-xs border border-slate-300 transition cursor-pointer"
                        >
                            <span>Informasi Sistem</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
