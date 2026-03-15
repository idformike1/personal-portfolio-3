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
    const windowRef = useRef(null);
    const image = useRef(null);
    const copyRef = useRef(null); 
    const textRef = useRef([]);

    useEffect(() => {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        let ctx = gsap.context(() => {
            // 1. Slow Image Parallax (Background Layer)
            // Targeting the 120% image to move within the 100vh mask
            gsap.to(image.current, {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // 2. Text 'Lift' (Forelayer Layer)
            // Displacement: -400px ensures it outruns the image as requested
            if (copyRef.current) {
                gsap.to(copyRef.current, {
                    y: -400, 
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true 
                    }
                });
            }

            // 3. Intro Text reveal
            if (textRef.current.length) {
                gsap.to(textRef.current, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: 'power3.out',
                    delay: 0.8 
                });
            }

            // Subtle vertical mouse inertia on image
            const iYTo = gsap.quickTo(image.current, 'y', { duration: 1.2, ease: 'power3.out' });
            const handleMouseMove = (e) => {
                const { clientY } = e;
                const { innerHeight: h } = window;
                const y = (clientY / h - 0.5);
                iYTo(y * -30);
            };

            window.addEventListener('mousemove', handleMouseMove);
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
            {/* 1. image-parallax-window (Z-Index: 10) */}
            <div ref={windowRef} className={styles.imageParallaxWindow}>
                <div className={styles.imageWrapper}>
                    <Image
                        ref={image}
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2000&auto=format&fit=crop"
                        fill={true}
                        alt="Hero Portrait"
                        priority={true}
                        quality={100}
                    />
                </div>
            </div>

            {/* 2. intro-text-wrapper (Z-Index: 50) */}
            <div className={styles.introTextWrapper}>
                <div ref={copyRef} className={styles.copy}>
                    <svg 
                        className={styles.svgArrow} 
                        width='40' 
                        height='40' 
                        viewBox='0 0 24 24' 
                        fill='none' 
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path 
                            d='M7 7L17 17M17 17V7M17 17H7' 
                            stroke='white' 
                            strokeWidth='2' 
                            strokeLinecap='round' 
                            strokeLinejoin='round'
                        />
                    </svg>
                    <span className={styles.lineMask}>
                        <p ref={addToRefs} className={styles.boldText}>Freelance</p>
                    </span>
                    <span className={styles.lineMask}>
                        <p ref={addToRefs}>Designer &amp; Developer</p>
                    </span>
                </div>
            </div>

            {/* 3. Infinite Marquee (Z-Index: 40) */}
            <InfiniteMarquee
                text="Sports — "
                speed={0.1}
                isTransitionComplete={true}
                className={styles.marqueePosition}
            />
        </section>
    );
}
