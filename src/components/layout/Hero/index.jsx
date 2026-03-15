'use client';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './style.module.scss';
import InfiniteMarquee from '@/components/common/InfiniteMarquee';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const sectionRef = useRef(null);
    const container = useRef(null);
    const image = useRef(null);
    const copyRef = useRef(null);
    const textRef = useRef([]);

    useEffect(() => {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        let ctx = gsap.context(() => {
            // 1. Vertical-Only Image Parallax (ScrollTrigger)
            gsap.to(image.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                },
                yPercent: 15,
                ease: 'none'
            });
            gsap.set(image.current, { yPercent: -15 });

            // 2. Vertical-Only Mouse Inertia
            const cYTo = gsap.quickTo(container.current, 'y', { duration: 0.8, ease: 'power3.out' });
            const iYTo = gsap.quickTo(image.current, 'y', { duration: 1.2, ease: 'power3.out' });

            const handleMouseMove = (e) => {
                const { clientY } = e;
                const { innerHeight: h } = window;
                const y = (clientY / h - 0.5);

                cYTo(y * 15);
                iYTo(y * -40);
            };

            window.addEventListener('mousemove', handleMouseMove);

            // 3. Intro Text Animation - Slide up (On Mount)
            gsap.to(textRef.current, {
                y: '0%',
                duration: 0.8,
                stagger: 0.1,
                ease: 'power4.out',
                delay: 0.5
            });

            // 4. Dedicated 'Lift' Parallax for Intro Text Wrapper
            // Moves -200px upward with a scrub: 1 for lighter feel
            gsap.to(copyRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                },
                y: -200,
                ease: 'none'
            });

            return () => window.removeEventListener('mousemove', handleMouseMove);
        });

        return () => ctx.revert();
    }, []);

    const addToRefs = (el) => {
        if (el && !textRef.current.includes(el)) {
            textRef.current.push(el);
        }
    };

    return (
        <section ref={sectionRef} id="hero" className={styles.hero}>
            {/* Background portrait */}
            <div className={styles.background}>
                <div ref={container} className={styles.imageWrapper}>
                    <Image
                        ref={image}
                        src="/images/hero_portrait.png"
                        fill={true}
                        alt="Hero Portrait"
                        priority={true}
                        quality={100}
                    />
                </div>
            </div>

            {/* Subtitle — Structural sibling for selectability */}
            <div ref={copyRef} id="hero-title" className={styles.copy}>
                <span className={styles.lineMask}>
                    <p ref={addToRefs} className={styles.boldText}>Freelance</p>
                </span>
                <span className={styles.lineMask}>
                    <p ref={addToRefs}>Designer &amp; Developer</p>
                </span>
            </div>

            {/* The ONE marquee — sits at the bottom edge */}
            <InfiniteMarquee
                text="Sports — "
                speed={0.1}
                isTransitionComplete={true}
                className={styles.marqueePosition}
            />
        </section>
    );
}
