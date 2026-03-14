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

        // Corrected Physics based on User Directive (0 to 100 scale)
        // initialCurve: Dome effect (Q point has negative Y to push UP outside viewBox)
        const initialCurve = `M 0 0 Q 50 -100 100 0 L 100 100 L 0 100 Z`; 
        const flatPath = `M 0 0 Q 50 0 100 0 L 100 100 L 0 100 Z`;
        const suctionCurve = `M 0 0 Q 50 100 100 0 L 100 0 L 0 0 Z`;

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
              .set(pageContentRef.current, { y: 0 })
              
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
