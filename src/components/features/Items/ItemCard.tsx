"use client";

import { Product } from "@/types/products";
import { useCartStore } from "@/store/cartStore";
import { Button, Card, CardBody } from "@heroui/react";
import { useState, useEffect } from "react";

interface ItemCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ItemCard({ product, showAddToCart = true }: ItemCardProps) {
  const { id, thumbnail, title, price, brand, discountPercentage } = product;
  const { addItem, items, updateItemQuantity, removeItem } = useCartStore();
  const [itemQuantity, setItemQuantity] = useState(0);

  // Update quantity when cart state changes
  useEffect(() => {
    const cartItem = items.find(item => item.id === id);
    setItemQuantity(cartItem ? cartItem.quantity : 0);
  }, [items, id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleIncrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateItemQuantity(id, itemQuantity + 1);
  };

  const handleDecrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (itemQuantity > 0) {
      removeItem(id);
    }
  };

  return (
    <a href={`/item/${id}`} className="block">
      <Card className="min-w-64 w-full max-w-64 shadow-lg rounded-lg p-4 m-0 border-2 border-gray-200 h-full transition-shadow hover:shadow-xl">
        <CardBody className="p-0">
          <div className="flex flex-col">
            <div className="relative w-full h-48 mb-4">
              <img
                src={thumbnail || "https://via.placeholder.com/300x200"}
                alt={title}
                className="w-auto h-full object-cover rounded-md"
              />
              {discountPercentage > 0 && (
                <span className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                  {discountPercentage.toFixed(0)}% OFF
                </span>
              )}
            </div>
            <h2 className="text-lg font-medium truncate">{title}</h2>
            <p className="text-gray-600 text-sm mb-1">{brand}</p>
            <p className="text-gray-800 font-bold mb-3">${price.toFixed(2)}</p>
            
            {showAddToCart && (
              <div className="mt-auto" onClick={(e) => e.preventDefault()}>
                {itemQuantity === 0 ? (
                  <Button 
                    color="primary"
                    variant="flat"
                    size="sm"
                    className="w-full mt-2"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center justify-center mt-2">
                    <Button 
                      color="primary" 
                      variant="ghost"
                      size="sm"
                      onClick={handleDecrementQuantity}
                      className="min-w-0 w-9 h-9 flex items-center justify-center"
                    >
                      -
                    </Button>
                    <span className="mx-3">{itemQuantity}</span>
                    <Button 
                      color="primary" 
                      variant="ghost"
                      size="sm"
                      onClick={handleIncrementQuantity}
                      className="min-w-0 w-9 h-9 flex items-center justify-center"
                    >
                      +
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </a>
  );
}
