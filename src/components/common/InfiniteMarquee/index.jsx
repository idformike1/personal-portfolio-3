import { useRef, useEffect, forwardRef } from 'react';
import gsap from 'gsap';
import { useLenis } from '@studio-freight/react-lenis';
import styles from './style.module.scss';

const InfiniteMarquee = forwardRef(({ 
    text = '', 
    speed = 0.05, // Base speed multiplier
    isTransitionComplete = false,
    className = '' 
}, ref) => {
    const container = useRef(null);
    const sliderWrapper = useRef(null);
    const xPercent = useRef(0);
    const direction = useRef(-1); // -1 for left, 1 for right

    // Use Lenis to detect direction and boost speed
    useLenis(({ velocity, direction: scrollDirection }) => {
        if (scrollDirection !== 0) {
            // Scroll Down (1) -> Move Left (-1)
            // Scroll Up (-1) -> Move Right (1)
            direction.current = scrollDirection === 1 ? -1 : 1;
        }
        
        // Boost xPercent based on velocity
        const velocityBoost = Math.abs(velocity) * 0.1;
        xPercent.current += direction.current * velocityBoost;
    });

    useEffect(() => {
        if (!isTransitionComplete) return;

        let animationId;
        const animate = () => {
            // Base constant movement
            xPercent.current += direction.current * speed;

            // Seamless wrap at -50% and 0%
            if (xPercent.current <= -50) {
                xPercent.current = 0;
            } else if (xPercent.current > 0) {
                xPercent.current = -50;
            }

            if (sliderWrapper.current) {
                gsap.set(sliderWrapper.current, { xPercent: xPercent.current });
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationId);
    }, [isTransitionComplete, speed]);

    return (
        <div
            id="marquee-container"
            ref={container}
            className={`${styles.marqueeContainer} ${className}`}
        >
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
});

InfiniteMarquee.displayName = 'InfiniteMarquee';

export default InfiniteMarquee;
