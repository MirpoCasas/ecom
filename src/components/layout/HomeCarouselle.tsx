import Link from "next/link";
import ItemCarouselle from "../features/Items/ItemCarouselle";
import { Button } from "@heroui/react";

export default function HomeCarouselle() {
  return (
    <div className="p-10 w-full">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl my-5">Check our latest products</h2>
        <Link href="/all">
          <Button color="primary" variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <ItemCarouselle />
    </div>
  );
}
