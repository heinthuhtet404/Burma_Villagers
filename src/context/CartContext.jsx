import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "burma-villagers-cart";

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product, size, color, qty = 1 } = action.payload;

      if (!product) return state;

      const key = `${product.id}-${size}-${color}`;
      const existing = state.find((item) => item.key === key);

      if (existing) {
        return state.map((item) =>
          item.key === key
            ? { ...item, qty: Math.min(item.qty + qty, 10) }
            : item
        );
      }

      return [
        ...state,
        {
          key,
          id: product.id,
          slug: product.slug,           // ✅ add slug
          name: product.name,
          price: product.price,
          currency: product.currency,
          image: product.image,
          size,
          color,
          qty,
        },
      ];
    }

    case "REMOVE":
      return state.filter((item) => item.key !== action.payload.key);

    case "UPDATE_QTY": {
      const { key, qty } = action.payload;
      if (qty <= 0) return state.filter((item) => item.key !== key);
      return state.map((item) =>
        item.key === key ? { ...item, qty: Math.min(qty, 10) } : item
      );
    }

    case "CLEAR":
      return [];

    case "HYDRATE":
      return action.payload;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = (product, { size, color, qty = 1 }) =>
    dispatch({ type: "ADD", payload: { product, size, color, qty } });

  const remove = (key) => dispatch({ type: "REMOVE", payload: { key } });

  const updateQty = (key, qty) =>
    dispatch({ type: "UPDATE_QTY", payload: { key, qty } });

  const clear = () => dispatch({ type: "CLEAR" });

  const count = items.reduce((sum, item) => sum + item.qty, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, add, remove, updateQty, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}