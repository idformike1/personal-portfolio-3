'use client';
import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import { AnimatePresence } from 'framer-motion';
import Nav from './Nav';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();

  useEffect( () => {
    if(isActive) setIsActive(false)
  }, [pathname])

  return (
    <>
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <p className={styles.copyright}>©</p>
          <div className={styles.name}>
            <p className={styles.codeBy}>Code by</p>
            <p className={styles.dennis}>Dennis</p>
            <p className={styles.snellenberg}>Snellenberg</p>
          </div>
        </div>
        <div className={styles.nav}>
          <div className={styles.el}>
            <a>Work</a>
            <div className={styles.indicator}></div>
          </div>
          <div className={styles.el}>
            <a>About</a>
            <div className={styles.indicator}></div>
          </div>
          <div className={styles.el}>
            <a>Contact</a>
            <div className={styles.indicator}></div>
          </div>
        </div>
      </div>
    </div>
    <div onClick={() => {setIsActive(!isActive)}} className={styles.button}>
        <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""}`}></div>
    </div>
    <AnimatePresence mode="wait">
        {isActive && <Nav />}
    </AnimatePresence>
    </>
  )
}
