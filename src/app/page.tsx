"use client";

import HomeCarouselle from "@/components/layout/HomeCarouselle";
import { ProductsResponse } from "@/types/products";
import { useEffect } from "react";
import useSWR from "swr";

export default function Home() {
  const { data } = useSWR<ProductsResponse>(
    "https://dummyjson.com/products",
    () => fetch("https://dummyjson.com/products").then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);
  return (
    <section className="bg-background">
      <div>
        <div className="w-full h-80 bg-purple-400 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold text-black">
              Welcome to E-commerce
            </h1>
            <p className="mt-4 text-lg text-secondary-foreground">
              Your one-stop shop for all things e-commerce.
            </p>
          </div>
        </div>
      </div>
      <HomeCarouselle />
    </section>
  );
}
