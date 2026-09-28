"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({
  slug,
  title,
  price,
  disabled,
}: {
  slug: string;
  title: string;
  price: number;
  disabled?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      disabled={disabled}
      onClick={() => {
        addItem({ slug, title, price });
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className="btn-cyan flex items-center justify-center gap-1.5 px-4 py-2.5 font-bn text-body-md font-medium disabled:opacity-40 disabled:pointer-events-none"
    >
      {added ? (
        <Check className="h-4 w-4" strokeWidth={2.5} />
      ) : (
        <ShoppingCart className="h-4 w-4" strokeWidth={2} />
      )}
      {added ? "যোগ হয়েছে" : "কার্টে যোগ করুন"}
    </button>
  );
}
