'use client';
import styles from './Marquee.module.scss';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useLenis } from '@studio-freight/react-lenis';

export default function Marquee() {
  const container = useRef(null);
  const sliderWrapper = useRef(null);
  const marqueeTl = useRef(null);

  // Velocity-based timeScale — "elastic" speed surge on scroll
  useLenis(({ velocity }) => {
    if (marqueeTl.current) {
      const surge = 1 + Math.abs(velocity * 0.12);
      gsap.to(marqueeTl.current, {
        timeScale: surge,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          // Decay back to base speed
          gsap.to(marqueeTl.current, {
            timeScale: 1,
            duration: 1.2,
            ease: 'power3.out'
          });
        }
      });
    }
  });

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Start hidden below
      gsap.set(container.current, { yPercent: 100 });

      marqueeTl.current = gsap.timeline({
        repeat: -1,
        defaults: { ease: 'none' }
      });

      marqueeTl.current.to(sliderWrapper.current, {
        xPercent: -50,
        duration: 20,
      });

      // Reveal
      gsap.to(container.current, {
        yPercent: 0,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.3
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // Updated to match the original site identity
  const marqueeText = 'Dennis Snellenberg — ';

  return (
    <div ref={container} className={styles.marqueeContainer}>
      <div ref={sliderWrapper} className={styles.sliderWrapper}>
        {/* Four copies for seamless infinite loop */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.slider}>
            <p>{marqueeText}</p>
            <p>{marqueeText}</p>
            <p>{marqueeText}</p>
            <p>{marqueeText}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
