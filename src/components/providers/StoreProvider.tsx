"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CircleCheck } from "lucide-react";
import { siteConfig, type Currency } from "@/lib/config";
import { getProduct } from "@/data/products";

type CartLine = { slug: string; qty: number };
type PersistedState = { cart: CartLine[]; wishlist: string[]; compare: string[]; currency: Currency };
type Toast = { id: number; text: string };

const STORAGE_KEY = "dak-store-v1";
const MAX_COMPARE = 4;
const initialState: PersistedState = { cart: [], wishlist: [], compare: [], currency: "SAR" };

function useStoreValue() {
  const [state, setState] = useState<PersistedState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [quickView, setQuickView] = useState<string | null>(null);
  const [purchase, setPurchase] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Restore saved state once on the client.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setState({ ...initialState, ...JSON.parse(saved) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((list) => [...list, { id, text }]);
    setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 2600);
  }, []);

  const addToCart = useCallback((slug: string, qty: number) => {
    setState((s) => {
      const line = s.cart.find((l) => l.slug === slug);
      const cart = line
        ? s.cart.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l))
        : [...s.cart, { slug, qty }];
      return { ...s, cart };
    });
  }, []);

  const setCartQty = useCallback((slug: string, qty: number) => {
    setState((s) => ({ ...s, cart: s.cart.map((l) => (l.slug === slug ? { ...l, qty } : l)) }));
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setState((s) => ({ ...s, cart: s.cart.filter((l) => l.slug !== slug) }));
  }, []);

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [] })), []);

  /** Returns true when the product was added. */
  const toggleWishlist = useCallback(
    (slug: string) => {
      const added = !state.wishlist.includes(slug);
      setState((s) => ({
        ...s,
        wishlist: added ? [...s.wishlist, slug] : s.wishlist.filter((x) => x !== slug),
      }));
      return added;
    },
    [state.wishlist],
  );

  /** Returns "added", "removed" or "full". */
  const toggleCompare = useCallback(
    (slug: string) => {
      if (state.compare.includes(slug)) {
        setState((s) => ({ ...s, compare: s.compare.filter((x) => x !== slug) }));
        return "removed" as const;
      }
      if (state.compare.length >= MAX_COMPARE) return "full" as const;
      setState((s) => ({ ...s, compare: [...s.compare, slug] }));
      return "added" as const;
    },
    [state.compare],
  );

  const clearList = useCallback((list: "wishlist" | "compare") => setState((s) => ({ ...s, [list]: [] })), []);
  const setCurrency = useCallback((currency: Currency) => setState((s) => ({ ...s, currency })), []);

  const cartTotal = useMemo(
    () =>
      state.cart.reduce((sum, line) => {
        const price = getProduct(line.slug)?.price;
        return sum + (price ? price * line.qty : 0);
      }, 0),
    [state.cart],
  );

  return {
    ...state,
    hydrated,
    cartCount: state.cart.length,
    cartTotal,
    freeShipping: cartTotal >= siteConfig.freeShippingThreshold,
    toasts,
    toast,
    addToCart,
    setCartQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    toggleCompare,
    clearList,
    setCurrency,
    quickView,
    setQuickView,
    purchase,
    setPurchase,
  };
}

type Store = ReturnType<typeof useStoreValue>;
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const store = useStoreValue();
  return (
    <StoreContext.Provider value={store}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-8"
      >
        {store.toasts.map((t) => (
          <div
            key={t.id}
            className="flex animate-slide-up items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-xl"
          >
            <CircleCheck className="size-4 text-gold" />
            {t.text}
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside StoreProvider");
  return store;
}
