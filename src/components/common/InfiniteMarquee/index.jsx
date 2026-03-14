'use client';
import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import styles from './style.module.scss';

const InfiniteMarquee = forwardRef(({ 
    text = "", 
    speed = 20, 
    isTransitionComplete = false,
    className = "" 
}, ref) => {
    const container = useRef(null);
    const sliderWrapper = useRef(null);
    const timeline = useRef(null);

    // Expose velocity control to parent
    useImperativeHandle(ref, () => ({
        updateVelocity: (velocity) => {
            if (timeline.current) {
                gsap.to(timeline.current, {
                    timeScale: 1 + Math.abs(velocity * 0.1),
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        }
    }));

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Twin-track loop logic
            // We use xPercent: -100 on the wrapper containing two identical tracks
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

    // Handle "Blind Mount" - play only when transition is complete
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
                {/* Duplicate track for seamless looping */}
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
