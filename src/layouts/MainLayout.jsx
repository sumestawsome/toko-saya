import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
            <Navbar />

            {/* Main Container dilebarkan mengikuti Navbar */}
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-8">
                <Outlet />
            </main>

            <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2026 TokoSaya. Dikembangkan dengan React & Tailwind CSS.</p>
                    <div className="flex gap-4">
                        <span className="hover:text-indigo-600 cursor-pointer">Privasi</span>
                        <span className="hover:text-indigo-600 cursor-pointer">Syarat & Ketentuan</span>
                        <span className="hover:text-indigo-600 cursor-pointer">Bantuan</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}