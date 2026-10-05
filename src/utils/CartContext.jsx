import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem("toko_saya_cart");
            return savedCart ? JSON.parse(savedCart) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem("toko_saya_cart", JSON.stringify(cart));
        } catch (error) {
            console.error("Gagal menyimpan keranjang ke localStorage:", error);
        }
    }, [cart]);

    // Menambah barang ke keranjang (+1 jika sudah ada)
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex((item) => item.id === product.id);
            if (existingIndex > -1) {
                const updated = [...prevCart];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    qty: (updated[existingIndex].qty || 1) + 1,
                };
                return updated;
            } else {
                return [
                    ...prevCart,
                    {
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        rawPrice: product.rawPrice,
                        img: product.img,
                        category_name: product.category_name,
                        seller: product.seller,
                        qty: 1,
                    },
                ];
            }
        });
    };

    // Menghapus item dari keranjang berdasarkan ID
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    // Mengubah kuantitas item (hapus otomatis jika newQty <= 0)
    const updateQty = (productId, newQty) => {
        if (newQty <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, qty: newQty } : item
            )
        );
    };

    // Mengosongkan seluruh isi keranjang
    const clearCart = () => {
        setCart([]);
    };

    // Total akumulasi kuantitas seluruh item
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

    // Total akumulasi biaya Rupiah
    const totalPrice = cart.reduce(
        (sum, item) => sum + (item.rawPrice || 0) * (item.qty || 0),
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQty,
                clearCart,
                totalQty,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart harus digunakan di dalam CartProvider");
    }
    return context;
}
