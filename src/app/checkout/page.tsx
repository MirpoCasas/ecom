"use client";

import CartSummary from "@/components/layout/CartSummary";
import CheckoutForm from "@/components/layout/CheckoutForm";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const { totalPrice } = useCartStore();
  return (
    <div className="flex gap-3 p-5 justify-around">
      <CheckoutForm />
      <CartSummary totalPrice={totalPrice} hideButtons />
    </div>
  );
}
