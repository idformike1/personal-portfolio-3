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
        // Morphing from bottom to top
        const initialPath = `M0 100 Q50 100 100 100 L100 100 L0 100`;
        const curvePath = `M0 100 Q50 0 100 100 L100 100 L0 100`;
        const flatPath = `M0 100 Q50 100 100 100 L100 0 L0 0`;
        const exitCurvePath = `M0 0 Q50 100 100 0 L100 0 L0 0`; // Suction curve (bottom edge pulling up)

        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (container.current) {
                        gsap.set(container.current, { pointerEvents: "none" });
                    }
                }
            });

            // Entry Animation (Curtain Up)
            tl.set(container.current, { yPercent: 100, pointerEvents: "all" })
              .set(path.current, { attr: { d: initialPath } })
              .set(labelRef.current, { opacity: 0 })
              .to(container.current, {
                  yPercent: 0,
                  duration: 0.8,
                  ease: "power4.inOut"
              })
              .to(path.current, {
                  attr: { d: curvePath },
                  duration: 0.4,
                  ease: "power4.in"
              }, "<")
              .to(path.current, {
                  attr: { d: flatPath },
                  duration: 0.4,
                  ease: "power4.out"
              })
              .to(labelRef.current, {
                  opacity: 1,
                  duration: 0.3
              }, "-=0.2")
              
              // Hold & Exit (Curtain Continued Up)
              .to(labelRef.current, {
                  opacity: 0,
                  duration: 0.3,
                  delay: 0.5
              })
              .to(container.current, {
                  yPercent: -100,
                  duration: 0.8,
                  ease: "power4.inOut"
              })
              .to(path.current, {
                  attr: { d: exitCurvePath },
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
            <div ref={container} className={styles.transitionContainer}>
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
