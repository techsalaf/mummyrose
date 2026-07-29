import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  product_id: string;
  slug: string;
  name: string;
  image: string;
  unit_price: number;
  variant: string | null;
  quantity: number;
};

const CART_KEY = "mr.cart.v1";
const WISH_KEY = "mr.wishlist.v1";
const RECENT_KEY = "mr.recent.v1";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  wishlist: string[];
  recentlyViewed: string[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (product_id: string, variant: string | null, quantity: number) => void;
  removeItem: (product_id: string, variant: string | null) => void;
  clear: () => void;
  toggleWishlist: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  pushRecentlyViewed: (slug: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(read<CartItem[]>(CART_KEY, []));
    setWishlist(read<string[]>(WISH_KEY, []));
    setRecentlyViewed(read<string[]>(RECENT_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product_id === item.product_id && i.variant === item.variant);
      if (idx === -1) return [...prev, { ...item, quantity }];
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
      return next;
    });
  }, []);

  const updateQuantity = useCallback((product_id: string, variant: string | null, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => !(i.product_id === product_id && i.variant === variant))
        : prev.map((i) => (i.product_id === product_id && i.variant === variant ? { ...i, quantity } : i)),
    );
  }, []);

  const removeItem = useCallback((product_id: string, variant: string | null) => {
    setItems((prev) => prev.filter((i) => !(i.product_id === product_id && i.variant === variant)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const toggleWishlist = useCallback((slug: string) => {
    setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const pushRecentlyViewed = useCallback((slug: string) => {
    setRecentlyViewed((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 8));
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0),
      wishlist,
      recentlyViewed,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      toggleWishlist,
      isWishlisted: (slug: string) => wishlist.includes(slug),
      pushRecentlyViewed,
    }),
    [items, wishlist, recentlyViewed, addItem, updateQuantity, removeItem, clear, toggleWishlist, pushRecentlyViewed],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
