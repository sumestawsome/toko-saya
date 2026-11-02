import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../utils/ProductContext";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function ProductForm() {
  const { addProduct, getCategories } = useProducts();
  const navigate = useNavigate();

  // State data formulir produk
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category_id: "",
    description: "",
    img: null,
  });

  // State pesan validasi 422 dari backend Laravel
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Ambil daftar kategori secara dinamis dari API backend via React Query
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Handler perubahan nilai input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handler pengiriman data form multipart ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        data.append(key, value);
      }
    });

    try {
      await addProduct(data);
      toast.success("Produk berhasil ditambahkan ke katalog!");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 800);
    } catch (error) {
      setIsSubmitting(false);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        toast.error("Periksa kembali data yang dimasukkan (Validasi Gagal).");
      } else {
        toast.error(
          error.response?.data?.message || "Gagal menyimpan produk ke server."
        );
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 font-['Canva_Sans',sans-serif]">
      {/* Header Halaman */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 border border-indigo-200 inline-block mb-1">
            Modul Admin • BAB IV
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Tambah Produk Baru
          </h1>
        </div>
        <Link
          to="/admin/dashboard"
          className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-none transition"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Formulir Bersih TokoSaya */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 p-6 md:p-8 shadow-sm space-y-4 rounded-none"
      >
        {/* 1. Nama Produk */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nama Produk <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Contoh: Sepatu Sneakers Running Pastel"
            value={formData.name}
            onChange={handleChange}
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

        {/* 2. Pilihan Kategori Dinamis */}
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
              placeholder="Contoh: 350000"
              value={formData.price}
              onChange={handleChange}
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
              placeholder="Contoh: 20"
              value={formData.stock}
              onChange={handleChange}
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
            placeholder="Tuliskan spesifikasi detail barang, material, dan informasi garansi..."
            value={formData.description}
            onChange={handleChange}
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

        {/* 5. Upload Berkas Foto */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Foto Produk (JPG, PNG, WebP • Maks. 2MB)
          </label>
          <div className="p-3 bg-slate-50 border border-slate-200">
            <input
              type="file"
              name="img"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
            />
            {previewUrl && (
              <div className="mt-3">
                <span className="block text-[10px] font-medium text-slate-400 mb-1">
                  Pratinjau Foto Pilihan:
                </span>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-20 h-20 object-cover border border-slate-300 bg-white"
                />
              </div>
            )}
          </div>
          {errors.img && (
            <p className="text-rose-600 text-[11px] font-medium mt-1">
              {errors.img[0]}
            </p>
          )}
        </div>

        {/* Tombol Simpan */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-xs rounded-none shadow-sm transition cursor-pointer disabled:bg-indigo-300"
          >
            {isSubmitting ? "Menyimpan ke Server..." : "Simpan Produk"}
          </button>
        </div>
      </form>
    </div>
  );
}
