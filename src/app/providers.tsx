"use client";
import { HeroUIProvider } from "@heroui/react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <HeroUIProvider navigate={router.push}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </HeroUIProvider>
  );
}
