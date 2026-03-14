'use client';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './style.module.scss';
import gsap from 'gsap';

const routes = {
    "/": "Home",
    "/work": "Work",
    "/about": "About",
    "/contact": "Contact"
};

export default function Transition({children}) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const path = useRef(null);
    const container = useRef(null);
    const labelRef = useRef(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useLayoutEffect(() => {
        if (!isMounted || !container.current || !path.current) return;

        // Path definitions for a 100x100 viewBox
        // Entry: Dome Curve (Curved Up) -> Flat
        // Exit: Flat -> Suction Curve (Curved Down)
        const initialCurve = `M0 100 Q50 -100 100 100 L100 100 L0 100`; // Upward convex dome
        const flatPath = `M0 100 Q50 100 100 100 L100 0 L0 0`;
        const suctionCurve = `M0 0 Q50 100 100 0 L100 0 L0 0`;

        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (container.current) {
                        gsap.set(container.current, { pointerEvents: "none" });
                    }
                }
            });

            // Entry Sweep
            tl.set(container.current, { yPercent: 100, pointerEvents: "all" })
              .set(path.current, { attr: { d: initialCurve } })
              .set(labelRef.current, { opacity: 0, y: 50 })
              
              .to(container.current, {
                  yPercent: 0,
                  duration: 0.8,
                  ease: "power4.inOut"
              })
              .to(path.current, {
                  attr: { d: flatPath },
                  duration: 0.8,
                  ease: "power4.inOut"
              }, "<")
              
              // Label Reveal (During Hold)
              .to(labelRef.current, {
                  opacity: 1,
                  y: 0,
                  duration: 0.4,
                  ease: "power4.out"
              }, "-=0.2")
              
              // Exit Sweep
              .to(labelRef.current, {
                  opacity: 0,
                  y: -50,
                  duration: 0.4,
                  ease: "power4.in",
                  delay: 0.5
              })
              .to(container.current, {
                  yPercent: -100,
                  duration: 0.8,
                  ease: "power4.inOut"
              })
              .to(path.current, {
                  attr: { d: suctionCurve },
                  duration: 0.8,
                  ease: "power4.inOut"
              }, "<");
        }, container);

        return () => ctx.revert();
    }, [isMounted, pathname]);

    if (!isMounted) return null;

    const label = routes[pathname] || "Home";

    return (
        <>
            <div ref={container} className={styles.transitionContainer} style={{ zIndex: 99 }}>
                <div ref={labelRef} className={styles.label}>
                    • {label}
                </div>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path ref={path}></path>
                </svg>
            </div>
            {children}
        </>
    );
}
