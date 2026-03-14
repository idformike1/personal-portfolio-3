'use client';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import styles from './style.module.scss';
import InfiniteMarquee from '@/components/common/InfiniteMarquee';

export default function Hero() {
    const background = useRef(null);
    const image = useRef(null);

    // Mouse parallax on the portrait — inverse movement for depth
    useEffect(() => {
        // Mobile guard: disable parallax on touch
        if (window.matchMedia('(pointer: coarse)').matches) return;

        let ctx = gsap.context(() => {
            const xTo = gsap.quickTo(image.current, 'x', { duration: 1.2, ease: 'power3.out' });
            const yTo = gsap.quickTo(image.current, 'y', { duration: 1.2, ease: 'power3.out' });

            const handleMouseMove = (e) => {
                const { clientX, clientY } = e;
                const { innerWidth: w, innerHeight: h } = window;
                const x = (clientX / w - 0.5) * 2;
                const y = (clientY / h - 0.5) * 2;
                xTo(x * -40);
                yTo(y * -40);
            };

            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        });

        return () => ctx.revert();
    }, []);

    return (
        <section id="hero" className={styles.hero}>
            {/* Background portrait */}
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

            {/* Subtitle — positioned bottom-right, sentence case */}
            <div className={styles.content}>
                <div id="hero-title" className={styles.copy}>
                    <p>Freelance</p>
                    <p>Designer &amp; Developer</p>
                </div>
            </div>

            {/* The ONE marquee — sits at the bottom edge of the hero */}
            <InfiniteMarquee
                text="Dennis Snellenberg — "
                speed={20}
                isTransitionComplete={true}
                className={styles.marqueePosition}
            />
        </section>
    );
}
