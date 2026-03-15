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
    const [isContentVisible, setIsContentVisible] = useState(false);
    const path = useRef(null);
    const container = useRef(null);
    const labelRef = useRef(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useLayoutEffect(() => {
        if (!isMounted || !container.current || !path.current || !labelRef.current) return;

        // Session Gating: Skip animation on initial website load
        const isInitialLoad = typeof window !== "undefined" && !sessionStorage.getItem("visited");
        if (isInitialLoad) {
            setIsContentVisible(true);
            sessionStorage.setItem("visited", "true");
            gsap.set(container.current, { top: "-100vh", pointerEvents: "none", visibility: "hidden" });
            gsap.set(path.current, { attr: { d: "" } });
            return;
        }

        // Snellenberg Engine V3: 5-Point Node Dictionary (M, Q, L, L, Z)
        const pathA = `M0,100 Q50,-50 100,100 L100,100 L0,100 Z`; // Entry Dome
        const pathB = `M0,100 Q50,100 100,100 L100,0 L0,0 Z`;    // Flat / Hold
        const pathC = `M0,0 Q50,150 100,0 L100,0 L0,0 Z`;      // Exit Suction

        let ctx = gsap.context(() => {
            if (!container.current || !path.current || !labelRef.current) return;

            const tl = gsap.timeline({
                onComplete: () => {
                    if (container.current && path.current) {
                        // FIX: Explicitly clear the path and hide to prevent crescent glitch
                        gsap.set(path.current, { attr: { d: "" } });
                        gsap.set(container.current, { pointerEvents: "none", visibility: "hidden" });
                    }
                }
            });

            // Phase 1: Entry Sweep (Bottom -> 0)
            tl.set(container.current, { top: "100vh", pointerEvents: "auto", visibility: "visible" })
              .call(() => setIsContentVisible(false))
              .set(path.current, { attr: { d: pathA } })
              .set(labelRef.current, { opacity: 0, y: 50 })
              
              .to(container.current, {
                  top: 0,
                  duration: 0.8,
                  ease: "power4.inOut"
              })

              // Phase 2: Hold & Content Swap
              .to(path.current, {
                  attr: { d: pathB },
                  duration: 0.4,
                  ease: "power4.inOut"
              })
              .call(() => setIsContentVisible(true), null, "+=0.1") 
              .to(labelRef.current, {
                  opacity: 1,
                  y: 0,
                  duration: 0.3,
                  ease: "back.out(1.7)"
              }, "-=0.1")
              
              // Phase 3: Exit Sweep & Parallax Sync
              .to(labelRef.current, {
                  opacity: 0,
                  y: -50,
                  duration: 0.4,
                  ease: "power4.in",
                  delay: 0.3 
              })
              .to(container.current, {
                  top: "-100vh",
                  duration: 0.8,
                  ease: "power4.inOut"
              })
              .to(path.current, {
                  attr: { d: pathC },
                  duration: 0.8,
                  ease: "power4.inOut"
              }, "<")
              .fromTo(".page-wrapper", 
                { y: "20vh" },
                {
                    y: 0,
                    duration: 0.8,
                    ease: "power4.inOut"
                }, "<"); 
        });

            const safetyTimeout = setTimeout(() => {
                if (!isContentVisible) {
                    setIsContentVisible(true);
                    if (container.current) {
                        gsap.set(container.current, { top: "-100vh", pointerEvents: "none", visibility: "hidden" });
                    }
                }
            }, 2000);

            return () => {
                ctx.revert();
                clearTimeout(safetyTimeout);
            };
        }, [isMounted, pathname]);

    if (!isMounted) return null;

    const label = routes[pathname] || "Home";

    return (
        <>
            <div ref={container} className={styles.transitionContainer} style={{ pointerEvents: 'none' }}>
                <div ref={labelRef} className={styles.label}>
                    • {label}
                </div>
                <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path ref={path}></path>
                </svg>
            </div>
            
            {!isContentVisible && <div className={styles.blackFiller} />}
            
            <div className={`page-wrapper ${!isContentVisible ? 'hidden' : ''}`}>
                {children}
            </div>
        </>
    );
}
