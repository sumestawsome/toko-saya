import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import BrandLoader from "../../components/BrandLoader";
import { API_BASE_URL, formatImageUrl } from "../../config/api";

// Daftar kategori acuan sesuai relasi tabel categories di basis data backend Laravel
const DEFAULT_CATEGORIES = [
  { id: 1, name: "Sepatu" },
  { id: 2, name: "Aksesori" },
  { id: 3, name: "Tas" },
  { id: 4, name: "Pakaian" },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");

  // State Notifikasi / Toast
  const [toast, setToast] = useState(null);

  // State Modal Tambah & Edit Produk
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [currentProductId, setCurrentProductId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // State formulir data produk
  const [formData, setFormData] = useState({
    name: "",
    category_id: 1,
    price: "",
    stock: "",
    image_url: "",
    description: "",
  });

  // State Dual Image Input: "file" (unggah dari device) atau "url" (link internet)
  const [imageInputMode, setImageInputMode] = useState("file");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // State Dialog Konfirmasi Hapus
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper menampilkan notifikasi toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Helper mengambil nama kategori yang konsisten
  const getCategoryName = (item) => {
    if (!item) return "Umum";
    if (typeof item.category === "object" && item.category !== null) {
      return item.category.name || "Umum";
    }
    if (typeof item.category === "string" && item.category.trim() !== "") {
      return item.category;
    }
    if (item.category_name) {
      return item.category_name;
    }
    return "Umum";
  };

  // Helper URL gambar dengan fallback aman
  const getProductImage = (item) => {
    return formatImageUrl(item?.image_url || item?.img);
  };

  // Helper format mata uang Rupiah
  const formatRupiah = (val) => {
    const num = Number(val) || 0;
    return `Rp ${num.toLocaleString("id-ID")}`;
  };

  // State pemicu muat ulang data produk
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Ambil data produk langsung dari server Laravel
  useEffect(() => {
    let isMounted = true;

    fetch(`${API_BASE_URL}/api/products`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Gagal memuat produk (HTTP ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const items = Array.isArray(data) ? data : data.data || [];
        setProducts(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal memuat data produk admin:", err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user?.token, reloadTrigger]);

  // Hitung jumlah barang per kategori secara otomatis
  const categoryCounts = useMemo(() => {
    return products.reduce((acc, item) => {
      const catName = getCategoryName(item);
      acc[catName] = (acc[catName] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  // Daftar kategori dengan id dan nama yang valid
  const availableCategories = useMemo(() => {
    const catMap = new Map();
    DEFAULT_CATEGORIES.forEach((c) => catMap.set(c.id, c.name));

    // Sinkronisasi kategori dari data produk yang aktif di database
    products.forEach((p) => {
      if (p.category && p.category.id && p.category.name) {
        catMap.set(Number(p.category.id), p.category.name);
      }
    });

    return Array.from(catMap.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  // Ambil riwayat order dari penyimpanan browser
  const savedOrders = JSON.parse(localStorage.getItem("toko_orders") || "[]");
  const totalTransactions = 12 + savedOrders.length;
  const additionalIncome = savedOrders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0,
  );
  const totalIncome = 8450000 + additionalIncome;

  // Filter produk berdasarkan pencarian kata dan kategori
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        filterCategory === "Semua" || getCategoryName(p) === filterCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        getCategoryName(p).toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, filterCategory]);

  // Handler pergantian berkas file lokal
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handler perubahan input tautan URL
  const handleUrlChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, image_url: val }));
    setImagePreview(val);
  };

  // Handler membersihkan pilihan gambar
  const handleClearImage = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image_url: "" }));
  };

  // Handler Buka Modal Tambah Produk Baru
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setCurrentProductId(null);
    setImageInputMode("file");
    setImageFile(null);
    setImagePreview("");
    setFormData({
      name: "",
      category_id: availableCategories[0]?.id || 1,
      price: "",
      stock: "10",
      image_url: "",
      description: "",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  // Handler Buka Modal Edit Produk
  const handleOpenEditModal = (product) => {
    setModalMode("edit");
    setCurrentProductId(product.id);

    // Temukan ID kategori yang cocok
    const catName = getCategoryName(product);
    const matchedCategory = availableCategories.find(
      (c) =>
        (product.category && c.id === product.category.id) ||
        c.name.toLowerCase() === catName.toLowerCase(),
    );
    const resolvedCatId = matchedCategory ? matchedCategory.id : 1;

    const existingImg = product.image_url || product.img || "";

    setFormData({
      name: product.name || "",
      category_id: resolvedCatId,
      price: product.price !== undefined ? String(product.price) : "",
      stock:
        product.stock !== undefined && product.stock !== null
          ? String(product.stock)
          : "10",
      image_url: existingImg,
      description: product.description || product.desc || "",
    });

    setImageInputMode(existingImg.startsWith("http") ? "url" : "file");
    setImageFile(null);
    setImagePreview(existingImg);
    setFormError("");
    setIsModalOpen(true);
  };

  // Handler Tutup Modal Form
  const handleCloseModal = () => {
    if (!submitting) {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
      setIsModalOpen(false);
      setFormError("");
    }
  };

  // Handler Simpan Data (POST Tambah / PUT Edit) ke REST API Laravel
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError("");

    // Validasi form dasar
    if (!formData.name.trim()) {
      setFormError("Nama produk wajib diisi.");
      return;
    }
    if (!formData.category_id || Number(formData.category_id) <= 0) {
      setFormError("Kategori produk wajib dipilih.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setFormError("Harga produk harus berupa angka lebih dari 0.");
      return;
    }
    if (formData.stock === "" || Number(formData.stock) < 0) {
      setFormError("Jumlah stok harus berupa angka 0 atau lebih.");
      return;
    }
    if (!formData.description.trim()) {
      setFormError("Deskripsi lengkap produk wajib diisi.");
      return;
    }

    setSubmitting(true);

    const isUploadingFile = imageInputMode === "file" && imageFile !== null;

    try {
      if (modalMode === "create") {
        let res;

        if (isUploadingFile) {
          // Kirimkan via FormData (multipart/form-data) dengan key file 'img'
          const fd = new FormData();
          fd.append("name", formData.name.trim());
          fd.append("category_id", String(formData.category_id));
          fd.append("price", String(formData.price));
          fd.append("stock", String(formData.stock));
          fd.append("description", formData.description.trim());
          fd.append("img", imageFile);

          res = await fetch(`${API_BASE_URL}/api/products`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
            },
            body: fd,
          });
        } else {
          // Kirimkan via JSON string jika menggunakan URL atau tanpa upload file
          const payload = {
            name: formData.name.trim(),
            category_id: Number(formData.category_id),
            price: Number(formData.price),
            stock: Number(formData.stock),
            description: formData.description.trim(),
            image_url:
              formData.image_url.trim() ||
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
          };

          res = await fetch(`${API_BASE_URL}/api/products`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
            },
            body: JSON.stringify(payload),
          });
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          const msg =
            errData?.message ||
            (errData?.errors ? Object.values(errData.errors).flat().join(" ") : null) ||
            `Gagal menyimpan produk baru (Status: ${res.status})`;
          throw new Error(msg);
        }

        const data = await res.json().catch(() => null);
        const createdProduct = data?.data || data?.product;

        if (createdProduct) {
          setProducts((prev) => [createdProduct, ...prev]);
        }
        setReloadTrigger((prev) => prev + 1);
        showToast("Produk baru berhasil ditambahkan ke database!");
        setIsModalOpen(false);
      } else {
        // Aksi Edit Produk (PUT)
        let res;

        if (isUploadingFile) {
          // Laravel method spoofing dengan _method=PUT untuk FormData multipart
          const fd = new FormData();
          fd.append("_method", "PUT");
          fd.append("name", formData.name.trim());
          fd.append("category_id", String(formData.category_id));
          fd.append("price", String(formData.price));
          fd.append("stock", String(formData.stock));
          fd.append("description", formData.description.trim());
          fd.append("img", imageFile);

          res = await fetch(
            `${API_BASE_URL}/api/products/${currentProductId}`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
              },
              body: fd,
            },
          );
        } else {
          // Gunakan request PUT JSON standar
          const payload = {
            name: formData.name.trim(),
            category_id: Number(formData.category_id),
            price: Number(formData.price),
            stock: Number(formData.stock),
            description: formData.description.trim(),
            image_url: (formData.image_url || imagePreview || "").trim(),
          };

          res = await fetch(
            `${API_BASE_URL}/api/products/${currentProductId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
              },
              body: JSON.stringify(payload),
            },
          );
        }

        if (!res.ok) {
          if (res.status === 404) {
            showToast(
              "Produk tidak ditemukan di database server (ID mungkin sudah terhapus). Memuat ulang katalog...",
              "error",
            );
            setIsModalOpen(false);
            setReloadTrigger((prev) => prev + 1);
            return;
          }

          const errData = await res.json().catch(() => null);
          const msg =
            errData?.message ||
            (errData?.errors ? Object.values(errData.errors).flat().join(" ") : null) ||
            `Gagal memperbarui produk (Status: ${res.status})`;
          throw new Error(msg);
        }

        const data = await res.json().catch(() => null);
        const updatedProduct = data?.data || data?.product;

        if (updatedProduct) {
          setProducts((prev) =>
            prev.map((item) =>
              item.id === currentProductId ? { ...item, ...updatedProduct } : item,
            ),
          );
        }
        setReloadTrigger((prev) => prev + 1);
        showToast("Data produk berhasil diperbarui di database!");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Operasi CRUD gagal:", err);
      setFormError(
        err.message ||
          "Terjadi kesalahan saat menghubungkan ke server backend Laravel.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handler Hapus Produk (DELETE) ke REST API Laravel
  const handleExecuteDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);

    const headers = {
      Accept: "application/json",
      ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
    };

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/products/${deletingProduct.id}`,
        {
          method: "DELETE",
          headers,
        },
      );

      if (!res.ok) {
        if (res.status === 404) {
          showToast(
            "Produk sudah tidak ada di database server. Memperbarui daftar...",
            "error",
          );
          setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
          setReloadTrigger((prev) => prev + 1);
          setDeletingProduct(null);
          return;
        }

        const errData = await res.json().catch(() => null);
        throw new Error(
          errData?.message || `Gagal menghapus produk (Status: ${res.status})`,
        );
      }

      // Hapus produk dari state lokal
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setReloadTrigger((prev) => prev + 1);
      showToast(`Produk "${deletingProduct.name}" berhasil dihapus dari database.`);
      setDeletingProduct(null);
    } catch (err) {
      console.error("Gagal menghapus produk:", err);
      showToast(
        err.message || "Gagal menghapus produk dari server backend.",
        "error",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-['Canva_Sans',sans-serif]">
      {/* Toast Notifikasi Neo-Minimalist Kotak Tegas */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 transition-all duration-300">
          <div
            className={`border px-4 py-3 shadow-lg flex items-center gap-3 rounded-none ${
              toast.type === "error"
                ? "bg-rose-50 border-rose-300 text-rose-800"
                : "bg-white border-slate-300 text-slate-800"
            }`}
          >
            {toast.type === "error" ? (
              <div className="w-6 h-6 bg-rose-600 text-white flex items-center justify-center rounded-none shrink-0 text-xs font-bold">
                !
              </div>
            ) : (
              <div className="w-6 h-6 bg-[#4F46E5] text-white flex items-center justify-center rounded-none shrink-0">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
            )}
            <span className="text-xs font-semibold">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-slate-700 rounded-none cursor-pointer"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Header Halaman */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Dashboard Manajemen Toko
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Ringkasan performa katalog produk, transaksi pesanan, dan status
          operasional sistem TokoSaya.
        </p>
      </div>

      {/* Baris Kartu Metrik Ringkasan (Ikon SVG Murni Tanpa Emoji, Kotak Tegas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kartu 1: Total Produk Otomatis */}
        <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Produk Katalog
              </span>
              <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 text-[#4F46E5] flex items-center justify-center rounded-none">
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
                    d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-3">
              {loading ? "..." : `${products.length} Produk`}
            </div>
          </div>

          {/* Badge Kategori Otomatis */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
            {Object.entries(categoryCounts).length > 0 ? (
              Object.entries(categoryCounts).map(([catName, count]) => (
                <span
                  key={catName}
                  className="bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-none"
                >
                  {catName}: {count}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-400">
                Belum ada produk tersimpan
              </span>
            )}
          </div>
        </div>

        {/* Kartu 2: Pesanan Masuk */}
        <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pesanan Masuk
              </span>
              <div className="w-8 h-8 bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center rounded-none">
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
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-3">
              {totalTransactions} Transaksi
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Tingkat Penyelesaian:</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-none">
              100% Terpenuhi
            </span>
          </div>
        </div>

        {/* Kartu 3: Estimasi Pendapatan */}
        <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Estimasi Pendapatan
              </span>
              <div className="w-8 h-8 bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center rounded-none">
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
                    d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-3">
              {formatRupiah(totalIncome)}
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Pertumbuhan Bulanan:</span>
            <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 border border-indigo-200 rounded-none">
              +14.2%
            </span>
          </div>
        </div>
      </div>

      {/* Bagian Manajemen Produk (Tampilan Kartu / Grid of Cards Responsif) */}
      <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm space-y-6">
        {/* Header Seksi & Tombol Tambah Produk Baru */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Katalog & Inventaris Produk
              </h2>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold rounded-none">
                Live Database
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Kelola penambahan, pembaharuan harga/stok, dan penghapusan produk
              secara langsung ke REST API Laravel.
            </p>
          </div>

          {/* Tombol Tambah Produk Baru Kotak Tegas */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold px-4 py-2.5 text-xs transition rounded-none shadow-sm cursor-pointer shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span>Tambah Produk Baru</span>
          </button>
        </div>

        {/* Baris Kontrol: Pencarian & Filter Kategori */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Input Pencarian */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau deskripsi barang..."
              className="w-full bg-white border border-slate-300 rounded-none pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] transition"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>

          {/* Filter Kategori */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 shrink-0">
              Kategori:
            </span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border border-slate-300 rounded-none px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#4F46E5] transition cursor-pointer"
            >
              <option value="Semua">Semua Kategori</option>
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Tombol Segarkan Data */}
            <button
              type="button"
              onClick={() => {
                setReloadTrigger((prev) => prev + 1);
                showToast("Memperbarui data katalog dari database...", "info");
              }}
              className="p-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-none transition cursor-pointer shrink-0"
              title="Segarkan data katalog dari server"
              aria-label="Segarkan data katalog"
            >
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
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tampilan Kisi Kartu Menggunakan BrandLoader Reusable */}
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <BrandLoader text="Menghubungkan ke API Laravel dan memuat produk..." />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((p) => {
              const catName = getCategoryName(p);
              const stockNum =
                p.stock !== undefined && p.stock !== null ? Number(p.stock) : 10;
              const isLowStock = stockNum <= 3;

              return (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200 rounded-none p-4 flex flex-col justify-between hover:border-slate-400 hover:shadow-xs transition duration-150"
                >
                  {/* Bagian Atas: Gambar, Badge Kategori & Stok */}
                  <div>
                    {/* Wadah Gambar Persegi Kotak Tegas */}
                    <div className="w-full aspect-square bg-slate-100 border border-slate-100 rounded-none overflow-hidden relative mb-3.5 flex items-center justify-center">
                      <img
                        src={getProductImage(p)}
                        alt={p.name}
                        className="w-full h-full object-cover rounded-none"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80";
                        }}
                      />

                      {/* Badge Kategori Kotak di Sudut Kiri Atas */}
                      <span className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-none uppercase tracking-wide shadow-xs">
                        {catName}
                      </span>

                      {/* Badge Sisa Stok di Sudut Kanan Atas */}
                      <span
                        className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-none border shadow-xs ${
                          isLowStock
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        Stok: {stockNum}
                      </span>
                    </div>

                    {/* Nama Barang */}
                    <h3
                      className="font-bold text-slate-900 text-sm tracking-tight line-clamp-1 leading-snug"
                      title={p.name}
                    >
                      {p.name}
                    </h3>

                    {/* Harga Produk */}
                    <div className="mt-1 flex items-baseline justify-between">
                      <span className="text-base font-extrabold text-[#4F46E5] tracking-tight">
                        {formatRupiah(p.price)}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        #{p.id}
                      </span>
                    </div>

                    {/* Cuplikan Ringkas Deskripsi Produk */}
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed min-h-[2rem]">
                      {p.description ||
                        p.desc ||
                        "Tidak ada deskripsi detail untuk produk ini."}
                    </p>
                  </div>

                  {/* Bagian Bawah: Aksi Edit & Hapus Kotak Tegas */}
                  <div className="pt-3.5 mt-3.5 border-t border-slate-100 flex items-center gap-2">
                    {/* Tombol Aksi Edit */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(p)}
                      className="flex-1 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-none transition cursor-pointer"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      <span>Edit</span>
                    </button>

                    {/* Tombol Aksi Hapus */}
                    <button
                      type="button"
                      onClick={() => setDeletingProduct(p)}
                      className="py-1.5 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-none transition cursor-pointer"
                      title="Hapus produk ini"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-rose-600"
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
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State Ketika Tidak Ada Produk Cocok */
          <div className="py-12 px-4 text-center bg-slate-50 border border-slate-200 rounded-none">
            <div className="w-10 h-10 bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-3 rounded-none">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Tidak Ada Produk yang Ditemukan
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery || filterCategory !== "Semua"
                ? "Tidak ada item yang cocok dengan filter atau kata kunci pencarian saat ini."
                : "Basis data produk masih kosong. Klik tombol di bawah untuk menambahkan produk perdana."}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {(searchQuery || filterCategory !== "Semua") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("Semua");
                  }}
                  className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-none transition cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-none transition cursor-pointer"
              >
                + Tambah Produk Baru
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Kotak Status Server Laravel */}
      <div className="bg-white border border-slate-200 p-6 rounded-none shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Server Backend REST API Laravel
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Endpoint sinkronisasi aktif:{" "}
            <code className="text-[#4F46E5] font-mono">
              {API_BASE_URL}/api/products
            </code>
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/"
            className="bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold px-4 py-2 text-xs transition rounded-none shadow-sm"
          >
            Tinjau Etalase Toko →
          </Link>
        </div>
      </div>

      {/* MODAL FORM: TAMBAH & EDIT PRODUK (Neo-Minimalist Sharp Edges) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white border border-slate-200 rounded-none shadow-2xl max-w-lg w-full p-6 sm:p-7 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {modalMode === "create"
                    ? "Tambah Produk Baru"
                    : "Perbarui Data Produk"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sinkronisasi langsung dengan endpoint backend REST API Laravel.
                </p>
              </div>

              {/* Tombol Tutup Silang Kotak Tegas */}
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={submitting}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-none transition cursor-pointer"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Pesan Kesalahan Form */}
            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-none mb-4 flex items-center gap-2">
                <svg
                  className="w-4 h-4 shrink-0 text-rose-600"
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
                <span>{formError}</span>
              </div>
            )}

            {/* Formulir Input */}
            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Nama Produk */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Produk <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: Sepatu Sneakers Running Casual"
                  className="w-full bg-white border border-slate-300 rounded-none px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] transition"
                />
              </div>

              {/* Baris Kategori & Stok */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pilihan Kategori Berbasis category_id Valid */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pilihan Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category_id: Number(e.target.value),
                      })
                    }
                    className="w-full bg-white border border-slate-300 rounded-none px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#4F46E5] transition cursor-pointer"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Jumlah Stok */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jumlah Stok Unit <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="Contoh: 15"
                    className="w-full bg-white border border-slate-300 rounded-none px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] transition"
                  />
                </div>
              </div>

              {/* Harga Barang */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Harga Satuan (Rupiah) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="250000"
                    className="w-full bg-white border border-slate-300 rounded-none pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] transition"
                  />
                </div>
              </div>

              {/* Seksi Dual Input Gambar: Tab Pilihan Unggah File atau Tautan URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Gambar Produk
                </label>

                {/* Tab Pemilihan Mode Input Gambar Kotak Tegas */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-none mb-3">
                  <button
                    type="button"
                    onClick={() => setImageInputMode("file")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-none transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      imageInputMode === "file"
                        ? "bg-white text-slate-900 border border-slate-300 shadow-xs"
                        : "text-slate-600 hover:text-slate-900 border border-transparent"
                    }`}
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
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                    <span>Unggah Berkas Lokal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageInputMode("url")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-none transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      imageInputMode === "url"
                        ? "bg-white text-slate-900 border border-slate-300 shadow-xs"
                        : "text-slate-600 hover:text-slate-900 border border-transparent"
                    }`}
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
                        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                      />
                    </svg>
                    <span>Tautan URL Gambar</span>
                  </button>
                </div>

                {/* Wadah Pratinjau Langsung (Live Preview) & Input Gambar */}
                <div className="flex flex-col sm:flex-row items-start gap-3.5">
                  {/* Kotak Pratinjau Gambar Rasio Persegi Kotak Tegas */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 aspect-square bg-slate-100 border border-slate-300 rounded-none overflow-hidden relative shrink-0 flex flex-col items-center justify-center text-slate-400">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Pratinjau Foto"
                          className="w-full h-full object-cover rounded-none"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80";
                          }}
                        />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 font-mono rounded-none">
                          Preview
                        </span>
                      </>
                    ) : (
                      <div className="p-2 text-center">
                        <svg
                          className="w-6 h-6 mx-auto mb-1 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          />
                        </svg>
                        <span className="text-[10px] leading-tight block">
                          Tanpa Foto
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Kontrol Input Terpilih */}
                  <div className="flex-1 w-full space-y-2">
                    {imageInputMode === "file" ? (
                      <div>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={handleFileChange}
                          className="block w-full text-xs text-slate-700 file:mr-3 file:py-2 file:px-3 file:rounded-none file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-slate-50 hover:file:bg-slate-100 file:text-slate-700 cursor-pointer border border-slate-300 p-1 rounded-none bg-white focus:outline-none focus:border-[#4F46E5]"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          File dikirim via <code>FormData</code> dengan key{" "}
                          <strong className="text-slate-600">img</strong> (Maksimal 2MB: JPG, JPEG, PNG, WEBP).
                        </p>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          value={formData.image_url}
                          onChange={handleUrlChange}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full bg-white border border-slate-300 rounded-none px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] transition"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          Tempelkan alamat URL gambar online yang valid.
                        </p>
                      </div>
                    )}

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold inline-flex items-center gap-1 cursor-pointer transition"
                      >
                        <span>✕ Hapus / Reset gambar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Deskripsi Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Deskripsi Lengkap Produk <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Tuliskan spesifikasi, keunggulan, atau material produk..."
                  className="w-full bg-white border border-slate-300 rounded-none px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4F46E5] transition resize-y"
                ></textarea>
              </div>

              {/* Tombol Aksi Modal */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold px-4 py-2.5 text-xs rounded-none transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#4F46E5] hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 text-white font-semibold px-5 py-2.5 text-xs rounded-none transition shadow-sm cursor-pointer inline-flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <BrandLoader size="xs" inverted />
                      <span>Menyimpan ke Server...</span>
                    </>
                  ) : (
                    <span>
                      {modalMode === "create"
                        ? "Simpan Produk Baru"
                        : "Perbarui Data Produk"}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG KONFIRMASI HAPUS PRODUK (Kotak Tegas & Transparan) */}
      {deletingProduct && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => !isDeleting && setDeletingProduct(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-none shadow-2xl max-w-sm w-full p-6 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ikon Peringatan Kotak Tegas */}
            <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4 rounded-none">
              <svg
                className="w-6 h-6"
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

            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Konfirmasi Hapus Produk
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus barang{" "}
              <strong className="text-slate-800">
                &ldquo;{deletingProduct.name}&rdquo;
              </strong>{" "}
              dari basis data? Tindakan ini bersifat permanen pada backend Laravel.
            </p>

            {/* Tombol Aksi Konfirmasi */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingProduct(null)}
                className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold py-2.5 text-xs rounded-none transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleExecuteDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:bg-rose-300 text-white font-semibold py-2.5 text-xs rounded-none transition shadow-sm cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <BrandLoader size="xs" inverted />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Ya, Hapus Produk</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
