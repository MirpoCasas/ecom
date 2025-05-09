import { CartItem, useCartStore } from "@/store/cartStore";
import Link from "next/link";

export default function CheckoutItem(props: { item: CartItem }) {
  const { item } = props;
  const { removeItem, updateItemQuantity } = useCartStore();
  
  return (
    <div
      key={item.id}
      className="flex flex-col sm:flex-row border-b pb-6 last:border-b-0 last:pb-0"
    >
      <div className="flex-shrink-0 relative w-24 h-24 mb-4 sm:mb-0 sm:mr-6">
        <img src={item.thumbnail} alt={item.title} className="object-contain" />
      </div>

      <div className="flex-grow">
        <Link href={`/item/${item.id}`}>
          <h3 className="font-medium hover:text-blue-600 transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {item.brand}
        </p>
        <p className="font-semibold mt-2">${item.price}</p>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center border rounded">
            <button
              onClick={() => removeItem(item.id)}
              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              -
            </button>
            <span className="px-3 py-1">{item.quantity}</span>
            <button
              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
              className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              +
            </button>
          </div>
          <button
            onClick={() => updateItemQuantity(item.id, 0)}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
