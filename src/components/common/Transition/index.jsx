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

        // Transition Reset: Geometric Stability Blueprint
        // Using a solid rectangle for 100% stable movement (No Bezier Morphing)
        const rectanglePath = `M0,0 L100,0 L100,100 L0,100 Z`;

        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (container.current) {
                        gsap.set(container.current, { pointerEvents: "none" });
                    }
                }
            });

            // Master Set: Pin stability
            gsap.set(container.current, { 
                left: 0, 
                width: "100vw", 
                top: "100vh", 
                pointerEvents: "all" 
            });

            // Phase 1: Entry Sweep (Bottom -> 0)
            tl.set(path.current, { attr: { d: rectanglePath } })
              .set(labelRef.current, { opacity: 0, y: 50 })
              .set(".motion-wrapper", { y: 0 })
              
              .to(container.current, {
                  top: "0vh",
                  duration: 0.8,
                  ease: "power4.inOut"
              })
              
              // Phase 2: Label Reveal (Hold)
              .to(labelRef.current, {
                  opacity: 1,
                  y: 0,
                  duration: 0.4,
                  ease: "power4.out"
              }, "-=0.2")
              
              // Phase 3: Exit Sweep + Parallax Sync
              .to(labelRef.current, {
                  opacity: 0,
                  y: -50,
                  duration: 0.4,
                  ease: "power4.in",
                  delay: 0.2
              })
              .to(container.current, {
                  top: "-100vh",
                  duration: 0.8,
                  ease: "power4.inOut"
              })
              .fromTo(".motion-wrapper", 
                { y: "10vh" }, // Adjusted to user Blueprint
                {
                    y: 0,
                    duration: 0.8,
                    ease: "power4.inOut"
                }, "<"); 
        });

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
