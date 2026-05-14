import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('aurix_state') || 'null');
      if (stored) {
        if (Array.isArray(stored.cart)) setCart(stored.cart);
        if (Array.isArray(stored.favs)) setFavorites(new Set(stored.favs));
      }
    } catch (e) {}
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('aurix_state', JSON.stringify({
        cart,
        favs: Array.from(favorites),
      }));
    } catch (e) {}
  }, [cart, favorites]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(l => l.product.id === product.id);
      if (exists) return prev.map(l => l.product.id === product.id ? { ...l, qty: l.qty + 1 } : l);
      return [...prev, { product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(l => l.product.id !== id));

  const changeQty = (id, delta) => setCart(prev => prev.flatMap(l => {
    if (l.product.id !== id) return [l];
    const q = l.qty + delta;
    if (q <= 0) return [];
    return [{ ...l, qty: q }];
  }));

  const toggleFav = (id) => setFavorites(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, changeQty,
      favorites, toggleFav,
      cartOpen, setCartOpen,
      searchOpen, setSearchOpen,
      quickView, setQuickView,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
