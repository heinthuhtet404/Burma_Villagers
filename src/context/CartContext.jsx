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

      // ✅ id မပါရင် လုံးဝ မထည့်
      const productId = product.id ?? product._id ?? null;
      if (!productId) {
        console.warn("[cart] product has no id — not adding", product);
        return state;
      }

      // ✅ undefined ကို null ပြောင်း (key နဲ့ JSON အတွက်)
      const normalizedSize = size ?? null;
      const normalizedColor = color ?? null;

      const key = [
        productId,
        normalizedSize ?? "nosize",
        normalizedColor ?? "nocolor",
      ].join("-");

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
          id: productId,
          slug: product.slug ?? null,
          name: product.name,
          price: product.price,
          currency: product.currency,
          image: product.image,
          size: normalizedSize,   // ✅ null (undefined မဟုတ်)
          color: normalizedColor, // ✅ null
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

    case "HYDRATE": {
      // ✅ ဟောင်းတဲ့ cart data ကို sanitize
      const incoming = Array.isArray(action.payload)
        ? action.payload
        : [];
      return incoming
        .filter((item) => item && item.id)
        .map((item) => ({
          ...item,
          size: item.size ?? null,
          color: item.color ?? null,
          qty: Number(item.qty) || 1,
          key:
            item.key ||
            [
              item.id,
              item.size ?? "nosize",
              item.color ?? "nocolor",
            ].join("-"),
        }));
    }

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

  const add = (product, options = {}) =>
    dispatch({
      type: "ADD",
      payload: {
        product,
        size: options.size ?? null,
        color: options.color ?? null,
        qty: options.qty ?? 1,
      },
    });

  const remove = (key) => dispatch({ type: "REMOVE", payload: { key } });

  const updateQty = (key, qty) =>
    dispatch({ type: "UPDATE_QTY", payload: { key, qty } });

  const clear = () => dispatch({ type: "CLEAR" });

  const count = items.reduce((sum, item) => sum + (item.qty || 0), 0);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 0),
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