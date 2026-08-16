"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { setAuthLoading, setUser } from "@/store/authSlice";
import { hydrate, type CartLine } from "@/store/cartSlice";

const CART_KEY = "nck-cart";

function SessionBoot() {
  useEffect(() => {
    const raw = window.localStorage.getItem(CART_KEY);
    if (raw) {
      try {
        store.dispatch(hydrate(JSON.parse(raw) as CartLine[]));
      } catch {
        store.dispatch(hydrate([]));
      }
    } else {
      store.dispatch(hydrate([]));
    }

    store.dispatch(setAuthLoading());
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data: { user: { id: string; name: string; email: string } | null }) => {
        store.dispatch(setUser(data.user));
      })
      .catch(() => store.dispatch(setUser(null)));

    return store.subscribe(() => {
      const { lines, hydrated } = store.getState().cart;
      if (hydrated) {
        window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
      }
    });
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionBoot />
      {children}
    </Provider>
  );
}
