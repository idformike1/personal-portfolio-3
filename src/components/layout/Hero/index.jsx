'use client';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { useLenis } from '@studio-freight/react-lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './style.module.scss';
import InfiniteMarquee from '@/components/common/InfiniteMarquee';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const sectionRef = useRef(null);
    const image = useRef(null);
    const textRef = useRef([]);

    const globeRef = useRef(null);
    const globeTween = useRef(null);
    const hudRef = useRef(null);

    // Kinetic Engine: Link 8s globe spin to scroll velocity
    useLenis((lenis) => {
        if (globeTween.current) {
            // Formula: Math.abs(velocity) * 0.1
            const velocity = lenis.velocity;
            const targetScale = Math.abs(velocity) * 0.1;
            gsap.to(globeTween.current, { timeScale: targetScale, duration: 0.5 });
        }
    });

    useEffect(() => {
        const handleLoad = () => ScrollTrigger.refresh();
        window.addEventListener('load', handleLoad);

        if (window.matchMedia('(pointer: coarse)').matches) return;

        let ctx = gsap.context(() => {
            // 1. Slow Image Parallax
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

            // 2. HUD Middle Parallax Lift
            if (hudRef.current) {
                gsap.to(hudRef.current, {
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

            // Kinetic Spin Initialization
            if (globeRef.current) {
                globeTween.current = gsap.to(globeRef.current, {
                    rotation: 360,
                    duration: 8,
                    repeat: -1,
                    ease: "none"
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
            
            // 4. Parallax Force-Trigger
            ScrollTrigger.refresh(true);
            
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('load', handleLoad);
            };
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
            {/* 1. image-parallax-window (Z-Index: 1) */}
            <div className={styles.imageParallaxWindow}>
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

            {/* 2. Unified Hero HUD (Z-Index: 100) */}
            <div ref={hudRef} className={styles.heroHud}>
                {/* Location Pill (Left HUD) */}
                <div className={styles.locationPill}>
                    <span>Located in the <br/> Netherlands</span>
                    <div className={styles.globeIcon}>
                        <svg 
                            ref={globeRef}
                            className={styles.globeSvg}
                            width="20" height="20" viewBox="0 0 24 24" 
                            fill="none" stroke="currentColor" strokeWidth="1.5"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                    </div>
                </div>

                {/* Freelance Group (Right HUD) */}
                <div className={styles.copy}>
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

            {/* 3. Infinite Marquee (Z-Index: 10) */}
            <InfiniteMarquee
                text="Sports — "
                speed={0.1}
                isTransitionComplete={true}
                className={styles.marqueePosition}
            />
        </section>
    );
}
