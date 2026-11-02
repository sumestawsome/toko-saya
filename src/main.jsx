import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Provider State Aplikasi
import { AuthProvider } from "./utils/AuthContext";
import { CartProvider } from "./utils/CartContext";
import { ProductProvider } from "./utils/ProductContext";

// Konfigurasi TanStack React Query & React Hot Toast (Modul BAB IV)
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <App />
              <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                  duration: 3500,
                  style: {
                    borderRadius: "0px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
                    color: "#0F172A",
                    fontSize: "13px",
                    fontWeight: 600,
                  },
                }}
              />
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
