'use client';
import { useEffect, useRef } from 'react';
import styles from './style.module.scss';
import gsap from 'gsap';

export default function Cursor() {
    const cursor = useRef(null);

    useEffect(() => {
        const cEl = cursor.current;
        if (!cEl) return;

        const xTo = gsap.quickTo(cEl, "left", { duration: 0.45, ease: "power3" });
        const yTo = gsap.quickTo(cEl, "top", { duration: 0.45, ease: "power3" });

        const moveCursor = (e) => {
            const { clientX, clientY } = e;
            xTo(clientX);
            yTo(clientY);
        };

        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    return (
        <div ref={cursor} className={styles.cursorContainer}>
            <div className={styles.follower}></div>
        </div>
    );
}
