import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useCart } from "../../utils/CartContext";
import products from "../../data/products.json";

// Testimoni ulasan awal sesuai materi Bab 2
const initialReviews = [
    {
        id: 1,
        user: "Rian Pratama",
        rating: 5,
        date: "2 hari lalu",
        comment: "Kualitas barang sangat bagus, jahitan rapi dan pengiriman super cepat. Sangat puas belanja di sini!"
    },
    {
        id: 2,
        user: "Siti Nurhaliza",
        rating: 4,
        date: "1 minggu lalu",
        comment: "Barang sesuai dengan foto di katalog. Bahan nyaman dipakai dan warna sesuai harapan."
    }
];

export default function ProductDetail() {
    const location = useLocation();
    const { slug, id } = useParams();
    const targetParam = slug || id;

    const { addToCart } = useCart();

    // Mengambil data produk dari location.state atau mencari berdasarkan slug / id dari products.json
    const product =
        location.state ||
        products.find(
            (p) => String(p.slug) === String(targetParam) || String(p.id) === String(targetParam)
        ) ||
        products[0];

    // Key unik LocalStorage per produk
    const storageKey = `reviews_${product.slug}`;

    // State kuantitas yang ingin dibeli
    const [quantity, setQuantity] = useState(1);
    const [addedNotice, setAddedNotice] = useState(false);

    // State ulasan pelanggan dengan persistensi LocalStorage
    const [reviews, setReviews] = useState(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            return saved ? JSON.parse(saved) : initialReviews;
        } catch {
            return initialReviews;
        }
    });

    // Sinkronkan ulasan jika pengguna berpindah ke produk lain
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            setReviews(saved ? JSON.parse(saved) : initialReviews);
        } catch {
            setReviews(initialReviews);
        }
    }, [storageKey]);

    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [userName, setUserName] = useState("");

    // Handler Tambah ke Keranjang
    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        setAddedNotice(true);
        setTimeout(() => setAddedNotice(false), 2500);
    };

    // Handler Pengiriman Ulasan Baru & Simpan ke LocalStorage
    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const newReviewObj = {
            id: Date.now(),
            user: userName.trim() || "Pelanggan Terverifikasi",
            rating: newRating,
            date: "Baru saja",
            comment: newComment.trim(),
        };

        const updatedReviews = [newReviewObj, ...reviews];
        setReviews(updatedReviews);

        try {
            localStorage.setItem(storageKey, JSON.stringify(updatedReviews));
        } catch (error) {
            console.error("Gagal menyimpan ulasan ke localStorage:", error);
        }

        setNewComment("");
        setUserName("");
        setNewRating(5);
    };

    return (
        <div className="py-4 sm:py-6">
            {/* Navigasi Breadcrumb Kembali */}
            <div className="mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    <span>Kembali ke Dashboard</span>
                </Link>
            </div>

            {/* Notifikasi Tambah Keranjang */}
            {addedNotice && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-none flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2.5">
                        <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span>Berhasil menambahkan <strong>{quantity} × {product.name}</strong> ke keranjang belanja!</span>
                    </div>
                    <Link to="/cart" className="underline font-bold text-emerald-700 hover:text-emerald-900 ml-4 shrink-0">
                        Lihat Keranjang →
                    </Link>
                </div>
            )}

            {/* Layout 2 Kolom Detail Produk */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
                {/* SISI KIRI: VISUAL GAMBAR PRODUK */}
                <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm space-y-4">
                    <div className="w-full aspect-square bg-[#cbe3f7] rounded-none overflow-hidden flex items-center justify-center border border-slate-200">
                        <img
                            src={product.img || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-none"
                        />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1 rounded-none">
                            Kategori: {product.category_name || "Produk Pilihan"}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                            Koleksi Resmi TokoSaya
                        </span>
                    </div>
                </div>

                {/* SISI KANAN: INFORMASI, HARGA, & AKSI PEMBELIAN */}
                <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-none shadow-sm flex flex-col justify-between">
                    <div>
                        {/* Judul Produk */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                            {product.name}
                        </h1>

                        {/* Rating, Penjualan, & Toko */}
                        <div className="flex flex-wrap items-center gap-3 mt-3 pb-4 border-b border-slate-100 text-xs sm:text-sm text-slate-600">
                            <div className="flex items-center gap-1 font-semibold text-slate-800">
                                <span>{product.rating || "4,5"}</span>
                                <svg className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                            <span>•</span>
                            <span className="text-slate-500">{product.sold || "12 Terjual"}</span>
                            <span>•</span>
                            <span className="text-indigo-600 font-semibold">{product.seller || "TokoSeller.com"}</span>
                        </div>

                        {/* Harga Utama & Coret */}
                        <div className="my-5 flex items-baseline gap-3">
                            <span className="text-3xl font-black text-slate-900 tracking-tight">
                                {product.price}
                            </span>
                            {product.original_price && (
                                <span className="text-base text-slate-400 line-through">
                                    {product.original_price}
                                </span>
                            )}
                        </div>

                        {/* Kotak Deskripsi Produk */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-none mb-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Deskripsi Produk
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {product.description ||
                                    "Produk berkualitas tinggi yang dirancang dengan material terbaik untuk memberikan kepuasan, durabilitas, dan kenyamanan optimal dalam penggunaan sehari-hari."}
                            </p>
                        </div>
                    </div>

                    {/* Kontrol Kuantitas & Tombol Tambah ke Keranjang */}
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-700 uppercase">Kuantitas:</span>
                            <div className="flex items-center border border-slate-300 rounded-none bg-white">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition rounded-none cursor-pointer"
                                    aria-label="Kurangi kuantitas"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                    </svg>
                                </button>
                                <span className="w-12 text-center font-bold text-sm text-slate-800">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition rounded-none cursor-pointer"
                                    aria-label="Tambah kuantitas"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#4F46E5] hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3.5 px-6 rounded-none transition flex items-center justify-center gap-2 shadow-sm cursor-pointer text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.7 2.84-7.242a.75.75 0 00-.73-.958H5.106m2.394 8.2l-1.35-5.05m0 0L4.5 4.5m15 15a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-11.25 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                                    />
                                </svg>
                                <span>+ Tambah ke Keranjang</span>
                            </button>
                            <Link
                                to="/cart"
                                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3.5 px-6 rounded-none transition flex items-center justify-center border border-slate-300 text-sm"
                            >
                                Keranjang
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEKSI ULASAN PELANGGAN (SESUAI MATERI BAB 2) */}
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-none shadow-sm">
                <div className="border-b border-slate-200 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Ulasan & Testimoni Pelanggan
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Dengarkan pengalaman nyata dari pembeli produk ini.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri Ulasan: Daftar Review */}
                    <div className="lg:col-span-2 space-y-4">
                        {reviews.length === 0 ? (
                            <p className="text-sm text-slate-400 italic">Belum ada ulasan untuk produk ini.</p>
                        ) : (
                            reviews.map((r) => (
                                <div key={r.id} className="p-4 bg-slate-50 border border-slate-200 rounded-none">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-slate-800">{r.user}</span>
                                            <span className="text-[11px] text-slate-400">• {r.date}</span>
                                        </div>
                                        {/* Bintang SVG */}
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(r.rating)].map((_, i) => (
                                                <svg key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            {[...Array(5 - r.rating)].map((_, i) => (
                                                <svg key={i} className="w-3.5 h-3.5 fill-slate-300 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Kolom Kanan Ulasan: Form Tambah Ulasan */}
                    <div className="lg:col-span-1 bg-slate-50 border border-slate-200 p-5 rounded-none">
                        <h3 className="font-bold text-sm text-slate-900 mb-3">Tulis Ulasan Anda</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-3.5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Anda:</label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Nama Anda (opsional)"
                                    className="w-full bg-white border border-slate-300 rounded-none px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Rating Bintang:</label>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setNewRating(star)}
                                            className="cursor-pointer transition p-0.5"
                                            aria-label={`Beri rating ${star}`}
                                        >
                                            <svg
                                                className={`w-5 h-5 ${
                                                    star <= newRating
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "fill-slate-300 text-slate-300"
                                                }`}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Pengalaman / Ulasan:</label>
                                <textarea
                                    rows="3"
                                    required
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Tulis pendapat Anda tentang produk ini..."
                                    className="w-full bg-white border border-slate-300 rounded-none p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5]"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-none text-xs transition shadow-sm cursor-pointer"
                            >
                                Kirim Ulasan
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
