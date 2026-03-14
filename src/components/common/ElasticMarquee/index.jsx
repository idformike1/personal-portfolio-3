'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useLenis } from '@studio-freight/react-lenis';
import styles from './style.module.scss';

export default function ElasticMarquee({ 
    text = "", 
    speed = 20, 
    isTransitionComplete = false,
    className = "" 
}) {
    const container = useRef(null);
    const sliderWrapper = useRef(null);
    const timeline = useRef(null);

    // Physical Momentum Logic: Surge & Decay
    useLenis(({ velocity }) => {
        if (timeline.current) {
            // Absolute velocity mapping for surge
            const surge = 1 + Math.abs(velocity * 0.15);
            
            // Immediately apply surge and start a physical decay
            // duration: 1.2s creates the "heavy" weight effect
            gsap.to(timeline.current, {
                timeScale: surge,
                duration: 0.3, // Fast surge response
                ease: "power2.out",
                onComplete: () => {
                    // Decay back to base speed
                    gsap.to(timeline.current, {
                        timeScale: 1,
                        duration: 1.2,
                        ease: "power3.out"
                    });
                }
            });
        }
    });

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Twin-track loop architecture: 0% -> -100%
            gsap.set(sliderWrapper.current, { xPercent: 0 });

            timeline.current = gsap.timeline({
                repeat: -1,
                defaults: { ease: "none" },
                paused: !isTransitionComplete
            });

            timeline.current.to(sliderWrapper.current, {
                xPercent: -100,
                duration: speed,
            });
        }, container);

        return () => ctx.revert();
    }, [speed, isTransitionComplete]);

    // Transition Guard
    useEffect(() => {
        if (isTransitionComplete && timeline.current) {
            timeline.current.play();
        }
    }, [isTransitionComplete]);

    return (
        <div ref={container} className={`${styles.marqueeContainer} ${className}`}>
            <div ref={sliderWrapper} className={styles.sliderWrapper}>
                <div className={styles.slider}>
                    <p>{text}</p>
                    <p>{text}</p>
                    <p>{text}</p>
                    <p>{text}</p>
                </div>
                <div className={styles.slider}>
                    <p>{text}</p>
                    <p>{text}</p>
                    <p>{text}</p>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    );
}
