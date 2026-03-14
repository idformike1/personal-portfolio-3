'use client';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './style.module.scss';
import InfiniteMarquee from '@/components/common/InfiniteMarquee';

export default function Hero() {
    const sectionRef = useRef(null);
    const background = useRef(null);
    const image = useRef(null);
    const copy = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
            // 1. Mouse Parallax (existing functionality)
            if (!window.matchMedia('(pointer: coarse)').matches) {
                const xTo = gsap.quickTo(image.current, 'x', { duration: 1.2, ease: 'power3.out' });
                const yTo = gsap.quickTo(image.current, 'y', { duration: 1.2, ease: 'power3.out' });

                const handleMouseMove = (e) => {
                    const { clientX, clientY } = e;
                    const { innerWidth: w, innerHeight: h } = window;
                    const x = (clientX / w - 0.5) * 2;
                    const y = (clientY / h - 0.5) * 2;
                    xTo(x * -20); // Reduced for subtler mix with scroll
                    yTo(y * -20);
                };
                window.addEventListener('mousemove', handleMouseMove);
                return () => window.removeEventListener('mousemove', handleMouseMove);
            }
        });

        // 2. Scroll Parallax (New requirements)
        // Image "fixed" feel — it move slightly slower than the scroll
        gsap.to(image.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
            y: 150, // Parallax movement
            ease: "none"
        });

        // Copy text parallax — moves up faster to create depth
        gsap.to(copy.current, {
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
            y: -150,
            ease: "none"
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} id="hero" className={styles.hero}>
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

            {/* Subtitle — positioned higher, paragraph layout */}
            <div className={styles.content}>
                <div ref={copy} id="hero-title" className={styles.copy}>
                    <p>Freelance</p>
                    <p>Designer &amp; Developer</p>
                </div>
            </div>

            {/* The ONE marquee — sits at the bottom edge */}
            <InfiniteMarquee
                text="Sports — "
                speed={20}
                isTransitionComplete={true}
                className={styles.marqueePosition}
            />
        </section>
    );
}
