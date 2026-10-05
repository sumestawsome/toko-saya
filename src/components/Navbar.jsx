import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";
import { useAuth } from "../utils/AuthContext";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { totalQty } = useCart();
    const { user } = useAuth();
    const isLoggedIn = !!user;

    // State & Ref untuk Notifikasi Penambahan Keranjang Dinamis (Mobile)
    const [addedCount, setAddedCount] = useState(0);
    const prevQtyRef = useRef(totalQty);
    const isInitialMount = useRef(true);
    const timerRef = useRef(null);

    // Logika Akumulasi & Timer 3 Detik saat terjadi penambahan keranjang
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevQtyRef.current = totalQty;
            return;
        }

        const diff = totalQty - prevQtyRef.current;
        prevQtyRef.current = totalQty;

        if (diff > 0) {
            setAddedCount((prev) => prev + diff);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
                setAddedCount(0);
            }, 3000);
        }
    }, [totalQty]);

    // Cleanup timer pada saat unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="bg-[#4F46E5] text-white shadow-md sticky top-0 z-50">
            {/* Container dilebarkan ke 1400px dan padding kiri-kanan dirapatkan */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-16 flex justify-between items-center relative">

                {/* Brand */}
                <Link
                    to="/"
                    onClick={closeMobileMenu}
                    className="text-xl font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-95 transition"
                >
                    <span className="bg-white text-[#4F46E5] w-8 h-8 rounded-none flex items-center justify-center font-black text-base shadow-sm">
                        T
                    </span>
                    <span>TokoSaya</span>
                </Link>

                {/* Menu Navigasi Desktop (md: ke atas) */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link to="/" className="text-indigo-100 hover:text-white transition">Dashboard</Link>
                    <Link to="/cart" className="relative text-indigo-100 hover:text-white transition flex items-center">
                        <span>Keranjang</span>
                        {totalQty > 0 && (
                            <span className="ml-1.5 bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-none shadow-sm">
                                {totalQty}
                            </span>
                        )}
                    </Link>
                    <Link to="/checkout" className="text-indigo-100 hover:text-white transition">Checkout</Link>

                    <div className="h-4 w-[1px] bg-indigo-400/50"></div>

                    {isLoggedIn ? (
                        <Link to="/logout" className="bg-indigo-700 hover:bg-indigo-800 text-white px-3.5 py-1.5 rounded-none text-xs font-semibold transition">
                            Keluar
                        </Link>
                    ) : (
                        <Link to="/login" className="bg-white text-[#4F46E5] hover:bg-indigo-50 px-3.5 py-1.5 rounded-none text-xs font-semibold transition shadow-sm">
                            Masuk
                        </Link>
                    )}
                </div>

                {/* Area Mobile: Popup Notifikasi Penambahan & Tombol Hamburger (bawah md) */}
                <div className="flex md:hidden items-center gap-2">
                    {/* Kotak Notifikasi Penambahan Barang Dinamis (+1, +2, dst.) */}
                    {addedCount > 0 && (
                        <Link
                            to="/cart"
                            onClick={closeMobileMenu}
                            className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-none shadow-md border border-rose-400/40 flex items-center justify-center animate-in fade-in zoom-in-75 duration-150 active:scale-95 transition"
                            title="Buka Keranjang"
                        >
                            +{addedCount}
                        </Link>
                    )}

                    {/* Tombol Hamburger Mobile */}
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle Navigation Menu"
                        className="p-2 text-white hover:bg-indigo-600 rounded-none transition focus:outline-none cursor-pointer"
                    >
                        {isMobileMenuOpen ? (
                            /* Ikon Tutup / Silang (X) */
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            /* Ikon Hamburger 3 Garis Tegas */
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

            </div>

            {/* Menu Mobile Floating Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-[#4F46E5] z-50 shadow-2xl border-t border-indigo-400/30 p-6 flex flex-col gap-4">
                    <Link
                        to="/"
                        onClick={closeMobileMenu}
                        className="text-white hover:text-indigo-200 text-base font-medium py-1 transition border-b border-indigo-400/20"
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/cart"
                        onClick={closeMobileMenu}
                        className="text-white hover:text-indigo-200 text-base font-medium py-1 transition flex items-center justify-between border-b border-indigo-400/20"
                    >
                        <span>Keranjang</span>
                        {totalQty > 0 && (
                            <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-none shadow-sm">
                                {totalQty} barang
                            </span>
                        )}
                    </Link>
                    <Link
                        to="/checkout"
                        onClick={closeMobileMenu}
                        className="text-white hover:text-indigo-200 text-base font-medium py-1 transition border-b border-indigo-400/20"
                    >
                        Checkout
                    </Link>

                    <div className="pt-2">
                        {isLoggedIn ? (
                            <Link
                                to="/logout"
                                onClick={closeMobileMenu}
                                className="block text-center bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2.5 rounded-none text-sm font-semibold transition"
                            >
                                Keluar
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                onClick={closeMobileMenu}
                                className="block text-center bg-white text-[#4F46E5] hover:bg-indigo-50 px-4 py-2.5 rounded-none text-sm font-semibold transition shadow-sm"
                            >
                                Masuk
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}