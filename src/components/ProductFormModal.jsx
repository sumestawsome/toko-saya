import React, { useState, useEffect } from "react";
import { useProducts } from "../utils/ProductContext";
import { useQuery } from "@tanstack/react-query";
import { formatImageUrl, PLACEHOLDER_IMAGE } from "../config/api";
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

  // Opsi input gambar: "url" (default) atau "file"
  const [imageInputMode, setImageInputMode] = useState("url");
  const [imageUrlInput, setImageUrlInput] = useState("");

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
      setImageUrlInput("");
      setErrors({});
      return;
    }

    if (mode === "edit" && productData) {
      const existingImg = productData.image_url || productData.img_url || productData.img || "";
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

      setCurrentImage(formatImageUrl(existingImg));
      setNewImagePreview(null);

      // Jika data awal sudah berupa URL internet (misal link Unsplash), masukkan ke input URL
      if (existingImg && (existingImg.startsWith("http://") || existingImg.startsWith("https://"))) {
        setImageInputMode("url");
        setImageUrlInput(existingImg);
      } else {
        setImageInputMode("url");
        setImageUrlInput("");
      }
    } else {
      // Mode Tambah: form kosong bersih, default opsi URL gambar
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
      setImageInputMode("url");
      setImageUrlInput("");
    }
    setErrors({});
  }, [isOpen, mode, productData]);

  if (!isOpen) return null;

  // Atur perubahan input teks
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Atur perubahan input teks URL Gambar
  const handleImageUrlChange = (e) => {
    const val = e.target.value;
    setImageUrlInput(val);
    if (errors.img || errors.image_url || errors.img_url) {
      setErrors((prev) => ({ ...prev, img: null, image_url: null, img_url: null }));
    }
  };

  // Atur perubahan input file gambar lokal
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, img: file }));
      setNewImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, img: null }));
      setNewImagePreview(null);
    }

    if (errors.img) {
      setErrors((prev) => ({ ...prev, img: null }));
    }
  };

  // Simpan data produk ke server (tambah atau edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // Lewati key 'img' karena ditangani khusus sesuai mode input di bawah
      if (key !== "img" && value !== null && value !== "") {
        payload.append(key, value);
      }
    });

    // Masukkan data gambar berdasarkan opsi yang dipilih (File Upload atau URL Teks)
    if (imageInputMode === "file") {
      if (formData.img instanceof File) {
        payload.append("img", formData.img);
      }
    } else {
      const cleanUrl = imageUrlInput.trim();
      if (cleanUrl) {
        payload.append("img", cleanUrl);
        payload.append("img_url", cleanUrl);
        payload.append("image_url", cleanUrl);
      }
    }

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

  // Hitung sumber gambar untuk pratinjau instan
  const previewSource =
    imageInputMode === "url"
      ? imageUrlInput.trim() || currentImage || null
      : newImagePreview || currentImage || null;

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

          {/* 5. Foto Produk (Dukungan URL Link & Upload File) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700">
                Foto Produk <span className="text-slate-400 font-normal">(Pilih salah satu cara)</span>
              </label>

              {/* Tab Switcher Mode Input Foto */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setImageInputMode("url");
                    setFormData((prev) => ({ ...prev, img: null }));
                  }}
                  className={`px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer rounded-none ${
                    imageInputMode === "url"
                      ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  🔗 Link URL (Web/Unsplash)
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode("file")}
                  className={`px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer rounded-none ${
                    imageInputMode === "file"
                      ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  📁 Unggah File (Laptop)
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 space-y-3">
              {/* Opsi 1: Input URL Gambar Teks */}
              {imageInputMode === "url" ? (
                <div>
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={handleImageUrlChange}
                    placeholder="Tempel tautan URL gambar (misal: https://images.unsplash.com/...)"
                    className="w-full bg-white border border-slate-300 focus:border-[#4F46E5] rounded-none px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Bisa langsung tempel link foto dari Unsplash atau sumber publik internet lainnya.
                  </p>
                </div>
              ) : (
                /* Opsi 2: Unggah Berkas File */
                <div>
                  <input
                    type="file"
                    name="img"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    {mode === "edit"
                      ? "Pilih berkas baru jika ingin mengganti foto yang aktif."
                      : "Pilih file JPG, PNG, atau WebP dari perangkat Anda (Maks. 2MB)."}
                  </p>
                </div>
              )}

              {/* Kotak Pratinjau Gambar Langsung */}
              {previewSource && (
                <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
                  <div className="shrink-0 text-center">
                    <img
                      src={previewSource}
                      alt="Pratinjau Foto"
                      className="w-16 h-16 object-cover border border-indigo-500 ring-2 ring-indigo-100 bg-white shadow-xs"
                      onError={(e) => {
                        if (e.target.src !== PLACEHOLDER_IMAGE) {
                          e.target.src = PLACEHOLDER_IMAGE;
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[11px] font-semibold text-slate-800">
                      {imageInputMode === "url"
                        ? imageUrlInput.trim()
                          ? "Pratinjau Link URL Baru"
                          : "Foto Aktif Produk"
                        : newImagePreview
                        ? "Pratinjau File Baru"
                        : "Foto Aktif Produk"}
                    </span>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5" title={previewSource}>
                      {previewSource.startsWith("data:") ? "Pratinjau Gambar" : previewSource}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {(errors.img || errors.image_url) && (
              <p className="text-rose-600 text-[11px] font-medium mt-1">
                {errors.img?.[0] || errors.image_url?.[0]}
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

