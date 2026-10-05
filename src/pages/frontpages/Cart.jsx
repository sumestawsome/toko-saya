import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../utils/CartContext";

export default function Cart() {
    const { cart, removeFromCart, updateQty, clearCart, totalQty, totalPrice } = useCart();

    // State Modal Konfirmasi Hapus
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: null, // 'single' | 'clear_all'
        item: null,
    });

    // Helper untuk memformat angka ke mata uang Rupiah
    const formatRupiah = (amount) => {
        return "Rp" + (amount || 0).toLocaleString("id-ID");
    };

    // Handler menutup modal
    const handleCloseModal = () => {
        setConfirmModal({ isOpen: false, type: null, item: null });
    };

    // Handler konfirmasi eksekusi hapus
    const handleConfirmAction = () => {
        if (confirmModal.type === "single" && confirmModal.item) {
            removeFromCart(confirmModal.item.id);
        } else if (confirmModal.type === "clear_all") {
            clearCart();
        }
        handleCloseModal();
    };

    // Kondisi 1: Keranjang Kosong (Empty State)
    if (!cart || cart.length === 0) {
        return (
            <div className="py-12">
                <div className="bg-white rounded-none border border-slate-200 p-10 sm:p-12 text-center max-w-lg mx-auto shadow-sm">
                    {/* Ikon SVG Keranjang Kosong */}
                    <div className="flex justify-center mb-5">
                        <div className="w-20 h-20 bg-slate-50 border border-slate-200 flex items-center justify-center rounded-none text-slate-400">
                            <svg
                                className="w-10 h-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.7 2.84-7.242a.75.75 0 00-.73-.958H5.106m2.394 8.2l-1.35-5.05m0 0L4.5 4.5m15 15a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-11.25 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        Keranjang Belanja Kosong
                    </h2>
                    <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                        Anda belum menambahkan produk apa pun ke dalam keranjang. Temukan barang pilihan terbaik sekarang.
                    </p>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-none text-sm transition shadow-sm cursor-pointer"
                    >
                        <span>Mulai Belanja</span>
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
                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        );
    }

    // Kondisi 2: Keranjang Berisi Produk
    return (
        <div className="py-4 sm:py-6 relative">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Keranjang Belanja
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Kelola barang belanjaan Anda sebelum melanjutkan ke proses checkout.
                    </p>
                </div>
                {/* Tombol Buka Modal Kosongkan Keranjang */}
                <button
                    type="button"
                    onClick={() => setConfirmModal({ isOpen: true, type: "clear_all", item: null })}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-none transition self-start sm:self-auto"
                >
                    <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                    </svg>
                    <span>Kosongkan Keranjang</span>
                </button>
            </div>

            {/* Layout 2 Kolom */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Kolom Kiri: Daftar Item Keranjang */}
                <div className="lg:col-span-2 space-y-3.5">
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border border-slate-200 p-4 rounded-none flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
                        >
                            {/* Bagian Kiri: Foto & Info Produk */}
                            <div className="flex items-center gap-3.5 w-full sm:w-auto flex-1 min-w-0">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 aspect-square bg-[#cbe3f7] rounded-none overflow-hidden shrink-0 border border-slate-200">
                                    <img
                                        src={item.img || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"}
                                        alt={item.name}
                                        className="w-full h-full object-cover rounded-none"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link
                                        to={`/product/${item.slug}`}
                                        className="font-bold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition truncate block leading-snug"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </Link>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-none font-medium">
                                            {item.category_name || "Produk"}
                                        </span>
                                        <span>•</span>
                                        <span>{item.seller || "TokoSeller.com"}</span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-800 mt-1.5">
                                        {item.price} <span className="text-slate-400 font-normal">/ item</span>
                                    </p>
                                </div>
                            </div>

                            {/* Bagian Kanan: Kontrol Kuantitas, Subtotal, & Tombol Hapus */}
                            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                {/* Pengatur Kuantitas (Quantity Controller) */}
                                <div className="flex items-center border border-slate-300 rounded-none bg-white">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (item.qty <= 1) {
                                                setConfirmModal({ isOpen: true, type: "single", item });
                                            } else {
                                                updateQty(item.id, item.qty - 1);
                                            }
                                        }}
                                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition rounded-none cursor-pointer"
                                        aria-label="Kurangi kuantitas"
                                    >
                                        <svg
                                            className="w-3.5 h-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2.5"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                        </svg>
                                    </button>
                                    <span className="w-10 text-center font-bold text-sm text-slate-800">
                                        {item.qty}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => updateQty(item.id, item.qty + 1)}
                                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition rounded-none cursor-pointer"
                                        aria-label="Tambah kuantitas"
                                    >
                                        <svg
                                            className="w-3.5 h-3.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2.5"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Subtotal per Item */}
                                <div className="text-right min-w-[95px]">
                                    <p className="text-[11px] text-slate-400 font-medium">Subtotal</p>
                                    <p className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                                        {formatRupiah((item.rawPrice || 0) * (item.qty || 1))}
                                    </p>
                                </div>

                                {/* Tombol Buka Modal Hapus Item Tertentu */}
                                <button
                                    type="button"
                                    onClick={() => setConfirmModal({ isOpen: true, type: "single", item })}
                                    className="p-2 text-slate-400 hover:text-rose-600 transition rounded-none cursor-pointer"
                                    title="Hapus dari keranjang"
                                    aria-label="Hapus produk"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Kolom Kanan: Ringkasan Pesanan */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm lg:sticky lg:top-24">
                        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                            Ringkasan Pesanan
                        </h2>

                        <div className="space-y-3 py-4 text-sm text-slate-600">
                            <div className="flex justify-between items-center">
                                <span>Total Item</span>
                                <span className="font-semibold text-slate-900">{totalQty} barang</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Estimasi Pengiriman</span>
                                <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-none text-xs">
                                    Gratis
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Estimasi Pajak</span>
                                <span className="font-semibold text-slate-900">Termasuk</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-4 mb-6">
                            <div className="flex justify-between items-baseline">
                                <span className="text-base font-bold text-slate-900">Total Pembayaran</span>
                                <span className="text-xl font-black text-slate-900">
                                    {formatRupiah(totalPrice)}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1">
                                Termasuk PPN jika berlaku.
                            </p>
                        </div>

                        <Link
                            to="/checkout"
                            className="bg-[#4F46E5] hover:bg-indigo-700 text-white py-3 w-full rounded-none font-semibold flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                        >
                            <span>Checkout Sekarang</span>
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
                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                />
                            </svg>
                        </Link>

                        <Link
                            to="/"
                            className="text-xs sm:text-sm text-slate-600 hover:text-indigo-600 text-center block mt-4 font-medium transition"
                        >
                            ← Lanjut Belanja
                        </Link>
                    </div>
                </div>
            </div>

            {/* ======================================================== */}
            {/* MODAL POP-UP KONFIRMASI HAPUS INTERAKTIF (SHARP EDGES) */}
            {/* ======================================================== */}
            {confirmModal.isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
                    onClick={handleCloseModal}
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Dialog Card Kotak Tegas */}
                    <div
                        className="bg-white border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl rounded-none relative animate-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Tombol Silang Tutup Mini (✕) di Sudut Kanan Atas */}
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-none cursor-pointer transition"
                            aria-label="Tutup dialog konfirmasi"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Kotak Ikon Peringatan SVG Kotak Tegas */}
                        <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center rounded-none mb-4 shadow-xs">
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
                                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                />
                            </svg>
                        </div>

                        {/* Teks Dialog Dinamis Sesuai Tipe Aksi */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-slate-900 leading-snug">
                                {confirmModal.type === "clear_all"
                                    ? "Kosongkan Seluruh Keranjang?"
                                    : "Hapus Barang dari Keranjang?"}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {confirmModal.type === "clear_all" ? (
                                    "Semua barang di dalam keranjang akan dihapus sekaligus. Tindakan ini tidak dapat dibatalkan."
                                ) : (
                                    <>
                                        Apakah kamu yakin ingin menghapus produk{" "}
                                        <strong className="font-bold text-slate-900">
                                            {confirmModal.item?.name || "ini"}
                                        </strong>{" "}
                                        dari keranjang belanja?
                                    </>
                                )}
                            </p>
                        </div>

                        {/* Dua Tombol Aksi Sejajar Kotak Tegas */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 mt-6 pt-3 border-t border-slate-100">
                            {/* Tombol Batal */}
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2.5 text-sm font-semibold rounded-none transition cursor-pointer text-center"
                            >
                                Batal
                            </button>

                            {/* Tombol Konfirmasi Hapus */}
                            <button
                                type="button"
                                onClick={handleConfirmAction}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-sm font-semibold rounded-none transition shadow-sm cursor-pointer text-center flex items-center justify-center gap-1.5"
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
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                </svg>
                                <span>
                                    {confirmModal.type === "clear_all" ? "Kosongkan Keranjang" : "Ya, Hapus Barang"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
