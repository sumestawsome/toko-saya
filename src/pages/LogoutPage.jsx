import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function LogoutPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleConfirmLogout = () => {
        logout();
        navigate("/login");
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 font-['Canva_Sans',sans-serif]">
            <div className="rounded-none max-w-sm w-full p-8 bg-white border border-slate-200 shadow-sm text-center">
                {/* Ikon SVG Pintu Keluar / Peringatan Berlatar Merah Muda Kotak Tegas */}
                <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center rounded-none mx-auto mb-4 shadow-xs">
                    <svg
                        className="w-6 h-6 text-rose-600"
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
                </div>

                <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                    Konfirmasi Keluar Akun
                </h1>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                    Apakah Anda yakin ingin mengakhiri sesi login ini?
                </p>

                {/* Dua Tombol Kotak Tegas */}
                <div className="space-y-2.5">
                    <button
                        type="button"
                        onClick={handleConfirmLogout}
                        className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white py-2.5 rounded-none font-semibold w-full cursor-pointer transition shadow-sm text-sm"
                    >
                        Keluar Sekarang
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="border border-slate-300 text-slate-700 hover:bg-slate-50 py-2.5 rounded-none font-semibold w-full cursor-pointer transition text-sm"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}
