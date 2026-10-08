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
                    <p className="flex items-center gap-1 flex-wrap justify-center sm:justify-end">
                        <span>Dibuat dengan ❤️ oleh</span>
                        <a
                            href="https://sumestawsome.pages.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-slate-700 hover:text-indigo-600 underline underline-offset-2 transition-colors ml-0.5"
                        >
                            Sumesta
                        </a>
                        <span className="text-slate-400 mx-1">•</span>
                        <a
                            href="https://sumestawsome.pages.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-indigo-600 underline underline-offset-2 transition-colors"
                        >
                            sumestawsome.pages.dev
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}