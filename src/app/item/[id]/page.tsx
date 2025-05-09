"use client";
import { ImageCarousel } from "@/components/features/ImageCarouselle";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/products";
import { Button, Link } from "@heroui/react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { getProductById } from "@/lib/productAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

type Params = {
  id: string;
};

export default function ItemPage() {
  const { id } = useParams<Params>();
  const { addItem, items, updateItemQuantity, removeItem } = useCartStore();
  const [itemQuantity, setItemQuantity] = useState(0);

  // Use our API function for fetching product details
  const { data } = useSWR<Product>([`product-${id}`], () => getProductById(id));

  // Update the quantity whenever cart items change
  useEffect(() => {
    if (data && items) {
      const cartItem = items.find((item) => item.id === data.id);
      setItemQuantity(cartItem ? cartItem.quantity : 0);
    }
  }, [data, items]);

  const handleAddToCart = () => {
    if (data) {
      addItem(data);
    }
  };

  const handleIncrementQuantity = () => {
    if (data) {
      if (itemQuantity === 0) {
        addItem(data);
      } else {
        updateItemQuantity(data.id, itemQuantity + 1);
      }
    }
  };

  const handleDecrementQuantity = () => {
    if (data && itemQuantity > 0) {
      removeItem(data.id);
    }
  };

  return (
    <section className="flex flex-col gap-3 w-full min-h-screen">
      <Link href="/all" className="mt-5 ml-10" underline="hover">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Back to All Items
      </Link>
      <section className="flex w-full min-h-full justify-around items-center">
        <div className="w-[500px]">
          <ImageCarousel images={data?.images} alt={data?.title} />
        </div>
        <div className="w-[500px] flex flex-col items-start justify-center space-y-4">
          <h2 className="text-2xl">{data?.title}</h2>
          <p className="font-bold">{data?.brand}</p>
          <p className="font-light">{data?.description}</p>
          <p>
            <span className="font-bold">Price: </span>${data?.price}
          </p>

          {itemQuantity > 0 ? (
            <div className="flex items-center space-x-2">
              <Button
                color="primary"
                variant="ghost"
                size="sm"
                onPress={handleDecrementQuantity}
                className="w-10 h-10 min-w-0 flex items-center justify-center"
              >
                -
              </Button>
              <span className="w-10 text-center">{itemQuantity}</span>
              <Button
                color="primary"
                variant="ghost"
                size="sm"
                onPress={handleIncrementQuantity}
                className="w-10 h-10 min-w-0 flex items-center justify-center"
              >
                +
              </Button>
              <span className="ml-2">in cart</span>
            </div>
          ) : (
            <Button color="primary" variant="flat" onPress={handleAddToCart}>
              Add to Cart
            </Button>
          )}
        </div>
      </section>
    </section>
  );
}
