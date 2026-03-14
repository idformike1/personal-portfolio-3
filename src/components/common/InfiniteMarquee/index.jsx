import { useRef, useEffect, forwardRef } from 'react';
import gsap from 'gsap';
import styles from './style.module.scss';
import useVelocitySync from '@/hooks/useVelocitySync';

const InfiniteMarquee = forwardRef(({ 
    text = "", 
    speed = 20, 
    isTransitionComplete = false,
    className = "" 
}, ref) => {
    const container = useRef(null);
    const sliderWrapper = useRef(null);
    const timeline = useRef(null);

    // Advanced Velocity Integration via Hook
    useVelocitySync(timeline, 1, 10);

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

    // Stage 2 Blind Mount Protocol: Play only when transition is complete
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
                {/* Duplicate track for seamless 0 to -100% loop */}
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
