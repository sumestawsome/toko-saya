import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../utils/CartContext";

export default function Checkout() {
    const { cart, totalPrice, totalQty, clearCart } = useCart();
    const navigate = useNavigate();

    // State Formulir Pengiriman
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
    });

    // State Pilihan Pengiriman & Pembayaran
    const [shippingOption, setShippingOption] = useState("regular"); // "regular" | "express"
    const [paymentMethod, setPaymentMethod] = useState("qris"); // "qris" | "bank" | "cod"

    // State Validasi & Sukses Pesanan
    const [errorMsg, setErrorMsg] = useState("");
    const [isOrderSuccess, setIsOrderSuccess] = useState(false);
    const [orderCode, setOrderCode] = useState("");
    const [completedSummary, setCompletedSummary] = useState({
        total: 0,
        qty: 0,
    });

    // Helper format Rupiah
    const formatRupiah = (amount) => {
        return "Rp" + (amount || 0).toLocaleString("id-ID");
    };

    // Ongkos kirim berdasarkan opsi
    const shippingCost = shippingOption === "express" ? 20000 : 0;
    const grandTotal = totalPrice + shippingCost;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errorMsg) setErrorMsg("");
    };

    // Handle Submit Checkout
    const handleSubmitOrder = (e) => {
        e.preventDefault();

        // Validasi Sederhana
        if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim()) {
            setErrorMsg("Harap lengkapi semua data informasi pengiriman yang bertanda bintang (*).");
            return;
        }

        // Simpan ringkasan transaksi sebelum keranjang dikosongkan
        setCompletedSummary({
            total: grandTotal,
            qty: totalQty,
        });

        // Generate Kode Pesanan Unik (#INV-2026-XXXX)
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const code = `#INV-2026-${randomNum}`;
        setOrderCode(code);

        // Simpan Data Transaksi Sukses ke LocalStorage (toko_orders)
        const orderData = {
            invoiceId: code,
            date: new Date().toISOString(),
            customer: {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                city: formData.city.trim(),
                postalCode: formData.postalCode.trim(),
            },
            shippingMethod: shippingOption === "express" ? "Express (Rp 20.000)" : "Reguler (Gratis)",
            paymentMethod:
                paymentMethod === "qris"
                    ? "QRIS"
                    : paymentMethod === "bank"
                    ? "Transfer Bank / Virtual Account"
                    : "Cash on Delivery (COD)",
            items: [...cart],
            totalQty,
            totalPrice: grandTotal,
            status: "Berhasil",
        };

        try {
            const existingRaw = localStorage.getItem("toko_orders");
            const existingOrders = existingRaw ? JSON.parse(existingRaw) : [];
            localStorage.setItem("toko_orders", JSON.stringify([orderData, ...existingOrders]));
        } catch (error) {
            console.error("Gagal mengarsipkan transaksi ke localStorage:", error);
        }

        // Kosongkan keranjang & ubah status ke sukses
        clearCart();
        setIsOrderSuccess(true);
    };

    // ==========================================
    // KONDISI 3: PESANAN BERHASIL (ORDER SUCCESS)
    // ==========================================
    if (isOrderSuccess) {
        return (
            <div className="py-12">
                <div className="bg-white border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto rounded-none shadow-sm">
                    {/* Ikon Centang SVG Hijau */}
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-none flex items-center justify-center mx-auto mb-5 border border-emerald-200">
                        <svg
                            className="w-8 h-8 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2.5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Pesanan Berhasil Dibuat!
                    </h2>

                    <div className="inline-block bg-slate-100 border border-slate-200 px-3.5 py-1.5 font-mono text-sm font-semibold text-slate-800 my-3 rounded-none">
                        Nomor Pesanan: {orderCode}
                    </div>

                    <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                        Terima kasih telah berbelanja di TokoSaya. Pesanan Anda sebanyak{" "}
                        <span className="font-semibold text-slate-700">{completedSummary.qty} barang</span> sebesar{" "}
                        <span className="font-bold text-indigo-600">{formatRupiah(completedSummary.total)}</span> sedang dipersiapkan untuk pengiriman.
                    </p>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-none text-sm transition shadow-sm cursor-pointer"
                    >
                        <span>Kembali Belanja</span>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        );
    }

    // ==========================================
    // KONDISI 1: KERANJANG KOSONG (EMPTY GUARD)
    // ==========================================
    if (!cart || cart.length === 0) {
        return (
            <div className="py-12">
                <div className="bg-white border border-slate-200 p-10 sm:p-12 text-center max-w-lg mx-auto rounded-none shadow-sm">
                    {/* Ikon Keranjang Kosong SVG */}
                    <div className="w-20 h-20 bg-slate-50 border border-slate-200 flex items-center justify-center rounded-none text-slate-400 mx-auto mb-5">
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

                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        Keranjang Belanja Kosong
                    </h2>
                    <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                        Silakan pilih produk terlebih dahulu sebelum melakukan proses checkout.
                    </p>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-none text-sm transition shadow-sm cursor-pointer"
                    >
                        <span>Kembali ke Katalog</span>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        );
    }

    // ==========================================
    // KONDISI 2: FORMULIR CHECKOUT (2 KOLOM)
    // ==========================================
    return (
        <div className="py-4 sm:py-6">
            {/* Header Halaman */}
            <div className="pb-6 mb-6 border-b border-slate-200">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Checkout Pembayaran
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    Lengkapi alamat pengiriman dan pilih metode pembayaran untuk menyelesaikan pesanan Anda.
                </p>
            </div>

            {/* Pesan Error Validasi */}
            {errorMsg && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-none flex items-center gap-2.5">
                    <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span>{errorMsg}</span>
                </div>
            )}

            <form onSubmit={handleSubmitOrder}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* KOLOM KIRI: DATA PEMBELI, PENGIRIMAN & PEMBAYARAN */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* BAGIAN A: INFORMASI PENGIRIMAN */}
                        <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm">
                            <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
                                <div className="w-8 h-8 bg-indigo-50 text-[#4F46E5] flex items-center justify-center rounded-none border border-indigo-100">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v10.875"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-base font-bold text-slate-900">
                                    1. Informasi Pengiriman
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Nama Lengkap <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Contoh: Ahmad Rizky"
                                            className="w-full bg-white border border-slate-300 rounded-none px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Nomor WhatsApp / Telepon <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Contoh: 081234567890"
                                            className="w-full bg-white border border-slate-300 rounded-none px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Alamat Lengkap <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        rows="3"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
                                        className="w-full bg-white border border-slate-300 rounded-none px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Kota / Kecamatan <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Contoh: Bandung, Coblong"
                                            className="w-full bg-white border border-slate-300 rounded-none px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Kode Pos
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            placeholder="Contoh: 40132"
                                            className="w-full bg-white border border-slate-300 rounded-none px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* BAGIAN B: PILIHAN KURIR / OPSI PENGIRIMAN */}
                        <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm">
                            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
                                <div className="w-8 h-8 bg-indigo-50 text-[#4F46E5] flex items-center justify-center rounded-none border border-indigo-100">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-base font-bold text-slate-900">
                                    2. Opsi Pengiriman
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <label
                                    onClick={() => setShippingOption("regular")}
                                    className={`p-4 border rounded-none cursor-pointer flex flex-col justify-between transition ${
                                        shippingOption === "regular"
                                            ? "border-[#4F46E5] bg-indigo-50/40"
                                            : "border-slate-200 hover:border-slate-300 bg-white"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2.5">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                checked={shippingOption === "regular"}
                                                onChange={() => setShippingOption("regular")}
                                                className="text-[#4F46E5] focus:ring-0 rounded-none cursor-pointer"
                                            />
                                            <span className="font-bold text-sm text-slate-900">Reguler</span>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                                            Gratis
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-6">
                                        Estimasi tiba 2 - 4 hari kerja
                                    </p>
                                </label>

                                <label
                                    onClick={() => setShippingOption("express")}
                                    className={`p-4 border rounded-none cursor-pointer flex flex-col justify-between transition ${
                                        shippingOption === "express"
                                            ? "border-[#4F46E5] bg-indigo-50/40"
                                            : "border-slate-200 hover:border-slate-300 bg-white"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2.5">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                checked={shippingOption === "express"}
                                                onChange={() => setShippingOption("express")}
                                                className="text-[#4F46E5] focus:ring-0 rounded-none cursor-pointer"
                                            />
                                            <span className="font-bold text-sm text-slate-900">Express / Kilat</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-900">
                                            Rp 20.000
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 pl-6">
                                        Estimasi tiba 1 - 2 hari kerja
                                    </p>
                                </label>
                            </div>
                        </div>

                        {/* BAGIAN C: METODE PEMBAYARAN */}
                        <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm">
                            <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-100">
                                <div className="w-8 h-8 bg-indigo-50 text-[#4F46E5] flex items-center justify-center rounded-none border border-indigo-100">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                                        />
                                    </svg>
                                </div>
                                <h2 className="text-base font-bold text-slate-900">
                                    3. Metode Pembayaran
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {/* Opsi 1: QRIS */}
                                <label
                                    onClick={() => setPaymentMethod("qris")}
                                    className={`p-4 border rounded-none cursor-pointer flex items-center justify-between transition ${
                                        paymentMethod === "qris"
                                            ? "border-[#4F46E5] bg-indigo-50/40"
                                            : "border-slate-200 hover:border-slate-300 bg-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === "qris"}
                                            onChange={() => setPaymentMethod("qris")}
                                            className="text-[#4F46E5] focus:ring-0 rounded-none cursor-pointer"
                                        />
                                        <div>
                                            <p className="font-bold text-sm text-slate-900">QRIS / Instant Payment</p>
                                            <p className="text-xs text-slate-500">GoPay, OVO, ShopeePay, DANA, BCA Mobile</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 border border-indigo-200">
                                        Otomatis
                                    </span>
                                </label>

                                {/* Opsi 2: Transfer Bank */}
                                <label
                                    onClick={() => setPaymentMethod("bank")}
                                    className={`p-4 border rounded-none cursor-pointer flex items-center justify-between transition ${
                                        paymentMethod === "bank"
                                            ? "border-[#4F46E5] bg-indigo-50/40"
                                            : "border-slate-200 hover:border-slate-300 bg-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === "bank"}
                                            onChange={() => setPaymentMethod("bank")}
                                            className="text-[#4F46E5] focus:ring-0 rounded-none cursor-pointer"
                                        />
                                        <div>
                                            <p className="font-bold text-sm text-slate-900">Transfer Bank (Virtual Account)</p>
                                            <p className="text-xs text-slate-500">BCA, Mandiri, BNI, BRI, Permata</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5">
                                        VA 24 Jam
                                    </span>
                                </label>

                                {/* Opsi 3: COD */}
                                <label
                                    onClick={() => setPaymentMethod("cod")}
                                    className={`p-4 border rounded-none cursor-pointer flex items-center justify-between transition ${
                                        paymentMethod === "cod"
                                            ? "border-[#4F46E5] bg-indigo-50/40"
                                            : "border-slate-200 hover:border-slate-300 bg-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === "cod"}
                                            onChange={() => setPaymentMethod("cod")}
                                            className="text-[#4F46E5] focus:ring-0 rounded-none cursor-pointer"
                                        />
                                        <div>
                                            <p className="font-bold text-sm text-slate-900">COD (Bayar di Tempat)</p>
                                            <p className="text-xs text-slate-500">Bayar tunai ke kurir saat paket tiba di alamat Anda</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5">
                                        Tunai
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: RINGKASAN PESANAN STICKY */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm lg:sticky lg:top-24">
                            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                                Ringkasan Pesanan ({totalQty} Produk)
                            </h2>

                            {/* Daftar Ringkas Produk */}
                            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 my-3 pr-1">
                                {cart.map((item) => (
                                    <div key={item.id} className="py-2.5 flex items-center gap-3">
                                        <div className="w-12 h-12 aspect-square bg-[#cbe3f7] rounded-none overflow-hidden shrink-0 border border-slate-200">
                                            <img
                                                src={item.img || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded-none"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-slate-900 truncate" title={item.name}>
                                                {item.name}
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                {item.qty} × {item.price}
                                            </p>
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 shrink-0">
                                            {formatRupiah((item.rawPrice || 0) * (item.qty || 1))}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Rincian Biaya */}
                            <div className="border-t border-slate-100 pt-3 space-y-2.5 text-xs text-slate-600">
                                <div className="flex justify-between items-center">
                                    <span>Subtotal Produk</span>
                                    <span className="font-semibold text-slate-800">{formatRupiah(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Ongkos Kirim ({shippingOption === "express" ? "Express" : "Reguler"})</span>
                                    {shippingCost === 0 ? (
                                        <span className="text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                                            Gratis
                                        </span>
                                    ) : (
                                        <span className="font-semibold text-slate-800">{formatRupiah(shippingCost)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Biaya Layanan</span>
                                    <span className="text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                                        Gratis
                                    </span>
                                </div>
                            </div>

                            {/* Total Akhir */}
                            <div className="border-t border-slate-200 pt-4 mt-4 mb-5">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm font-bold text-slate-900">Total Pembayaran</span>
                                    <span className="text-xl font-black text-slate-900">
                                        {formatRupiah(grandTotal)}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                    Sudah termasuk PPN dan jaminan pengiriman.
                                </p>
                            </div>

                            {/* Tombol Submit Pembayaran */}
                            <button
                                type="submit"
                                className="bg-[#4F46E5] text-white py-3.5 w-full font-bold hover:bg-indigo-700 active:bg-indigo-800 transition flex items-center justify-center gap-2 rounded-none shadow-sm cursor-pointer text-sm"
                            >
                                <span>Bayar & Konfirmasi Pesanan</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </button>

                            <Link
                                to="/cart"
                                className="text-xs text-slate-500 hover:text-indigo-600 text-center block mt-3.5 font-medium transition"
                            >
                                ← Kembali ke Keranjang
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
