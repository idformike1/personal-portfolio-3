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

        // Master Node Symmetry: Strict M-L-L-Q-Z Blueprint (viewBox 0 0 100 100)
        // Format: M (bottom-left) L (bottom-right) L (top-right) Q (top-mid) (top-left) Z
        
        // Start: Flat line at the very bottom
        const initialPath = `M0,100 L100,100 L100,100 Q50,100 0,100 Z`;
        
        // Transition 1 -> 2: Entry Dome
        const domePath = `M0,100 L100,100 L100,0 Q50,-50 0,0 Z`;
        
        // State 2: Hold (Zeroed Flat curve) - Essential for non-snapping morphs
        const targetPath = `M0,100 L100,100 L100,0 Q50,0 0,0 Z`;
        
        // Transition 2 -> 3: Exit Suction
        const exitPath = `M0,100 L100,100 L100,100 Q50,150 0,100 Z`;

        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (container.current) {
                        gsap.set(container.current, { pointerEvents: "none" });
                    }
                }
            });

            // master set: pin container to left:0, width:100vw to kill diagonal wedge
            gsap.set(container.current, { 
                left: 0, 
                width: "100vw", 
                top: "100vh", 
                pointerEvents: "all" 
            });

            // Phase 1: Entry (Vertical Sweep + Dome)
            tl.set(path.current, { attr: { d: initialPath } })
              .set(labelRef.current, { opacity: 0, y: 50 })
              .set(".motion-wrapper", { y: 0 })
              
              .to(container.current, {
                  top: "0vh",
                  duration: 0.8,
                  ease: "power4.inOut"
              })
              .to(path.current, {
                  attr: { d: domePath },
                  duration: 0.4,
                  ease: "power4.out"
              }, "<")
              .to(path.current, {
                  attr: { d: targetPath },
                  duration: 0.4,
                  ease: "power4.in"
              })
              
              // Phase 2: Label Reveal (Hold)
              .to(labelRef.current, {
                  opacity: 1,
                  y: 0,
                  duration: 0.4,
                  ease: "power4.out"
              }, "-=0.2")
              
              // Phase 3: Exit Suction + Parallax Sync
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
              .to(path.current, {
                  attr: { d: exitPath },
                  duration: 0.8,
                  ease: "power4.inOut"
              }, "<")
              .fromTo(".motion-wrapper", 
                { y: "15vh" },
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
