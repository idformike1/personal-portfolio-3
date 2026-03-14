'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';

export default function Transition({children}) {
    const [isMounted, setIsMounted] = useState(false);
    const path = useRef(null);
    const container = useRef(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || !container.current || !path.current) return;

        const height = window.innerHeight;
        const width = window.innerWidth;
        const curveHeight = 300;

        const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width/2} ${height + curveHeight} 0 ${height} L0 0`;
        const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${width/2} ${height} 0 ${height} L0 0`;

        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (container.current) {
                        gsap.set(container.current, { pointerEvents: "none" });
                    }
                }
            });

            tl.set(path.current, { attr: { d: initialPath } })
              .to(container.current, {
                  yPercent: -100,
                  duration: 0.8,
                  ease: "power4.inOut",
                  delay: 0.2
              })
              .to(path.current, {
                  attr: { d: targetPath },
                  duration: 0.8,
                  ease: "power4.inOut"
              }, "<");
        }, container);

        return () => ctx.revert();
    }, [isMounted]);

    if (!isMounted) return null;

    return (
        <>
            <div ref={container} className={styles.transitionContainer}>
                <svg>
                    <path ref={path}></path>
                </svg>
            </div>
            {children}
        </>
    );
}
