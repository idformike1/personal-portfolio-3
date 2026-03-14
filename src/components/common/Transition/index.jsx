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

        // High-Fidelity Path Morphs (Snellenberg Spec)
        // Entry Dome: M0 100 Q50 -50 100 100 L100 200 L0 200 Z -> flat
        const initialPath = `M0 100 Q50 -50 100 100 L100 200 L0 200 Z`;
        const targetPath = `M0 0 Q50 0 100 0 L100 200 L0 200 Z`;
        
        // Exit Suction: Bottom edge pulls up
        const exitPath = `M0 0 Q50 0 100 0 L100 100 Q50 -50 0 100 Z`;

        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (container.current) {
                        gsap.set(container.current, { pointerEvents: "none" });
                    }
                }
            });

            // Phase 1: Entry (Bottom -> 0)
            tl.set(container.current, { top: "100vh", pointerEvents: "all" })
              .set(path.current, { attr: { d: initialPath } })
              .set(labelRef.current, { opacity: 0, y: 50 })
              .set(pageContentRef.current, { y: 0 })
              
              .to(container.current, {
                  top: "0vh",
                  duration: 0.8,
                  ease: "power4.inOut"
              })
              .to(path.current, {
                  attr: { d: targetPath },
                  duration: 0.8,
                  ease: "power4.inOut"
              }, "<")
              
              // Phase 2: Label Reveal (Hold)
              .to(labelRef.current, {
                  opacity: 1,
                  y: 0,
                  duration: 0.4,
                  ease: "power4.out"
              }, "-=0.2")
              
              // Phase 3: Exit (0 -> Top)
              .to(labelRef.current, {
                  opacity: 0,
                  y: -50,
                  duration: 0.4,
                  ease: "power4.in",
                  delay: 0.5
              })
              .to(container.current, {
                  top: "-100vh",
                  duration: 0.8,
                  ease: "power4.inOut"
              })
              .to(path.current, {
                  attr: { d: exitPath },
                  duration: 0.8,
                  ease: "power4.inOut"
              }, "<")
              .fromTo(pageContentRef.current, 
                { y: "20vh" },
                {
                    y: 0,
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
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    <path ref={path}></path>
                </svg>
            </div>
            <div ref={pageContentRef}>
                {children}
            </div>
        </>
    );
}
