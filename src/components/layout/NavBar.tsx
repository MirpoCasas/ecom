"use client";

import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Link,
  Navbar,
  NavbarItem,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Badge,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ui/ThemeToggle";
import { useCartStore } from "@/store/cartStore";
import NextLink from "next/link";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCartStore();

  const menuItems = ["All Products", "Contact"];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="full" isBordered>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
        <NavbarBrand className="hidden md:flex">
          <NextLink href="/" passHref>
            <p className="font-bold text-inherit cursor-pointer hover:text-primary">
              E-commerce example
            </p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={pathname === "/all"}>
          <Link
            href="/all"
            as={NextLink}
            underline={pathname === "/all" ? "always" : "hover"}
          >
            All Products
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="flex items-center justify-center w-[150px]">
          <ThemeToggle />
        </NavbarItem>
        <NavbarItem>
          <Badge content={totalItems > 0 ? totalItems : null} color="primary" hidden={totalItems === 0}>
            <Button
              variant="bordered"
              className="min-w-0 min-h-0"
              as={NextLink}
              href="/cart"
            >
              <FontAwesomeIcon icon={faShoppingCart} />
            </Button>
          </Badge>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href={item === "All Products" ? "/all" : "#"}
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
