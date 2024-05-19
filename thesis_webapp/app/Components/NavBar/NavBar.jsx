"use client";

import Link from 'next/link';
import React from 'react';
import styles from './NavBar.module.css';
import { usePathname } from 'next/navigation';
const NavBar = () => {
    const pathname = usePathname();
  return (
    <nav className = {styles.nav}>
      < ul className = {styles.navList}>
        <li className = {styles.navItem}><Link href="/" className={pathname === "/" ? styles.active : styles.link}>Home</Link></li>
        <li className = {styles.navItem}><Link href="/about"className={pathname === "/about" ? styles.active : styles.link}>About</Link></li>
        <li className = {styles.navItem}><Link href="/collection"className={pathname === "/collection" ? styles.active : styles.link}>Collection</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;