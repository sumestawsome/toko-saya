import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../utils/ProductContext";
import { useQuery } from "@tanstack/react-query";
import { formatImageUrl, PLACEHOLDER_IMAGE } from "../../config/api";
import BrandLoader from "../../components/BrandLoader";
import toast from "react-hot-toast";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateProduct, getProductById, getCategories } = useProducts();

  // State data formulir produk
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category_id: "",
    description: "",
    img: null,
  });

  // State gambar
  const [currentImage, setCurrentImage] = useState("");
  const [newImagePreview, setNewImagePreview] = useState(null);

  // Opsi input gambar: "url" (default) atau "file"
  const [imageInputMode, setImageInputMode] = useState("url");
  const [imageUrlInput, setImageUrlInput] = useState("");

  // State galat validasi 422 & loading
  const [errors, setErrors] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil daftar kategori dinamis dari API backend
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  // Ambil detail data produk saat halaman pertama kali dibuka
  useEffect(() => {
    let isMounted = true;

    const fetchDetail = async () => {
      try {
        setLoadingData(true);
        const data = await getProductById(id);
        if (!isMounted) return;

        setFormData({
          name: data.name || "",
          price: data.price || "",
          stock: data.stock || "",
          category_id:
            data.category?.id ||
            data.category?.category_id ||
            data.category_id ||
            "",
          description: data.description || "",
          img: null,
        });

        const raw = data.image_url || data.img_url || data.img || "";
        setCurrentImage(formatImageUrl(raw));

        if (raw && (raw.startsWith("http://") || raw.startsWith("https://"))) {
          setImageInputMode("url");
          setImageUrlInput(raw);
        } else {
          setImageInputMode("url");
          setImageUrlInput("");
        }
      } catch (err) {
        toast.error("Gagal memuat detail data produk dari server.");
      } finally {
        if (isMounted) setLoadingData(false);
      }
    };

    if (id) {
      fetchDetail();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Handler input field teks biasa
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handler input teks link URL gambar
  const handleImageUrlChange = (e) => {
    const val = e.target.value;
    setImageUrlInput(val);
    if (errors.img || errors.image_url || errors.img_url) {
      setErrors((prev) => ({ ...prev, img: null, image_url: null, img_url: null }));
    }
  };

  // Handler input berkas file gambar
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

  // Handler pengiriman perubahan data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "img" && value !== null && value !== "") {
        payload.append(key, value);
      }
    });

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
      await updateProduct(id, payload);
      toast.success("Produk berhasil diperbarui!");
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
          error.response?.data?.message || "Gagal memperbarui data produk."
        );
      }
    }
  };

  if (loadingData) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <BrandLoader text={`Memuat data produk #${id}...`} size="md" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 font-['Canva_Sans',sans-serif]">
      {/* Header Halaman */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 border border-indigo-200 inline-block mb-1">
            Modul Admin • Edit ID #{id}
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Perbarui Data Produk
          </h1>
        </div>
        <Link
          to="/admin/dashboard"
          className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-none transition"
        >
          ← Kembali ke Dashboard
        </Link>
      </div>

      {/* Formulir Update Bersih TokoSaya */}
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

        {/* 2. Pilihan Kategori */}
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
            placeholder="Deskripsi produk..."
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
              <div>
                <input
                  type="file"
                  name="img"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-100 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Pilih file baru jika ingin mengganti gambar produk.
                </p>
              </div>
            )}

            {/* Kotak Pratinjau Gambar Langsung */}
            {(imageInputMode === "url"
              ? imageUrlInput.trim() || currentImage
              : newImagePreview || currentImage) && (
              <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
                <div className="shrink-0 text-center">
                  <img
                    src={
                      imageInputMode === "url"
                        ? imageUrlInput.trim() || currentImage
                        : newImagePreview || currentImage
                    }
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
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {imageInputMode === "url"
                      ? imageUrlInput.trim() || currentImage
                      : newImagePreview
                      ? "Berkas lokal terpilih"
                      : currentImage}
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

        {/* Tombol Simpan Perubahan */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold text-xs rounded-none shadow-sm transition cursor-pointer disabled:bg-indigo-300"
          >
            {isSubmitting ? "Menyimpan Perubahan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
