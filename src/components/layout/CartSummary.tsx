import { Button } from "@heroui/react";
import Link from "next/link";

export default function CartSummary(props: {
  totalPrice: number;
  hideButtons?: boolean;
}) {
  const { totalPrice, hideButtons } = props;
  return (
    <div className="w-full lg:w-96 flex-shrink-0">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 sticky top-24">
        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {!hideButtons && (
          <>
            <Link href="/checkout">
              <Button color="primary" className="w-full mt-6">
                Proceed to Checkout
              </Button>
            </Link>

            <Link href="/all">
              <Button variant="ghost" className="w-full mt-3">
                Continue Shopping
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
