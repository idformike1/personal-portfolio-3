'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from './style.module.scss';
import { AnimatePresence } from 'framer-motion';
import Nav from './Nav';
import { usePathname } from 'next/navigation';
import Magnetic from '@/components/common/Magnetic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const button = useRef(null);
  const nav = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initial state: hamburger hidden, nav links visible
    gsap.set(button.current, { scale: 0, autoAlpha: 0 });
    gsap.set(nav.current, { opacity: 1, pointerEvents: 'auto' });

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: '+=150',
      onLeave: () => {
        gsap.to(button.current, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(nav.current, { opacity: 0, pointerEvents: 'none', duration: 0.2 });
      },
      onEnterBack: () => {
        gsap.to(button.current, { scale: 0, autoAlpha: 0, duration: 0.25, ease: 'power2.in' });
        gsap.to(nav.current, { opacity: 1, pointerEvents: 'auto', duration: 0.2 });
        setIsActive(false);
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useEffect(() => {
    if (isActive) setIsActive(false);
  }, [pathname]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.header}>
          <Magnetic>
            <Link href="/" className={styles.logo}>
              <p className={styles.copyright}>©</p>
              <div className={styles.name}>
                <p className={styles.codeBy}>Code by</p>
                <p className={styles.dennis}>Dennis</p>
              </div>
            </Link>
          </Magnetic>

          {/* Desktop nav links — hidden after 150px scroll */}
          <div ref={nav} className={styles.nav}>
            <Magnetic>
              <div className={styles.el}>
                <Link href="/work">Work</Link>
                <div className={styles.indicator}></div>
              </div>
            </Magnetic>
            <Magnetic>
              <div className={styles.el}>
                <Link href="/about">About</Link>
                <div className={styles.indicator}></div>
              </div>
            </Magnetic>
            <Magnetic>
              <div className={styles.el}>
                <Link href="/contact">Contact</Link>
                <div className={styles.indicator}></div>
              </div>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Hamburger — appears after 150px scroll */}
      <div
        ref={button}
        onClick={() => setIsActive(!isActive)}
        className={styles.button}
        style={{ pointerEvents: 'auto' }}
      >
        <div className={`${styles.burger} ${isActive ? styles.burgerActive : ''}`}></div>
      </div>

      <AnimatePresence mode="wait">
        {isActive && <Nav />}
      </AnimatePresence>
    </>
  );
}
