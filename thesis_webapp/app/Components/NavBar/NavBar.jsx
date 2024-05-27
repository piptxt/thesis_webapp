"use client";

import Link from "next/link";
import React from "react";
import styles from "./NavBar.module.css";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();

  // Updated styles
  const nav = "flex items-center justify-between shadow-sm bg-white px-10"; // Ensures the space between items
  const navList = "flex list-none gap-1 p-1 m-1 ml-auto mr-20"; // Added margin-left to auto and margin-right for spacing
  const navItem = "text-base relative m-2";
  const logoStyle = "h-20 w-45 ml-20";

  return (
    <nav className={nav}>
      <Link href="/">
        <img src="/images/logo-openlaw.png" alt="Logo" className={logoStyle} />
      </Link>
      <ul className={navList}>
        <li className={navItem}>
          <Link
            href="/"
            className={pathname === "/" ? styles.active : styles.link}
          >
            Home
          </Link>
        </li>
        <li className={navItem}>
          <Link
            href="/about"
            className={pathname === "/about" ? styles.active : styles.link}
          >
            About
          </Link>
        </li>
        <li className={navItem}>
          <Link
            href="/collection"
            className={pathname === "/collection" ? styles.active : styles.link}
          >
            Collection
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
