import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getFavoritesFromDB, addFavoriteDB, removeFavoriteDB } from '../services/favoritesService';
import {
  getCartFromDB,
  upsertCartItemDB,
  removeCartItemDB,
  clearCartDB,
  migrateLocalCartToDB,
} from '../services/cartService';

const AppContext = createContext(null);

function loadLocalState() {
  try {
    const stored = JSON.parse(localStorage.getItem('aurix_state') || 'null');
    return {
      cart: Array.isArray(stored?.cart) ? stored.cart : [],
      favs: new Set(Array.isArray(stored?.favs) ? stored.favs : []),
    };
  } catch {
    return { cart: [], favs: new Set() };
  }
}

function saveLocalState(cart, favorites) {
  try {
    localStorage.setItem('aurix_state', JSON.stringify({
      cart,
      favs: Array.from(favorites),
    }));
  } catch {}
}

export function AppProvider({ children }) {
  const [user,       setUser]       = useState(null);
  const [cart,       setCart]       = useState([]);
  const [favorites,  setFavorites]  = useState(new Set());
  const [cartOpen,   setCartOpen]   = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartRef = useRef(cart);

  // Mantener ref actualizada para usarla en callbacks async
  useEffect(() => { cartRef.current = cart; }, [cart]);

  // Cargar estado local al inicio
  useEffect(() => {
    const { cart: c, favs } = loadLocalState();
    setCart(c);
    setFavorites(favs);
  }, []);

  // Escuchar cambios de auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        syncUserData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await syncUserData(currentUser.id);
        } else {
          // Logout: restaurar localStorage
          const { cart: c, favs } = loadLocalState();
          setCart(c);
          setFavorites(favs);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sincronizar datos del usuario desde DB al hacer login
  async function syncUserData(userId) {
    try {
      const localCart = cartRef.current;
      if (localCart.length > 0) {
        await migrateLocalCartToDB(userId, localCart);
      }
      const [dbFavs, dbCart] = await Promise.all([
        getFavoritesFromDB(userId),
        getCartFromDB(userId),
      ]);
      setFavorites(dbFavs);
      setCart(dbCart);
    } catch (e) {
      console.warn('Error sincronizando datos de usuario:', e);
    }
  }

  // Persistir a localStorage cuando no hay usuario
  useEffect(() => {
    if (!user) saveLocalState(cart, favorites);
  }, [cart, favorites, user]);

  // ── Cart actions ──

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(l => l.product.id === product.id);
      const updated = exists
        ? prev.map(l => l.product.id === product.id ? { ...l, qty: l.qty + 1 } : l)
        : [...prev, { product, qty: 1 }];

      if (user) {
        const newQty = exists ? exists.qty + 1 : 1;
        upsertCartItemDB(user.id, product.id, newQty).catch(console.warn);
      }

      return updated;
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(l => l.product.id !== id));
    if (user) removeCartItemDB(user.id, id).catch(console.warn);
  };

  const changeQty = (id, delta) => {
    setCart(prev => {
      const updated = prev.flatMap(l => {
        if (l.product.id !== id) return [l];
        const q = l.qty + delta;
        if (q <= 0) return [];
        return [{ ...l, qty: q }];
      });

      if (user) {
        const item = updated.find(l => l.product.id === id);
        if (item) upsertCartItemDB(user.id, id, item.qty).catch(console.warn);
        else      removeCartItemDB(user.id, id).catch(console.warn);
      }

      return updated;
    });
  };

  const clearCart = async () => {
    setCart([]);
    if (user) {
      await clearCartDB(user.id);
    } else {
      saveLocalState([], favorites);
    }
  };

  // ── Favorites actions ──

  const toggleFav = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        if (user) removeFavoriteDB(user.id, id).catch(console.warn);
      } else {
        next.add(id);
        if (user) addFavoriteDB(user.id, id).catch(console.warn);
      }
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      user,
      cart, addToCart, removeFromCart, changeQty, clearCart,
      favorites, toggleFav,
      cartOpen,   setCartOpen,
      searchOpen, setSearchOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
