import React, { useState, useEffect } from "react";
import { useProducts } from "../../utils/ProductContext";
import { useAuth } from "../../utils/AuthContext";
import { formatImageUrl, PLACEHOLDER_IMAGE } from "../../config/api";
import BrandLoader from "../../components/BrandLoader";
import ProductFormModal from "../../components/ProductFormModal";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { getProducts, deleteProduct, getCategories } = useProducts();

  // State Data Produk & Paginasi Server-Side
  const [products, setProducts] = useState([]);
  const [paginationMeta, setPaginationMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 8,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  // State Filter & Pencarian
  const [keyword, setKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // State Modal Pop-up Form (Permintaan Dosen: Modal bukan halaman terpisah)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Muat daftar kategori dari backend untuk filter dropdown
  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((data) => {
        if (isMounted) setCategories(data || []);
      })
      .catch((err) => console.error("Gagal memuat kategori:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Ambil daftar produk dari backend
  const fetchProductList = async (
    page = 1,
    cat = selectedCategory,
    kw = searchQuery
  ) => {
    try {
      setLoading(true);
      const res = await getProducts({
        page,
        limit: 8,
        category_id: cat,
        keyword: kw,
      });

      if (res && res.data) {
        setProducts(res.data);
        if (res.meta) {
          setPaginationMeta({
            current_page: res.meta.current_page || 1,
            last_page: res.meta.last_page || 1,
            per_page: res.meta.per_page || 8,
            total: res.meta.total || res.data.length,
          });
        }
      } else if (Array.isArray(res)) {
        setProducts(res);
        setPaginationMeta({
          current_page: 1,
          last_page: 1,
          per_page: res.length,
          total: res.length,
        });
      }
    } catch (err) {
      toast.error("Gagal memuat daftar produk dari server.");
    } finally {
      setLoading(false);
    }
  };

  // Muat ulang ketika halaman, kategori, atau pencarian berubah
  useEffect(() => {
    fetchProductList(currentPage, selectedCategory, searchQuery);
  }, [currentPage, selectedCategory, searchQuery]);

  // Buka modal untuk tambah produk baru
  const handleOpenAdd = () => {
    setModalMode("add");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  // Buka modal untuk edit produk
  const handleOpenEdit = (item) => {
    setModalMode("edit");
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  // Jalankan pencarian produk
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchQuery(keyword);
  };

  // Kembalikan filter pencarian ke awal
  const handleResetFilter = () => {
    setKeyword("");
    setSearchQuery("");
    setSelectedCategory("");
    setCurrentPage(1);
  };

  // Hapus produk setelah konfirmasi
  const handleDelete = async (id, name) => {
    const isConfirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus produk "${name || "#" + id}"?\nTindakan ini tidak dapat dibatalkan.`
    );
    if (!isConfirmed) return;

    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Produk berhasil dihapus!");
      fetchProductList(currentPage, selectedCategory, searchQuery);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Terjadi kesalahan saat menghapus produk."
      );
    }
  };

  // Format Mata Uang Rupiah
  const formatRupiah = (val) => {
    const num = Number(val) || 0;
    return `Rp ${num.toLocaleString("id-ID")}`;
  };

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6 font-['Canva_Sans',sans-serif]">
      {/* 1. Header Banner Bersih TokoSaya */}
      <div className="bg-white border border-slate-200 p-6 shadow-sm rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-semibold bg-indigo-50 text-[#4F46E5] px-2.5 py-0.5 border border-indigo-100 rounded-none uppercase tracking-wider">
              Modul Administrasi
            </span>
            <span className="text-xs text-slate-500">
              Admin: <strong className="text-slate-800">{user?.name || "Administrator"}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Produk & Katalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola inventaris toko yang terhubung secara realtime dengan RESTful API Laravel & MySQL.
          </p>
        </div>

        {/* Tombol Pemicu Modal Tambah Produk */}
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide rounded-none shadow-sm transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* 2. Panel Pencarian & Filter Kategori */}
      <div className="bg-white border border-slate-200 p-4 shadow-sm rounded-none">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-stretch md:items-center gap-3"
        >
          {/* Filter Dropdown Kategori */}
          <div className="w-full md:w-56 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-300 rounded-none px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#4F46E5] transition"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => {
                const catId = cat.category_id || cat.id;
                const catName = cat.category || cat.name;
                return (
                  <option key={catId} value={catId}>
                    {catName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Input Pencarian Kata Kunci */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau deskripsi produk..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-none pl-3 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] transition"
            />
            {keyword && (
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Tombol Cari Bersih dengan Ikon SVG */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide rounded-none shadow-sm transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Cari</span>
          </button>

          {/* Tombol Reset Filter */}
          {(selectedCategory || searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilter}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-none transition cursor-pointer"
            >
              Reset
            </button>
          )}
        </form>

        {/* Indikator Filter Aktif */}
        {(selectedCategory || searchQuery) && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-400">Filter Aktif:</span>
            {selectedCategory && (
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 border border-indigo-200 text-[11px] rounded-none">
                Kategori ID: #{selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200 text-[11px] rounded-none">
                Kata Kunci: "{searchQuery}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* 3. Tabel Produk Bersih & Fungsional */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-none overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            {/* Animasi loading kedap-kedip resmi TokoSaya */}
            <BrandLoader text="Memuat data produk dari database server..." size="md" />
            <p className="text-xs text-slate-400 mt-3 font-medium">
              Sinkronisasi data katalog...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-600">
              Tidak ada produk yang cocok dengan pencarian atau filter yang dipilih.
            </p>
            <button
              type="button"
              onClick={handleResetFilter}
              className="px-4 py-2 bg-[#4F46E5] text-white font-semibold text-xs rounded-none hover:bg-indigo-700 transition"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-3 text-center w-12">#</th>
                  <th className="py-3 px-3 w-16 text-center">Foto</th>
                  <th className="py-3 px-4">Nama Produk & Kategori</th>
                  <th className="py-3 px-4 w-36">Harga</th>
                  <th className="py-3 px-4 w-28 text-center">Stok</th>
                  <th className="py-3 px-4 w-32 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100">
                {products.map((item, index) => {
                  const itemNumber =
                    (paginationMeta.current_page - 1) * paginationMeta.per_page + (index + 1);
                  const imgSource = formatImageUrl(item.image_url || item.img_url);
                  const catName = item.category?.name || item.category?.category || "Umum";
                  const stockNum = Number(item.stock) || 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Nomor urut */}
                      <td className="py-3 px-3 text-center text-slate-400 font-semibold">
                        {itemNumber}
                      </td>

                      {/* Thumbnail Foto */}
                      <td className="py-2 px-3 text-center">
                        <img
                          src={imgSource}
                          alt={item.name}
                          className="w-12 h-12 object-cover border border-slate-200 mx-auto rounded-none bg-slate-100"
                          onError={(e) => {
                            if (e.target.src !== PLACEHOLDER_IMAGE) {
                              e.target.src = PLACEHOLDER_IMAGE;
                            }
                          }}
                        />
                      </td>

                      {/* Nama & Label Kategori */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 text-xs">
                          {item.name}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          {/* Badge Kategori Elegan Muted */}
                          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-none">
                            #{catName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Slug: {item.slug}
                          </span>
                        </div>
                      </td>

                      {/* Harga */}
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {formatRupiah(item.price)}
                      </td>

                      {/* Badge Stok Indikator Fungsional */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[11px] font-semibold border rounded-none ${
                            stockNum > 10
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : stockNum > 0
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {stockNum} unit
                        </span>
                      </td>

                      {/* Tombol Aksi (Edit via Modal & Hapus via Confirmation) */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-none transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.name)}
                            className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-none transition cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Navigasi Paginasi Server-Side */}
        {paginationMeta.total > 0 && (
          <div className="bg-slate-50/75 p-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium">
              Menampilkan Halaman <strong className="text-slate-800">{paginationMeta.current_page}</strong> dari{" "}
              <span>{paginationMeta.last_page}</span> (Total {paginationMeta.total} Produk)
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={paginationMeta.current_page <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-none disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Sebelumnya
              </button>

              {Array.from({ length: paginationMeta.last_page }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setCurrentPage(pg)}
                  className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-none border transition cursor-pointer ${
                    pg === paginationMeta.current_page
                      ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs"
                      : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                type="button"
                disabled={paginationMeta.current_page >= paginationMeta.last_page}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, paginationMeta.last_page))
                }
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-none disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Modal Pop-up Form Tambah / Edit Produk */}
      <ProductFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        productData={selectedProduct}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={() => {
          fetchProductList(currentPage, selectedCategory, searchQuery);
        }}
      />
    </div>
  );
}
