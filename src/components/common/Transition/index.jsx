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
    const pageContentRef = useRef(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useLayoutEffect(() => {
        if (!isMounted || !container.current || !path.current) return;

        // Corrected Physics for 100x100 ViewBox
        // initialCurve: Dome effect (Q point has negative Y to push UP)
        const initialCurve = `M0 100 Q50 -50 100 100 L100 100 L0 100`; 
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

            // Stage 1: Entry Sweep (The Dome)
            tl.set(container.current, { yPercent: 100, pointerEvents: "all" })
              .set(path.current, { attr: { d: initialCurve } })
              .set(labelRef.current, { opacity: 0, y: 50 })
              .set(pageContentRef.current, { y: 0 }) // Content is static at start
              
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
              
              // Stage 2: Label Reveal (Hold)
              .to(labelRef.current, {
                  opacity: 1,
                  y: 0,
                  duration: 0.4,
                  ease: "power4.out"
              }, "-=0.2")
              
              // Stage 3: Exit Sweep + Parallax Sync
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
              }, "<")
              .fromTo(pageContentRef.current, 
                { y: "20vh" },
                {
                    y: 0,
                    duration: 0.8,
                    ease: "power4.inOut"
                }, "<"); // Perfect Parallax Sync
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
            <div ref={pageContentRef}>
                {children}
            </div>
        </>
    );
}
