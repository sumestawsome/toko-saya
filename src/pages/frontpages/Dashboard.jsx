import { useState } from "react";
import ProductCard from "../../components/ProductCard";
import ProductFilterBar from "../../components/ProductFilterBar";
import products from "../../data/products.json";

export default function Dashboard() {
    // State untuk menampung filter dan kata kunci
    const [keyword, setKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");
    const [sortBy, setSortBy] = useState("default");

    // Mengambil daftar kategori unik secara otomatis dari data produk
    const categories = [...new Set(products.map((p) => p.category_name))];

    // 1. Eksekusi Filter Pencarian & Kategori
    const filteredProducts = products.filter((product) => {
        // A. Filter Kategori
        const matchCategory =
            selectedCategory === "Semua" || product.category_name === selectedCategory;

        // B. Filter Per Kata Penuh (Whole Word Match)
        let matchKeyword = true;
        if (keyword.trim() !== "") {
            const searchWords = keyword.toLowerCase().trim().split(/\s+/).filter(Boolean);
            // Setiap kata yang diketik harus cocok sebagai kata utuh di judul produk
            matchKeyword = searchWords.every((word) => {
                const wordRegex = new RegExp(`\\b${word}\\b`, "i");
                return wordRegex.test(product.name);
            });
        }

        return matchCategory && matchKeyword;
    });

    // 2. Eksekusi Pengurutan Harga
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "lowest") return a.rawPrice - b.rawPrice;
        if (sortBy === "highest") return b.rawPrice - a.rawPrice;
        return a.id - b.id; // default (urutan asal mengikut id)
    });

    return (
        <div>
            {/* Komponen Filter Bar Pengganti Header Lama */}
            <ProductFilterBar
                keyword={keyword}
                setKeyword={setKeyword}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                categories={categories}
            />

            {/* Grid Kartu Produk */}
            {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedProducts.map((item) => (
                        <ProductCard key={item.id} p={item} />
                    ))}
                </div>
            ) : (
                /* Tampilan Ketika Produk Tidak Ditemukan */
                <div className="max-w-md mx-auto my-12 text-center p-8 sm:p-10 bg-white border border-slate-200 shadow-sm rounded-none">
                    <h3 className="font-bold text-slate-800 text-base">Produk Tidak Ditemukan</h3>
                    <p className="text-slate-500 text-xs mt-1">
                        Tidak ada produk yang cocok dengan kata kunci atau filter yang Anda pilih.
                    </p>
                    <button
                        onClick={() => {
                            setKeyword("");
                            setSelectedCategory("Semua");
                            setSortBy("default");
                        }}
                        className="mt-4 rounded-none bg-[#4F46E5] text-white hover:bg-indigo-700 px-4 py-2 text-xs font-semibold transition cursor-pointer"
                    >
                        Reset Semua Filter
                    </button>
                </div>
            )}
        </div>
    );
}