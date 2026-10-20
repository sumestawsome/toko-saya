import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import ProductFilterBar from "../../components/ProductFilterBar";
import BrandLoader from "../../components/BrandLoader";
import { API_BASE_URL, formatImageUrl } from "../../config/api";
// import products from "../../data/products.json"; ini kalau ngambil data bukan dari laravel tapi dari folder data

export default function Dashboard() {
  // State data produk dari backend Laravel
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State filter pencarian, kategori, dan sorting
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("default");

  // Ambil data dari REST API Laravel saat halaman dibuka
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal mengambil data dari server");
        }
        return res.json();
      })
      .then((data) => {
        // Menyesuaikan struktur data API Laravel ke format yang dipakai ProductCard
        const items = Array.isArray(data) ? data : data.data || [];
        const formatted = items.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          category_name: item.category ? item.category.name : "Umum",
          price: `Rp${Number(item.price).toLocaleString("id-ID")}`,
          rawPrice: Number(item.price),
          original_price: item.original_price
            ? `Rp${Number(item.original_price).toLocaleString("id-ID")}`
            : null,
          rating: item.rating ? String(item.rating).replace(".", ",") : "4,5",
          sold: `${item.sold_count || 0} Terjual`,
          seller: item.seller || "TokoSeller.com",
          img: formatImageUrl(item.image_url),
          desc: item.description,
          description: item.description,
        }));

        setProducts(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Tidak dapat memuat katalog produk dari database.");
        setLoading(false);
      });
  }, []);

  // Ambil daftar kategori unik dari data produk
  const categories = [...new Set(products.map((p) => p.category_name))];

  // Filter produk berdasarkan kategori dan pencarian perkata
  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === "Semua" ||
      product.category_name === selectedCategory;

    let matchKeyword = true;
    if (keyword.trim() !== "") {
      const searchWords = keyword
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      matchKeyword = searchWords.every((word) => {
        const wordRegex = new RegExp(`\\b${word}\\b`, "i");
        return wordRegex.test(product.name);
      });
    }

    return matchCategory && matchKeyword;
  });

  // Pengurutan harga (lama)
  //   const sortedProducts = [...filteredProducts].sort((a, b) => {
  //     if (sortBy === "lowest") return a.rawPrice - b.rawPrice;
  //     if (sortBy === "highest") return b.rawPrice - a.rawPrice;
  //     return a.id - b.id; // Urutan default berdasarkan ID
  //   });

  // Pengurutan harga (Laravel)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "lowest") return a.rawPrice - b.rawPrice;
    if (sortBy === "highest") return b.rawPrice - a.rawPrice;
    return a.id - b.id; // Urutan default berdasarkan ID
  });

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <BrandLoader text="Memuat katalog dari server database..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-red-50 border border-red-200">
        <h3 className="font-bold text-red-700 text-sm">{error}</h3>
        <p className="text-red-500 text-xs mt-1">
          Pastikan server Laravel aktif di terminal (
          <code>php artisan serve</code>).
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter bar pencarian dan kategori */}
      <ProductFilterBar
        keyword={keyword}
        setKeyword={setKeyword}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
      />

      {/* Grid daftar produk */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedProducts.map((item) => (
            <ProductCard key={item.id} p={item} />
          ))}
        </div>
      ) : (
        /* Empty state jika produk tidak ditemukan */
        <div className="max-w-md mx-auto my-12 text-center p-8 sm:p-10 bg-white border border-slate-200 shadow-sm rounded-none">
          <h3 className="font-bold text-slate-800 text-base">
            Produk Tidak Ditemukan
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            Tidak ada produk yang cocok dengan kata kunci atau filter yang Anda
            pilih.
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
