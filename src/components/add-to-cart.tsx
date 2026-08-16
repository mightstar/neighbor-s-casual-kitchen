"use client";

import { useState } from "react";
import { addItem } from "@/store/cartSlice";
import { useAppDispatch } from "@/store/hooks";

export function AddToCart({
  id,
  name,
  compact = false,
}: {
  id: string;
  name: string;
  compact?: boolean;
}) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        dispatch(addItem({ id }));
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className={
        compact
          ? "rounded-full bg-forest px-3 py-1.5 text-xs text-cream hover:bg-forest-deep"
          : "rounded-full bg-copper px-5 py-2.5 text-sm text-white hover:bg-copper-deep"
      }
    >
      {added ? "Added" : compact ? "Add" : `Add ${name} to cart`}
    </button>
  );
}
