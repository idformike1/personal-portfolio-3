'use client';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './style.module.scss';
import InfiniteMarquee from '@/components/common/InfiniteMarquee';
import { useLenis } from '@studio-freight/react-lenis';

export default function Hero() {
    const background = useRef(null);
    const image = useRef(null);
    const marqueeRef = useRef(null);

    useEffect(() => {
        // Mobile Guard: Disable parallax on touch devices
        if (window.matchMedia("(pointer: coarse)").matches) return;

        let ctx = gsap.context(() => {
            const xTo = gsap.quickTo(image.current, "x", { duration: 1.2, ease: "power3.out" });
            const yTo = gsap.quickTo(image.current, "y", { duration: 1.2, ease: "power3.out" });

            const handleMouseMove = (e) => {
                const { clientX, clientY } = e;
                const { width, height } = window;
                
                // Calculate distance from center (normalized -1 to 1)
                const x = (clientX / width - 0.5) * 2;
                const y = (clientY / height - 0.5) * 2;

                // Inverse movement: mouse Right -> image Left (multiplier 50 for depth)
                xTo(x * -50);
                yTo(y * -50);
            };

            window.addEventListener("mousemove", handleMouseMove);

            return () => window.removeEventListener("mousemove", handleMouseMove);
        });

        return () => ctx.revert();
    }, []);

    return (
        <section className={styles.hero}>
            <div ref={background} className={styles.background}>
                <Image 
                    ref={image}
                    src="/images/hero_portrait.png"
                    fill={true}
                    alt="Hero Portrait"
                    priority={true}
                    quality={100}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.copy}>
                    <p>Independent</p>
                    <p>Designer & Developer</p>
                </div>
            </div>
            <InfiniteMarquee 
                ref={marqueeRef}
                text="Dennis Snellenberg —" 
                speed={20}
                isTransitionComplete={true} 
                className={styles.marqueePosition}
            />
        </section>
    );
}
