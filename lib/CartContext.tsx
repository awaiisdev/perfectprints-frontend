"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: number;
  name: string;
  sku?: string;
  price: string;
  image: string;
  quantity: number;
  attributes?: Record<string, string>;
  // Custom order fields (photos/names customer uploads on the product page)
  isCustomOrder?: boolean;
  customFields?: { label: string; type: "name" | "photo"; value: string }[];
}

interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: number, key?: string) => void;
  updateQty: (id: number, qty: number, key?: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

// Har cart line ki unique pehchaan — id + attributes + custom fields
// (isse alag customization wale same product ke items merge nahi hote)
function lineKey(item: Pick<CartItem, "id" | "attributes" | "customFields">) {
  return JSON.stringify({
    id: item.id,
    attributes: item.attributes || {},
    customFields: item.customFields || [],
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pp_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("pp_cart", JSON.stringify(items));
  }, [items, ready]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const key = lineKey(item);
      const existing = prev.find((i) => lineKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          lineKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // key param diya gaya hai taake same product id ki alag customized lines
  // (jaise alag naam/photo wale do custom items) galti se mix na hon
  const removeItem = (id: number, key?: string) => {
    setItems((prev) => prev.filter((i) => (key ? lineKey(i) !== key : i.id !== id)));
  };

  const updateQty = (id: number, qty: number, key?: string) => {
    if (qty < 1) return removeItem(id, key);
    setItems((prev) =>
      prev.map((i) => {
        const matches = key ? lineKey(i) === key : i.id === id;
        return matches ? { ...i, quantity: qty } : i;
      })
    );
  };

  const clearCart = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);