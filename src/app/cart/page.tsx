"use client";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { Button } from "@heroui/react";
import CheckoutItem from "@/components/features/checkout/CheckoutItem";
import CheckoutSummary from "@/components/layout/CheckoutSummary";

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">
          Looks like you have not added any products to your cart yet.
        </p>
        <Link href="/all">
          <Button color="primary" variant="flat">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-grow">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Cart Items ({totalItems})
              </h2>
              <Button
                color="danger"
                variant="ghost"
                size="sm"
                onPress={() => clearCart()}
              >
                Clear Cart
              </Button>
            </div>

            <div className="space-y-6">
              {items.map((item) => (
                <CheckoutItem item={item} key={`${item.id}-checkout-item`} />
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <CheckoutSummary totalPrice={totalPrice} />
      </div>
    </div>
  );
}
