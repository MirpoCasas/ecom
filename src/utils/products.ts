import { CartItem } from "@/store/cartStore";

// Get quantity of a product in cart
export const getProductQuantity = (
  items: CartItem[],
  productId: number
): number => {
  const cartItem = items.find((item) => item.id === productId);
  return cartItem ? cartItem.quantity : 0;
};
