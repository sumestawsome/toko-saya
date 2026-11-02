import { useState, useMemo } from "react";
import ProductCard from "../../components/ProductCard";
import ProductFilterBar from "../../components/ProductFilterBar";
import BrandLoader from "../../components/BrandLoader";
import { formatImageUrl } from "../../config/api";

// ============================================================================
// --- MODE STATIS (BAB II): Menggunakan import JSON lokal & State Statis ---
// Pada modul BAB II, seluruh katalog produk dibaca langsung dari berkas statis:
// import staticProducts from "../../data/products_lama.json";
// ============================================================================

// ============================================================================
// --- MODE DINAMIS (BAB IV): Terintegrasi dengan Laravel API via React Query ---
// ============================================================================
import { useProducts } from "../../utils/ProductContext";

export default function Dashboard() {
  // Ambil data produk langsung dari server
  const { products: rawProducts, isLoading: loading, isError } = useProducts();

  // Filter pencarian, kategori, dan urutan harga
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("default");

  // Sesuaikan format data produk agar pas di kartu produk
  const products = useMemo(() => {
    const items = Array.isArray(rawProducts) ? rawProducts : [];
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      category_name: item.category?.name || item.category?.category || "Umum",
      price: `Rp${Number(item.price).toLocaleString("id-ID")}`,
      rawPrice: Number(item.price),
      original_price: item.original_price
        ? `Rp${Number(item.original_price).toLocaleString("id-ID")}`
        : null,
      rating: item.rating ? String(item.rating).replace(".", ",") : "4,5",
      sold: `${item.sold_count || 0} Terjual`,
      seller: item.seller || "TokoSeller.com",
      img: formatImageUrl(item.image_url || item.img_url),
      desc: item.description,
      description: item.description,
    }));
  }, [rawProducts]);

  // Ambil daftar kategori unik dari data produk aktif
  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category_name))];
  }, [products]);

  // Filter produk berdasarkan kategori dan pencarian kata utuh
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
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
  }, [products, selectedCategory, keyword]);

  // Pengurutan harga
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "lowest") return a.rawPrice - b.rawPrice;
      if (sortBy === "highest") return b.rawPrice - a.rawPrice;
      return a.id - b.id;
    });
  }, [filteredProducts, sortBy]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <BrandLoader text="Memuat katalog produk dari database server..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-rose-50/60 border border-rose-200 shadow-sm rounded-none">
        <h3 className="font-bold text-rose-700 text-sm">Gagal Mengambil Data Produk</h3>
        <p className="text-rose-600/90 text-xs mt-1">
          Tidak dapat terhubung ke server backend API. Pastikan server aktif dan dapat diakses.
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
            Tidak ada produk yang cocok dengan kata kunci atau filter yang Anda pilih.
          </p>
          <button
            onClick={() => {
              setKeyword("");
              setSelectedCategory("Semua");
              setSortBy("default");
            }}
            className="mt-4 rounded-none bg-[#4F46E5] text-white hover:bg-indigo-700 px-4 py-2 text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
}
