"use client";

import Link from "next/link";
import React from "react";
import styles from "./NavBar.module.css";
import { usePathname } from "next/navigation";
const NavBar = () => {
  const pathname = usePathname();

  // Styles
  const nav = "flex grow justify-end";
  const navList = "flex list-none gap-1 p-1 m-1";
  const navItem = "text-base relative m-2";

  return (
    <nav className={nav}>
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
