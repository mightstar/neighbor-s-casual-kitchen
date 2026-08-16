import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getMenuItem } from "@/lib/menu";
import { cartTotals } from "@/lib/money";

export type CartLine = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  quantity: number;
  image: string;
};

export type CartState = {
  lines: CartLine[];
  hydrated: boolean;
};

const initialState: CartState = {
  lines: [],
  hydrated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<CartLine[]>) {
      state.lines = action.payload;
      state.hydrated = true;
    },
    addItem(state, action: PayloadAction<{ id: string; quantity?: number }>) {
      const item = getMenuItem(action.payload.id);
      if (!item) return;
      const quantity = action.payload.quantity ?? 1;
      const existing = state.lines.find((line) => line.id === item.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.lines.push({
          id: item.id,
          slug: item.slug,
          name: item.name,
          priceCents: item.priceCents,
          quantity,
          image: item.image,
        });
      }
    },
    setQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const line = state.lines.find((entry) => entry.id === action.payload.id);
      if (!line) return;
      if (action.payload.quantity <= 0) {
        state.lines = state.lines.filter((entry) => entry.id !== action.payload.id);
        return;
      }
      line.quantity = action.payload.quantity;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.lines = state.lines.filter((line) => line.id !== action.payload);
    },
    clearCart(state) {
      state.lines = [];
    },
  },
});

export const { hydrate, addItem, setQuantity, removeItem, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export function selectCartCount(lines: CartLine[]) {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function selectCartTotals(lines: CartLine[]) {
  return cartTotals(lines);
}
