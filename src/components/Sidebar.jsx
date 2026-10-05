import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();

    // Cek status aktif untuk tautan navigasi
    const isDashboardActive =
        location.pathname === "/admin" ||
        location.pathname === "/admin/" ||
        location.pathname === "/admin/dashboard";
    const isAboutActive = location.pathname === "/admin/about";

    const handleLinkClick = () => {
        if (setSidebarOpen) {
            setSidebarOpen(false);
        }
    };

    return (
        <aside
            className={`${
                sidebarOpen
                    ? "fixed inset-y-0 left-0 z-50 block w-64 bg-white shadow-2xl"
                    : "hidden"
            } md:flex md:w-64 md:min-h-screen md:static bg-white border-r border-slate-200 flex-col justify-between shrink-0 rounded-none`}
        >
            {/* Bagian Atas Sidebar */}
            <div>
                {/* Brand Header */}
                <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#4F46E5] text-white flex items-center justify-center font-black text-lg rounded-none shadow-sm">
                            A
                        </div>
                        <div>
                            <span className="text-base font-bold text-slate-900 tracking-tight block">
                                TokoSaya Admin
                            </span>
                            <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                                Management Panel
                            </span>
                        </div>
                    </div>

                    {/* Tombol Tutup Sidebar di Layar Mobile */}
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-none cursor-pointer"
                        aria-label="Tutup Sidebar"
                    >
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Navigasi Vertikal */}
                <nav className="p-3 space-y-1">
                    {/* Tautan Dashboard */}
                    <Link
                        to="/admin/dashboard"
                        onClick={handleLinkClick}
                        className={`flex items-center gap-3 px-3.5 py-2.5 text-sm transition rounded-none ${
                            isDashboardActive
                                ? "bg-indigo-50 text-[#4F46E5] font-semibold border-l-4 border-[#4F46E5]"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
                        }`}
                    >
                        <svg
                            className="w-5 h-5 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                            />
                        </svg>
                        <span>Dashboard</span>
                    </Link>

                    {/* Tautan Tentang Sistem */}
                    <Link
                        to="/admin/about"
                        onClick={handleLinkClick}
                        className={`flex items-center gap-3 px-3.5 py-2.5 text-sm transition rounded-none ${
                            isAboutActive
                                ? "bg-indigo-50 text-[#4F46E5] font-semibold border-l-4 border-[#4F46E5]"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
                        }`}
                    >
                        <svg
                            className="w-5 h-5 shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                            />
                        </svg>
                        <span>Tentang Sistem</span>
                    </Link>
                </nav>
            </div>

            {/* Bagian Bawah Sidebar */}
            <div className="p-4 border-t border-slate-200">
                <Link
                    to="/"
                    onClick={handleLinkClick}
                    className="flex items-center justify-center gap-2.5 w-full bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-[#4F46E5] border border-slate-300 px-4 py-2.5 text-xs font-bold transition rounded-none shadow-sm cursor-pointer"
                >
                    <svg
                        className="w-4 h-4 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                        />
                    </svg>
                    <span>Kembali ke Toko Publik</span>
                </Link>
            </div>
        </aside>
    );
}
