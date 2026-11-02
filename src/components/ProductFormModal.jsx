import React, { useState, useEffect } from "react";
import { useProducts } from "../utils/ProductContext";
import { useQuery } from "@tanstack/react-query";
import { formatImageUrl } from "../config/api";
import toast from "react-hot-toast";

export default function ProductFormModal({
  isOpen,
  mode = "add", // "add" | "edit"
  productData = null,
  onClose,
  onSuccess,
}) {
  const { addProduct, updateProduct, getCategories } = useProducts();

  // Ini untuk form modal tambah dan edit produk
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category_id: "",
    description: "",
    img: null,
  });

  // Foto produk lama dan foto pratinjau baru
  const [currentImage, setCurrentImage] = useState("");
  const [newImagePreview, setNewImagePreview] = useState(null);

  // Pesan error validasi dari server
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil daftar kategori produk untuk dropdown
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Isi data ke form saat modal dibuka
  useEffect(() => {
    if (!isOpen) {
      setNewImagePreview(null);
      setErrors({});
      return;
    }

    if (mode === "edit" && productData) {
      setFormData({
        name: productData.name || "",
        price: productData.price || "",
        stock: productData.stock || "",
        category_id:
          productData.category?.id ||
          productData.category?.category_id ||
          productData.category_id ||
          "",
        description: productData.description || "",
        img: null,
      });
      setCurrentImage(formatImageUrl(productData.image_url || productData.img_url));
      setNewImagePreview(null);
    } else {
      // Mode Tambah: form kosong bersih
      setFormData({
        name: "",
        price: "",
        stock: "",
        category_id: "",
        description: "",
        img: null,
      });
      setCurrentImage("");
      setNewImagePreview(null);
    }
    setErrors({});
  }, [isOpen, mode, productData]);

  if (!isOpen) return null;

  // Atur perubahan input teks dan file gambar
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) {
        setNewImagePreview(URL.createObjectURL(file));
      } else {
        setNewImagePreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Simpan data produk ke server (tambah atau edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        payload.append(key, value);
      }
    });

    try {
      if (mode === "edit" && productData?.id) {
        await updateProduct(productData.id, payload);
        toast.success("Produk berhasil diperbarui!");
      } else {
        await addProduct(payload);
        toast.success("Produk berhasil ditambahkan ke katalog!");
      }

      setIsSubmitting(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setIsSubmitting(false);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        toast.error("Periksa kembali data yang dimasukkan (Validasi gagal).");
      } else {
        toast.error(
          error.response?.data?.message ||
            (mode === "edit"
              ? "Gagal memperbarui produk di server."
              : "Gagal menyimpan produk baru.")
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-['Canva_Sans',sans-serif]">
      {/* Container Modal */}
      <div className="bg-white border border-slate-200 rounded-none shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/75">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 border border-indigo-200">
                {mode === "edit" ? "Mode Edit" : "Mode Tambah"}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {mode === "edit" ? `ID Produk: #${productData?.id}` : "Katalog Baru"}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
              {mode === "edit" ? "Perbarui Informasi Produk" : "Tambah Produk Baru"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer rounded-none"
            aria-label="Tutup Modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* 1. Nama Produk */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Produk <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Sepatu Sneakers Running Pastel Pink"
              className={`w-full bg-white border rounded-none px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition ${
                errors.name
                  ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                  : "border-slate-300 focus:border-[#4F46E5]"
              }`}
            />
            {errors.name && (
              <p className="text-rose-600 text-[11px] font-medium mt-1">
                {errors.name[0]}
              </p>
            )}
          </div>

          {/* 2. Kategori Produk (Dinamis dari API) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kategori Produk <span className="text-rose-600">*</span>
            </label>
            <select
              name="category_id"
              required
              value={formData.category_id}
              onChange={handleChange}
              disabled={loadingCategories}
              className={`w-full bg-white border rounded-none px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none transition ${
                errors.category_id
                  ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                  : "border-slate-300 focus:border-[#4F46E5]"
              }`}
            >
              <option value="">
                {loadingCategories ? "Memuat kategori..." : "-- Pilih Kategori --"}
              </option>
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
            {errors.category_id && (
              <p className="text-rose-600 text-[11px] font-medium mt-1">
                {errors.category_id[0]}
              </p>
            )}
          </div>

          {/* 3. Baris Harga & Stok */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Harga (Rp) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="Contoh: 350000"
                className={`w-full bg-white border rounded-none px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition ${
                  errors.price
                    ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                    : "border-slate-300 focus:border-[#4F46E5]"
                }`}
              />
              {errors.price && (
                <p className="text-rose-600 text-[11px] font-medium mt-1">
                  {errors.price[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jumlah Stok <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Contoh: 20"
                className={`w-full bg-white border rounded-none px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition ${
                  errors.stock
                    ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                    : "border-slate-300 focus:border-[#4F46E5]"
                }`}
              />
              {errors.stock && (
                <p className="text-rose-600 text-[11px] font-medium mt-1">
                  {errors.stock[0]}
                </p>
              )}
            </div>
          </div>

          {/* 4. Deskripsi Produk */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deskripsi Produk
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Deskripsi fitur, material, atau spesifikasi barang..."
              className={`w-full bg-white border rounded-none p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition resize-none ${
                errors.description
                  ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                  : "border-slate-300 focus:border-[#4F46E5]"
              }`}
            />
            {errors.description && (
              <p className="text-rose-600 text-[11px] font-medium mt-1">
                {errors.description[0]}
              </p>
            )}
          </div>

          {/* 5. Foto Produk */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Berkas Foto Produk (JPG, PNG, WebP • Maks. 2MB)
            </label>

            <div className="flex flex-wrap items-center gap-3 p-3 bg-slate-50 border border-slate-200">
              {/* Tampilan Gambar Lama (Mode Edit) */}
              {mode === "edit" && currentImage && !newImagePreview && (
                <div className="shrink-0 text-center">
                  <span className="block text-[10px] font-medium text-slate-400 mb-1">
                    Foto Aktif
                  </span>
                  <img
                    src={currentImage}
                    alt="Foto Aktif"
                    className="w-16 h-16 object-cover border border-slate-300 bg-white"
                  />
                </div>
              )}

              {/* Tampilan Pratinjau Gambar Baru */}
              {newImagePreview && (
                <div className="shrink-0 text-center">
                  <span className="block text-[10px] font-semibold text-indigo-600 mb-1">
                    Foto Baru
                  </span>
                  <img
                    src={newImagePreview}
                    alt="Pratinjau Baru"
                    className="w-16 h-16 object-cover border border-indigo-500 ring-2 ring-indigo-100 bg-white shadow-xs"
                  />
                </div>
              )}

              <div className="flex-1 min-w-[200px]">
                <input
                  type="file"
                  name="img"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  {mode === "edit"
                    ? "Kosongkan jika tidak ingin mengubah foto produk."
                    : "Pilih berkas foto untuk mempercantik katalog."}
                </p>
              </div>
            </div>
            {errors.img && (
              <p className="text-rose-600 text-[11px] font-medium mt-1">
                {errors.img[0]}
              </p>
            )}
          </div>

          {/* Footer Tombol Aksi */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-none cursor-pointer transition disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-semibold rounded-none shadow-sm cursor-pointer transition disabled:bg-indigo-300"
            >
              {isSubmitting
                ? "Menyimpan ke Server..."
                : mode === "edit"
                ? "Simpan Perubahan"
                : "Simpan Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

