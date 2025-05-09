import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/products';

// Define a cart item type that extends Product with quantity
export type CartItem = Product & {
  quantity: number;
};

// Define cart state and actions
type CartState = {
  // Cart data
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  
  // Cart actions
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (product: Product) => 
        set((state) => {
          // Check if product already exists in cart
          const existingItem = state.items.find((item) => item.id === product.id);
          
          if (existingItem) {
            // If product exists, increase quantity
            const updatedItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            
            return {
              items: updatedItems,
              totalItems: state.totalItems + 1,
              totalPrice: state.totalPrice + product.price,
            };
          } else {
            // If product is new, add to cart with quantity 1
            const newItem = {
              ...product,
              quantity: 1,
            };
            
            return {
              items: [...state.items, newItem],
              totalItems: state.totalItems + 1,
              totalPrice: state.totalPrice + product.price,
            };
          }
        }),
      
      removeItem: (productId: number) =>
        set((state) => {
          // Find the item
          const itemToRemove = state.items.find((item) => item.id === productId);
          
          if (!itemToRemove) return state;
          
          // If quantity is > 1, decrease quantity
          if (itemToRemove.quantity > 1) {
            const updatedItems = state.items.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            );
            
            return {
              items: updatedItems,
              totalItems: state.totalItems - 1,
              totalPrice: state.totalPrice - itemToRemove.price,
            };
          } else {
            // If quantity is 1, remove item completely
            return {
              items: state.items.filter((item) => item.id !== productId),
              totalItems: state.totalItems - 1,
              totalPrice: state.totalPrice - itemToRemove.price,
            };
          }
        }),
        
      updateItemQuantity: (productId: number, newQuantity: number) =>
        set((state) => {
          const item = state.items.find((item) => item.id === productId);
          
          if (!item) return state;
          
          const quantityDiff = newQuantity - item.quantity;
          
          // If new quantity is 0 or less, remove item
          if (newQuantity <= 0) {
            return {
              items: state.items.filter((item) => item.id !== productId),
              totalItems: state.totalItems - item.quantity,
              totalPrice: state.totalPrice - (item.price * item.quantity),
            };
          }
          
          // Update quantity
          const updatedItems = state.items.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          );
          
          return {
            items: updatedItems,
            totalItems: state.totalItems + quantityDiff,
            totalPrice: state.totalPrice + (quantityDiff * item.price),
          };
        }),
        
      clearCart: () =>
        set(() => ({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        })),
    }),
    {
      name: 'ecommerce-cart-storage', // Name for localStorage key
    }
  )
);