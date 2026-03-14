import { useRef, useEffect, forwardRef } from 'react';
import gsap from 'gsap';
import styles from './style.module.scss';
import useVelocitySync from '@/hooks/useVelocitySync';

/**
 * InfiniteMarquee — Single-source scrolling text.
 * Architecture: 2 tracks, each exactly 100% of the container width.
 * We animate xPercent from 0 → -50% (not -100%) so that when track 1
 * exits left, track 2 seamlessly takes its place. Then it resets to 0.
 * 
 * DOM structure:
 *   sliderWrapper (width: 200%)
 *     track-1 (width: 50% of wrapper = 100vw) — repeated text
 *     track-2 (width: 50% of wrapper = 100vw) — identical repeated text
 * 
 * Animation: xPercent 0 → -50 → (instant reset to 0) → repeat
 * This is the correct twin-track architecture.
 */
const InfiniteMarquee = forwardRef(({ 
    text = '', 
    speed = 20, 
    isTransitionComplete = false,
    className = '' 
}, ref) => {
    const container = useRef(null);
    const sliderWrapper = useRef(null);
    const timeline = useRef(null);

    // Elastic velocity surge on scroll
    useVelocitySync(timeline, 1, 8);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.set(sliderWrapper.current, { xPercent: 0 });

            timeline.current = gsap.timeline({
                repeat: -1,
                defaults: { ease: 'none' },
                paused: !isTransitionComplete
            });

            // Animate exactly -50%: moves one full track-width to the left,
            // then GSAP's repeat resets back to 0 seamlessly.
            timeline.current.to(sliderWrapper.current, {
                xPercent: -50,
                duration: speed,
            });
        }, container);

        return () => ctx.revert();
    }, [speed, isTransitionComplete]);

    useEffect(() => {
        if (isTransitionComplete && timeline.current) {
            timeline.current.play();
        }
    }, [isTransitionComplete]);

    return (
        <div
            id="marquee-container"
            ref={container}
            className={`${styles.marqueeContainer} ${className}`}
        >
            <div ref={sliderWrapper} className={styles.sliderWrapper}>
                {/* Track 1 */}
                <div className={styles.slider}>
                    <p>{text}</p>
                    <p>{text}</p>
                    <p>{text}</p>
                    <p>{text}</p>
                </div>
                {/* Track 2 — identical, creates seamless loop */}
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
