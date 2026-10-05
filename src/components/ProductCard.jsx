import { Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";

export default function ProductCard({ p }) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(p);
    };

    return (
        <div className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition duration-200 rounded-none p-3.5 flex flex-col justify-between">
            {/* 1. Bagian Atas: Gambar, Judul, & Harga */}
            <div>
                {/* Wadah Gambar: Rasio persegi, background #cbe3f7, sudut kotak tegas */}
                <div className="w-full aspect-square bg-[#cbe3f7] rounded-none overflow-hidden flex items-center justify-center">
                    <img
                        src={p.img || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"}
                        alt={p.name}
                        className="w-full h-full object-cover rounded-none"
                    />
                </div>

                {/* Judul Produk: Tebal & Truncate jika panjang */}
                <h3
                    className="font-bold text-slate-900 text-[15px] sm:text-[16px] mt-3 tracking-tight truncate leading-snug"
                    title={p.name}
                >
                    {p.name}
                </h3>

                {/* Harga Utama & Harga Coret (jika ada) */}
                <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
                    <span className="text-[19px] sm:text-[21px] font-extrabold text-slate-900 leading-none">
                        {p.price}
                    </span>
                    {p.original_price && (
                        <span className="text-[13px] text-slate-400 line-through font-normal">
                            {p.original_price}
                        </span>
                    )}
                </div>
            </div>

            {/* 2. Footer Kartu Produk (Fleksibel & Anti-Overflow) */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 mt-4 pt-2 border-t border-slate-100 max-w-full">
                {/* Rating, Jumlah Terjual, & Nama Toko */}
                <div className="flex flex-col leading-tight shrink-0 min-w-0">
                    <div className="flex items-center gap-1 text-slate-700 text-[11px] font-medium">
                        <span>{p.rating || "4,5"}</span>
                        <span className="text-amber-400 text-[12px]">★</span>
                        <span className="text-slate-300">-</span>
                        <span className="text-slate-500">{p.sold || "12 Terjual"}</span>
                    </div>
                    <span className="text-slate-600 text-[12px] mt-0.5 font-normal truncate">
                        {p.seller || "TokoSeller.com"}
                    </span>
                </div>

                {/* Aksi: Tautan Detail Bergaris Bawah & Tombol + Keranjang Kotak Tegas */}
                <div className="flex items-center gap-2 shrink-0 ml-auto max-w-full">
                    <Link
                        to={`/product/${p.slug}`}
                        className="text-[12px] font-semibold text-slate-700 hover:text-indigo-600 underline underline-offset-2 transition shrink-0"
                    >
                        Detail
                    </Link>

                    <button
                        onClick={handleAddToCart}
                        className="bg-[#4F46E5] hover:bg-indigo-700 active:scale-95 text-white text-[12px] font-semibold px-2.5 py-1.5 rounded-none transition shadow-sm whitespace-nowrap cursor-pointer shrink-0"
                    >
                        + Keranjang
                    </button>
                </div>
            </div>
        </div>
    );
}