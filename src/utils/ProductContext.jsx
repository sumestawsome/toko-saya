import React, { createContext, useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // Ambil semua daftar produk dari server
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await apiClient.get("/products?all=true");
      return Array.isArray(res.data) ? res.data : res.data.data || [];
    },
  });

  // Ambil produk dengan filter kategori, pencarian, dan nomor halaman
  const getProducts = async ({
    page = 1,
    limit = 10,
    category_id = "",
    keyword = "",
  } = {}) => {
    let url = `/products?page=${page}&limit=${limit}`;
    if (category_id && category_id !== "all" && category_id !== "Semua") {
      url += `&category_id=${category_id}`;
    }
    if (keyword && keyword.trim() !== "") {
      url += `&keyword=${encodeURIComponent(keyword.trim())}`;
    }
    const res = await apiClient.get(url);
    return res.data;
  };

  // Ambil detail satu produk berdasarkan ID
  const getProductById = async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data?.data || res.data;
  };

  // Ambil daftar kategori produk untuk dropdown
  const getCategories = async () => {
    const res = await apiClient.get("/categories");
    return Array.isArray(res.data) ? res.data : res.data.data || [];
  };

  // Tambah produk baru ke database
  const addProduct = async (formData) => {
    try {
      const response = await apiClient.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Segarkan data produk agar tampilan langsung up-to-date
      queryClient.invalidateQueries(["products"]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Perbarui data produk lama
  const updateProduct = async (id, formData) => {
    try {
      const response = await apiClient.post(
        `/products/${id}?_method=PUT`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // Segarkan data produk
      queryClient.invalidateQueries(["products"]);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Hapus produk dari database
  const deleteProduct = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        isError,
        error,
        refetchProducts,
        getProductById,
        getProducts,
        getCategories,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts harus dipakai di dalam ProductProvider");
  }
  return context;
};
