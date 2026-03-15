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
    const direction = useRef(-1); // Default constant direction
    const velocity = useRef(0);

    // Capture Lenis state for the physics loop
    useLenis((lenis) => {
        velocity.current = lenis.velocity;
        if (lenis.direction !== 0) {
            // Mapping: Down (1) to Left (-1), Up (-1) to Right (1)
            direction.current = lenis.direction === 1 ? -1 : 1;
        }
    });

    useEffect(() => {
        if (!isTransitionComplete) return;

        let animationId;
        const animate = () => {
            // STRICT PHYSICS: currentX += (baseSpeed + Math.abs(velocity)) * direction
            const moveDelta = (speed + Math.abs(velocity.current) * 0.05) * direction.current;
            xPercent.current += moveDelta;

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
